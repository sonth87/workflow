/**
 * Centralized localStorage management for BPM Core
 * All application settings are stored in a single object
 */

// Main storage key for the entire application
export const BPM_STORAGE_KEY = "bpm-core-settings";

// Type definition for all settings
export interface BPMSettings {
  language?: string;
  theme?: string;
  propertyPanelWidth?: number;
  ai?: {
    apiKey?: string;
    provider?: string;
  };
}

/**
 * Get the entire settings object from localStorage
 */
function getSettings(): BPMSettings {
  try {
    const stored = localStorage.getItem(BPM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load BPM settings from localStorage:", error);
  }
  return {};
}

/**
 * Save the entire settings object to localStorage
 */
function saveSettings(settings: BPMSettings): void {
  try {
    localStorage.setItem(BPM_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("Failed to save BPM settings to localStorage:", error);
  }
}

/**
 * Get a specific setting value
 */
export function getSetting<K extends keyof BPMSettings>(
  key: K
): BPMSettings[K] | undefined {
  const settings = getSettings();
  return settings[key];
}

/**
 * Set a specific setting value
 */
export function setSetting<K extends keyof BPMSettings>(
  key: K,
  value: BPMSettings[K]
): void {
  const settings = getSettings();
  settings[key] = value;
  saveSettings(settings);
}

/**
 * Remove a specific setting
 */
export function removeSetting<K extends keyof BPMSettings>(key: K): void {
  const settings = getSettings();
  delete settings[key];
  saveSettings(settings);
}

/**
 * Clear all settings
 */
export function clearSettings(): void {
  try {
    localStorage.removeItem(BPM_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear BPM settings from localStorage:", error);
  }
}

/**
 * Get nested setting value (for objects like ai.apiKey)
 */
export function getNestedSetting<T = any>(path: string): T | undefined {
  const settings = getSettings();
  const keys = path.split(".");
  let value: any = settings;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value as T;
}

/**
 * Set nested setting value (for objects like ai.apiKey)
 */
export function setNestedSetting(path: string, value: any): void {
  const settings = getSettings();
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  let current: any = settings;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
  saveSettings(settings);
}
