/**
 * MIGRAZIONE UNA-TANTUM — non serve al build, è conservato per tracciabilità.
 *
 * Prende il globals.css originale (3.576 righe in un unico file) e produce
 * src/styles/parts/*.css.
 *
 * Tre operazioni, in quest'ordine:
 *
 *  1. ELIMINA le regole morte. Il foglio conteneva un intero strato di layout
 *     della versione precedente del sito (.stay-grid, .experience-grid,
 *     .section-head, .film-controls...) che nessun componente usa più. Una
 *     regola che cita una classe inesistente non può mai fare match: toglierla
 *     non cambia nulla a schermo.
 *
 *  2. TOKENIZZA colori e font. I valori letterali (#17231c, Georgia...) vengono
 *     sostituiti dalle variabili CSS corrispondenti, così un nuovo agriturismo
 *     cambia palette e tipografia riscrivendo solo tenants/<id>/theme.css.
 *
 *  3. TAGLIA il foglio in blocchi CONTIGUI. Non raggruppa per sezione: il CSS
 *     originale è stratificato (base, riscritture, patch successive) e diverse
 *     regole in fondo sovrascrivono di proposito regole in cima. Riordinarle
 *     cambierebbe la cascata. I tagli avvengono solo fra una regola e la
 *     successiva, quindi l'ordine finale è identico all'originale.
 *
 * Uso: node scripts/split-css.mjs <globals.css> <cartella destinazione>
 */
import fs from "node:fs";
import path from "node:path";

const [, , source, outDir] = process.argv;
const css = fs.readFileSync(source, "utf8");

/* ---------------------------------------------------------------- */
/* 1. Classi non più usate da nessun componente                      */
/* ---------------------------------------------------------------- */

const DEAD = new Set([
  // impianto di layout della versione precedente del sito
  "section", "story", "story-copy", "story-columns", "story-images", "story-main",
  "story-small", "vertical-note", "stays", "section-head", "stay-grid", "stay-card",
  "stay-image", "stay-info", "stay-meta", "stay-photo-label", "experiences",
  "experience-grid", "experience-image", "territory", "territory-intro", "places",
  "underline", "trail-main", "legal-note",
  // controlli di un player video poi sostituito da un <video> nativo
  "hero-youtube", "film-controls", "pause-icon", "play-icon", "sound-icon",
  // posizioni di mappa cablate sulle città di un singolo cliente:
  // oggi arrivano dalla configurazione come stili inline
  "route-florence", "route-gimignano", "route-siena", "route-orcia",
  "place-florence", "place-gimignano", "place-siena", "place-orcia",
]);

const mentionsDeadClass = (selector) =>
  [...selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].some((m) => DEAD.has(m[1]));

/* ---------------------------------------------------------------- */
/* 2. Valori letterali -> variabili di tema                          */
/* ---------------------------------------------------------------- */

