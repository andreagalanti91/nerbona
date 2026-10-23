# Aggiungere un nuovo agriturismo

Procedura completa, dalla cartella vuota al sito pubblicato.
La prima volta richiede un paio d'ore, quasi tutte spese a scrivere i testi
e a preparare le foto. Il codice non si tocca mai.

---

## 1. Creare le cartelle

```bash
cp -r tenants/_template tenants/podere-rosa
mkdir -p public/tenants/podere-rosa/{stays,estate,experiences,trail,contact,video}
```

`podere-rosa` è lo slug tecnico del cliente: minuscolo, senza spazi né
accenti. Verrà usato come nome di cartella, chiave nel registro e prefisso
delle URL dei media. Sceglilo una volta e non cambiarlo più.

---

## 2. Registrare il cliente

In `src/config/index.ts`, due righe:

```ts
import podereRosa from "../../tenants/podere-rosa/site";

const REGISTRY: Record<string, SiteConfig> = {
  "le-ville": leVille,
  "podere-rosa": podereRosa,   // <-- aggiunta
};
```

---

## 3. Preparare i media

### Formati e pesi

| Cosa | Formato | Peso indicativo |
|---|---|---|
| Foto | `.webp` | 150–400 KB |
| Video hero desktop | `.mp4` H.264 | max 10 MB |
| Video hero mobile | `.mp4` H.264, ritaglio verticale | max 5 MB |
| Logo | `.png` con trasparenza | < 100 KB |

Le foto orizzontali vanno bene ovunque tranne che nel carosello su telefono,
dove viene mostrata la parte centrale: controlla che il soggetto non finisca
tagliato.

### Dove mettere cosa

```
public/tenants/podere-rosa/
├── logo.png
├── video/
│   ├── hero-desktop.mp4
│   ├── hero-mobile.mp4
│   └── hero-poster.webp     immagine mostrata mentre il video carica
├── estate/                  foto della tenuta (racconto, feature)
├── stays/                   foto delle sistemazioni
├── experiences/
├── trail/
└── contact/
```

### Convenzione per le sistemazioni

Nella cartella `stays/`, ogni sistemazione usa il proprio slug come prefisso
e una numerazione progressiva:

```
villa-01.webp    copertina
villa-02.webp    galleria
villa-03.webp
...
villa-preview.webp   opzionale: foto piccola sovrapposta nella card
```

Poi:

```bash
SITE_ID=podere-rosa npm run media:scan
```

Stampa i blocchi `cover`, `detail` e `gallery` già compilati, pronti da
incollare in `site.ts`.

---

## 4. Scrivere i contenuti

Apri `tenants/podere-rosa/site.ts` e sostituisci ogni `TODO`.

Consiglio pratico: cerca `TODO` nell'editor e vai in ordine. Alla fine

```bash
npm run check
```

TypeScript segnala ogni campo mancante o scritto male. Se passa, la
configurazione è completa.

### Togliere o riordinare le sezioni

L'array `sections` è l'ordine della pagina. Un cliente senza piscina cancella
il blocco `feature`; uno senza percorso natura cancella `trail`; uno con due
cose da mettere in evidenza duplica `feature` cambiandone l'`id`.

I tipi disponibili: `hero`, `story`, `stays`, `feature`, `experiences`,
`trail`, `territory`, `contact`.

Se togli una sezione, togli anche la sua voce da `nav`.

### La mappa del territorio

Per ogni località basta indicare `coordinates`. Posizione sul riquadro e rotta
tratteggiata vengono calcolate da `src/lib/map-geometry.ts`.

Guarda il risultato: se una località finisce sopra un'altra o troppo vicina al
bordo, aggiungi `position` per spostarla a mano. In quel caso conviene indicare
anche `route` e `mobileRoute`, altrimenti la rotta punterà alla posizione
calcolata e non a quella corretta.

Le coordinate si prendono da Google Maps: tasto destro sul punto, il primo
valore del menù è `lat, lng`.

---

## 5. Palette e tipografia

`tenants/podere-rosa/theme.css`. Scommenta e cambia solo ciò che serve:

