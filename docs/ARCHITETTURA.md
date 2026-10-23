# Architettura

Come è organizzato il progetto, e perché è organizzato così.

---

## L'idea di fondo

Un solo codice sorgente, N agriturismi.

Ogni cliente è una cartella di **dati**: testi, percorsi delle foto, colori.
Il codice che li trasforma in un sito è lo stesso per tutti.

```
tenants/le-ville/site.ts      contenuto           ← si modifica per ogni cliente
tenants/le-ville/theme.css    colori e font       ← si modifica per ogni cliente
public/tenants/le-ville/      foto e video        ← si modifica per ogni cliente

src/                          piattaforma         ← non si tocca mai
app/                          rotte               ← non si tocca mai
```

La conseguenza pratica: se scopri un difetto nel carosello, lo correggi una
volta in `src/` e `npm run build:all` lo risolve per tutti i clienti. Con
un progetto duplicato per cliente andrebbe corretto N volte, e prima o poi
qualcuno resterebbe indietro.

---

## Come viene scelto il cliente da compilare

La variabile d'ambiente `SITE_ID` indica quale cartella di `tenants/` usare.

```bash
SITE_ID=le-ville    npm run build:static   →  dist/le-ville/
SITE_ID=podere-rosa npm run build:static   →  dist/podere-rosa/
```

`src/config/index.ts` legge la variabile, cerca il cliente in un registro
esplicito e lo espone come `site`. Da lì in poi ogni componente importa `site`
e legge quello che gli serve.

Il registro è un oggetto scritto a mano invece di un import dinamico per due
motivi: Next deve poter risolvere i moduli in fase di compilazione per generare
le pagine statiche, e avere l'elenco dei clienti in un punto solo rende ovvio
chi è in produzione.

---

## Il contratto di contenuto

`src/config/types.ts` descrive tutto ciò che può cambiare da un cliente
all'altro. È il punto di incontro fra piattaforma e dati.

La regola che tiene insieme il progetto:

> Nessun testo, immagine, numero di telefono o colore deve comparire dentro
> `src/` o `app/`.

Se serve una voce nuova, si aggiunge allo schema e TypeScript segnala
automaticamente tutti i clienti da aggiornare. È il motivo per cui vale la pena
avere lo schema tipizzato: senza, aggiungere un campo significherebbe ricordarsi
a memoria quali clienti toccare.

---

## Le sezioni

`sections` è un array. `src/components/HomePage.tsx` lo scorre e monta il
componente corrispondente a ogni `type`.

Questo è ciò che rende il sito adattabile senza toccare codice: riordinare le
sezioni, toglierne una o usarne una due volte si fa spostando blocchi nella
configurazione del cliente.

Per aggiungere un **tipo** nuovo di sezione:

1. descrivilo in `src/config/types.ts` e aggiungilo all'unione `Section`
2. scrivi il componente in `src/components/sections/`
3. aggiungi il suo caso nello `switch` di `HomePage.tsx`

Se dimentichi il terzo passaggio, il progetto non compila: lo `switch` ha un
ramo `default` che assegna a `never`, quindi un tipo non gestito diventa un
errore in fase di compilazione anziché una pagina rotta.

---

## Le animazioni

Le sezioni "racconto" e "sistemazioni" reagiscono allo scorrimento della
pagina. Il meccanismo è sempre lo stesso:

1. `src/lib/use-scroll-effect.ts` aggancia scroll e resize, al massimo una
   volta per frame
2. la sezione traduce l'avanzamento (un numero da 0 a 1) in **variabili CSS**
   scritte sull'elemento
3. il foglio di stile usa quelle variabili per muovere le cose

Il JavaScript calcola solo numeri. Come si muovono gli elementi è tutto nel
CSS. Serve a due cose: le animazioni restano fluide, e chi deve modificarle sa
dove guardare.

`prefers-reduced-motion` è rispettato: chi ha chiesto al sistema meno
animazioni vede le sezioni direttamente nel loro stato finale.

---

## Gli stili

`src/styles/` contiene il CSS diviso in blocchi, più i token di tema.

```
tokens.css        colori e font, valori di partenza
site.css          elenca i blocchi nell'ordine di caricamento
parts/01-…17-     il CSS vero, diviso per argomento
```

**L'ordine dei blocchi in `site.css` è significativo.** Il CSS originale era
stato scritto a strati successivi — l'impianto generale, poi la riscrittura
delle singole sezioni, poi tre giri di rifiniture — e diverse regole in coda
sovrascrivono di proposito regole precedenti. I file sono stati ritagliati
mantenendo l'ordine esatto, non raggruppati per argomento: raggrupparli
avrebbe cambiato la cascata e quindi il risultato a schermo.

Se devi aggiungere stile nuovo, mettilo in fondo o crea un file e importalo
per ultimo.

### Il tema

`tokens.css` definisce le variabili; `tenants/<id>/theme.css` le sovrascrive e
viene caricato dopo. Nel resto del CSS non compaiono colori o font scritti a
mano: sempre `var(--nome)`. È ciò che permette di ricolorare un intero sito
cambiando dieci righe.

