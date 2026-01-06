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

    initBPMCore: function () {
      var self = this;

      var waitForBPMCore = function () {
        if (window.__BPM_CORE__) {
          ensureGlobals();

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
        } else {
          setTimeout(waitForBPMCore, 50);
        }
      };

      waitForBPMCore();
    },

    destroy: function () {
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
