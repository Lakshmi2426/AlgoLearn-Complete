import React from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Play } from 'lucide-react';
import { GameMetaData } from '../../data/gameMeta';

interface LevelCardGridProps {
  levels: GameMetaData[];
  activeLevelId: number;
  completedLevelIds: number[];
  levelScores?: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
}

export const LevelCardGrid: React.FC<LevelCardGridProps> = ({
  levels,
  activeLevelId,
  completedLevelIds = [],
  levelScores = {},
  onSelectLevel,
}) => {
  // Ensure completedLevelIds is safely an array
  const safeCompleted = Array.isArray(completedLevelIds) ? completedLevelIds : [];
  // Highest unlocked level is 1 or max(completed) + 1
  const maxCompleted = safeCompleted.length > 0 ? Math.max(...safeCompleted) : 0;
  const highestUnlocked = Math.max(1, maxCompleted + 1);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'MEDIUM':
      case 'Medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800';
      case 'MEDIUM-HARD':
      case 'Medium-Hard':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800';
      case 'HARD':
      case 'Hard':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800';
      case 'DIFFICULT':
      case 'Difficult':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800';
      case 'Beginner':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800';
      case 'Intermediate':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800';
      case 'Advanced':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800';
      case 'Expert':
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <span>Campaign Progression (6 Levels)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select an unlocked level to launch its Binary Search challenge.
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          Completed: {safeCompleted.length} / {levels.length}
        </div>
      </div>

      {/* Responsive 3-column grid for 6 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((lvl) => {
          const isCompleted = safeCompleted.includes(lvl.id);
          const isCurrent = lvl.id === activeLevelId;
          const isUnlocked = lvl.id <= highestUnlocked || isCompleted;

          let cardBorder = 'border-slate-200 dark:border-slate-800';
          let cardBg = 'bg-white dark:bg-slate-900';

          if (isCurrent) {
            cardBorder = 'border-blue-500 ring-2 ring-blue-400/40 shadow-lg shadow-blue-500/15';
            cardBg = 'bg-blue-50/40 dark:bg-blue-950/20';
          } else if (isCompleted) {
            cardBorder = 'border-emerald-300 dark:border-emerald-800/80';
          } else if (!isUnlocked) {
            cardBorder = 'border-slate-200/60 dark:border-slate-800/60 opacity-60';
            cardBg = 'bg-slate-50/60 dark:bg-slate-900/40';
          }

          return (
            <motion.div
              key={lvl.id}
              whileHover={isUnlocked ? { y: -3 } : {}}
              onClick={() => {
                if (isUnlocked) {
                  onSelectLevel(lvl.id);
                }
              }}
              className={`rounded-2xl p-4 sm:p-5 border transition-all relative flex flex-col justify-between select-none ${cardBg} ${cardBorder} ${
                isUnlocked ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed'
              }`}
            >
              <div>
                {/* Top Row: Level number, Status & Difficulty */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    {/* Status Icon */}
                    {isCompleted ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 text-[10px] font-mono font-black">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>COMPLETED</span>
                      </span>
                    ) : isCurrent ? (
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1 text-[10px] font-mono font-black animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>CURRENT</span>
                      </span>
                    ) : !isUnlocked ? (
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 flex items-center gap-1 text-[10px] font-mono font-bold">
                        <Lock className="w-2.5 h-2.5" />
                        <span>LOCKED</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1 text-[10px] font-mono font-bold">
                        <span>AVAILABLE</span>
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                      lvl.difficulty
                    )}`}
                  >
                    {lvl.difficulty}
                  </span>
                </div>

                {/* Level Title & Number */}
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                    Level {lvl.levelNumber < 10 ? `0${lvl.levelNumber}` : lvl.levelNumber}
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono line-clamp-1">
                    {lvl.shortTitle || lvl.title}
                  </h4>
                </div>

                {/* Subtitle / Objective */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed min-h-[32px]">
                  {lvl.tagline || lvl.description}
                </p>
              </div>

              <div>
                {/* Meta Row: 10 Points */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Points
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    10 Points
                  </span>
                </div>

                {/* Explicit Interactive Action Button */}
                <div className="mt-3">
                  {!isUnlocked ? (
                    <div className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Complete Level {lvl.levelNumber - 1} to Unlock</span>
                    </div>
                  ) : isCompleted ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLevel(lvl.id);
                      }}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-2xs"
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                      <span>PLAY AGAIN</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLevel(lvl.id);
                      }}
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>PLAY LEVEL</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
