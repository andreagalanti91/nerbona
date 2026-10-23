"use client";

import { useLanguage } from "../../lib/i18n";
import { SmartLink } from "../../lib/links";
import type { CardsSection } from "../../config/types";
import { FillImage } from "../Media";

/**
 * Griglia di schede: servizi, esperienze, attività.
 *
 * Le card impilate delle esperienze funzionano bene con tre voci; con dieci
 * diventerebbero una pagina interminabile. Qui ogni voce occupa una cella
 * della griglia e la foto è facoltativa, così servizi senza immagine
 * ("Parcheggio", "Wi-Fi") stanno accanto agli altri senza buchi.
 */
export function Cards({ section }: { section: CardsSection }) {
  const { t } = useLanguage();

  return (
    <section
      className={`cards-section ${section.tone === "dark" ? "cards-dark" : ""}`}
      id={section.id}
    >
      <header className="cards-heading">
        <p className={`eyebrow ${section.tone === "dark" ? "light" : ""}`}>
          {t(section.kicker)}
        </p>
        <h2>{t(section.title)}</h2>
        {section.text && <p>{t(section.text)}</p>}
      </header>

      <div className="cards-grid">
        {section.items.map((item, index) => (
          <article
            className={`card ${item.image ? "has-image" : ""}`}
            key={index}
          >
            {item.image && (
              <div className="card-media">
                <FillImage
                  src={item.image.src}
                  alt={t(item.image.alt)}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="card-copy">
              {item.meta && <p className="card-meta">{t(item.meta)}</p>}
              <h3>{t(item.title)}</h3>
              <p>{t(item.text)}</p>
              {item.details && (
                <ul>
                  {item.details.map((line, lineIndex) => (
                    <li key={lineIndex}>{t(line)}</li>
                  ))}
                </ul>
              )}
              {item.link && (
                <SmartLink className="card-link" href={item.link.href}>
                  <span>{t(item.link.label)}</span>
                  <i className="direction-mark" aria-hidden="true" />
                </SmartLink>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
