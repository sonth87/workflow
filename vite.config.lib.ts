import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "BPMCore",
      fileName: format => `bpm-core.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // External dependencies - không bundle vào library
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@xyflow/react",
        "@sth87/shadcn-design-system",
        "zustand",
        "zod",
        "react-hook-form",
        "@hookform/resolvers",
        "lucide-react",
        "tailwindcss",
        "dayjs",
        "lodash",
        "dagre",
        "d3-drag",
        "d3-selection",
        "react-markdown",
        "remark-gfm",
        "remark-breaks",
        "usehooks-ts",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "@xyflow/react": "XYFlow",
        },
        // Preserve CSS imports
        assetFileNames: assetInfo => {
          if (assetInfo.name === "style.css") return "bpm-core.css";
          return assetInfo.name || "asset";
        },
      },
    },
    outDir: "lib-dist",
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
  },
});
