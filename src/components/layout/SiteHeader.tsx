"use client";

import { useState } from "react";
import { bookingUrl, site } from "../../config";
import { useLanguage } from "../../lib/i18n";
import { navHref, SmartLink, useIsHome } from "../../lib/links";
import { Brand } from "./Brand";

/**
 * Barra superiore: logo, navigazione, selettore lingua, invito all'azione.
 * Il menù mobile vive qui perché ne condivide lo stato di apertura.
 *
 * `onMenuChange` serve al pulsante contatti flottante, che si nasconde
 * quando il menù a tutto schermo è aperto.
 *
 * Le voci possono avere un sottomenù (`children`): su desktop si apre al
 * passaggio del mouse o con il tab, su telefono le sottovoci compaiono
 * rientrate sotto la principale.
 */
export function SiteHeader({
  onMenuChange,
}: {
  onMenuChange?: (open: boolean) => void;
}) {
  const { t, cycleLocale, switchLabel, nextLocaleName } = useLanguage();
  const home = useIsHome();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (open: boolean) => {
    setMenuOpen(open);
    onMenuChange?.(open);
  };

  /* Senza motore di prenotazione il bottone porta ai contatti: in homepage
     è un'ancora, dalle pagine interne torna alla homepage. */
  const ctaHref = bookingUrl ?? (home ? "#contatti" : "/#contatti");
  const ctaLabel = t(site.booking?.label ?? site.headerCta);

  return (
    <>
      <header className="site-header">
        <Brand />

        <nav className="desktop-nav">
          {site.nav.map((item, index) => {
            const href = navHref(item, home);
            const label = t(item.label);
            if (!item.children?.length) {
              return href ? (
                <SmartLink key={index} href={href}>
                  {label}
                </SmartLink>
              ) : null;
            }
            return (
              <div className="nav-group" key={index}>
                {href ? (
                  <SmartLink href={href} className="nav-parent">
                    {label}
                  </SmartLink>
                ) : (
                  <button type="button" className="nav-parent">
                    {label}
                  </button>
                )}
                <div className="nav-dropdown">
                  {item.children.map((child, childIndex) => {
                    const childHref = navHref(child, home);
                    return childHref ? (
                      <SmartLink key={childIndex} href={childHref}>
                        {t(child.label)}
                      </SmartLink>
                    ) : null;
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="header-actions">
          <button className="lang" onClick={cycleLocale}>
            {switchLabel}
          </button>
          {/* Con un motore di prenotazione esterno il bottone ci porta
              direttamente; senza, resta un collegamento ai contatti. */}
          <SmartLink className="header-cta" href={ctaHref}>
            {ctaLabel}
          </SmartLink>
          <button
            className={`menu-button ${menuOpen ? "open" : ""}`}
            onClick={() => toggleMenu(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="mobile-nav">
          {site.nav.map((item, index) => {
            const href = navHref(item, home);
            return (
              <div className="mobile-nav-group" key={index}>
                {href ? (
                  <SmartLink href={href} onClick={() => toggleMenu(false)}>
                    {t(item.label)}
                  </SmartLink>
                ) : (
                  <span className="mobile-nav-heading">{t(item.label)}</span>
                )}
                {item.children?.map((child, childIndex) => {
                  const childHref = navHref(child, home);
                  return childHref ? (
                    <SmartLink
                      key={childIndex}
                      href={childHref}
                      className="mobile-nav-child"
                      onClick={() => toggleMenu(false)}
                    >
                      {t(child.label)}
                    </SmartLink>
                  ) : null;
                })}
              </div>
            );
          })}
          <button onClick={cycleLocale}>{nextLocaleName}</button>
          <SmartLink href={ctaHref} onClick={() => toggleMenu(false)}>
            {ctaLabel}
          </SmartLink>
        </nav>
      )}
    </>
  );
}
