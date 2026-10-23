"use client";

import { useLanguage } from "../../lib/i18n";
import type { FactsSection } from "../../config/types";
import { FillImage } from "../Media";

/**
 * Informazioni pratiche: titolo fermo a sinistra, elenco a destra. Pensato
 * per le risposte che si cercano prima di prenotare, da leggere di corsa.
 */
export function Facts({ section }: { section: FactsSection }) {
  const { t } = useLanguage();

  return (
    <section className="facts" id={section.id}>
      <div className="facts-aside">
        <p className="editorial-kicker">{t(section.kicker)}</p>
        <h2>{t(section.title)}</h2>
        {section.text && <p>{t(section.text)}</p>}
        {section.image && (
          <figure className="facts-media">
            <FillImage
              src={section.image.src}
              alt={t(section.image.alt)}
              sizes="(max-width: 900px) 100vw, 35vw"
            />
          </figure>
        )}
      </div>

      <dl className="facts-list">
        {section.items.map((item, index) => (
          <div key={index}>
            <dt>{t(item.label)}</dt>
            <dd>
              <b>{t(item.value)}</b>
              {item.note && <span>{t(item.note)}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
