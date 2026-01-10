#!/usr/bin/env node

/**
 * Build script for React Library
 * 1. Generate TypeScript declarations
 * 2. Build library with Vite
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

console.log("🚀 Building BPM Core React Library...\n");

// Step 1: Clean lib-dist directory
console.log("📦 Cleaning lib-dist directory...");
const libDistPath = path.join(rootDir, "lib-dist");
if (existsSync(libDistPath)) {
  execSync(`rm -rf ${libDistPath}`, { stdio: "inherit" });
}
mkdirSync(libDistPath, { recursive: true });

// Step 2: Build with Vite first
console.log("\n🔨 Building library with Vite...");
try {
  execSync("vite build --config vite.config.lib.ts", {
    cwd: rootDir,
    stdio: "inherit",
  });
  console.log("✅ Library built successfully");
} catch (error) {
  console.error("❌ Failed to build library");
  process.exit(1);
}

// Step 3: Generate TypeScript declarations
console.log("\n📝 Generating TypeScript declarations...");
try {
  execSync("tsc --project tsconfig.lib.json", {
    cwd: rootDir,
    stdio: "inherit",
  });
  console.log("✅ TypeScript declarations generated successfully");
} catch (error) {
  console.error("❌ Failed to generate TypeScript declarations");
  process.exit(1);
}

console.log("\n✨ Build completed! Output: lib-dist/");
console.log("\n📚 Library files:");
console.log("  - bpm-core.es.js (ESM)");
console.log("  - bpm-core.cjs.js (CommonJS)");
console.log("  - bpm-core.css (Styles)");
console.log("  - index.d.ts (TypeScript declarations)");
