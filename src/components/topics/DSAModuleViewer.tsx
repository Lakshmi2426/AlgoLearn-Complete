import React, { useState, useEffect, useRef } from 'react';
import { ModuleRouteConfig } from '../../utils/moduleRoutes';
import { useTheme } from '../../context/ThemeContext';

interface DSAModuleViewerProps {
  moduleConfig: ModuleRouteConfig;
  onNavigateHome: () => void;
  onNavigateAskTeacher: () => void;
}

export const DSAModuleViewer: React.FC<DSAModuleViewerProps> = ({
  moduleConfig,
  onNavigateHome,
  onNavigateAskTeacher,
}) => {
  const { theme } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset loaded state whenever module ID changes for a clean transition
  useEffect(() => {
    setIsLoaded(false);
  }, [moduleConfig.moduleId]);

  // Synchronize theme with iframe document
  const syncIframeTheme = (targetTheme: string) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      iframe.contentWindow?.postMessage(
        { type: 'ALGOLEARN_THEME_CHANGE', theme: targetTheme },
        '*'
      );
    } catch (e) {}

    try {
      const doc = iframe.contentDocument;
      if (doc && doc.documentElement) {
        if (targetTheme === 'dark') {
          doc.documentElement.classList.add('dark', 'dark-theme');
          doc.documentElement.setAttribute('data-theme', 'dark');
          doc.documentElement.style.colorScheme = 'dark';
          if (doc.body) {
            doc.body.classList.add('dark', 'dark-theme');
            doc.body.setAttribute('data-theme', 'dark');
          }
        } else {
          doc.documentElement.classList.remove('dark', 'dark-theme');
          doc.documentElement.setAttribute('data-theme', 'light');
          doc.documentElement.style.colorScheme = 'light';
          if (doc.body) {
            doc.body.classList.remove('dark', 'dark-theme');
            doc.body.setAttribute('data-theme', 'light');
          }
        }
      }
    } catch (e) {}

    try {
      iframe.contentWindow?.localStorage?.setItem('algolearn_theme', targetTheme);
      iframe.contentWindow?.localStorage?.setItem('hashquest_theme', targetTheme);
      iframe.contentWindow?.localStorage?.setItem('stackmaster_theme', targetTheme);
    } catch (e) {}
  };

  // Sync theme whenever it changes in the main application
  useEffect(() => {
    syncIframeTheme(theme);
  }, [theme]);

  // Handle postMessage navigation events & setup click interceptors
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'ALGOLEARN_NAVIGATE') {
        if (event.data.tab === 'home') {
          onNavigateHome();
        } else if (event.data.tab === 'ask-teacher') {
          onNavigateAskTeacher();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onNavigateHome, onNavigateAskTeacher]);

  const handleIframeLoad = () => {
    setIsLoaded(true);
    syncIframeTheme(theme);

    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Attach capture-phase click listener to guarantee logo & chat button routing
      doc.addEventListener(
        'click',
        (e: MouseEvent) => {
          const target = e.target as HTMLElement | null;
          if (!target) return;

          // Don't intercept hamburger menu toggle
          if (target.closest('#topbar-menu-toggle, .topbar-toggle-btn')) return;

          // 1. Logo Click -> Return to Main Homepage
          const isLogo = target.closest(
            '#btn-logo-home, .brand-title-wrap, #topbar-brand-logo-img, .sidebar-brand-left, [aria-label*="Logo" i], [title*="AlgoLearn" i], a[href="/"]'
          );

          if (isLogo) {
            e.preventDefault();
            e.stopPropagation();
            onNavigateHome();
            window.location.hash = '';
            return;
          }

          // 2. Chat Icon Click -> Return to Ask a Teacher
          const isChat = target.closest(
            '#ai-assistant-fab, .ai-fab-btn, #ai-bot-floating-button, #unified-floating-ask-teacher-btn, [aria-label*="Ask a Teacher" i], [aria-label*="Teacher" i], [title*="Ask a Teacher" i], [title*="Open BFS AI Assistant" i]'
          );

          if (isChat) {
            e.preventDefault();
            e.stopPropagation();
            onNavigateAskTeacher();
            window.location.hash = '#ask-teacher';
            return;
          }
        },
        true // Capture phase
      );
    } catch (e) {}
  };

  const bgColor = theme === 'light' ? '#f6f9fe' : '#070b14';

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen overflow-hidden transition-colors duration-200"
      style={{ backgroundColor: bgColor }}
      id={`dsa-module-viewer-${moduleConfig.moduleId}`}
    >
      <iframe
        ref={iframeRef}
        src={`/dsa-modules/${moduleConfig.moduleId}?theme=${theme}`}
        title={`AlgoLearn - ${moduleConfig.title}`}
        onLoad={handleIframeLoad}
        className="w-full h-full border-none block m-0 p-0 transition-opacity duration-150 ease-in-out"
        allow="autoplay; fullscreen; clipboard-write; encrypted-media"
        style={{
          backgroundColor: 'transparent',
          opacity: isLoaded ? 1 : 0,
        }}
      />
    </div>
  );
};
