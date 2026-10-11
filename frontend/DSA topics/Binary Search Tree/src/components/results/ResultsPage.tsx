import React, { useMemo } from 'react';
import {
  Trophy,
  TrendingUp,
  BookOpen,
  Eye,
  Gamepad2,
  Brain,
} from 'lucide-react';
import { useUserProgress } from '../../context/UserProgressContext';
import { soundManager } from '../../utils/audio';

interface ResultsPageProps {
  onGoToHome?: () => void;
  onGoToLearn?: (topicIndex?: number) => void;
  onGoToGame?: (level?: number) => void;
  onGoToQuiz?: () => void;
  onGoToPractice?: () => void;
  onGoToVisualize?: (topicId?: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  onGoToLearn,
  onGoToGame,
  onGoToQuiz,
  onGoToVisualize,
}) => {
  const {
    visualizationPoints,
    gamePoints,
    quizPoints,
    totalTopicPoints,
    visualizeCompletedCount,
    gameCompletedCount,
    quizCompletedCount,
    overviewCompletedCount,
    overallCompletionPercentage,
  } = useUserProgress();

  const completedActivitiesCount = overviewCompletedCount;

  const overallPercentage = useMemo(() => {
    return overallCompletionPercentage;
  }, [overallCompletionPercentage]);

  const visualizePercentage = useMemo(() => {
    return Math.min(100, Math.round((visualizeCompletedCount / 5) * 100));
  }, [visualizeCompletedCount]);

  const gamePercentage = useMemo(() => {
    return Math.min(100, Math.round((gameCompletedCount / 5) * 100));
  }, [gameCompletedCount]);

  const quizPercentage = useMemo(() => {
    return Math.min(100, Math.round((quizCompletedCount / 10) * 100));
  }, [quizCompletedCount]);

  return (
    <div
      id="bst-progress-dashboard"
      className="space-y-6 pb-20 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white max-w-7xl mx-auto"
    >
      {/* =========================================================
          REFERRED CARD 1: LEARNING PROGRESS & OVERALL COMPLETION
          ========================================================= */}
      <section
        id="card-learning-progress"
        className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-[#1b253b] p-6 sm:p-7 shadow-sm dark:shadow-xl text-slate-900 dark:text-slate-100 transition-colors"
      >
        {/* Top Header */}
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563eb] via-[#4f46e5] to-[#9333ea] flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
              BST Learning Progress
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Track your journey through BST concepts, algorithms, problem solving, complexity, and practical applications.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold font-mono tracking-wider text-slate-700 dark:text-slate-200 uppercase">
                OVERALL COMPLETION
              </span>
              <span className="px-3 py-0.5 rounded-full bg-slate-100 dark:bg-[#162036] border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                {totalTopicPoints} / 100 Points • {completedActivitiesCount} of 40 Activities
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Complete all learning activities to master BST and earn 100 points.
            </p>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-[#2563eb] font-mono tracking-tight text-left sm:text-right">
            {overallPercentage}%
          </div>
        </div>

        {/* Full-width Progress Bar */}
        <div className="mt-3.5 w-full h-3 sm:h-3.5 bg-slate-100 dark:bg-[#080d19] rounded-full border border-slate-200 dark:border-slate-800/80 p-0.5 relative overflow-hidden flex items-center">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8] transition-all duration-500 shadow-[0_0_12px_rgba(37,99,235,0.7)]"
            style={{ width: `${overallPercentage === 0 ? 1.5 : overallPercentage}%` }}
          />
        </div>
      </section>

      {/* =========================================================
          REFERRED CARD 2: TOPIC SCORE WITH 4 DETAILED CARDS
          ========================================================= */}
      <section
        id="card-topic-score"
        className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-[#1b253b] p-6 sm:p-7 shadow-sm dark:shadow-xl text-slate-900 dark:text-slate-100 transition-colors"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563eb] via-[#4f46e5] to-[#9333ea] flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
              <Trophy className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                BST Topic Score
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Earned points are calculated from completed, persisted activities.
              </p>
            </div>
          </div>

          {/* Right side Total Points Card with Glowing Star */}
          <div className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0e1628] border border-slate-200 dark:border-slate-800/90 shadow-inner self-start sm:self-auto">
            {/* Golden Star with Sparkle */}
            <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-amber-500 dark:text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] fill-amber-500 dark:fill-amber-400">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="absolute -top-1 -right-1 text-[10px] text-amber-400 dark:text-amber-300 animate-pulse select-none">✦</span>
              <span className="absolute -bottom-1 -left-1 text-[8px] text-amber-400 dark:text-amber-300 select-none">✦</span>
            </div>
            <div className="text-left font-mono">
              <div className="text-2xl font-black text-blue-600 dark:text-[#38bdf8] tracking-tight leading-none">
                {totalTopicPoints} / 100
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mt-1">
                TOTAL POINTS
              </div>
            </div>
          </div>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {/* Card 1: Visualize */}
          <div
            onClick={() => {
              soundManager.playClick();
              if (onGoToVisualize) onGoToVisualize();
            }}
            className="bg-white dark:bg-[#0d1629] border border-slate-200 dark:border-slate-800/90 hover:border-purple-400 dark:hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-sm hover:shadow-md hover:bg-slate-50/80 dark:hover:bg-[#101b33]"
            title="Click to open Visualizations & Animations"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-[#231545] border border-purple-200 dark:border-purple-900/60 flex items-center justify-center text-purple-600 dark:text-[#a855f7] flex-shrink-0 group-hover:scale-105 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">Visualize</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight block font-mono">
                  {visualizationPoints}/20
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 my-3.5">
              <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-[#080d19] overflow-hidden border border-slate-200 dark:border-slate-800/60 relative">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                  style={{ width: `${visualizePercentage === 0 ? 3 : visualizePercentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-[#a855f7] font-mono min-w-7 text-right">
                {visualizePercentage}%
              </span>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 block">Complete visualizations & videos</span>
          </div>

          {/* Card 2: Game */}
          <div
            onClick={() => {
              soundManager.playClick();
              if (onGoToGame) onGoToGame();
            }}
            className="bg-white dark:bg-[#0d1629] border border-slate-200 dark:border-slate-800/90 hover:border-indigo-400 dark:hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-sm hover:shadow-md hover:bg-slate-50/80 dark:hover:bg-[#101b33]"
            title="Click to play Game levels"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#1e154e] border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-[#818cf8] flex-shrink-0 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">Game</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight block font-mono">
                  {gamePoints}/50
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 my-3.5">
              <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-[#080d19] overflow-hidden border border-slate-200 dark:border-slate-800/60 relative">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500 shadow-[0_0_8px_rgba(129,140,248,0.5)]"
                  style={{ width: `${gamePercentage === 0 ? 3 : gamePercentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-[#818cf8] font-mono min-w-7 text-right">
                {gamePercentage}%
              </span>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 block">Complete game levels</span>
          </div>

          {/* Card 3: Quiz */}
          <div
            onClick={() => {
              soundManager.playClick();
              if (onGoToQuiz) onGoToQuiz();
            }}
            className="bg-white dark:bg-[#0d1629] border border-slate-200 dark:border-slate-800/90 hover:border-cyan-400 dark:hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all cursor-pointer group shadow-sm hover:shadow-md hover:bg-slate-50/80 dark:hover:bg-[#101b33]"
            title="Click to take the Quiz"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-[#0b2548] border border-cyan-200 dark:border-cyan-900/60 flex items-center justify-center text-cyan-600 dark:text-[#38bdf8] flex-shrink-0 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">Quiz</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight block font-mono">
                  {quizPoints}/30
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 my-3.5">
              <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-[#080d19] overflow-hidden border border-slate-200 dark:border-slate-800/60 relative">
                <div
                  className="h-full rounded-full bg-cyan-500 transition-all duration-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                  style={{ width: `${quizPercentage === 0 ? 3 : quizPercentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-cyan-600 dark:text-[#38bdf8] font-mono min-w-7 text-right">
                {quizPercentage}%
              </span>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 block">Answer quiz questions</span>
          </div>
        </div>
      </section>
    </div>
  );
};
