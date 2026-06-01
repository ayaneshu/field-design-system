import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { colour } from "@field-ds/tokens";

export type ThemeMode = "light" | "dark";

/**
 * Shell tokens — only what the *playground chrome* (page background, top
 * header, sidebar, page title) needs in order to flip with the theme. The
 * design system's own component tokens are intentionally NOT themed: every
 * M-Component is built and demoed in light mode only, and lives inside a
 * "light island" surface so its visuals stay correct on a dark page.
 */
export type ShellTokens = {
  pageBg: string;
  headerBg: string;
  sidebarBg: string;
  sidebarRowActiveBg: string;
  sidebarRowHoverBg: string;
  sidebarDivider: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  border: string;
  /** Background to use for the "always-light" component preview island. */
  previewIslandBg: string;
  /** Border for the preview island. */
  previewIslandBorder: string;
};

const LIGHT: ShellTokens = {
  pageBg: colour.surface.primary,
  headerBg: colour.surface.primary,
  sidebarBg: colour.surface.tertiary,
  sidebarRowActiveBg: colour.surface.primary,
  sidebarRowHoverBg: "rgba(255,255,255,0.6)",
  sidebarDivider: colour.border.primary,
  textPrimary: colour["text-n-icon"].primary,
  textSecondary: colour["text-n-icon"].secondary,
  textTertiary: colour["text-n-icon"].tertiary,
  textMuted: colour["text-n-icon"].muted,
  border: colour.border.primary,
  previewIslandBg: colour.surface.primary,
  previewIslandBorder: colour.border.subtle,
};

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (next: ThemeMode) => void;
  toggle: () => void;
  shell: ShellTokens;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
  /** @deprecated Dark mode was removed — the playground is always light. */
  initial?: ThemeMode;
}) {
  // Dark mode has been removed from the playground. The shell is permanently
  // light; `toggle`/`setMode` are retained as no-ops so existing consumers of
  // `useTheme()` keep working without changes.
  const value = useMemo<ThemeContextValue>(
    () => ({
      mode: "light",
      setMode: () => {},
      toggle: () => {},
      shell: LIGHT,
    }),
    [],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Safe fallback so screens used outside the provider still render.
    return {
      mode: "light",
      setMode: () => {},
      toggle: () => {},
      shell: LIGHT,
    };
  }
  return ctx;
}

/** Convenience: just the shell tokens for the current theme. */
export function useShell(): ShellTokens {
  return useTheme().shell;
}
