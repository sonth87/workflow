/**
 * BPM Core i18n Configuration
 *
 * Export translations and utilities for external projects to integrate with custom language support
 */

export { LanguageProvider, type LanguageType } from "./context/LanguageContext";
export { useLanguage } from "./hooks/useLanguage";
export { useAvailableLanguages } from "./hooks/useAvailableLanguages";
