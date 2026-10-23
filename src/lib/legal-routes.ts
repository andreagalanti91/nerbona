import { site } from "../config";
import type { LegalPage } from "../config/types";

/**
 * QUALI PAGINE LEGALI GENERARE
 * ============================
 * Le informative con `externalUrl` sono ospitate altrove (Iubenda e simili) e
 * non vanno duplicate: i collegamenti del sito puntano direttamente lì.
 *
 * Resta un caso limite: se TUTTE le informative del cliente sono esterne, non
 * c'è nessuna pagina da generare — e l'esportazione statica di Next si rifiuta
 * di compilare una rotta dinamica senza almeno un indirizzo.
 *
 * In quel caso generiamo una sola pagina, /note-legali, che elenca i documenti
 * con i link a dove si trovano. Non è un espediente per far contento il
 * compilatore: è l'indirizzo a cui rimandare quando serve un riferimento
 * stabile sul dominio del cliente, per esempio in un contratto o in una
 * comunicazione, anche se i documenti sono altrove.
 */

const FALLBACK_SLUG = "note-legali";

/** Le informative con un testo proprio, quelle che diventano una pagina. */
function internalPages(): LegalPage[] {
  return site.legalPages.filter((page) => !page.externalUrl);
}

/** Pagina indice, costruita solo quando serve. */
function fallbackPage(): LegalPage {
  const links = (locale: string) =>
    site.legalPages
      .map(
        (page) =>
          `<li><a href="${page.externalUrl}" target="_blank" rel="noreferrer">` +
          `${page.title[locale] ?? page.title[site.locales[0]]}</a></li>`,
      )
      .join("\n      ");

  const body = Object.fromEntries(
    site.locales.map((locale) => [
      locale,
      locale === "it"
        ? `<section>
    <h2>Documenti</h2>
    <p>Le informative di ${site.brand.prefix} ${site.brand.name} sono pubblicate
    e mantenute aggiornate ai seguenti indirizzi.</p>
    <ul>
      ${links(locale)}
    </ul>
  </section>`
        : `<section>
    <h2>Documents</h2>
    <p>The policies of ${site.brand.prefix} ${site.brand.name} are published and
    kept up to date at the following addresses.</p>
    <ul>
      ${links(locale)}
    </ul>
  </section>`,
    ]),
  );

  const title = Object.fromEntries(
    site.locales.map((locale) => [
      locale,
      locale === "it" ? "Note legali" : "Legal notices",
    ]),
  );

  return { slug: FALLBACK_SLUG, title, body };
}

/** Le pagine da generare. Mai un elenco vuoto. */
export function legalRoutes(): LegalPage[] {
  const pages = internalPages();
  return pages.length ? pages : [fallbackPage()];
}

/** Cerca una pagina fra quelle effettivamente generate. */
export function findLegalRoute(slug: string): LegalPage | undefined {
  return legalRoutes().find((page) => page.slug === slug);
}
