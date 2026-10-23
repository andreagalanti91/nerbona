/**
 * SCHEMA DEL CONTENUTO
 * ====================
 * Questo file descrive *tutto* ciò che può cambiare da un agriturismo all'altro.
 * È l'unico contratto fra la piattaforma (src/, app/) e il singolo cliente
 * (tenants/<id>/site.ts).
 *
 * Regola d'oro: nessun testo, immagine, numero di telefono o colore deve mai
 * comparire dentro src/ o app/. Se serve una nuova voce, si aggiunge qui e
 * TypeScript segnalerà automaticamente tutti i tenant da aggiornare.
 */

/* ------------------------------------------------------------------ */
/* Lingue                                                              */
/* ------------------------------------------------------------------ */

/** Codice ISO della lingua: "it", "en", "de", "fr", ... */
export type LocaleCode = string;

/**
 * Un testo tradotto. Le chiavi devono coincidere con `site.locales`.
 * Esempio: { it: "Richiedi disponibilità", en: "Check availability" }
 */
export type Localized = Record<LocaleCode, string>;

/* ------------------------------------------------------------------ */
/* Identità e contatti                                                 */
/* ------------------------------------------------------------------ */

export interface Brand {
  /** Slug tecnico, uguale al nome della cartella in tenants/. Es. "le-ville" */
  id: string;
  /** Riga piccola sopra il nome nel logo. Es. "Agriturismo" */
  prefix: string;
  /** Nome commerciale. Es. "Le Ville" */
  name: string;
  /** Path del logo, relativo alla cartella media del tenant. Es. "logo.png" */
  logo: string;
  /** Anno di fondazione, usato nei testi e nel footer. Es. "1992" */
  since?: string;
  /**
   * Codice Identificativo Nazionale della struttura ricettiva.
   * In Italia va esposto sul sito e negli annunci: se presente compare
   * automaticamente nel footer. Es. "IT052012B5BXRHWPRU"
   */
  cin?: string;
}

export interface Contact {
  /** Numero in formato internazionale senza "+" — usato per wa.me. Es. "393939383563" */
  phone: string;
  /** Come mostrarlo a schermo. Es. "+39 393 938 3563" */
  phoneDisplay: string;
  email: string;
  /** Se assente si usa `phone`. */
  whatsapp?: string;
  /**
   * Secondo recapito, tipicamente il fisso della reception quando il numero
   * principale è un cellulare (o viceversa). Se presente compare nel footer
   * e nel pannello contatti.
   */
  phoneAlt?: { number: string; display: string };
  /** Righe dell'indirizzo, una per riga visiva. */
  address: string[];
  /** Partita IVA, mostrata nel footer quando presente. */
  vat?: string;
  /** Coordinate della struttura: servono alla mappa e ai dati strutturati SEO. */
  coordinates: { lat: number; lng: number };
  /** Profili social, mostrati nel footer. Es. { label: "Instagram", href: "https://..." } */
  social?: { label: string; href: string }[];
}

export interface Seo {
  /** Dominio con protocollo, senza slash finale. Es. "https://www.leville.it" */
  domain: string;
  title: Localized;
  description: Localized;
  /** Immagine di anteprima social, relativa alla cartella media del tenant. */
  ogImage?: string;
}

/* ------------------------------------------------------------------ */
/* Sistemazioni                                                        */
/* ------------------------------------------------------------------ */

