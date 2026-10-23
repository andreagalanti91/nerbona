"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "../../lib/i18n";
import { SmartLink } from "../../lib/links";
import { accommodations, stayHref } from "../../lib/stay-routes";
import type { StayTabsSection } from "../../config/types";
import { FillImage } from "../Media";

/**
 * Alloggi a schede. Ogni scheda (per esempio una sede) mostra le sue
 * tipologie come card essenziali, in stile editoriale: foto, nome,
 * collegamento. Piano, camere, appartamenti e posti letto stanno nella
 * pagina della tipologia, dove servono davvero.
 *
 * Con una sola scheda la barra non compare: la sezione diventa un semplice
 * elenco di card, utile nelle pagine di una singola sede.
 *
 * Le schede seguono lo schema WAI-ARIA dei tab: frecce destra e sinistra
 * per spostarsi, un solo pannello visibile alla volta.
 */
export function StayTabs({ section }: { section: StayTabsSection }) {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const all = accommodations();

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = (active + step + section.tabs.length) % section.tabs.length;
    setActive(next);
    document.getElementById(`${section.id}-tab-${next}`)?.focus();
  };

  return (
    <section className="stay-tabs" id={section.id}>
      <header className="stay-tabs-heading">
        <p className="editorial-kicker">{t(section.kicker)}</p>
        <h2>{t(section.title)}</h2>
        {section.text && <p>{t(section.text)}</p>}
      </header>

      {section.tabs.length > 1 && (
        <div className="stay-tabs-bar" role="tablist">
          {section.tabs.map((tab, index) => (
            <button
              key={index}
              id={`${section.id}-tab-${index}`}
              role="tab"
              type="button"
              aria-selected={active === index}
              aria-controls={`${section.id}-panel-${index}`}
              tabIndex={active === index ? 0 : -1}
              className={active === index ? "active" : ""}
              onClick={() => setActive(index)}
              onKeyDown={onKeyDown}
            >
              {t(tab.label)}
            </button>
          ))}
        </div>
      )}

      {section.tabs.map((tab, index) => {
        const stays = tab.stays.flatMap((slug) =>
          all.filter((stay) => stay.slug === slug),
        );
        return (
          <div
            key={index}
            id={`${section.id}-panel-${index}`}
            role={section.tabs.length > 1 ? "tabpanel" : undefined}
            aria-labelledby={
              section.tabs.length > 1 ? `${section.id}-tab-${index}` : undefined
            }
            hidden={active !== index}
            className="stay-tabs-panel"
          >
            {tab.text && <p className="stay-tabs-intro">{t(tab.text)}</p>}

            {/* Il numero di card regola la larghezza della griglia: tre card restano
                strette e centrate, cinque stanno comunque su una riga. */}
            <div
              className="stay-tabs-grid"
              style={{ "--stay-count": stays.length } as React.CSSProperties}
            >
              {stays.map((stay) => (
                <article className="stay-tab-card" key={stay.slug}>
                  <Link href={stayHref(stay.slug)} className="stay-tab-media">
                    <FillImage
                      src={stay.cover}
                      alt={stay.name}
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 20vw"
                    />
                  </Link>
                  <p className="editorial-kicker">{t(stay.category)}</p>
                  <h3>
                    <Link href={stayHref(stay.slug)}>{stay.name}</Link>
                  </h3>
                  <Link className="editorial-button" href={stayHref(stay.slug)}>
                    {t(section.linkLabel)}
                  </Link>
                </article>
              ))}
            </div>

            {tab.link && (
              <div className="stay-tabs-more">
                <SmartLink className="editorial-button" href={tab.link.href}>
                  {t(tab.link.label)}
                </SmartLink>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
