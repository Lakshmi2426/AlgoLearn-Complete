import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, ArrowRight, CheckCircle2, Sparkles, Grid } from 'lucide-react';

interface LevelCompleteModalProps {
  isOpen: boolean;
  level: {
    id: number;
    levelNumber: number;
    title: string;
    subtitle?: string;
  };
  xpEarned: number;
  pointsEarned?: number;
  comparisonsCount?: number;
  mistakes: number;
  outcomeText?: string;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReturnToLevels: () => void;
  onReplayLevel?: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  level,
  xpEarned,
  pointsEarned = 10,
  comparisonsCount = 3,
  mistakes,
  outcomeText = 'TARGET FOUND',
  hasNextLevel,
  onNextLevel,
  onReturnToLevels,
}) => {
  if (!isOpen) return null;

  const isFinalLevel = level.levelNumber === 6 || !hasNextLevel;
  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
  const accuracyText = mistakes === 0 ? '100% (Flawless)' : `${Math.max(60, 100 - mistakes * 15)}%`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-2 border-slate-200 dark:border-slate-800 space-y-5"
        >
          {/* Header Trophy / Checkmark Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
            {isFinalLevel ? <Trophy className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />}
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              {isFinalLevel ? '✓ FINAL LEVEL COMPLETE!' : '✓ LEVEL COMPLETE!'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
              {outcomeText}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              {level.title}
            </p>
          </div>

          {/* Final Level Congratulatory Message */}
          {isFinalLevel && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-400/40 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono">
              🎉 Congratulations! You completed all Binary Search levels.
            </div>
          )}

          {/* Stars Rating */}
          <div className="flex items-center justify-center gap-2 py-0.5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Star
                key={idx}
                className={`w-6 h-6 ${
                  idx < stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                    : 'text-slate-200 dark:text-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Detailed Useful Completion Stats */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Topic Points
              </span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center justify-center gap-0.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                +{pointsEarned !== undefined && pointsEarned > 0 ? pointsEarned : 10} pts
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Comparisons
              </span>
              <span className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 block">
                {comparisonsCount}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Accuracy
              </span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5 block">
                {accuracyText}
              </span>
            </div>
          </div>

          {/* Action Buttons: RETURN TO LEVELS and NEXT LEVEL */}
          <div className="flex flex-col gap-2.5 pt-2">
            {!isFinalLevel ? (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={onReturnToLevels}
                  className="flex-1 py-3.5 px-4 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Grid className="w-4 h-4" />
                  <span>RETURN TO LEVELS</span>
                </button>

                <button
                  onClick={onNextLevel}
                  className="flex-1 py-3.5 px-4 rounded-xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>NEXT LEVEL</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onReturnToLevels}
                className="w-full py-4 px-4 rounded-xl font-mono text-sm font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Grid className="w-4 h-4" />
                <span>RETURN TO LEVELS</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
