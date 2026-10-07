export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'stackmaster_theme';

export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    if (window.parent && window.parent !== window && window.parent.document) {
      const isParentDark = window.parent.document.documentElement.classList.contains('dark');
      return isParentDark ? 'dark' : 'light';
    }
  } catch (e) {}

  const algoTheme = localStorage.getItem('algolearn_theme') as ThemeMode | null;
  if (algoTheme === 'light' || algoTheme === 'dark') {
    return algoTheme;
  }

  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'light';
}

export function applyTheme(mode: ThemeMode): boolean {
  if (typeof window === 'undefined') return false;

  const root = document.documentElement;
  const body = document.body;
  let isDark = false;

  if (mode === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    isDark = mode === 'dark';
  }

  if (isDark) {
    root.classList.add('dark');
    if (body) body.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    if (body) body.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // ignore
  }

  return isDark;
}

// Global listener for parent theme change
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event: MessageEvent) => {
    if (event.data?.type === 'ALGOLEARN_THEME_CHANGE' && (event.data.theme === 'dark' || event.data.theme === 'light')) {
      applyTheme(event.data.theme);
    }
  });

  window.addEventListener('storage', (event: StorageEvent) => {
    if (event.key === 'algolearn_theme' && (event.newValue === 'dark' || event.newValue === 'light')) {
      applyTheme(event.newValue as ThemeMode);
    }
  });
}
