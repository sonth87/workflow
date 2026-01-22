(function (root, factory) {
  var pluginName = "BPM";
  if (typeof exports === "object") {
    module.exports = factory(pluginName);
  } else {
    root[pluginName] = factory(pluginName);
  }
})(this, function (pluginName) {
  "use strict";

  var domain = "$DOMAIN";
  var sourcePath = "$SOURCE_PATH";
  var buildVersion = "$BUILD_VERSION";
  var useModuleType = "$USE_MODULE_TYPE" === "true";

  function getCurrentScript() {
    var cs = document.currentScript;
    if (!cs) {
      var scripts = document.getElementsByTagName("script");
      cs = scripts[scripts.length - 1];
    }
    return cs;
  }

  function addVersion(u) {
    if (!u) return u;
    return u + (u.indexOf("?") > -1 ? "&" : "?") + "v=" + buildVersion;
  }

  var __sdkScriptEl = getCurrentScript();
  var __sdkSrc = (__sdkScriptEl && __sdkScriptEl.src) || "";
  var sdkBasePath = __sdkSrc.replace(/\/bpm-sdk\.js(\?.*)?$/, "");

  if (
    !domain ||
    domain === "$DOMAIN" ||
    domain.indexOf("$") === 0 ||
    domain === "undefined"
  ) {
    domain = sdkBasePath;
  }

  function buildAssetUrl(relPath, addSourcePath) {
    if (addSourcePath === void 0) addSourcePath = false;
    if (domain) {
      var _domain = domain.replace(/\/+$/, "") + "/";
      var _sourcePath = addSourcePath ? sourcePath || "" : "";
      _domain += _sourcePath ? _sourcePath.replace(/^\/+|\/+$/g, "") + "/" : "";
      return _domain + relPath.replace(/^\/+/, "");
    }
    return new URL(relPath, __sdkSrc || window.location.href).href;
  }

  if (typeof window !== "undefined") {
    window.buildAssetUrl = buildAssetUrl;
  }

  var defaults = {
    selector: "#bpm-container",
    type: "bpm",
    class: "bpm-sdk-container",
    options: {},
  };

  function ensureGlobals() {
    window.__SKYLINE_SDK_HUB_OPTIONS__ =
      window.__SKYLINE_SDK_HUB_OPTIONS__ || {};
    window.__SKYLINE_SDK_MANAGERS__ = window.__SKYLINE_SDK_MANAGERS__ || {};
    window.__SKYLINE_SDK_REQUESTS__ = window.__SKYLINE_SDK_REQUESTS__ || {};
    window.__SKYLINE_SDK_RENDERERS__ = window.__SKYLINE_SDK_RENDERERS__ || {};
  }

  var extend = function (defaultOptions, options) {
    var prop,
      extended = {};
    for (prop in defaultOptions)
      if (Object.prototype.hasOwnProperty.call(defaultOptions, prop))
        extended[prop] = defaultOptions[prop];
    for (prop in options)
      if (Object.prototype.hasOwnProperty.call(options, prop))
        extended[prop] = options[prop];
    return extended;
  };

  var goGlobal = function (options) {
    ensureGlobals();
    window.__SKYLINE_SDK_HUB_OPTIONS__[options.selector] = options;
  };

  function BPM(options) {
    this.options = extend(defaults, options || {});
    this.loadedCSS = [];
    this.loadedJS = [];
    ensureGlobals();
    goGlobal(this.options);
    this.init();
  }

  BPM.prototype = {
    injectImportMap: function () {
      // Check if importmap already exists
      if (document.querySelector('script[type="importmap"]')) {
        return;
      }

      var importMap = {
        imports: {
          react: "https://esm.sh/react@19",
          "react-dom": "https://esm.sh/react-dom@19",
          "react/jsx-runtime": "https://esm.sh/react@19/jsx-runtime",
          "@xyflow/react": "https://esm.sh/@xyflow/react@12",
        },
      };

      var script = document.createElement("script");
      script.type = "importmap";
      script.textContent = JSON.stringify(importMap, null, 2);
      document.head.appendChild(script);
    },

    init: function () {
      this.selectors = document.querySelectorAll(this.options.selector);
      window.__SKYLINE_SDK_MANAGERS__[this.options.selector] = this;

      for (var i = 0; i < this.selectors.length; i++) {
        var node = this.selectors[i];
        if (this.options.class) node.classList.add(this.options.class);
      }

      // Inject importmap before loading resources
      if (useModuleType) this.injectImportMap();
      this.loadResources();
    },

    loadResources: function () {
      var self = this;

      if (window.__BPM_RESOURCES_LOADED__) {
        self.initBPMCore();
        return;
      }

      // Load CSS first
      var cssFiles = "$CSS_FILES".split(",").filter(function (f) {
        return f.trim();
      });
      var jsFiles = "$JS_FILES".split(",").filter(function (f) {
        return f.trim();
      });

      var cssPromises = cssFiles.map(function (cssFile) {
        return self.loadCSS(buildAssetUrl(cssFile));
      });

      Promise.all(cssPromises)
        .then(function () {
          // For ES modules: Load vendors first, then main entry
          // Sort files: vendors first, main last
          if (useModuleType) {
            var mainFile = jsFiles.find(function (f) {
              return f.indexOf("/main.") > -1;
            });
            var vendorFiles = jsFiles.filter(function (f) {
              return f !== mainFile;
            });

            // Load all vendor chunks in parallel
            return Promise.all(
              vendorFiles.map(function (file) {
                return self.loadJS(buildAssetUrl(file));
              })
            ).then(function () {
              // Then load main entry point
              if (mainFile) {
                return self.loadJS(buildAssetUrl(mainFile));
              }
            });
          } else {
            // For IIFE: Load sequentially
            return self.loadJSSequentially(jsFiles);
          }
        })
        .then(function () {
          window.__BPM_RESOURCES_LOADED__ = true;
          self.initBPMCore();
        })
        .catch(function (error) {
          console.error("Failed to load BPM resources:", error);
          if (typeof self.options.onError === "function") {
            self.options.onError(error);
          }
        });
    },

    loadCSS: function (url) {
      var self = this;
      return new Promise(function (resolve, reject) {
        if (self.loadedCSS.indexOf(url) > -1) {
          resolve();
          return;
        }

        var existing = document.querySelector('link[href="' + url + '"]');
        if (existing) {
          self.loadedCSS.push(url);
          resolve();
          return;
        }

        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = addVersion(url);
        link.onload = function () {
          self.loadedCSS.push(url);
          resolve();
        };
        link.onerror = function () {
          reject(new Error("Failed to load CSS: " + url));
        };
        document.head.appendChild(link);
      });
    },

    loadJS: function (url) {
      var self = this;
      return new Promise(function (resolve, reject) {
        if (self.loadedJS.indexOf(url) > -1) {
          resolve();
          return;
        }

        var existing = document.querySelector('script[src="' + url + '"]');
        if (existing) {
          self.loadedJS.push(url);
          resolve();
          return;
        }

        var script = document.createElement("script");
        script.src = addVersion(url);
        if (useModuleType) {
          script.type = "module";
        }
        script.async = false;
        script.onload = function () {
          self.loadedJS.push(url);
          resolve();
        };
        script.onerror = function () {
          reject(new Error("Failed to load JS: " + url));
        };
        document.head.appendChild(script);
      });
    },

    loadJSSequentially: function (jsFiles) {
      var self = this;
      var promise = Promise.resolve();

      jsFiles.forEach(function (jsFile) {
        promise = promise.then(function () {
          return self.loadJS(buildAssetUrl(jsFile));
        });
      });

      return promise;
    },

    loadJSONConfig: function (url) {
      return fetch(url).then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load JSON config: " + response.statusText);
        }
        return response.json();
      });
    },

    initBPMCore: function () {
      var self = this;

      var waitForBPMCore = function () {
        if (window.__BPM_CORE__) {
          ensureGlobals();

          // Process JSON configs if provided
          var configPromises = [];

          // Load custom nodes from JSON
          if (self.options.options.customNodesUrl) {
            configPromises.push(
              self
                .loadJSONConfig(self.options.options.customNodesUrl)
                .then(function (nodesConfig) {
                  self.options.options.customNodes = nodesConfig;
                })
            );
          }

          // Load plugins from JSON URLs
          if (
            self.options.options.pluginUrls &&
            Array.isArray(self.options.options.pluginUrls)
          ) {
            self.options.options.pluginUrls.forEach(function (url) {
              configPromises.push(
                self.loadJSONConfig(url).then(function (pluginConfig) {
                  if (!self.options.options.pluginsFromJSON) {
                    self.options.options.pluginsFromJSON = [];
                  }
                  self.options.options.pluginsFromJSON.push(pluginConfig);
                })
              );
            });
          }

          Promise.all(configPromises)
            .then(function () {
              var request = {
                appType: "bpm",
                selector: self.options.selector,
                options: self.options.options || {},
              };

              window.__SKYLINE_SDK_HUB_OPTIONS__[self.options.selector] =
                self.options;

              var q =
                window.__SKYLINE_SDK_REQUESTS__["bpm"] ||
                (window.__SKYLINE_SDK_REQUESTS__["bpm"] = []);
              q.push(request);

              if (typeof window.__BPM_CORE__ === "function") {
                try {
                  var instance = new window.__BPM_CORE__({
                    container: self.options.selector,
                    ...self.options.options,
                  });

                  // Store instance for later access
                  self.instance = instance;

                  // Expose event API
                  self.eventBus = {
                    on: function (event, handler) {
                      if (instance && instance.eventBus) {
                        return instance.eventBus.on(event, handler);
                      }
                    },
                    emit: function (event, payload) {
                      if (instance && instance.eventBus) {
                        instance.eventBus.emit(event, payload);
                      }
                    },
                  };

                  if (typeof self.options.onReady === "function") {
                    self.options.onReady(instance);
                  }
                } catch (e) {
                  console.error("Error initializing BPM Core:", e);
                  if (typeof self.options.onError === "function") {
                    self.options.onError(e);
                  }
                }
              }
            })
            .catch(function (error) {
              console.error("Error loading JSON configs:", error);
              if (typeof self.options.onError === "function") {
                self.options.onError(error);
              }
            });
        } else {
          setTimeout(waitForBPMCore, 50);
        }
      };

      waitForBPMCore();
    },

    on: function (event, handler) {
      if (this.eventBus) {
        return this.eventBus.on(event, handler);
      }
    },

    emit: function (event, payload) {
      if (this.eventBus) {
        this.eventBus.emit(event, payload);
      }
    },

    /**
     * Get the current language code
     * @returns {string} Current language code (e.g., 'en', 'vi')
     */
    getLanguage: function () {
      if (this.instance && typeof this.instance.getLanguage === "function") {
        return this.instance.getLanguage();
      }
      return "en"; // Default fallback
    },

    /**
     * Set the current language
     * @param {string} language - Language code (e.g., 'en', 'vi')
     */
    setLanguage: function (language) {
      if (this.instance && typeof this.instance.setLanguage === "function") {
        return this.instance.setLanguage(language);
      }
    },

    /**
     * Get list of available languages detected from workflow and plugins
     * @returns {string[]} Array of language codes
     */
    getAvailableLanguages: function () {
      if (
        this.instance &&
        typeof this.instance.getAvailableLanguages === "function"
      ) {
        return this.instance.getAvailableLanguages();
      }
      return ["en"]; // Default fallback
    },

    /**
     * Load translations for a specific language dynamically
     * @param {string} urlOrLanguage - URL to translation file or language code
     * @param {object} translations - Optional translations object (if first param is language code)
     * @returns {Promise} Promise that resolves when translations are loaded
     */
    loadTranslationsForLanguage: function (urlOrLanguage, translations) {
      if (
        this.instance &&
        typeof this.instance.loadTranslationsForLanguage === "function"
      ) {
        return this.instance.loadTranslationsForLanguage(
          urlOrLanguage,
          translations
        );
      }
      return Promise.reject(
        new Error("loadTranslationsForLanguage not available")
      );
    },

    /**
     * Undo last action
     */
    undo: function () {
      if (this.instance && typeof this.instance.undo === "function") {
        this.instance.undo();
      }
    },

    /**
     * Redo last undone action
     */
    redo: function () {
      if (this.instance && typeof this.instance.redo === "function") {
        this.instance.redo();
      }
    },

    /**
     * Check if undo is available
     * @returns {boolean}
     */
    canUndo: function () {
      if (this.instance && typeof this.instance.canUndo === "function") {
        return this.instance.canUndo();
      }
      return false;
    },

    /**
     * Check if redo is available
     * @returns {boolean}
     */
    canRedo: function () {
      if (this.instance && typeof this.instance.canRedo === "function") {
        return this.instance.canRedo();
      }
      return false;
    },

    /**
     * Get current theme
     * @returns {string} 'light', 'dark', or 'system'
     */
    getTheme: function () {
      if (this.instance && typeof this.instance.getTheme === "function") {
        return this.instance.getTheme();
      }
      return "system";
    },

    /**
     * Set theme
     * @param {string} theme - 'light', 'dark', or 'system'
     */
    setTheme: function (theme) {
      if (this.instance && typeof this.instance.setTheme === "function") {
        this.instance.setTheme(theme);
      }
    },

    /**
     * Set light mode
     */
    setLightMode: function () {
      if (this.instance && typeof this.instance.setLightMode === "function") {
        this.instance.setLightMode();
      }
    },

    /**
     * Set dark mode
     */
    setDarkMode: function () {
      if (this.instance && typeof this.instance.setDarkMode === "function") {
        this.instance.setDarkMode();
      }
    },

    /**
     * Set system mode (auto)
     */
    setSystemMode: function () {
      if (this.instance && typeof this.instance.setSystemMode === "function") {
        this.instance.setSystemMode();
      }
    },

    /**
     * Toggle theme (light -> dark -> system -> light)
     */
    toggleTheme: function () {
      if (this.instance && typeof this.instance.toggleTheme === "function") {
        this.instance.toggleTheme();
      }
    },

    /**
     * Get current workflow data
     * @returns {object} Workflow data with nodes, edges, name, description
     */
    getWorkflow: function () {
      if (this.instance && typeof this.instance.getWorkflow === "function") {
        return this.instance.getWorkflow();
      }
      return {
        nodes: [],
        edges: [],
        workflowName: "",
        workflowDescription: "",
      };
    },

    /**
     * Get workflow nodes
     * @returns {array} Array of nodes
     */
    getNodes: function () {
      if (this.instance && typeof this.instance.getNodes === "function") {
        return this.instance.getNodes();
      }
      return [];
    },

    /**
     * Get workflow edges
     * @returns {array} Array of edges
     */
    getEdges: function () {
      if (this.instance && typeof this.instance.getEdges === "function") {
        return this.instance.getEdges();
      }
      return [];
    },

    /**
     * Clear workflow (remove all nodes and edges)
     */
    clearWorkflow: function () {
      if (this.instance && typeof this.instance.clearWorkflow === "function") {
        this.instance.clearWorkflow();
      }
    },

    /**
     * Import workflow from data object
     * @param {object} data - Workflow data with nodes and edges
     */
    importWorkflow: function (data) {
      if (this.instance && typeof this.instance.importWorkflow === "function") {
        this.instance.importWorkflow(data);
      }
    },

    /**
     * Export workflow as data object
     * @param {boolean} includeMetadata - Include metadata in export
     * @returns {object} Exported workflow data
     */
    exportWorkflow: function (includeMetadata) {
      if (includeMetadata === undefined) includeMetadata = true;
      if (this.instance && typeof this.instance.exportWorkflow === "function") {
        return this.instance.exportWorkflow(includeMetadata);
      }
      return { nodes: [], edges: [] };
    },

    /**
     * Download workflow as JSON file
     * @param {string} filename - Filename for download (default: workflow.json)
     */
    downloadWorkflow: function (filename) {
      if (
        this.instance &&
        typeof this.instance.downloadWorkflow === "function"
      ) {
        this.instance.downloadWorkflow(filename);
      }
    },

    /**
     * Upload workflow from file (opens file picker)
     * @returns {Promise} Promise that resolves with uploaded data
     */
    uploadWorkflow: function () {
      if (this.instance && typeof this.instance.uploadWorkflow === "function") {
        return this.instance.uploadWorkflow();
      }
      return Promise.reject(new Error("Upload not available"));
    },

    /**
     * View current workflow data (alias for getWorkflow)
     * @returns {object} Workflow data
     */
    viewWorkflow: function () {
      if (this.instance && typeof this.instance.viewWorkflow === "function") {
        return this.instance.viewWorkflow();
      }
      return this.getWorkflow();
    },

    /**
     * Get validation errors
     * @returns {array} Array of validation errors
     */
    getValidationErrors: function () {
      if (
        this.instance &&
        typeof this.instance.getValidationErrors === "function"
      ) {
        return this.instance.getValidationErrors();
      }
      return [];
    },

    /**
     * Check if workflow has validation errors
     * @returns {boolean}
     */
    hasErrors: function () {
      if (this.instance && typeof this.instance.hasErrors === "function") {
        return this.instance.hasErrors();
      }
      return false;
    },

    /**
     * Validate workflow
     * @returns {Promise} Promise that resolves with validation result
     */
    validate: function () {
      if (this.instance && typeof this.instance.validate === "function") {
        return this.instance.validate();
      }
      return Promise.resolve({ valid: true, errors: [] });
    },

    update: function (config) {
      if (this.instance && typeof this.instance.update === "function") {
        return this.instance.update(config);
      }
    },

    destroy: function () {
      if (this.instance && typeof this.instance.destroy === "function") {
        this.instance.destroy();
      }
      if (this.selectors && this.options.class) {
        for (var i = 0; i < this.selectors.length; i++) {
          var node = this.selectors[i];
          node.classList.remove(this.options.class);
        }
      }
      this.selectors = null;
      this.options = null;
      this.loadedCSS = [];
      this.loadedJS = [];
    },

    getOptions: function (id) {
      try {
        return window.__SKYLINE_SDK_HUB_OPTIONS__?.[id];
      } catch (error) {
        return;
      }
    },
  };

  return BPM;
});