const TOKENS = [
  [/#17231c\b/gi, "var(--ink)"],
  [/#183026\b/gi, "var(--forest)"],
  [/#10241b\b/gi, "var(--deep)"],
  [/#f2eee4\b/gi, "var(--cream)"],
  [/#fbf8f1\b/gi, "var(--paper)"],
  [/#c8db9a\b/gi, "var(--lime)"],
  [/#14271e\b/gi, "var(--panel)"],
  [/#0b1711\b/gi, "var(--panel-deep)"],
  [/Georgia,\s*serif/g, "var(--font-display)"],
  [/Arial,\s*Helvetica,\s*sans-serif/g, "var(--font-body)"],
];

const tokenize = (text) => TOKENS.reduce((acc, [re, v]) => acc.replace(re, v), text);

/* ---------------------------------------------------------------- */
/* Parsing                                                           */
/* ---------------------------------------------------------------- */

/** Divide un testo CSS nei suoi blocchi di primo livello, in ordine. */
function topLevelBlocks(text) {
  const out = [];
  let depth = 0, start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}" && --depth === 0) {
      out.push(text.slice(start, i + 1).trim());
      start = i + 1;
    }
  }
  return out.filter(Boolean);
}

/** Toglie i selettori morti. Restituisce null se il blocco resta vuoto. */
function clean(block) {
  const open = block.indexOf("{");
  const prelude = block.slice(0, open).trim();

  if (prelude.startsWith("@keyframes") || prelude.startsWith("@font-face")) return block;

  if (prelude.startsWith("@media") || prelude.startsWith("@supports")) {
    const inner = block.slice(open + 1, block.lastIndexOf("}"));
    const kept = topLevelBlocks(inner).map(clean).filter(Boolean);
    return kept.length ? `${prelude} {\n${kept.join("\n")}\n}` : null;
  }

  const kept = prelude
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !mentionsDeadClass(s));

  return kept.length ? `${kept.join(",\n")} ${block.slice(open)}` : null;
}

/* ---------------------------------------------------------------- */
/* 3. Tagli contigui                                                 */
/* ---------------------------------------------------------------- */

/**
 * `start` è l'indice della prima regola del file nella numerazione delle
 * regole del foglio ORIGINALE. I tagli non spostano nulla: l'ordine finale
 * coincide con quello di partenza.
 */
const PARTS = [
  { start: 0,   file: "01-base.css",                 note: "Reset, tipografia di base, bottoni, occhielli." },
  { start: 9,   file: "02-hero-media.css",           note: "Video o foto a tutto schermo dell'apertura, e velatura." },
  { start: 14,  file: "03-header.css",               note: "Barra superiore, logo, navigazione desktop e mobile." },
  { start: 32,  file: "04-hero-copy.css",            note: "Titolo, claim e pilastri dell'apertura." },
  { start: 60,  file: "05-blocks.css",               note: "Blocchi a tutta larghezza: feature, percorso, contatti, footer." },
  { start: 124, file: "06-stay-page.css",            note: "Pagina di dettaglio di una sistemazione." },
  { start: 147, file: "07-story.css",                note: "Sezione racconto: parallasse, titolo a comparsa, cursore." },
  { start: 173, file: "08-stays.css",                note: "Carosello orizzontale delle sistemazioni." },
  { start: 208, file: "09-experiences.css",          note: "Card esperienze impilate, testo scorrevole, luce al mouse." },
  { start: 238, file: "10-territory.css",            note: "Mappa stilizzata delle distanze." },
  { start: 279, file: "11-responsive.css",           note: "Adattamenti a tablet e telefono delle sezioni precedenti." },
  { start: 287, file: "12-contact-dock.css",         note: "Pulsante contatti fisso e pannello a scomparsa." },
  { start: 310, file: "13-refinements-content.css",  note: "Rifiniture: racconto, percorso natura, mappa estesa." },
  { start: 337, file: "14-icons.css",                note: "Frecce e croci disegnate in CSS, condivise da più componenti." },
  { start: 347, file: "15-refinements-media.css",    note: "Rifiniture su nitidezza delle immagini e mappa su telefono." },
  { start: 363, file: "16-legal.css",                note: "Privacy e cookie policy." },
  { start: 385, file: "17-refinements-mobile.css",   note: "Rifiniture finali dello scorrimento su telefono." },
];

const blocks = topLevelBlocks(css);
let removed = 0;

fs.mkdirSync(outDir, { recursive: true });

PARTS.forEach((part, i) => {
  const end = PARTS[i + 1]?.start ?? blocks.length;
  const kept = [];
  for (const block of blocks.slice(part.start, end)) {
    const cleaned = clean(block);
    if (!cleaned) { removed++; continue; }
    kept.push(tokenize(cleaned));
  }
  const header =
    `/* ${part.note}\n` +
    `   Attenzione: l'ordine dei file elencati in src/styles/site.css è\n` +
    `   significativo. Alcune regole in coda sovrascrivono di proposito\n` +
    `   regole dei file precedenti. */\n\n`;
  fs.writeFileSync(path.join(outDir, part.file), header + kept.join("\n\n") + "\n");
});

console.log(`Regole eliminate perché mai applicabili: ${removed}`);
console.log(`File scritti: ${PARTS.length}`);
