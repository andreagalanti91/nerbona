"use client";

import Image from "next/image";
import Link from "next/link";
import { asset, site } from "../../config";
import { useIsHome } from "../../lib/links";

/**
 * Logo del cliente. Compare nell'header, nel footer e nelle pagine interne.
 * `href` cambia perché in homepage è un'ancora, altrove un link alla home.
 * Se non è indicato lo si ricava dalla pagina in cui ci si trova.
 */
export function Brand({
  href: explicitHref,
  size = 46,
}: {
  href?: string;
  size?: number;
}) {
  const home = useIsHome();
  const href = explicitHref ?? (home ? "#home" : "/");
  const content = (
    <>
      <Image
        src={asset(site.brand.logo)}
        alt=""
        width={size}
        height={size}
        unoptimized
      />
      <span>
        <small>{site.brand.prefix}</small>
        <b>{site.brand.name}</b>
      </span>
    </>
  );

  return href.startsWith("#") ? (
    <a className="brand" href={href}>
      {content}
    </a>
  ) : (
    <Link className="brand" href={href}>
      {content}
    </Link>
  );
}