```css
:root {
  --ink: #2a1f14;      /* testo e sfondi scuri */
  --lime: #d9a441;     /* colore d'accento */
  --cream: #f6f1e8;    /* sfondi chiari */
  --font-display: "Playfair Display", Georgia, serif;
}
```

I valori di partenza stanno in `src/styles/tokens.css`.

Per un font diverso, meglio ospitarlo insieme al sito che caricarlo da Google
Fonts: niente richieste a servizi esterni (che andrebbero dichiarate
nell'informativa) e un disegno del testo più rapido. Scarica i `.woff2` (per
esempio con `npm pack @fontsource/<nome>`), mettili in `tenants/<id>/fonts/`
con la licenza, e dichiarali con `@font-face` e percorsi relativi in
`theme.css`. `tenants/nerbona/theme.css` è l'esempio da copiare.

---

## 6. Pagine legali

**Non pubblicare i testi di esempio senza rileggerli.**

Il testo di partenza di Le Ville descrive un sito senza cookie, senza moduli
di contatto e senza servizi di terze parti. Se il nuovo cliente aggiunge
Google Analytics, una mappa incorporata, un motore di prenotazione o un modulo
contatti, quel testo diventa inesatto e serve anche un banner di consenso.

Fai rileggere e approvare privacy e cookie policy dal cliente o dal suo
consulente prima di andare online.

---

## 7. Provare

```bash
SITE_ID=podere-rosa npm run dev
```

Da controllare prima di consegnare:

- [ ] Il video parte su desktop e su telefono
- [ ] Il carosello delle sistemazioni scorre fino in fondo e il contatore arriva all'ultima
- [ ] Ogni sistemazione ha la sua pagina e la galleria è completa
- [ ] Il cambio lingua funziona e non resta nulla in italiano nella versione inglese
- [ ] WhatsApp, email e telefono aprono la cosa giusta
- [ ] La mappa non ha località sovrapposte, né su desktop né su telefono
- [ ] Nessuna immagine si vede tagliata male su schermo stretto

---

## 8. Pubblicare

Dipende da dove va il sito.

**Radice del dominio** — `https://podere-rosa.it`

```bash
SITE_ID=podere-rosa npm run build:static
```

**Sottocartella** — `https://podere-rosa.it/anteprima`

```bash
SITE_ID=podere-rosa BASE_PATH=/anteprima npm run build:static
```

In entrambi i casi ricordati di allineare `seo.domain` nella configurazione,
sottocartella inclusa: da lì derivano sitemap, dati strutturati e anteprime
social.

Produce `dist/podere-rosa/`: HTML, CSS, JavaScript e media, senza bisogno di
Node sul server. Si carica su qualsiasi hosting (Apache, Nginx, spazio web
condiviso, Netlify, Cloudflare Pages).

`BASE_PATH` non è opzionale quando il sito sta in una sottocartella: tutti i
collegamenti sono assoluti, quindi senza quell'indicazione le pagine
cercherebbero i file nella radice del dominio. E se in futuro sposti il sito
in un'altra cartella devi ricompilare, non basta spostare i file.

---

## Quando correggi qualcosa per tutti

Una modifica in `src/` vale per ogni cliente. Per ripubblicarli tutti:

```bash
npm run build:all
```

Compila ogni cartella presente in `tenants/` (escluse quelle che iniziano con
`_`) e riporta quali sono andate a buon fine.

---

## Percorso rapido per una demo commerciale

Prima della vendita non serve un sito completo: serve qualcosa che faccia
dire "voglio questo". Un'ora o due, non due giorni.

```bash
npm run new:tenant nerbona
```

Crea cartelle, registra il cliente, prepara `prospects/nerbona/`.

**1. Raccogli il materiale** in `prospects/nerbona/fonte.md`: testi dal loro
sito, dalle schede Booking e Agriturismo.it, elenco degli alloggi, distanze.
Non riordinare niente, serve solo che sia completo.

**2. Genera la configurazione.** Passa `fonte.md` a Claude e chiedi di
produrre `tenants/nerbona/site.ts`. È il passaggio che richiede più giudizio e
meno tempo.

**3. Scopri quali foto servono.**

```bash
SITE_ID=nerbona npm run validate
```

Scrive `prospects/nerbona/foto-mancanti.txt`: l'elenco esatto dei file da
procurare, cartella per cartella. È la tua lista della spesa.

