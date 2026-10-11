import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  ChevronRight,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

export const InteractiveBinarySearch: React.FC = () => {
  const defaultArray = [5, 11, 18, 23, 37, 45, 62];
  const [array] = useState<number[]>(defaultArray);
  const [target, setTarget] = useState<number>(23);
  const [customInput, setCustomInput] = useState<string>('23');

  // Step state
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'not-found'>('idle');

  // Precomputed steps for current array & target
  const computeSteps = (arr: number[], tgt: number) => {
    const steps: {
      low: number;
      high: number;
      mid: number;
      midVal: number;
      comparison: string;
      action: string;
      found: boolean;
      eliminatedLeft?: boolean;
      eliminatedRight?: boolean;
    }[] = [];

    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      const midVal = arr[mid];

      if (midVal === tgt) {
        steps.push({
          low,
          high,
          mid,
          midVal,
          comparison: `arr[${mid}] (${midVal}) === target (${tgt})`,
          action: `Target ${tgt} found at index ${mid}!`,
          found: true,
        });
        break;
      } else if (midVal < tgt) {
        steps.push({
          low,
          high,
          mid,
          midVal,
          comparison: `arr[${mid}] (${midVal}) < target (${tgt})`,
          action: `Target is greater. Eliminate left half including mid. Update low = mid + 1 (${mid + 1}).`,
          found: false,
          eliminatedLeft: true,
        });
        low = mid + 1;
      } else {
        steps.push({
          low,
          high,
          mid,
          midVal,
          comparison: `arr[${mid}] (${midVal}) > target (${tgt})`,
          action: `Target is smaller. Eliminate right half including mid. Update high = mid - 1 (${mid - 1}).`,
          found: false,
          eliminatedRight: true,
        });
        high = mid - 1;
      }
    }

    if (low > high) {
      steps.push({
        low,
        high,
        mid: -1,
        midVal: -1,
        comparison: `low (${low}) > high (${high})`,
        action: `Search space is empty! Target ${tgt} is NOT FOUND in array. Return -1.`,
        found: false,
      });
    }

    return steps;
  };

  const steps = computeSteps(array, target);
  const currentStep = steps[stepIndex] || steps[0];

  const handleNextStep = () => {
    soundEffects.playClick();
    if (stepIndex < steps.length - 1) {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      if (steps[nextIdx].found) {
        setStatus('found');
        soundEffects.playSuccess();
      } else if (steps[nextIdx].mid === -1) {
        setStatus('not-found');
      } else {
        setStatus('searching');
      }
    }
  };

  const handleReset = () => {
    soundEffects.playClick();
    setStepIndex(0);
    setStatus('idle');
  };

  const handleSelectPreset = (tgt: number) => {
    soundEffects.playClick();
    setTarget(tgt);
    setCustomInput(tgt.toString());
    setStepIndex(0);
    setStatus('idle');
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val)) {
      soundEffects.playClick();
      setTarget(val);
      setStepIndex(0);
      setStatus('idle');
    }
  };

  const activeLow = currentStep.low;
  const activeHigh = currentStep.high;
  const activeMid = currentStep.mid;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-2xs">
      {/* Controls & Target Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 font-mono uppercase tracking-wider">
              Step-by-Step Binary Search Interactive Lab
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            Array is sorted: <span className="font-mono font-semibold">[5, 11, 18, 23, 37, 45, 62]</span>
          </p>
        </div>

        {/* Preset Target Selector Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
            Test Examples:
          </span>
          <button
            onClick={() => handleSelectPreset(23)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              target === 23
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Target = 23 (Found)
          </button>
          <button
            onClick={() => handleSelectPreset(30)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              target === 30
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Target = 30 (Not Found)
          </button>
        </div>
      </div>

      {/* Target & Pointer HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Target Value</span>
          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">{target}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Low Pointer</span>
          <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 font-mono">
            {activeLow <= array.length ? activeLow : 'out of range'}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Mid Pointer</span>
          <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            {activeMid >= 0 ? `${activeMid} (Val: ${array[activeMid]})` : '—'}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">High Pointer</span>
          <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 font-mono">
            {activeHigh >= -1 ? activeHigh : 'out of range'}
          </span>
        </div>
      </div>

      {/* Array Visualization Box */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto flex flex-col items-center justify-center min-h-[160px]">
        {/* Pointers Row Above */}
        <div className="flex gap-2 sm:gap-3 mb-2">
          {array.map((_, idx) => {
            const isMid = idx === activeMid;
            const isLow = idx === activeLow;
            const isHigh = idx === activeHigh;

            return (
              <div key={idx} className="w-10 sm:w-14 text-center flex flex-col items-center">
                {isMid && (
                  <span className="text-[10px] font-mono font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1 rounded border border-indigo-200 dark:border-indigo-800">
                    mid
                  </span>
                )}
                <span className="text-[11px] font-mono text-slate-400 font-semibold mt-0.5">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>

        {/* Array Cells */}
        <div className="flex gap-2 sm:gap-3">
          {array.map((val, idx) => {
            const isMid = idx === activeMid;
            const inRange = idx >= activeLow && idx <= activeHigh;
            const isTargetMatch = currentStep.found && isMid;

            let cellBg = 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-40';
            let borderColor = 'border-slate-200 dark:border-slate-700';

            if (inRange) {
              if (isTargetMatch) {
                cellBg = 'bg-emerald-500 text-white font-black shadow-md shadow-emerald-500/30 scale-105';
                borderColor = 'border-emerald-600';
              } else if (isMid) {
                cellBg = 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/30 scale-105';
                borderColor = 'border-blue-700';
              } else {
                cellBg = 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold';
                borderColor = 'border-blue-200 dark:border-blue-800';
              }
            }

            return (
              <motion.div
                key={idx}
                animate={{ scale: isMid ? 1.06 : 1 }}
                className={`w-10 sm:w-14 h-12 sm:h-14 rounded-xl flex flex-col items-center justify-center font-mono text-sm sm:text-base border-2 transition-all ${cellBg} ${borderColor}`}
              >
                <span>{val}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Pointers Row Below (low / high) */}
        <div className="flex gap-2 sm:gap-3 mt-2">
          {array.map((_, idx) => {
            const isLow = idx === activeLow;
            const isHigh = idx === activeHigh;

            return (
              <div key={idx} className="w-10 sm:w-14 text-center flex flex-col items-center">
                {isLow && (
                  <span className="text-[10px] font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1 rounded border border-blue-200 dark:border-blue-800">
                    low
                  </span>
                )}
                {isHigh && (
                  <span className="text-[10px] font-mono font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-1 rounded border border-purple-200 dark:border-purple-800 mt-0.5">
                    high
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation & Action Box */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Step {stepIndex + 1} of {steps.length}: {currentStep.comparison}
            </span>
          </div>

          {currentStep.found ? (
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> FOUND!
            </span>
          ) : currentStep.mid === -1 ? (
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> NOT FOUND
            </span>
          ) : (
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
              Comparing Middle
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
          {currentStep.action}
        </p>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Each comparison removes roughly half of the remaining search space.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleNextStep}
            disabled={stepIndex >= steps.length - 1}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Next Comparison Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Custom Target Input */}
        <form onSubmit={handleApplyCustom} className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <span className="text-[11px] font-mono text-slate-500">Custom Target:</span>
          <input
            type="number"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="w-16 px-2 py-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 text-center"
          />
          <button
            type="submit"
            className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-lg transition-colors cursor-pointer"
          >
            Set
          </button>
        </form>
      </div>

      {/* Important Beginner Warning Footer */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-800/50 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          <strong>Important:</strong> Binary Search requires the data to be sorted.
        </span>
      </div>
    </div>
  );
};
