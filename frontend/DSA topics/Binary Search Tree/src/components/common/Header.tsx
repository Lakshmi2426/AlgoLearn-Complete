import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { AlgoLearnLogo } from './AlgoLearnLogo';
import { useUserProgress } from '../../context/UserProgressContext';
import { useTheme } from '../../context/ThemeContext';
import { soundManager } from '../../utils/audio';

export type NavTab = 'home' | 'learn' | 'video' | 'visual' | 'practice' | 'lab' | 'quiz' | 'game' | 'results';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab?: (tab: NavTab) => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const { isMuted, toggleMute, recentXPNotice, totalTopicPoints } = useUserProgress();
  const { toggleTheme, isDark } = useTheme();

  return (
    <>
      <header
        id="main-top-header"
        className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors duration-200"
      >
        <div className="px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Left side: Hamburger Toggle + Platform # icon + AlgoLearn & Subtitle */}
          <div className="flex items-center gap-3 min-w-0">
            {!isSidebarOpen && (
              <button
                id="sidebar-hamburger-toggle-btn"
                onClick={() => {
                  soundManager.playClick();
                  if (onToggleSidebar) onToggleSidebar();
                }}
                className="p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex-shrink-0 cursor-pointer shadow-2xs"
                aria-label="Open Navigation Menu"
                title="Open Navigation Menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            {/* AlgoLearn Brand Logo with Graduation Cap & "YOUR DSA JOURNEY" */}
            <AlgoLearnLogo
              onClick={
                setActiveTab
                  ? () => {
                      soundManager.playClick();
                      setActiveTab('home');
                    }
                  : undefined
              }
            />
          </div>

          {/* Right side: Top Header Controls (Theme, Sound) */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* 1. ☀️ Theme Toggle Button (Circular) */}
            <button
              id="header-theme-toggle-btn"
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* 2. 🔊 Sound/Audio Toggle Button (Circular) */}
            <button
              id="header-sound-toggle-btn"
              onClick={toggleMute}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
              title={isMuted ? 'Turn Sound ON' : 'Turn Sound OFF'}
              aria-label="Toggle Sound"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>
          </div>
        </div>

        {/* Floating XP Toast Alert */}
        {recentXPNotice && (
          <div className="bg-indigo-600 text-white text-xs font-bold py-1.5 px-4 text-center animate-pulse flex items-center justify-center gap-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{recentXPNotice.reason}: +{recentXPNotice.amount} XP</span>
          </div>
        )}
      </header>
    </>
  );
};
