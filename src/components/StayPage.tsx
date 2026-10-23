"use client";

import Link from "next/link";
import { bookingUrl, site, whatsappUrl } from "../config";
import { stayPageCopy } from "../lib/stay-routes";
import { useLanguage } from "../lib/i18n";
import type { Accommodation } from "../config/types";
import { PictureImage } from "./Media";
import { UnitGallery } from "./UnitGallery";
import { Brand } from "./layout/Brand";

/**
 * Pagina di dettaglio di una sistemazione: /sistemazioni/<slug> oppure /<slug>
 * (vedi `stayPath`).
 *
 * Se la voce raggruppa più appartamenti (`units`) con le loro foto, la pagina
 * li presenta uno per uno, ciascuno con galleria, descrizione e i propri
 * pulsanti di prenotazione e di richiesta informazioni: è la struttura che
 * gli ospiti si aspettano da un agriturismo con appartamenti dal nome
 * proprio. Altrimenti mostra la galleria della voce.
 */
export function StayPage({ stay }: { stay: Accommodation }) {
  const { t, switchLabel, cycleLocale } = useLanguage();
  const copy = stayPageCopy();
  const units = (stay.units ?? []).filter((unit) => unit.images?.length);

  /* WhatsApp con il nome dell'appartamento già scritto: chi scrive non deve
     spiegare di cosa sta parlando, e chi risponde lo sa subito. */
  const askUrl = (name: string) =>
    copy.askMessage
      ? `${whatsappUrl}?text=${encodeURIComponent(t(copy.askMessage).replace("{name}", name))}`
      : whatsappUrl;

  return (
    <main className="detail-page">
      <header className="detail-header">
        <Brand href="/" size={42} />
        <Link href="/#sistemazioni" className="detail-back">
          <i className="direction-mark reverse" aria-hidden="true" />
          <span>{t(copy.back)}</span>
        </Link>
        <button onClick={cycleLocale}>{switchLabel}</button>
      </header>

      <section className="detail-hero">
        <PictureImage src={stay.cover} alt={stay.name} sizes="100vw" priority />
        <div />
        <div className="detail-title">
          <p className="eyebrow light">{t(copy.kicker)}</p>
          <h1>{stay.name}</h1>
        </div>
      </section>

      <section className="detail-intro">
        <p>{t(stay.blurb)}</p>
        <p>{t(stay.description)}</p>
        <div>
          <span>
            <b>{stay.size}</b>
            {t(copy.sizeLabel)}
          </span>
          <span>
            <b>{stay.guests}</b>
            {t(copy.guestsLabel)}
          </span>
        </div>
      </section>

      {stay.amenities?.length ? (
        <section className="detail-amenities">
          {copy.amenitiesLabel && (
            <p className="eyebrow">{t(copy.amenitiesLabel)}</p>
          )}
          <ul>
            {stay.amenities.map((item, index) => (
              <li key={index}>{t(item)}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {units.length ? (
        <>
          {units.length > 1 && (
            <nav className="unit-index" aria-label={copy.unitsLabel ? t(copy.unitsLabel) : undefined}>
              {copy.unitsLabel && <p className="eyebrow">{t(copy.unitsLabel)}</p>}
              <div>
                {units.map((unit) => (
                  <a key={unit.slug} href={`#${unit.slug}`}>
                    {unit.name}
                  </a>
                ))}
              </div>
            </nav>
          )}

          <div className="unit-list">
            {units.map((unit, index) => (
              <article className="unit" id={unit.slug} key={unit.slug}>
                <UnitGallery images={unit.images!} name={unit.name} />
                <div className="unit-copy">
                  <p className="unit-number">
                    {String(index + 1).padStart(2, "0")} / {String(units.length).padStart(2, "0")}
                  </p>
                  <h2>{unit.name}</h2>
                  <p className="unit-layout">{t(unit.layout)}</p>
                  {unit.guests && (
                    <p className="unit-guests">
                      <b>{unit.guests}</b> {t(copy.guestsLabel)}
                    </p>
                  )}
                  <p className="unit-text">{t(unit.text)}</p>
                  {unit.tags?.length ? (
                    <ul className="unit-tags">
                      {unit.tags.map((tag, tagIndex) => (
                        <li key={tagIndex}>{t(tag)}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="unit-actions">
                    {(unit.bookingUrl ?? bookingUrl) && (
                      <a
                        className="editorial-button"
                        href={unit.bookingUrl ?? bookingUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t(site.booking?.label ?? copy.ctaLabel)}
                      </a>
                    )}
                    <a
                      className="unit-ask"
                      href={askUrl(unit.name)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t(copy.askLabel ?? copy.ctaLabel)}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <section className="detail-gallery">
          <p className="eyebrow">{t(copy.galleryLabel)}</p>
          <div>
            {stay.gallery.map((image, index) => (
              <figure key={image}>
                <PictureImage
                  src={image}
                  alt={`${stay.name} — ${index + 1}`}
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="detail-cta">
        <p className="eyebrow light">
          {site.brand.prefix} {site.brand.name}
        </p>
        <h2>{t(copy.ctaTitle)}</h2>
        {/* Con un motore di prenotazione la disponibilità si vede lì, in
            tempo reale: è l'azione principale e WhatsApp passa a secondario. */}
        <div className="detail-cta-actions">
          {bookingUrl && (
            <a
              className="button lime"
              href={bookingUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>{t(site.booking!.label)}</span>
              <i className="direction-mark" aria-hidden="true" />
            </a>
          )}
          <a
            className={bookingUrl ? "button ghost" : "button lime"}
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>{t(copy.ctaLabel)}</span>
            <i className="direction-mark" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
