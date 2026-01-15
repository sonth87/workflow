/**
 * Language Context
 * Manages global language state for dynamic i18n support
 *
 * Supports custom translations for external project integration:
 * ```
 * import { DEFAULT_UI_TRANSLATIONS, UITranslations } from 'bpm-core/translations'
 *
 * const customTranslations: UITranslations = {
 *   ...DEFAULT_UI_TRANSLATIONS,
 *   toolbar: { ...DEFAULT_UI_TRANSLATIONS.toolbar, ... }
 * }
 *
 * <LanguageProvider
 *   defaultLanguage="en"
 *   uiTranslations={customTranslations}
 * >
 * ```
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  DEFAULT_UI_TRANSLATIONS,
  type UITranslations,
} from "../translations/ui.translations";

// Support any language dynamically - not limited to en/vi
export type LanguageType = string;

interface LanguageContextValue {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  uiTranslations: UITranslations;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguageContext must be used within LanguageProvider");
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: LanguageType;
  uiTranslations?: UITranslations;
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  uiTranslations = DEFAULT_UI_TRANSLATIONS,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bpm-language") as LanguageType;
      return stored || defaultLanguage;
    }
    return defaultLanguage;
  });

  const setLanguage = useCallback((newLanguage: LanguageType) => {
    if (newLanguage && typeof newLanguage === "string" && newLanguage.trim()) {
      setLanguageState(newLanguage);
      if (typeof window !== "undefined") {
        localStorage.setItem("bpm-language", newLanguage);
      }
    }
  }, []);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    uiTranslations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
