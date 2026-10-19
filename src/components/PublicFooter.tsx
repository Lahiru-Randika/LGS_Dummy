import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Brand } from './Brand';
import { useLanguage } from '../context/LanguageContext';
export function PublicFooter() {
    const {  t  } = useLanguage();
    const link = 'text-[12px] font-semibold text-slate-400 transition hover:text-white';
    return (<footer className="bg-[#071522] text-white">
      <div className="mx-auto grid w-[min(1500px,calc(100%-80px))] 3xl:w-[min(1820px,calc(100%-120px))] 4k:w-[min(2360px,calc(100%-160px))] grid-cols-[1.6fr_.75fr_.75fr_1.15fr] gap-14 py-16 max-[1100px]:grid-cols-[1.5fr_1fr_1fr] max-[780px]:w-[calc(100%-32px)] max-[780px]:grid-cols-2 max-[480px]:grid-cols-1 max-[400px]:w-[calc(100%-20px)]">
        <div className="max-[780px]:col-span-2 max-[480px]:col-span-1"><Brand light/><p className="mt-6 max-w-md text-[13px] leading-7 text-slate-400">{t('Location intelligence for more responsive, informed, and coordinated local government.')}</p></div>
        <div className="flex flex-col gap-3"><strong className="mb-1 text-[10px] uppercase tracking-[.15em]">{t('Explore')}</strong><Link className={link} to="/map">{t('Municipal map')}</Link><Link className={link} to="/services">{t('Services')}</Link><Link className={link} to="/news">{t('Notices & news')}</Link></div>
        <div className="flex flex-col gap-3"><strong className="mb-1 text-[10px] uppercase tracking-[.15em]">{t("LGS")}</strong><Link className={link} to="/about">{t('About')}</Link><Link className={link} to="/contact">{t('Contact')}</Link><Link className={link} to="/contact">{t('Request a Demo')}</Link></div>
        <div className="flex flex-col gap-3 max-[1100px]:col-start-2 max-[1100px]:col-end-4 max-[780px]:col-span-2 max-[480px]:col-span-1"><strong className="mb-1 text-[10px] uppercase tracking-[.15em]">{t('Connect')}</strong><span className="flex items-center gap-2 text-[12px] text-slate-400"><MapPin size={15}/>{t("Weddemulla, Sri Lanka")}</span><span className="flex items-center gap-2 text-[12px] text-slate-400"><Phone size={15}/> +94 11 000 0000</span><span className="flex items-center gap-2 text-[12px] text-slate-400"><Mail size={15}/>{t("hello@lgs.example")}</span></div>
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex min-h-20 w-[min(1500px,calc(100%-80px))] 3xl:w-[min(1820px,calc(100%-120px))] 4k:w-[min(2360px,calc(100%-160px))] items-center justify-between gap-5 text-[10px] font-bold uppercase tracking-[.1em] text-slate-500 max-[780px]:w-[calc(100%-32px)] max-[780px]:flex-col max-[780px]:items-start max-[780px]:justify-center max-[400px]:w-[calc(100%-20px)]"><span>{t("\u00A9 2026 LGS \u2014 Local Government Systems")}</span><Link className="flex items-center gap-2 text-slate-300 hover:text-white" to="/map">{t('Open civic map')} <ArrowUpRight size={14}/></Link></div></div>
    </footer>);
}
