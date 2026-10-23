import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { defaultLocale, site } from "../../../src/config";
import { accommodations, staysAtRoot } from "../../../src/lib/stay-routes";
import { translate } from "../../../src/lib/translate";
import { StayPage } from "../../../src/components/StayPage";

/**
 * Una pagina per ogni sistemazione in configurazione.
 *
 * Un cliente senza alloggi (un ristorante) non ne genera nessuna. L'esportazione
 * statica di Next però si rifiuta di compilare una rotta dinamica priva di
 * indirizzi: in quel caso si genera una sola pagina a uno slug riservato, che
 * risponde 404 e non compare in nessun collegamento né nella sitemap.
 * Lo stesso vale quando gli alloggi stanno alla radice (`stayPath: ""`): in
 * quel caso le pagine le genera app/[slug].
 */
const EMPTY_SLUG = "__nessuna__";

export function generateStaticParams() {
  const stays = staysAtRoot() ? [] : accommodations();
  return stays.length
    ? stays.map(({ slug }) => ({ slug }))
    : [{ slug: EMPTY_SLUG }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stay = staysAtRoot()
    ? undefined
    : accommodations().find((a) => a.slug === slug);
  if (!stay) return {};
  return {
    title: `${stay.name} | ${site.brand.prefix} ${site.brand.name}`,
    description: translate(stay.blurb, defaultLocale),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stay = staysAtRoot()
    ? undefined
    : accommodations().find((a) => a.slug === slug);
  if (!stay) notFound();
  return <StayPage stay={stay} />;
}
