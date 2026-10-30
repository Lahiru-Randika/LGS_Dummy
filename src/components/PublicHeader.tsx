import { Compass, LogIn } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Brand } from './Brand';
import { useLanguage } from '../context/LanguageContext';

export function PublicHeader({ overlay = false }: {
    overlay?: boolean;
}) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 36);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Prevent body scroll and reset nav scroll when mobile drawer is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            if (navRef.current) {
                navRef.current.scrollTop = 0;
            }
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const close = () => setOpen(false);

    // Close on Escape key and on window resize to desktop
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        const onResize = () => {
            if (window.innerWidth >= 1024) close();
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
      <>
        <header className={`public-header ${overlay ? 'public-header--overlay' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
          <div className="public-header__inner">
            <Brand light={Boolean(overlay || scrolled || open)}/>

            {/* Navigation links & mobile dropdown */}
            <nav
              ref={navRef}
              className={`public-site-nav ${open ? 'is-open' : ''}`}
              aria-label={t("Public navigation")}
            >
              <div className="public-site-nav__links">
                {[
                  { to: '/', label: t('Home'), end: true },
                  { to: '/about', label: t('About'), end: false },
                  { to: '/services', label: t('Services'), end: false },
                  { to: '/contact', label: t('Contact'), end: false },
                ].map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={close}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>

              {/* Mobile-only action items inside the drawer */}
              <div className="public-site-nav__mobile-actions">
                <Link
                  className="public-site-nav__mobile-btn public-site-nav__mobile-btn--map"
                  to="/map"
                  onClick={close}
                >
                  <Compass size={17} />
                  <span>{t('Explore map')}</span>
                </Link>
                <Link
                  className="public-site-nav__mobile-btn public-site-nav__mobile-btn--signin"
                  to="/login"
                  onClick={close}
                >
                  <LogIn size={17} />
                  <span>{t('Sign in')}</span>
                </Link>
                {/* Language toggle (Sinhala / English) - hidden until proofreading is complete
                <div className="public-site-nav__mobile-lang">
                  <span className="text-[11px] font-semibold text-slate-400">{t('Language')}:</span>
                  <button type="button" className="language-toggle" onClick={toggleLanguage} aria-label={t("Change language")} title={t("Change language")}>
                    <span className={language === 'en' ? 'is-active' : ''}>{t("EN")}</span>
                    <span aria-hidden="true">/</span>
                    <span className={language === 'si' ? 'is-active' : ''}>සිං</span>
                  </button>
                </div>
                */}
              </div>
            </nav>

            <div className="public-header__actions">
              {/* Language toggle (Sinhala / English) - hidden until proofreading is complete
              <button type="button" className="language-toggle" onClick={toggleLanguage} aria-label={t("Change language")} title={t("Change language")}>
                <span className={language === 'en' ? 'is-active' : ''}>{t("EN")}</span>
                <span aria-hidden="true">/</span>
                <span className={language === 'si' ? 'is-active' : ''}>සිං</span>
              </button>
              */}
              <Link className="public-header__map" to="/map">{t('Explore map')}</Link>
              <Link className="public-header__signin" to="/login">{t('Sign in')}</Link>

              {/* CodePen-style square toggle button with 405deg spinning lines */}
              <button
                type="button"
                className={`public-header__menu ${open ? 'is-open' : ''}`}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? t("Close menu") : t("Toggle menu")}
                aria-expanded={open}
              >
                <div className="public-header__menu-icon">
                  <span />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Backdrop Scrim */}
        <div
          className={`fixed inset-0 z-[4998] bg-[#030a12]/60 backdrop-blur-sm transition-opacity duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] lg:hidden ${
            open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={close}
          aria-hidden="true"
        />
      </>
    );
}
