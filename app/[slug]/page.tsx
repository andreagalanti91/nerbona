import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asset, defaultLocale, site } from "../../src/config";
import { translate } from "../../src/lib/translate";
import { LegalPage } from "../../src/components/LegalPage";
import { ContentPageView } from "../../src/components/HomePage";
import { legalRoutes, findLegalRoute } from "../../src/lib/legal-routes";
import { contentPages, findContentPage } from "../../src/lib/page-routes";
import { accommodations, staysAtRoot } from "../../src/lib/stay-routes";
import { StayPage } from "../../src/components/StayPage";

/**
 * Pagine al primo livello: /<slug>. Una rotta sola copre tre famiglie.
 *
 *  - le pagine interne (`pages`): servizi, esperienze, matrimoni...
 *    composte dalle stesse sezioni della homepage
 *  - le pagine legali (`legalPages`): privacy, cookie
 *  - le pagine degli alloggi, solo se `stayPath` è vuoto
 *
 * Stanno nella stessa rotta perché Next non ammette due segmenti dinamici
 * allo stesso livello. Gli slug arrivano dalla configurazione, quindi un
 * cliente che deve aggiungere una pagina non ha bisogno di una nuova
 * cartella. La validazione controlla che non ci siano slug ripetuti.
 *
 * Le pagine legali con `externalUrl` non vengono generate: i collegamenti
 * puntano direttamente al documento del cliente.
 */
/** Alloggi serviti da questa rotta: nessuno, salvo con `stayPath: ""`. */
function rootStays() {
  return staysAtRoot() ? accommodations() : [];
}

export function generateStaticParams() {
  return [
    ...rootStays().map(({ slug }) => ({ slug })),
    ...contentPages().map(({ slug }) => ({ slug })),
    ...legalRoutes().map(({ slug }) => ({ slug })),
  ];
}

export const dynamicParams = false;

const brandName = `${site.brand.prefix} ${site.brand.name}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const stay = rootStays().find((a) => a.slug === slug);
  if (stay) {
    return {
      title: `${stay.name} | ${brandName}`,
      description: translate(stay.blurb, defaultLocale),
      openGraph: { images: [asset(stay.cover)] },
    };
  }

  const page = findContentPage(slug);
  if (page) {
    const hero = page.sections.find((section) => section.type === "hero");
    const image = hero?.type === "hero" ? (hero.image?.src ?? hero.video?.poster) : undefined;
    return {
      title: `${translate(page.title, defaultLocale)} | ${brandName}`,
      description: translate(page.description, defaultLocale),
      alternates: { canonical: `/${slug}` },
      openGraph: image ? { images: [asset(image)] } : undefined,
    };
  }

  const legal = findLegalRoute(slug);
  if (!legal) return {};
  return {
    title: `${translate(legal.title, defaultLocale)} | ${brandName}`,
    robots: { index: false },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stay = rootStays().find((a) => a.slug === slug);
  if (stay) return <StayPage stay={stay} />;
  const page = findContentPage(slug);
  if (page) return <ContentPageView page={page} />;
  const legal = findLegalRoute(slug);
  if (!legal) notFound();
  return <LegalPage page={legal} />;
}
