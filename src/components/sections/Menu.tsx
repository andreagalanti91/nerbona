"use client";

import { asset } from "../../config";
import { useLanguage } from "../../lib/i18n";
import type { MenuSection } from "../../config/types";

/**
 * Sezione menù.
 *
 * Due modi di mostrarlo, combinabili:
 *  - `documents`: i PDF del menù e della carta dei vini, come pulsanti. È
 *    il caso più comune, perché quei file cambiano di stagione e il cliente
 *    li aggiorna da solo senza toccare il sito.
 *  - `courses`: un estratto in pagina, qualche piatto per portata. Serve ai
 *    motori di ricerca, che dai PDF non leggono niente, e a chi apre il sito
 *    dal telefono e non vuole scaricare un allegato.
 *
 * `href` può essere un indirizzo esterno oppure un file del cliente
 * (es. "documenti/menu.pdf"): in quel caso passa da asset() come le immagini.
 */
export function Menu({ section }: { section: MenuSection }) {
  const { t } = useLanguage();
  const currency = section.currency ?? "";

  const linkFor = (href: string) =>
    /^(https?:|\/|mailto:|tel:)/.test(href) ? href : asset(href);

  return (
    <section className="menu-stage" id={section.id}>
      <header className="menu-intro">
        <p className="eyebrow">{t(section.kicker)}</p>
        <h2>{t(section.title)}</h2>
        {section.text && <p>{t(section.text)}</p>}
      </header>

      {section.courses && section.courses.length > 0 && (
        <div className="menu-courses">
          {section.courses.map((course, index) => (
            <div className="menu-course" key={index}>
              <h3>{t(course.title)}</h3>
              {course.note && (
                <p className="menu-course-note">{t(course.note)}</p>
              )}
              <ul>
                {course.dishes.map((dish, dishIndex) => (
                  <li key={dishIndex}>
                    <span className="menu-dish">
                      <b>{t(dish.name)}</b>
                      {dish.detail && <small>{t(dish.detail)}</small>}
                    </span>
                    {dish.price && (
                      <span className="menu-price">
                        {currency}
                        {dish.price}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {section.documents && section.documents.length > 0 && (
        <div className="menu-documents">
          {section.documents.map((document, index) => (
            <a
              key={index}
              className={index === 0 ? "button lime" : "button ghost"}
              href={linkFor(document.href)}
              target="_blank"
              rel="noreferrer"
            >
              <span>{t(document.label)}</span>
              <i className="direction-mark" aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
