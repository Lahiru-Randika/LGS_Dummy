import { useLanguage } from '../context/LanguageContext'
import { Link } from 'react-router-dom';
export function Brand({ compact = false, }: {
    compact?: boolean;
    light?: boolean;
}) {
    const { t } = useLanguage();
    return (<Link to="/" aria-label={t("SPATIO LGS home")} className="inline-flex items-center">
      <img src="/logos/logo white.png" alt={t("SPATIO LGS")} className={compact
            ? `
                !block
                !h-[34px]
                !w-auto
                !max-h-[34px]
                !max-w-[125px]
                !object-contain
              `
            : `
                !block
                !h-[46px]
                !w-auto
                !max-h-[46px]
                !max-w-[180px]
                !object-contain
              `}/>
    </Link>);
}
