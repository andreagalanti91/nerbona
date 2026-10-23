/**
 * VALIDAZIONE DI UN CLIENTE
 * =========================
 *
 *   SITE_ID=nerbona npm run validate
 *   npm run validate            (controlla tutti i clienti registrati)
 *
 * Serve a rispondere in due secondi a "questo sito è pronto?", senza dover
 * rileggere novecento righe di configurazione.
 *
 * Controlla:
 *   - ogni foto e video citati esistono davvero su disco
 *   - non sono rimasti segnaposto TODO
 *   - ogni testo è tradotto in tutte le lingue dichiarate
 *   - le voci di navigazione puntano a sezioni o pagine che esistono
 *   - le pagine interne hanno slug unici, un'apertura e ancore valide
 *   - gli slug delle sistemazioni sono unici e validi per una URL
 *   - i contatti hanno un formato plausibile
 *   - segnala i casi che il CSS non copre (più di tre esperienze,
 *     molte sistemazioni nel carosello)
 *
 * Esce con codice 1 se trova errori, così si può usare in automatico.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/* ---------------------------------------------------------------- */
/* Caricamento della configurazione                                  */
/* ---------------------------------------------------------------- */

/* I file dei clienti sono TypeScript. Li leggiamo passando dal
   compilatore che Next già include, così non serve nessuno strumento
   aggiuntivo. */
