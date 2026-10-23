/**
 * PREPARA I MEDIA DI UN CLIENTE
 * =============================
 *
 *   SITE_ID=nerbona npm run media:prepare
 *
 * Prende le immagini grezze da prospects/<id>/foto/ — qualsiasi formato,
 * qualsiasi dimensione, i nomi che avevano sul sito di origine — e le
 * converte in webp della misura giusta dentro public/tenants/<id>/.
 *
 * È la parte più noiosa dell'onboarding: una foto scaricata da un sito pesa
 * spesso 3-4 MB e ha proporzioni casuali, mentre questo layout vuole immagini
 * a tutto schermo leggere.
 *
 * Come organizzare prospects/<id>/foto/ prima di lanciarlo:
 *
 *   foto/
 *   ├── estate/          -> public/tenants/<id>/estate/
 *   ├── experiences/     -> public/tenants/<id>/experiences/
 *   ├── trail/           -> .../trail/
 *   ├── contact/         -> .../contact/
 *   └── stays/
 *       ├── villa-aia/   -> villa-aia-01.webp, villa-aia-02.webp, ...
 *       └── bilocale-1/  -> bilocale-1-01.webp, ...
 *
 * Dentro stays/ ogni sottocartella diventa una sistemazione, e le foto
 * vengono numerate in ordine alfabetico: rinominale prima con 1-, 2-, 3-
 * per decidere quale sarà la copertina.
 */
import fs from "node:fs";
import path from "node:path";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error(
    "\nServe la libreria sharp per convertire le immagini:\n\n" +
      "  npm install --save-dev sharp\n",
  );
  process.exit(1);
}

const id = process.env.SITE_ID;
if (!id) {
  console.error("\nUso: SITE_ID=<cliente> npm run media:prepare\n");
  process.exit(1);
}

const source = path.join("prospects", id, "foto");
const target = path.join("public", "tenants", id);

if (!fs.existsSync(source)) {
  console.error(`\nCartella non trovata: ${source}\nLancia prima: npm run new:tenant ${id}\n`);
  process.exit(1);
}

/* Larghezze massime per contesto. Le foto a tutto schermo hanno bisogno di
   più pixel; quelle piccole sovrapposte molto meno. */
const WIDTHS = {
  estate: 2200,
  experiences: 2000,
  trail: 2000,
  contact: 1800,
  stays: 1800,
  default: 1800,
};

const QUALITY = 82;
const INPUT = /\.(jpe?g|png|webp|avif|tiff?)$/i;

const converted = [];
const skipped = [];

async function convert(from, to, width) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const info = await sharp(from)
    .rotate() /* rispetta l'orientamento EXIF delle foto da fotocamera */
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(to);
  const before = fs.statSync(from).size;
  converted.push({ to, before, after: info.size });
}

/* --- sistemazioni: una sottocartella per alloggio ----------------- */

const staysDir = path.join(source, "stays");
if (fs.existsSync(staysDir)) {
  for (const entry of fs.readdirSync(staysDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const files = fs
      .readdirSync(path.join(staysDir, slug))
      .filter((f) => INPUT.test(f))
      .sort();

    if (!files.length) { skipped.push(`stays/${slug} (nessuna immagine)`); continue; }

    for (const [index, file] of files.entries()) {
      const number = String(index + 1).padStart(2, "0");
      await convert(
        path.join(staysDir, slug, file),
        path.join(target, "stays", `${slug}-${number}.webp`),
        WIDTHS.stays,
      );
    }
  }
}

/* --- altre cartelle: nome conservato ------------------------------ */

for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === "stays") continue;
  const folder = entry.name;
  const width = WIDTHS[folder] ?? WIDTHS.default;

  for (const file of fs.readdirSync(path.join(source, folder))) {
    if (!INPUT.test(file)) { skipped.push(`${folder}/${file}`); continue; }
    const name = file.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await convert(
      path.join(source, folder, file),
      path.join(target, folder, `${name}.webp`),
      width,
    );
  }
}

/* --- logo e file sciolti nella radice ----------------------------- */

for (const file of fs.readdirSync(source)) {
  const full = path.join(source, file);
  if (fs.statSync(full).isDirectory()) continue;
  if (!INPUT.test(file)) { skipped.push(file); continue; }
  if (/logo/i.test(file)) {
    fs.mkdirSync(target, { recursive: true });
    await sharp(full).resize({ width: 400, withoutEnlargement: true }).png().toFile(path.join(target, "logo.png"));
    converted.push({ to: path.join(target, "logo.png"), before: fs.statSync(full).size, after: fs.statSync(path.join(target, "logo.png")).size });
  } else {
    skipped.push(`${file} (mettilo in una sottocartella)`);
  }
}

/* --- riepilogo ---------------------------------------------------- */

const mb = (n) => (n / 1024 / 1024).toFixed(1);
const before = converted.reduce((s, c) => s + c.before, 0);
const after = converted.reduce((s, c) => s + c.after, 0);

console.log(`\n${converted.length} immagini convertite.`);
if (converted.length) {
  console.log(`Peso complessivo: ${mb(before)} MB → ${mb(after)} MB\n`);
  for (const c of converted.slice(0, 40)) {
    console.log(`  ${c.to.replace(target + path.sep, "")}  ${Math.round(c.after / 1024)} KB`);
  }
  if (converted.length > 40) console.log(`  ... e altre ${converted.length - 40}`);
}
if (skipped.length) {
  console.log(`\nIgnorati (${skipped.length}):`);
  for (const s of skipped.slice(0, 10)) console.log(`  ${s}`);
}

console.log(`\nOra lancia:  SITE_ID=${id} npm run media:scan\n`);
