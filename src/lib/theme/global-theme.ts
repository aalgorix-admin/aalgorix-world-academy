export type ThemeMode = "light" | "dark";

export const GLOBAL_THEME_STORAGE_KEY = "awa-global-theme";

const LEGACY_THEME_STORAGE_KEY = "awa-marketing-theme";

export function applyDocumentTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem(GLOBAL_THEME_STORAGE_KEY) ?? "";
  if (stored === "dark") return "dark";
  if (stored === "light") return "light";

  const legacy = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY) ?? "";
  if (legacy === "dark") {
    window.localStorage.setItem(GLOBAL_THEME_STORAGE_KEY, "dark");
    return "dark";
  }

  return "light";
}

export function persistTheme(theme: ThemeMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GLOBAL_THEME_STORAGE_KEY, theme);
}

/** Inline boot script — keeps first paint aligned with stored preference. */
export const GLOBAL_THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(GLOBAL_THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){document.documentElement.classList.remove('dark');}})();`;
