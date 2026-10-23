/**
 * Compila UN agriturismo in una cartella statica pronta da caricare.
 *
 *   SITE_ID=le-ville npm run build:static
 *
 * Se il sito non sta nella radice del dominio ma in una sottocartella:
 *
 *   SITE_ID=le-ville BASE_PATH=/demo npm run build:static
 *
 * Risultato: dist/<site-id>/ — HTML, CSS, JS e media, senza bisogno di Node
 * sul server. Si carica su qualsiasi hosting.
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const siteId = process.env.SITE_ID ?? "nerbona";
const basePath = process.env.BASE_PATH ?? "";
const require = createRequire(import.meta.url);
const nextBinary = require.resolve("next/dist/bin/next");

console.log(`\nCompilazione sito: ${siteId}`);
console.log(basePath ? `Sottocartella: ${basePath}\n` : "Pubblicato nella radice del dominio\n");

const result = spawnSync(process.execPath, [nextBinary, "build"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    STATIC_EXPORT: "true",
    SITE_ID: siteId,
    NEXT_PUBLIC_SITE_ID: siteId,
    BASE_PATH: basePath,
    SITE_URL: process.env.SITE_URL ?? "",
    NOINDEX: process.env.NOINDEX ?? "",
  },
  stdio: "inherit",
});

if (result.status !== 0) process.exit(result.status ?? 1);

/* L'esportazione statica copia tutta la cartella public/, che contiene i media
   di ogni cliente. Senza questa potatura la build di un agriturismo si
   porterebbe dietro le foto di tutti gli altri: con dieci clienti sarebbero
   centinaia di megabyte inutili per ognuno. */
const mediaRoot = path.join("out", "tenants");
if (fs.existsSync(mediaRoot)) {
  for (const other of fs.readdirSync(mediaRoot)) {
    if (other !== siteId) {
      fs.rmSync(path.join(mediaRoot, other), { recursive: true, force: true });
    }
  }
}

/* Un cliente senza alloggi genera comunque una pagina a uno slug riservato,
   perché l'esportazione statica pretende almeno un indirizzo per ogni rotta
   dinamica (vedi app/sistemazioni/[slug]/page.tsx). Non serve online. */
const emptyStay = path.join("out", "sistemazioni", "__nessuna__");
if (fs.existsSync(emptyStay)) {
  fs.rmSync(path.join("out", "sistemazioni"), { recursive: true, force: true });
}

/* I file gemelli che marcano le immagini segnaposto non servono online. */
const stripMarkers = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) stripMarkers(full);
    else if (entry.name.endsWith(".placeholder")) fs.rmSync(full);
  }
};
stripMarkers(mediaRoot);

/* Next scrive sempre in out/. Lo spostiamo sotto dist/<site-id>/ così si
   possono tenere in parallelo le build di più clienti. */
const target = path.join("dist", siteId);
fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync("dist", { recursive: true });
fs.renameSync("out", target);

console.log(
  basePath
    ? `\nFatto. Carica il CONTENUTO di ${target}/ dentro la cartella "${basePath.replace(/^\//, "")}" del dominio.\n`
    : `\nFatto. Carica il contenuto di ${target}/ nella radice del dominio.\n`,
);
