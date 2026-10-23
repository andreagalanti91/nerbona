"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useLanguage } from "../../lib/i18n";
import {
  prefersReducedMotion,
  scrollProgress,
  setVars,
  useScrollEffect,
  viewportHeight,
} from "../../lib/use-scroll-effect";
import type { StorySection } from "../../config/types";
import { FillImage } from "../Media";

/**
 * Sezione racconto.
 *
 * La sezione è alta più di uno schermo e il suo contenuto resta "appiccicato"
 * mentre si scorre. L'avanzamento dello scorrimento (0 → 1) viene tradotto in
 * variabili CSS che il foglio di stile usa per far salire il titolo, entrare
 * le foto e scoprire il testo. Il JavaScript calcola solo numeri: il come si
 * muovono le cose è tutto in parts/07-story.css.
 *
 * Su telefono la comparsa parte già avviata e va più veloce, altrimenti il
 * titolo resterebbe quasi fermo per tutta la sezione.
 */
export function Story({ section }: { section: StorySection }) {
  const { t } = useLanguage();

  const stage = useScrollEffect<HTMLElement>({
    onUpdate: (element) => {
      const distance = element.offsetHeight - viewportHeight();
      const progress = scrollProgress(element, distance);
      const isPhone = window.innerWidth <= 700;
      const reveal = isPhone ? Math.min(1, 0.18 + progress * 1.32) : progress;

      setVars(element, {
        "--story-p": progress.toFixed(3),
        "--story-title-y": `${(1 - reveal) * 115}px`,
        "--story-image-x": `${(1 - reveal) * 18}vw`,
        "--story-small-y": `${(1 - reveal) * 90}px`,
        "--story-clip": `${(1 - reveal) * 100}%`,
        "--story-fade": `${Math.min(1, reveal * 2.8)}`,
        "--story-copy-y": `${(1 - reveal) * (isPhone ? 20 : 75)}px`,
      });
    },

    /* Chi ha chiesto meno animazioni vede la sezione già nel suo stato finale. */
    onReducedMotion: (element) =>
      setVars(element, {
        "--story-p": "1",
        "--story-title-y": "0px",
        "--story-image-x": "0px",
        "--story-small-y": "0px",
        "--story-clip": "0%",
        "--story-fade": "1",
        "--story-copy-y": "0px",
      }),
  });

  /* Il cursore personalizzato segue il mouse e inclina leggermente le foto. */
  const trackPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const element = stage.current;
    if (!element || prefersReducedMotion()) return;
    const rect = element.getBoundingClientRect();
    setVars(element, {
      "--story-x": `${event.clientX}px`,
      "--story-y": `${event.clientY}px`,
      "--story-tilt-x": `${((event.clientX - rect.left) / rect.width - 0.5) * 14}px`,
      "--story-tilt-y": `${((event.clientY - rect.top) / rect.height - 0.5) * 10}px`,
    });
  };

  const title = [...section.titleLines.map(t), t(section.titleEmphasis)].join(
    " ",
  );

  return (
    <section
      className="story-stage"
      id={section.id}
      ref={stage}
      onPointerMove={trackPointer}
      onPointerEnter={() => stage.current?.classList.add("cursor-in")}
      onPointerLeave={() => stage.current?.classList.remove("cursor-in")}
    >
      <div className="story-sticky">
        <div className="story-ghost" aria-hidden="true">
          {section.ghost}
        </div>

        <p className="story-index">
          {section.number} <i /> {t(section.numberLabel)}
        </p>

        <div className="story-title" aria-label={title}>
          {section.titleLines.map((line, index) => (
            <span key={index}>{t(line)}</span>
          ))}
          <em>{t(section.titleEmphasis)}</em>
        </div>

        <div className="story-visual">
          <figure className="story-stone">
            <FillImage
              src={section.mainImage.src}
              alt={t(section.mainImage.alt)}
              sizes="(max-width: 700px) 90vw, 42vw"
            />
            <figcaption>{t(section.mainImage.caption)}</figcaption>
          </figure>

          <figure className="story-aerial">
            <FillImage
              src={section.aerialImage.src}
              alt={t(section.aerialImage.alt)}
              sizes="(max-width: 700px) 55vw, 24vw"
            />
            <span>{section.aerialImage.badge}</span>
          </figure>
        </div>

        <div className="story-manifesto">
          <span>{t(section.manifesto.label)}</span>
          <p>{t(section.manifesto.text)}</p>
        </div>

        <div className="story-cursor" aria-hidden="true">
          <span>{t(section.cursorLabel)}</span>
        </div>
      </div>
    </section>
  );
}
