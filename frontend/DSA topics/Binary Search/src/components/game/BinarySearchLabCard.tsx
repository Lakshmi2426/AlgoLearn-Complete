import React from 'react';
import { FlaskConical, ArrowRight, Sliders, CheckCircle2, Layers } from 'lucide-react';

interface BinarySearchLabCardProps {
  onOpenLab: () => void;
}

export const BinarySearchLabCard: React.FC<BinarySearchLabCardProps> = ({ onOpenLab }) => {
  return (
    <div
      onClick={onOpenLab}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-blue-100/80 dark:border-slate-800 p-6 sm:p-8 lg:p-9 shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer hover:border-blue-200 dark:hover:border-blue-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
    >
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 flex-1 min-w-0">
        {/* Rounded-square icon container */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50/90 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-100/70 dark:group-hover:bg-blue-900/50 transition-all duration-300 shadow-2xs">
          <FlaskConical className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
        </div>

        {/* Text Content */}
        <div className="space-y-2.5 min-w-0 flex-1">
          {/* Badge & Sub-label */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/90 dark:border-blue-800/80">
              <FlaskConical className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Interactive Sandbox</span>
            </span>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              Open Experiment Ground
            </span>
          </div>

          {/* Main Heading */}
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            BINARY SEARCH EXPERIMENT LAB
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Free-form algorithm playground: input any custom sorted array, set any target value, step through comparisons in real time, inspect pointer updates, test edge cases (missing items, extreme duplicates), and observe step-by-step trace execution.
          </p>

          {/* Feature Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
              <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Custom Arrays &amp; Targets</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Duplicates &amp; Missing Edge Cases</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Step, Auto-Play &amp; Speed Slider</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0 flex items-center lg:self-center pt-2 lg:pt-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenLab();
          }}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md active:scale-98 cursor-pointer border border-blue-500/20"
        >
          <FlaskConical className="w-4 h-4" />
          <span>OPEN EXPERIMENT LAB</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

