/**
 * SELEZIONE DEL SITO ATTIVO
 * =========================
 * Un solo codice sorgente, N agriturismi. Quale sito viene compilato lo decide
 * la variabile d'ambiente SITE_ID, che corrisponde al nome di una cartella
 * dentro tenants/.
 *
 *   SITE_ID=le-ville      npm run build
 *   SITE_ID=podere-rosa   npm run build
 *
 * Se SITE_ID non è impostata si usa il valore in .env (vedi .env.example).
 *
 * Perché un registro esplicito invece di un import dinamico: Next deve poter
 * risolvere staticamente i moduli per generare le pagine, e un registro rende
 * evidente in un colpo d'occhio quali clienti sono in produzione.
 */

import type { SiteConfig } from "./types";
import nerbona from "../../tenants/nerbona/site";

/* Per aggiungere un cliente: importalo qui sopra e aggiungi una riga.
   Vedi docs/NUOVO-CLIENTE.md per la procedura completa. */
const REGISTRY: Record<string, SiteConfig> = {
  nerbona: nerbona,
};

const requestedId = process.env.NEXT_PUBLIC_SITE_ID ?? "nerbona";

const resolved = REGISTRY[requestedId];

if (!resolved) {
  throw new Error(
    `Sito "${requestedId}" non trovato. ` +
      `Clienti disponibili: ${Object.keys(REGISTRY).join(", ")}. ` +
      `Controlla SITE_ID e il registro in src/config/index.ts.`,
  );
}

/** La configurazione del sito che si sta compilando. */
export const site = resolved;

/** Lingua usata quando non ce n'è una salvata o richiesta. */
export const defaultLocale = site.locales[0];

/**
 * Sottocartella in cui è pubblicato il sito, vuota se sta nella radice
 * del dominio. Impostata da BASE_PATH al momento della compilazione.
 *
 * Next aggiunge da sé questo prefisso ai collegamenti fra pagine, ma non
 * alle URL dei media, che qui costruiamo a mano: per quelle ci pensa asset().
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Costruisce l'URL pubblico di un file multimediale del cliente.
 *
 *   asset("stays/villa-01.webp")
 *     -> "/tenants/le-ville/stays/villa-01.webp?v=2026-08-26"
 *     -> "/demo/tenants/le-ville/stays/villa-01.webp?v=..."  con BASE_PATH=/demo
 *
 * La versione in coda serve a forzare browser e CDN a ricaricare l'immagine
 * quando ne sostituisci una mantenendo lo stesso nome file. Nel progetto
 * originale questa cosa era risolta con un parametro scritto a mano su una
 * singola immagine; qui vale per tutti i media, e si aggiorna cambiando
 * `mediaVersion` nella configurazione del cliente.
 */
export function asset(relativePath: string): string {
  const clean = relativePath.replace(/^\/+/, "");
  const base = `${basePath}/tenants/${site.brand.id}/${clean}`;
  return site.mediaVersion ? `${base}?v=${site.mediaVersion}` : base;
}

/** Chiave di localStorage per la lingua, isolata per cliente. */
export const languageStorageKey = `${site.brand.id}:locale`;

/** Link WhatsApp pronto all'uso. */
export const whatsappUrl = `https://wa.me/${site.contact.whatsapp ?? site.contact.phone}`;

/** Link telefonico pronto all'uso. */
export const telUrl = `tel:+${site.contact.phone}`;

/** Link email pronto all'uso. */
export const mailUrl = `mailto:${site.contact.email}`;

/** Indirizzo del motore di prenotazione, se il cliente ne ha uno. */
export const bookingUrl = site.booking?.url;

/**
 * Indirizzo pubblico del sito.
 *
 * Normalmente è quello scritto in `seo.domain`, ma la variabile d'ambiente
 * SITE_URL ha la precedenza: lo stesso identico contenuto serve così sia per
 * l'anteprima su un sottodominio di lavoro sia per il dominio definitivo del
 * cliente, senza doverlo modificare in configurazione a ogni pubblicazione.
 *
 * Da qui derivano metadati, sitemap, robots e dati strutturati.
 */
/**
 * Vero per le anteprime compilate con NOINDEX=true: le pagine dichiarano
 * "noindex" e robots.txt chiede di non scansionare nulla.
 */
export const noIndex = process.env.NEXT_PUBLIC_NOINDEX === "true";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || site.seo.domain
).replace(/\/+$/, "");

export * from "./types";
