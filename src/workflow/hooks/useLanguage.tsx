import type { MultilingualTextType } from "@/types/dynamic-bpm.type";
import { useLanguageContext } from "@/workflow/context/LanguageContext";
import { useCallback } from "react";

export const useLanguage = () => {
  const { language, setLanguage, uiTranslations } = useLanguageContext();

  const getText = useCallback(
    (text?: MultilingualTextType | string): string => {
      if (!text) return "";

      // If text is a string, return it as is
      if (typeof text === "string") {
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
   * Supports nested keys like "toolbar.zoomIn"
   * and template variables like "error: {count}"
   *
   * @example
   * const title = getUIText("toolbar.zoomIn");
   * const msg = getUIText("run.cannotRunWorkflow", { count: 5 });
   */
  const getUIText = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      try {
        // Navigate nested object using dot notation
        const keys = path.split(".");
        let value: any = uiTranslations;

        for (const key of keys) {
          value = value?.[key];
        }

        // If value is multilingual object, use getText
        if (value && typeof value === "object" && !Array.isArray(value)) {
          let text = getText(value);

          // Replace template variables if provided
          if (params) {
            Object.entries(params).forEach(([key, val]) => {
              text = text.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
            });
          }

          return text;
        }

        return "";
      } catch (error) {
        console.warn(`Failed to get UI text for path: ${path}`, error);
        return "";
      }
    },
    [getText]
  );

  return { getText, getUIText, setLanguage };
};
