import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Brand } from './Brand';
import { useLanguage } from '../context/LanguageContext';
export function PublicHeader({ overlay = false }: {
    overlay?: boolean;
}) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const {  language, toggleLanguage, t  } = useLanguage();
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 36);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const close = () => setOpen(false);
    return (<header className={`public-header ${overlay ? 'public-header--overlay' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="public-header__inner">
        <Brand light={overlay && !scrolled}/>
        <nav className={`public-site-nav ${open ? 'is-open' : ''}`} aria-label={t("Public navigation")}>
          <NavLink to="/" end onClick={close}>{t('Home')}</NavLink>
          <NavLink to="/about" onClick={close}>{t('About')}</NavLink>
          <NavLink to="/services" onClick={close}>{t('Services')}</NavLink>
          {/* <NavLink to="/news" onClick={close}>News</NavLink> */}
          <NavLink to="/contact" onClick={close}>{t('Contact')}</NavLink>
        </nav>
        <div className="public-header__actions">
          <button type="button" className="language-toggle" onClick={toggleLanguage} aria-label={t("Change language")} title={t("Change language")}>
            <span className={language === 'en' ? 'is-active' : ''}>{t("EN")}</span><span aria-hidden="true">/</span><span className={language === 'si' ? 'is-active' : ''}>සිං</span>
          </button>
          <Link className="public-header__map" to="/map">{t('Explore map')}</Link>
          <Link className="public-header__signin" to="/login">{t('Sign in')}</Link>
          <button className="public-header__menu" onClick={() => setOpen((v) => !v)} aria-label={t("Toggle menu")}>
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>
    </header>);
}
