import React from 'react';
import {
  LayoutGrid,
  BookOpen,
  Gamepad2,
  GraduationCap,
  Trophy,
  X,
} from 'lucide-react';
import { VisualizeNavIcon } from './VisualizeNavIcon';
import { NavTab } from './Header';
import { useUserProgress } from '../../context/UserProgressContext';
import { soundManager } from '../../utils/audio';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  selectedLearnTopicIndex?: number;
  onSelectLearnTopic?: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  const [isMenuHovered, setIsMenuHovered] = React.useState<boolean>(false);
  const {
    learnCompletedCount,
    visualizeCompletedCount,
    gameCompletedCount,
    quizCompletedCount,
    overviewCompletedCount,
    overallCompletionPercentage,
  } = useUserProgress();

  const handleNavClick = (tab: NavTab) => {
    soundManager.playClick();
    setActiveTab(tab);
    // On small screens, close sidebar upon selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // The 6 clean navigation items matching requirement
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Overview', icon: LayoutGrid },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'video', label: 'Visualize', icon: VisualizeNavIcon },
    { id: 'game', label: 'Game', icon: Gamepad2 },
    { id: 'quiz', label: 'Quiz', icon: GraduationCap },
    { id: 'results', label: 'Progress', icon: Trophy },
  ];

  // Progress text revealed when cursor is anywhere inside the navigation menu area
  const getProgressBadge = (tabId: NavTab): string => {
    switch (tabId) {
      case 'home':
        return `${overviewCompletedCount}/40`;
      case 'learn':
        return `${learnCompletedCount}/20`;
      case 'video':
      case 'visual':
        return `${visualizeCompletedCount}/5`;
      case 'game':
        return `${gameCompletedCount}/5`;
      case 'quiz':
        return `${quizCompletedCount}/10`;
      case 'results':
        return `${overallCompletionPercentage}%`;
      default:
        return '';
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Clean Left Sidebar */}
      <aside
        id="main-left-sidebar"
        onMouseEnter={() => setIsMenuHovered(true)}
        onMouseLeave={() => setIsMenuHovered(false)}
        onPointerEnter={() => setIsMenuHovered(true)}
        onPointerLeave={() => setIsMenuHovered(false)}
        className={`group/sidebar fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col border-r border-slate-200/80 dark:border-slate-800 shadow-sm transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Close Button */}
        <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
            Navigation Menu
          </span>

          {/* Close button for mobile or compact view */}
          <button
            id="sidebar-close-btn"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
            title="Close Menu"
            aria-label="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'video' && activeTab === 'visual') ||
              (item.id === 'learn' && (activeTab === 'practice' || activeTab === 'lab'));

            const badgeText = getProgressBadge(item.id);

            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`group/item w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </div>

                {/* Progress Badge: Subtle low-opacity bluish-violet badge visible when cursor is inside the navigation menu area */}
                {badgeText && isMenuHovered ? (
                  <span
                    id={`sidebar-progress-${item.id}`}
                    className="inline-flex items-center justify-center transition-all duration-150 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap bg-indigo-500/12 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-200 border border-indigo-400/20 dark:border-indigo-400/20"
                  >
                    {badgeText}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
