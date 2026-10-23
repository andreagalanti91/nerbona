"use client";

import { useState } from "react";
import { FillImage } from "./Media";

/**
 * Galleria di un singolo appartamento: foto grande, frecce, miniature.
 * Le immagini usano FillImage dentro riquadri posizionati dal CSS
 * (parts/21-units.css): non serve PictureImage.
 */
export function UnitGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const at = (step: number) => (index + step + count) % count;
  const go = (step: number) => setIndex(at(step));
  /* Le frecce si annunciano con la foto a cui portano ("Granaio 3 / 6"):
     nessun testo da tradurre nel componente. */
  const label = (step: number) => `${name} ${at(step) + 1} / ${count}`;

  return (
    <div className="unit-gallery">
      <figure className="unit-main">
        <FillImage
          key={images[index]}
          src={images[index]}
          alt={`${name} — ${index + 1}`}
          sizes="(max-width: 900px) 100vw, 55vw"
        />
        {count > 1 && (
          <>
            <button
              type="button"
              className="unit-arrow prev"
              onClick={() => go(-1)}
              aria-label={label(-1)}
            >
              <i className="direction-mark reverse" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="unit-arrow next"
              onClick={() => go(1)}
              aria-label={label(1)}
            >
              <i className="direction-mark" aria-hidden="true" />
            </button>
            <span className="unit-count">
              {index + 1} / {count}
            </span>
          </>
        )}
      </figure>

      {count > 1 && (
        <div className="unit-thumbs">
          {images.map((image, thumb) => (
            <button
              type="button"
              key={image}
              className={thumb === index ? "active" : ""}
              onClick={() => setIndex(thumb)}
              aria-label={`${name} — ${thumb + 1}`}
              aria-current={thumb === index}
            >
              <FillImage src={image} alt="" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
