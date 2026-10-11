import React from 'react';
import { NavItem, TopicId } from '../types';
import { getActiveUserId, getUserItem } from '../utils/userStorage';
import {
  LayoutGrid,
  BookOpen,
  Sparkles,
  CircleHelp,
  TrendingUp,
  X
} from 'lucide-react';

interface NavigationSidebarProps {
  currentNav: NavItem;
  onSelectNav: (nav: NavItem) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  userId?: string;
  completedTopics?: TopicId[];
  quizScore?: { score: number; total: number } | null;
  quizProgress?: { completed: number; total: number } | null;
  completedVisualizations?: string[];
  isVideoCompleted?: boolean;
  isSoundOn?: boolean;
  onToggleSound?: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentNav,
  onSelectNav,
  isOpen,
  onToggleOpen,
  onClose,
  isDarkMode,
  userId,
  completedTopics = [],
  quizProgress = null,
  completedVisualizations = [],
  isVideoCompleted: propIsVideoCompleted,
}) => {
  const effectiveUserId = userId || getActiveUserId();
  const [isNavHovered, setIsNavHovered] = React.useState<boolean>(false);
  const [hoveredItemId, setHoveredItemId] = React.useState<NavItem | null>(null);

  // Read video completion status
  const isVideoDone = propIsVideoCompleted !== undefined ? propIsVideoCompleted : (() => {
    try {
      return getUserItem(effectiveUserId, 'video_completed') === 'true';
    } catch {
      return false;
    }
  })();

  // Activity counts matching lesson curriculum
  const totalActivities = 23;
  const learnTotal = 7;
  const vizTotal = 1; // Exactly 1 video lesson for visualize
  const quizTotal = 14;

  // Real dynamic completion
  const learnCompleted = Math.min(completedTopics.length, learnTotal);
  const vizCompleted = isVideoDone ? 1 : 0;
  const quizCompleted = quizProgress ? Math.min(quizProgress.completed, quizTotal) : (() => {
    try {
      const raw = getUserItem(effectiveUserId, 'quiz_progress');
      if (raw) return Math.min(JSON.parse(raw).completed, quizTotal);
      const state = getUserItem(effectiveUserId, 'quiz_state');
      if (state) return Math.min(Object.keys(JSON.parse(state).confirmedQuestions || {}).length, quizTotal);
    } catch {}
    return 0;
  })();

  const totalCompleted = Math.min(totalActivities, learnCompleted + vizCompleted + quizCompleted);
  const overallPercent = Math.min(100, Math.round((totalCompleted / totalActivities) * 100));

  const getBadgeValue = (id: NavItem): string => {
    switch (id) {
      case 'home':
        return `${totalCompleted} / 23`;
      case 'learn':
        return `${learnCompleted} / ${learnTotal}`;
      case 'visualize':
        return `${vizCompleted} / 1`;
      case 'quiz':
        return `${quizCompleted} / ${quizTotal}`;
      case 'progress':
        return `${overallPercent}%`;
      default:
        return `${totalCompleted} / 23`;
    }
  };

  // Exactly matching items in Screenshot (105) with Game removed
  const navItems: { id: NavItem; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Overview', icon: LayoutGrid },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'visualize', label: 'Visualize', icon: Sparkles },
    { id: 'quiz', label: 'Quiz', icon: CircleHelp },
    { id: 'progress', label: 'Progress', icon: TrendingUp }
  ];

  const handleNavClick = (id: NavItem) => {
    onSelectNav(id);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Backdrop (when sidebar is open on small screens) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Sidebar Container matching Screenshot (105) */}
      <aside
        id="app-navigation-sidebar"
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => {
          setIsNavHovered(false);
          setHoveredItemId(null);
        }}
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 sm:w-72 flex flex-col transition-transform duration-300 ease-in-out border-r ${
          isDarkMode
            ? 'bg-black border-zinc-900 text-slate-200 shadow-2xl shadow-black'
            : 'bg-white border-slate-200 text-slate-900 shadow-xl md:shadow-none'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header matching Screenshot (105) */}
        <div
          className={`px-4 py-4 flex items-center justify-between border-b ${
            isDarkMode ? 'border-zinc-900' : 'border-slate-200'
          }`}
        >
          <span className="text-xs font-bold tracking-wider uppercase text-slate-500 font-sans select-none">
            NAVIGATION MENU
          </span>

          {/* Close Button matching clean X in Screenshot (105) */}
          <button
            id="sidebar-close-btn"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            title="Close Navigation Menu"
            aria-label="Close Navigation Menu"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List matching Screenshot (105) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const badge = getBadgeValue(item.id);
              const isActive = item.id === currentNav;
              const isHovered = isNavHovered || hoveredItemId === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-150 cursor-pointer justify-start border ${
                    isActive
                      ? isDarkMode
                        ? 'bg-zinc-900 border-zinc-800 text-white font-semibold'
                        : 'bg-blue-50 border-blue-200 text-[#0f172a] font-bold shadow-xs'
                      : isDarkMode
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-zinc-900/60 border-transparent font-medium'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 border-transparent font-medium'
                  }`}
                >
                  {/* Icon Container: AlgoLearn gradient for active; soft bordered square for inactive */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#0066FF] to-[#2563EB] text-white shadow-md shadow-blue-500/20'
                        : isDarkMode
                        ? 'bg-zinc-950 border border-zinc-800 text-slate-400 group-hover:text-blue-400 group-hover:border-zinc-700'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:bg-blue-50/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Label with exact font size matching Screenshot (105) */}
                  <span
                    className={`text-sm tracking-tight ${
                      isActive
                        ? isDarkMode
                          ? 'text-white'
                          : 'text-[#0f172a]'
                        : isDarkMode
                        ? 'text-slate-300 group-hover:text-white'
                        : 'text-slate-800 group-hover:text-slate-950'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Progress Badge Pill - Only appears when cursor moves to the navigation menu */}
                  {isNavHovered && (
                    <span
                      className={`ml-auto text-xs font-mono font-bold px-2.5 py-0.5 rounded-full select-none transition-all duration-200 animate-fadeIn ${
                        isActive
                          ? isDarkMode
                            ? 'bg-zinc-800 text-blue-300 border border-zinc-700'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                          : isDarkMode
                          ? 'bg-zinc-950 text-blue-400 group-hover:bg-zinc-800 border border-zinc-800'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-800 border border-slate-200'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

