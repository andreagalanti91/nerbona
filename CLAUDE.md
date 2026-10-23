# Istruzioni per Claude

Sito di Agriturismo Fattoria Nerbona, costruito sulla piattaforma per siti
di strutture ricettive e ristoranti italiani (un solo codice sorgente, N
clienti). Questo repository contiene solo il cliente `nerbona`.

Ogni push su `main` ricompila e pubblica il sito su GitHub Pages:
https://andreagalanti91.github.io/nerbona/ (`.github/workflows/pages.yml`).
Quello che finisce su `main` va online.

Leggi questo file prima di toccare qualsiasi cosa. `docs/ARCHITETTURA.md` ha il
dettaglio, `docs/NUOVO-CLIENTE.md` la procedura di onboarding.

---

## La regola che tiene insieme tutto

**Nessun testo, immagine, numero di telefono, indirizzo o colore deve comparire
dentro `src/` o `app/`.**

Tutto ciò che si vede a schermo sta in `tenants/<id>/site.ts`. Se ti viene
chiesto di cambiare qualcosa di visibile, è quasi sempre quel file, non un
componente.

Se un dato serve in più punti (un numero di telefono, un link di prenotazione),
va scritto **una volta sola** in configurazione e letto da lì. Non duplicarlo:
al prossimo cambio se ne dimentica uno.

## Struttura

```
tenants/<id>/site.ts      contenuto del cliente — qui si lavora quasi sempre
tenants/<id>/theme.css    colori e font del cliente (font in tenants/<id>/fonts/)
public/tenants/<id>/      foto e video del cliente
src/config/types.ts       lo schema: cosa può cambiare da cliente a cliente
src/components/sections/  una sezione della homepage per file
src/styles/parts/         il CSS, in 21 blocchi
app/                      rotte Next, sottili
```

## Clienti attivi

| id | chi è | stato |
|---|---|---|
| `nerbona` | Fattoria Nerbona, Colle di Val d'Elsa | anteprima su GitHub Pages, contenuti e foto reali da nerbona.com |

Nerbona ha pagine interne (`pages`), sottomenù e alloggi raggruppati per
tipologia, con i singoli appartamenti uno per uno.

## Comandi

```bash
npm run dev                                   # sviluppo locale
SITE_ID=nerbona npm run dev                   # su un altro cliente

npm run validate                              # controlla tutti i clienti
SITE_ID=nerbona npm run validate              # uno solo

SITE_ID=nerbona SITE_URL=https://www.nerbona.com npm run build:static
SITE_ID=nerbona npm run demo:build            # anteprima su /demo/<id>
npm run build:all                             # tutti i clienti

npm run new:tenant <slug>                     # crea un nuovo cliente
SITE_ID=x npm run media:prepare               # converte le foto grezze in webp
SITE_ID=x npm run media:placeholders          # segnaposto per le foto mancanti
SITE_ID=x npm run media:scan                  # genera gli array gallery
```

**Lancia sempre `npm run validate` prima di dire che una modifica è finita.**
Controlla foto mancanti, TODO rimasti, traduzioni incomplete, ancore rotte,
formato di telefono ed email. È più affidabile di rileggere la configurazione.

## Cose su cui si sbaglia facilmente

**L'ordine dei file in `src/styles/site.css` è significativo.** Il CSS è
stratificato: alcune regole in coda sovrascrivono di proposito regole
precedenti. Spostare un `@import` cambia il risultato a schermo. Stile nuovo:
in fondo, o in un file importato per ultimo.

**`FillImage` e `PictureImage` non sono intercambiabili.** Le immagini usano
`fill`, quindi si distendono sull'antenato posizionato più vicino.
`PictureImage` aggiunge un wrapper `<picture>` e va usato **solo** nei quattro
contesti in cui il CSS lo posiziona: card e dettaglio del carosello, hero e
galleria della pagina sistemazione. Altrove rompe il layout.

**`BASE_PATH` quando il sito non sta nella radice del dominio.** Tutti i
collegamenti sono assoluti. Senza, le pagine cercano i file nella radice e si
vede solo testo senza stile.

**`SITE_URL` decide cosa dichiari ai motori di ricerca.** Da lì derivano
sitemap, robots, dati strutturati e anteprime social. Un'anteprima compilata
senza `SITE_URL` dichiara il dominio del cliente.

**Il CSS delle esperienze copre solo tre card** (`.exp-card-1/2/3`). Dalla
quarta in poi servono le regole in `src/styles/parts/09-experiences.css`.

**Oltre dodici sistemazioni** il carosello su desktop diventa lunghissimo da
scorrere. La validazione avvisa.

**Le pagine interne usano le stesse sezioni della homepage.** Una pagina nuova
si aggiunge in `pages` nel `site.ts` del cliente, non con una cartella in
`app/`. I collegamenti a pagine interne (`/servizi`) funzionano anche con
`BASE_PATH` perché passano da `SmartLink`: non scrivere `<a href="/...">` a
mano nei componenti.

## Aggiungere un tipo di sezione

1. descrivilo in `src/config/types.ts` e aggiungilo all'unione `Section`
2. scrivi il componente in `src/components/sections/`
3. aggiungi il caso nello `switch` di `src/components/HomePage.tsx`

Se salti il terzo passaggio il progetto non compila: lo `switch` ha un ramo che
assegna a `never`.

## Prima di pubblicare

- i testi di privacy e cookie policy vanno riletti e approvati dal cliente;
  quelli di partenza descrivono un sito senza cookie, senza moduli di contatto
  e senza servizi di terze parti
- il CIN va esposto per le strutture ricettive (non per i ristoranti)
- niente `TODO` residui: lo verifica `npm run validate`