export interface Accommodation {
  /** Usato nell'URL: /sistemazioni/<slug>, oppure /<slug> se `stayPath` è vuoto. */
  slug: string;
  name: string;
  /** Etichetta di categoria mostrata sopra il nome. Es. "GLI APPARTAMENTI" */
  category: Localized;
  /** Es. "80 m²" */
  size: string;
  /** Es. "4" */
  guests: string;
  /** Riga tecnica. Es. "2 camere · 1 bagno · vista panoramica" */
  layout: Localized;
  /** Frase breve, usata nella card di anteprima. */
  blurb: Localized;
  /** Testo lungo, usato nella pagina di dettaglio. */
  description: Localized;
  /** Foto principale (card + hero della pagina di dettaglio). */
  cover: string;
  /** Seconda foto, sovrapposta alla cover nella card. */
  detail: string;
  /** Galleria della pagina di dettaglio. Generabile con `npm run media:scan`. */
  gallery: string[];
  /**
   * Gli alloggi reali che appartengono a questa voce. Serve quando una voce
   * del carosello rappresenta una tipologia ("Trilocali") che raggruppa più
   * appartamenti con un nome proprio: nella pagina di dettaglio compaiono
   * uno per uno, con la loro descrizione.
   */
  units?: AccommodationUnit[];
  /** Dotazioni comuni a tutta la voce, mostrate come elenco. */
  amenities?: Localized[];
}

export interface AccommodationUnit {
  /**
   * Ancora nella pagina della tipologia: /trilocale#solaio. Serve ai
   * collegamenti diretti all'appartamento, per esempio dalle schede della
   * homepage.
   */
  slug: string;
  name: string;
  /** Riga tecnica breve. Es. "Piano terra · 2 camere · 1 bagno" */
  layout: Localized;
  text: Localized;
  /** Posti letto massimi. Es. "4" */
  guests?: string;
  /** Etichette brevi. Es. "Accessibile", "Zanzariere" */
  tags?: Localized[];
  /** Foto dell'appartamento, la prima fa da copertina. */
  images?: string[];
  /**
   * Prenotazione diretta di questo appartamento. Se assente si usa
   * `booking.url`: il pulsante "Prenota" c'è comunque per ogni appartamento.
   */
  bookingUrl?: string;
}

/* ------------------------------------------------------------------ */
/* Sezioni della homepage                                              */
/* ------------------------------------------------------------------ */

export interface ImageRef {
  src: string;
  alt: Localized;
}

/** Sezione 0 — video a tutto schermo, header, titolo, claim. */
export interface HeroSection {
  type: "hero";
  id: string;
  video?: { desktop: string; mobile?: string; poster: string };
  /** Alternativa al video: immagine fissa a tutto schermo. */
  image?: ImageRef;
  /**
   * Riga sopra il titolo, spezzata in parti. Fra una parte e l'altra viene
   * inserito un separatore colorato con l'accento del tema.
   * Es. ["Ospitalità di famiglia", "Dal 1992"] -> "Ospitalità di famiglia · Dal 1992"
   */
  labelParts: Localized[];
  /** Righe del titolo H1, una per riga. */
  titleLines: Localized[];
  intro: Localized;
  cta: { label: Localized; href: string };
  /** Le tre etichette in fondo allo schermo. */
  pillars: Localized[];
  /**
   * "full" (predefinito) occupa tutto lo schermo, come in homepage.
   * "compact" è l'apertura delle pagine interne: più bassa, così il
   * contenuto si vede senza scorrere.
   * "editorial" è un'apertura da rivista su fondo chiaro: titolo grande
   * centrato e foto incorniciata sotto, invece che a tutto schermo.
   */
  size?: "full" | "compact" | "editorial";
}

/** Sezione 1 — racconto in parallasse con foto e manifesto. */
export interface StorySection {
  type: "story";
  id: string;
  /** Numero di capitolo mostrato in alto. Es. "01" */
  number: string;
  numberLabel: Localized;
  /** Scritta gigante di sfondo. Es. "DAL 1992" */
  ghost: string;
  /** Righe normali del titolo + ultima riga in corsivo. */
  titleLines: Localized[];
  titleEmphasis: Localized;
  mainImage: ImageRef & { caption: Localized };
  aerialImage: ImageRef & { badge: string };
  manifesto: { label: Localized; text: Localized };
  /** Testo del cursore che segue il mouse. Es. "ESPLORA" */
  cursorLabel: Localized;
}

