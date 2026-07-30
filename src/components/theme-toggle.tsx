"use client";

import { MoonIcon, SunIcon } from "@/components/icons";

/**
 * Both icons are always rendered and swapped with a CSS `dark:` variant rather
 * than React state. That means the correct icon is present in the server HTML,
 * so there is no hydration mismatch and no icon flicker on load.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode / storage disabled - the toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle between light and dark theme"
      title="Toggle theme"
      className={`inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-surface-2 hover:text-foreground ${className}`}
    >
      <SunIcon className="hidden size-4.5 dark:block" />
      <MoonIcon className="size-4.5 dark:hidden" />
    </button>
  );
}
