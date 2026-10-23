/**
 * Legge le foto presenti nella cartella di un cliente e stampa gli array
 * `gallery` già pronti da incollare in tenants/<id>/site.ts.
 *
 *   SITE_ID=le-ville npm run media:scan
 *
 * Convenzione dei nomi: <slug>-01.webp, <slug>-02.webp, ...
 * La prima immagine è la copertina, le successive formano la galleria.
 * File che finiscono con -cover o -preview sono trattati a parte.
 */
import fs from "node:fs";
import path from "node:path";

const siteId = process.env.SITE_ID ?? "nerbona";
const dir = path.join("public", "tenants", siteId, "stays");

if (!fs.existsSync(dir)) {
  console.error(`Cartella non trovata: ${dir}`);
  process.exit(1);
}

const files = fs.readdirSync(dir).filter((f) => /\.(webp|jpe?g|png|avif)$/i.test(f)).sort();

/* Raggruppa per slug: tutto ciò che precede il "-NN" o il "-cover" finale. */
const groups = new Map();
for (const file of files) {
  const slug = file.replace(/-(\d+|cover|preview)\.\w+$/i, "");
  if (!groups.has(slug)) groups.set(slug, []);
  groups.get(slug).push(file);
}

console.log(`\nSistemazioni trovate in ${dir}\n`);

for (const [slug, list] of [...groups].sort()) {
  const numbered = list.filter((f) => /-\d+\.\w+$/.test(f));
  const cover = list.find((f) => /-cover\./i.test(f)) ?? numbered[0];
  const preview = list.find((f) => /-preview\./i.test(f));
  const gallery = numbered.filter((f) => f !== cover).slice(0, -0 || undefined);

  console.log(`  // ${slug} — ${list.length} file`);
  console.log(`  cover: "stays/${cover}",`);
  if (preview) console.log(`  detail: "stays/${preview}",`);
  else console.log(`  detail: "stays/${numbered[numbered.length - 1]}",`);
  console.log(`  gallery: [`);
  for (const file of gallery) console.log(`    "stays/${file}",`);
  console.log(`  ],\n`);
}

console.log("Copia i blocchi che ti servono in tenants/" + siteId + "/site.ts.\n");
