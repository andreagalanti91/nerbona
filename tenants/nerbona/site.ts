/**
 * AGRITURISMO FATTORIA NERBONA
 * ============================
 *
 * Sito di prova costruito sulla struttura di agriturismoleville.it, con i
 * contenuti reali di nerbona.com: testi, alloggi, servizi, esperienze,
 * recensioni e fotografie vengono da lì, riscritti e riorganizzati.
 *
 * COME È ORGANIZZATO. Menù e indirizzi sono quelli di nerbona.com, voce
 * per voce, così chi conosce il sito ritrova tutto e i motori di ricerca
 * non perdono le pagine già indicizzate:
 *
 *   Nerbona ▾  /nerbona-bilocale  /trilocale  /quadrilocale-nerbona
 *              /villa-aia  /camere-nerbona  /aree-extra-nerbona
 *   Casina ▾   /bilocale-casina  /trilocali-casina  /quadrilocale-casina
 *              /aree-extra-casina
 *   Servizi /servizi · Esperienze /esperienze · Matrimoni
 *   /matrimoni-toscana-nerbona · Toscana /storia-e-tradizioni ·
 *   Recensioni /recensioni · Prenota → Beddy
 *
 *   - la homepage mostra gli alloggi in due schede, Nerbona e La Casina, con
 *     il nome di ogni appartamento e il collegamento diretto al suo riquadro
 *   - ogni alloggio è una TIPOLOGIA (Bilocali, Trilocali...): la sua pagina,
 *     come su nerbona.com, presenta uno per uno gli appartamenti (Mangiatoia,
 *     Granaio...) con foto, posti letto, "Prenota" e "Chiedi informazioni".
 *     Le pagine stanno alla radice (`stayPath: ""`)
 *   - le "Aree extra" raccontano ciascuna sede: spazi comuni, struttura e
 *     carosello dei soli suoi alloggi
 *   - Servizi, Matrimoni, Toscana e Recensioni hanno un'impaginazione
 *     editoriale (apertura chiara con foto incorniciata, capitoli con parole
 *     giganti), sul modello di sanfelice.com
 *
 * ALTRE FONTI. Posti letto, soggiorni minimi, lingue, colazione su
 * prenotazione, punteggi dei portali e dintorni vengono dalle schede
 * pubbliche (Visit Tuscany, Bed-and-Breakfast.it, Trip.com) e dal motore di
 * prenotazione Beddy. Da far confermare al cliente.
 *
 * LE FOTO vengono da nerbona.com e sono a 1080 px di larghezza: bastano per
 * le schede, ma a tutto schermo su un monitor grande si ammorbidiscono. Prima
 * di andare online conviene chiedere al cliente gli originali.
 *
 * IL VIDEO è quello del canale YouTube della struttura (girato da
 * Agriturismo.it): è stato tagliato per togliere titolo e filigrana, ed è
 * senza audio, come richiede la riproduzione automatica.
 */

import type { Localized, SiteConfig } from "../../src/config/types";

/* Dotazioni della cucina, uguali in tutti gli appartamenti: scritte una
   volta sola e riusate. */
const KITCHEN: Localized = {
  it: "Cucina attrezzata: piatti, posate, bicchieri, tazze, moka, insalatiera, tagliere, pentole, padelle e cavatappi",
  en: "Equipped kitchen: plates, cutlery, glasses, cups, moka pot, salad bowl, chopping board, pots, pans and corkscrew",
};
const OUTDOOR: Localized = {
  it: "Da Pasqua a ottobre spazio esterno privato con tavolo, sedie e ombrellone",
  en: "From Easter to October, private outdoor space with table, chairs and parasol",
};
const WIFI_IN: Localized = { it: "Wi-Fi nell'alloggio", en: "Wi-Fi in the apartment" };
const WIFI_OUT: Localized = {
  it: "Wi-Fi nelle zone comuni, all'esterno dell'alloggio",
  en: "Wi-Fi in the shared areas, outside the apartment",
};
const NETS: Localized = { it: "Zanzariere", en: "Mosquito nets" };
const ACCESSIBLE: Localized = {
  it: "Adatto a sedia a rotelle",
  en: "Wheelchair accessible",
};

/* Le due sedi compaiono come etichetta sopra ogni alloggio. */
const AT_NERBONA = (it: string, en: string): Localized => ({
  it: `NERBONA · ${it}`,
  en: `NERBONA · ${en}`,
});
const AT_CASINA = (it: string, en: string): Localized => ({
  it: `LA CASINA · ${it}`,
  en: `LA CASINA · ${en}`,
});

