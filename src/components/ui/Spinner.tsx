import { useLanguage } from '../../context/LanguageContext'
import { LoaderCircle } from 'lucide-react';
import { cn } from '../../lib/cn';
export function Spinner({ className }: {
    className?: string;
}) {
    const { t } = useLanguage();
    return <LoaderCircle className={cn('animate-spin text-teal-600', className)} aria-label={t("Loading")}/>;
}
