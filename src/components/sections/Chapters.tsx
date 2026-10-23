"use client";

import { useLanguage } from "../../lib/i18n";
import { SmartLink } from "../../lib/links";
import {
  setVars,
  useScrollEffect,
  viewportHeight,
} from "../../lib/use-scroll-effect";
import type { ChaptersSection } from "../../config/types";
import { FillImage } from "../Media";

/**
 * Capitoli alternati, in stile editoriale: foto incorniciata da un lato,
 * dall'altro una parola gigante, tagliata dal bordo, che scivola di lato
 * mentre si scorre la pagina, e sotto il testo.
 *
 * Come nelle altre sezioni animate il JavaScript calcola solo un numero per
 * capitolo (--chapter-p, da 0 a 1: quanto il capitolo ha attraversato lo
 * schermo); lo spostamento è scritto in parts/20-editorial.css.
 */
export function Chapters({ section }: { section: ChaptersSection }) {
  const { t } = useLanguage();

  const stage = useScrollEffect<HTMLElement>({
    onUpdate: (element) => {
      const height = viewportHeight();
      element.querySelectorAll<HTMLElement>(".chapter").forEach((chapter) => {
        const rect = chapter.getBoundingClientRect();
        const progress = (height - rect.top) / (height + rect.height);
        setVars(chapter, {
          "--chapter-p": Math.min(1, Math.max(0, progress)).toFixed(4),
        });
      });
    },
    /* Chi ha chiesto meno animazioni vede le parole ferme a metà corsa. */
    onReducedMotion: (element) => {
      element.querySelectorAll<HTMLElement>(".chapter").forEach((chapter) => {
        setVars(chapter, { "--chapter-p": "0.5" });
      });
    },
  });

  return (
    <section className="chapters" id={section.id} ref={stage}>
      {(section.kicker || section.title) && (
        <header className="chapters-heading">
          {section.kicker && <p className="editorial-kicker">{t(section.kicker)}</p>}
          {section.title && <h2>{t(section.title)}</h2>}
        </header>
      )}

      {section.items.map((item, index) => (
        <article
          className={`chapter ${item.image ? "" : "no-image"}`}
          key={index}
        >
          {item.image && (
            <figure className="chapter-media">
              <FillImage
                src={item.image.src}
                alt={t(item.image.alt)}
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </figure>
          )}
          <div className="chapter-copy">
            <p className="chapter-word" aria-hidden="true">
              <span>{t(item.word)}</span>
            </p>
            <p className="editorial-kicker">{t(item.kicker)}</p>
            <h3>{t(item.title)}</h3>
            <p className="chapter-text">{t(item.text)}</p>
            {item.details && (
              <ul>
                {item.details.map((line, lineIndex) => (
                  <li key={lineIndex}>{t(line)}</li>
                ))}
              </ul>
            )}
            {item.link && (
              <SmartLink className="editorial-button" href={item.link.href}>
                {t(item.link.label)}
              </SmartLink>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
