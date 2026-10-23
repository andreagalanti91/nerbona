"use client";

/**
 * LINGUE
 * ======
 * Nel progetto originale ogni componente riceveva `language` come prop e
 * conteneva decine di `language === "it" ? "..." : "..."` scritti a mano.
 * Erano 53 solo nella homepage: significava che tradurre il sito, o cambiarne
 * i testi per un altro cliente, richiedeva di aprire i componenti.
 *
 * Qui la lingua sta in un context, e i testi vengono presi dalla
 * configurazione del cliente attraverso `t()`. I componenti non contengono
 * più nessuna stringa visibile all'utente.
 *
 * Aggiungere il tedesco a un cliente significa: mettere "de" in `locales`
 * e aggiungere la chiave `de` ai suoi testi. Nessuna modifica al codice.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { defaultLocale, languageStorageKey, site } from "../config";
import { translate } from "./translate";
import type { Localized, LocaleCode } from "../config/types";

interface LanguageContextValue {
  locale: LocaleCode;
  /** Traduce un testo della configurazione nella lingua corrente. */
  t: (value: Localized) => string;
  /** Passa alla lingua successiva fra quelle attive. */
  cycleLocale: () => void;
  setLocale: (locale: LocaleCode) => void;
  /** Etichetta del selettore, es. "IT / EN". */
  switchLabel: string;
  /** Nome esteso della prossima lingua, es. "English". */
  nextLocaleName: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(defaultLocale);

  /* La lingua salvata si legge dopo il primo render: durante l'export statico
     localStorage non esiste, e leggerlo prima causerebbe una differenza fra
     HTML generato e HTML idratato. */
  useEffect(() => {
    const saved = window.localStorage.getItem(languageStorageKey);
    if (!saved || !site.locales.includes(saved)) return;
    const frame = window.requestAnimationFrame(() => setLocaleState(saved));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: LocaleCode) => {
    window.localStorage.setItem(languageStorageKey, next);
    setLocaleState(next);
  }, []);

  const cycleLocale = useCallback(() => {
    const index = site.locales.indexOf(locale);
    setLocale(site.locales[(index + 1) % site.locales.length]);
  }, [locale, setLocale]);

  const t = useCallback(
    (value: Localized) => translate(value, locale),
    [locale],
  );

  const nextLocale =
    site.locales[(site.locales.indexOf(locale) + 1) % site.locales.length];

  const value: LanguageContextValue = {
    locale,
    t,
    setLocale,
    cycleLocale,
    switchLabel: `${locale.toUpperCase()} / ${nextLocale.toUpperCase()}`,
    nextLocaleName: site.localeNames[nextLocale] ?? nextLocale.toUpperCase(),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage va usato dentro <LanguageProvider>.");
  }
  return context;
}
