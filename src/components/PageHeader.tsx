import type { ReactNode } from 'react'

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div className="max-w-4xl">
        {eyebrow && <span className="inline-flex text-[10px] font-extrabold uppercase tracking-[.15em] text-teal-700">{eyebrow}</span>}
        <h1 className="mt-3 font-['Manrope'] text-3xl font-extrabold tracking-[-.045em] text-slate-950 sm:text-4xl lg:text-[46px] lg:leading-[1.02]">{title}</h1>
        {description && <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}
