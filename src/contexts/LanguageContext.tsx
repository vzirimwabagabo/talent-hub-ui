
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  languages: string[];
  setLanguage: (language: string) => void;
  setLanguages: (languages: string[]) => void;
  addLanguage: (language: string) => void;
  removeLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const getStoredLanguages = () => {
    try {
      const stored = localStorage.getItem('app_languages');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore invalid data and fall back to single language value
    }

    const single = localStorage.getItem('app_language');
    return single ? [single] : ['en'];
  };

  const [languages, setLanguagesState] = useState<string[]>(() => getStoredLanguages());

  useEffect(() => {
    const normalized = [...new Set(languages.filter(Boolean))];
    if (normalized.length === 0) {
      setLanguagesState(['en']);
      return;
    }

    localStorage.setItem('app_languages', JSON.stringify(normalized));
    localStorage.setItem('app_language', normalized[0]);
  }, [languages]);

  const setLanguage = (newLanguage: string) => {
    const normalized = newLanguage ? [newLanguage] : ['en'];
    setLanguagesState(normalized);
  };

  const setLanguages = (nextLanguages: string[]) => {
    const normalized = [...new Set((nextLanguages || []).filter(Boolean))];
    setLanguagesState(normalized.length > 0 ? normalized : ['en']);
  };

  const addLanguage = (languageCode: string) => {
    if (!languageCode) return;
    setLanguagesState((current) => [...new Set([...current, languageCode])]);
  };

  const removeLanguage = (languageCode: string) => {
    if (!languageCode) return;
    setLanguagesState((current) => {
      const next = current.filter((item) => item !== languageCode);
      return next.length > 0 ? next : ['en'];
    });
  };

  const language = languages[0] || 'en';

  return (
    <LanguageContext.Provider value={{ language, languages, setLanguage, setLanguages, addLanguage, removeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
