import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Sparkles,
  CheckCircle2,
  XCircle,
  Code2,
  ListOrdered,
  FlaskConical,
} from 'lucide-react';
import { soundEffects } from '../../services/sound';

interface InGameLabProps {
  onBackToGame: () => void;
}

interface StepState {
  stepIndex: number;
  low: number;
  high: number;
  mid: number;
  midVal: number | null;
  comparison: string;
  actionDescription: string;
  status: 'searching' | 'found' | 'not-found';
  codeLine: number; // 1 to 7
}

export const InGameLab: React.FC<InGameLabProps> = ({ onBackToGame }) => {
  // Preset array configurations
  const presets = [
    { label: 'Standard Found', array: [4, 9, 15, 23, 38, 47, 59, 72, 88], target: 38 },
    { label: 'Missing Element', array: [5, 12, 19, 28, 37, 46, 55], target: 30 },
    { label: 'Duplicate Run', array: [10, 20, 20, 20, 30, 40, 50], target: 20 },
    { label: 'Large (16 Items)', array: [3, 8, 14, 21, 29, 36, 42, 51, 60, 68, 77, 82, 90, 95, 102, 110], target: 82 },
    { label: 'Lower Boundary', array: [2, 7, 14, 21, 35, 49, 63], target: 2 },
  ];

  const [array, setArray] = useState<number[]>(presets[0].array);
  const [target, setTarget] = useState<number>(presets[0].target);
  const [customArrayStr, setCustomArrayStr] = useState<string>(presets[0].array.join(', '));
  const [customTargetStr, setCustomTargetStr] = useState<string>(presets[0].target.toString());

  // Search Step Execution
  const [steps, setSteps] = useState<StepState[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1000); // ms per step

  // Compute all steps deterministically
  useEffect(() => {
    const computed: StepState[] = [];
    let low = 0;
    let high = array.length - 1;
    let stepCount = 0;

    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2);
      const midVal = array[mid];
      stepCount++;

      if (midVal === target) {
        computed.push({
          stepIndex: stepCount,
          low,
          high,
          mid,
          midVal,
          comparison: `arr[${mid}] (${midVal}) === target (${target})`,
          actionDescription: `Match found at index [${mid}]! Terminating search.`,
          status: 'found',
          codeLine: 4,
        });
        break;
      } else if (target < midVal) {
        computed.push({
          stepIndex: stepCount,
          low,
          high,
          mid,
          midVal,
          comparison: `target (${target}) < arr[${mid}] (${midVal})`,
          actionDescription: `Target is smaller than mid. Search left: high = ${mid - 1}.`,
          status: 'searching',
          codeLine: 5,
        });
        high = mid - 1;
      } else {
        computed.push({
          stepIndex: stepCount,
          low,
          high,
          mid,
          midVal,
          comparison: `target (${target}) > arr[${mid}] (${midVal})`,
          actionDescription: `Target is greater than mid. Search right: low = ${mid + 1}.`,
          status: 'searching',
          codeLine: 6,
        });
        low = mid + 1;
      }
    }

    if (low > high) {
      stepCount++;
      computed.push({
        stepIndex: stepCount,
        low,
        high,
        mid: -1,
        midVal: null,
        comparison: `low (${low}) > high (${high})`,
        actionDescription: `Search window is empty! Target ${target} is NOT present in array. Return -1.`,
        status: 'not-found',
        codeLine: 7,
      });
    }

    setSteps(computed);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [array, target]);

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < steps.length - 1) {
            soundEffects.playClick();
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playSpeed, steps.length]);

  const activeStep = steps[currentStepIdx] || {
    stepIndex: 1,
    low: 0,
    high: array.length - 1,
    mid: Math.floor((array.length - 1) / 2),
    midVal: array[Math.floor((array.length - 1) / 2)],
    comparison: 'Ready to search',
    actionDescription: 'Start stepping to begin binary search.',
    status: 'searching' as const,
    codeLine: 1,
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playClick();

    // Parse array
    const parsed = customArrayStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    if (parsed.length >= 2) {
      parsed.sort((a, b) => a - b);
      setArray(parsed);
      setCustomArrayStr(parsed.join(', '));
    }

    const parsedTarget = parseInt(customTargetStr, 10);
    if (!isNaN(parsedTarget)) {
      setTarget(parsedTarget);
    }
  };

  const handleSelectPreset = (p: typeof presets[0]) => {
    soundEffects.playClick();
    setArray([...p.array]);
    setTarget(p.target);
    setCustomArrayStr(p.array.join(', '));
    setCustomTargetStr(p.target.toString());
  };

  const pseudocodeLines = [
    { lineNum: 1, code: 'function binarySearch(arr, target):' },
    { lineNum: 2, code: '  low = 0, high = arr.length - 1' },
    { lineNum: 3, code: '  while low <= high:' },
    { lineNum: 4, code: '    mid = low + Math.floor((high - low) / 2)' },
    { lineNum: 5, code: '    if arr[mid] == target: return mid' },
    { lineNum: 6, code: '    elif target < arr[mid]: high = mid - 1' },
    { lineNum: 7, code: '    else: low = mid + 1' },
    { lineNum: 8, code: '  return -1 // Target not found' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onBackToGame();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-300 dark:border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Binary Search Battle</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Experiment Sandbox</span>
          </div>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          Preset Demonstrations:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                target === p.target && array.length === p.array.length
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              {p.label} (Target: {p.target})
            </button>
          ))}
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleApplyCustom} className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1 space-y-1 w-full">
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase">
              Custom Sorted Array (comma-separated):
            </label>
            <input
              type="text"
              value={customArrayStr}
              onChange={(e) => setCustomArrayStr(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 5, 10, 15, 20, 25"
            />
          </div>

          <div className="w-full md:w-32 space-y-1">
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase">
              Target Value:
            </label>
            <input
              type="number"
              value={customTargetStr}
              onChange={(e) => setCustomTargetStr(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Apply & Reset
          </button>
        </form>
      </div>

      {/* Target & Pointer HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Target</span>
          <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">{target}</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Low Pointer</span>
          <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
            {activeStep.low >= 0 && activeStep.low < array.length ? `[${activeStep.low}]` : `[${activeStep.low}]`}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 shadow-2xs">
          <span className="text-[10px] uppercase font-mono font-bold text-indigo-500 dark:text-indigo-400 block">Mid Pointer</span>
          <span className="text-lg font-black text-indigo-600 dark:text-indigo-300 font-mono">
            {activeStep.mid >= 0 && activeStep.mid < array.length
              ? `[${activeStep.mid}] = ${array[activeStep.mid]}`
              : '—'}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">High Pointer</span>
          <span className="text-lg font-black text-purple-600 dark:text-purple-400 font-mono">
            {activeStep.high >= 0 && activeStep.high < array.length ? `[${activeStep.high}]` : `[${activeStep.high}]`}
          </span>
        </div>
      </div>

      {/* Main Interactive Array Board */}
      <div className="p-4 sm:p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-x-auto">
        <div className="min-w-max mx-auto flex flex-col items-center justify-center py-2 px-1">
          {/* Top Indicators: Mid */}
          <div className="flex gap-2 sm:gap-3 mb-2 items-end h-7">
            {array.map((_, idx) => {
              const isMid = idx === activeStep.mid && activeStep.low <= activeStep.high;
              return (
                <div key={`lab-top-${idx}`} className="w-11 sm:w-14 text-center flex flex-col items-center justify-end">
                  {isMid && (
                    <span className="text-[10px] font-mono font-black text-indigo-200 bg-indigo-600 px-1.5 py-0.5 rounded shadow-xs uppercase">
                      MID
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
          <div className="flex gap-2 sm:gap-3 py-1">
            {array.map((val, idx) => {
              const inRange = idx >= activeStep.low && idx <= activeStep.high;
              const isMid = idx === activeStep.mid && activeStep.low <= activeStep.high;
              const isMatch = activeStep.status === 'found' && isMid;

              let cellStyle = 'bg-slate-800/40 text-slate-500 border-slate-700/50 opacity-40 grayscale';

              if (isMatch) {
                cellStyle =
                  'bg-emerald-600 text-white font-black border-emerald-400 shadow-lg shadow-emerald-500/40 scale-110 ring-2 ring-emerald-300';
              } else if (isMid) {
                cellStyle =
                  'bg-indigo-600 text-white font-extrabold border-indigo-400 shadow-md shadow-indigo-500/30 scale-105 ring-2 ring-indigo-400/50';
              } else if (inRange) {
                cellStyle = 'bg-slate-800 text-white font-bold border-blue-500/60 shadow-xs';
              }

              return (
                <motion.div
                  key={`lab-cell-${idx}`}
                  layout
                  className={`w-11 sm:w-14 h-12 sm:h-14 rounded-xl flex flex-col items-center justify-center font-mono text-sm sm:text-base border-2 transition-all select-none ${cellStyle}`}
                >
                  <span>{val}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Indicators: Low & High */}
          <div className="flex gap-2 sm:gap-3 mt-2">
            {array.map((_, idx) => {
              const isCurrentLow = idx === activeStep.low;
              const isCurrentHigh = idx === activeStep.high;

              return (
                <div key={`lab-bot-${idx}`} className="w-11 sm:w-14 text-center flex flex-col items-center min-h-[22px]">
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
      </div>

      {/* Playback Controls Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setCurrentStepIdx(0);
              setIsPlaying(false);
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Prev */}
          <button
            onClick={() => {
              if (currentStepIdx > 0) {
                soundEffects.playClick();
                setCurrentStepIdx(currentStepIdx - 1);
                setIsPlaying(false);
              }
            }}
            disabled={currentStepIdx === 0}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1 border transition-all ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200 dark:border-slate-800'
                : 'text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => {
              soundEffects.playClick();
              if (currentStepIdx >= steps.length - 1) {
                setCurrentStepIdx(0);
              }
              setIsPlaying(!isPlaying);
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Next */}
          <button
            onClick={() => {
              if (currentStepIdx < steps.length - 1) {
                soundEffects.playClick();
                setCurrentStepIdx(currentStepIdx + 1);
                setIsPlaying(false);
              }
            }}
            disabled={currentStepIdx >= steps.length - 1}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1 border transition-all ${
              currentStepIdx >= steps.length - 1
                ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200 dark:border-slate-800'
                : 'text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator & Speed */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Step <span className="text-blue-600 dark:text-blue-400 font-extrabold">{currentStepIdx + 1}</span> of {steps.length}
          </span>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {[
              { label: '0.5x', speed: 1800 },
              { label: '1x', speed: 1000 },
              { label: '2x', speed: 500 },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => setPlaySpeed(s.speed)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                  playSpeed === s.speed
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trace Log & Pseudocode Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Step Action & Explanation */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            <ListOrdered className="w-4 h-4 text-blue-500" />
            <span>Active Step Analysis</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
              Comparison: {activeStep.comparison}
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {activeStep.actionDescription}
            </p>
          </div>

          {/* Result Status Banner */}
          {activeStep.status === 'found' && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Target {target} located at index [{activeStep.mid}]! (Total steps: {currentStepIdx + 1})</span>
            </div>
          )}

          {activeStep.status === 'not-found' && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>Search space exhausted (low &gt; high). Target {target} is NOT in array. Returned -1.</span>
            </div>
          )}
        </div>

        {/* Pseudocode Highlighter */}
        <div className="p-5 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 shadow-xs space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Pseudocode Execution Line</span>
          </div>

          <div className="space-y-1">
            {pseudocodeLines.map((line) => {
              const isCurrent = line.lineNum === activeStep.codeLine;
              return (
                <div
                  key={line.lineNum}
                  className={`px-3 py-1 rounded transition-colors flex items-center gap-3 ${
                    isCurrent
                      ? 'bg-blue-600/30 text-blue-200 border-l-2 border-blue-400 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="text-[10px] text-slate-600 w-4 text-right select-none">
                    {line.lineNum}
                  </span>
                  <span className="whitespace-pre">{line.code}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
