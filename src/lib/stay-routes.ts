import { site } from "../config";
import type { Accommodation, StayPageCopy } from "../config/types";

/**
 * PAGINE DELLE SISTEMAZIONI
 * =========================
 * Un ristorante non ha alloggi, quindi `accommodations` può essere assente.
 * Queste funzioni sono l'unico punto che lo sa: il resto del codice le usa
 * senza doversi preoccupare del caso vuoto.
 */

export function accommodations(): Accommodation[] {
  return site.accommodations ?? [];
}

export function hasAccommodations(): boolean {
  return accommodations().length > 0;
}

/** Le pagine degli alloggi stanno alla radice del sito invece che in una cartella. */
export function staysAtRoot(): boolean {
  return site.stayPath === "";
}

/** Indirizzo della pagina di un alloggio: /sistemazioni/<slug> o /<slug>. */
export function stayHref(slug: string): string {
  const folder = site.stayPath ?? "sistemazioni";
  return folder ? `/${folder}/${slug}` : `/${slug}`;
}

/**
 * Testi della pagina di dettaglio. Se un cliente ha alloggi ma non li ha
 * scritti, la validazione lo segnala; qui si ripiega su etichette neutre
 * perché una pagina senza etichette è peggio di una con etichette generiche.
 */
export function stayPageCopy(): StayPageCopy {
  return (
    site.stayPage ?? {
      back: { it: "Indietro", en: "Back" },
      kicker: { it: "", en: "" },
      sizeLabel: { it: "Superficie", en: "Size" },
      guestsLabel: { it: "Ospiti", en: "Guests" },
      galleryLabel: { it: "Galleria", en: "Gallery" },
      ctaTitle: { it: "", en: "" },
      ctaLabel: { it: "Contattaci", en: "Contact us" },
    }
  );
}