/** Sezione 2 — carosello orizzontale delle sistemazioni. */
export interface StaysSection {
  type: "stays";
  id: string;
  kicker: Localized;
  title: Localized;
  /** Etichette delle due statistiche della card. */
  sizeLabel: Localized;
  guestsLabel: Localized;
  linkLabel: Localized;
  scrollHint: Localized;
  /** Card finale del carosello. */
  endCard: { lines: string[]; cta: { label: Localized; href: string } };
  /**
   * Slug delle sistemazioni da mostrare, nell'ordine dato. Se assente le
   * mostra tutte. Serve a una struttura con più sedi: ogni pagina di sede
   * mostra solo i propri alloggi.
   */
  only?: string[];
}

/** Sezione riutilizzabile — foto a tutto schermo con testo sovrapposto. */
export interface FeatureSection {
  type: "feature";
  id: string;
  image: ImageRef;
  kicker: Localized;
  title: Localized;
  text: Localized;
  /** Collegamento facoltativo, per esempio alla pagina che approfondisce. */
  cta?: { label: Localized; href: string };
}

export interface Experience {
  title: string;
  /** Parola gigante sullo sfondo della card. Es. "FUOCO" */
  word: Localized;
  meta: Localized;
  text: Localized;
  image: string;
}

/** Sezione 3 — le esperienze, card impilate. */
export interface ExperiencesSection {
  type: "experiences";
  id: string;
  kicker: Localized;
  title: Localized;
  intro: Localized;
  /** Testo scorrevole orizzontale. */
  marquee: Localized;
  /** Etichetta prima del numero, es. "ESPERIENZA 01" */
  itemLabel: Localized;
  ctaLabel: Localized;
  ctaHref: string;
  items: Experience[];
}

/** Sezione 4 — percorso natura, due foto + numero grande. */
export interface TrailSection {
  type: "trail";
  id: string;
  mainImage: ImageRef;
  detailImage: ImageRef;
  /** Numero grande e sua unità. Es. "2" + "km" */
  number: string;
  numberUnit: string;
  kicker: Localized;
  title: Localized;
  text: Localized;
  startLabel: Localized;
  endLabel: Localized;
}

export interface Destination {
  id: string;
  name: Localized;
  /** Es. "26 km" */
  distance: string;
  /**
   * Posizione sulla mappa stilizzata, in percentuale del riquadro.
   * Se omessi vengono calcolati automaticamente dalle coordinate:
   * vedi `npm run map:calc` per generarli e poi rifinirli a mano.
   */
  position?: { x: string; y: string };
  coordinates?: { lat: number; lng: number };
  /** Rotta tratteggiata desktop. Calcolata se assente. */
  route?: { length: string; angle: string };
  /** Rotta tratteggiata mobile (il riquadro ha proporzioni diverse). */
  mobileRoute?: { length: string; angle: string };
}

/** Sezione 5 — mappa stilizzata delle distanze. */
export interface TerritorySection {
  type: "territory";
  id: string;
  kicker: string;
  title: Localized;
  text: Localized;
  disclaimer: Localized;
  mapLabel: Localized;
  /** Coordinate mostrate ai bordi della mappa. */
  gridLabels: { x: string; y: string };
  homeLabel: { lines: string[]; sub: string };
  legend: {
    home: string;
    destinations: Localized;
    /** Nota in fondo alla legenda. Distinta da `disclaimer`, che sta
        nell'intestazione ed è scritta tutta in maiuscolo. */
    note: Localized;
  };
  items: Destination[];
}

/** Una riga di orario. Es. "Giovedì – Lunedì" / "19:30 – 22:00" */
export interface OpeningRow {
  days: Localized;
  hours: Localized;
}

/** Sezione — contatti finali. */
export interface ContactSection {
  type: "contact";
  id: string;
  image: ImageRef;
  kicker: Localized;
  title: Localized;
  text: Localized;
  whatsappLabel: Localized;
  emailLabel: Localized;
  /**
   * Orari di apertura. Per un ristorante sono la prima cosa che si cerca:
   * se presenti compaiono accanto ai pulsanti di contatto.
   */
  opening?: {
    label: Localized;
    rows: OpeningRow[];
    /** Nota libera: chiusura settimanale, festivi, prenotazione consigliata. */
    note?: Localized;
  };
}

