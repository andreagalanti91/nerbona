"use client";

import { Fragment } from "react";
import { site } from "../../config";
import { useLanguage } from "../../lib/i18n";
import { resolveDestinations } from "../../lib/map-geometry";
import type { TerritorySection } from "../../config/types";

/**
 * Mappa stilizzata delle distanze.
 *
 * Non è una mappa reale: è un disegno astratto con un punto per la struttura,
 * un punto per ogni località e una rotta tratteggiata fra i due. Posizioni e
 * rotte arrivano da src/lib/map-geometry.ts, che le calcola dalle coordinate
 * geografiche quando non sono state scritte a mano nella configurazione.
 *
 * Le rotte sono due per ogni località, una per schermi larghi e una per
 * telefono, perché il riquadro cambia proporzioni: il CSS ne mostra una sola
 * per volta.
 */
export function Territory({ section }: { section: TerritorySection }) {
  const { t } = useLanguage();
  const destinations = resolveDestinations(
    section.items,
    site.contact.coordinates,
  );

  return (
    <section className="territory-map" id={section.id}>
      <div className="territory-copy">
        <p className="eyebrow">{section.kicker}</p>
        <h2>{t(section.title)}</h2>
        <p>{t(section.text)}</p>
        <span>{t(section.disclaimer)}</span>
      </div>

      <div className="map-canvas" role="img" aria-label={t(section.mapLabel)}>
        <div className="map-grid" />
        <div className="map-silhouette" />
        <div className="map-radar map-radar-one" />
        <div className="map-radar map-radar-two" />

        <div className="map-coordinate map-coordinate-x">
          {section.gridLabels.x}
        </div>
        <div className="map-coordinate map-coordinate-y">
          {section.gridLabels.y}
        </div>

        {/* Le rotte stanno sotto ai punti, quindi vengono disegnate prima. */}
        {destinations.map((destination) => (
          <Fragment key={`route-${destination.id}`}>
            <div
              className="map-route map-route-desktop"
              style={destination.route}
            >
              <i />
            </div>
            <div
              className="map-route map-route-mobile"
              style={destination.mobileRoute}
            >
              <i />
            </div>
          </Fragment>
        ))}

        <div className="map-home">
          <i />
          <span>
            <b>
              {section.homeLabel.lines.map((line, index) => (
                <Fragment key={index}>
                  {line}
                  {index < section.homeLabel.lines.length - 1 && <br />}
                </Fragment>
              ))}
            </b>
            <small>{section.homeLabel.sub}</small>
          </span>
        </div>

        {section.items.map((item, index) => (
          <div
            className={`map-place place-${item.id}`}
            style={destinations[index].position}
            key={item.id}
          >
            <i />
            <span>
              <b>{t(item.name)}</b>
              <small>{item.distance}</small>
            </span>
          </div>
        ))}

        <div className="map-key">
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
