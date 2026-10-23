"use client";

import Image from "next/image";
import { asset } from "../config";

/**
 * IMMAGINI
 * ========
 * Due componenti, e la differenza è importante.
 *
 * Le immagini di questo sito usano `fill`: si distendono per riempire
 * l'antenato posizionato più vicino. Basta interporre un elemento non
 * posizionato perché l'immagine "scappi" fuori dal suo riquadro.
 *
 * - FillImage: il caso normale. L'immagine è figlia diretta del contenitore.
 * - PictureImage: aggiunge un wrapper <picture> per poter servire un file
 *   diverso su telefono. Il CSS lo posiziona esplicitamente
 *   (parts/15-refinements-media.css), ma solo per quattro contesti precisi:
 *   card e dettaglio del carosello, hero e galleria della pagina sistemazione.
 *   Fuori da quelli, usare PictureImage rompe il layout.
 */

interface BaseProps {
  /** Percorso relativo alla cartella media del cliente, es. "estate/pool.webp". */
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  eager?: boolean;
  highPriority?: boolean;
  quality?: number;
}

export function FillImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  eager = false,
  highPriority = false,
  quality,
}: BaseProps) {
  return (
    <Image
      src={asset(src)}
      alt={alt}
      fill
      sizes={sizes}
      className={className ? `cover ${className}` : "cover"}
      priority={priority}
      quality={quality}
      loading={eager ? "eager" : undefined}
      fetchPriority={highPriority ? "high" : undefined}
    />
  );
}

export function PictureImage(props: BaseProps) {
  const url = asset(props.src);
  return (
    <picture>
      {/* Oggi le due sorgenti coincidono. Il wrapper resta perché il CSS lo usa
          come riferimento di posizionamento, e perché permette a un cliente di
          fornire ritagli verticali dedicati al telefono senza toccare il codice. */}
      <source media="(max-width: 800px)" srcSet={url} />
      <FillImage {...props} />
    </picture>
  );
}
