import type { Plugin } from "@/core/plugins/PluginManager";
import { defaultNodes } from "./nodes";
import { defaultEdges } from "./edges";
import { defaultRules } from "./rules";
import { defaultThemes } from "./themes";
import { defaultCategories } from "./categories";
import { defaultContextMenus } from "./menus";

// Import plugin translations
import pluginTranslationsEn from "@/translations/plugins.en.json";
import pluginTranslationsVi from "@/translations/plugins.vi.json";

export const defaultBpmPlugin: Plugin = {
  metadata: {
    id: "default-bpm-plugin",
    name: "Default BPM Plugin",
    version: "1.1.0",
    description: "Modular Default BPMN 2.0 nodes, edges, and rules",
    author: "BPM Core Team",
  },
  config: {
    nodes: defaultNodes,
    edges: defaultEdges,
    rules: defaultRules,
    themes: defaultThemes,
    categories: defaultCategories,
    contextMenus: defaultContextMenus,
    translations: {
      en: pluginTranslationsEn as Record<string, string>,
      vi: pluginTranslationsVi as Record<string, string>,
    },
  },
  async initialize() {
    console.log("Default BPM Plugin (Modular) initialized");
  },
};

export default defaultBpmPlugin;
