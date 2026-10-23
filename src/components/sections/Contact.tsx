"use client";

import { Fragment } from "react";

import { bookingUrl, mailUrl, site, whatsappUrl } from "../../config";
import { useLanguage } from "../../lib/i18n";
import type { ContactSection } from "../../config/types";
import { FillImage } from "../Media";

/** Blocco finale: foto, invito, WhatsApp ed email, indirizzo. */
export function Contact({ section }: { section: ContactSection }) {
  const { t } = useLanguage();

  return (
    <section className="contact" id={section.id}>
      <div className="contact-image">
        <FillImage
          src={section.image.src}
          alt={t(section.image.alt)}
          sizes="(max-width:1080px) 100vw, 45vw"
          className="contact-photo"
          quality={95}
        />
      </div>

      <div className="contact-copy">
        <p className="eyebrow light">{t(section.kicker)}</p>
        <h2>{t(section.title)}</h2>
        <p>{t(section.text)}</p>

        <div className="contact-actions">
          {/* Quando c'è un motore di prenotazione è l'azione principale:
              prende il pulsante pieno e WhatsApp passa a secondario. */}
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
            <span>{t(section.whatsappLabel)}</span>
            <i className="direction-mark" aria-hidden="true" />
          </a>
          <a className="button ghost" href={mailUrl}>
            <span>{t(section.emailLabel)}</span>
            <i className="direction-mark" aria-hidden="true" />
          </a>
        </div>

        {/* Per un ristorante gli orari sono la prima cosa che si cerca:
            stanno prima dell'indirizzo, non in fondo alla pagina. */}
        {section.opening && (
          <div className="contact-hours">
            <p>{t(section.opening.label)}</p>
            <dl>
              {section.opening.rows.map((row, index) => (
                <div key={index}>
                  <dt>{t(row.days)}</dt>
                  <dd>{t(row.hours)}</dd>
                </div>
              ))}
            </dl>
            {section.opening.note && <small>{t(section.opening.note)}</small>}
          </div>
        )}

        <address>
          {site.contact.address.map((line, index) => (
            <Fragment key={index}>
              {line}
              {index < site.contact.address.length - 1 && <br />}
            </Fragment>
          ))}
        </address>
      </div>
    </section>
  );
}
