/**
 * SCHELETRO PER UN NUOVO AGRITURISMO
 * ==================================
 * Non modificare questo file: copialo.
 *
 *   cp -r tenants/_template tenants/podere-rosa
 *   mkdir -p public/tenants/podere-rosa/{stays,estate,experiences,trail,contact,video}
 *
 * Poi apri il nuovo site.ts, sostituisci ogni TODO, e registra il cliente in
 * src/config/index.ts. La procedura completa è in docs/NUOVO-CLIENTE.md.
 *
 * Tutti i percorsi delle immagini sono relativi a public/tenants/<id>/.
 */

import type { SiteConfig } from "../../src/config/types";

const site: SiteConfig = {
  brand: {
    id: "TODO-slug-cliente", // deve coincidere col nome della cartella
    prefix: "Agriturismo",
    name: "TODO Nome",
    logo: "logo.png",
    since: "TODO anno",
  },

  contact: {
    phone: "39TODO", // formato internazionale senza "+"
    phoneDisplay: "+39 TODO",
    email: "TODO@esempio.it",
    address: ["TODO via e località", "TODO CAP città (PR)"],
    coordinates: { lat: 0, lng: 0 }, // si leggono da Google Maps
  },

  seo: {
    domain: "https://www.TODO.it",
    title: {
      it: "TODO Nome | TODO promessa in poche parole",
      en: "TODO Name | TODO short promise",
    },
    description: {
      it: "TODO una frase, massimo 155 caratteri, con la località.",
      en: "TODO one sentence, max 155 characters, including the location.",
    },
    ogImage: "estate/aerial.webp",
  },

  locales: ["it", "en"],
  localeNames: { it: "Italiano", en: "English" },

  /* Da cambiare ogni volta che sostituisci una foto tenendo lo stesso nome. */
  mediaVersion: "2026-01-01",

  nav: [
    { target: "storia", label: { it: "La tenuta", en: "The estate" } },
    { target: "sistemazioni", label: { it: "Sistemazioni", en: "Stays" } },
    { target: "esperienze", label: { it: "Esperienze", en: "Experiences" } },
    { target: "territorio", label: { it: "Territorio", en: "Explore" } },
  ],

  headerCta: { it: "Richiedi disponibilità", en: "Check availability" },

  /* ---------------------------------------------------------------- */
  /* Sezioni                                                           */
  /* ---------------------------------------------------------------- */

  /* Appaiono nell'ordine in cui sono scritte. Cancella i blocchi che non
     servono a questo cliente: nessuna modifica al codice. I tipi disponibili
     sono hero, story, stays, feature, experiences, trail, territory, contact.
     "feature" può essere ripetuto più volte con id diversi. */

  sections: [
    {
      type: "hero",
      id: "home",
      video: {
        desktop: "video/hero-desktop.mp4",
        mobile: "video/hero-mobile.mp4",
        poster: "video/hero-poster.webp",
      },
      /* Senza video, togli `video` e usa:
         image: { src: "estate/hero.webp", alt: { it: "...", en: "..." } }, */
      labelParts: [
        { it: "TODO", en: "TODO" },
        { it: "TODO", en: "TODO" },
      ],
      titleLines: [
        { it: "TODO prima riga.", en: "TODO first line." },
        { it: "TODO seconda riga.", en: "TODO second line." },
      ],
      intro: { it: "TODO", en: "TODO" },
      cta: {
        label: { it: "Scopri la tenuta", en: "Discover the estate" },
        href: "#storia",
      },
      pillars: [
        { it: "TODO", en: "TODO" },
        { it: "TODO", en: "TODO" },
        { it: "TODO", en: "TODO" },
      ],
    },

    {
      type: "story",
      id: "storia",
      number: "01",
      numberLabel: { it: "LA TENUTA", en: "THE ESTATE" },
      ghost: "TODO scritta grande di sfondo",
      titleLines: [
        { it: "TODO prima riga", en: "TODO first line" },
        { it: "TODO seconda riga", en: "TODO second line" },
      ],
      titleEmphasis: { it: "TODO parola finale.", en: "TODO final word." },
      mainImage: {
        src: "estate/landscape.webp",
        alt: { it: "TODO", en: "TODO" },
        caption: { it: "TODO", en: "TODO" },
      },
      aerialImage: {
        src: "estate/aerial.webp",
        alt: { it: "TODO", en: "TODO" },
        badge: "TODO 43°25′ N · 11°07′ E",
      },
      manifesto: {
        label: { it: "TODO", en: "TODO" },
        text: {
          it: "TODO paragrafo di racconto.",
          en: "TODO story paragraph.",
        },
      },
      cursorLabel: { it: "ESPLORA", en: "EXPLORE" },
    },

    {
      type: "stays",
      id: "sistemazioni",
      kicker: { it: "TODO", en: "TODO" },
      title: { it: "TODO", en: "TODO" },
      sizeLabel: { it: "SUPERFICIE", en: "SIZE" },
      guestsLabel: { it: "OSPITI", en: "GUESTS" },
      linkLabel: { it: "Entra nella dimora", en: "Explore this home" },
      scrollHint: { it: "SCORRI PER ESPLORARE", en: "SCROLL TO EXPLORE" },
      endCard: {
        lines: ["TODO", "TODO"],
        cta: {
          label: { it: "Trova la tua dimora", en: "Find your home" },
          href: "#contatti",
        },
      },
    },

    {
      type: "feature",
      id: "TODO-piscina",
      image: { src: "estate/pool.webp", alt: { it: "TODO", en: "TODO" } },
      kicker: { it: "TODO", en: "TODO" },
      title: { it: "TODO", en: "TODO" },
      text: { it: "TODO", en: "TODO" },
    },

    {
      type: "experiences",
      id: "esperienze",
      kicker: { it: "TODO", en: "TODO" },
      title: { it: "TODO", en: "TODO" },
      intro: { it: "TODO", en: "TODO" },
      marquee: { it: "TODO · TODO · TODO · ", en: "TODO · TODO · TODO · " },
      itemLabel: { it: "ESPERIENZA", en: "EXPERIENCE" },
      ctaLabel: {
        it: "Vivi questa esperienza",
        en: "Enquire about this experience",
      },
      ctaHref: "#contatti",
      /* Il CSS prevede un'inquadratura diversa per le prime tre card.
         Dalla quarta in poi vanno aggiunte le regole .exp-card-4 ecc. */
      items: [
        {
          title: "TODO",
          word: { it: "TODO", en: "TODO" },
          meta: { it: "TODO · TODO · TODO", en: "TODO · TODO · TODO" },
          text: { it: "TODO", en: "TODO" },
          image: "experiences/TODO.webp",
        },
      ],
    },

    {
      type: "trail",
      id: "percorso",
      mainImage: { src: "trail/main.jpg", alt: { it: "TODO", en: "TODO" } },
      detailImage: {
        src: "trail/fitness.jpg",
        alt: { it: "TODO", en: "TODO" },
      },
      number: "TODO",
      numberUnit: "km",
      kicker: { it: "TODO", en: "TODO" },
      title: { it: "TODO", en: "TODO" },
      text: { it: "TODO", en: "TODO" },
      startLabel: { it: "START", en: "START" },
      endLabel: { it: "FINISH", en: "FINISH" },
    },

    {
      type: "territory",
      id: "territorio",
      kicker: "TODO",
      title: { it: "TODO", en: "TODO" },
      text: { it: "TODO", en: "TODO" },
      disclaimer: {
        it: "DISTANZE STRADALI INDICATIVE",
        en: "APPROXIMATE DRIVING DISTANCES",
      },
      mapLabel: {
        it: "Mappa stilizzata delle distanze da TODO",
        en: "Stylised map of distances from TODO",
      },
      gridLabels: { x: "TODO N", y: "TODO E" },
      homeLabel: { lines: ["TODO", "TODO"], sub: "TODO località" },
      legend: {
        home: "TODO",
        destinations: { it: "Destinazioni", en: "Destinations" },
        note: {
          it: "Distanze stradali indicative",
          en: "Approximate driving distances",
        },
      },

      /* Basta indicare `coordinates`: posizione sulla mappa e rotta si
         calcolano da sole. Se il risultato ti convince poco, aggiungi
         `position`, `route` e `mobileRoute` per rifinire a mano. */
      items: [
        {
          id: "todo-citta",
          name: { it: "TODO", en: "TODO" },
          distance: "TODO km",
          coordinates: { lat: 0, lng: 0 },
        },
      ],
    },

    {
      type: "contact",
      id: "contatti",
      image: { src: "contact/main.jpg", alt: { it: "TODO", en: "TODO" } },
      kicker: { it: "Il tuo soggiorno", en: "Your stay" },
      title: { it: "TODO", en: "TODO" },
      text: { it: "TODO", en: "TODO" },
      whatsappLabel: {
        it: "Scrivici su WhatsApp",
        en: "Message us on WhatsApp",
      },
      emailLabel: { it: "Invia una email", en: "Send us an email" },
    },
  ],

  /* ---------------------------------------------------------------- */
  /* Sistemazioni                                                      */
  /* ---------------------------------------------------------------- */

  /* Ognuna genera una card nel carosello e una pagina /sistemazioni/<slug>.
     Dopo aver caricato le foto in public/tenants/<id>/stays/ con la
     convenzione <slug>-01.webp, <slug>-02.webp..., lancia
     `SITE_ID=<id> npm run media:scan`: stampa questi blocchi già compilati. */

  accommodations: [
    {
      slug: "todo-slug",
      name: "TODO Nome",
      category: { it: "TODO CATEGORIA", en: "TODO CATEGORY" },
      size: "TODO m²",
      guests: "TODO",
      layout: {
        it: "TODO camere · TODO bagni · TODO",
        en: "TODO bedrooms · TODO bathrooms · TODO",
      },
      blurb: { it: "TODO una frase.", en: "TODO one sentence." },
      description: { it: "TODO testo lungo.", en: "TODO long text." },
      cover: "stays/todo-slug-01.webp",
      detail: "stays/todo-slug-02.webp",
      gallery: ["stays/todo-slug-03.webp"],
    },
  ],

  stayPage: {
    back: { it: "Tutte le sistemazioni", en: "All stays" },
    kicker: { it: "TODO", en: "TODO" },
    sizeLabel: { it: "Superficie", en: "Size" },
    guestsLabel: { it: "Ospiti", en: "Guests" },
    galleryLabel: { it: "Dentro la dimora", en: "Inside the home" },
    ctaTitle: { it: "TODO", en: "TODO" },
    ctaLabel: { it: "Richiedi disponibilità", en: "Check availability" },
  },

  dock: {
    enabled: true,
    triggerKicker: { it: "PARLA CON NOI", en: "TALK TO US" },
    triggerLabel: { it: "Contattaci", en: "Contact us" },
    panelKicker: { it: "PRENOTA DIRETTAMENTE", en: "BOOK DIRECTLY" },
    panelTitle: { it: "Iniziamo da qui.", en: "Let’s start here." },
    panelText: {
      it: "Ti rispondiamo direttamente, senza intermediari.",
      en: "We’ll reply directly, with no intermediaries.",
    },
    phoneLabel: { it: "Telefono", en: "Phone" },
  },

  footer: {
    copyright: "© 2026 TODO Nome",
  },

  /* ---------------------------------------------------------------- */
  /* Pagine legali                                                     */
  /* ---------------------------------------------------------------- */

  /* IMPORTANTE: questi testi vanno riletti e approvati dal cliente prima
     della pubblicazione, e riscritti se il sito introduce analytics, mappe
     incorporate o sistemi di prenotazione di terze parti. Il testo di
     partenza descrive un sito senza cookie e senza moduli di contatto:
     se il cliente ne aggiunge, non è più accurato.

     Il corpo accetta HTML semplice: <section>, <h2>, <h3>, <p>, <ul>, <li>,
     <strong>, <a>. */

  legalPages: [
    {
      slug: "privacy-policy",
      title: { it: "Privacy Policy", en: "Privacy Policy" },
      body: {
        it: `<section><h2>TODO</h2><p>TODO</p></section>`,
        en: `<section><h2>TODO</h2><p>TODO</p></section>`,
      },
    },
    {
      slug: "cookie-policy",
      title: { it: "Cookie Policy", en: "Cookie Policy" },
      body: {
        it: `<section><h2>TODO</h2><p>TODO</p></section>`,
        en: `<section><h2>TODO</h2><p>TODO</p></section>`,
      },
    },
  ],
};

export default site;
