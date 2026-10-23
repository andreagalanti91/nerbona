"use client";

import { useLanguage } from "../../lib/i18n";
import { SmartLink } from "../../lib/links";
import type { FeatureSection } from "../../config/types";
import { FillImage } from "../Media";

/**
 * Blocco a tutto schermo: una foto, una velatura, tre righe di testo.
 * Su Le Ville è la piscina panoramica, ma è volutamente generico: si può
 * usare più volte nella stessa pagina per raccontare la cantina, il ristorante,
 * il maneggio.
 */
export function Feature({ section }: { section: FeatureSection }) {
  const { t } = useLanguage();

  return (
    <section className="pool" id={section.id}>
      <FillImage
        src={section.image.src}
        alt={t(section.image.alt)}
        sizes="100vw"
      />
      <div className="pool-shade" />
      <div className="pool-copy">
        <p className="eyebrow light">{t(section.kicker)}</p>
        <h2>{t(section.title)}</h2>
        <p>{t(section.text)}</p>
        {section.cta && (
          <SmartLink className="button lime feature-cta" href={section.cta.href}>
            <span>{t(section.cta.label)}</span>
            <i className="direction-mark" aria-hidden="true" />
          </SmartLink>
        )}
      </div>
    </section>
  );
}
