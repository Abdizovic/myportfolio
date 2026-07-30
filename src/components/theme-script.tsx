/**
 * Runs before first paint to set the theme class, so there is no flash of the
 * wrong theme. Kept as a raw string rather than a real module because it has to
 * execute synchronously in <head>, ahead of React.
 *
 * Order of preference: an explicit stored choice, then the OS setting, then
 * dark — dark is this site's default, not merely its fallback.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (prefersLight ? 'light' : 'dark');
    var root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    // Keeps form controls, scrollbars and the URL bar in step with the theme.
    root.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
