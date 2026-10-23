"use client";

/**
 * ANIMAZIONI LEGATE ALLO SCROLL
 * =============================
 * Le sezioni "racconto" e "sistemazioni" avevano ciascuna la propria copia
 * dello stesso impianto: listener di scroll e resize, requestAnimationFrame
 * per non calcolare più volte per frame, cleanup, e il controllo di
 * prefers-reduced-motion. Erano ~40 righe duplicate.
 *
 * Qui l'impianto è uno solo. Ogni sezione fornisce soltanto la funzione che
 * traduce l'avanzamento dello scroll in variabili CSS.
 *
 * Come funziona: il calcolo scrive variabili CSS sull'elemento (--story-p,
 * --stay-x...), e il foglio di stile le usa per posizionare le cose. Il
 * JavaScript non tocca mai direttamente il layout, quindi l'animazione resta
 * fluida e resta tutta descritta nel CSS.
 */

import { useEffect, useRef, type RefObject } from "react";

/** Vero se l'utente ha chiesto al sistema di ridurre le animazioni. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Altezza realmente visibile, che su iOS differisce da window.innerHeight. */
export function viewportHeight(): number {
  return window.visualViewport?.height ?? window.innerHeight;
}

interface Options<T extends HTMLElement> {
  /** Chiamata a ogni frame utile, con l'elemento della sezione. */
  onUpdate: (element: T) => void;
  /**
   * Chiamata al posto di `onUpdate` quando l'utente ha ridotto le animazioni.
   * Serve a mettere la sezione direttamente nel suo stato finale.
   */
  onReducedMotion?: (element: T) => void;
}

/**
 * Aggancia un calcolo a scroll e resize, al massimo una volta per frame.
 * Restituisce il ref da mettere sulla sezione.
 */
export function useScrollEffect<T extends HTMLElement>({
  onUpdate,
  onReducedMotion,
}: Options<T>): RefObject<T | null> {
  const ref = useRef<T>(null);

  /* I callback vivono in un ref così l'effetto non si riaggancia a ogni
     render: i listener vengono registrati una volta sola. */
  const handlers = useRef({ onUpdate, onReducedMotion });
  handlers.current = { onUpdate, onReducedMotion };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      handlers.current.onReducedMotion?.(element);
      if (handlers.current.onReducedMotion) return;
    }

    let frame = 0;
    const run = () => {
      frame = 0;
      handlers.current.onUpdate(element);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };

    run();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return ref;
}

/**
 * Quanto la sezione è avanzata rispetto allo scroll, da 0 a 1.
 * `distance` è quanti pixel di scroll coprono l'intera animazione.
 */
export function scrollProgress(element: HTMLElement, distance: number): number {
  const top = element.getBoundingClientRect().top;
  return Math.min(1, Math.max(0, -top / Math.max(1, distance)));
}

/** Scrive più variabili CSS in una volta. */
export function setVars(
  element: HTMLElement,
  vars: Record<string, string>,
): void {
  for (const [name, value] of Object.entries(vars)) {
    element.style.setProperty(name, value);
  }
}