Oltre ai colori principali ci sono token per i fondi delle singole sezioni
(`--story-bg`, `--stays-bg`, `--territory-bg`), per i testi secondari
(`--muted`, `--muted-soft`), per le velature sulle foto e per le card delle
esperienze. I valori di partenza sono quelli di Le Ville.

Il tema lo importa `app/layout.tsx` come `@tenant/theme.css`: è un alias,
definito in `next.config.ts`, che punta alla cartella del cliente indicato da
`SITE_ID`. Un import scritto a mano in `globals.css` darebbe a tutti i
clienti il tema di uno solo.

I font conviene ospitarli nella cartella del cliente (`tenants/<id>/fonts/`)
e dichiararli con `@font-face` in `theme.css`, con percorsi relativi: Next li
copia nella build e funzionano anche con `BASE_PATH`. Vedi `tenants/nerbona/`.

---

## Le pagine interne

Un cliente può avere, oltre alla homepage, delle pagine interne: `pages` in
configurazione. Ogni pagina è un elenco di sezioni, esattamente come la
homepage, e si apre con un `hero` (di solito `size: "compact"`). Le genera
`app/[slug]/page.tsx`, la stessa rotta delle pagine legali: Next non ammette
due segmenti dinamici allo stesso livello, e la validazione controlla che gli
slug non si sovrappongano.

Sezioni pensate soprattutto per le pagine interne:

- `cards` — griglia di schede con foto facoltativa: servizi, esperienze
- `reviews` — recensioni trascritte, con i collegamenti ai portali;
  `layout: "editorial"` mette la prima in grande e le altre in elenco
- `prose` — testo lungo con titolo, collegamenti e foto facoltativa
- `chapters` — capitoli alternati foto/testo con una parola gigante che
  scorre di lato insieme alla pagina
- `facts` — informazioni pratiche, etichetta e valore, da leggere al volo

L'apertura `hero` con `size: "editorial"` è la versione da rivista: fondo
chiaro, titolo maiuscolo centrato, foto incorniciata. Insieme a `chapters` e
`facts` forma l'impaginazione editoriale (`parts/20-editorial.css`), usata da
Nerbona per Servizi, Matrimoni, Toscana e Recensioni.

### Indirizzi degli alloggi

Le pagine degli alloggi stanno di norma in `/sistemazioni/<slug>`. Con
`stayPath: ""` stanno alla radice, `/<slug>`, e le genera `app/[slug]`:
serve a mantenere gli indirizzi del sito precedente del cliente. La
validazione controlla che non collidano con pagine interne o legali.

Altre aggiunte utili a una struttura con più sedi o molti alloggi:

- `stays.only` mostra nel carosello solo alcuni alloggi (la pagina di una sede)
- `stayTabs` è l'alternativa al carosello: alloggi divisi in schede (per
  esempio una per sede), con il nome di ogni appartamento e il collegamento
  diretto al suo riquadro
- `Accommodation.units` elenca gli appartamenti reali che appartengono a una
  tipologia. Con le loro foto (`images`) la pagina della tipologia li
  presenta uno per uno: galleria sfogliabile, posti letto, descrizione,
  "Prenota" (con `bookingUrl` proprio o quello generale) e "Chiedi
  informazioni" su WhatsApp con il nome dell'appartamento già scritto
  (`stayPage.askMessage`). Ogni appartamento ha un'ancora: /trilocale#solaio
- `feature.cta` aggiunge un collegamento al blocco foto

### Collegamenti e menù

I collegamenti in configurazione possono essere ancore (`#contatti`), pagine
interne (`/servizi`) o indirizzi esterni. Li gestisce `SmartLink` in
`src/lib/links.tsx`: le pagine interne passano da `next/link`, che aggiunge
`BASE_PATH`; gli indirizzi esterni si aprono in una nuova scheda.

Una voce di `nav` punta a una sezione della homepage (`target`), a una pagina
(`page`) o a un indirizzo qualsiasi (`href`, per esempio la pagina di un
alloggio), e può avere un sottomenù (`children`). Una voce senza indirizzo fa
solo da intestazione del sottomenù. Dalle pagine interne le voci
con `target` diventano `/#sezione`: i componenti sanno in che pagina si
trovano con `useIsHome()`.

---

## Le immagini

Tutte le immagini usano `fill`: si distendono per riempire l'antenato
posizionato più vicino. Basta interporre un elemento non posizionato perché
l'immagine esca dal suo riquadro.

Per questo `src/components/Media.tsx` espone **due** componenti:

- `FillImage` — il caso normale, immagine figlia diretta del contenitore
- `PictureImage` — aggiunge un wrapper `<picture>`, che permette di servire un
  file diverso su telefono

`PictureImage` va usato **solo** nei quattro contesti in cui il CSS posiziona
esplicitamente il wrapper: card e dettaglio del carosello, hero e galleria
della pagina sistemazione. Altrove rompe il layout.

### Versione dei media

