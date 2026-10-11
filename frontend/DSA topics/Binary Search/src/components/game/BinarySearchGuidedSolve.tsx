import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Calculator,
  GitBranch,
  ArrowLeft,
  X,
  Target,
  Sparkles,
  AlertCircle,
  Play,
} from 'lucide-react';
import { GuidedStepDetails } from '../../services/guidedSolveEngine';

interface BinarySearchGuidedSolveProps {
  stepDetails: GuidedStepDetails;
  wrongAttempt: {
    action: string;
    message: string;
  } | null;
  onNextStep: () => void;
  onExitGuide: () => void;
  onSearchLeft: () => void;
  onSearchRight: () => void;
  onTargetFound: () => void;
  onTargetNotFound: () => void;
  onNextChallenge?: () => void;
  isSolved: boolean;
  isLastChallenge?: boolean;
}

export const BinarySearchGuidedSolve: React.FC<BinarySearchGuidedSolveProps> = ({
  stepDetails,
  wrongAttempt,
  onNextStep,
  onExitGuide,
  onSearchLeft,
  onSearchRight,
  onTargetFound,
  onTargetNotFound,
  onNextChallenge,
  isSolved,
  isLastChallenge = false,
}) => {
  const {
    subStage,
    stepNumber,
    totalSteps,
    low,
    high,
    mid,
    target,
    array,
    activeRangeCount,
    title,
    guidanceText,
    instructionPrompt,
    isWaitingForPlayer,
    midCalculation,
    comparison,
    boundaryUpdate,
    expectedAction,
  } = stepDetails;

  const progressPercent = Math.min(100, Math.max(0, (stepNumber / Math.max(1, totalSteps)) * 100));
  const midVal = mid >= 0 && mid < array.length ? array[mid] : null;

  // Determine label, icon, sublabel and style for the unified Next / Execute button
  const getNextActionConfig = () => {
    if (isSolved) {
      return {
        label: isLastChallenge ? 'Complete Level' : 'Next Challenge',
        sublabel: isLastChallenge ? 'All challenges solved!' : 'Proceed to next round',
        badge: 'Solved',
        isExecute: false,
        icon: Sparkles,
        style:
          'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-md shadow-emerald-600/20 border border-emerald-400/50',
      };
    }

    switch (subStage) {
      case 'EXPLAIN_RANGE':
        return {
          label: 'Next: Calculate Midpoint',
          sublabel: `Formula: Math.floor((${low} + ${high}) / 2)`,
          badge: 'Explain Step',
          isExecute: false,
          icon: Calculator,
          style:
            'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:brightness-110 text-white shadow-md shadow-orange-500/20 border border-amber-400/50',
        };
      case 'CALCULATE_MID':
        return {
          label: 'Next: Compare Target & Mid',
          sublabel: `Compare target ${target} with arr[${mid}] (${midVal})`,
          badge: 'Explain Step',
          isExecute: false,
          icon: GitBranch,
          style:
            'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:brightness-110 text-white shadow-md shadow-orange-500/20 border border-amber-400/50',
        };
      case 'COMPARE':
        if (expectedAction === 'LEFT') {
          return {
            label: 'Next: Execute Search Left',
            sublabel: `Eliminate right half • high = mid - 1 (${mid - 1})`,
            badge: 'Execute Step',
            isExecute: true,
            icon: ArrowLeft,
            style:
              'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:brightness-110 text-white shadow-md shadow-blue-500/30 border border-blue-400/60 ring-2 ring-blue-400/50 animate-pulse',
          };
        }
        if (expectedAction === 'RIGHT') {
          return {
            label: 'Next: Execute Search Right',
            sublabel: `Eliminate left half • low = mid + 1 (${mid + 1})`,
            badge: 'Execute Step',
            isExecute: true,
            icon: ArrowRight,
            style:
              'bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-700 hover:brightness-110 text-white shadow-md shadow-indigo-500/30 border border-indigo-400/60 ring-2 ring-indigo-400/50 animate-pulse',
          };
        }
        if (expectedAction === 'FOUND') {
          return {
            label: 'Next: Confirm Target Found',
            sublabel: `arr[${mid}] === ${target}`,
            badge: 'Execute Step',
            isExecute: true,
            icon: CheckCircle2,
            style:
              'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-md shadow-emerald-500/30 border border-emerald-400/60 ring-2 ring-emerald-400/50 animate-pulse',
          };
        }
        return {
          label: 'Next: Confirm Target Absent',
          sublabel: 'Pointers crossed (low > high) • Return -1',
          badge: 'Execute Step',
          isExecute: true,
          icon: XCircle,
          style:
            'bg-gradient-to-r from-rose-600 to-amber-600 hover:brightness-110 text-white shadow-md shadow-rose-500/30 border border-rose-400/60 ring-2 ring-rose-400/50 animate-pulse',
        };
      case 'ACTION_RESULT':
        return {
          label: 'Next Step: Continue Search',
          sublabel: 'Analyze new window & pointers',
          badge: 'Next Step',
          isExecute: false,
          icon: ArrowRight,
          style:
            'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:brightness-110 text-white shadow-md shadow-orange-500/20 border border-amber-400/50',
        };
      case 'TARGET_FOUND':
      case 'TARGET_NOT_FOUND':
        return {
          label: isLastChallenge ? 'Complete Level' : 'Next Challenge',
          sublabel: isLastChallenge ? 'All challenges solved!' : 'Proceed to next round',
          badge: 'Solved',
          isExecute: false,
          icon: Sparkles,
          style:
            'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-md shadow-emerald-600/20 border border-emerald-400/50',
        };
      default:
        return {
          label: 'Next Step',
          sublabel: 'Continue walkthrough',
          badge: 'Next Step',
          isExecute: false,
          icon: ArrowRight,
          style:
            'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:brightness-110 text-white shadow-md shadow-orange-500/20 border border-amber-400/50',
        };
    }
  };

  const nextConfig = getNextActionConfig();
  const NextIcon = nextConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="w-full rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-yellow-950/30 border-2 border-amber-400/80 dark:border-amber-500/60 shadow-md p-4 sm:p-5 space-y-4"
    >
      {/* Header: Title, Step Badge, Next Quick Button & Exit Button */}
      <div className="flex items-center justify-between gap-3 border-b border-amber-300/60 dark:border-amber-700/50 pb-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white shadow-xs">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">
                GUIDED SOLVE TUTOR
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wide bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                STEP {stepNumber} OF {totalSteps}
              </span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
              Interactive algorithm walkthrough • Step-by-step explain & execute
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Quick Step Button */}
          <button
            onClick={onNextStep}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${nextConfig.style}`}
            title="Advance or execute next step"
          >
            <NextIcon className="w-3.5 h-3.5" />
            <span>Next</span>
          </button>

          {/* Exit Guide Button */}
          <button
            onClick={onExitGuide}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
            title="Exit Guided Solve and resume normal game"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit Guide</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-amber-200/50 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Pointer Values HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
        <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Target</span>
          <span className="text-sm font-black text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
            <Target className="w-3 h-3" />
            {target}
          </span>
        </div>

        <div
          className={`p-2 rounded-xl bg-white dark:bg-slate-900 border transition-all shadow-2xs ${
            stepDetails.highlightConcept === 'low'
              ? 'ring-2 ring-amber-500 border-amber-400 bg-amber-50/80 dark:bg-amber-950/50'
              : 'border-amber-200 dark:border-amber-900/60'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Low Pointer</span>
          <span className="text-sm font-black text-amber-600 dark:text-amber-400">
            [{low}] {low >= 0 && low < array.length ? `(${array[low]})` : ''}
          </span>
        </div>

        <div
          className={`p-2 rounded-xl bg-white dark:bg-slate-900 border transition-all shadow-2xs ${
            stepDetails.highlightConcept === 'mid'
              ? 'ring-2 ring-indigo-500 border-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50'
              : 'border-amber-200 dark:border-amber-900/60'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Mid Pointer</span>
          <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
            {low <= high && mid >= 0 && mid < array.length ? `[${mid}] = ${midVal}` : '—'}
          </span>
        </div>

        <div
          className={`p-2 rounded-xl bg-white dark:bg-slate-900 border transition-all shadow-2xs ${
            stepDetails.highlightConcept === 'high'
              ? 'ring-2 ring-purple-500 border-purple-400 bg-purple-50/80 dark:bg-purple-950/50'
              : 'border-amber-200 dark:border-amber-900/60'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 block">High Pointer</span>
          <span className="text-sm font-black text-purple-600 dark:text-purple-400">
            [{high}] {high >= 0 && high < array.length ? `(${array[high]})` : ''}
          </span>
        </div>
      </div>

      {/* Main Guidance Stage Card */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-amber-300 dark:border-amber-800/80 shadow-xs space-y-3">
        {/* Stage Title */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h5 className="text-xs sm:text-sm font-black font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
            {title}
          </h5>
          <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-semibold">
            {instructionPrompt}
          </span>
        </div>

        {/* Guidance Text */}
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          {guidanceText}
        </p>

        {/* Stage Content: Formula (Stage 2) */}
        {subStage === 'CALCULATE_MID' && midCalculation && (
          <div className="p-3 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 font-mono text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300 uppercase">
              <Calculator className="w-3.5 h-3.5" />
              <span>Midpoint Integer Math</span>
            </div>
            <div className="space-y-1 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-slate-500 dark:text-slate-400">Standard Formula:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {midCalculation.evaluatedStandard}
                </span>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-slate-500 dark:text-slate-400">Safe Formula:</span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {midCalculation.evaluatedSafe}
                </span>
              </div>
              <p className="text-[11px] text-indigo-900/80 dark:text-indigo-300/80 pt-1 border-t border-indigo-200/60 dark:border-indigo-800/60">
                MID tells us which element to check next: <strong className="font-mono underline">arr[{midCalculation.midIndex}] = {midCalculation.midValue}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Stage Content: Range Info (Stage 1) */}
        {subStage === 'EXPLAIN_RANGE' && (
          <div className="p-3 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 font-mono text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-700 dark:text-blue-300 uppercase">
                Active Search Window
              </span>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                [{low} .. {high}] ({activeRangeCount} candidate{activeRangeCount === 1 ? '' : 's'})
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans">
              Because the array is strictly sorted in ascending order, the target is guaranteed to be within [low .. high] if it exists.
            </p>
          </div>
        )}

        {/* Stage Content: Comparison Display (Stage 3) */}
        {(subStage === 'COMPARE' || subStage === 'ACTION_RESULT') && comparison && (
          <div className="p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 uppercase">
                <GitBranch className="w-3.5 h-3.5" />
                <span>Value Comparison</span>
              </div>
              {/* Visual Expression Badge */}
              <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 font-mono font-black text-xs text-amber-900 dark:text-amber-200 shadow-2xs">
                {comparison.expression}
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
              {comparison.explanation}
            </p>
          </div>
        )}

        {/* Boundary Update Transition Explanation (Stage 4) */}
        {subStage === 'ACTION_RESULT' && boundaryUpdate && (
          <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 font-mono text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Boundary Updated Successfully</span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-1 text-[11px] sm:text-xs">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">
                {boundaryUpdate.pointerUpdated}: {boundaryUpdate.oldValue} → {boundaryUpdate.newValue}
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Formula: {boundaryUpdate.formula}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans">
              {boundaryUpdate.explanation}
            </p>
          </div>
        )}

        {/* Wrong Attempt Feedback Callout */}
        <AnimatePresence>
          {wrongAttempt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-xs space-y-1.5"
            >
              <div className="flex items-center gap-1.5 font-mono font-bold text-rose-700 dark:text-rose-300 uppercase">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>✕ Not quite. Try again!</span>
              </div>
              <p className="text-[11px] sm:text-xs text-rose-800 dark:text-rose-200 leading-relaxed font-sans">
                {wrongAttempt.message}
              </p>
              {comparison && (
                <div className="pt-1 text-[11px] font-mono font-bold text-rose-700 dark:text-rose-400">
                  Hint: {comparison.expression} → Think which side contains {target}.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Turn Callout & Action Controls */}
        {isWaitingForPlayer && !isSolved && (
          <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-100/60 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-300/60 dark:border-amber-800/60">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
                </span>
                <span className="text-xs font-mono font-black uppercase text-orange-700 dark:text-orange-400 tracking-wider">
                  ACTION REQUIRED
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
                  Step Execution
                </span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Click <strong>"Next: Execute Step"</strong> below or choose an action directly:
              </p>
            </div>

            {/* Quick Action Decision Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={onSearchLeft}
                className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  expectedAction === 'LEFT'
                    ? 'bg-blue-600 ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-slate-900 border-blue-400 scale-[1.02]'
                    : 'bg-blue-700/70 hover:bg-blue-600 border border-blue-500/40'
                }`}
              >
                <div className="flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Search Left</span>
                </div>
                {expectedAction === 'LEFT' && (
                  <span className="text-[9px] font-sans font-bold bg-blue-500/80 px-1.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </button>

              <button
                onClick={onTargetFound}
                className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  expectedAction === 'FOUND'
                    ? 'bg-emerald-600 ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-slate-900 border-emerald-400 scale-[1.02]'
                    : 'bg-emerald-700/70 hover:bg-emerald-600 border border-emerald-500/40'
                }`}
              >
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Target Found</span>
                </div>
                {expectedAction === 'FOUND' && (
                  <span className="text-[9px] font-sans font-bold bg-emerald-500/80 px-1.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </button>

              <button
                onClick={onSearchRight}
                className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  expectedAction === 'RIGHT'
                    ? 'bg-indigo-600 ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-900 border-indigo-400 scale-[1.02]'
                    : 'bg-indigo-700/70 hover:bg-indigo-600 border border-indigo-500/40'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>Search Right</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                {expectedAction === 'RIGHT' && (
                  <span className="text-[9px] font-sans font-bold bg-indigo-500/80 px-1.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </button>

              <button
                onClick={onTargetNotFound}
                className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white shadow-sm flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  expectedAction === 'NOT_FOUND'
                    ? 'bg-rose-600 ring-2 ring-rose-400 ring-offset-2 dark:ring-offset-slate-900 border-rose-400 scale-[1.02]'
                    : 'bg-rose-700/70 hover:bg-rose-600 border border-rose-500/40'
                }`}
              >
                <div className="flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Not Found</span>
                </div>
                {expectedAction === 'NOT_FOUND' && (
                  <span className="text-[9px] font-sans font-bold bg-rose-500/80 px-1.5 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Bar: Prominent Next Button (Explains & Executes Step by Step) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-amber-300/40 dark:border-amber-800/40">
        <button
          onClick={onExitGuide}
          className="px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Guide</span>
        </button>

        {/* Primary Step Button: Explains and executes step by step */}
        <button
          onClick={onNextStep}
          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-between sm:justify-center gap-3 cursor-pointer transition-all active:scale-98 ${nextConfig.style}`}
        >
          <div className="flex items-center gap-2.5 text-left">
            <div className="p-1 rounded-lg bg-white/20">
              <NextIcon className="w-4 h-4 shrink-0" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="leading-tight">{nextConfig.label}</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-black/20 rounded-sm uppercase tracking-normal">
                  {nextConfig.badge}
                </span>
              </div>
              {nextConfig.sublabel && (
                <span className="text-[10px] font-sans font-normal opacity-90 leading-tight">
                  {nextConfig.sublabel}
                </span>
              )}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 ml-2 shrink-0 opacity-80" />
        </button>
      </div>
    </motion.div>
  );
};
