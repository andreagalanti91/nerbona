"use client";

import Link from "next/link";
import { site } from "../config";
import { useLanguage } from "../lib/i18n";
import type { LegalPage as LegalPageConfig } from "../config/types";
import { Brand } from "./layout/Brand";

/**
 * Privacy e cookie policy. Il testo arriva dalla configurazione del cliente
 * come HTML semplice: sono documenti che si aggiornano spesso e che il
 * cliente o il suo consulente devono poter modificare senza toccare i
 * componenti.
 */
export function LegalPage({ page }: { page: LegalPageConfig }) {
  const { t, switchLabel, cycleLocale } = useLanguage();

  const others = site.legalPages.filter((p) => p.slug !== page.slug);

  return (
    <main className="legal-page">
      <header className="legal-header">
        <Brand href="/" size={42} />
        <Link href="/" className="legal-back">
          <i className="direction-mark reverse" aria-hidden="true" />
          <span>{site.brand.name}</span>
        </Link>
        <button onClick={cycleLocale}>{switchLabel}</button>
      </header>

      <section className="legal-hero">
        <p className="eyebrow light">
          {site.brand.prefix} {site.brand.name}
        </p>
        <h1>{t(page.title)}</h1>
        <span>{site.contact.address.join(" · ")}</span>
      </section>

      <div className="legal-content">
        <aside className="legal-aside">
          {others.map((other) =>
            other.externalUrl ? (
              <a
                key={other.slug}
                href={other.externalUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t(other.title)}
              </a>
            ) : (
              <Link key={other.slug} href={`/${other.slug}`}>
                {t(other.title)}
              </Link>
            ),
          )}
        </aside>

        {/* Il contenuto viene dalla configurazione, non dall'utente: non è
            input non fidato. Resta comunque l'unico punto del progetto in cui
            si inietta HTML, e va trattato con attenzione. */}
        <div
          className="legal-body"
          dangerouslySetInnerHTML={{ __html: page.body ? t(page.body) : "" }}
        />
      </div>

      <footer className="legal-footer">
        <span>{site.footer.copyright}</span>
      </footer>
    </main>
  );
}
