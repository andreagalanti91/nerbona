"use client";

import Link from "next/link";
import { createContext, useContext, type ReactNode } from "react";
import type { NavLink } from "../config/types";

/**
 * COLLEGAMENTI
 * ============
 * I collegamenti scritti in configurazione sono di tre tipi:
 *
 *   "#contatti"     ancora a una sezione della pagina corrente
 *   "/servizi"      pagina interna del sito
 *   "https://..."   indirizzo esterno, si apre in una nuova scheda
 *
 * Le pagine interne passano da next/link, che aggiunge BASE_PATH quando il
 * sito sta in una sottocartella: un <a href="/servizi"> scritto a mano
 * punterebbe alla radice del dominio.
 *
 * Le voci di menù che puntano a una sezione della homepage valgono anche
 * dalle pagine interne: lì diventano "/#sezione". Per saperlo i componenti
 * chiedono a `useIsHome()` su quale pagina si trovano.
 */

const HomeContext = createContext(true);

export function PageScope({
  home,
  children,
}: {
  home: boolean;
  children: ReactNode;
}) {
  return <HomeContext.Provider value={home}>{children}</HomeContext.Provider>;
}

export function useIsHome(): boolean {
  return useContext(HomeContext);
}

/** Indirizzo di una voce di menù, o undefined se è solo un'intestazione. */
export function navHref(item: NavLink, home: boolean): string | undefined {
  if (item.href) return item.href;
  if (item.page) return `/${item.page}`;
  if (item.target) return home ? `#${item.target}` : `/#${item.target}`;
  return undefined;
}

export function SmartLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  /* Ancore, mailto:, tel: */
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
