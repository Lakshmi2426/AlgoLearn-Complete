import React from 'react';
import { NavItem, UserData } from '../types';
import {
  Menu,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  User
} from 'lucide-react';
import { AlgoLearnLogo } from './AlgoLearnLogo';

interface TopHeaderProps {
  currentNav: NavItem;
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isSoundOn?: boolean;
  onToggleSound?: () => void;
  onNavigateHome?: () => void;
  currentUser?: UserData;
  onOpenProfile?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentNav,
  onToggleSidebar,
  isSidebarOpen = false,
  isDarkMode,
  onToggleTheme,
  isSoundOn = true,
  onToggleSound,
  onNavigateHome,
  currentUser,
  onOpenProfile
}) => {
  return (
    <header
      id="top-header-bar"
      className={`h-16 px-4 sm:px-6 flex items-center justify-between border-b sticky top-0 z-30 transition-colors duration-200 backdrop-blur-md relative ${
        isDarkMode
          ? 'bg-black/95 border-zinc-900 text-slate-100'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Left side: Hamburger menu button + AlgoLearn Logo at top left in place of section headings */}
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <button
            id="header-hamburger-btn"
            onClick={onToggleSidebar}
            title="Open Navigation Menu (☰)"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isDarkMode
                ? 'hover:bg-zinc-900 text-slate-300 hover:text-white'
                : 'hover:bg-slate-100 text-slate-700 hover:text-slate-950'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* AlgoLearn Logo at top left in place of learn/game headings */}
        <div
          id="header-algolearn-logo"
          onClick={() => onNavigateHome?.()}
          className="cursor-pointer transition-opacity hover:opacity-90 flex items-center select-none"
          title="AlgoLearn • Overview"
          role="button"
          tabIndex={0}
        >
          <AlgoLearnLogo isDark={isDarkMode} size="sm" variant="full" />
        </div>
      </div>

      {/* Right side: Circular buttons (Sun, Sound) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* 1. Theme toggle circular button */}
        <button
          id="header-theme-toggle-btn"
          onClick={onToggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            isDarkMode
              ? 'border-zinc-800 bg-[#0d0d0d] hover:bg-zinc-900 text-amber-300'
              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-indigo-700'
          }`}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-700" />
          )}
        </button>

        {/* 2. Sound / Audio feedback circular button */}
        <button
          id="header-audio-toggle-btn"
          onClick={onToggleSound}
          title={isSoundOn ? 'Audio Effects Enabled' : 'Audio Effects Muted'}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            isDarkMode
              ? 'border-zinc-800 bg-[#0d0d0d] hover:bg-zinc-900 text-indigo-300 hover:text-white'
              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-indigo-700 hover:text-slate-950'
          }`}
        >
          {isSoundOn ? (
            <Volume2 className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`} />
          ) : (
            <VolumeX className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          )}
        </button>
      </div>
    </header>
  );
};
