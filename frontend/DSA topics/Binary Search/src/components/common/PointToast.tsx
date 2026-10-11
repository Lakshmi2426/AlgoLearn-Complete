import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface PointToastData {
  points: number; // e.g. -4, +10, -1, +3, +5
  reason: string; // e.g. "Guided Solve Used", "Hint Used", "Level Completed"
  pointsText?: string; // Optional custom text e.g. "-4 Points"
  type?: 'increase' | 'decrease';
}

interface PointToastProps {
  toast: PointToastData | null;
  onClose: () => void;
  duration?: number; // default 2000ms (2 seconds)
}

export const PointToast: React.FC<PointToastProps> = ({
  toast,
  onClose,
  duration = 2000,
}) => {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  const isIncrease = toast ? (toast.type ? toast.type === 'increase' : toast.points >= 0) : true;
  const formattedPoints = toast
    ? toast.pointsText ||
      (isIncrease
        ? `+${Math.abs(toast.points)} Points`
        : `-${Math.abs(toast.points)} Points`)
    : '';

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={`${toast.points}-${toast.reason}`}
          initial={{ opacity: 0, y: -24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white dark:bg-slate-900 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl border shadow-xl select-none max-w-[92vw] sm:max-w-md ${
            isIncrease
              ? 'border-emerald-200 dark:border-emerald-800 shadow-emerald-500/10'
              : 'border-rose-200 dark:border-rose-800 shadow-rose-500/10'
          }`}
          role="alert"
          aria-live="polite"
        >
          {/* Left Icon Badge in Squircle */}
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              isIncrease
                ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
            }`}
          >
            {isIncrease ? (
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <AlertCircle className="w-5 h-5 stroke-[2.5]" />
            )}
          </div>

          {/* Main Message: Points (colored) — Reason (bold dark) */}
          <div className="flex items-center gap-2 sm:gap-2.5 ml-3 mr-3 min-w-0">
            <span
              className={`font-black text-sm sm:text-base font-mono tracking-tight shrink-0 ${
                isIncrease
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formattedPoints}
            </span>

            <span className="text-slate-300 dark:text-slate-600 font-normal select-none">
              —
            </span>

            <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
              {toast.reason}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 -mr-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-auto"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
