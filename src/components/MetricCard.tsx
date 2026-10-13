import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export function MetricCard({ icon: Icon, label, value, note, tone = 'plain' }: { icon: LucideIcon; label: string; value: string | number; note?: string; tone?: 'plain' | 'dark' | 'mint' }) {
  const { t } = useLanguage()
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-card__top"><span>{t(label)}</span><span className="metric-card__icon"><Icon size={18} /></span></div>
      <strong>{value}</strong>
      {note && <p>{t(note)}</p>}
    </article>
  )
}