const site: SiteConfig = {
  brand: {
    id: "nerbona",
    prefix: "Agriturismo",
    name: "Fattoria Nerbona",
    logo: "logo.svg",
    /* Codice Identificativo Nazionale, come pubblicato su nerbona.com. */
    cin: "IT052012B5BXRHWPRU",
  },

  contact: {
    /* Il cellulare è il recapito principale perché è quello su cui funziona
       WhatsApp; il fisso della reception compare come secondo numero. */
    phone: "393489038897",
    phoneDisplay: "+39 348 903 8897",
    phoneAlt: { number: "390577971066", display: "+39 0577 971066" },
    email: "info@nerbona.com",
    address: ["Località Nerbona", "53034 Colle di Val d'Elsa (SI)"],
    /* Dal segnaposto di Google Maps collegato al sito ufficiale. */
    coordinates: { lat: 43.3736, lng: 11.0647 },
    social: [
      { label: "Instagram", href: "https://www.instagram.com/nerbona/" },
      {
        label: "Facebook",
        href: "https://www.facebook.com/AgriturismoFattoriaNerbona/",
      },
    ],
  },

  seo: {
    domain: "https://www.nerbona.com",
    title: {
      it: "Agriturismo Fattoria Nerbona | Colle di Val d'Elsa, Toscana",
      en: "Agriturismo Fattoria Nerbona | Colle di Val d'Elsa, Tuscany",
    },
    description: {
      it: "Venti appartamenti in antiche case rurali, due strutture e due piscine nella campagna senese, tra Siena e Firenze.",
      en: "Twenty apartments in old farm buildings, two sites and two pools in the Sienese countryside, between Siena and Florence.",
    },
    ogImage: "estate/aerial.webp",
  },

  locales: ["it", "en"],
  localeNames: { it: "Italiano", en: "English" },

  mediaVersion: "2026-10-23",

  /* Sei voci principali al posto delle nove dell'originale: le due sedi
     stanno sotto "Alloggi", e "Prenota" è il bottone a destra. */
  /* Lo stesso menù di nerbona.com, così chi conosce il sito ritrova tutto
     al suo posto, e gli stessi indirizzi, così i motori di ricerca non
     perdono le pagine già indicizzate. "Prenota" è il bottone a destra. */
  nav: [
    {
      label: { it: "Nerbona", en: "Nerbona" },
      children: [
        { href: "/nerbona-bilocale", label: { it: "Bilocali", en: "One-bedroom apartments" } },
        { href: "/trilocale", label: { it: "Trilocali", en: "Two-bedroom apartments" } },
        { href: "/quadrilocale-nerbona", label: { it: "Quadrilocale", en: "Three-bedroom apartment" } },
        { href: "/villa-aia", label: { it: "Villa L'Aia", en: "Villa L'Aia" } },
        { href: "/camere-nerbona", label: { it: "Camere", en: "Rooms" } },
        { page: "aree-extra-nerbona", label: { it: "Aree extra Nerbona", en: "Nerbona extra areas" } },
      ],
    },
    {
      label: { it: "Casina", en: "Casina" },
      children: [
        { href: "/bilocale-casina", label: { it: "Bilocale", en: "One-bedroom apartment" } },
        { href: "/trilocali-casina", label: { it: "Trilocali", en: "Two-bedroom apartments" } },
        { href: "/quadrilocale-casina", label: { it: "Quadrilocale", en: "Three-bedroom apartment" } },
        { page: "aree-extra-casina", label: { it: "Aree extra Casina", en: "Casina extra areas" } },
      ],
    },
    { page: "servizi", label: { it: "Servizi", en: "Services" } },
    { page: "esperienze", label: { it: "Esperienze", en: "Experiences" } },
    { page: "matrimoni-toscana-nerbona", label: { it: "Matrimoni", en: "Weddings" } },
    { page: "storia-e-tradizioni", label: { it: "Toscana", en: "Tuscany" } },
    { page: "recensioni", label: { it: "Recensioni", en: "Reviews" } },
  ],

  headerCta: { it: "Richiedi disponibilità", en: "Check availability" },

  /* Gli alloggi stanno alla radice (/trilocale, /villa-aia...), come su
     nerbona.com. */
  stayPath: "",

  /* Beddy mostra disponibilità e prezzi in tempo reale. */
  booking: {
    url: "https://agriturismofattorianerbona.beddy.io/",
    label: { it: "Prenota", en: "Book now" },
  },

  /* ================================================================ */
  /* Homepage                                                          */
  /* ================================================================ */

  sections: [
    {
      type: "hero",
      id: "home",
      video: {
        desktop: "video/hero-desktop.mp4",
        mobile: "video/hero-mobile.mp4",
        poster: "video/hero-poster.webp",
      },
      labelParts: [
        { it: "Colle di Val d'Elsa", en: "Colle di Val d'Elsa" },
        { it: "Tra Siena e Firenze", en: "Between Siena and Florence" },
      ],
      titleLines: [
        { it: "Due case nella", en: "Two homes in the" },
        { it: "campagna senese.", en: "Sienese countryside." },
      ],
      intro: {
        it: "Venti appartamenti ricavati da antiche strutture rurali, due piscine e il silenzio delle colline toscane.",
        en: "Twenty apartments carved from old farm buildings, two pools and the quiet of the Tuscan hills.",
      },
      cta: {
        label: { it: "Scopri la tenuta", en: "Discover the estate" },
        href: "#tenuta",
      },
      pillars: [
        { it: "Due strutture · due piscine", en: "Two sites · two pools" },
        { it: "Fino a 88 ospiti", en: "Up to 88 guests" },
        { it: "Siena 35 km · Firenze 60 km", en: "Siena 35 km · Florence 60 km" },
      ],
    },

    {
      type: "story",
      id: "tenuta",
      number: "01",
      numberLabel: { it: "LA TENUTA", en: "THE ESTATE" },
      ghost: "NERBONA",
      titleLines: [
        { it: "Tra Siena e Firenze,", en: "Between Siena and Florence," },
        { it: "dove il tempo", en: "where time" },
      ],
      titleEmphasis: { it: "rallenta.", en: "slows down." },
      mainImage: {
        src: "estate/landscape.webp",
        alt: {
          it: "La casa padronale di Nerbona fra i pini",
          en: "The Nerbona farmhouse among the pines",
        },
        caption: {
          it: "Il viale di pini davanti alla sede principale",
          en: "The pine avenue in front of the main house",
        },
      },
      aerialImage: {
        src: "estate/aerial.webp",
        alt: {
          it: "La tenuta vista dall'alto, con il viale di cipressi",
          en: "The estate from above, with its cypress avenue",
        },
        badge: "43°22′ N · 11°03′ E",
      },
      manifesto: {
        label: { it: "DUE STRUTTURE, UNA TENUTA", en: "TWO SITES, ONE ESTATE" },
        text: {
          it: "A pochi minuti dal centro di Colle di Val d'Elsa, immersa nel verde delle colline, Nerbona è il posto dove ritrovare il legame con la natura che la fretta di ogni giorno fa dimenticare. La proprietà ha due strutture: Nerbona, la sede principale, e La Casina, a un chilometro e mezzo, raggiungibile in auto in pochi minuti o con una passeggiata nel bosco. Entrambe hanno piscina, barbecue, giochi e spazi aperti; ogni appartamento, ricavato da un'antica struttura rurale, ha la sua cucina e il suo spazio esterno privato.",
          en: "A few minutes from the centre of Colle di Val d'Elsa, surrounded by green hills, Nerbona is the place to find again the bond with nature that everyday rush makes us forget. The property has two sites: Nerbona, the main one, and La Casina, a kilometre and a half away, a few minutes by car or a walk through the woods. Both have a pool, barbecue, games and open space; every apartment, carved from an old rural building, has its own kitchen and private outdoor area.",
        },
      },
      cursorLabel: { it: "ESPLORA", en: "EXPLORE" },
    },

    /* Alloggi a schede, una per sede: chi arriva in homepage sceglie la
       struttura e trova subito il nome di ogni appartamento, con il
       collegamento diretto al suo riquadro. */
    {
      type: "stayTabs",
      id: "sistemazioni",
      kicker: { it: "Dormire a Nerbona", en: "Stay at Nerbona" },
      title: {
        it: "Venti alloggi, due strutture, un solo paesaggio.",
        en: "Twenty homes, two sites, one landscape.",
      },
      text: {
        it: "Ogni appartamento ha un nome, quello dell'edificio rurale da cui è stato ricavato, una cucina attrezzata e uno spazio esterno privato.",
        en: "Every apartment has a name, that of the farm building it was carved from, an equipped kitchen and a private outdoor space.",
      },
      tabs: [
        {
          label: { it: "Nerbona", en: "Nerbona" },
          text: {
            it: "La sede principale: dodici appartamenti, due camere e Villa L'Aia attorno all'aia, con piscina, reception e chiesetta. Fino a 64 ospiti.",
            en: "The main site: twelve apartments, two rooms and Villa L'Aia around the farmyard, with pool, reception and chapel. Up to 64 guests.",
          },
          stays: [
            "nerbona-bilocale",
            "trilocale",
            "quadrilocale-nerbona",
            "villa-aia",
            "camere-nerbona",
          ],
          link: {
            label: { it: "Aree extra Nerbona", en: "Nerbona extra areas" },
            href: "/aree-extra-nerbona",
          },
        },
        {
          label: { it: "La Casina", en: "La Casina" },
          text: {
            it: "A un chilometro e mezzo, oltre il bosco: cinque appartamenti, una piscina panoramica tutta loro e il portico per le cene. Fino a 24 ospiti.",
            en: "A kilometre and a half away, beyond the wood: five apartments, a panoramic pool of their own and the portico for dinners. Up to 24 guests.",
          },
          stays: ["bilocale-casina", "trilocali-casina", "quadrilocale-casina"],
          link: {
            label: { it: "Aree extra Casina", en: "Casina extra areas" },
            href: "/aree-extra-casina",
          },
        },
      ],
      guestsLabel: { it: "ospiti", en: "guests" },
      linkLabel: { it: "Foto e dettagli", en: "Photos and details" },
    },

    {
      type: "feature",
      id: "sede-nerbona",
      image: {
        src: "estate/pool-nerbona.webp",
        alt: { it: "La piscina di Nerbona", en: "The Nerbona pool" },
      },
      kicker: { it: "Nerbona · sede principale", en: "Nerbona · main site" },
      title: {
        it: "Dodici appartamenti, due camere e Villa L'Aia.",
        en: "Twelve apartments, two rooms and Villa L'Aia.",
      },
      text: {
        it: "Attorno all'aia: la piscina, la reception, la chiesetta di San Luigi, due barbecue e i campi da gioco. Fino a 64 ospiti.",
        en: "Around the farmyard: the pool, reception, the little church of San Luigi, two barbecues and the playing fields. Up to 64 guests.",
      },
      cta: {
        label: { it: "Scopri Nerbona", en: "Discover Nerbona" },
        href: "/aree-extra-nerbona",
      },
    },

    {
      type: "feature",
      id: "sede-casina",
      image: {
        src: "estate/casina.webp",
        alt: { it: "La Casina in primavera", en: "La Casina in spring" },
      },
      kicker: { it: "La Casina · a 1,5 km", en: "La Casina · 1.5 km away" },
      title: {
        it: "Cinque appartamenti, oltre il bosco.",
        en: "Five apartments, beyond the wood.",
      },
      text: {
        it: "Una struttura raccolta con piscina propria, barbecue e un portico per mangiare all'aperto. Fino a 24 ospiti, in un'atmosfera intima.",
        en: "A secluded site with its own pool, barbecue and a portico for eating outdoors. Up to 24 guests, in an intimate atmosphere.",
      },
      cta: {
        label: { it: "Scopri La Casina", en: "Discover La Casina" },
        href: "/aree-extra-casina",
      },
    },

    {
      type: "experiences",
      id: "giornate",
      kicker: { it: "GIORNATE A NERBONA", en: "DAYS AT NERBONA" },
      title: {
        it: "Tutto quello che serve per non ripartire.",
        en: "Everything you need to stay put.",
      },
      intro: {
        it: "Acqua, sentieri e tavole all'aperto, a pochi passi dalla porta di casa.",
        en: "Water, trails and outdoor tables, a few steps from your door.",
      },
      marquee: {
        it: "PISCINE · SENTIERI · BARBECUE · BOSCO · GIOCO · ",
        en: "POOLS · TRAILS · BARBECUE · WOODS · PLAY · ",
      },
      itemLabel: { it: "GIORNATA", en: "DAY" },
      ctaLabel: { it: "Tutti i servizi", en: "All services" },
      ctaHref: "/servizi",
      items: [
        {
          title: "Piscine",
          word: { it: "ACQUA", en: "WATER" },
          meta: {
            it: "Due piscine · dal 25 aprile al 25 settembre",
            en: "Two pools · 25 April to 25 September",
          },
          text: {
            it: "Una per struttura, con lettini e ombrelloni e la vista aperta sulla campagna. Da quella della Casina lo sguardo arriva fino alle colline del Chianti.",
            en: "One at each site, with loungers, parasols and an open view over the countryside. From La Casina's the eye reaches the Chianti hills.",
          },
          image: "experiences/pool.webp",
        },
        {
          title: "Mountain bike",
          word: { it: "SENTIERI", en: "TRAILS" },
          meta: {
            it: "Noleggio in reception · da 5 € mezza giornata",
            en: "Rental at reception · from €5 half day",
          },
          text: {
            it: "Le biciclette si prendono in reception e i sentieri partono dal cancello: strade bianche, boschi e i percorsi ad anello che passano da La Casina.",
            en: "Pick up a bike at reception and the trails start at the gate: white roads, woods and loop routes passing by La Casina.",
          },
          image: "experiences/bike.webp",
        },
        {
          title: "Tavola all'aperto",
          word: { it: "TAVOLA", en: "TABLE" },
          meta: {
            it: "Tre barbecue · forno a legna · portico",
            en: "Three barbecues · wood oven · portico",
          },
          text: {
            it: "Due barbecue a Nerbona, uno alla Casina con il portico e la tavola lunga per le cene di gruppo. Il forno a legna si accende per chi affitta la struttura in esclusiva.",
            en: "Two barbecues at Nerbona, one at La Casina with a portico and a long table for group dinners. The wood oven is lit for those who book the whole site.",
          },
          image: "experiences/table.webp",
        },
      ],
    },

    {
      type: "trail",
      id: "sentiero",
      mainImage: {
        src: "trail/main.webp",
        alt: {
          it: "La strada bianca fra i campi",
          en: "The white road between the fields",
        },
      },
      detailImage: {
        src: "trail/detail.webp",
        alt: { it: "Il bosco in autunno", en: "The wood in autumn" },
      },
      number: "1,5",
      numberUnit: "km",
      kicker: { it: "Da una casa all'altra", en: "From one house to the other" },
      title: {
        it: "Da Nerbona alla Casina si va a piedi, attraverso il bosco.",
        en: "From Nerbona to La Casina you walk, through the wood.",
      },
      text: {
        it: "Un chilometro e mezzo di sentiero fra querce e campi aperti. Da lì partono i percorsi ad anello più lunghi, da fare a piedi o in bicicletta.",
        en: "A kilometre and a half of path among oaks and open fields. Longer loop routes start from there, on foot or by bike.",
      },
      startLabel: { it: "NERBONA", en: "NERBONA" },
      endLabel: { it: "LA CASINA", en: "LA CASINA" },
    },

    /* Indice delle pagine interne: chi arriva in homepage vede subito cosa
       c'è oltre gli alloggi. */
    {
      type: "cards",
      id: "scopri",
      tone: "dark",
      kicker: { it: "Oltre il soggiorno", en: "Beyond your stay" },
      title: {
        it: "Esperienze, feste e la Toscana intorno.",
        en: "Experiences, celebrations and the Tuscany around you.",
      },
      items: [
        {
          meta: { it: "Cucina · falconeria · tartufo", en: "Cooking · falconry · truffles" },
          title: { it: "Esperienze", en: "Experiences" },
          text: {
            it: "Lezioni di cucina, passeggiate col falco, caccia al tartufo, ceramica ed erbe spontanee con chi vive questo territorio.",
            en: "Cooking classes, walks with falcons, truffle hunting, pottery and wild herbs with people who live this land.",
          },
          image: {
            src: "experiences/cooking.webp",
            alt: { it: "Pasta fatta a mano", en: "Handmade pasta" },
          },
          link: { label: { it: "Scopri", en: "Discover" }, href: "/esperienze" },
        },
        {
          meta: { it: "In esclusiva", en: "Exclusive use" },
          title: { it: "Matrimoni", en: "Weddings" },
          text: {
            it: "Per il vostro giorno vi lasciamo l'intera struttura, fra alberi secolari e viali di cipressi.",
            en: "For your day the whole estate is yours, among age-old trees and cypress avenues.",
          },
          image: {
            src: "weddings/01.webp",
            alt: { it: "Sposi nel viale alberato", en: "Couple on the tree-lined avenue" },
          },
          link: { label: { it: "Scopri", en: "Discover" }, href: "/matrimoni-toscana-nerbona" },
        },
        {
          meta: { it: "Storia e tradizioni", en: "History and traditions" },
          title: { it: "Toscana", en: "Tuscany" },
          text: {
            it: "Il paesaggio che si vede dalla piscina è lo stesso dei quadri degli Uffizi. Cosa vedere a mezz'ora e a un'ora da qui.",
            en: "The landscape you see from the pool is the one in the Uffizi paintings. What to see half an hour and an hour away.",
          },
          image: {
            src: "estate/park.webp",
            alt: { it: "Il parco della tenuta", en: "The estate park" },
          },
          link: { label: { it: "Scopri", en: "Discover" }, href: "/storia-e-tradizioni" },
        },
      ],
    },

    {
      type: "reviews",
      id: "ospiti",
      kicker: { it: "Dicono di noi", en: "What guests say" },
      title: {
        it: "Chi viene, di solito torna.",
        en: "Those who come usually come back.",
      },
      items: [
        {
          source: "Tripadvisor",
          score: "5/5",
          title: {
            it: "Una garanzia ogni anno: relax, sport e staff super!",
            en: "A sure thing every year: relaxation, sport and a great team!",
          },
          quote: {
            it: "Torniamo in questo agriturismo ogni anno con gli amici ed è sempre una conferma. Immerso nel verde, offre una piscina splendida e campi da calcio e pallavolo per divertirsi in compagnia.",
            en: "We come back to this farm stay every year with friends and it never disappoints. Surrounded by greenery, it has a beautiful pool and football and volleyball pitches to enjoy together.",
          },
          author: "Maurizio C.",
          date: { it: "Dicembre 2025", en: "December 2025" },
        },
        {
          source: "Google",
          score: "5/5",
          quote: {
            it: "Siamo stati per un week end ed è stato tutto magnifico, la pace e la tranquillità di questo posto è unica. Ci siamo proprio rigenerati.",
            en: "We stayed for a weekend and everything was wonderful; the peace and quiet of this place is unique. We really recharged.",
          },
          author: "Stefano B.",
        },
        {
          source: "Google",
          score: "5/5",
          quote: {
            it: "Dopo molti, molti anni siamo finalmente tornati nella meravigliosa Casina. Ci siamo subito innamorati di nuovo della casa e della zona. Anche i nostri cani sono stati ospiti graditi.",
            en: "After many, many years we finally returned to the wonderful Casina. We fell in love with the house and the area all over again. Our dogs were welcome guests too.",
          },
          author: "Christina F.",
        },
      ],
      links: [
        {
          label: { it: "Tutte le recensioni", en: "All reviews" },
          href: "/recensioni",
        },
      ],
    },

    {
      type: "territory",
      id: "territorio",
      kicker: "Heart of Tuscany",
      title: {
        it: "Fra Siena e Firenze, senza dover scegliere.",
        en: "Between Siena and Florence, without having to choose.",
      },
      text: {
        it: "Colle di Val d'Elsa a pochi minuti, San Gimignano e Volterra a mezz'ora, le due città d'arte a meno di un'ora.",
        en: "Colle di Val d'Elsa minutes away, San Gimignano and Volterra within half an hour, both art cities within the hour.",
      },
      disclaimer: {
        it: "DISTANZE STRADALI INDICATIVE",
        en: "APPROXIMATE DRIVING DISTANCES",
      },
      mapLabel: {
        it: "Mappa stilizzata delle distanze da Fattoria Nerbona",
        en: "Stylised map of distances from Fattoria Nerbona",
      },
      gridLabels: { x: "43°22′ N", y: "11°03′ E" },
      homeLabel: { lines: ["Fattoria", "Nerbona"], sub: "Colle di Val d'Elsa" },
      legend: {
        home: "Nerbona",
        destinations: { it: "Destinazioni", en: "Destinations" },
        note: {
          it: "Distanze stradali indicative",
          en: "Approximate driving distances",
        },
      },
      /* Solo coordinate: posizione e rotta sulla mappa le calcola
         src/lib/map-geometry.ts. */
      items: [
        {
          id: "colle",
          name: { it: "Colle di Val d'Elsa", en: "Colle di Val d'Elsa" },
          distance: "10 km",
          coordinates: { lat: 43.4213, lng: 11.1275 },
        },
        {
          id: "casole",
          name: { it: "Casole d'Elsa", en: "Casole d'Elsa" },
          distance: "9 km",
          coordinates: { lat: 43.3419, lng: 11.0439 },
        },
        {
          id: "gimignano",
          name: { it: "San Gimignano", en: "San Gimignano" },
          distance: "22 km",
          coordinates: { lat: 43.4677, lng: 11.0431 },
        },
        {
          id: "monteriggioni",
          name: { it: "Monteriggioni", en: "Monteriggioni" },
          distance: "22 km",
          coordinates: { lat: 43.3906, lng: 11.2244 },
        },
        {
          id: "volterra",
          name: { it: "Volterra", en: "Volterra" },
          distance: "30 km",
          coordinates: { lat: 43.4014, lng: 10.8608 },
        },
        {
          id: "siena",
          name: { it: "Siena", en: "Siena" },
          distance: "35 km",
          coordinates: { lat: 43.3188, lng: 11.3308 },
        },
        {
          id: "chianti",
          name: { it: "Castellina in Chianti", en: "Castellina in Chianti" },
          distance: "38 km",
          coordinates: { lat: 43.4703, lng: 11.2836 },
        },
        {
          id: "florence",
          name: { it: "Firenze", en: "Florence" },
          distance: "60 km",
          coordinates: { lat: 43.7696, lng: 11.2558 },
        },
      ],
    },

    {
      type: "contact",
      id: "contatti",
      image: {
        src: "contact/main.webp",
        alt: {
          it: "La corte di Nerbona illuminata la sera",
          en: "The Nerbona courtyard lit up at night",
        },
      },
      kicker: { it: "Il vostro soggiorno", en: "Your stay" },
      title: {
        it: "Vi aspettiamo a Nerbona.",
        en: "We look forward to welcoming you.",
      },
      text: {
        it: "Disponibilità e prezzi si vedono in tempo reale sul nostro sistema di prenotazione. Per gruppi, matrimoni o domande sugli alloggi scriveteci: Elena e Cristina vi rispondono direttamente.",
        en: "Availability and prices are live on our booking system. For groups, weddings or questions about the apartments, write to us: Elena and Cristina reply in person.",
      },
      whatsappLabel: {
        it: "Scrivici su WhatsApp",
        en: "Message us on WhatsApp",
      },
      emailLabel: { it: "Invia una email", en: "Send us an email" },
    },
  ],

  /* ================================================================ */
  /* Pagine interne                                                    */
  /* ================================================================ */

  pages: [
    /* --- Nerbona ---------------------------------------------------- */
    {
      slug: "aree-extra-nerbona",
      title: { it: "Aree extra Nerbona", en: "Nerbona extra areas" },
      description: {
        it: "Dodici appartamenti, due camere e Villa L'Aia attorno all'aia, con piscina, barbecue e campi da gioco. Fino a 64 ospiti.",
        en: "Twelve apartments, two rooms and Villa L'Aia around the farmyard, with pool, barbecues and playing fields. Up to 64 guests.",
      },
      sections: [
        {
          type: "hero",
          id: "home",
          size: "compact",
          image: {
            src: "estate/pool-nerbona-2.webp",
            alt: { it: "La piscina di Nerbona", en: "The Nerbona pool" },
          },
          labelParts: [
            { it: "Aree extra", en: "Extra areas" },
            { it: "Nerbona · sede principale", en: "Nerbona · main site" },
          ],
          titleLines: [
            { it: "Nerbona,", en: "Nerbona," },
            { it: "la casa sull'aia.", en: "the house on the farmyard." },
          ],
          intro: {
            it: "Dodici appartamenti, due camere e Villa L'Aia, ricavati dalle case coloniche della fattoria.",
            en: "Twelve apartments, two rooms and Villa L'Aia, carved from the farm's old buildings.",
          },
          cta: {
            label: { it: "Gli spazi comuni", en: "The shared spaces" },
            href: "#aree-extra",
          },
          pillars: [
            { it: "Piscina", en: "Pool" },
            { it: "Due barbecue", en: "Two barbecues" },
            { it: "Chiesetta di San Luigi", en: "Chapel of San Luigi" },
          ],
        },
        {
          type: "gallery",
          id: "aree-extra",
          kicker: { it: "Aree extra", en: "Extra areas" },
          title: {
            it: "Gli spazi in comune.",
            en: "The shared spaces.",
          },
          text: {
            it: "La corte, il forno a legna, la chiesetta e i barbecue: gli spazi che si condividono con gli altri ospiti.",
            en: "The courtyard, wood oven, chapel and barbecues: the spaces shared with the other guests.",
          },
          images: [
            {
              src: "estate/pool-nerbona.webp",
              alt: { it: "La piscina fra gli oleandri", en: "The pool among oleanders" },
            },
            {
              src: "extra/nerbona-corte.webp",
              alt: { it: "La corte", en: "The courtyard" },
            },
            {
              src: "services/cappella.webp",
              alt: { it: "La chiesetta di San Luigi", en: "The chapel of San Luigi" },
            },
            {
              src: "extra/nerbona-forno.webp",
              alt: { it: "Il forno a legna", en: "The wood oven" },
            },
            {
              src: "services/barbecue.webp",
              alt: { it: "Il barbecue nel prato", en: "The barbecue on the lawn" },
            },
            {
              src: "estate/aerial.webp",
              alt: { it: "Nerbona dall'alto", en: "Nerbona from above" },
            },
          ],
        },
        {
          type: "prose",
          id: "struttura",
          kicker: { it: "La struttura principale", en: "The main site" },
          title: {
            it: "Una fattoria vera, con la sua chiesetta e il suo viale di pini.",
            en: "A real farm, with its own chapel and pine avenue.",
          },
          paragraphs: [
            {
              it: "Nerbona è il cuore della tenuta. Gli alloggi sono distribuiti fra la casa padronale e gli edifici che un tempo servivano al lavoro dei campi: la mangiatoia, il granaio, il forno, la piccionaia. I nomi degli appartamenti vengono da lì.",
              en: "Nerbona is the heart of the estate. The apartments are spread between the main house and the buildings that once served the work of the fields: the manger, the granary, the oven, the dovecote. The apartments take their names from them.",
            },
            {
              it: "Qui si trovano anche la reception, la casa del custode e una piccola chiesa consacrata dedicata a San Luigi. Intorno, la piscina, due barbecue, le mountain bike, il ping pong, il biliardino, la rete da pallavolo, l'altalena e le porte da calcio.",
              en: "Here you'll also find the reception, the caretaker's house and a small consecrated church dedicated to San Luigi. All around: the pool, two barbecues, mountain bikes, table tennis, table football, a volleyball net, a swing and football goals.",
            },
          ],
          image: {
            src: "estate/park.webp",
            alt: { it: "Il parco di Nerbona", en: "The Nerbona park" },
          },
        },
        {
          type: "stays",
          id: "alloggi",
          kicker: { it: "GLI ALLOGGI DI NERBONA", en: "APARTMENTS AT NERBONA" },
          title: {
            it: "Dal bilocale per due alla villa per otto.",
            en: "From a one-bedroom for two to a villa for eight.",
          },
          sizeLabel: { it: "ALLOGGI", en: "UNITS" },
          guestsLabel: { it: "OSPITI", en: "GUESTS" },
          linkLabel: { it: "Scopri gli alloggi", en: "See the apartments" },
          scrollHint: { it: "SCORRI PER ESPLORARE", en: "SCROLL TO EXPLORE" },
          endCard: {
            lines: ["NERBONA"],
            cta: {
              label: { it: "Verifica disponibilità", en: "Check availability" },
              href: "#contatti",
            },
          },
          only: [
            "nerbona-bilocale",
            "trilocale",
            "quadrilocale-nerbona",
            "villa-aia",
            "camere-nerbona",
          ],
        },
        {
          type: "contact",
          id: "contatti",
          image: {
            src: "estate/landscape.webp",
            alt: { it: "La casa padronale", en: "The main house" },
          },
          kicker: { it: "Soggiornare a Nerbona", en: "Staying at Nerbona" },
          title: {
            it: "Scegliete l'alloggio, al resto pensiamo noi.",
            en: "Choose your apartment, we'll take care of the rest.",
          },
          text: {
            it: "Prenotate online o scriveteci: vi aiutiamo a trovare l'appartamento della misura giusta.",
            en: "Book online or write to us: we'll help you find the right-sized apartment.",
          },
          whatsappLabel: { it: "Scrivici su WhatsApp", en: "Message us on WhatsApp" },
          emailLabel: { it: "Invia una email", en: "Send us an email" },
        },
      ],
    },

    /* --- La Casina -------------------------------------------------- */
    {
      slug: "aree-extra-casina",
      title: { it: "Aree extra Casina", en: "Casina extra areas" },
      description: {
        it: "Cinque appartamenti a un chilometro e mezzo da Nerbona, con piscina propria, barbecue e portico. Fino a 24 ospiti.",
        en: "Five apartments a kilometre and a half from Nerbona, with their own pool, barbecue and portico. Up to 24 guests.",
      },
      sections: [
        {
          type: "hero",
          id: "home",
          size: "compact",
          image: {
            src: "extra/casina-piscina-rose.webp",
            alt: { it: "La piscina della Casina", en: "La Casina's pool" },
          },
          labelParts: [
            { it: "Aree extra", en: "Extra areas" },
            { it: "La Casina · a 1,5 km", en: "La Casina · 1.5 km away" },
          ],
          titleLines: [
            { it: "La Casina,", en: "La Casina," },
            { it: "oltre il bosco.", en: "beyond the wood." },
          ],
          intro: {
            it: "Cinque appartamenti, una piscina tutta loro e un portico per le cene d'estate.",
            en: "Five apartments, a pool of their own and a portico for summer dinners.",
          },
          cta: {
            label: { it: "Gli spazi comuni", en: "The shared spaces" },
            href: "#aree-extra",
          },
          pillars: [
            { it: "Piscina riservata", en: "Private pool" },
            { it: "Portico e barbecue", en: "Portico and barbecue" },
            { it: "Nerbona · 1,5 km", en: "Nerbona · 1.5 km" },
          ],
        },
        {
          type: "gallery",
          id: "aree-extra",
          kicker: { it: "Aree extra", en: "Extra areas" },
          title: { it: "Il portico, il prato, il glicine.", en: "The portico, the lawn, the wisteria." },
          images: [
            {
              src: "extra/casina-capanna-tavola.webp",
              alt: { it: "La tavola sotto il portico", en: "The table under the portico" },
            },
            {
              src: "extra/casina-capanna-glicine.webp",
              alt: { it: "Il portico e il glicine", en: "The portico and the wisteria" },
            },
            {
              src: "extra/casina-capanna-fiori.webp",
              alt: { it: "Il glicine in fiore", en: "The wisteria in bloom" },
            },
            {
              src: "extra/casina-capanna.webp",
              alt: { it: "Il portico in pietra", en: "The stone portico" },
            },
            {
              src: "extra/casina-barbecue.webp",
              alt: { it: "Il barbecue", en: "The barbecue" },
            },
            {
              src: "extra/casina-finestra.webp",
              alt: { it: "La piscina vista dalla finestra", en: "The pool from a window" },
            },
            {
              src: "extra/casina-prato.webp",
              alt: { it: "Il prato della Casina", en: "La Casina's lawn" },
            },
            {
              src: "estate/casina-view.webp",
              alt: { it: "La vista sulle colline", en: "The view over the hills" },
            },
            {
              src: "extra/casina-piscina-rose.webp",
              alt: { it: "Rose a bordo piscina", en: "Roses by the pool" },
            },
          ],
        },
        {
          type: "prose",
          id: "struttura",
          kicker: { it: "La seconda struttura", en: "The second site" },
          title: {
            it: "Per chi cerca il silenzio, un chilometro e mezzo più in là.",
            en: "For those seeking quiet, a kilometre and a half further on.",
          },
          paragraphs: [
            {
              it: "Dalla sede principale si arriva alla Casina in pochi minuti d'auto, oppure a piedi attraverso un boschetto. È una struttura raccolta: cinque appartamenti soltanto, una piscina, il barbecue, l'altalena e le porte da calcio.",
              en: "La Casina is a few minutes' drive from the main site, or a walk through a small wood. It's a secluded place: just five apartments, a pool, a barbecue, a swing and football goals.",
            },
            {
              it: "Sotto il portico di pietra, con le sedute e un lavello con acqua calda, c'è una tavola lunga per mangiare tutti insieme; d'estate il glicine ci fa ombra. La piscina è un po' più piccola di quella di Nerbona, ma ha la vista più aperta sulla campagna. Il Wi-Fi è disponibile nelle zone comuni, all'esterno degli appartamenti: per molti ospiti è un pregio.",
              en: "Under the stone portico, with seating and a sink with hot water, there's a long table for eating together; in summer the wisteria gives shade. The pool is a little smaller than Nerbona's, but has the most open view over the countryside. Wi-Fi is available in the shared areas, outside the apartments: many guests see that as a plus.",
            },
          ],
          image: {
            src: "estate/casina-aerial.webp",
            alt: { it: "La Casina dall'alto", en: "La Casina from above" },
          },
        },
        {
          type: "feature",
          id: "piscina",
          image: {
            src: "estate/pool-casina.webp",
            alt: { it: "La piscina della Casina", en: "La Casina's pool" },
          },
          kicker: { it: "La piscina", en: "The pool" },
          title: {
            it: "Una piscina per cinque appartamenti.",
            en: "One pool for five apartments.",
          },
          text: {
            it: "Aperta dal 25 aprile al 25 settembre, tempo permettendo, con la campagna senese tutto intorno.",
            en: "Open from 25 April to 25 September, weather permitting, with the Sienese countryside all around.",
          },
        },
        {
          type: "stays",
          id: "alloggi",
          kicker: { it: "GLI ALLOGGI DELLA CASINA", en: "APARTMENTS AT LA CASINA" },
          title: {
            it: "Cinque case, un solo cortile.",
            en: "Five homes, one courtyard.",
          },
          sizeLabel: { it: "ALLOGGI", en: "UNITS" },
          guestsLabel: { it: "OSPITI", en: "GUESTS" },
          linkLabel: { it: "Scopri gli alloggi", en: "See the apartments" },
          scrollHint: { it: "SCORRI PER ESPLORARE", en: "SCROLL TO EXPLORE" },
          endCard: {
            lines: ["LA", "CASINA"],
            cta: {
              label: { it: "Verifica disponibilità", en: "Check availability" },
              href: "#contatti",
            },
          },
          only: ["bilocale-casina", "trilocali-casina", "quadrilocale-casina"],
        },
        {
          type: "contact",
          id: "contatti",
          image: {
            src: "estate/casina.webp",
            alt: { it: "La Casina", en: "La Casina" },
          },
          kicker: { it: "Soggiornare alla Casina", en: "Staying at La Casina" },
          title: {
            it: "Cinque appartamenti, prenotateli per tempo.",
            en: "Only five apartments: book early.",
          },
          text: {
            it: "Per un gruppo fino a 24 persone si può prenotare l'intera struttura: scriveteci.",
            en: "Groups of up to 24 can book the whole site: write to us.",
          },
          whatsappLabel: { it: "Scrivici su WhatsApp", en: "Message us on WhatsApp" },
          emailLabel: { it: "Invia una email", en: "Send us an email" },
        },
      ],
    },

    /* --- Servizi ---------------------------------------------------- */
    /* Impaginazione editoriale: prima le risposte pratiche da leggere in
       dieci secondi, poi le giornate raccontate per capitoli. */
    {
      slug: "servizi",
      title: { it: "Servizi", en: "Services" },
      description: {
        it: "Colazione, due piscine, mountain bike, barbecue, Wi-Fi, parcheggio gratuito e animali ammessi: i servizi di Fattoria Nerbona.",
        en: "Breakfast, two pools, mountain bikes, barbecues, Wi-Fi, free parking and pets welcome: the services at Fattoria Nerbona.",
      },
      sections: [
        {
          type: "hero",
          id: "home",
          size: "editorial",
          image: {
            src: "estate/pool-nerbona-2.webp",
            alt: { it: "La piscina di Nerbona affacciata sulla campagna", en: "The Nerbona pool overlooking the countryside" },
          },
          labelParts: [
            { it: "Nerbona", en: "Nerbona" },
            { it: "La Casina", en: "La Casina" },
          ],
          titleLines: [
            { it: "Servizi e", en: "Services and" },
            { it: "ospitalità", en: "hospitality" },
          ],
          intro: {
            it: "Tutto a portata di mano, niente di troppo: quello che trovate in entrambe le strutture e quello che serve sapere prima di arrivare.",
            en: "Everything at hand, nothing too much: what you'll find at both sites and what to know before you arrive.",
          },
          cta: {
            label: { it: "Informazioni pratiche", en: "Practical information" },
            href: "#informazioni",
          },
          pillars: [
            { it: "Colazione da aprile a ottobre", en: "Breakfast April to October" },
            { it: "Parcheggio e Wi-Fi gratuiti", en: "Free parking and Wi-Fi" },
            { it: "Animali benvenuti", en: "Pets welcome" },
          ],
        },
        {
          type: "facts",
          id: "informazioni",
          kicker: { it: "Prima di arrivare", en: "Before you arrive" },
          title: { it: "Da sapere", en: "Good to know" },
          text: {
            it: "Alla prenotazione ricevete anche il link al nostro mini-sito digitale, con tutte le informazioni e i contatti per organizzare il soggiorno.",
            en: "When you book you also receive a link to our digital guest guide, with all the information and contacts to plan your stay.",
          },
          image: {
            src: "services/reception.webp",
            alt: { it: "La reception di Nerbona", en: "The Nerbona reception" },
          },
          items: [
            {
              label: { it: "Colazione", en: "Breakfast" },
              value: { it: "A buffet, da aprile a ottobre", en: "Buffet, April to October" },
              note: {
                it: "Mesi di aprile e ottobre compresi. Va prenotata almeno tre giorni prima.",
                en: "April and October included. To be booked at least three days in advance.",
              },
            },
            {
              label: { it: "Soggiorno minimo", en: "Minimum stay" },
              value: { it: "Due notti negli appartamenti", en: "Two nights in the apartments" },
              note: {
                it: "Una notte nelle camere Lavanda e Ortensia, tre notti a Villa L'Aia.",
                en: "One night in the Lavanda and Ortensia rooms, three nights at Villa L'Aia.",
              },
            },
            {
              label: { it: "Chi vi accoglie", en: "Your hosts" },
              value: { it: "Elena e Cristina", en: "Elena and Cristina" },
              note: {
                it: "Parliamo italiano, inglese, francese, tedesco e spagnolo.",
                en: "We speak Italian, English, French, German and Spanish.",
              },
            },
            {
              label: { it: "Reception", en: "Reception" },
              value: { it: "A orari prestabiliti", en: "At set times" },
              note: { it: "Gli orari sono esposti alla finestra dell'ufficio.", en: "Opening times are posted on the office window." },
            },
            {
              label: { it: "Arrivo tardi", en: "Late arrival" },
              value: { it: "Check-in autonomo", en: "Self check-in" },
              note: { it: "Per chi arriva in tarda serata, da concordare prima con la reception.", en: "For late-evening arrivals, to be arranged in advance with reception." },
            },
            {
              label: { it: "Parcheggio", en: "Parking" },
              value: { it: "Gratuito, in entrambe le strutture", en: "Free, at both sites" },
              note: { it: "Ampio e all'interno della proprietà.", en: "Spacious and within the property." },
            },
            {
              label: { it: "Wi-Fi", en: "Wi-Fi" },
              value: { it: "Gratuito", en: "Free" },
              note: {
                it: "A Nerbona dentro gli alloggi e nelle zone comuni; alla Casina nelle zone comuni, all'esterno degli alloggi.",
                en: "At Nerbona inside the apartments and in shared areas; at La Casina in shared areas, outside the apartments.",
              },
            },
            {
              label: { it: "Lavatrici", en: "Laundry" },
              value: { it: "Gratuite, in entrambe le strutture", en: "Free, at both sites" },
              note: { it: "Il detersivo non è fornito.", en: "Detergent is not provided." },
            },
            {
              label: { it: "Animali", en: "Pets" },
              value: { it: "Benvenuti, con supplemento", en: "Welcome, for a fee" },
              note: { it: "In tutti gli alloggi tranne Villa L'Aia.", en: "In every apartment except Villa L'Aia." },
            },
            {
              label: { it: "Famiglie", en: "Families" },
              value: { it: "Giochi e seggiolini per bambini", en: "Games and child seats" },
              note: {
                it: "Spazi aperti, area giochi e seggiolini per le biciclette.",
                en: "Open spaces, a play area and child seats for the bikes.",
              },
            },
            {
              label: { it: "Sostenibilità", en: "Sustainability" },
              value: { it: "Energia da fonti rinnovabili", en: "Renewable energy" },
              note: {
                it: "Raccolta differenziata, saponi ecologici nei bagni, attenzione al risparmio di acqua ed energia.",
                en: "Waste sorting, eco-friendly soaps in the bathrooms, care for saving water and energy.",
              },
            },
          ],
        },
        {
          type: "chapters",
          id: "tempo-libero",
          kicker: { it: "Tempo libero", en: "Leisure" },
          title: { it: "Le giornate a Nerbona", en: "Days at Nerbona" },
          items: [
            {
              word: { it: "Piscine", en: "Pools" },
              kicker: { it: "Dal 25 aprile al 25 settembre", en: "25 April to 25 September" },
              title: { it: "Una piscina per ogni struttura", en: "A pool at each site" },
              text: {
                it: "Nerbona e La Casina hanno ciascuna la propria piscina, con lettini e ombrelloni e la campagna senese tutto intorno. Sono aperte compatibilmente con il meteo.",
                en: "Nerbona and La Casina each have their own pool, with loungers, parasols and the Sienese countryside all around. They open weather permitting.",
              },
              image: {
                src: "estate/pool-nerbona.webp",
                alt: { it: "La piscina di Nerbona fra gli oleandri", en: "The Nerbona pool among oleanders" },
              },
            },
            {
              word: { it: "Sentieri", en: "Trails" },
              kicker: { it: "Mountain bike a noleggio", en: "Mountain bikes for hire" },
              title: { it: "In bicicletta dal cancello", en: "By bike from the gate" },
              text: {
                it: "Le biciclette si prendono in reception. Strade bianche, boschi e i percorsi ad anello che passano dalla Casina partono direttamente dalla fattoria.",
                en: "Pick up your bike at reception. White roads, woods and the loop routes passing La Casina start right from the farm.",
              },
              details: [
                { it: "Mezza giornata · 5 € a bicicletta", en: "Half day · €5 per bike" },
                { it: "Giornata intera · 10 € a bicicletta", en: "Full day · €10 per bike" },
                { it: "Cauzione in contanti o carta di credito", en: "Cash or credit card deposit" },
              ],
              image: {
                src: "experiences/bike.webp",
                alt: { it: "Mountain bike sotto gli alberi", en: "Mountain bikes under the trees" },
              },
              link: {
                label: { it: "I percorsi su Komoot", en: "Routes on Komoot" },
                href: "https://www.komoot.com/it-it/user/5424558277270/routes?type=planned",
              },
            },
            {
              word: { it: "Giochi", en: "Games" },
              kicker: { it: "Per grandi e bambini", en: "For adults and children" },
              title: { it: "Spazio per correre", en: "Room to run" },
              text: {
                it: "Biliardino, ping pong, rete da pallavolo, porte da calcio e altalene. I palloni si chiedono in reception, con una piccola cauzione.",
                en: "Table football, table tennis, a volleyball net, football goals and swings. Balls are available at reception, against a small deposit.",
              },
              details: [
                { it: "Biliardino · Ping pong", en: "Table football · Table tennis" },
                { it: "Pallavolo · Calcetto", en: "Volleyball · Five-a-side" },
              ],
              image: {
                src: "services/ping-pong.webp",
                alt: { it: "Il tavolo da ping pong", en: "The table tennis table" },
              },
            },
            {
              word: { it: "Brace", en: "Embers" },
              kicker: { it: "Barbecue e forno a legna", en: "Barbecues and wood oven" },
              title: { it: "Cene all'aperto", en: "Dinners outdoors" },
              text: {
                it: "Due barbecue a Nerbona e uno alla Casina, accanto al portico con la tavola lunga. A Nerbona c'è anche un forno a legna tradizionale, che si usa affittando l'intera struttura.",
                en: "Two barbecues at Nerbona and one at La Casina, next to the portico with its long table. Nerbona also has a traditional wood-fired oven, available when renting the whole site.",
              },
              details: [
                { it: "La carbonella non è fornita", en: "Charcoal not provided" },
                { it: "Forno a legna solo in esclusiva", en: "Wood oven for exclusive use only" },
              ],
              image: {
                src: "services/forno.webp",
                alt: { it: "Pizze nel forno a legna", en: "Pizzas in the wood oven" },
              },
            },
            {
              word: { it: "San Luigi", en: "San Luigi" },
              kicker: { it: "A Nerbona", en: "At Nerbona" },
              title: { it: "La chiesetta della fattoria", en: "The farm's little church" },
              text: {
                it: "Una piccola chiesa consacrata, dedicata a San Luigi, fa parte della fattoria da sempre: un luogo raccolto a pochi passi dagli alloggi.",
                en: "A small consecrated church dedicated to San Luigi has always been part of the farm: a quiet place a few steps from the apartments.",
              },
              image: {
                src: "services/cappella.webp",
                alt: { it: "L'interno della cappella", en: "Inside the chapel" },
              },
            },
          ],
        },
        {
          type: "contact",
          id: "contatti",
          image: {
            src: "extra/casina-capanna-tavola.webp",
            alt: { it: "La tavola sotto il portico", en: "The table under the portico" },
          },
          kicker: { it: "Domande?", en: "Questions?" },
          title: { it: "Chiedete pure.", en: "Just ask." },
          text: {
            it: "Per esigenze particolari, animali, arrivi tardi o gruppi scriveteci prima di prenotare.",
            en: "For special requests, pets, late arrivals or groups, write to us before booking.",
          },
          whatsappLabel: { it: "Scrivici su WhatsApp", en: "Message us on WhatsApp" },
          emailLabel: { it: "Invia una email", en: "Send us an email" },
        },
      ],
    },

    /* --- Esperienze ------------------------------------------------- */
    /* Le attività sono di collaboratori esterni: i loro recapiti vanno in
       `details`, il sito in `link`. */
    {
      slug: "esperienze",
      title: { it: "Esperienze", en: "Experiences" },
      description: {
        it: "Cooking class, passeggiate col falco, caccia al tartufo, ceramica ed erbe spontanee: esperienze in Val d'Elsa da Fattoria Nerbona.",
        en: "Cooking classes, falconry walks, truffle hunting, pottery and wild herbs: experiences in Val d'Elsa from Fattoria Nerbona.",
      },
      sections: [
        {
          type: "hero",
          id: "home",
          size: "compact",
          image: {
            src: "trail/main.webp",
            alt: { it: "Una strada bianca in Val d'Elsa", en: "A white road in Val d'Elsa" },
          },
          labelParts: [
            { it: "Esperienze", en: "Experiences" },
            { it: "Val d'Elsa", en: "Val d'Elsa" },
          ],
          titleLines: [
            { it: "La Toscana,", en: "Tuscany," },
            { it: "con le mani.", en: "hands-on." },
          ],
          intro: {
            it: "Pasta fatta in casa, un falco sul braccio, un cane che fiuta il tartufo. Con chi vive questo territorio.",
            en: "Homemade pasta, a falcon on your arm, a dog sniffing out truffles. With people who live this land.",
          },
          cta: {
            label: { it: "Le esperienze", en: "The experiences" },
            href: "#esperienze",
          },
          pillars: [
            { it: "Cucina", en: "Cooking" },
            { it: "Natura", en: "Nature" },
            { it: "Artigianato", en: "Crafts" },
          ],
        },
        {
          type: "cards",
          id: "esperienze",
          kicker: { it: "Da prenotare", en: "To book" },
          title: {
            it: "Sei modi di conoscere la Val d'Elsa.",
            en: "Six ways to get to know Val d'Elsa.",
          },
          text: {
            it: "Le esperienze sono organizzate con professionisti della zona: per date e prezzi contattate direttamente i riferimenti indicati.",
            en: "Experiences are run with local professionals: for dates and prices contact them directly using the details below.",
          },
          items: [
            {
              meta: { it: "Minimo 2 persone · circa 3 ore", en: "Minimum 2 people · about 3 hours" },
              title: { it: "Lezione di cucina", en: "Cooking class" },
              text: {
                it: "Pasta fresca, ravioli di ricotta e tagliatelle al pomodoro, poi il tiramisù. Con una bottiglia di vino bianco locale ogni tre persone. Opzioni su misura per grandi gruppi.",
                en: "Fresh pasta, ricotta ravioli and tagliatelle with tomato sauce, then tiramisù. With a bottle of local white wine for every three people. Tailored options for large groups.",
              },
              image: {
                src: "experiences/cooking.webp",
                alt: { it: "Ravioli fatti a mano", en: "Handmade ravioli" },
              },
              details: [
                { it: "Su prenotazione in reception", en: "Book at reception" },
              ],
            },
            {
              meta: { it: "Percorsi ad anello da Nerbona", en: "Loop routes from Nerbona" },
              title: { it: "Passeggiate", en: "Walks" },
              text: {
                it: "Itinerari ad anello che partono dalla fattoria, fra boschi, campi e strade bianche. Si seguono dal telefono.",
                en: "Loop itineraries starting from the farm, through woods, fields and white roads. Follow them on your phone.",
              },
              image: {
                src: "experiences/walk.webp",
                alt: { it: "Un sentiero nel bosco", en: "A path through the wood" },
              },
              link: {
                label: { it: "I percorsi su Komoot", en: "Routes on Komoot" },
                href: "https://www.komoot.com/it-it/user/5424558277270/routes?type=planned",
              },
            },
            {
              meta: { it: "Wild Mood Tuscany", en: "Wild Mood Tuscany" },
              title: { it: "Passeggiate col falco", en: "Walks with a falcon" },
              text: {
                it: "La falconeria è un'arte antica e poco conosciuta. Cosa vuol dire addestrare un rapace e lavorarci ogni giorno? Un'emozione inattesa.",
                en: "Falconry is an ancient, little-known art. What does it mean to train a bird of prey and work with it every day? An unexpected thrill.",
              },
              image: {
                src: "experiences/falconry.webp",
                alt: { it: "Falconeria", en: "Falconry" },
              },
              details: [{ it: "Francesca · +39 366 494 7500", en: "Francesca · +39 366 494 7500" }],
              link: {
                label: { it: "wildmoodtuscany.it", en: "wildmoodtuscany.it" },
                href: "https://www.wildmoodtuscany.it/",
              },
            },
            {
              meta: { it: "Casole Truffle", en: "Casole Truffle" },
              title: { it: "Caccia al tartufo", en: "Truffle hunting" },
              text: {
                it: "Con tartufai esperti e i loro cani, nei boschi della Val d'Elsa: tradizione, mistero e sapori autentici.",
                en: "With expert truffle hunters and their dogs in the Val d'Elsa woods: tradition, mystery and authentic flavours.",
              },
              image: {
                src: "experiences/truffle.webp",
                alt: { it: "Cani da tartufo", en: "Truffle dogs" },
              },
              details: [
                { it: "Francesca · +39 366 494 7500", en: "Francesca · +39 366 494 7500" },
                { it: "Amedeo · +39 340 221 7901", en: "Amedeo · +39 340 221 7901" },
              ],
              link: {
                label: { it: "casoletruffle.com", en: "casoletruffle.com" },
                href: "https://casoletruffle.com/",
              },
            },
            {
              meta: { it: "Workshop di 2–3 ore in struttura", en: "2–3 hour workshop on site" },
              title: { it: "Laboratorio di ceramica", en: "Pottery workshop" },
              text: {
                it: "Adatto anche a chi non ha mai toccato l'argilla, in gruppo o in coppia. Si torna a casa con un oggetto unico, ricordo del luogo.",
                en: "Suitable even if you've never touched clay, in a group or as a couple. You take home a unique piece, a keepsake of the place.",
              },
              image: {
                src: "experiences/ceramics.webp",
                alt: { it: "Mani che modellano l'argilla", en: "Hands shaping clay" },
              },
              details: [{ it: "Barbara · +39 351 925 9879", en: "Barbara · +39 351 925 9879" }],
              link: {
                label: { it: "barbaraceramics.com", en: "barbaraceramics.com" },
                href: "https://www.barbaraceramics.com/",
              },
            },
            {
              meta: { it: "Wild Mood Tuscany", en: "Wild Mood Tuscany" },
              title: { it: "Erbe spontanee", en: "Wild herbs" },
              text: {
                it: "Tra tradizioni agresti e saperi popolari, le cosiddette erbacce rivelano sapori e profumi inattesi, e diventano una risorsa in cucina.",
                en: "Between country traditions and folk knowledge, so-called weeds reveal unexpected flavours and scents, and become a resource in the kitchen.",
              },
              image: {
                src: "experiences/herbs.webp",
                alt: { it: "Raccolta di erbe", en: "Foraging herbs" },
              },
              details: [{ it: "Francesca · +39 366 494 7500", en: "Francesca · +39 366 494 7500" }],
              link: {
                label: { it: "wildmoodtuscany.it", en: "wildmoodtuscany.it" },
                href: "https://www.wildmoodtuscany.it/",
              },
            },
          ],
        },
        {
          type: "contact",
          id: "contatti",
          image: {
            src: "trail/detail.webp",
            alt: { it: "Il bosco in autunno", en: "The wood in autumn" },
          },
          kicker: { it: "Organizzare il soggiorno", en: "Planning your stay" },
          title: {
            it: "Vi aiutiamo a incastrare tutto.",
            en: "We'll help you fit it all in.",
          },
          text: {
            it: "Diteci le date e cosa vi piacerebbe fare: vi mettiamo in contatto con le persone giuste.",
            en: "Tell us your dates and what you'd like to do: we'll put you in touch with the right people.",
          },
          whatsappLabel: { it: "Scrivici su WhatsApp", en: "Message us on WhatsApp" },
          emailLabel: { it: "Invia una email", en: "Send us an email" },
        },
      ],
    },

    /* --- Matrimoni -------------------------------------------------- */
    {
      slug: "matrimoni-toscana-nerbona",
      title: { it: "Matrimoni in Toscana", en: "Weddings in Tuscany" },
      description: {
        it: "Matrimoni in esclusiva a Fattoria Nerbona: alberi secolari, viali di pini e venti alloggi per gli invitati, tra Siena e Firenze.",
        en: "Exclusive weddings at Fattoria Nerbona: age-old trees, pine avenues and twenty apartments for guests, between Siena and Florence.",
      },
      sections: [
        {
          type: "hero",
          id: "home",
          size: "editorial",
          image: {
            src: "weddings/01.webp",
            alt: { it: "Gli sposi nel viale di pini", en: "The couple on the pine avenue" },
          },
          labelParts: [
            { it: "Matrimoni", en: "Weddings" },
            { it: "In esclusiva", en: "Exclusive use" },
          ],
          titleLines: [
            { it: "Matrimoni", en: "Weddings" },
            { it: "in Toscana", en: "in Tuscany" },
          ],
          intro: {
            it: "Per il vostro giorno vi lasciamo l'intera struttura, incorniciata da alberi secolari, in un paesaggio che non ha bisogno di allestimenti.",
            en: "For your day the whole estate is yours, framed by age-old trees, in a landscape that needs no decoration.",
          },
          cta: {
            label: { it: "Richiedi una proposta", en: "Ask for a proposal" },
            href: "#contatti",
          },
          pillars: [
            { it: "Tutta la tenuta in esclusiva", en: "The whole estate, exclusively" },
            { it: "Fino a 88 ospiti a dormire", en: "Up to 88 guests staying" },
            { it: "Tra Siena e Firenze", en: "Between Siena and Florence" },
          ],
        },
        {
          type: "chapters",
          id: "il-giorno",
          kicker: { it: "Il vostro giorno", en: "Your day" },
          title: { it: "Dalla cerimonia all'ultimo brindisi", en: "From the ceremony to the last toast" },
          items: [
            {
              word: { it: "Cerimonia", en: "Ceremony" },
              kicker: { it: "Nel parco", en: "In the park" },
              title: { it: "Sotto gli alberi secolari", en: "Beneath age-old trees" },
              text: {
                it: "Il parco della fattoria offre l'ombra dei suoi alberi alla cerimonia civile o simbolica, con il viale di pini come sfondo naturale per le fotografie.",
                en: "The farm's park lends the shade of its trees to a civil or symbolic ceremony, with the pine avenue as a natural backdrop for photographs.",
              },
              image: {
                src: "weddings/17.webp",
                alt: { it: "L'altare nel parco tra i girasoli", en: "The altar in the park among sunflowers" },
              },
            },
            {
              word: { it: "Ricevimento", en: "Reception" },
              kicker: { it: "Tavole all'aperto", en: "Tables outdoors" },
              title: { it: "La cena sotto le luci", en: "Dinner under the lights" },
              text: {
                it: "Tavolate lunghe sui prati, sotto il portico o nella limonaia, e la sera la fattoria illuminata. Con l'esclusiva si può accendere anche il forno a legna.",
                en: "Long tables on the lawns, under the portico or in the lemon house, and in the evening the farm lit up. Exclusive use also includes the wood-fired oven.",
              },
              image: {
                src: "weddings/02.webp",
                alt: { it: "La tavolata nuziale", en: "The wedding table" },
              },
            },
            {
              word: { it: "Ospiti", en: "Guests" },
              kicker: { it: "Venti alloggi", en: "Twenty apartments" },
              title: { it: "Gli invitati dormono qui", en: "Your guests stay here" },
              text: {
                it: "Fra Nerbona e La Casina ci sono venti alloggi, fino a 88 posti letto: famiglia e amici possono restare per tutto il fine settimana, senza spostamenti.",
                en: "Between Nerbona and La Casina there are twenty apartments, sleeping up to 88: family and friends can stay all weekend, with no travelling.",
              },
              image: {
                src: "weddings/18.webp",
                alt: { it: "La fattoria illuminata la sera", en: "The farm lit up at night" },
              },
            },
            {
              word: { it: "Insieme", en: "Together" },
              kicker: { it: "L'organizzazione", en: "Planning" },
              title: { it: "Al vostro fianco, dall'inizio", en: "By your side, from the start" },
              text: {
                it: "Vi accompagniamo nei preparativi, dalla prima visita al giorno della festa, insieme ai fornitori che scegliete.",
                en: "We guide you through the preparations, from the first visit to the day itself, together with the suppliers you choose.",
              },
              image: {
                src: "weddings/09.webp",
                alt: { it: "Gli sposi fra i campi", en: "The couple among the fields" },
              },
            },
          ],
        },
        {
          type: "reviews",
          id: "testimonianza",
          layout: "editorial",
          kicker: { it: "Si sono sposati qui", en: "They married here" },
          title: { it: "Parola di sposi", en: "In their words" },
          items: [
            {
              source: "Google",
              score: "5/5",
              quote: {
                it: "Abbiamo scelto l'Agriturismo Nerbona come location per il nostro matrimonio. Elena e Cristina sono state molto disponibili e ci hanno supportato durante l'intero processo di organizzazione. Consiglio vivamente questa splendida location a chiunque sogni un matrimonio indimenticabile in Toscana.",
                en: "We chose Agriturismo Nerbona for our wedding venue. Elena and Cristina were very helpful and supported us throughout the entire planning process. I would highly recommend this beautiful location to anyone dreaming of a memorable Tuscany wedding.",
              },
              author: "Aaron G.",
            },
          ],
        },
        {
          type: "gallery",
          id: "galleria",
          kicker: { it: "Matrimoni a Nerbona", en: "Weddings at Nerbona" },
          title: { it: "Feste che abbiamo ospitato.", en: "Celebrations we have hosted." },
          images: [
            { src: "weddings/03.webp", alt: { it: "Il parco il giorno della festa", en: "The park on the wedding day" } },
            { src: "weddings/04.webp", alt: { it: "Angolo lounge sul prato", en: "Lounge corner on the lawn" } },
            { src: "weddings/06.webp", alt: { it: "Tavola nella limonaia", en: "Table in the lemon house" } },
            { src: "weddings/05.webp", alt: { it: "Fiori sulla sedia", en: "Flowers on a chair" } },
            { src: "weddings/07.webp", alt: { it: "Tavola all'aperto", en: "Outdoor table" } },
            { src: "weddings/08.webp", alt: { it: "Cuscini e lanterne nel bosco", en: "Cushions and lanterns in the wood" } },
            { src: "weddings/10.webp", alt: { it: "Sedie e girasoli", en: "Chairs and sunflowers" } },
            { src: "weddings/11.webp", alt: { it: "Cena sotto il portico", en: "Dinner under the portico" } },
            { src: "weddings/13.webp", alt: { it: "Ospiti alla cerimonia", en: "Guests at the ceremony" } },
          ],
        },
        {
          type: "contact",
          id: "contatti",
          image: {
            src: "weddings/15.webp",
            alt: { it: "Allestimento nel bosco", en: "Setting in the wood" },
          },
          kicker: { it: "Il vostro matrimonio", en: "Your wedding" },
          title: { it: "Raccontateci la vostra idea.", en: "Tell us your idea." },
          text: {
            it: "Scriveteci la data e il numero di invitati: vi rispondiamo con la disponibilità e una proposta.",
            en: "Send us the date and number of guests: we'll reply with availability and a proposal.",
          },
          whatsappLabel: { it: "Scrivici su WhatsApp", en: "Message us on WhatsApp" },
          emailLabel: { it: "Invia una email", en: "Send us an email" },
        },
      ],
    },

    /* --- Toscana: storia e tradizioni -------------------------------- */
    /* Niente foto dei musei: i capitoli senza immagine lasciano la scena
       alla parola gigante e al testo. */
    {
      slug: "storia-e-tradizioni",
      title: { it: "Toscana: storia e tradizioni", en: "Tuscany: history and traditions" },
      description: {
        it: "Cultura, paesaggio e tradizione: la Toscana che si vede da Nerbona e i musei di Firenze a un'ora di strada.",
        en: "Culture, landscape and tradition: the Tuscany you see from Nerbona and Florence's museums an hour away.",
      },
      sections: [
        {
          type: "hero",
          id: "home",
          size: "editorial",
          image: {
            src: "estate/casina-view.webp",
            alt: { it: "Le colline senesi viste dalla Casina", en: "The Sienese hills from La Casina" },
          },
          labelParts: [
            { it: "Toscana", en: "Tuscany" },
            { it: "Storia e tradizioni", en: "History and traditions" },
          ],
          titleLines: [
            { it: "Il silenzio", en: "Tuscan" },
            { it: "toscano", en: "silence" },
          ],
          intro: {
            it: "Una terra in cui cultura, paesaggio e tradizione convivono in equilibrio da secoli, e danno vita a un'identità fatta di bellezza, silenzio e natura.",
            en: "A land where culture, landscape and tradition have lived in balance for centuries, shaping an identity made of beauty, silence and nature.",
          },
          cta: { label: { it: "Leggi", en: "Read" }, href: "#rinascimento" },
          pillars: [
            { it: "Gallerie degli Uffizi", en: "Uffizi Galleries" },
            { it: "Galleria dell'Accademia", en: "Accademia Gallery" },
            { it: "Palazzo Pitti e Boboli", en: "Palazzo Pitti and Boboli" },
          ],
        },
        {
          type: "chapters",
          id: "rinascimento",
          kicker: { it: "Il paesaggio nell'arte", en: "Landscape in art" },
          title: {
            it: "Dove il paesaggio non è mai uno sfondo",
            en: "Where landscape is never a backdrop",
          },
          items: [
            {
              word: { it: "Uffizi", en: "Uffizi" },
              kicker: { it: "Firenze · 60 km", en: "Florence · 60 km" },
              title: { it: "Botticelli e Leonardo", en: "Botticelli and Leonardo" },
              text: {
                it: "Nelle grandi opere del Rinascimento il paesaggio è parte viva del racconto. Agli Uffizi, nelle tele di Botticelli e di Leonardo da Vinci, la natura diventa simbolo, atmosfera, respiro.",
                en: "In the great works of the Renaissance, landscape is a living part of the story. At the Uffizi, in the canvases of Botticelli and Leonardo da Vinci, nature becomes symbol, atmosphere, breath.",
              },
              link: { label: { it: "Gallerie degli Uffizi", en: "Uffizi Galleries" }, href: "https://www.uffizi.it/gli-uffizi" },
            },
            {
              word: { it: "Accademia", en: "Accademia" },
              kicker: { it: "Firenze · 60 km", en: "Florence · 60 km" },
              title: { it: "Il David di Michelangelo", en: "Michelangelo's David" },
              text: {
                it: "Lo stesso senso di equilibrio e presenza si ritrova alla Galleria dell'Accademia, dove la forza del David si esprime in una sintesi perfetta di silenzio, tensione e armonia.",
                en: "The same sense of balance and presence fills the Accademia Gallery, where the strength of the David is a perfect synthesis of silence, tension and harmony.",
              },
              link: { label: { it: "Galleria dell'Accademia", en: "Accademia Gallery" }, href: "https://www.galleriaaccademiafirenze.it/" },
            },
            {
              word: { it: "Boboli", en: "Boboli" },
              kicker: { it: "Firenze · 60 km", en: "Florence · 60 km" },
              title: { it: "Palazzo Pitti e il giardino", en: "Palazzo Pitti and the garden" },
              text: {
                it: "A Palazzo Pitti e nel Giardino di Boboli arte e natura si fondono in un paesaggio che invita alla contemplazione, al ritmo lento, alla connessione profonda con l'ambiente.",
                en: "At Palazzo Pitti and in the Boboli Gardens art and nature merge into a landscape that invites contemplation, a slower pace and a deep connection with one's surroundings.",
              },
              details: [
                { it: "Biglietto cumulativo Pitti e Boboli", en: "Combined Pitti and Boboli ticket" },
              ],
              link: { label: { it: "Giardino di Boboli", en: "Boboli Gardens" }, href: "https://villegiardinimedicei.it/giardino-di-boboli/" },
            },
            {
              word: { it: "Nerbona", en: "Nerbona" },
              kicker: { it: "Colle di Val d'Elsa", en: "Colle di Val d'Elsa" },
              title: { it: "Il silenzio come presenza", en: "Silence as presence" },
              text: {
                it: "Nerbona si ispira a questa idea di Toscana autentica: rispetto per la natura, attenzione al territorio, ricerca di equilibrio. Qui il silenzio toscano non è assenza ma presenza, un modo di vivere che riflette la stessa armonia dei paesaggi e delle opere della tradizione.",
                en: "Nerbona draws on this idea of authentic Tuscany: respect for nature, care for the land, a search for balance. Here Tuscan silence is not absence but presence, a way of living that mirrors the harmony of the landscapes and works of tradition.",
              },
              image: {
                src: "estate/landscape.webp",
                alt: { it: "Pini e casa colonica a Nerbona", en: "Pines and farmhouse at Nerbona" },
              },
            },
          ],
        },
        {
          type: "facts",
          id: "dintorni",
          kicker: { it: "A pochi minuti", en: "A few minutes away" },
          title: { it: "Dietro l'angolo", en: "Around the corner" },
          text: {
            it: "Prima ancora di Siena e Firenze, la Val d'Elsa ha molto da vedere a pochi chilometri dal cancello.",
            en: "Even before Siena and Florence, Val d'Elsa has plenty to see a few kilometres from the gate.",
          },
          image: {
            src: "estate/park.webp",
            alt: { it: "Il parco di Nerbona", en: "The Nerbona park" },
          },
          items: [
            {
              label: { it: "3 km", en: "3 km" },
              value: { it: "Badia a Coneo", en: "Badia a Coneo" },
              note: { it: "Abbazia romanica in pietra, fra i campi.", en: "A Romanesque stone abbey among the fields." },
            },
            {
              label: { it: "4 km", en: "4 km" },
              value: { it: "Casole d'Elsa", en: "Casole d'Elsa" },
              note: { it: "Borgo medievale con il suo museo archeologico.", en: "A medieval village with its archaeological museum." },
            },
            {
              label: { it: "6 km", en: "6 km" },
              value: { it: "Le Caldane", en: "Le Caldane" },
              note: {
                it: "Le sorgenti calde che danno all'Elsa il suo colore turchese. Lungo il fiume corre il Sentierelsa, facile e quasi tutto in piano, con i punti per fare il bagno.",
                en: "The warm springs that give the Elsa its turquoise colour. Along the river runs the Sentierelsa, an easy, almost flat trail with spots for a swim.",
              },
            },
            {
              label: { it: "7 km", en: "7 km" },
              value: { it: "Colle di Val d'Elsa", en: "Colle di Val d'Elsa" },
              note: {
                it: "Il borgo alto, il Duomo, il Museo Archeologico Bianchi Bandinelli e le botteghe del cristallo.",
                en: "The upper town, the cathedral, the Bianchi Bandinelli Archaeological Museum and the crystal workshops.",
              },
            },
            {
              label: { it: "18 km", en: "18 km" },
              value: { it: "San Gimignano", en: "San Gimignano" },
              note: { it: "Le sue torri si vedono dalla piscina di Nerbona.", en: "Its towers can be seen from the Nerbona pool." },
            },
          ],
        },
        {
          type: "territory",
          id: "territorio",
          kicker: "Heart of Tuscany",
          title: { it: "Tutto a meno di un'ora.", en: "Everything within the hour." },
          text: {
            it: "Borghi medievali, città d'arte e le colline del Chianti: le distanze da Nerbona.",
            en: "Medieval villages, art cities and the Chianti hills: distances from Nerbona.",
          },
          disclaimer: { it: "DISTANZE STRADALI INDICATIVE", en: "APPROXIMATE DRIVING DISTANCES" },
          mapLabel: {
            it: "Mappa stilizzata delle distanze da Fattoria Nerbona",
            en: "Stylised map of distances from Fattoria Nerbona",
          },
          gridLabels: { x: "43°22′ N", y: "11°03′ E" },
          homeLabel: { lines: ["Fattoria", "Nerbona"], sub: "Colle di Val d'Elsa" },
          legend: {
            home: "Nerbona",
            destinations: { it: "Destinazioni", en: "Destinations" },
            note: { it: "Distanze stradali indicative", en: "Approximate driving distances" },
          },
          items: [
            { id: "colle", name: { it: "Colle di Val d'Elsa", en: "Colle di Val d'Elsa" }, distance: "10 km", coordinates: { lat: 43.4213, lng: 11.1275 } },
            { id: "gimignano", name: { it: "San Gimignano", en: "San Gimignano" }, distance: "22 km", coordinates: { lat: 43.4677, lng: 11.0431 } },
            { id: "volterra", name: { it: "Volterra", en: "Volterra" }, distance: "30 km", coordinates: { lat: 43.4014, lng: 10.8608 } },
            { id: "siena", name: { it: "Siena", en: "Siena" }, distance: "35 km", coordinates: { lat: 43.3188, lng: 11.3308 } },
            { id: "florence", name: { it: "Firenze", en: "Florence" }, distance: "60 km", coordinates: { lat: 43.7696, lng: 11.2558 } },
            { id: "montalcino", name: { it: "Montalcino", en: "Montalcino" }, distance: "75 km", coordinates: { lat: 43.0576, lng: 11.4889 } },
          ],
        },
        {
          type: "contact",
          id: "contatti",
          image: { src: "estate/park.webp", alt: { it: "Il parco di Nerbona", en: "The Nerbona park" } },
          kicker: { it: "Il vostro soggiorno", en: "Your stay" },
          title: { it: "La Toscana comincia dal cancello.", en: "Tuscany starts at the gate." },
          text: {
            it: "Vi diamo volentieri qualche consiglio su cosa vedere, a seconda dei giorni che avete.",
            en: "We're happy to suggest what to see, depending on how many days you have.",
          },
          whatsappLabel: { it: "Scrivici su WhatsApp", en: "Message us on WhatsApp" },
          emailLabel: { it: "Invia una email", en: "Send us an email" },
        },
      ],
    },

    /* --- Recensioni ------------------------------------------------- */
    /* Trascritte dalle schermate pubblicate su nerbona.com. I cognomi sono
       abbreviati; le recensioni in lingua straniera sono tradotte. */
    {
      slug: "recensioni",
      title: { it: "Recensioni", en: "Reviews" },
      description: {
        it: "Cosa dicono gli ospiti di Fattoria Nerbona su Google, Tripadvisor e Booking.com.",
        en: "What guests say about Fattoria Nerbona on Google, Tripadvisor and Booking.com.",
      },
      sections: [
        {
          type: "hero",
          id: "home",
          size: "editorial",
          image: {
            src: "estate/aerial.webp",
            alt: { it: "La tenuta dall'alto", en: "The estate from above" },
          },
          labelParts: [
            { it: "Recensioni", en: "Reviews" },
            { it: "Google · Tripadvisor · Booking", en: "Google · Tripadvisor · Booking" },
          ],
          titleLines: [{ it: "Recensioni", en: "Reviews" }],
          intro: {
            it: "«Un angolo di paradiso immerso nel verde e nel silenzio delle campagne toscane.» Le parole degli ospiti, così come le hanno scritte.",
            en: "“A corner of paradise in the green and silence of the Tuscan countryside.” Our guests' words, just as they wrote them.",
          },
          cta: {
            label: { it: "Leggi", en: "Read" },
            href: "#recensioni",
          },
          pillars: [
            { it: "Google", en: "Google" },
            { it: "Tripadvisor", en: "Tripadvisor" },
            { it: "Booking.com", en: "Booking.com" },
          ],
        },
        {
          type: "reviews",
          id: "recensioni",
          layout: "editorial",
          /* Medie pubblicate dai portali: aggiornarle quando cambiano. */
          summary: [
            {
              score: "9,3",
              label: {
                it: "Bed-and-Breakfast.it · Eccellenza 2026",
                en: "Bed-and-Breakfast.it · Excellence 2026",
              },
            },
            { score: "8,8", label: { it: "Trip.com", en: "Trip.com" } },
          ],
          kicker: { it: "Dicono di noi", en: "What guests say" },
          title: {
            it: "Chi viene, di solito torna.",
            en: "Those who come usually come back.",
          },
          items: [
            {
              source: "Tripadvisor",
              score: "5/5",
              title: {
                it: "Tipica e meravigliosa Toscana",
                en: "Typical, wonderful Tuscany",
              },
              quote: {
                it: "Un posto incantevole e tipicamente toscano. I padroni di casa sono disponibili e generosi. Eravamo due coppie e abbiamo adorato i nostri appartamenti. Vicino a diversi borghi e città, tra cui Siena e Firenze. Consigliamo vivamente questo posto.",
                en: "A charming, typically Tuscan place. The hosts are helpful and generous. We were two couples and loved our apartments. Close to several villages and towns, including Siena and Florence. We highly recommend it.",
              },
              author: "Anne L.",
              date: { it: "Ottobre 2025 · in coppia", en: "October 2025 · as a couple" },
            },
            {
              source: "Tripadvisor",
              score: "5/5",
              title: {
                it: "Una garanzia ogni anno: relax, sport e staff super!",
                en: "A sure thing every year: relaxation, sport and a great team!",
              },
              quote: {
                it: "Torniamo in questo agriturismo ogni anno con gli amici ed è sempre una conferma. Immerso nel verde, offre una piscina splendida e campi da calcio e pallavolo per divertirsi in compagnia. Un ringraziamento speciale a tutto lo staff: sempre disponibili, gentili e pronti a risolvere ogni esigenza. Ci fate sentire a casa ogni volta. Alla prossima!",
                en: "We come back to this farm stay every year with friends and it never disappoints. Surrounded by greenery, it has a beautiful pool and football and volleyball pitches to enjoy together. Special thanks to all the staff: always available, kind and ready to help with anything. You make us feel at home every time. See you next time!",
              },
              author: "Maurizio C.",
              date: { it: "Dicembre 2025 · con amici", en: "December 2025 · with friends" },
            },
            {
              source: "Booking.com",
              score: "10/10",
              title: {
                it: "Un angolo di paradiso immerso nel verde e nel silenzio delle campagne toscane",
                en: "A corner of paradise in the green and silence of the Tuscan countryside",
              },
              quote: {
                it: "Davvero un posto speciale. Un angolo di paradiso.",
                en: "A truly special place. A corner of paradise.",
              },
              author: "Fabio",
              date: { it: "Agosto 2025 · famiglia", en: "August 2025 · family" },
            },
            {
              source: "Google",
              score: "5/5",
              quote: {
                it: "Siamo stati per un week end ed è stato tutto magnifico, la pace e la tranquillità di questo posto è unica. Ci siamo proprio rigenerati. Posizione ottimale per chi vuole visitare le città dell'entroterra toscano. Personale accogliente e preparato.",
                en: "We stayed for a weekend and everything was wonderful; the peace and quiet of this place is unique. We really recharged. A great location for visiting the towns of inland Tuscany. Welcoming, knowledgeable staff.",
              },
              author: "Stefano B.",
            },
            {
              source: "Booking.com",
              score: "10/10",
              title: { it: "Eccezionale", en: "Exceptional" },
              quote: {
                it: "Posto vivamente consigliato se si vuole staccare la spina e godere delle bellezze toscane. Ottimo rapporto qualità-prezzo.",
                en: "Highly recommended if you want to unplug and enjoy the beauty of Tuscany. Excellent value for money.",
              },
              author: "Erick",
              date: { it: "Ottobre 2025 · famiglia", en: "October 2025 · family" },
            },
            {
              source: "Google",
              score: "5/5",
              quote: {
                it: "Dopo molti, molti anni siamo finalmente tornati in vacanza nella meravigliosa Casina. Ci siamo subito innamorati di nuovo della casa e della zona. Anche i nostri cani sono stati ospiti graditi. Non avremmo potuto immaginare una vacanza più bella. Torneremo molto volentieri! (tradotta dal tedesco)",
                en: "After many, many years we finally came back on holiday to the wonderful Casina. We fell in love with the house and the area all over again. Our dogs were welcome guests too. We couldn't have imagined a lovelier holiday. We'd love to come back! (translated from German)",
              },
              author: "Christina F.",
            },
            {
              source: "Google",
              score: "5/5",
              quote: {
                it: "Abbiamo scelto l'Agriturismo Nerbona come location per il nostro matrimonio. Siamo rimasti molto soddisfatti della splendida location, del personale attento e accogliente e delle camere pulite e confortevoli. Elena e Cristina sono state molto disponibili e ci hanno supportato durante l'intero processo di organizzazione. Consiglio VIVAMENTE questa splendida location a chiunque sia interessato a un matrimonio indimenticabile in Toscana. (tradotta dall'inglese)",
                en: "We chose Agriturismo Nerbona for our wedding venue. We were very happy with the beautiful location, caring and welcoming staff, and the rooms were clean and comfortable. Elena and Cristina were very helpful and supported us throughout the entire planning process. I would HIGHLY recommend this beautiful location to anyone interested in a memorable Tuscany wedding.",
              },
              author: "Aaron G.",
            },
          ],
          links: [
            {
              label: { it: "Leggi su Google", en: "Read on Google" },
              href: "https://maps.app.goo.gl/Ad3fcrkMNsXYzxQS7",
            },
          ],
        },
        {
          type: "contact",
          id: "contatti",
          image: {
            src: "extra/casina-capanna-glicine.webp",
            alt: { it: "Il portico della Casina", en: "La Casina's portico" },
          },
          kicker: { it: "Il vostro soggiorno", en: "Your stay" },
          title: {
            it: "La prossima recensione potrebbe essere la vostra.",
            en: "The next review could be yours.",
          },
          text: {
            it: "Prenotate online o scriveteci per qualsiasi domanda.",
            en: "Book online or write to us with any question.",
          },
          whatsappLabel: { it: "Scrivici su WhatsApp", en: "Message us on WhatsApp" },
          emailLabel: { it: "Invia una email", en: "Send us an email" },
        },
      ],
    },
  ],

  /* ================================================================ */
  /* Alloggi                                                           */
  /* ================================================================ */

  /* Una voce per TIPOLOGIA, come nel menù del sito originale; i venti
     appartamenti reali sono elencati in `units`, ognuno con le sue foto (le
     stesse, nello stesso ordine, di nerbona.com), i posti letto e un'ancora
     per il collegamento diretto: /trilocale#solaio.
     `size` mostra quanti appartamenti raggruppa la voce.

     PRENOTAZIONE. Su Beddy ogni appartamento ha un proprio codice (fra
     parentesi qui sotto), ma il motore non accetta link diretti a un singolo
     alloggio: ogni "Prenota" porta alla ricerca. Se Beddy fornisce un
     indirizzo per appartamento, va in `bookingUrl` della relativa voce.
       Lavanda 23126 · Ortensia 23127 · Mangiatoia 23128 · Taverna 23129 ·
       Granaio 23130 · Rostra 2 23131 · Forno 1 23132 · Forno 2 23133 ·
       Solaio 23134 · Piccionaia 23135 · Trinciatoio 23136 · Cappella 23137 ·
       Rostra 1 23138 · Mansarda 23139 · Villa L'Aia 23140 · Leccio 23141 ·
       Corbezzolo 23142 · Olivo 23143 · Melo 23144 · Quercia 23145 ·
       Nerbona in esclusiva 28078 · La Casina in esclusiva 28079

     POSTI LETTO dalle schede pubbliche della struttura: da verificare con il
     cliente. */

  accommodations: [
    {
      category: AT_NERBONA("SEI APPARTAMENTI", "SIX APARTMENTS"),
      slug: "nerbona-bilocale",
      name: "Bilocali",
      size: "6",
      guests: "2–3",
      layout: {
        it: "Soggiorno con cucina · 1 camera · 1 bagno",
        en: "Living room with kitchen · 1 bedroom · 1 bathroom",
      },
      blurb: {
        it: "Una camera, la cucina e una porta che si apre sulla corte o sul giardino.",
        en: "One bedroom, a kitchen and a door opening onto the courtyard or the garden.",
      },
      description: {
        it: "Sei bilocali ricavati dagli edifici di lavoro della fattoria, la mangiatoia, il granaio, la taverna, il forno, quasi tutti al piano terra. Granaio è adatto anche a chi usa la sedia a rotelle. Soggiorno minimo due notti.",
        en: "Six one-bedroom apartments carved from the farm's working buildings, the manger, the granary, the tavern, the bakehouse, almost all on the ground floor. Granaio is also suitable for wheelchair users. Minimum stay two nights.",
      },
      cover: "stays/mangiatoia-01.webp",
      detail: "stays/granaio-01.webp",
      gallery: [],
      units: [
        {
          slug: "mangiatoia",
          name: "Mangiatoia",
          guests: "2",
          layout: {
            it: "Piano terra · 1 camera · 1 bagno",
            en: "Ground floor · 1 bedroom · 1 bathroom",
          },
          text: {
            it: "Bilocale al piano terra con cucina-soggiorno, una camera da letto e un bagno, nell'antica mangiatoia della fattoria. Wi-Fi nell'appartamento e, da Pasqua a ottobre, spazio esterno privato con tavolo, sedie e ombrellone.",
            en: "Ground-floor apartment in the farm's old manger, with kitchen-living room, one bedroom and one bathroom. Wi-Fi in the apartment and, from Easter to October, a private outdoor area with table, chairs and parasol.",
          },
          tags: [
            WIFI_IN,
          ],
          images: [
            "stays/mangiatoia-01.webp",
            "stays/mangiatoia-02.webp",
            "stays/mangiatoia-03.webp",
            "stays/mangiatoia-04.webp",
            "stays/mangiatoia-05.webp",
          ],
        },
        {
          slug: "granaio",
          name: "Granaio",
          guests: "3",
          layout: {
            it: "Piano terra · 1 camera · 1 bagno",
            en: "Ground floor · 1 bedroom · 1 bathroom",
          },
          text: {
            it: "Bilocale al piano terra nel vecchio granaio. Il bagno è senza bidet, con doccia a filo pavimento e water rialzato: l'appartamento è adatto anche a chi usa la sedia a rotelle. Wi-Fi e spazio esterno privato da Pasqua a ottobre.",
            en: "Ground-floor apartment in the old granary. The bathroom has no bidet, with a walk-in shower and raised toilet: the apartment is also suitable for wheelchair users. Wi-Fi and private outdoor space from Easter to October.",
          },
          tags: [
            ACCESSIBLE,
            WIFI_IN,
          ],
          images: [
            "stays/granaio-01.webp",
            "stays/granaio-02.webp",
            "stays/granaio-03.webp",
            "stays/granaio-04.webp",
            "stays/granaio-05.webp",
            "stays/granaio-06.webp",
          ],
        },
        {
          slug: "taverna",
          name: "Taverna",
          guests: "3",
          layout: {
            it: "Piano terra · 1 camera · 1 bagno",
            en: "Ground floor · 1 bedroom · 1 bathroom",
          },
          text: {
            it: "Bilocale al piano terra con cucina-soggiorno, una camera e un bagno. Wi-Fi nell'appartamento e spazio esterno privato da Pasqua a ottobre.",
            en: "Ground-floor apartment with kitchen-living room, one bedroom and one bathroom. Wi-Fi in the apartment and private outdoor space from Easter to October.",
          },
          tags: [
            WIFI_IN,
          ],
          images: [
            "stays/taverna-01.webp",
            "stays/taverna-02.webp",
            "stays/taverna-03.webp",
            "stays/taverna-04.webp",
            "stays/taverna-05.webp",
            "stays/taverna-06.webp",
          ],
        },
        {
          slug: "rostra-2",
          name: "Rostra 2",
          guests: "3",
          layout: {
            it: "Primo piano · 1 camera · 1 bagno",
            en: "First floor · 1 bedroom · 1 bathroom",
          },
          text: {
            it: "Bilocale al primo piano con cucina-soggiorno, una camera e un bagno, con Wi-Fi e zanzariere. Lo spazio esterno privato, da Pasqua a ottobre, è al piano terra.",
            en: "First-floor apartment with kitchen-living room, one bedroom and one bathroom, with Wi-Fi and mosquito nets. The private outdoor space, from Easter to October, is on the ground floor.",
          },
          tags: [
            WIFI_IN,
            NETS,
          ],
          images: [
            "stays/rostra-2-01.webp",
            "stays/rostra-2-02.webp",
            "stays/rostra-2-03.webp",
            "stays/rostra-2-04.webp",
            "stays/rostra-2-05.webp",
            "stays/rostra-2-06.webp",
          ],
        },
        {
          slug: "forno-1",
          name: "Forno 1",
          guests: "3",
          layout: {
            it: "Piano terra, lato giardino · 1 camera · 1 bagno",
            en: "Ground floor, garden side · 1 bedroom · 1 bathroom",
          },
          text: {
            it: "Bilocale al piano terra affacciato sul giardino, nell'edificio dell'antico forno. Cucina-soggiorno, una camera, un bagno, Wi-Fi e spazio esterno privato da Pasqua a ottobre.",
            en: "Ground-floor apartment overlooking the garden, in the old bakehouse. Kitchen-living room, one bedroom, one bathroom, Wi-Fi and private outdoor space from Easter to October.",
          },
          tags: [
            WIFI_IN,
            {
              it: "Lato giardino",
              en: "Garden side",
            },
          ],
          images: [
            "stays/forno-1-01.webp",
            "stays/forno-1-02.webp",
            "stays/forno-1-03.webp",
            "stays/forno-1-04.webp",
            "stays/forno-1-05.webp",
            "stays/forno-1-06.webp",
            "stays/forno-1-07.webp",
          ],
        },
        {
          slug: "forno-2",
          name: "Forno 2",
          guests: "3",
          layout: {
            it: "Piano terra, lato giardino · 1 camera · 1 bagno",
            en: "Ground floor, garden side · 1 bedroom · 1 bathroom",
          },
          text: {
            it: "Accanto a Forno 1, sullo stesso giardino: cucina-soggiorno, una camera e un bagno, Wi-Fi e spazio esterno privato da Pasqua a ottobre.",
            en: "Next to Forno 1, on the same garden: kitchen-living room, one bedroom and one bathroom, Wi-Fi and private outdoor space from Easter to October.",
          },
          tags: [
            WIFI_IN,
            {
              it: "Lato giardino",
              en: "Garden side",
            },
          ],
          images: [
            "stays/forno-2-01.webp",
            "stays/forno-2-02.webp",
            "stays/forno-2-03.webp",
            "stays/forno-2-04.webp",
            "stays/forno-2-05.webp",
            "stays/forno-2-06.webp",
            "stays/forno-2-07.webp",
            "stays/forno-2-08.webp",
            "stays/forno-2-09.webp",
            "stays/forno-2-10.webp",
            "stays/forno-2-11.webp",
            "stays/forno-2-12.webp",
            "stays/forno-2-13.webp",
            "stays/forno-2-14.webp",
            "stays/forno-2-15.webp",
          ],
        },
      ],
      amenities: [
        OUTDOOR,
        KITCHEN,
      ],
    },
    {
      category: AT_NERBONA("CINQUE APPARTAMENTI", "FIVE APARTMENTS"),
      slug: "trilocale",
      name: "Trilocali",
      size: "5",
      guests: "4–6",
      layout: {
        it: "Soggiorno con cucina · 2 camere · 1 o 2 bagni",
        en: "Living room with kitchen · 2 bedrooms · 1 or 2 bathrooms",
      },
      blurb: {
        it: "Il taglio più richiesto: due camere, cucina attrezzata e un tavolo fuori dalla porta.",
        en: "The most popular size: two bedrooms, an equipped kitchen and a table outside the door.",
      },
      description: {
        it: "Cinque trilocali fra la casa padronale e gli annessi. Piccionaia e Solaio stanno all'ultimo piano, Trinciatoio al piano terra ed è adatto anche a chi usa la sedia a rotelle, Rostra 1 ha due bagni. Soggiorno minimo due notti.",
        en: "Five two-bedroom apartments between the main house and its outbuildings. Piccionaia and Solaio are on the top floor, Trinciatoio is on the ground floor and suitable for wheelchair users, Rostra 1 has two bathrooms. Minimum stay two nights.",
      },
      cover: "stays/piccionaia-01.webp",
      detail: "stays/solaio-01.webp",
      gallery: [],
      units: [
        {
          slug: "piccionaia",
          name: "Piccionaia",
          guests: "5",
          layout: {
            it: "Secondo piano · 2 camere · 1 bagno",
            en: "Second floor · 2 bedrooms · 1 bathroom",
          },
          text: {
            it: "Trilocale all'ultimo piano, nella vecchia piccionaia: cucina-soggiorno, due camere da letto e un bagno, con Wi-Fi e zanzariere. Lo spazio esterno privato è in cortile, al piano terra.",
            en: "Top-floor apartment in the old dovecote: kitchen-living room, two bedrooms and one bathroom, with Wi-Fi and mosquito nets. The private outdoor space is in the courtyard, on the ground floor.",
          },
          tags: [
            WIFI_IN,
            NETS,
          ],
          images: [
            "stays/piccionaia-01.webp",
            "stays/piccionaia-02.webp",
            "stays/piccionaia-03.webp",
            "stays/piccionaia-04.webp",
            "stays/piccionaia-05.webp",
            "stays/piccionaia-06.webp",
            "stays/piccionaia-07.webp",
          ],
        },
        {
          slug: "solaio",
          name: "Solaio",
          guests: "5",
          layout: {
            it: "Secondo piano · 2 camere · 1 bagno",
            en: "Second floor · 2 bedrooms · 1 bathroom",
          },
          text: {
            it: "Trilocale all'ultimo piano, accanto alla Piccionaia: cucina-soggiorno, due camere e un bagno, con Wi-Fi e zanzariere. Spazio esterno privato in cortile.",
            en: "Top-floor apartment next to Piccionaia: kitchen-living room, two bedrooms and one bathroom, with Wi-Fi and mosquito nets. Private outdoor space in the courtyard.",
          },
          tags: [
            WIFI_IN,
            NETS,
          ],
          images: [
            "stays/solaio-01.webp",
            "stays/solaio-02.webp",
            "stays/solaio-03.webp",
            "stays/solaio-04.webp",
            "stays/solaio-05.webp",
          ],
        },
        {
          slug: "trinciatoio",
          name: "Trinciatoio",
          guests: "4",
          layout: {
            it: "Piano terra · 2 camere · 1 bagno",
            en: "Ground floor · 2 bedrooms · 1 bathroom",
          },
          text: {
            it: "Trilocale al piano terra con cucina-soggiorno e due camere. Il bagno è senza bidet, con doccia a filo pavimento e water rialzato: adatto anche a chi usa la sedia a rotelle.",
            en: "Ground-floor apartment with kitchen-living room and two bedrooms. The bathroom has no bidet, with a walk-in shower and raised toilet: also suitable for wheelchair users.",
          },
          tags: [
            ACCESSIBLE,
            WIFI_IN,
          ],
          images: [
            "stays/trinciatoio-01.webp",
            "stays/trinciatoio-02.webp",
            "stays/trinciatoio-03.webp",
            "stays/trinciatoio-04.webp",
            "stays/trinciatoio-05.webp",
            "stays/trinciatoio-06.webp",
          ],
        },
        {
          slug: "rostra-1",
          name: "Rostra 1",
          guests: "5",
          layout: {
            it: "Primo piano · 2 camere · 2 bagni",
            en: "First floor · 2 bedrooms · 2 bathrooms",
          },
          text: {
            it: "L'unico trilocale con due bagni: cucina-soggiorno e due camere al primo piano, con Wi-Fi e zanzariere. Lo spazio esterno privato è al piano terra.",
            en: "The only two-bedroom apartment with two bathrooms: kitchen-living room and two bedrooms on the first floor, with Wi-Fi and mosquito nets. The private outdoor space is on the ground floor.",
          },
          tags: [
            WIFI_IN,
            NETS,
            {
              it: "Due bagni",
              en: "Two bathrooms",
            },
          ],
          images: [
            "stays/rostra-1-01.webp",
            "stays/rostra-1-02.webp",
            "stays/rostra-1-03.webp",
            "stays/rostra-1-04.webp",
            "stays/rostra-1-05.webp",
            "stays/rostra-1-06.webp",
            "stays/rostra-1-07.webp",
            "stays/rostra-1-08.webp",
            "stays/rostra-1-09.webp",
            "stays/rostra-1-10.webp",
            "stays/rostra-1-11.webp",
          ],
        },
        {
          slug: "cappella",
          name: "Cappella",
          guests: "6",
          layout: {
            it: "Piano rialzato · 2 camere · 1 bagno",
            en: "Raised ground floor · 2 bedrooms · 1 bathroom",
          },
          text: {
            it: "Trilocale accanto alla chiesetta di San Luigi, da cui prende il nome: cucina-soggiorno, due camere e un bagno, Wi-Fi e spazio esterno privato al piano terra.",
            en: "Apartment next to the little church of San Luigi, which gives it its name: kitchen-living room, two bedrooms and one bathroom, Wi-Fi and private outdoor space on the ground floor.",
          },
          tags: [
            WIFI_IN,
          ],
          images: [
            "stays/cappella-02.webp",
            "stays/cappella-01.webp",
            "stays/cappella-03.webp",
            "stays/cappella-04.webp",
            "stays/cappella-05.webp",
            "stays/cappella-06.webp",
            "stays/cappella-07.webp",
            "stays/cappella-08.webp",
            "stays/cappella-09.webp",
          ],
        },
      ],
      amenities: [
        OUTDOOR,
        KITCHEN,
      ],
    },
    {
      category: AT_NERBONA("QUADRILOCALE", "THREE-BEDROOM"),
      slug: "quadrilocale-nerbona",
      name: "Mansarda",
      size: "1",
      guests: "6",
      layout: {
        it: "Primo piano · 3 camere · 2 bagni",
        en: "First floor · 3 bedrooms · 2 bathrooms",
      },
      blurb: {
        it: "Tre camere e due bagni sotto le travi del tetto, per le famiglie grandi.",
        en: "Three bedrooms and two bathrooms under the roof beams, for larger families.",
      },
      description: {
        it: "Il quadrilocale di Nerbona, al primo piano: la scelta per chi viaggia in sei. Soggiorno minimo due notti.",
        en: "Nerbona's three-bedroom apartment, on the first floor: the choice for a party of six. Minimum stay two nights.",
      },
      cover: "stays/mansarda-01.webp",
      detail: "stays/mansarda-02.webp",
      gallery: [],
      units: [
        {
          slug: "mansarda",
          name: "Mansarda",
          guests: "6",
          layout: {
            it: "Primo piano · 3 camere · 2 bagni",
            en: "First floor · 3 bedrooms · 2 bathrooms",
          },
          text: {
            it: "Quadrilocale al primo piano con cucina-soggiorno, tre camere e due bagni. Una camera ha il tetto basso mansardato, che di solito piace molto ai bambini. Wi-Fi, zanzariere e spazio esterno privato in cortile.",
            en: "First-floor apartment with kitchen-living room, three bedrooms and two bathrooms. One bedroom has a low sloping ceiling that children usually love. Wi-Fi, mosquito nets and private outdoor space in the courtyard.",
          },
          tags: [
            WIFI_IN,
            NETS,
          ],
          images: [
            "stays/mansarda-01.webp",
            "stays/mansarda-02.webp",
            "stays/mansarda-03.webp",
            "stays/mansarda-04.webp",
            "stays/mansarda-05.webp",
            "stays/mansarda-06.webp",
            "stays/mansarda-07.webp",
            "stays/mansarda-08.webp",
          ],
        },
      ],
      amenities: [
        OUTDOOR,
        KITCHEN,
      ],
    },
    {
      category: AT_NERBONA("LA VILLA", "THE VILLA"),
      slug: "villa-aia",
      name: "Villa L'Aia",
      size: "1",
      guests: "6",
      layout: {
        it: "Due saloni · 3 camere · 3 bagni · camino",
        en: "Two living rooms · 3 bedrooms · 3 bathrooms · fireplace",
      },
      blurb: {
        it: "Una casa indipendente dentro la tenuta, con il camino, due saloni e lo spazio esterno tutto suo.",
        en: "An independent house within the estate, with a fireplace, two living rooms and outdoor space of its own.",
      },
      description: {
        it: "Villa L'Aia è la casa più riservata di Nerbona: indipendente, con un grande salone con camino e vetrate panoramiche, e uno spazio esterno privato ampio. Soggiorno minimo tre notti; gli animali non sono ammessi.",
        en: "Villa L'Aia is Nerbona's most private home: independent, with a large living room with fireplace and panoramic windows, and a spacious private outdoor area. Minimum stay three nights; pets are not allowed.",
      },
      cover: "stays/villa-aia-01.webp",
      detail: "stays/villa-aia-02.webp",
      gallery: [],
      units: [
        {
          slug: "villa-aia",
          name: "Villa L'Aia",
          guests: "6",
          layout: {
            it: "Casa indipendente · 3 camere · 3 bagni",
            en: "Independent house · 3 bedrooms · 3 bathrooms",
          },
          text: {
            it: "Una casa indipendente dentro la sede principale: due ampi saloni, il più grande con camino e vetrate sul giardino, cucina con lavastoviglie, due camere matrimoniali e una con due letti singoli per bambini, tre bagni (uno di servizio) e lavatrice privata. Da Pasqua a ottobre un grande spazio esterno privato. Gli animali non sono ammessi.",
            en: "An independent house within the main site: two large living rooms, the bigger one with a fireplace and windows onto the garden, a kitchen with dishwasher, two double bedrooms and one with two single beds for children, three bathrooms (one a guest WC) and a private washing machine. From Easter to October a large private outdoor area. Pets are not allowed.",
          },
          tags: [
            {
              it: "Camino",
              en: "Fireplace",
            },
            {
              it: "Lavastoviglie",
              en: "Dishwasher",
            },
            {
              it: "Lavatrice privata",
              en: "Private washer",
            },
            {
              it: "Soggiorno minimo 3 notti",
              en: "Minimum stay 3 nights",
            },
          ],
          images: [
            "stays/villa-aia-01.webp",
            "stays/villa-aia-02.webp",
            "stays/villa-aia-03.webp",
            "stays/villa-aia-04.webp",
            "stays/villa-aia-05.webp",
            "stays/villa-aia-06.webp",
            "stays/villa-aia-07.webp",
            "stays/villa-aia-08.webp",
            "stays/villa-aia-09.webp",
            "stays/villa-aia-10.webp",
            "stays/villa-aia-11.webp",
            "stays/villa-aia-12.webp",
            "stays/villa-aia-13.webp",
            "stays/villa-aia-14.webp",
            "stays/villa-aia-15.webp",
            "stays/villa-aia-16.webp",
            "stays/villa-aia-17.webp",
            "stays/villa-aia-18.webp",
            "stays/villa-aia-19.webp",
            "stays/villa-aia-20.webp",
            "stays/villa-aia-21.webp",
            "stays/villa-aia-22.webp",
            "stays/villa-aia-23.webp",
          ],
        },
      ],
      amenities: [
        OUTDOOR,
        KITCHEN,
      ],
    },
    {
      category: AT_NERBONA("DUE CAMERE", "TWO ROOMS"),
      slug: "camere-nerbona",
      name: "Camere",
      size: "2",
      guests: "2",
      layout: {
        it: "Camera con bagno privato · aria condizionata",
        en: "Room with private bathroom · air conditioning",
      },
      blurb: {
        it: "Per soggiorni brevi: una camera con bagno, senza cucina, al piano terra.",
        en: "For short stays: a room with bathroom, no kitchen, on the ground floor.",
      },
      description: {
        it: "Lavanda e Ortensia sono due camere matrimoniali al piano terra della sede principale, per chi si ferma poche notti: si prenotano anche per una notte sola. Colazione a buffet da aprile a ottobre, su prenotazione.",
        en: "Lavanda and Ortensia are two double rooms on the ground floor of the main site, for short stays: they can be booked for a single night. Buffet breakfast from April to October, on request.",
      },
      cover: "stays/lavanda-01.webp",
      detail: "stays/ortensia-01.webp",
      gallery: [],
      units: [
        {
          slug: "lavanda",
          name: "Lavanda",
          guests: "2",
          layout: {
            it: "Piano terra · camera con bagno",
            en: "Ground floor · room with bathroom",
          },
          text: {
            it: "Camera matrimoniale al piano terra con bagno privato (senza bidet e senza finestra). Niente cucina, ma frigorifero, TV, bollitore, zanzariera e aria condizionata. Da Pasqua a ottobre uno spazio esterno privato.",
            en: "Ground-floor double room with private bathroom (no bidet, no window). No kitchen, but a fridge, TV, kettle, mosquito net and air conditioning. From Easter to October a private outdoor space.",
          },
          tags: [
            {
              it: "Aria condizionata",
              en: "Air conditioning",
            },
            {
              it: "Soggiorno minimo 1 notte",
              en: "Minimum stay 1 night",
            },
          ],
          images: [
            "stays/lavanda-01.webp",
            "stays/lavanda-02.webp",
            "stays/lavanda-03.webp",
            "stays/lavanda-04.webp",
          ],
        },
        {
          slug: "ortensia",
          name: "Ortensia",
          guests: "2",
          layout: {
            it: "Piano terra · camera con bagno",
            en: "Ground floor · room with bathroom",
          },
          text: {
            it: "Camera matrimoniale al piano terra con bagno privato (senza bidet e senza finestra), frigorifero, TV, bollitore, zanzariera e aria condizionata. Da Pasqua a ottobre uno spazio esterno privato.",
            en: "Ground-floor double room with private bathroom (no bidet, no window), fridge, TV, kettle, mosquito net and air conditioning. From Easter to October a private outdoor space.",
          },
          tags: [
            {
              it: "Aria condizionata",
              en: "Air conditioning",
            },
            {
              it: "Soggiorno minimo 1 notte",
              en: "Minimum stay 1 night",
            },
          ],
          images: [
            "stays/ortensia-01.webp",
            "stays/ortensia-02.webp",
            "stays/ortensia-03.webp",
          ],
        },
      ],
      amenities: [
        OUTDOOR,
      ],
    },
    {
      category: AT_CASINA("BILOCALE", "ONE-BEDROOM"),
      slug: "bilocale-casina",
      name: "Leccio",
      size: "1",
      guests: "2",
      layout: {
        it: "Piano terra · 1 camera · 1 bagno",
        en: "Ground floor · 1 bedroom · 1 bathroom",
      },
      blurb: {
        it: "Il più raccolto della Casina, al piano terra, con il prato davanti.",
        en: "La Casina's most intimate apartment, on the ground floor, with the lawn in front.",
      },
      description: {
        it: "Leccio è il bilocale della Casina, per una coppia che cerca silenzio, la piscina panoramica a pochi passi e il portico per cenare all'aperto. Soggiorno minimo due notti.",
        en: "Leccio is La Casina's one-bedroom apartment, for a couple seeking quiet, with the panoramic pool a few steps away and the portico for dining outdoors. Minimum stay two nights.",
      },
      cover: "stays/leccio-01.webp",
      detail: "stays/leccio-02.webp",
      gallery: [],
      units: [
        {
          slug: "leccio",
          name: "Leccio",
          guests: "2",
          layout: {
            it: "Piano terra · 1 camera · 1 bagno",
            en: "Ground floor · 1 bedroom · 1 bathroom",
          },
          text: {
            it: "Il bilocale della Casina: cucina-soggiorno, una camera e un bagno al piano terra, con zanzariere. Da Pasqua a ottobre spazio esterno privato; il Wi-Fi è disponibile all'esterno dell'appartamento.",
            en: "La Casina's one-bedroom apartment: kitchen-living room, one bedroom and one bathroom on the ground floor, with mosquito nets. From Easter to October a private outdoor space; Wi-Fi is available outside the apartment.",
          },
          tags: [
            NETS,
          ],
          images: [
            "stays/leccio-01.webp",
            "stays/leccio-02.webp",
            "stays/leccio-03.webp",
            "stays/leccio-04.webp",
            "stays/leccio-05.webp",
            "stays/leccio-06.webp",
          ],
        },
      ],
      amenities: [
        WIFI_OUT,
        OUTDOOR,
        KITCHEN,
      ],
    },
    {
      category: AT_CASINA("TRE APPARTAMENTI", "THREE APARTMENTS"),
      slug: "trilocali-casina",
      name: "Trilocali",
      size: "3",
      guests: "4–5",
      layout: {
        it: "Soggiorno con cucina · 2 camere · 1 bagno",
        en: "Living room with kitchen · 2 bedrooms · 1 bathroom",
      },
      blurb: {
        it: "Tre appartamenti con due camere: uno al primo piano con terrazzino, due al piano terra sul prato.",
        en: "Three two-bedroom apartments: one upstairs with a terrace, two on the ground floor by the lawn.",
      },
      description: {
        it: "Corbezzolo, Olivo e Melo: tre trilocali con zanzariere, alla Casina, a un chilometro e mezzo dalla sede principale. Soggiorno minimo due notti.",
        en: "Corbezzolo, Olivo and Melo: three two-bedroom apartments with mosquito nets at La Casina, a kilometre and a half from the main site. Minimum stay two nights.",
      },
      cover: "stays/corbezzolo-01.webp",
      detail: "stays/olivo-01.webp",
      gallery: [],
      units: [
        {
          slug: "corbezzolo",
          name: "Corbezzolo",
          guests: "4",
          layout: {
            it: "Primo piano · 2 camere · 1 bagno",
            en: "First floor · 2 bedrooms · 1 bathroom",
          },
          text: {
            it: "Trilocale al primo piano con cucina, due camere e un bagno, zanzariere e un terrazzino con tavolo e sedie da Pasqua a ottobre. Wi-Fi all'esterno dell'appartamento.",
            en: "First-floor apartment with kitchen, two bedrooms and one bathroom, mosquito nets and a small terrace with table and chairs from Easter to October. Wi-Fi outside the apartment.",
          },
          tags: [
            NETS,
            {
              it: "Terrazzino",
              en: "Terrace",
            },
          ],
          images: [
            "stays/corbezzolo-01.webp",
            "stays/corbezzolo-02.webp",
            "stays/corbezzolo-03.webp",
            "stays/corbezzolo-04.webp",
            "stays/corbezzolo-05.webp",
          ],
        },
        {
          slug: "olivo",
          name: "Olivo",
          guests: "5",
          layout: {
            it: "Piano terra · 2 camere · 1 bagno",
            en: "Ground floor · 2 bedrooms · 1 bathroom",
          },
          text: {
            it: "Trilocale al piano terra con cucina-soggiorno, due camere e un bagno, zanzariere e spazio esterno privato con tavolo, sedie e ombrellone. Wi-Fi all'esterno dell'appartamento.",
            en: "Ground-floor apartment with kitchen-living room, two bedrooms and one bathroom, mosquito nets and a private outdoor area with table, chairs and parasol. Wi-Fi outside the apartment.",
          },
          tags: [
            NETS,
          ],
          images: [
            "stays/olivo-01.webp",
            "stays/olivo-02.webp",
            "stays/olivo-03.webp",
            "stays/olivo-04.webp",
            "stays/olivo-05.webp",
          ],
        },
        {
          slug: "melo",
          name: "Melo",
          guests: "5",
          layout: {
            it: "Piano terra · 2 camere · 1 bagno",
            en: "Ground floor · 2 bedrooms · 1 bathroom",
          },
          text: {
            it: "Trilocale al piano terra con due spazi esterni privati: uno dal lato dell'ingresso, l'altro dal lato di una camera. Cucina-soggiorno, due camere, un bagno e zanzariere; Wi-Fi all'esterno.",
            en: "Ground-floor apartment with two private outdoor areas: one by the entrance, the other by a bedroom. Kitchen-living room, two bedrooms, one bathroom and mosquito nets; Wi-Fi outside.",
          },
          tags: [
            NETS,
            {
              it: "Due spazi esterni",
              en: "Two outdoor areas",
            },
          ],
          images: [
            "stays/melo-01.webp",
            "stays/melo-02.webp",
            "stays/melo-03.webp",
            "stays/melo-04.webp",
            "stays/melo-05.webp",
            "stays/melo-06.webp",
            "stays/melo-07.webp",
            "stays/melo-08.webp",
          ],
        },
      ],
      amenities: [
        WIFI_OUT,
        OUTDOOR,
        KITCHEN,
      ],
    },
    {
      category: AT_CASINA("QUADRILOCALE", "THREE-BEDROOM"),
      slug: "quadrilocale-casina",
      name: "Quercia",
      size: "1",
      guests: "6",
      layout: {
        it: "Primo piano · 3 camere · 2 bagni · terrazzino",
        en: "First floor · 3 bedrooms · 2 bathrooms · terrace",
      },
      blurb: {
        it: "Tre camere, due bagni e un terrazzino affacciato sugli ulivi.",
        en: "Three bedrooms, two bathrooms and a small terrace overlooking the olive trees.",
      },
      description: {
        it: "Quercia è l'appartamento più grande della Casina, per famiglie e piccoli gruppi. Soggiorno minimo due notti.",
        en: "Quercia is La Casina's largest apartment, for families and small groups. Minimum stay two nights.",
      },
      cover: "stays/quercia-01.webp",
      detail: "stays/quercia-02.webp",
      gallery: [],
      units: [
        {
          slug: "quercia",
          name: "Quercia",
          guests: "6",
          layout: {
            it: "Primo piano · 3 camere · 2 bagni",
            en: "First floor · 3 bedrooms · 2 bathrooms",
          },
          text: {
            it: "L'appartamento più grande della Casina: al primo piano, cucina-soggiorno, tre camere e due bagni, con zanzariere. Da Pasqua a ottobre il terrazzino affacciato sugli ulivi ha tavolo, sedie e ombrellone. Wi-Fi all'esterno.",
            en: "La Casina's largest apartment: on the first floor, with kitchen-living room, three bedrooms and two bathrooms, and mosquito nets. From Easter to October the terrace overlooking the olive trees has a table, chairs and parasol. Wi-Fi outside.",
          },
          tags: [
            NETS,
            {
              it: "Terrazzino",
              en: "Terrace",
            },
          ],
          images: [
            "stays/quercia-01.webp",
            "stays/quercia-02.webp",
            "stays/quercia-03.webp",
            "stays/quercia-04.webp",
            "stays/quercia-05.webp",
            "stays/quercia-06.webp",
            "stays/quercia-07.webp",
            "stays/quercia-08.webp",
            "stays/quercia-09.webp",
          ],
        },
      ],
      amenities: [
        WIFI_OUT,
        OUTDOOR,
        KITCHEN,
      ],
    },
  ],


  stayPage: {
    back: { it: "Tutti gli alloggi", en: "All apartments" },
    kicker: { it: "La vostra casa a Nerbona", en: "Your home at Nerbona" },
    sizeLabel: { it: "Alloggi", en: "Units" },
    guestsLabel: { it: "Ospiti", en: "Guests" },
    galleryLabel: { it: "Dentro la casa", en: "Inside" },
    unitsLabel: { it: "Gli appartamenti", en: "The apartments" },
    askLabel: { it: "Chiedi informazioni", en: "Ask about it" },
    askMessage: {
      it: "Buongiorno, vorrei informazioni sull'appartamento {name} di Fattoria Nerbona.",
      en: "Hello, I'd like some information about the {name} apartment at Fattoria Nerbona.",
    },
    amenitiesLabel: { it: "In tutti gli alloggi", en: "In every apartment" },
    ctaTitle: {
      it: "Questa potrebbe essere la vostra estate.",
      en: "This could be your summer.",
    },
    ctaLabel: { it: "Scrivici su WhatsApp", en: "Message us on WhatsApp" },
  },

  dock: {
    enabled: true,
    triggerKicker: { it: "PARLA CON NOI", en: "TALK TO US" },
    triggerLabel: { it: "Contattaci", en: "Contact us" },
    panelKicker: { it: "PRENOTA DIRETTAMENTE", en: "BOOK DIRECT" },
    panelTitle: { it: "Iniziamo da qui.", en: "Let's start here." },
    panelText: {
      it: "Prenotando sul nostro sito o scrivendoci, ci parlate direttamente, senza intermediari.",
      en: "Booking on our site or writing to us, you deal with us directly, with no intermediaries.",
    },
    phoneLabel: { it: "Telefono", en: "Phone" },
  },

  footer: {
    copyright: "© 2026 Agriturismo Fattoria Nerbona",
  },

  /* La struttura gestisce già le proprie informative su Iubenda: meglio
     rimandare al loro documento, che resta aggiornato da chi lo mantiene.
     La cookie policy all'indirizzo con /cookie-policy va verificata con il
     cliente. */
  legalPages: [
    {
      slug: "privacy-policy",
      title: { it: "Privacy Policy", en: "Privacy Policy" },
      externalUrl: "https://www.iubenda.com/privacy-policy/77766258",
    },
    {
      slug: "cookie-policy",
      title: { it: "Cookie Policy", en: "Cookie Policy" },
      externalUrl:
        "https://www.iubenda.com/privacy-policy/77766258/cookie-policy",
    },
  ],
};

export default site;
