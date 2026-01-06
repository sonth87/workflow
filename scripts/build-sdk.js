#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SDK_DIST = path.join(__dirname, "../sdk-dist");
const SDK_DIR = path.join(__dirname, "../sdk");
const TEMPLATE_PATH = path.join(SDK_DIR, "bpm-sdk.template.js");
const OUTPUT_PATH = path.join(SDK_DIST, "bpm-sdk.js");

function buildSDK() {
  console.log("🚀 Building BPM SDK...");

  // Check if sdk-dist exists
  if (!fs.existsSync(SDK_DIST)) {
    console.error(
      '❌ sdk-dist directory not found. Please run "pnpm build" first.'
    );
    process.exit(1);
  }

  // Read template
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error("❌ Template file not found:", TEMPLATE_PATH);
    process.exit(1);
  }

  let template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

  // Find all CSS and JS files
  const jsDir = path.join(SDK_DIST, "js");
  const cssDir = path.join(SDK_DIST, "css");

  let jsFiles = [];
  let cssFiles = [];

  if (fs.existsSync(jsDir)) {
    jsFiles = fs
      .readdirSync(jsDir)
      .filter(f => f.endsWith(".js"))
      .map(f => "js/" + f);
  }

  if (fs.existsSync(cssDir)) {
    cssFiles = fs
      .readdirSync(cssDir)
      .filter(f => f.endsWith(".css"))
      .map(f => "css/" + f);
  }

  console.log("📦 Found resources:");
  console.log("  JS files:", jsFiles.length);
  console.log("  CSS files:", cssFiles.length);

  // Detect if using ES modules (split chunks = multiple JS files)
  const useModuleType = jsFiles.length > 1;
  console.log("🔧 Module type:", useModuleType ? "ES Module" : "IIFE");

  // Generate build version
  const buildVersion = Date.now().toString();

  // Replace placeholders
  template = template.replace("$APS_LIST", "bpm");
  template = template.replace("$DOMAIN", "");
  template = template.replace("$SOURCE_PATH", "");
  template = template.replace("$BUILD_VERSION", buildVersion);
  template = template.replace("$USE_MODULE_TYPE", useModuleType.toString());
  template = template.replace("$CSS_FILES", cssFiles.join(","));
  template = template.replace("$JS_FILES", jsFiles.join(","));

  // Write output
  fs.writeFileSync(OUTPUT_PATH, template, "utf-8");

  // Copy index.html for testing
  const INDEX_TEMPLATE = path.join(SDK_DIR, "index.template.html");
  const INDEX_OUTPUT = path.join(SDK_DIST, "index.html");

  if (fs.existsSync(INDEX_TEMPLATE)) {
    fs.copyFileSync(INDEX_TEMPLATE, INDEX_OUTPUT);
    console.log("📄 Copied index.html for testing");
  }

  console.log("✅ SDK built successfully!");
  console.log("📄 Output:", OUTPUT_PATH);
  console.log("🔢 Build version:", buildVersion);
  console.log("\n📋 Files included:");
  cssFiles.forEach(f => console.log("  - " + f));
  jsFiles.forEach(f => console.log("  - " + f));
}

buildSDK();
