import { Compass, LogIn, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Brand } from './Brand';
import { useLanguage } from '../context/LanguageContext';

export function PublicHeader({ overlay = false }: {
    overlay?: boolean;
}) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 36);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Prevent body scroll when mobile drawer is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // Close on Escape key and on window resize to desktop
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        const onResize = () => {
            if (window.innerWidth >= 1024) setOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    const close = () => setOpen(false);

    return (
      <>
        <header className={`public-header ${overlay ? 'public-header--overlay' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
          <div className="public-header__inner">
            <Brand light={overlay && !scrolled}/>

            <nav className={`public-site-nav ${open ? 'is-open' : ''}`} aria-label={t("Public navigation")}>
              <div className="public-site-nav__links">
                <NavLink to="/" end onClick={close}>{t('Home')}</NavLink>
                <NavLink to="/about" onClick={close}>{t('About')}</NavLink>
                <NavLink to="/services" onClick={close}>{t('Services')}</NavLink>
                {/* <NavLink to="/news" onClick={close}>News</NavLink> */}
                <NavLink to="/contact" onClick={close}>{t('Contact')}</NavLink>
              </div>

              {/* Mobile-only action items inside the drawer */}
              <div className="public-site-nav__mobile-actions">
                <Link className="public-site-nav__mobile-btn public-site-nav__mobile-btn--map" to="/map" onClick={close}>
                  <Compass size={17} />
                  <span>{t('Explore map')}</span>
                </Link>
                <Link className="public-site-nav__mobile-btn public-site-nav__mobile-btn--signin" to="/login" onClick={close}>
                  <LogIn size={17} />
                  <span>{t('Sign in')}</span>
                </Link>
                <div className="public-site-nav__mobile-lang">
                  <span className="text-[11px] font-semibold text-slate-400">{t('Language')}:</span>
                  <button type="button" className="language-toggle" onClick={toggleLanguage} aria-label={t("Change language")} title={t("Change language")}>
                    <span className={language === 'en' ? 'is-active' : ''}>{t("EN")}</span>
                    <span aria-hidden="true">/</span>
                    <span className={language === 'si' ? 'is-active' : ''}>සිං</span>
                  </button>
                </div>
              </div>
            </nav>

            <div className="public-header__actions">
              <button type="button" className="language-toggle" onClick={toggleLanguage} aria-label={t("Change language")} title={t("Change language")}>
                <span className={language === 'en' ? 'is-active' : ''}>{t("EN")}</span>
                <span aria-hidden="true">/</span>
                <span className={language === 'si' ? 'is-active' : ''}>සිං</span>
              </button>
              <Link className="public-header__map" to="/map">{t('Explore map')}</Link>
              <Link className="public-header__signin" to="/login">{t('Sign in')}</Link>
              <button className="public-header__menu" onClick={() => setOpen((v) => !v)} aria-label={open ? t("Close menu") : t("Toggle menu")} aria-expanded={open}>
                {open ? <X size={22}/> : <Menu size={22}/>}
              </button>
            </div>
          </div>
        </header>

        {open && (
          <div
            className="public-mobile-scrim"
            onClick={close}
            aria-hidden="true"
          />
        )}
      </>
    );
}
