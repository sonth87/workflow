/**
 * useAvailableLanguages Hook
 * Auto-detect available languages from workflow data
 * Scans all nodes, categories, and properties to find all language keys
 */

import { useMemo } from "react";
import { useWorkflowStore } from "@/core/store/workflowStore";
import { nodeRegistry, categoryRegistry } from "@/core/registry";
import type { MultilingualTextType } from "@/types/dynamic-bpm.type";

/**
 * Extract language keys from a multilingual object
 */
function extractLanguagesFromText(text: any): string[] {
  if (!text || typeof text !== "object") return [];
  if (typeof text === "string") return [];

  // If it's a MultilingualTextType object with string values
  if (typeof text === "object" && !Array.isArray(text)) {
    return Object.keys(text).filter(
      key => typeof text[key] === "string" || text[key] !== null
    );
  }

  return [];
}

/**
 * Get all available languages from nodes in workflow
 */
function getLanguagesFromNodes(nodes: any[]): Set<string> {
  const languages = new Set<string>();

  nodes.forEach(node => {
    // Check node label
    if (node.data?.label) {
      extractLanguagesFromText(node.data.label).forEach(lang =>
        languages.add(lang)
      );
    }

    // Check node metadata
    if (node.data?.metadata) {
      const { title, description } = node.data.metadata;
      extractLanguagesFromText(title).forEach(lang => languages.add(lang));
      extractLanguagesFromText(description).forEach(lang =>
        languages.add(lang)
      );
    }
  });

  return languages;
}

/**
 * Get all available languages from registry data
 */
function getLanguagesFromRegistry(): Set<string> {
  const languages = new Set<string>();

  // Get from node registry
  try {
    const allNodes = nodeRegistry.getAll();
    allNodes.forEach(node => {
      extractLanguagesFromText(node.label).forEach(lang => languages.add(lang));
      extractLanguagesFromText(node.metadata?.title).forEach(lang =>
        languages.add(lang)
      );
      extractLanguagesFromText(node.metadata?.description).forEach(lang =>
        languages.add(lang)
      );
    });
  } catch (e) {
    // Registry might not be initialized yet
  }

  // Get from category registry
  try {
    const allCategories = categoryRegistry.getAll();
    allCategories.forEach(category => {
      extractLanguagesFromText(category.name).forEach(lang =>
        languages.add(lang)
      );
      extractLanguagesFromText(category.description).forEach(lang =>
        languages.add(lang)
      );
    });
  } catch (e) {
    // Registry might not be initialized yet
  }

  return languages;
}

/**
 * Hook to get all available languages
 * Ensures default languages (en, vi) are always available
 */
export function useAvailableLanguages(): string[] {
  const { nodes } = useWorkflowStore();

  const languages = useMemo(() => {
    const detected = new Set<string>();

    // Get from workflow nodes
    getLanguagesFromNodes(nodes).forEach(lang => detected.add(lang));

    // Get from registry
    getLanguagesFromRegistry().forEach(lang => detected.add(lang));

    // Always ensure default languages are available
    detected.add("en");
    detected.add("vi");

    // Convert to sorted array
    return Array.from(detected).sort();
  }, [nodes]);

  return languages;
}

/**
 * Get language labels for display
 * Maps language codes to human-readable names
 */
const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  vi: "Tiếng Việt",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  pt: "Português",
  ru: "Русский",
};

export function getLanguageLabel(code: string): string {
  return LANGUAGE_LABELS[code.toLowerCase()] || code;
}
