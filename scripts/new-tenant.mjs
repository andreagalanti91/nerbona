/**
 * CREA UN NUOVO CLIENTE
 * =====================
 *
 *   npm run new:tenant nerbona
 *
 * Fa in un colpo solo tutto ciò che prima andava fatto a mano:
 *   - copia lo scheletro in tenants/<id>/
 *   - crea le cartelle dei media in public/tenants/<id>/
 *   - registra il cliente in src/config/index.ts
 *   - prepara la cartella prospects/<id>/ per raccogliere il materiale
 *
 * Non sovrascrive niente: se il cliente esiste già, si ferma.
 */
import fs from "node:fs";
import path from "node:path";

const id = process.argv[2];

if (!id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  console.error(
    "\nUso: npm run new:tenant <slug>\n\n" +
      "Lo slug è minuscolo, senza spazi né accenti, es. nerbona, podere-rosa.\n",
  );
  process.exit(1);
}

const tenantDir = path.join("tenants", id);
if (fs.existsSync(tenantDir)) {
  console.error(`\nIl cliente "${id}" esiste già in ${tenantDir}. Non tocco nulla.\n`);
  process.exit(1);
}

/* --- 1. configurazione ------------------------------------------- */

fs.cpSync("tenants/_template", tenantDir, { recursive: true });

const sitePath = path.join(tenantDir, "site.ts");
fs.writeFileSync(
  sitePath,
  fs.readFileSync(sitePath, "utf8").replace('id: "TODO-slug-cliente"', `id: "${id}"`),
);

/* --- 2. cartelle dei media --------------------------------------- */

const mediaDirs = ["stays", "estate", "experiences", "trail", "contact", "video"];
for (const dir of mediaDirs) {
  fs.mkdirSync(path.join("public", "tenants", id, dir), { recursive: true });
}

fs.writeFileSync(
  path.join("public", "tenants", id, "LEGGIMI.txt"),
  `Media di ${id}\n` +
    `${"=".repeat(10 + id.length)}\n\n` +
    `stays/        foto delle sistemazioni, <slug>-01.webp, <slug>-02.webp...\n` +
    `estate/       foto della tenuta: paesaggio, aerea, piscina\n` +
    `experiences/  foto delle esperienze\n` +
    `trail/        foto del percorso o dell'attività in evidenza\n` +
    `contact/      foto del blocco finale\n` +
    `video/        hero-desktop.mp4, hero-mobile.mp4, hero-poster.webp\n` +
    `logo.png      logo del cliente\n\n` +
    `Scarica le foto originali in prospects/${id}/foto/ e lancia\n` +
    `  SITE_ID=${id} npm run media:prepare\n` +
    `che le converte in webp e le mette qui con i nomi giusti.\n`,
);

/* --- 3. registrazione -------------------------------------------- */

const registryPath = path.join("src", "config", "index.ts");
let registry = fs.readFileSync(registryPath, "utf8");

/* Nome della variabile in camelCase: podere-rosa -> podereRosa */
const varName = id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

if (!registry.includes(`tenants/${id}/site`)) {
  registry = registry.replace(
    /(import .* from "\.\.\/\.\.\/tenants\/[^"]+";\n)(?![\s\S]*import .* from "\.\.\/\.\.\/tenants)/,
    `$1import ${varName} from "../../tenants/${id}/site";\n`,
  );
  registry = registry.replace(
    /(const REGISTRY: Record<string, SiteConfig> = \{\n)/,
    `$1  "${id}": ${varName},\n`,
  );
  fs.writeFileSync(registryPath, registry);
}

/* --- 4. cartella di raccolta materiale --------------------------- */

const prospectDir = path.join("prospects", id);
fs.mkdirSync(path.join(prospectDir, "foto"), { recursive: true });

fs.writeFileSync(
  path.join(prospectDir, "fonte.md"),
  `# ${id} — materiale raccolto\n\n` +
    `Incolla qui tutto quello che trovi. Non serve ordinarlo: serve che sia\n` +
    `completo. Questo file è quello da passare a Claude per generare site.ts.\n\n` +
    `## Fonti\n\n` +
    `- Sito ufficiale: \n` +
    `- Booking / Agriturismo.it / altre schede: \n\n` +
    `## Identità\n\n` +
    `- Nome esatto: \n` +
    `- Anno di fondazione: \n` +
    `- Indirizzo completo: \n` +
    `- Coordinate (da Google Maps, tasto destro sul punto): \n` +
    `- Telefono: \n` +
    `- Email: \n` +
    `- Dominio attuale: \n\n` +
    `## Racconto\n\n` +
    `Chi sono, da quanto, cosa rende diverso il posto. Copia i loro testi\n` +
    `così come sono: li riscrivo io.\n\n` +
    `## Sistemazioni\n\n` +
    `Per ognuna: nome, tipologia, metri quadri, posti letto, camere, bagni,\n` +
    `cosa ha di particolare.\n\n` +
    `## Servizi ed esperienze\n\n` +
    `Piscina, ristorante, degustazioni, bici, corsi...\n\n` +
    `## Dintorni\n\n` +
    `Località vicine con la distanza in km.\n\n` +
    `## Note mie\n\n` +
    `Che taglio dare, cosa evitare, cosa mettere in primo piano.\n`,
);

/* --- fatto ------------------------------------------------------- */

console.log(`
Cliente "${id}" creato.

  tenants/${id}/site.ts          da compilare (cerca i TODO)
  tenants/${id}/theme.css        colori e font
  public/tenants/${id}/          dove vanno i media
  prospects/${id}/fonte.md       dove raccogliere il materiale
  prospects/${id}/foto/          dove scaricare le foto originali

Prossimi passi:

  1. riempi prospects/${id}/fonte.md
  2. scarica le foto in prospects/${id}/foto/
  3. SITE_ID=${id} npm run media:prepare
  4. compila tenants/${id}/site.ts
  5. SITE_ID=${id} npm run validate
  6. SITE_ID=${id} npm run demo:build
`);
