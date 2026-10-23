"use client";

import Link from "next/link";
import { Fragment, useRef, useState } from "react";
import { accommodations, stayHref } from "../../lib/stay-routes";
import { useLanguage } from "../../lib/i18n";
import { SmartLink } from "../../lib/links";
import {
  scrollProgress,
  setVars,
  useScrollEffect,
  viewportHeight,
} from "../../lib/use-scroll-effect";
import type { StaysSection } from "../../config/types";
import { PictureImage } from "../Media";

/**
 * Carosello delle sistemazioni.
 *
 * Su schermi larghi lo scorrimento verticale della pagina viene tradotto in
 * scorrimento orizzontale del nastro di card: l'altezza della sezione viene
 * calcolata in JavaScript come "uno schermo + la larghezza da percorrere", e
 * il nastro trasla di conseguenza.
 *
 * Su telefono il nastro scorre invece con il dito, e l'unica cosa che serve è
 * capire quale card è in vista per aggiornare il contatore "03 / 09".
 *
 * L'elenco viene da site.accommodations: aggiungere una dimora significa
 * aggiungere un oggetto alla configurazione, niente altro.
 */
export function Stays({ section }: { section: StaysSection }) {
  const { t } = useLanguage();
  const track = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Con `only` la sezione mostra un sottoinsieme, nell'ordine indicato:
     è il caso della pagina di una singola sede. */
  const all = accommodations();
  const stays = section.only
    ? section.only.flatMap((slug) => all.filter((a) => a.slug === slug))
    : all;
  const lastIndex = stays.length - 1;

  /* L'indice attivo cambia raramente rispetto ai frame: tenerne una copia qui
     evita di chiamare setState a ogni frame di scorrimento. */
  const lastReported = useRef(-1);
  const report = (index: number) => {
    if (index === lastReported.current) return;
    lastReported.current = index;
    setActiveIndex(index);
  };

  const stage = useScrollEffect<HTMLElement>({
    onUpdate: (section) => {
      const rail = track.current;
      if (!rail) return;

      const isPhone = window.innerWidth <= 800;
      const tailPadding = window.innerWidth * (isPhone ? 0.12 : 0.08);
      const distance = Math.max(
        1,
        rail.scrollWidth - window.innerWidth + tailPadding,
      );

      /* Alta quanto uno schermo più la distanza orizzontale da coprire. */
      const height = viewportHeight() + distance;
      section.style.height = `${height}px`;

      const progress = scrollProgress(section, distance);
      const translate = -progress * distance;
      rail.style.transform = `translate3d(${translate}px,0,0)`;

      setVars(section, {
        "--stays-height": `${height}px`,
        "--stay-x": `${translate}px`,
        "--stay-progress": progress.toFixed(4),
      });

      if (isPhone) {
        /* Su telefono le card sono affiancate: si conta quante ne sono passate. */
        const first = rail.querySelector<HTMLElement>(".stay-chapter");
        const style = window.getComputedStyle(rail);
        const gap = Number.parseFloat(style.columnGap || style.gap) || 0;
        const step = Math.max(1, (first?.offsetWidth ?? 1) + gap);
        report(Math.min(lastIndex, Math.max(0, Math.round(-translate / step))));
      } else {
        report(Math.min(lastIndex, Math.round(progress * lastIndex)));
      }
    },
  });

  /* Scorrimento a dito su telefono: stesso contatore, sorgente diversa. */
  const onTouchScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (window.innerWidth > 800) return;
    const rail = event.currentTarget;
    const progress =
      rail.scrollLeft / Math.max(1, rail.scrollWidth - rail.clientWidth);
    if (stage.current) {
      setVars(stage.current, { "--stay-progress": progress.toFixed(4) });
    }
    const first = rail.querySelector<HTMLElement>(".stay-chapter");
    if (first) {
      report(
        Math.min(
          lastIndex,
          Math.round(rail.scrollLeft / Math.max(1, first.offsetWidth + 14)),
        ),
      );
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="stays-journey" id={section.id} ref={stage}>
      <div className="stays-sticky">
        <header className="stays-heading">
          <div>
            <p>{t(section.kicker)}</p>
            <h2>{t(section.title)}</h2>
          </div>
          <div className="stays-count">
            <b>{pad(activeIndex + 1)}</b>
            <span>/ {pad(stays.length)}</span>
          </div>
        </header>

        <div className="stays-track" ref={track} onScroll={onTouchScroll}>
          {stays.map((stay, index) => (
            <article className="stay-chapter" key={stay.slug}>
              <div className="stay-chapter-media">
                <figure className="stay-chapter-main">
                  <PictureImage
                    src={stay.cover}
                    alt={stay.name}
                    sizes="(max-width:800px) 92vw, 55vw"
                    eager
                    highPriority={index < 2}
                  />
                </figure>
                <figure className="stay-chapter-detail">
                  <PictureImage
                    src={stay.detail}
                    alt={stay.name}
                    sizes="(max-width:800px) 42vw, 19vw"
                    eager
                  />
                </figure>
                <span className="stay-chapter-number">{pad(index + 1)}</span>
              </div>

              <div className="stay-chapter-copy">
                <p className="stay-type">{t(stay.category)}</p>
                <h3>{stay.name}</h3>
                <p className="stay-description">{t(stay.blurb)}</p>

                <div className="stay-facts">
                  <span>
                    <small>{t(section.sizeLabel)}</small>
                    <b>{stay.size}</b>
                  </span>
                  <span>
                    <small>{t(section.guestsLabel)}</small>
                    <b>{stay.guests}</b>
                  </span>
                </div>

                <p className="stay-layout">{t(stay.layout)}</p>

                <Link href={stayHref(stay.slug)} className="stay-link">
                  <span>{t(section.linkLabel)}</span>
                  <i className="direction-mark" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}

          <div className="stays-end">
            <p>
              {section.endCard.lines.map((line, index) => (
                <Fragment key={index}>
                  {line}
                  {index < section.endCard.lines.length - 1 && <br />}
                </Fragment>
              ))}
            </p>
            <SmartLink href={section.endCard.cta.href}>
              <span>{t(section.endCard.cta.label)}</span>
              <i className="direction-mark" aria-hidden="true" />
            </SmartLink>
          </div>
        </div>

        <div className="stays-progress">
          <i />
          <span>{t(section.scrollHint)}</span>
        </div>
      </div>
    </section>
  );
}