async function loadTenant(id) {
  const ts = require("typescript");
  const entry = path.resolve("tenants", id, "site.ts");
  const source = fs.readFileSync(entry, "utf8");

  /* Toglie l'import dei tipi: a runtime non servono e punterebbe a un
     altro file TypeScript. */
  const stripped = source.replace(
    /import\s+type\s+\{[^}]*\}\s+from\s+["'][^"']*["'];?/g,
    "",
  );

  const js = ts.transpileModule(stripped, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;

  const tmp = path.resolve("tenants", id, `.site.validate.mjs`);
  fs.writeFileSync(tmp, js);
  try {
    return (await import(pathToFileURL(tmp).href + `?t=${Date.now()}`)).default;
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

/* ---------------------------------------------------------------- */
/* Controlli                                                         */
/* ---------------------------------------------------------------- */

function validate(id, site) {
  const errors = [];
  const warnings = [];
  const mediaDir = path.resolve("public", "tenants", id);

  const err = (msg) => errors.push(msg);
  const warn = (msg) => warnings.push(msg);

  /* --- media citati ma inesistenti ------------------------------- */

  const seenMedia = new Set();
  const missingMedia = new Set();
  const checkMedia = (value, where) => {
    if (typeof value !== "string" || !value) return;
    if (seenMedia.has(value + where)) return;
    seenMedia.add(value + where);
    const file = path.join(mediaDir, value);
    if (!fs.existsSync(file)) {
      missingMedia.add(value);
      err(`${where}: file mancante — public/tenants/${id}/${value}`);
    }
  };

  /* Percorre l'intera configurazione cercando: campi che sembrano media,
     testi tradotti incompleti, e segnaposto rimasti. */
  const MEDIA_KEYS = new Set([
    "logo", "src", "cover", "detail", "image", "desktop", "mobile", "poster", "ogImage",
  ]);
  const MEDIA_EXT = /\.(webp|jpe?g|png|avif|mp4|webm|svg|gif)$/i;

  const localeSet = new Set(site.locales ?? []);

  function isLocalized(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const keys = Object.keys(value);
    return keys.length > 0 && keys.every((k) => typeof value[k] === "string") &&
      keys.some((k) => localeSet.has(k));
  }

  function walk(node, trail) {
    if (typeof node === "string") {
      if (/\bTODO\b/.test(node)) err(`${trail}: segnaposto TODO non sostituito`);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, `${trail}[${i}]`));
      return;
    }
    if (!node || typeof node !== "object") return;

    if (isLocalized(node)) {
      for (const locale of site.locales) {
        const text = node[locale];
        if (typeof text !== "string" || !text.trim()) {
          err(`${trail}: manca la traduzione "${locale}"`);
        } else if (/\bTODO\b/.test(text)) {
          err(`${trail}.${locale}: segnaposto TODO non sostituito`);
        }
      }
      const extra = Object.keys(node).filter((k) => !localeSet.has(k));
      if (extra.length) warn(`${trail}: lingue non dichiarate in locales — ${extra.join(", ")}`);
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      const next = trail ? `${trail}.${key}` : key;
      if (typeof value === "string" && (MEDIA_KEYS.has(key) || MEDIA_EXT.test(value))) {
        if (!/^https?:/.test(value)) checkMedia(value, next);
      }
      walk(value, next);
    }
  }

  walk(site, "");

  /* --- gallerie -------------------------------------------------- */

  for (const stay of site.accommodations ?? []) {
    (stay.gallery ?? []).forEach((image, i) =>
      checkMedia(image, `accommodations[${stay.slug}].gallery[${i}]`),
    );
    const unitSlugs = new Set();
    for (const unit of stay.units ?? []) {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(unit.slug ?? "")) {
        err(`accommodations[${stay.slug}].units: slug non valido — "${unit.slug}"`);
      }
      if (unitSlugs.has(unit.slug)) err(`accommodations[${stay.slug}].units: slug duplicato — "${unit.slug}"`);
      unitSlugs.add(unit.slug);
      (unit.images ?? []).forEach((image, i) =>
        checkMedia(image, `accommodations[${stay.slug}].units[${unit.slug}].images[${i}]`),
      );
      if (unit.bookingUrl && !/^https:\/\//.test(unit.bookingUrl)) {
        err(`accommodations[${stay.slug}].units[${unit.slug}].bookingUrl: deve iniziare con https://`);
      }
    }
  }

  /* --- pagine interne ------------------------------------------- */

  const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const pages = site.pages ?? [];
  const pageSlugs = new Set();
  const legalSlugs = new Set((site.legalPages ?? []).map((p) => p.slug));
  for (const page of pages) {
    if (!SLUG.test(page.slug)) err(`pages: slug non valido per una URL — "${page.slug}"`);
    if (pageSlugs.has(page.slug)) err(`pages: slug duplicato — "${page.slug}"`);
    /* Pagine interne e legali condividono la stessa rotta /<slug>. */
    if (legalSlugs.has(page.slug)) err(`pages: "${page.slug}" è già lo slug di una pagina legale`);
    if (page.slug === "sistemazioni") err(`pages: "sistemazioni" è riservato alle pagine degli alloggi`);
    pageSlugs.add(page.slug);
    const types = (page.sections ?? []).map((s) => s.type);
    if (types[0] !== "hero") err(`pages[${page.slug}]: la prima sezione deve essere un hero`);
    if (types.filter((t) => t === "hero").length > 1) err(`pages[${page.slug}]: c'è più di un hero`);
    const ids = (page.sections ?? []).map((s) => s.id);
    if (new Set(ids).size !== ids.length) err(`pages[${page.slug}]: ci sono id di sezione ripetuti`);
  }

  /* --- navigazione ----------------------------------------------- */

  const sectionIds = new Set((site.sections ?? []).map((s) => s.id));
  const checkNavLink = (item, where) => {
    if ([item.target, item.page, item.href].filter(Boolean).length > 1) {
      err(`${where}: indica uno solo fra target, page e href`);
    }
    if (item.target && !sectionIds.has(item.target)) {
      err(`${where}: "${item.target}" non corrisponde a nessuna sezione della homepage`);
    }
    if (item.page && !pageSlugs.has(item.page)) {
      err(`${where}: "${item.page}" non corrisponde a nessuna pagina in pages`);
    }
  };
  (site.nav ?? []).forEach((item, i) => {
    if (!item.target && !item.page && !item.href && !item.children?.length) {
      err(`nav[${i}]: la voce non punta da nessuna parte`);
    }
    checkNavLink(item, `nav[${i}]`);
    (item.children ?? []).forEach((child, j) => {
      if (!child.target && !child.page && !child.href) err(`nav[${i}].children[${j}]: la voce non punta da nessuna parte`);
      checkNavLink(child, `nav[${i}].children[${j}]`);
    });
  });
  if ((site.nav ?? []).length > 7) {
    warn(`nav: ${site.nav.length} voci principali. Oltre sette l'header desktop si affolla: raggruppale con children`);
  }

  /* Collegamenti usati dai pulsanti. Le ancore valgono nella pagina in cui
     stanno: un "#contatti" in una pagina interna deve trovare una sezione
     "contatti" in quella pagina, non in homepage. */
  const stayFolder = site.stayPath ?? "sistemazioni";
  const stayRoutes = new Set(
    (site.accommodations ?? []).map((a) => (stayFolder ? `${stayFolder}/${a.slug}` : a.slug)),
  );
  /* Con gli alloggi alla radice, il loro slug divide lo spazio con pagine
     interne e legali. */
  if (!stayFolder) {
    for (const stay of site.accommodations ?? []) {
      if (pageSlugs.has(stay.slug) || legalSlugs.has(stay.slug)) {
        err(`accommodations: "${stay.slug}" coincide con lo slug di una pagina`);
      }
    }
  }
  const collectLinks = (node, trail, out) => {
    if (!node || typeof node !== "object") return;
    for (const [key, value] of Object.entries(node)) {
      const next = trail ? `${trail}.${key}` : key;
      if ((key === "href" || key === "ctaHref") && typeof value === "string") {
        out.push([value, next]);
      } else if (typeof value === "object") {
        collectLinks(value, next, out);
      }
    }
  };
  const checkLinks = (links, ids) => {
    for (const [href, where] of links) {
      if (href.startsWith("#")) {
        if (!ids.has(href.slice(1))) err(`${where}: l'ancora "${href}" non punta a nessuna sezione di questa pagina`);
      } else if (href.startsWith("/")) {
        const [pathPart, hash] = href.slice(1).split("#");
        const route = pathPart.replace(/\/+$/, "");
        const known = route === "" || pageSlugs.has(route) || stayRoutes.has(route) ||
          (legalSlugs.has(route) && !site.legalPages.find((p) => p.slug === route)?.externalUrl);
        if (!known) err(`${where}: "${href}" non corrisponde a nessuna pagina del sito`);
        if (route === "" && hash && !sectionIds.has(hash)) {
          err(`${where}: "${href}" punta a una sezione che non esiste in homepage`);
        }
      }
    }
  };
  const homeLinks = [];
  const { pages: _pages, ...rest } = site;
  collectLinks(rest, "", homeLinks);
  checkLinks(homeLinks, sectionIds);
  for (const page of pages) {
    const links = [];
    collectLinks(page.sections, `pages[${page.slug}]`, links);
    checkLinks(links, new Set((page.sections ?? []).map((s) => s.id)));
  }

  /* --- sistemazioni ---------------------------------------------- */

  const slugs = new Set();
  for (const stay of site.accommodations ?? []) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(stay.slug)) {
      err(`accommodations: slug non valido per una URL — "${stay.slug}"`);
    }
    if (slugs.has(stay.slug)) err(`accommodations: slug duplicato — "${stay.slug}"`);
    slugs.add(stay.slug);
    const unitPhotos = (stay.units ?? []).some((unit) => unit.images?.length);
    if (!stay.gallery?.length && !unitPhotos) warn(`accommodations[${stay.slug}]: galleria vuota`);
  }

  /* --- sezioni --------------------------------------------------- */

  const types = (site.sections ?? []).map((s) => s.type);
  if (types.filter((t) => t === "hero").length !== 1) {
    err("sections: serve esattamente una sezione di tipo hero");
  }
  if (types[0] !== "hero") err("sections: la sezione hero deve essere la prima");

  const duplicatedIds = sectionIds.size !== (site.sections ?? []).length;
  if (duplicatedIds) err("sections: ci sono id ripetuti");

  if (types.includes("stays") && !(site.accommodations ?? []).length) {
    err("sections: c'è la sezione sistemazioni ma l'elenco accommodations è vuoto");
  }
  if ((site.accommodations ?? []).length && !site.stayPage) {
    err("stayPage: mancano i testi della pagina di dettaglio degli alloggi");
  }

  const allSections = [...(site.sections ?? []), ...pages.flatMap((p) => p.sections ?? [])];
  const staySlugs = new Set((site.accommodations ?? []).map((a) => a.slug));
  for (const section of allSections) {
    if (section.type === "stays" && !(site.accommodations ?? []).length) {
      err(`sezione ${section.id}: c'è un carosello sistemazioni ma l'elenco accommodations è vuoto`);
    }
    for (const slug of section.type === "stays" ? section.only ?? [] : []) {
      if (!staySlugs.has(slug)) err(`sezione ${section.id}.only: "${slug}" non è fra le sistemazioni`);
    }
    if (section.type === "stayTabs") {
      if (!(site.accommodations ?? []).length) err(`sezione ${section.id}: ci sono le schede alloggi ma accommodations è vuoto`);
      section.tabs.forEach((tab, i) => {
        if (!tab.stays?.length) err(`sezione ${section.id}.tabs[${i}]: scheda senza alloggi`);
        for (const slug of tab.stays ?? []) {
          if (!staySlugs.has(slug)) err(`sezione ${section.id}.tabs[${i}]: "${slug}" non è fra le sistemazioni`);
        }
      });
    }
  }

  const menu = (site.sections ?? []).find((s) => s.type === "menu");
  if (menu && !menu.courses?.length && !menu.documents?.length) {
    err("sezione menu: serve almeno un estratto (courses) o un documento (documents)");
  }

  /* --- limiti noti del CSS --------------------------------------- */

  const experiences = allSections.find((s) => s.type === "experiences" && s.items.length > 3);
  if (experiences) {
    warn(
      `esperienze: sono ${experiences.items.length}. Il CSS dà un'inquadratura ` +
        `dedicata solo alle prime tre (.exp-card-1/2/3): dalla quarta in poi ` +
        `servono le regole in src/styles/parts/09-experiences.css`,
    );
  }

  const stayCount = Math.max(
    0,
    ...allSections.filter((s) => s.type === "stays").map((s) => s.only?.length ?? (site.accommodations ?? []).length),
  );
  if (stayCount > 12) {
    warn(
      `sistemazioni: sono ${stayCount}. Il carosello le mostra tutte, ma su ` +
        `desktop la sezione diventa molto lunga da scorrere. Valuta di ` +
        `mostrarne meno o di dividerle per struttura usando il campo category.`,
    );
  }

  /* --- contatti e SEO -------------------------------------------- */

  if (!/^\d{8,15}$/.test(site.contact?.phone ?? "")) {
    err(`contact.phone: deve essere solo cifre, formato internazionale senza "+" — trovato "${site.contact?.phone}"`);
  }
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(site.contact?.email ?? "")) {
    err(`contact.email: indirizzo non valido — "${site.contact?.email}"`);
  }
  const { lat, lng } = site.contact?.coordinates ?? {};
  if (!lat || !lng) err("contact.coordinates: coordinate mancanti o a zero");

  if (!/^https?:\/\//.test(site.seo?.domain ?? "")) {
    err(`seo.domain: deve iniziare con http:// o https:// — "${site.seo?.domain}"`);
  }
  if ((site.seo?.domain ?? "").endsWith("/")) {
    err("seo.domain: non deve finire con /");
  }
  for (const locale of site.locales ?? []) {
    const description = site.seo?.description?.[locale];
    if (description && description.length > 160) {
      warn(`seo.description.${locale}: ${description.length} caratteri, oltre i 160 consigliati`);
    }
  }

  if (site.booking) {
    if (!/^https:\/\//.test(site.booking.url)) {
      err("booking.url: deve iniziare con https://");
    }
    for (const locale of site.locales ?? []) {
      if (!site.booking.label?.[locale]) {
        err(`booking.label: manca la traduzione "${locale}"`);
      }
    }
  }

  /* --- lingue ---------------------------------------------------- */

  for (const locale of site.locales ?? []) {
    if (!site.localeNames?.[locale]) err(`localeNames: manca il nome per "${locale}"`);
  }

  /* --- pagine legali --------------------------------------------- */

  for (const page of site.legalPages ?? []) {
    if (page.externalUrl) {
      if (!/^https:\/\//.test(page.externalUrl)) {
        err(`legalPages[${page.slug}].externalUrl: deve iniziare con https://`);
      }
      continue; /* il documento è del cliente: non lo giudichiamo */
    }
    if (!page.body) {
      err(`legalPages[${page.slug}]: serve un testo (body) oppure un externalUrl`);
      continue;
    }
    for (const locale of site.locales ?? []) {
      const body = page.body?.[locale] ?? "";
      if (body.replace(/<[^>]*>/g, "").trim().length < 200) {
        warn(`legalPages[${page.slug}].${locale}: testo molto breve, probabilmente ancora da scrivere`);
      }
    }
  }

  /* --- adempimenti italiani -------------------------------------- */

  /* Il CIN riguarda solo le strutture ricettive: un ristorante non ne ha uno.
     Lo si chiede quindi solo a chi offre alloggi. */
  if ((site.accommodations ?? []).length && !site.brand?.cin) {
    warn(
      "brand.cin: manca il Codice Identificativo Nazionale. In Italia va " +
        "esposto sul sito delle strutture ricettive; chiedilo al cliente.",
    );
  }

  if (site.contact?.phoneAlt && !/^\d{8,15}$/.test(site.contact.phoneAlt.number)) {
    err(`contact.phoneAlt.number: deve essere solo cifre, formato internazionale senza "+"`);
  }

  /* --- media presenti ma mai usati ------------------------------- */

  if (fs.existsSync(mediaDir)) {
    const used = new Set();
    for (const key of seenMedia) used.add(key.split("public")[0]);
    const allUsed = new Set();
    const collect = (node) => {
      if (typeof node === "string") { allUsed.add(node); return; }
      if (node && typeof node === "object") Object.values(node).forEach(collect);
    };
    collect(site);

    const walkDir = (dir, prefix = "") => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) walkDir(path.join(dir, entry.name), rel);
        else if (MEDIA_EXT.test(entry.name) && !allUsed.has(rel)) {
          warn(`media mai usato: public/tenants/${id}/${rel}`);
        }
      }
    };
    walkDir(mediaDir);
  }

  return { errors, warnings, missingMedia: [...missingMedia].sort() };
}

