"use client";

import { useLanguage } from "../../lib/i18n";
import type { TrailSection } from "../../config/types";
import { FillImage } from "../Media";

/**
 * Blocco a due colonne: una foto grande con un dettaglio sovrapposto, e una
 * colonna di testo aperta da un numero molto grande.
 * Su Le Ville è il percorso natura; funziona per qualsiasi numero da mettere
 * in evidenza (ettari di vigna, anni di storia, chilometri di sentieri).
 */
export function Trail({ section }: { section: TrailSection }) {
  const { t } = useLanguage();

  return (
    <section className="trail" id={section.id}>
      <div className="trail-image">
        <FillImage
          src={section.mainImage.src}
          alt={t(section.mainImage.alt)}
          sizes="(max-width:800px) 100vw, 55vw"
          className="trail-main-photo"
          quality={95}
        />
        <figure className="trail-detail">
          <FillImage
            src={section.detailImage.src}
            alt={t(section.detailImage.alt)}
            sizes="(max-width:800px) 38vw, 18vw"
            quality={95}
          />
        </figure>
      </div>

      <div className="trail-copy">
        <span className="big-number">
          {section.number}
          <small>{section.numberUnit}</small>
        </span>
        <p className="eyebrow">{t(section.kicker)}</p>
        <h2>{t(section.title)}</h2>
        <p>{t(section.text)}</p>
        <div className="trail-line">
          <span>{t(section.startLabel)}</span>
          <i />
          <span>{t(section.endLabel)}</span>
        </div>
      </div>
    </section>
  );
}
