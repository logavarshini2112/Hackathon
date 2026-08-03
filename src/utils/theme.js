let mediaQueryListener = null;

/**
 * Helper to apply theme (Light / Dark / System) to document root
 */
export function applyTheme(theme) {
  if (!theme) theme = localStorage.getItem('portal_theme') || 'Light';
  localStorage.setItem('portal_theme', theme);

  const root = document.documentElement;

  const updateDOM = () => {
    const isDarkSystem = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'Dark' || (theme === 'System' && isDarkSystem);

    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      document.body.classList.add('bg-slate-900', 'text-slate-100');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      document.body.classList.remove('bg-slate-900', 'text-slate-100');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    }
  };

  updateDOM();

  // Attach listener for System mode
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQueryListener) {
      mediaQuery.removeEventListener('change', mediaQueryListener);
      mediaQueryListener = null;
    }
    if (theme === 'System') {
      mediaQueryListener = () => updateDOM();
      mediaQuery.addEventListener('change', mediaQueryListener);
    }
  }
}

/**
 * Restore saved theme on page load
 */
export function initTheme() {
  const saved = localStorage.getItem('portal_theme') || 'Light';
  applyTheme(saved);
}

// Run immediately on module load
if (typeof window !== 'undefined') {
  initTheme();
}
