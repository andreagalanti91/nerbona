"use client";

import { useLanguage } from "../../lib/i18n";
import { SmartLink } from "../../lib/links";
import type { Review, ReviewsSection } from "../../config/types";

/**
 * Recensioni degli ospiti.
 *
 * Il testo è trascritto in configurazione invece di mostrare schermate dei
 * portali: si legge su telefono, si traduce, e lo leggono anche i motori di
 * ricerca. In fondo i collegamenti ai portali, per chi vuole verificarle.
 *
 * Due impaginazioni: "grid", schede affiancate, adatta a un estratto in
 * homepage; "editorial", per la pagina dedicata: punteggi in testa, la prima
 * recensione in grande, le altre in un elenco sobrio a due colonne.
 */
export function Reviews({ section }: { section: ReviewsSection }) {
  const { t } = useLanguage();
  const editorial = section.layout === "editorial";
  const [featured, ...others] = section.items;

  const renderReview = (review: Review, index: number) => (
    <figure className="review" key={index}>
      <div className="review-top">
        <span>{review.source}</span>
        {review.score && <b>{review.score}</b>}
      </div>
      {review.title && <h3>{t(review.title)}</h3>}
      <blockquote>{t(review.quote)}</blockquote>
      <figcaption>
        <b>{review.author}</b>
        {review.date && <span>{t(review.date)}</span>}
      </figcaption>
    </figure>
  );

  return (
    <section
      className={`reviews-section ${editorial ? "reviews-editorial" : ""}`}
      id={section.id}
    >
      <header className="cards-heading">
        <p className={editorial ? "editorial-kicker" : "eyebrow"}>
          {t(section.kicker)}
        </p>
        <h2>{t(section.title)}</h2>
        {section.text && <p>{t(section.text)}</p>}
      </header>

      {section.summary && (
        <dl className="reviews-summary">
          {section.summary.map((item, index) => (
            <div key={index}>
              <dt>{t(item.label)}</dt>
              <dd>{item.score}</dd>
            </div>
          ))}
        </dl>
      )}

      {editorial && featured ? (
        <>
          <figure className="review-featured">
            <blockquote>{t(featured.quote)}</blockquote>
            <figcaption>
              <b>{featured.author}</b>
              <span>
                {featured.source}
                {featured.score && ` · ${featured.score}`}
                {featured.date && ` · ${t(featured.date)}`}
              </span>
            </figcaption>
          </figure>
          <div className="reviews-list">{others.map(renderReview)}</div>
        </>
      ) : (
        <div className="reviews-grid">{section.items.map(renderReview)}</div>
      )}

      {section.links && (
        <div className="reviews-links">
          {section.links.map((link, index) => (
            <SmartLink
              key={index}
              className={editorial ? "editorial-button" : "button ghost"}
              href={link.href}
            >
              <span>{t(link.label)}</span>
              {!editorial && (
                <i className="direction-mark" aria-hidden="true" />
              )}
            </SmartLink>
          ))}
        </div>
      )}
    </section>
  );
}