`asset()` in `src/config/index.ts` costruisce le URL e vi aggiunge
`?v=<mediaVersion>`. Serve quando sostituisci una foto tenendo lo stesso nome
file: senza, browser e CDN continuano a mostrare la vecchia.

Cambia `mediaVersion` nella configurazione del cliente ogni volta che
sostituisci dei media.

---

## Le lingue

`locales` elenca le lingue attive del cliente; la prima è quella predefinita.
Ogni testo è un oggetto con una chiave per lingua.

`src/lib/i18n.tsx` tiene la lingua corrente in un context ed espone `t()`.
`src/lib/translate.ts` fa la stessa cosa senza React, ed è un file separato
perché i moduli marcati `"use client"` non possono essere chiamati dal server:
serve per metadati, sitemap e dati strutturati, che girano in fase di
generazione.

La lingua scelta viene salvata in `localStorage` con una chiave che include lo
slug del cliente, così due siti sullo stesso dominio non si pestano i piedi.

Aggiungere una lingua a un cliente: mettila in `locales`, aggiungi la chiave a
`localeNames`, e traduci. TypeScript non obbliga a completare tutte le
traduzioni — `Localized` è un `Record<string, string>` — ma `translate()`
ripiega sulla lingua di default, quindi un testo mancante non lascia mai un
buco a schermo.

---

## SEO

Generati dalla configurazione, quindi corretti per ogni cliente senza doverci
pensare:

- metadati e anteprima social — `app/layout.tsx`
- dati strutturati `LodgingBusiness` con indirizzo, coordinate e contatti —
  contano parecchio per una struttura ricettiva, finiscono nelle schede
  laterali di Google
- `sitemap.xml` e `robots.txt` — `app/sitemap.ts`, `app/robots.ts`

Le pagine legali sono escluse dall'indicizzazione.

---

## Pubblicazione

`npm run build:static` produce `dist/<site-id>/`: file statici, nessun Node
sul server. È la modalità pensata per la vendita — si carica su qualsiasi
hosting e non c'è niente da mantenere.

### Sottocartelle

Tutti i collegamenti generati sono assoluti. Se il sito non sta nella radice
del dominio, la sottocartella va dichiarata al momento della compilazione:

```bash
BASE_PATH=/demo npm run build:static
```

`next.config.ts` la passa a Next, che la applica ai collegamenti fra pagine e
ai file JavaScript e CSS. Alle URL dei media ci pensa `asset()`, che legge la
stessa variabile: è il punto unico da cui passano tutti i percorsi di foto e
video, ed è il motivo per cui supportare le sottocartelle è costata una riga.

La sottocartella è cablata nei file generati: spostare il sito altrove
richiede una nuova compilazione.

Esiste anche `npm run build` per la modalità applicazione Next completa, che
aggiunge l'ottimizzazione delle immagini lato server ma richiede un processo
Node attivo.

---

## Cosa è cambiato rispetto alla versione precedente

| | Prima | Ora |
|---|---|---|
| Componente principale | 1.219 righe, un file | 13 componenti, 60–180 righe |
| Testi nei componenti | 53 condizioni sulla lingua | nessuna |
| Nome, telefono, email cablati | 45 occorrenze | nessuna |
| Dati sistemazioni | due elenchi da tenere allineati | un oggetto solo |
| CSS | 3.576 righe, un file | 17 blocchi + token |
| Regole CSS mai applicabili | 62 | rimosse |
| Mappa territorio | 6 numeri a mano per località | coordinate, il resto si calcola |
| Aggiungere un cliente | duplicare il progetto | una cartella di dati |

L'HTML generato è stato confrontato con quello della versione precedente su
tutte e dieci le pagine: struttura, classi e testo coincidono.

---

## Oltre gli agriturismi

Il primo cliente non ricettivo (una trattoria) ha messo alla prova l'impianto.
Ha retto, con tre aggiunte allo schema e nessuna riscrittura.

**Cosa ha funzionato senza toccare niente**

- `story` usato due volte nella stessa pagina: la filosofia della casa e il
  ritratto dello chef
- `feature` usato tre volte: la sala, il km 0, il come arrivare
- niente sezione `stays`, semplicemente non elencata

**Cosa è stato aggiunto**

- il tipo `menu`: un estratto di piatti in pagina più i collegamenti ai PDF
  del cliente. Il PDF resta sul suo dominio, così lo aggiorna a ogni stagione
  senza ricompilare niente; l'estratto in pagina serve ai motori di ricerca,
  che dai PDF non leggono
- il tipo `gallery`, che riusa le classi CSS già scritte per le gallerie delle
  pagine interne: zero stile nuovo
- gli orari di apertura, campo facoltativo del blocco contatti

**Cosa è diventato facoltativo**

`accommodations` e `stayPage`. Un'attività senza alloggi non genera nessuna
pagina `/sistemazioni`. `src/lib/stay-routes.ts` è l'unico punto che conosce
questo caso.

Il segnale che l'architettura regge: TypeScript ha elencato da solo, in un
colpo, i dodici punti che davano per scontata l'esistenza degli alloggi. Nessuno
è stato dimenticato.