**3-bis. Se le foto non sono ancora arrivate**, riempi i buchi con dei
segnaposto per poter già navigare la demo:

```bash
SITE_ID=nerbona npm run media:placeholders
```

Sono volutamente riconoscibili — fondo pieno e la scritta "foto in arrivo" —
così chi guarda capisce che manca qualcosa invece di pensare che il sito sia
rotto. Quando arrivano le foto vere, `media:prepare` le mette al loro posto e
`npm run media:placeholders -- --clean` rimuove quelli avanzati.

**4. Scarica le foto** in `prospects/nerbona/foto/`, rispettando le cartelle.
Dentro `foto/stays/` una sottocartella per alloggio; l'ordine alfabetico dei
file decide quale sarà la copertina, quindi rinominali `1-`, `2-`, `3-`.

**5. Converti.**

```bash
SITE_ID=nerbona npm run media:prepare
```

Ridimensiona tutto in webp con i nomi giusti. Una foto scaricata da un sito
pesa spesso 3 MB: dopo la conversione sono 200 KB.

**6. Ricontrolla e pubblica.**

```bash
SITE_ID=nerbona npm run validate
SITE_ID=nerbona npm run demo:build
```

Carica `dist/demo/` dentro la cartella `demo` del dominio. L'indirizzo è
`tuodominio.it/demo/nerbona`, e `tuodominio.it/demo/` elenca tutte le
anteprime: diventa il portfolio da allegare alle email.

### Sulle foto altrui

Mostrare a un agriturismo le sue stesse foto in una veste nuova è prassi
normale in una proposta commerciale. Due accorgimenti:

- la pagina indice delle demo è già marcata `noindex`, così le anteprime non
  finiscono nei motori di ricerca
- quando una trattativa si chiude senza esito, cancella la cartella:
  `rm -rf dist/demo/<cliente>` e ricarica

Se una demo va online a lungo, chiedi il consenso.

---

## Informative già esistenti

Molti agriturismi hanno già privacy e cookie policy su un servizio come
Iubenda. In quel caso non serve copiarne il testo: si rimanda al loro
documento, che resta aggiornato da chi lo mantiene.

```ts
legalPages: [
  {
    slug: "privacy-policy",
    title: { it: "Privacy Policy", en: "Privacy Policy" },
    externalUrl: "https://www.iubenda.com/privacy-policy/12345678",
  },
],
```

Con `externalUrl` il sito non genera la pagina e tutti i collegamenti puntano
direttamente lì. Se *tutte* le informative sono esterne, viene comunque
generata una pagina `/note-legali` che le elenca: serve ad avere un
riferimento stabile sul dominio del cliente.

## Codice Identificativo Nazionale

In Italia il CIN della struttura ricettiva va esposto sul sito. Basta metterlo
in `brand.cin` e compare da solo nel footer. Se manca, la validazione lo
segnala.

---

## Motore di prenotazione esterno

Quando il cliente usa un motore di prenotazione (Amenitiz, Octorate, Booking
Engine…), l'indirizzo va scritto una volta sola:

```ts
booking: {
  url: "https://nome-struttura.amenitiz.io/it/booking/room",
  label: { it: "Prenota", en: "Book now" },
},
```

Da lì viene usato automaticamente in tre punti: il bottone dell'header, il
blocco contatti e il pannello flottante. Cambiando fornitore si aggiorna un
indirizzo, non tre.

Senza `booking`, il bottone dell'header punta alla sezione contatti e nessun
pulsante "prenota" compare: un ristorante o un agriturismo che prende
prenotazioni solo per telefono non ha bisogno di toccare niente.

## Lo stesso contenuto su due indirizzi

`SITE_URL` sovrascrive il dominio scritto in `seo.domain`:

```bash
# anteprima sul dominio di lavoro
SITE_ID=le-ville npm run demo:build

# sito definitivo del cliente
SITE_ID=le-ville SITE_URL=https://agriturismoleville.it npm run build:static
```

Serve perché da quel valore derivano sitemap, robots, dati strutturati e
anteprime social: senza, l'anteprima dichiarerebbe ai motori di ricerca il
dominio del cliente, o viceversa.
