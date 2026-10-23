"use client";

import { useEffect, useRef, useState } from "react";
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
 *
 * Quando si è scesi oltre l'header e si torna a scorrere verso l'alto,
 * l'header ricompare fissato in cima alla finestra; scendendo si nasconde di
 * nuovo. Mentre è fissato, un segnaposto della sua altezza tiene il posto
 * nella pagina, così il contenuto non salta.
 */

type HeaderMode = "static" | "shown" | "hidden";
export function SiteHeader({
  onMenuChange,
}: {
  onMenuChange?: (open: boolean) => void;
}) {
  const { t, cycleLocale, switchLabel, nextLocaleName } = useLanguage();
  const home = useIsHome();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<HeaderMode>("static");
  const [height, setHeight] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const header = headerRef.current;
      /* Il limite è il fondo dell'header nella sua posizione naturale. */
      const limit = header?.parentElement
        ? header.parentElement.offsetTop + (header.offsetHeight || 80)
        : 80;
      if (y <= limit) {
        setMode("static");
      } else if (y < lastY - 4) {
        setMode("shown");
      } else if (y > lastY + 4) {
        setMode("hidden");
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => setHeight(headerRef.current?.offsetHeight ?? 0);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* Con il menù mobile aperto l'header resta sempre visibile. */
  const floating = mode !== "static";
  const headerClass = [
    "site-header",
    floating ? "is-floating" : "",
    mode === "shown" || (floating && menuOpen) ? "is-shown" : "",
  ]
    .filter(Boolean)
    .join(" ");

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
      <div
        className="site-header-slot"
        style={floating ? { height } : undefined}
      >
        <header className={headerClass} ref={headerRef}>
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
      </div>

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
