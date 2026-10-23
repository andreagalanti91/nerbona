"use client";

import { useLanguage } from "../../lib/i18n";
import { SmartLink } from "../../lib/links";
import type { ProseSection } from "../../config/types";
import { FillImage } from "../Media";

/** Testo lungo: un titolo, qualche paragrafo, eventuali collegamenti. */
export function Prose({ section }: { section: ProseSection }) {
  const { t } = useLanguage();

  return (
    <section
      className={`prose-section ${section.image ? "has-image" : ""}`}
      id={section.id}
    >
      <div className="prose-copy">
        <p className="eyebrow">{t(section.kicker)}</p>
        <h2>{t(section.title)}</h2>
        {section.paragraphs.map((paragraph, index) => (
          <p key={index}>{t(paragraph)}</p>
        ))}
        {section.links && (
          <ul className="prose-links">
            {section.links.map((link, index) => (
              <li key={index}>
                <SmartLink href={link.href}>
                  <span>{t(link.label)}</span>
                  <i className="direction-mark" aria-hidden="true" />
                </SmartLink>
              </li>
            ))}
          </ul>
        )}
      </div>
      {section.image && (
        <div className="prose-media">
          <FillImage
            src={section.image.src}
            alt={t(section.image.alt)}
            sizes="(max-width: 1000px) 100vw, 45vw"
          />
        </div>
      )}
    </section>
  );
}
