"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useLanguage } from "../../lib/i18n";
import { SmartLink } from "../../lib/links";
import { prefersReducedMotion, setVars } from "../../lib/use-scroll-effect";
import type { ExperiencesSection } from "../../config/types";
import { FillImage } from "../Media";

/**
 * Card esperienze impilate.
 *
 * Ogni card segue il puntatore con un alone di luce e una leggera parallasse.
 * Il calcolo scrive quattro variabili CSS sulla card; posizione e intensità
 * dell'alone sono definite in parts/09-experiences.css.
 *
 * Le classi exp-card-1/2/3 sono usate dal CSS per dare a ogni card un
 * inquadramento diverso della foto. Con più di tre esperienze le successive
 * ricadono sullo stile base: se un cliente ne ha di più, vanno aggiunte le
 * regole corrispondenti.
 */
export function Experiences({ section }: { section: ExperiencesSection }) {
  const { t } = useLanguage();

  const trackPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setVars(card, {
      "--exp-x": `${x}px`,
      "--exp-y": `${y}px`,
      "--exp-dx": `${(x / rect.width - 0.5) * 14}px`,
      "--exp-dy": `${(y / rect.height - 0.5) * 10}px`,
    });
  };

  return (
    <section className="exp-stage" id={section.id}>
      <header className="exp-intro">
        <p className="exp-kicker">{t(section.kicker)}</p>
        <h2>{t(section.title)}</h2>
        <p>{t(section.intro)}</p>

        {/* Il testo è ripetuto due volte perché lo scorrimento è continuo:
            la seconda copia entra da destra mentre la prima esce a sinistra. */}
        <div className="exp-marquee" aria-hidden="true">
          <span>{t(section.marquee)}</span>
          <span>{t(section.marquee)}</span>
        </div>
      </header>

      <div className="exp-stack">
        {section.items.map((experience, index) => (
          <article
            className={`exp-card exp-card-${index + 1}`}
            key={experience.title}
            onPointerMove={trackPointer}
          >
            <div className="exp-media">
              <FillImage
                src={experience.image}
                alt={experience.title}
                sizes="100vw"
              />
            </div>
            <div className="exp-veil" />
            <div className="exp-light" />

            <span className="exp-word" aria-hidden="true">
              {t(experience.word)}
            </span>

            <div className="exp-top">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{t(experience.meta)}</span>
            </div>

            <div className="exp-copy">
              <p>
                {t(section.itemLabel)} {String(index + 1).padStart(2, "0")}
              </p>
              <h3>{experience.title}</h3>
              <p>{t(experience.text)}</p>
              <SmartLink href={section.ctaHref}>
                <span>{t(section.ctaLabel)}</span>
                <i>
                  <b className="direction-mark" aria-hidden="true" />
                </i>
              </SmartLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
