"use client";

import { useState } from "react";
import { site } from "../config";
import type { ContentPage, Section } from "../config/types";
import { PageScope } from "../lib/links";
import { ContactDock } from "./layout/ContactDock";
import { Footer } from "./layout/Footer";
import { Cards } from "./sections/Cards";
import { Chapters } from "./sections/Chapters";
import { Contact } from "./sections/Contact";
import { Experiences } from "./sections/Experiences";
import { Facts } from "./sections/Facts";
import { Feature } from "./sections/Feature";
import { Gallery } from "./sections/Gallery";
import { Menu } from "./sections/Menu";
import { Prose } from "./sections/Prose";
import { Reviews } from "./sections/Reviews";
import { Hero } from "./sections/Hero";
import { Stays } from "./sections/Stays";
import { StayTabs } from "./sections/StayTabs";
import { Story } from "./sections/Story";
import { Territory } from "./sections/Territory";
import { Trail } from "./sections/Trail";

/**
 * HOMEPAGE
 * ========
 * Non contiene layout: scorre l'elenco `sections` della configurazione del
 * cliente e monta il componente corrispondente a ciascun tipo.
 *
 * È il punto che rende il sito replicabile. Riordinare le sezioni, toglierne
 * una o usarne una due volte si fa spostando blocchi in tenants/<id>/site.ts,
 * senza aprire questo file.
 *
 * Per aggiungere un TIPO nuovo di sezione (es. "recensioni"):
 *   1. descrivilo in src/config/types.ts e aggiungilo all'unione `Section`
 *   2. scrivi il componente in src/components/sections/
 *   3. aggiungi il suo caso qui sotto
 * TypeScript segnala da solo se dimentichi il terzo passaggio.
 *
 * Le pagine interne (`pages` in configurazione) sono fatte allo stesso modo:
 * un elenco di sezioni. Per questo il motore è uno solo, `SectionsPage`, e
 * homepage e pagine interne si differenziano solo per i collegamenti.
 */

function renderSection(
  section: Section,
  onMenuChange: (open: boolean) => void,
) {
  switch (section.type) {
    case "hero":
      return (
        <Hero key={section.id} section={section} onMenuChange={onMenuChange} />
      );
    case "story":
      return <Story key={section.id} section={section} />;
    case "stays":
      return <Stays key={section.id} section={section} />;
    case "feature":
      return <Feature key={section.id} section={section} />;
    case "experiences":
      return <Experiences key={section.id} section={section} />;
    case "trail":
      return <Trail key={section.id} section={section} />;
    case "territory":
      return <Territory key={section.id} section={section} />;
    case "contact":
      return <Contact key={section.id} section={section} />;
    case "menu":
      return <Menu key={section.id} section={section} />;
    case "gallery":
      return <Gallery key={section.id} section={section} />;
    case "cards":
      return <Cards key={section.id} section={section} />;
    case "reviews":
      return <Reviews key={section.id} section={section} />;
    case "prose":
      return <Prose key={section.id} section={section} />;
    case "chapters":
      return <Chapters key={section.id} section={section} />;
    case "facts":
      return <Facts key={section.id} section={section} />;
    case "stayTabs":
      return <StayTabs key={section.id} section={section} />;
    default: {
      /* Se questa riga smette di compilare, manca un caso qui sopra. */
      const unhandled: never = section;
      return unhandled;
    }
  }
}

function SectionsPage({
  sections,
  home,
}: {
  sections: Section[];
  home: boolean;
}) {
  /* Il menù mobile è dentro l'header, ma il pulsante contatti flottante deve
     sapere quando è aperto per togliersi di mezzo. */
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <PageScope home={home}>
      <main className={home ? undefined : "content-page"}>
        {sections.map((section) => renderSection(section, setMenuOpen))}
        <ContactDock hidden={menuOpen} />
        <Footer />
      </main>
    </PageScope>
  );
}

export function HomePage() {
  return <SectionsPage sections={site.sections} home />;
}

/** Pagina interna: /<slug>. Stesse sezioni, collegamenti verso la homepage. */
export function ContentPageView({ page }: { page: ContentPage }) {
  return <SectionsPage sections={page.sections} home={false} />;
}
