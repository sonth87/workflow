import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Build mode: single file hoặc split chunks
const shouldSplitChunks = false; // process.env.SPLIT_CHUNKS !== "false";

console.log(
  `🔧 Build mode: ${shouldSplitChunks ? "Split Chunks" : "Single File"}`
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  build: {
    outDir: "sdk-dist",
    emptyOutDir: true,
    minify: shouldSplitChunks ? "esbuild" : undefined,
    target: shouldSplitChunks ? "es2015" : undefined,
    rollupOptions: {
      // External dependencies - load từ CDN
      external: shouldSplitChunks
        ? ["react", "react-dom", "react/jsx-runtime", "@xyflow/react"]
        : undefined,
      treeshake: {
        moduleSideEffects: "no-external",
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      input: {
        main: path.resolve(__dirname, "../src/sdk-entry.tsx"),
      },
      output: {
        format: shouldSplitChunks ? "es" : undefined, // iife
        entryFileNames: "js/[name].[hash].js",
        chunkFileNames: "js/[name].[hash].js",
        assetFileNames: assetInfo => {
          if (assetInfo.name?.endsWith(".css")) {
            return "css/[name].[hash][extname]";
          }
          if (/\.(png|jpe?g|svg|gif|webp|ico)$/i.test(assetInfo.name || "")) {
            return "assets/images/[name].[hash][extname]";
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || "")) {
            return "assets/fonts/[name].[hash][extname]";
          }
          return "assets/[name].[hash][extname]";
        },
        // Chỉ split chunks khi SPLIT_CHUNKS=true
        manualChunks: shouldSplitChunks
          ? id => {
              // React và React DOM
              if (
                id.includes("node_modules/react/") ||
                id.includes("node_modules/react-dom/")
              ) {
                return "vendor-react";
              }

              // XYFlow
              if (id.includes("node_modules/@xyflow/")) {
                return "vendor-xyflow";
              }

              // Các thư viện UI (shadcn, radix-ui)
              if (
                id.includes("node_modules/@radix-ui/") ||
                id.includes("node_modules/@sth87/shadcn-design-system")
              ) {
                return "vendor-ui";
              }

              // Zustand và state management
              if (
                id.includes("node_modules/zustand/") ||
                id.includes("node_modules/immer/")
              ) {
                return "vendor-state";
              }

              // Các thư viện tiện ích khác
              if (id.includes("node_modules/")) {
                return "vendor-common";
              }
            }
          : undefined,
      },
    },
  },
});
