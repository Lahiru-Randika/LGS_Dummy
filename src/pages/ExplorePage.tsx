import { useLanguage } from '../context/LanguageContext'
import { ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Brand } from '../components/Brand';
import { CivicMap } from '../components/CivicMap';
export function ExplorePage() {
    const { t } = useLanguage();
    return <div className="explore-page"><header className="explore-topbar"><Brand /><div><span>{t("Public map")}</span><Link className="ghost-btn" to="/"><span className="desktop-only">{t("About LGS")}</span></Link><Link className="primary-btn" to="/login"><LogIn size={16}/>{t("Sign in")}</Link></div></header><div className="explore-map"><CivicMap /></div><div className="public-map-prompt"><span>{t("Want to report an issue here?")}</span><Link to="/login">{t("Sign in to create a request")}<ArrowRight size={15}/></Link></div></div>;
}
