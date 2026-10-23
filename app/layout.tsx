import type { Metadata } from "next";
import { asset, defaultLocale, noIndex, site, siteUrl } from "../src/config";
import { LanguageProvider } from "../src/lib/i18n";
import { translate } from "../src/lib/translate";
import "./globals.css";
/* Dopo globals.css, così i valori del cliente vincono. Vedi next.config.ts. */
import "@tenant/theme.css";

/**
 * I metadati si generano dalla configurazione del cliente: titolo, descrizione,
 * favicon e anteprima social cambiano da soli passando da un tenant all'altro.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: translate(site.seo.title, defaultLocale),
  description: translate(site.seo.description, defaultLocale),
  robots: noIndex ? { index: false, follow: false } : undefined,
  icons: {
    icon: asset(site.brand.logo),
    shortcut: asset(site.brand.logo),
  },
  openGraph: {
    title: translate(site.seo.title, defaultLocale),
    description: translate(site.seo.description, defaultLocale),
    url: siteUrl,
    siteName: `${site.brand.prefix} ${site.brand.name}`,
    images: site.seo.ogImage ? [asset(site.seo.ogImage)] : undefined,
    type: "website",
  },
};

/**
 * Dati strutturati per i motori di ricerca. Per una struttura ricettiva
 * contano parecchio: nome, indirizzo, coordinate e contatti compaiono nelle
 * schede laterali di Google. Si generano dalla configurazione, quindi ogni
 * cliente li ha corretti senza doverci pensare.
 */
function structuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: `${site.brand.prefix} ${site.brand.name}`,
    description: translate(site.seo.description, defaultLocale),
    url: siteUrl,
    telephone: `+${site.contact.phone}`,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address[0],
      addressLocality: site.contact.address[1] ?? "",
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.contact.coordinates.lat,
      longitude: site.contact.coordinates.lng,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale} data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
