import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "*.lock", "*.lock.yaml"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
    },
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "warn",

      // General rules
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "no-debugger": "warn",
      "prefer-const": "error",
      "no-var": "error",

      // React specific
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-refresh/only-export-components": "warn",
    },
  },
]);
