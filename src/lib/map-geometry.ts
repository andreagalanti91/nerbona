/**
 * GEOMETRIA DELLA MAPPA DEL TERRITORIO
 * ====================================
 * La sezione "territorio" disegna una mappa radiale: la struttura al centro,
 * ogni località nella sua direzione vera, a una distanza proporzionale alla
 * radice quadrata dei chilometri.
 *
 * Perché la radice quadrata: con una scala lineare la località più lontana
 * (Firenze, a 45 km) schiaccia tutte le altre attorno al centro, e i borghi a
 * cinque o dieci chilometri finiscono uno sopra l'altro. La radice allarga i
 * vicini e avvicina i lontani, senza cambiare l'ordine né la direzione.
 * Gli anelli di distanza seguono la stessa scala, quindi la mappa resta
 * leggibile: un punto dentro l'anello dei 10 km è davvero a meno di 10 km.
 *
 * Tutto è espresso in percentuale del riquadro quadrato della mappa.
 * Una località con `position` scritta a mano ignora il calcolo.
 */

import type { Destination } from "../config/types";

/** Centro della mappa, dove sta la struttura. */
export const HOME = { x: 50, y: 50 };

/** Raggio occupato dalla località più lontana. */
const MAX_RADIUS = 40;

/** Distanza verticale minima fra due etichette dalla stessa parte. */
const LABEL_GAP = 6.5;

export interface PlacedDestination {
  id: string;
  /** Posizione del punto. */
  x: number;
  y: number;
  /** Da che parte del punto sta l'etichetta. */
  side: "left" | "right";
  /** Altezza dell'etichetta, spostata se si sovrapponeva a un'altra. */
  labelY: number;
}

/** Distanza in linea d'aria, in chilometri (formula dell'emisenoverso). */
export function kmBetween(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Chilometri in linea d'aria della località più lontana. */
export function furthestKm(
  destinations: Destination[],
  home: { lat: number; lng: number },
): number {
  return Math.max(
    ...destinations
      .filter((d) => d.coordinates)
      .map((d) => kmBetween(home, d.coordinates!)),
    1,
  );
}

/** Raggio, in percentuale del riquadro, che corrisponde a una distanza. */
export function radiusFor(km: number, maxKm: number): number {
  return Math.sqrt(Math.min(km, maxKm) / maxKm) * MAX_RADIUS;
}

/**
 * Le etichette dalla stessa parte non devono toccarsi: si scorrono dall'alto
 * in basso e ognuna scende quanto basta sotto la precedente.
 */
function spreadLabels(placed: PlacedDestination[]) {
  for (const side of ["left", "right"] as const) {
    const column = placed
      .filter((p) => p.side === side)
      .sort((a, b) => a.labelY - b.labelY);
    for (let i = 1; i < column.length; i++) {
      const min = column[i - 1].labelY + LABEL_GAP;
      if (column[i].labelY < min) column[i].labelY = min;
    }
  }
}

/** Calcola posizione di punti ed etichette. */
export function placeDestinations(
  destinations: Destination[],
  home: { lat: number; lng: number },
): PlacedDestination[] {
  const maxKm = furthestKm(destinations, home);
  /* Alle nostre latitudini un grado di longitudine è più corto di uno di
     latitudine: senza correzione le direzioni risulterebbero storte. */
  const lngScale = Math.cos((home.lat * Math.PI) / 180);

  const placed = destinations.map((d) => {
    let x = HOME.x;
    let y = HOME.y;
    if (d.position) {
      x = Number.parseFloat(d.position.x);
      y = Number.parseFloat(d.position.y);
    } else if (d.coordinates) {
      const dx = (d.coordinates.lng - home.lng) * lngScale;
      const dy = home.lat - d.coordinates.lat; // sullo schermo y scende
      const angle = Math.atan2(dy, dx);
      const r = radiusFor(kmBetween(home, d.coordinates), maxKm);
      x = HOME.x + Math.cos(angle) * r;
      y = HOME.y + Math.sin(angle) * r;
    }
    /* L'etichetta va verso l'esterno, così non copre il centro; vicino ai
       bordi si gira verso l'interno per non uscire dal riquadro. */
    let side: "left" | "right" = x < HOME.x ? "left" : "right";
    if (x > 74) side = "left";
    if (x < 26) side = "right";
    return { id: d.id, x, y, side, labelY: y };
  });

  spreadLabels(placed);
  return placed;
}