/* ---------------------------------------------------------------- */

const registry = fs
  .readdirSync("tenants", { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
  .map((e) => e.name);

const targets = process.env.SITE_ID ? [process.env.SITE_ID] : registry;

let failed = false;

for (const id of targets) {
  if (!registry.includes(id)) {
    console.error(`\nCliente "${id}" non trovato in tenants/.`);
    process.exit(1);
  }

  const site = await loadTenant(id);
  const { errors, warnings, missingMedia } = validate(id, site);

  console.log(`\n── ${id} ${"─".repeat(Math.max(0, 50 - id.length))}`);

  if (!errors.length && !warnings.length) {
    console.log("   Tutto a posto.");
  }
  for (const w of warnings) console.log(`   ⚠  ${w}`);
  for (const e of errors) console.log(`   ✗  ${e}`);

  const stays = site.accommodations?.length ?? 0;
  const sections = site.sections?.length ?? 0;
  console.log(
    `   ${sections} sezioni · ${site.pages?.length ?? 0} pagine · ${stays} sistemazioni · ` +
      `lingue: ${(site.locales ?? []).join(", ")}`,
  );

  /* Quando mancano delle foto, la lista di quello che serve viene scritta su
     file: è l'elenco da usare per scaricare il materiale dal sito del cliente,
     o da mandare al cliente stesso. */
  if (missingMedia.length) {
    const listPath = path.join("prospects", id, "foto-mancanti.txt");
    fs.mkdirSync(path.dirname(listPath), { recursive: true });

    const byFolder = new Map();
    for (const file of missingMedia) {
      const folder = file.includes("/") ? file.split("/")[0] : ".";
      if (!byFolder.has(folder)) byFolder.set(folder, []);
      byFolder.get(folder).push(file);
    }

    const lines = [
      `Foto mancanti — ${id}`,
      "=".repeat(18 + id.length),
      "",
      `${missingMedia.length} file citati dalla configurazione ma non presenti`,
      `in public/tenants/${id}/.`,
      "",
      "Scaricali in prospects/" + id + "/foto/ rispettando le cartelle qui sotto,",
      "poi lancia:  SITE_ID=" + id + " npm run media:prepare",
      "",
    ];
    for (const [folder, files] of [...byFolder].sort()) {
      lines.push(`${folder}/`);
      for (const file of files) lines.push(`  ${file.split("/").pop()}`);
      lines.push("");
    }
    fs.writeFileSync(listPath, lines.join("\n"));
    console.log(`   → elenco delle foto da procurare: ${listPath}`);
  }

  if (errors.length) failed = true;
}

console.log("");
if (failed) {
  console.error("Ci sono errori da correggere prima di pubblicare.\n");
  process.exit(1);
}
