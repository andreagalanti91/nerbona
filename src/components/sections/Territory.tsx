"use client";

import { Fragment, useState } from "react";
import { site } from "../../config";
import { useLanguage } from "../../lib/i18n";
import {
  HOME,
  furthestKm,
  placeDestinations,
  radiusFor,
} from "../../lib/map-geometry";
import type { TerritorySection } from "../../config/types";

/**
 * Mappa delle distanze.
 *
 * Radiale: la struttura al centro, ogni località nella sua direzione vera,
 * anelli di distanza attorno. La geometria (scala a radice quadrata,
 * etichette che non si sovrappongono) sta in src/lib/map-geometry.ts.
 *
 * Le linee sono un SVG che si adatta al riquadro; punti ed etichette sono
 * HTML posizionato in percentuale, così il testo resta leggibile a
 * qualsiasi dimensione dello schermo. Tutto il disegno sta in .tmap-plot,
 * un quadrato che sul telefono il CSS rimpicciolisce e sposta a sinistra
 * per lasciare spazio ai nomi a destra.
 *
 * Accanto, l'elenco delle località ordinate per distanza: passando sopra una
 * voce (o sopra un punto) le due si illuminano insieme.
 */
export function Territory({ section }: { section: TerritorySection }) {
  const { t } = useLanguage();
  const [active, setActive] = useState<string | null>(null);

  const home = site.contact.coordinates;
  const maxKm = furthestKm(section.items, home);
  const placed = placeDestinations(section.items, home);
  const rings = (section.rings ?? []).filter((ring) => ring.km < maxKm);

  const byDistance = [...section.items].sort(
    (a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance),
  );

  return (
    <section className="territory-map tmap-section" id={section.id}>
      <div className="territory-copy">
        <p className="eyebrow">{t(section.kicker)}</p>
        <h2>{t(section.title)}</h2>
        <p>{t(section.text)}</p>

        <ol className="tmap-list" aria-label={t(section.legend.destinations)}>
          {byDistance.map((item) => (
            <li
              key={item.id}
              className={active === item.id ? "active" : ""}
              onMouseEnter={() => setActive(item.id)}
              onMouseLeave={() => setActive(null)}
            >
              <b>{t(item.name)}</b>
              <span>{item.distance}</span>
            </li>
          ))}
        </ol>
        <span className="tmap-disclaimer">{t(section.disclaimer)}</span>
      </div>

      <div
        className={`tmap ${active ? "has-active" : ""}`}
        role="img"
        aria-label={t(section.mapLabel)}
      >
        <div className="tmap-plot">
          <svg
            className="tmap-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {[20, 40, 60, 80].map((v) => (
              <Fragment key={v}>
                <line x1={v} y1="0" x2={v} y2="100" className="tmap-grid" />
                <line x1="0" y1={v} x2="100" y2={v} className="tmap-grid" />
              </Fragment>
            ))}
            {rings.map((ring) => (
              <circle
                key={ring.km}
                cx={HOME.x}
                cy={HOME.y}
                r={radiusFor(ring.km, maxKm)}
                className="tmap-ring"
              />
            ))}
            {placed.map((point) => (
              <line
                key={point.id}
                x1={HOME.x}
                y1={HOME.y}
                x2={point.x}
                y2={point.y}
                className={`tmap-route ${active === point.id ? "active" : ""}`}
              />
            ))}
            {/* Etichetta spostata per non sovrapporsi: un filo la riporta al
              suo punto. */}
            {placed
              .filter((point) => Math.abs(point.labelY - point.y) > 1)
              .map((point) => (
                <line
                  key={`leader-${point.id}`}
                  x1={point.x}
                  y1={point.y}
                  x2={point.x + (point.side === "right" ? 1.4 : -1.4)}
                  y2={point.labelY}
                  className="tmap-leader"
                />
              ))}
          </svg>

          {rings.map((ring) => (
            <span
              key={ring.km}
              className="tmap-ring-label"
              style={{ top: `${HOME.y + radiusFor(ring.km, maxKm)}%` }}
            >
              {ring.label}
            </span>
          ))}

          <div
            className="tmap-home"
            style={{ left: `${HOME.x}%`, top: `${HOME.y}%` }}
          >
            <i />
            <span>
              <b>
                {section.homeLabel.lines.map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    {index < section.homeLabel.lines.length - 1 && " "}
                  </Fragment>
                ))}
              </b>
              <small>{section.homeLabel.sub}</small>
            </span>
          </div>

          {section.items.map((item, index) => {
            const point = placed[index];
            return (
              <Fragment key={item.id}>
                <i
                  className={`tmap-dot ${active === item.id ? "active" : ""}`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                />
                <span
                  className={`tmap-label ${point.side} ${active === item.id ? "active" : ""}`}
                  style={{ left: `${point.x}%`, top: `${point.labelY}%` }}
                  onMouseEnter={() => setActive(item.id)}
                  onMouseLeave={() => setActive(null)}
                >
                  <b>{t(item.name)}</b>
                  <small>{item.distance}</small>
                </span>
              </Fragment>
            );
          })}
        </div>

        <span className="tmap-coord tmap-coord-x">{section.gridLabels.x}</span>
        <span className="tmap-coord tmap-coord-y">{section.gridLabels.y}</span>

        <div className="tmap-key">
          <span>
            <i />
            {section.legend.home}
          </span>
          <span>
            <i />
            {t(section.legend.destinations)}
          </span>
          <small>{t(section.legend.note)}</small>
        </div>
      </div>
    </section>
  );
}
