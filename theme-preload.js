"use strict";

(() => {
  const root = document.documentElement;
  const bootStorageKey = "__wayleaf_theme_boot__";
  const systemDark = () => window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  let mode = "";
  let resolved = "";
  let palette = "";
  let variables = {};

  try {
    const cached = JSON.parse(localStorage.getItem(bootStorageKey) || "{}");
    mode = cached.mode === "dark" || cached.mode === "light" || cached.mode === "system" ? cached.mode : "";
    resolved = cached.resolved === "dark" || cached.resolved === "light" ? cached.resolved : "";
    palette = typeof cached.palette === "string" ? cached.palette : "";
    variables = cached.variables && typeof cached.variables === "object" ? cached.variables : {};
  } catch {
    mode = "";
    resolved = "";
    palette = "";
    variables = {};
  }

  if (!mode) {
    try {
      const previewStore = JSON.parse(localStorage.getItem("__wayleaf_preview_storage__") || "{}");
      mode = previewStore.themeMode === "dark" || previewStore.themeMode === "light" || previewStore.themeMode === "system"
        ? previewStore.themeMode
        : "";
    } catch {
      mode = "";
    }
  }

  if (mode === "dark" || mode === "light") {
    resolved = mode;
  } else if (mode === "system" || !resolved) {
    resolved = systemDark() ? "dark" : "light";
  }

  root.dataset.theme = resolved;
  if (palette) {
    root.dataset.themePalette = palette;
  }
  Object.entries(variables).forEach(([name, value]) => {
    if (/^--(?:light|dark)-[a-z0-9-]+$/.test(name) && typeof value === "string" && value.length <= 128) {
      root.style.setProperty(name, value);
    }
  });
})();
