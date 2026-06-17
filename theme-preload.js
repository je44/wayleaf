"use strict";

(() => {
  const root = document.documentElement;
  const bootStorageKey = "__wayleaf_theme_boot__";
  const systemDark = () => window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  let mode = "";
  let resolved = "";

  try {
    const cached = JSON.parse(localStorage.getItem(bootStorageKey) || "{}");
    mode = cached.mode === "dark" || cached.mode === "light" || cached.mode === "system" ? cached.mode : "";
    resolved = cached.resolved === "dark" || cached.resolved === "light" ? cached.resolved : "";
  } catch {
    mode = "";
    resolved = "";
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
})();