/* --- Sezioni aggiunte per la ristorazione ------------------------- */

export interface MenuDish {
  name: Localized;
  /** Riga di dettaglio: ingredienti, provenienza. Facoltativa. */
  detail?: Localized;
  /** Es. "14" — la valuta la mette il componente. */
  price?: string;
}

export interface MenuCourse {
  /** Es. "Antipasti", "Primi", "Dolci" */
  title: Localized;
  /** Riga introduttiva del corso. Facoltativa. */
  note?: Localized;
  dishes: MenuDish[];
}

/**
 * Sezione menù. Pensata per un ristorante, ma utile anche a un agriturismo
 * con cucina.
 *
 * Il menù completo di solito cambia spesso e vive come PDF: `documents`
 * raccoglie quei file (menù, carta dei vini) e li mostra come pulsanti di
 * scaricamento. `courses` serve a mostrarne un estratto in pagina — qualche
 * piatto rappresentativo — senza dover riscrivere tutto a ogni cambio di
 * stagione. Si può usare l'uno, l'altro o entrambi.
 */
export interface MenuSection {
  type: "menu";
  id: string;
  kicker: Localized;
  title: Localized;
  text?: Localized;
  /** Simbolo di valuta anteposto ai prezzi. Predefinito: nessuno. */
  currency?: string;
  courses?: MenuCourse[];
  documents?: { label: Localized; href: string }[];
}

/**
 * Galleria fotografica. Le immagini riempiono una griglia; il CSS è lo
 * stesso già usato dalle gallerie delle pagine interne, quindi non serve
 * stile nuovo.
 */
export interface GallerySection {
  type: "gallery";
  id: string;
  kicker: Localized;
  title: Localized;
  text?: Localized;
  images: ImageRef[];
}

/**
 * Alloggi divisi in schede: una per sede (o per qualsiasi raggruppamento),
 * con le tipologie e i nomi dei singoli appartamenti, ciascuno con il suo
 * collegamento. Alternativa al carosello quando conta far scegliere in
 * fretta più che far sfogliare.
 */
export interface StayTabsSection {
  type: "stayTabs";
  id: string;
  kicker: Localized;
  title: Localized;
  text?: Localized;
  tabs: {
    label: Localized;
    /** Riga sotto le schede, quando la scheda è attiva. */
    text?: Localized;
    /** Slug delle sistemazioni della scheda, nell'ordine. */
    stays: string[];
    link?: { label: Localized; href: string };
  }[];
  guestsLabel: Localized;
  linkLabel: Localized;
}

/* --- Sezioni per le pagine interne -------------------------------- */

export interface CardItem {
  title: Localized;
  /** Riga piccola sopra il titolo. Es. "Da aprile a ottobre" */
  meta?: Localized;
  text: Localized;
  image?: ImageRef;
  /** Righe di dettaglio: prezzi, orari, recapiti. */
  details?: Localized[];
  /** Collegamento esterno o interno. */
  link?: { label: Localized; href: string };
}

/**
 * Griglia di schede: servizi, esperienze, attività. Pensata per elenchi
 * lunghi, dove le card impilate delle esperienze diventerebbero pesanti.
 */
export interface CardsSection {
  type: "cards";
  id: string;
  kicker: Localized;
  title: Localized;
  text?: Localized;
  /** "light" (predefinito) su fondo chiaro, "dark" su fondo scuro. */
  tone?: "light" | "dark";
  items: CardItem[];
}

export interface ChapterItem {
  /** Parola gigante che scorre di lato. Es. "PISCINE" */
  word: Localized;
  kicker: Localized;
  title: Localized;
  text: Localized;
  image?: ImageRef;
  /** Righe di dettaglio: orari, prezzi, recapiti. */
  details?: Localized[];
  link?: { label: Localized; href: string };
}

/**
 * Capitoli alternati: foto incorniciata da una parte, dall'altra una parola
 * gigante che scorre con la pagina e il testo. Per pagine da sfogliare, dove
 * ogni tema merita uno spazio proprio: servizi, matrimoni, luoghi.
 */
