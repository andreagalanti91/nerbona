/**
 * GEOMETRIA DELLA MAPPA STILIZZATA
 * ================================
 * La sezione "territorio" disegna una mappa astratta: un punto per la
 * struttura al centro, un punto per ogni località, e una rotta tratteggiata
 * che li unisce.
 *
 * Nel progetto originale ogni località portava con sé quattro numeri calcolati
 * a mano (posizione x, posizione y, lunghezza della rotta, angolo) più altri
 * due per il telefono: sei valori da rifare a occhio per ogni nuovo cliente,
 * per ogni località.
 *
 * Qui bastano le coordinate geografiche. Posizione e rotta si calcolano.
 * Restano sovrascrivibili a mano quando si vuole rifinire la resa grafica:
 * la configurazione di Le Ville conserva infatti i valori originali, così la
 * mappa esistente è rimasta identica al pixel.
 */

import type { Destination } from "../config/types";

/** Dove sta il punto della struttura nel riquadro (vedi .map-home nel CSS). */
const HOME = { x: 45, y: 46 };

/** Proporzioni del riquadro della mappa (larghezza / altezza). */
const CANVAS_RATIO = { desktop: 1.06, mobile: 0.66 };

/** Quanto del riquadro occupa la località più lontana, in percentuale. */
const MAX_SPREAD = 42;

export interface ResolvedDestination {
  id: string;
  /** Stili inline del punto sulla mappa. */
  position: { left: string; top: string };
  /** Stili inline della rotta su schermo largo. */
  route: { width: string; transform: string };
  /** Stili inline della rotta su telefono. */
  mobileRoute: { width: string; transform: string };
}

/** Da coordinate geografiche a percentuali del riquadro. */
function projectToCanvas(
  destinations: Destination[],
  home: { lat: number; lng: number },
): Map<string, { x: number; y: number }> {
  const result = new Map<string, { x: number; y: number }>();

  const withCoords = destinations.filter((d) => d.coordinates);
  if (!withCoords.length) return result;

  /* Alle nostre latitudini un grado di longitudine è più corto di un grado di
     latitudine: senza questa correzione la mappa risulterebbe schiacciata. */
  const lngScale = Math.cos((home.lat * Math.PI) / 180);

  const offsets = withCoords.map((d) => ({
    id: d.id,
    dx: (d.coordinates!.lng - home.lng) * lngScale,
    dy: home.lat - d.coordinates!.lat, // sullo schermo y cresce verso il basso
  }));

  const furthest = Math.max(
    ...offsets.map((o) => Math.hypot(o.dx, o.dy)),
    Number.EPSILON,
  );

  for (const { id, dx, dy } of offsets) {
    result.set(id, {
      x: HOME.x + (dx / furthest) * MAX_SPREAD,
      y: HOME.y + (dy / furthest) * MAX_SPREAD,
    });
  }

  return result;
}

/**
 * Da posizione del punto a lunghezza e angolo della rotta.
 * La rotta parte dal punto della struttura, quindi è semplicemente il
 * segmento fra i due punti — espresso però in percentuale della LARGHEZZA
 * del riquadro, perché è così che il CSS interpreta `width`.
 */
function routeFrom(x: number, y: number, ratio: number) {
  const dx = x - HOME.x;
  const dy = (y - HOME.y) / ratio; // da % di altezza a % di larghezza
  return {
    width: `${Math.hypot(dx, dy).toFixed(1)}%`,
    transform: `rotate(${((Math.atan2(dy, dx) * 180) / Math.PI).toFixed(1)}deg)`,
  };
}

/**
 * Calcola tutto ciò che serve a disegnare la mappa.
 * I valori scritti a mano nella configurazione hanno sempre la precedenza.
 */
export function resolveDestinations(
  destinations: Destination[],
  home: { lat: number; lng: number },
): ResolvedDestination[] {
  const projected = projectToCanvas(destinations, home);

  return destinations.map((destination) => {
    const auto = projected.get(destination.id);
    const x = destination.position
      ? Number.parseFloat(destination.position.x)
      : (auto?.x ?? HOME.x);
    const y = destination.position
      ? Number.parseFloat(destination.position.y)
      : (auto?.y ?? HOME.y);

    return {
      id: destination.id,
      position: { left: `${x}%`, top: `${y}%` },
      route: destination.route
        ? {
            width: destination.route.length,
            transform: `rotate(${destination.route.angle})`,
          }
        : routeFrom(x, y, CANVAS_RATIO.desktop),
      mobileRoute: destination.mobileRoute
        ? {
            width: destination.mobileRoute.length,
            transform: `rotate(${destination.mobileRoute.angle})`,
          }
        : routeFrom(x, y, CANVAS_RATIO.mobile),
    };
  });
}
