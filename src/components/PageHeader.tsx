import type { ReactNode } from 'react'
import { useLanguage } from '../context/LanguageContext'

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  const { t } = useLanguage()
  return (
    <header className="page-header">
      <div>
        {eyebrow && <span className="eyebrow">{t(eyebrow)}</span>}
        <h1>{t(title)}</h1>
        {description && <p>{t(description)}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  )
}
