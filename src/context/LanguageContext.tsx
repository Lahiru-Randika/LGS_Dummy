import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { translateText } from '../i18n'
import { text } from '../i18n/text'
import { isPreservedEntity } from '../i18n/preserved'

export type Language = 'en' | 'si'
type LanguageValue = { language: Language; setLanguage: (value: Language) => void; toggleLanguage: () => void; t: (value: string) => string }
const LanguageContext = createContext<LanguageValue | null>(null)
const STORAGE_KEY = 'lgs_language'
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'si' ? 'si' : 'en' } catch { return 'en' }
  })
  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* private mode */ }
  }, [])
  const toggleLanguage = useCallback(() => setLanguage(language === 'en' ? 'si' : 'en'), [language, setLanguage])
  const t = useCallback((value: string): string => {
    if (language === 'en' || isPreservedEntity(value)) return value
    const entry = (text as Record<string, {english: string; sinhala: string}>)[value]
    if (entry) return entry.sinhala
    return translateText(value, language)
  }, [language])
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dataset.language = language
  }, [language])
  const state = useMemo(() => ({ language, setLanguage, toggleLanguage, t }), [language, setLanguage, toggleLanguage, t])
  return <LanguageContext.Provider value={state}>{children}</LanguageContext.Provider>
}
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
