import { site } from "../config";
import type { ContentPage } from "../config/types";

/**
 * PAGINE INTERNE
 * ==============
 * `pages` è facoltativo: un cliente con la sola homepage non ne ha.
 * Come per gli alloggi, questo è l'unico punto che gestisce il caso vuoto.
 */
export function contentPages(): ContentPage[] {
  return site.pages ?? [];
}

export function findContentPage(slug: string): ContentPage | undefined {
  return contentPages().find((page) => page.slug === slug);
}
