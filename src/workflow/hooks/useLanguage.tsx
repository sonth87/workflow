import type { MultilingualTextType } from "@/types/dynamic-bpm.type";
import { useLanguageContext } from "@/workflow/context/LanguageContext";
import { useCallback } from "react";
import { translationRegistry } from "@/core/registry/TranslationRegistry";

export const useLanguage = () => {
  const { language, setLanguage } = useLanguageContext();

  const getText = useCallback(
    (text?: MultilingualTextType | string): string => {
      if (!text) return "";

      // If text is a string, check if it's a translation key or plain text
      if (typeof text === "string") {
        // Check if it's a translation key (contains "." and not a URL)
        // URLs must have "://" to be considered URLs (http://, https://, etc.)
        if (text.includes(".") && !text.includes("://")) {
          // Try to resolve from TranslationRegistry
          if (
            typeof window !== "undefined" &&
            window.__BPM_TRANSLATION_REGISTRY__
          ) {
            const registry = window.__BPM_TRANSLATION_REGISTRY__;

            // Try current language
            const translation = registry.get(text, language);
            if (translation) {
              return translation;
            }

            // Fallback to English
            if (language !== "en") {
              const enTranslation = registry.get(text, "en");
              if (enTranslation) {
                return enTranslation;
              }
            }
          }
        }

        // Return as plain text if not found in registry
        return text;
      }

      // If text is an object, get value by current language
      // Fallback to English ("en") if current language is not available
      // Then fallback to the first available language
      if (typeof text === "object" && text !== null) {
        const langValue = text[language];
        if (langValue !== null && langValue !== undefined) {
          return langValue.toString();
        }

        // Fallback to English
        if (language !== "en") {
          const enValue = text["en"];
          if (enValue !== null && enValue !== undefined) {
            return enValue.toString();
          }
        }

        // Fallback to first available language
        const firstAvailable = Object.values(text).find(
          v => v !== null && v !== undefined
        );
        if (firstAvailable) {
          return firstAvailable.toString();
        }
      }

      return "";
    },
    [language]
  );

  /**
   * Get UI text from translations dictionary
   * Supports flat keys with 'ui.' prefix and template variables
   *
   * @example
   * const title = getUIText("ui.toolbar.zoomIn");
   * const msg = getUIText("ui.run.cannotRunWorkflow", { count: 5 });
   */
  const getUIText = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      try {
        // Get from TranslationRegistry (flat format)
        const translatedText = translationRegistry.get(path, language);

        if (!translatedText) {
          console.warn(`Translation key not found: ${path}`);
          return "";
        }

        // Replace template variables if provided
        if (params) {
          let result = translatedText;
          Object.entries(params).forEach(([key, val]) => {
            result = result.replace(
              new RegExp(`\\{${key}\\}`, "g"),
              String(val)
            );
          });
          return result;
        }

        return translatedText;
      } catch (error) {
        console.warn(`Failed to get UI text for path: ${path}`, error);
        return "";
      }
    },
    [language]
  );

  return { getText, getUIText, setLanguage, currentLanguage: language };
};
