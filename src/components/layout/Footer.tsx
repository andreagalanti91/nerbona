"use client";

import Link from "next/link";
import { mailUrl, site, telUrl } from "../../config";
import { useLanguage } from "../../lib/i18n";
import { Brand } from "./Brand";

/** Piè di pagina: logo, copyright, pagine legali, contatti diretti. */
export function Footer({ brandHref }: { brandHref?: string }) {
  const { nextLocaleName, cycleLocale, t } = useLanguage();

  return (
    <footer>
      <Brand href={brandHref} />
      <p>
        {site.footer.copyright}
        {/* In Italia il Codice Identificativo Nazionale va esposto sul sito. */}
        {site.brand.cin && <> · CIN {site.brand.cin}</>}
        {site.contact.vat && <> · P.IVA {site.contact.vat}</>}
      </p>
      <div>
        {site.legalPages.map((page) =>
          /* Alcuni clienti tengono le informative su un servizio esterno
             (Iubenda e simili): in quel caso si rimanda al loro documento
             invece di conservarne una copia che invecchia. */
          page.externalUrl ? (
            <a
              key={page.slug}
              href={page.externalUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t(page.title)}
            </a>
          ) : (
            <Link key={page.slug} href={`/${page.slug}`}>
              {t(page.title)}
            </Link>
          ),
        )}
        <a href={telUrl}>{site.contact.phoneDisplay}</a>
        {site.contact.phoneAlt && (
          <a href={`tel:+${site.contact.phoneAlt.number}`}>
            {site.contact.phoneAlt.display}
          </a>
        )}
        <a href={mailUrl}>Email</a>
        {site.contact.social?.map((profile) => (
          <a
            key={profile.href}
            href={profile.href}
            target="_blank"
            rel="noreferrer"
          >
            {profile.label}
          </a>
        ))}
        <button onClick={cycleLocale}>{nextLocaleName}</button>
      </div>
    </footer>
  );
}
