/**
 * IMMAGINI SEGNAPOSTO
 * ===================
 *
 *   SITE_ID=nerbona npm run media:placeholders
 *
 * Crea un'immagine per ogni file citato dalla configurazione ma non ancora
 * presente. Serve a poter navigare e mostrare una demo mentre si aspettano le
 * fotografie vere.
 *
 * I segnaposto sono volutamente riconoscibili: fondo pieno nei colori del
 * tema, il nome del file al centro e la scritta "foto in arrivo". Chi guarda
 * capisce subito che manca qualcosa, invece di pensare che il sito sia rotto.
 *
 * Non sovrascrive mai un'immagine vera: quando arrivano le foto definitive,
 * `npm run media:prepare` le mette al loro posto e i segnaposto spariscono.
 * Per ripulirli in un colpo solo:
 *
 *   SITE_ID=nerbona npm run media:placeholders -- --clean
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("\nServe la libreria sharp:\n\n  npm install --save-dev sharp\n");
  process.exit(1);
}

const id = process.env.SITE_ID;
if (!id) {
  console.error("\nUso: SITE_ID=<cliente> npm run media:placeholders\n");
  process.exit(1);
}

const mediaDir = path.join("public", "tenants", id);
const marker = ".placeholder";

/* --- pulizia ------------------------------------------------------ */

if (process.argv.includes("--clean")) {
  let removed = 0;
  const sweep = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) sweep(full);
      else if (fs.existsSync(full + marker)) {
        fs.rmSync(full);
        fs.rmSync(full + marker);
        removed++;
      }
    }
  };
  sweep(mediaDir);
  console.log(`\n${removed} segnaposto rimossi.\n`);
  process.exit(0);
}

/* --- quali file mancano ------------------------------------------- */

/* Riusa la validazione, che sa già leggere la configurazione TypeScript e
   produce l'elenco dei file mancanti. */
spawnSync(process.execPath, ["scripts/validate.mjs"], {
  env: { ...process.env, SITE_ID: id },
  stdio: "ignore",
});

const listPath = path.join("prospects", id, "foto-mancanti.txt");
if (!fs.existsSync(listPath)) {
  console.log("\nNessun file mancante: tutti i media sono già al loro posto.\n");
  process.exit(0);
}

/* Ricostruisce i percorsi dal file prodotto dalla validazione. */
const missing = [];
let folder = "";
for (const line of fs.readFileSync(listPath, "utf8").split("\n")) {
  if (/^\S.*\/$/.test(line)) folder = line.trim().replace(/\/$/, "");
  else if (/^\s{2}\S/.test(line)) {
    const name = line.trim();
    missing.push(folder === "." ? name : `${folder}/${name}`);
  }
}

if (!missing.length) {
  console.log("\nNessun file mancante.\n");
  process.exit(0);
}

/* --- proporzioni per contesto ------------------------------------- */

/* Ogni posizione nel layout ha un ritaglio diverso: usare le proporzioni
   giuste evita che il segnaposto sembri deformato. */
const SHAPES = {
  video: [1600, 900],
  estate: [1600, 1100],
  experiences: [1600, 1000],
  trail: [1400, 1000],
  contact: [1200, 1500],
  stays: [1400, 1000],
  default: [1400, 1000],
};

/* Palette del tema: i segnaposto restano coerenti col resto del sito. */
const PALETTE = [
  ["#17231c", "#c8db9a"],
  ["#183026", "#f2eee4"],
  ["#243b30", "#d5e4a6"],
  ["#1d2f25", "#e8eadb"],
];

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let created = 0;

for (const [index, relative] of missing.entries()) {
  const target = path.join(mediaDir, relative);
  if (fs.existsSync(target)) continue;

  const folderName = relative.includes("/") ? relative.split("/")[0] : "default";
  const [width, height] = SHAPES[folderName] ?? SHAPES.default;
  const [background, ink] = PALETTE[index % PALETTE.length];

  const label = path.basename(relative).replace(/\.\w+$/, "");
  const isLogo = /logo/i.test(relative);

  const svg = isLogo
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
         <rect width="400" height="400" rx="200" fill="${background}"/>
         <text x="200" y="222" font-family="Georgia, serif" font-size="150"
               fill="${ink}" text-anchor="middle">${escape(id[0].toUpperCase())}</text>
       </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
         <rect width="${width}" height="${height}" fill="${background}"/>
         <g fill="${ink}" text-anchor="middle" opacity="0.92">
           <text x="${width / 2}" y="${height / 2 - 10}"
                 font-family="Georgia, serif" font-size="${Math.round(width / 26)}">
             ${escape(label)}
           </text>
           <text x="${width / 2}" y="${height / 2 + Math.round(width / 30)}"
                 font-family="Arial, Helvetica, sans-serif"
                 font-size="${Math.round(width / 68)}"
                 letter-spacing="${Math.round(width / 240)}" opacity="0.55">
             FOTO IN ARRIVO
           </text>
         </g>
         <rect x="${width * 0.06}" y="${height * 0.08}"
               width="${width * 0.88}" height="${height * 0.84}"
               fill="none" stroke="${ink}" stroke-opacity="0.22"
               stroke-dasharray="14 10"/>
       </svg>`;

  fs.mkdirSync(path.dirname(target), { recursive: true });

  const image = sharp(Buffer.from(svg));
  if (target.endsWith(".png")) await image.png().toFile(target);
  else await image.webp({ quality: 80 }).toFile(target);

  /* File gemello nascosto: serve a riconoscere i segnaposto e a poterli
     cancellare senza toccare le foto vere. */
  fs.writeFileSync(target + marker, "");
  created++;
}

const bytes = missing.reduce((sum, rel) => {
  const f = path.join(mediaDir, rel);
  return sum + (fs.existsSync(f) ? fs.statSync(f).size : 0);
}, 0);

console.log(`
${created} segnaposto creati in ${mediaDir} (${Math.round(bytes / 1024)} KB in tutto).

Sono riconoscibili: fondo pieno e la scritta "foto in arrivo".
Quando arrivano le foto vere:

  SITE_ID=${id} npm run media:prepare              mette al loro posto le foto
  SITE_ID=${id} npm run media:placeholders -- --clean   toglie i segnaposto rimasti
`);
