import React, { useState, useEffect, forwardRef } from 'react';
import {
  LayoutGrid,
  BookOpen,
  Sparkles,
  HelpCircle,
  TrendingUp,
  X,
} from 'lucide-react';
import { TabType, UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  progress: UserProgress;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(({
  currentTab,
  onSelectTab,
  progress,
  isOpen,
  onClose,
}, ref) => {
  const [isHoveringNav, setIsHoveringNav] = useState<boolean>(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navItems: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'home',
      label: 'Overview',
      icon: LayoutGrid,
    },
    {
      id: 'theory',
      label: 'Learn',
      icon: BookOpen,
    },
    {
      id: 'lab',
      label: 'Visualize',
      icon: Sparkles,
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: HelpCircle,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
    },
  ];

  const getPerformanceRepresentation = (tabId: TabType): string => {
    switch (tabId) {
      case 'home': {
        const completed = Array.from(
          new Set<number>(progress.completedOverviewSections || [])
        ).filter((id: number) => id >= 1 && id <= 4).length;
        return `${Math.min(4, completed)}/4`;
      }
      case 'theory': {
        const completed = (progress.completedTheoryChapters || []).length;
        return `${Math.min(8, completed)}/8`;
      }
      case 'lab': {
        const completed = (progress.completedLabs || []).length;
        return `${Math.min(2, completed)}/2`;
      }
      case 'quiz': {
        if (progress.quizCompleted) {
          return `${progress.quizHighScore || 10}/10`;
        }
        const answered = Math.min(
          10,
          Math.max(0, progress.quizAnsweredCount || progress.quizTotalQuestionsAnswered || 0)
        );
        return `${answered}/10`;
      }
      case 'progress': {
        const completedModules =
          (progress.completedTheoryChapters?.length || 0) +
          (progress.completedLabs?.length || 0) +
          (progress.quizCompleted ? 1 : 0);
        const overallPercent = Math.min(100, Math.round((completedModules / 11) * 100));
        return `${overallPercent}%`;
      }
      default:
        return '';
    }
  };

  const handleItemClick = (tab: TabType) => {
    soundEffects.playClick();
    onSelectTab(tab);
  };

  return (
    <aside
      ref={ref}
      id="main-sidebar-navigation"
      role="navigation"
      aria-label="Sidebar Navigation"
      className={`h-full shrink-0 overflow-hidden bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between select-none transition-all duration-300 ease-out z-30 ${
        isOpen ? 'w-[280px] sm:w-[300px] opacity-100' : 'w-0 opacity-0 border-r-0 pointer-events-none'
      }`}
    >
      <div className="w-[280px] sm:w-[300px] h-full flex flex-col justify-between shrink-0 bg-white dark:bg-slate-900">
        {/* Drawer Header: Category Header Text with #64748B and Bold Uppercase */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0 bg-white dark:bg-slate-900">
          <h3 className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            NAVIGATION MENU
          </h3>

          {/* Close button (upper-right) */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            title="Close navigation (Esc)"
            aria-label="Close navigation"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3.5 flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
          <nav
            className="space-y-1.5 flex-1 group/nav"
            onMouseEnter={() => setIsHoveringNav(true)}
            onMouseLeave={() => setIsHoveringNav(false)}
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  onMouseEnter={() => setIsHoveringNav(true)}
                  className={`group w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 shadow-2xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Section icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <span
                      className={`text-sm tracking-tight truncate transition-colors ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-200 font-medium'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Performance Representation: Visible when cursor moves towards ANY option (hidden for Overview) */}
                  {getPerformanceRepresentation(item.id) ? (
                    <span
                      className={`text-xs font-mono font-bold tracking-wider transition-opacity duration-200 shrink-0 ml-2 select-none ${
                        isHoveringNav
                          ? 'opacity-100'
                          : 'opacity-0 group-hover/nav:opacity-100'
                      } ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {getPerformanceRepresentation(item.id)}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
