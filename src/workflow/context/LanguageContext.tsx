/**
 * Language Context
 * Manages global language state for dynamic i18n support
 *
 * All UI translations use flat key-based format via TranslationRegistry.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { getSetting, setSetting } from "@/utils/storage";

// Support any language dynamically - not limited to en/vi
export type LanguageType = string;

interface LanguageContextValue {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
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
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const stored = getSetting("language") as LanguageType;
      return stored || defaultLanguage;
    }
    return defaultLanguage;
  });

  const setLanguage = useCallback((newLanguage: LanguageType) => {
    if (newLanguage && typeof newLanguage === "string" && newLanguage.trim()) {
      setLanguageState(newLanguage);
      if (typeof window !== "undefined") {
        setSetting("language", newLanguage);
      }
    }
  }, []);

  const value: LanguageContextValue = {
    language,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
