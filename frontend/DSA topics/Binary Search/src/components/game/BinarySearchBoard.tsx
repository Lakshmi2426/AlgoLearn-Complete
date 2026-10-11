import React from 'react';
import { motion } from 'motion/react';
import { Target } from 'lucide-react';

interface BinarySearchBoardProps {
  array: number[];
  target: number;
  low: number;
  high: number;
  mid: number;
  isFound: boolean;
  isNotFound: boolean;
  highlightConcept?: 'range' | 'mid' | 'compare' | 'low' | 'high' | null;
}

export const BinarySearchBoard: React.FC<BinarySearchBoardProps> = ({
  array,
  target,
  low,
  high,
  mid,
  isFound,
  isNotFound,
  highlightConcept,
}) => {
  const activeCandidatesCount = Math.max(0, high - low + 1);

  return (
    <div className="w-full space-y-4">
      {/* Pointer Stats HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
        <div
          className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border transition-all shadow-2xs ${
            highlightConcept === 'compare'
              ? 'border-blue-500 ring-2 ring-blue-400/80 dark:ring-blue-500/80'
              : 'border-slate-200 dark:border-slate-700/80'
          }`}
        >
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider block">
            Target
          </span>
          <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400 font-mono flex items-center justify-center gap-1">
            <Target className="w-3.5 h-3.5" />
            {target}
          </span>
        </div>

        <div
          className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border transition-all shadow-2xs ${
            highlightConcept === 'low'
              ? 'border-amber-500 ring-2 ring-amber-400/80 dark:ring-amber-500/80'
              : 'border-slate-200 dark:border-slate-700/80'
          }`}
        >
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider block">
            Low Pointer
          </span>
          <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
            {low >= 0 && low < array.length ? `[${low}]` : low < 0 ? '[-1]' : `[${low}] (out)`}
          </span>
        </div>

        <div
          className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border transition-all shadow-2xs ${
            highlightConcept === 'mid' || highlightConcept === 'compare'
              ? 'border-indigo-500 ring-2 ring-indigo-400/80 dark:ring-indigo-500/80'
              : 'border-indigo-200 dark:border-indigo-800/80'
          }`}
        >
          <span className="text-[10px] uppercase font-mono font-bold text-indigo-500 dark:text-indigo-400 tracking-wider block">
            Mid Pointer
          </span>
          <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-300 font-mono">
            {low <= high && mid >= 0 && mid < array.length ? (
              <span>
                [{mid}] = <span className="font-extrabold underline">{array[mid]}</span>
              </span>
            ) : (
              '— (none)'
            )}
          </span>
        </div>

        <div
          className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border transition-all shadow-2xs ${
            highlightConcept === 'high'
              ? 'border-purple-500 ring-2 ring-purple-400/80 dark:ring-purple-500/80'
              : 'border-slate-200 dark:border-slate-700/80'
          }`}
        >
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider block">
            High Pointer
          </span>
          <span className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
            {high >= 0 && high < array.length ? `[${high}]` : high < 0 ? '[-1] (out)' : `[${high}]`}
          </span>
        </div>
      </div>

      {/* Array Container */}
      <div className="relative p-4 sm:p-6 bg-slate-900/90 dark:bg-slate-950/90 rounded-2xl border border-slate-700/80 dark:border-slate-800 shadow-inner overflow-x-auto">
        <div className="min-w-max mx-auto flex flex-col items-center justify-center py-2 px-1">
          {/* Top Indicators Row: Mid Badges & Indices */}
          <div className="flex gap-2 sm:gap-3 mb-2 items-end">
            {array.map((_, idx) => {
              const isMid = idx === mid && low <= high;
              const isCurrentLow = idx === low;
              const isCurrentHigh = idx === high;

              return (
                <div key={`top-${idx}`} className="w-11 sm:w-14 text-center flex flex-col items-center justify-end h-7">
                  {isMid && (
                    <motion.span
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-[10px] font-mono font-black text-indigo-200 bg-indigo-600 px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider"
                    >
                      MID
                    </motion.span>
                  )}
                  <span className="text-[11px] font-mono text-slate-400 font-semibold mt-0.5">
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>

          {/* Core Array Elements Row */}
          <div className="flex gap-2 sm:gap-3 py-1">
            {array.map((val, idx) => {
              const inRange = idx >= low && idx <= high;
              const isMid = idx === mid && low <= high;
              const isMatch = isFound && isMid;

              let cellStyle = 'bg-slate-800/40 text-slate-500 border-slate-700/50 opacity-40 grayscale';

              if (isMatch) {
                cellStyle =
                  'bg-emerald-600 text-white font-black border-emerald-400 shadow-lg shadow-emerald-500/40 scale-110 ring-2 ring-emerald-300';
              } else if (isMid) {
                cellStyle =
                  highlightConcept === 'mid' || highlightConcept === 'compare'
                    ? 'bg-indigo-600 text-white font-extrabold border-indigo-300 shadow-lg shadow-indigo-500/40 scale-110 ring-4 ring-indigo-400 animate-pulse'
                    : 'bg-indigo-600 text-white font-extrabold border-indigo-400 shadow-md shadow-indigo-500/30 scale-105 ring-2 ring-indigo-400/50';
              } else if (inRange) {
                if (highlightConcept === 'range') {
                  cellStyle =
                    'bg-slate-800 text-white font-bold border-blue-400 shadow-md ring-2 ring-blue-400/80';
                } else if (highlightConcept === 'low' && idx === low) {
                  cellStyle =
                    'bg-slate-800 text-white font-bold border-amber-400 shadow-md ring-2 ring-amber-400';
                } else if (highlightConcept === 'high' && idx === high) {
                  cellStyle =
                    'bg-slate-800 text-white font-bold border-purple-400 shadow-md ring-2 ring-purple-400';
                } else {
                  cellStyle =
                    'bg-slate-800 text-white font-bold border-blue-500/60 shadow-xs hover:border-blue-400';
                }
              }

              return (
                <motion.div
                  key={`cell-${idx}`}
                  layout
                  animate={{
                    scale: isMatch ? 1.1 : isMid ? 1.05 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`w-11 sm:w-14 h-12 sm:h-14 rounded-xl flex flex-col items-center justify-center font-mono text-sm sm:text-base border-2 transition-all select-none ${cellStyle}`}
                >
                  <span>{val}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Indicators Row: Low & High Badges */}
          <div className="flex gap-2 sm:gap-3 mt-2">
            {array.map((_, idx) => {
              const isCurrentLow = idx === low;
              const isCurrentHigh = idx === high;

              return (
                <div key={`bot-${idx}`} className="w-11 sm:w-14 text-center flex flex-col items-center min-h-[22px]">
                  {isCurrentLow && isCurrentHigh ? (
                    <span className="text-[10px] font-mono font-black text-amber-900 bg-amber-400 px-1 rounded shadow-xs uppercase">
                      L=H
                    </span>
                  ) : isCurrentLow ? (
                    <span className="text-[10px] font-mono font-black text-amber-950 bg-amber-400 px-1 rounded shadow-xs uppercase">
                      LOW
                    </span>
                  ) : isCurrentHigh ? (
                    <span className="text-[10px] font-mono font-black text-purple-100 bg-purple-600 px-1 rounded shadow-xs uppercase">
                      HIGH
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Range Status Line */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Active Range: <span className="text-white font-bold">[{low} .. {high}]</span> ({activeCandidatesCount} candidate{activeCandidatesCount === 1 ? '' : 's'})
            </span>
          </div>
          {low > high && (
            <span className="text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
              low ({low}) &gt; high ({high}) → Search Space Empty!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
