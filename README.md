# Agriturismo Fattoria Nerbona

Sito di Agriturismo Fattoria Nerbona, Colle di Val d'Elsa.

Anteprima online: **https://andreagalanti91.github.io/nerbona/**
(non indicizzata dai motori di ricerca).

Il sito è costruito sulla piattaforma per agriturismi di Andrea Galanti: un
solo codice sorgente, N clienti. Ogni cliente è una cartella di dati, testi,
foto e colori; questo repository contiene solo Nerbona.

## Pubblicazione

Ogni push su `main` ricompila il sito e lo pubblica su GitHub Pages
(`.github/workflows/pages.yml`). Se è il primo avvio, in Settings → Pages
la sorgente deve essere **GitHub Actions**.

---

## Avvio rapido

```bash
npm ci
npm run dev
```

Apre `http://localhost:3000` con il sito di Nerbona.

Per lavorare su un altro cliente:

```bash
SITE_ID=podere-rosa npm run dev
```

---

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Sviluppo locale con ricarica automatica |
| `npm run check` | Verifica che le configurazioni siano complete e coerenti |
| `npm run build:static` | Compila un cliente in `dist/<id>/`, file statici |
| `npm run build:all` | Compila tutti i clienti registrati |
| `npm run validate` | Controlla che una configurazione sia completa e coerente |
| `npm run new:tenant <slug>` | Crea un nuovo cliente: cartelle, template, registrazione |
| `npm run media:prepare` | Converte le foto grezze in webp con i nomi giusti |
| `npm run media:placeholders` | Crea immagini segnaposto per le foto non ancora arrivate |
| `npm run media:scan` | Legge le foto di un cliente e stampa gli array `gallery` |
| `npm run demo:build` | Compila un'anteprima commerciale su /demo/<cliente> |
| `npm run build` | Applicazione Next completa (richiede Node sul server) |

Tutti accettano `SITE_ID` per scegliere il cliente:

```bash
SITE_ID=podere-rosa npm run build:static
```

Senza `SITE_ID` si usa il valore in `.env` (vedi `.env.example`).

---

## Struttura

```
tenants/
├── _template/          scheletro da copiare per un nuovo cliente
│   ├── site.ts
│   └── theme.css
└── le-ville/
    ├── site.ts         TUTTO il contenuto: testi, foto, contatti, sezioni
    └── theme.css       colori e font

public/tenants/
└── le-ville/           foto e video del cliente

src/
├── config/
│   ├── types.ts        lo schema: cosa può cambiare da cliente a cliente
│   └── index.ts        sceglie il cliente attivo, costruisce le URL dei media
├── lib/                lingue, animazioni allo scroll, geometria della mappa
├── components/
│   ├── sections/       una sezione della homepage per file
│   ├── layout/         header, footer, pulsante contatti
│   ├── HomePage.tsx    monta le sezioni nell'ordine della configurazione
│   ├── StayPage.tsx    pagina di dettaglio di una sistemazione
│   └── LegalPage.tsx   privacy e cookie policy
└── styles/
    ├── tokens.css      colori e font, valori di partenza
    ├── site.css        ordine di caricamento (significativo)
    └── parts/          il CSS diviso in 17 blocchi

app/                    rotte Next, sottili: delegano ai componenti
docs/                   documentazione
scripts/                compilazione e utilità
```

---

## Le tre cose da sapere

**1. I contenuti stanno solo in `tenants/<id>/site.ts`.**
Nessun testo, immagine, numero di telefono o colore compare dentro `src/` o
`app/`. Se devi cambiare qualcosa che si vede a schermo, è lì.

**1-bis. Non solo agriturismi.** I tipi di sezione disponibili sono `hero`,
`story`, `stays`, `feature`, `experiences`, `trail`, `territory`, `menu`,
`gallery`, `contact`. Un ristorante usa `menu` e `gallery` e non usa `stays`;
un agriturismo il contrario. Gli alloggi sono facoltativi.

**2. Le sezioni sono un array riordinabile.**
`sections` nella configurazione è l'ordine della pagina. Un cliente senza
piscina cancella un blocco. Nessuna modifica al codice.

**3. L'ordine dei file in `src/styles/site.css` è significativo.**
Il CSS è stratificato: alcune regole in coda sovrascrivono di proposito regole
precedenti. Spostare un `@import` può cambiare il risultato a schermo.

---

## Documentazione

- **[docs/NUOVO-CLIENTE.md](docs/NUOVO-CLIENTE.md)** — procedura completa per
  aggiungere un agriturismo, dalla cartella vuota al sito pubblicato
- **[docs/ARCHITETTURA.md](docs/ARCHITETTURA.md)** — com'è organizzato il
  progetto e perché

---

## Pubblicazione

`npm run build:static` produce `dist/<id>/`: HTML, CSS, JavaScript e media.
Nessun database, nessun Node sul server. Si carica su qualsiasi hosting.

**Nella radice del dominio** (`https://esempio.it`):

```bash
SITE_ID=le-ville SITE_URL=https://esempio.it npm run build:static
```

`SITE_URL` sovrascrive il dominio di `seo.domain`: lo stesso contenuto serve
così sia per l'anteprima di lavoro sia per il dominio definitivo del cliente.

**In una sottocartella** (`https://esempio.it/demo`):

```bash
SITE_ID=le-ville BASE_PATH=/demo npm run build:static
```

`BASE_PATH` è indispensabile: tutti i collegamenti del sito sono assoluti,
quindi senza quell'indicazione le pagine cercherebbero i file nella radice e
si vedrebbe solo testo senza stile. Se cambi la cartella di destinazione devi
ricompilare, non basta spostare i file.

Dominio, DNS, certificato SSL, hosting, backup e posta elettronica restano a
carico di chi gestisce il server.

---

## Da tenere presente

**Pagine legali.** I testi di privacy e cookie policy descrivono un sito senza
cookie, senza moduli di contatto e senza servizi di terze parti. Se aggiungi
analytics, una mappa incorporata o un motore di prenotazione, quei testi non
sono più accurati e serve anche un banner di consenso. Vanno riletti e
approvati dal cliente prima della pubblicazione.

**Peso dei media.** Foto e video di Le Ville pesano circa 42 MB e stanno nel
repository. Con dieci clienti diventano oltre 400 MB da versionare. Se il
numero di clienti cresce conviene spostarli fuori dal repository o su un CDN:
tutte le URL passano da `asset()` in `src/config/index.ts`, quindi è una
modifica in un punto solo.

**Esperienze.** Il CSS prevede un'inquadratura diversa per le prime tre card
esperienze (`.exp-card-1/2/3`). Un cliente con più di tre esperienze ha bisogno
delle regole aggiuntive in `src/styles/parts/09-experiences.css`.

---

## Requisiti

- Node.js 22.13 o successivo
- npm 10 o successivo