export interface ChaptersSection {
  type: "chapters";
  id: string;
  kicker?: Localized;
  title?: Localized;
  items: ChapterItem[];
}

export interface FactItem {
  label: Localized;
  value: Localized;
  note?: Localized;
}

/**
 * Informazioni pratiche in forma di elenco: etichetta a sinistra, valore a
 * destra. Si legge in pochi secondi: orari, check-in, parcheggio, animali.
 */
export interface FactsSection {
  type: "facts";
  id: string;
  kicker: Localized;
  title: Localized;
  text?: Localized;
  image?: ImageRef;
  items: FactItem[];
}

export interface Review {
  quote: Localized;
  /** Titolo della recensione, se il portale ne ha uno. */
  title?: Localized;
  author: string;
  /** Es. "Google", "Tripadvisor", "Booking.com" */
  source: string;
  /** Es. "Ottobre 2025" */
  date?: Localized;
  /** Es. "5/5", "10/10" */
  score?: string;
}

/** Recensioni degli ospiti, con i collegamenti ai portali. */
export interface ReviewsSection {
  type: "reviews";
  id: string;
  kicker: Localized;
  title: Localized;
  text?: Localized;
  items: Review[];
  links?: { label: Localized; href: string }[];
  /**
   * "grid" (predefinito): schede affiancate. "editorial": la prima
   * recensione in grande al centro, le altre in un elenco a due colonne.
   */
  layout?: "grid" | "editorial";
  /** Punteggi per portale, mostrati in testa. Es. { score: "5/5", label: "Google" } */
  summary?: { score: string; label: Localized }[];
}

/**
 * Testo lungo con titolo: racconti, storia, approfondimenti. I paragrafi
 * sono testo semplice; i collegamenti vanno in `links`.
 */
export interface ProseSection {
  type: "prose";
  id: string;
  kicker: Localized;
  title: Localized;
  paragraphs: Localized[];
  links?: { label: Localized; href: string }[];
  image?: ImageRef;
}

export type Section =
  | HeroSection
  | StorySection
  | StaysSection
  | FeatureSection
  | ExperiencesSection
  | TrailSection
  | TerritorySection
  | ContactSection
  | MenuSection
  | GallerySection
  | CardsSection
  | ReviewsSection
  | ProseSection
  | ChaptersSection
  | FactsSection
  | StayTabsSection;

/* ------------------------------------------------------------------ */
/* Elementi ricorrenti                                                 */
/* ------------------------------------------------------------------ */

/**
 * Una voce di menù punta a una sezione della homepage (`target`), a una
 * pagina interna (`page`) oppure a un indirizzo qualsiasi (`href`: la pagina
 * di un alloggio, un sito esterno). Una sola delle tre.
 */
export interface NavLink {
  /** Es. "/trilocale" (pagina di un alloggio) o "https://..." */
  href?: string;
  /** Ancora sulla homepage, senza "#". Deve coincidere con l'`id` di una sezione. */
  target?: string;
  /** Slug di una voce di `pages`. */
  page?: string;
  label: Localized;
}

export interface NavItem extends NavLink {
  /**
   * Sottomenù. Su desktop si apre al passaggio del mouse, su telefono le voci
   * compaiono rientrate sotto quella principale. Se la voce principale non ha
   * né `target` né `page` fa solo da intestazione.
   */
  children?: NavLink[];
}

/** Pulsante contatti fisso in basso a destra. */
export interface Dock {
  enabled: boolean;
  triggerKicker: Localized;
  triggerLabel: Localized;
  panelKicker: Localized;
  panelTitle: Localized;
  panelText: Localized;
  phoneLabel: Localized;
}

