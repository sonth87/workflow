/**
 * Translation Registry
 * Centralized registry for managing translations across all languages
 * Supports both inline objects and dynamic URL loading
 */

export interface TranslationData {
  [key: string]: string;
}

export interface TranslationStorage {
  [language: string]: TranslationData;
}

/**
 * Global Translation Registry
 * Singleton pattern to ensure single source of truth for translations
 */
class TranslationRegistryClass {
  private translations: TranslationStorage = {};
  private loadedLanguages: Set<string> = new Set();

  /**
   * Register translations for a specific language
   * @param language - Language code (e.g., "en", "vi", "ko")
   * @param translations - Translation key-value pairs
   */
  register(language: string, translations: TranslationData): void {
    if (!this.translations[language]) {
      this.translations[language] = {};
    }

    // Merge with existing translations (new translations override old ones)
    this.translations[language] = {
      ...this.translations[language],
      ...translations,
    };

    this.loadedLanguages.add(language);
    console.log(
      `[TranslationRegistry] Registered ${Object.keys(translations).length} translations for "${language}"`
    );
  }

  /**
   * Get translation for a specific key and language
   * @param key - Translation key (e.g., "sendEmailTask.name")
   * @param language - Language code
   * @returns Translated string or undefined if not found
   */
  get(key: string, language: string): string | undefined {
    return this.translations[language]?.[key];
  }

  /**
   * Helper to translate or return original key
   */
  translate(key: string, language: string): string {
    return this.get(key, language) || key;
  }

  /**
   * Get all translations for a specific language
   * @param language - Language code
   * @returns All translations for that language
   */
  getAll(language: string): TranslationData {
    return this.translations[language] || {};
  }

  /**
   * Check if a language has been loaded
   * @param language - Language code
   * @returns True if translations exist for this language
   */
  hasLanguage(language: string): boolean {
    return this.loadedLanguages.has(language);
  }

  /**
   * Get list of all loaded languages
   * @returns Array of language codes
   */
  getLoadedLanguages(): string[] {
    return Array.from(this.loadedLanguages);
  }

  /**
   * Load translations from a URL
   * @param url - URL to JSON file containing translations
   * @param language - Optional language code (extracted from URL if not provided)
   * @returns Promise resolving to loaded translations
   */
  async loadFromUrl(url: string, language?: string): Promise<TranslationData> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract language from URL if not provided (e.g., "/translations/vi.json" → "vi")
      const detectedLang = language || this.extractLanguageFromUrl(url);

      if (!detectedLang) {
        throw new Error(
          "Could not determine language. Please provide language code explicitly."
        );
      }

      this.register(detectedLang, data);
      return data;
    } catch (error) {
      console.error(`[TranslationRegistry] Error loading from URL:`, error);
      throw error;
    }
  }

  /**
   * Load translations from an object
   * @param language - Language code
   * @param translations - Translation object
   */
  loadFromObject(language: string, translations: TranslationData): void {
    this.register(language, translations);
  }

  /**
   * Extract language code from URL
   * Supports patterns like: "/translations/en.json", "/locales/vi.json"
   * @param url - URL string
   * @returns Extracted language code or null
   */
  private extractLanguageFromUrl(url: string): string | null {
    // Match pattern: /word-chars.json at end of URL
    const match = url.match(/\/([a-z]{2,3})\.json$/i);
    return match ? match[1].toLowerCase() : null;
  }

  /**
   * Clear all translations (useful for testing)
   */
  clear(): void {
    this.translations = {};
    this.loadedLanguages.clear();
    console.log("[TranslationRegistry] Cleared all translations");
  }

  /**
   * Clear translations for a specific language
   * @param language - Language code to clear
   */
  clearLanguage(language: string): void {
    delete this.translations[language];
    this.loadedLanguages.delete(language);
    console.log(`[TranslationRegistry] Cleared translations for "${language}"`);
  }

  /**
   * Get all registered translation keys for a language
   * Useful for debugging and validation
   * @param language - Language code
   * @returns Array of translation keys
   */
  getKeys(language: string): string[] {
    return Object.keys(this.translations[language] || {});
  }

  /**
   * Check if a specific key exists for a language
   * @param key - Translation key
   * @param language - Language code
   * @returns True if key exists
   */
  hasKey(key: string, language: string): boolean {
    return key in (this.translations[language] || {});
  }
}

// Export singleton instance
export const translationRegistry = new TranslationRegistryClass();

// Make globally accessible for SDK usage
if (typeof window !== "undefined") {
  (window as any).__BPM_TRANSLATION_REGISTRY__ = translationRegistry;
}

// Global type augmentation
declare global {
  interface Window {
    __BPM_TRANSLATION_REGISTRY__?: TranslationRegistryClass;
  }
}
