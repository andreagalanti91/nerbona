/**
 * Traduzione senza React, utilizzabile anche lato server.
 *
 * Serve nei punti che girano durante la generazione delle pagine e non hanno
 * accesso al context: metadati, sitemap, dati strutturati. Sta in un file
 * separato perché i moduli marcati "use client" non possono essere chiamati
 * dal server.
 */
import { defaultLocale } from "../config";
import type { Localized, LocaleCode } from "../config/types";

/**
 * Ripiega sulla lingua di default e poi sulla prima chiave disponibile, così
 * un testo tradotto a metà non fa mai comparire una stringa vuota.
 */
export function translate(
  value: Localized,
  locale: LocaleCode = defaultLocale,
): string {
  return value[locale] ?? value[defaultLocale] ?? Object.values(value)[0] ?? "";
}