/** Testi della pagina di dettaglio di una sistemazione. */
export interface StayPageCopy {
  back: Localized;
  kicker: Localized;
  sizeLabel: Localized;
  guestsLabel: Localized;
  galleryLabel: Localized;
  ctaTitle: Localized;
  ctaLabel: Localized;
  /** Titolo dell'elenco degli alloggi, se la voce ha `units`. */
  unitsLabel?: Localized;
  /** Etichetta del pulsante che chiede informazioni su un appartamento. */
  askLabel?: Localized;
  /**
   * Messaggio WhatsApp precompilato per un appartamento; "{name}" diventa il
   * suo nome. Es. "Buongiorno, vorrei informazioni su {name}."
   */
  askMessage?: Localized;
  /** Titolo dell'elenco delle dotazioni, se la voce ha `amenities`. */
  amenitiesLabel?: Localized;
}

export interface LegalPage {
  slug: string;
  title: Localized;
  /**
   * Indirizzo esterno. Se presente, il sito NON genera la pagina e i
   * collegamenti puntano lì. Serve ai clienti che gestiscono già le proprie
   * informative altrove, per esempio su Iubenda: meglio rimandare al loro
   * documento aggiornato che tenerne una copia che invecchia.
   */
  externalUrl?: string;
  /**
   * Paragrafi in HTML semplice (sono ammessi <strong>, <em>, <a>, <br />).
   * Ignorato quando c'è `externalUrl`.
   */
  body?: Localized;
}

/**
 * Pagina interna: /<slug>. È composta dalle stesse sezioni della homepage,
 * quindi non serve un componente nuovo per ogni pagina. La prima sezione deve
 * essere un `hero`, di solito con `size: "compact"`.
 */
export interface ContentPage {
  slug: string;
  /** Titolo nella scheda del browser e nei risultati di ricerca. */
  title: Localized;
  description: Localized;
  sections: Section[];
}

/* ------------------------------------------------------------------ */
/* Configurazione completa di un agriturismo                           */
/* ------------------------------------------------------------------ */

export interface SiteConfig {
  brand: Brand;
  contact: Contact;
  seo: Seo;

  /** Lingue attive. La prima è quella di default. */
  locales: LocaleCode[];
  /** Nome della lingua nel selettore, es. { it: "Italiano", en: "English" } */
  localeNames: Record<LocaleCode, string>;

  /**
   * Stringa aggiunta a tutte le URL dei media (?v=...).
   * Cambiala quando sostituisci una foto mantenendo lo stesso nome file:
   * forza browser e CDN a ricaricarla.
   */
  mediaVersion?: string;

  nav: NavItem[];
  /** Etichetta del bottone principale nell'header. */
  headerCta: Localized;

  /**
   * Motore di prenotazione esterno.
   *
   * Il collegamento serve in tre punti — il bottone dell'header, il blocco
   * contatti e il pannello flottante — quindi sta scritto qui una volta sola.
   * Cambiando fornitore si aggiorna un indirizzo, non tre.
   *
   * Se assente, il bottone dell'header punta semplicemente alla sezione
   * contatti e nessun pulsante "prenota" compare.
   */
  booking?: {
    /** Indirizzo del motore di prenotazione (si apre in una nuova scheda). */
    url: string;
    /** Etichetta dei pulsanti. Es. "Prenota" */
    label: Localized;
  };

  /** Le sezioni della homepage, nell'ordine in cui appaiono. */
  sections: Section[];

  /** Pagine interne, raggiungibili dal menù. Facoltative. */
  pages?: ContentPage[];

  /**
   * Cartella delle pagine degli alloggi: "sistemazioni" (predefinito) dà
   * /sistemazioni/<slug>. Con "" le pagine stanno alla radice, /<slug>: serve
   * a mantenere gli indirizzi del sito precedente del cliente, che i motori di
   * ricerca conoscono già.
   */
  stayPath?: string;

  /**
   * Alloggi. Vuoto o assente per un'attività che non ne ha (un ristorante):
   * in quel caso non viene generata nessuna pagina /sistemazioni.
   */
  accommodations?: Accommodation[];
  /** Serve solo se ci sono alloggi. */
  stayPage?: StayPageCopy;

  dock: Dock;
  footer: { copyright: string };
  legalPages: LegalPage[];
}
