import path from "node:path";
import type { NextConfig } from "next";

/**
 * Due modalità di pubblicazione:
 *
 *  - STATIC_EXPORT=true  -> cartella dist/<id>/ da caricare su un hosting
 *                           normale (Apache, Nginx, spazio web condiviso).
 *                           È la modalità da usare per vendere il sito a un
 *                           agriturismo: nessun server Node da gestire.
 *
 *  - senza la variabile   -> applicazione Next completa, con ottimizzazione
 *                           delle immagini lato server.
 *
 * BASE_PATH serve quando il sito NON sta nella radice del dominio ma dentro
 * una sottocartella:
 *
 *    https://esempio.it            ->  BASE_PATH vuoto
 *    https://esempio.it/demo       ->  BASE_PATH=/demo
 *
 * Tutti i collegamenti del sito sono assoluti, quindi senza questa
 * indicazione la sottocartella verrebbe ignorata e le pagine cercherebbero
 * i file nella radice.
 */
const staticExport = process.env.STATIC_EXPORT === "true";

/* Normalizza: deve iniziare con "/" e non finire con "/". */
const rawBasePath = (process.env.BASE_PATH ?? "").trim().replace(/\/+$/, "");
const basePath =
  rawBasePath && !rawBasePath.startsWith("/") ? `/${rawBasePath}` : rawBasePath;

/* Il tema del cliente (colori e font) sta in tenants/<id>/theme.css. Lo
   importa app/layout.tsx attraverso questo alias, che punta alla cartella del
   cliente che si sta compilando: un import scritto a mano in globals.css
   finirebbe per dare a tutti i clienti il tema di uno solo. */
const siteId = process.env.SITE_ID ?? "nerbona";
const tenantTheme = `./tenants/${siteId}/theme.css`;

const nextConfig: NextConfig = {
  output: staticExport ? "export" : undefined,
  turbopack: {
    resolveAlias: { "@tenant/theme.css": tenantTheme },
  },
  webpack: (config) => {
    config.resolve.alias["@tenant/theme.css"] = path.resolve(tenantTheme);
    return config;
  },
  trailingSlash: staticExport,
  basePath: basePath || undefined,
  images: {
    qualities: [75, 95],
    unoptimized: staticExport,
  },
  env: {
    /* Resi disponibili al codice client. */
    NEXT_PUBLIC_SITE_ID: siteId,
    NEXT_PUBLIC_BASE_PATH: basePath,
    /* Dominio pubblico. Se assente si usa quello in configurazione. */
    NEXT_PUBLIC_SITE_URL: process.env.SITE_URL ?? "",
    /* NOINDEX=true per le anteprime: i motori di ricerca non le indicizzano,
       così non fanno concorrenza al sito vero del cliente. */
    NEXT_PUBLIC_NOINDEX: process.env.NOINDEX === "true" ? "true" : "",
  },
};

export default nextConfig;
