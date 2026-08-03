import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { translations } from '../mock/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('cl_language') || 'English')

  const setAndPersistLanguage = useCallback((lang) => {
    localStorage.setItem('cl_language', lang)
    setLanguage(lang)
  }, [])

  const t = useMemo(() => {
    const dict = translations[language] ?? translations.English
    return (key) => dict[key] ?? translations.English[key] ?? key
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setAndPersistLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
