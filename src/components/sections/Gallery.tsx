"use client";

import { useLanguage } from "../../lib/i18n";
import type { GallerySection } from "../../config/types";
import { PictureImage } from "../Media";

/**
 * Galleria fotografica.
 *
 * Riusa le classi `.detail-gallery` già scritte per le pagine interne: stesso
 * ritmo, stesse proporzioni, zero CSS nuovo. La classe aggiuntiva
 * `.gallery-section` serve solo a dare alla sezione lo spazio verticale che
 * dentro una pagina di dettaglio arriva dal contesto.
 */
export function Gallery({ section }: { section: GallerySection }) {
  const { t } = useLanguage();

  return (
    <section className="detail-gallery gallery-section" id={section.id}>
      <p className="eyebrow">{t(section.kicker)}</p>
      <h2 className="gallery-title">{t(section.title)}</h2>
      {section.text && <p className="gallery-text">{t(section.text)}</p>}

      <div>
        {section.images.map((image, index) => (
          <figure key={index}>
            <PictureImage
              src={image.src}
              alt={t(image.alt)}
              sizes="(max-width: 700px) 100vw, 50vw"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
