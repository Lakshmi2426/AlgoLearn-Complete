import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const THEME_STORAGE_KEY = 'hashquest_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        if (window.parent && window.parent !== window && window.parent.document) {
          const isParentDark = window.parent.document.documentElement.classList.contains('dark');
          return isParentDark ? 'dark' : 'light';
        }
      } catch (e) {}

      const algoTheme = localStorage.getItem('algolearn_theme');
      if (algoTheme === 'dark' || algoTheme === 'light') {
        return algoTheme;
      }

      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    }
    return 'light';
  });

  // Sync when parent changes theme via postMessage or storage
  useEffect(() => {
    const handleParentMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ALGOLEARN_THEME_CHANGE' && (event.data.theme === 'dark' || event.data.theme === 'light')) {
        setThemeState(event.data.theme);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'algolearn_theme' && (event.newValue === 'dark' || event.newValue === 'light')) {
        setThemeState(event.newValue as ThemeMode);
      }
    };

    window.addEventListener('message', handleParentMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleParentMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      document.body?.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      document.body?.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // ignore storage error
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
