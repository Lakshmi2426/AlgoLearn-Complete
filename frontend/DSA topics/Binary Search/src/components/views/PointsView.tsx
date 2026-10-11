import React from 'react';
import {
  Award,
  BookOpen,
  HelpCircle,
  Sparkles,
  Gamepad2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Target,
  MinusCircle,
  Check,
  Info,
  Shield,
  Layers,
} from 'lucide-react';
import { TabType, UserProgress } from '../../types';
import { calculatePoints } from '../../services/scoring';
import { soundEffects } from '../../services/sound';

interface PointsViewProps {
  progress: UserProgress;
  onNavigateTab?: (tab: TabType) => void;
}

export const PointsView: React.FC<PointsViewProps> = ({
  progress,
  onNavigateTab,
}) => {
  const pointsData = calculatePoints(progress);

  const handleNav = (tab: TabType) => {
    soundEffects.playClick();
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto select-none">
      {/* ─── HEADER SECTION ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/50">
              <Award className="w-3.5 h-3.5 stroke-[2.5]" />
              Official Academic Scoring
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Independent 100-Point System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Performance Points
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Standardized evaluation across Theory, Quiz, Visualizations, and Game levels.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3 rounded-2xl shadow-2xs self-start md:self-auto">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg">
            {pointsData.totalPoints}
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Score
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {pointsData.totalPoints} <span className="text-xs font-medium text-slate-400">/ 100 pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── HERO TOTAL SCORE BANNER ─── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Big Score Display */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start gap-6">
            <div className="relative flex items-center justify-center">
              {/* Circular Gauge Frame */}
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-slate-700/60 bg-slate-800/80 flex flex-col items-center justify-center text-center shadow-inner relative">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                  {pointsData.totalPoints}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  out of 100
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-xs border border-white/10">
                <span>Grade: {pointsData.academicGrade.letter}</span>
                <span className="text-white/50">•</span>
                <span>{pointsData.academicGrade.label}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Curriculum Assessment
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
                Calculated strictly based on verified task completion, quiz accuracy, and game execution integrity.
              </p>
            </div>
          </div>

          {/* Quick Category Progress Breakdown */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-white/10">
              <span>Category Weightage & Score</span>
              <span>Points Earned</span>
            </div>

            {/* Theory Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-200">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  Theory Modules (12 × 2 pts)
                </span>
                <span className="font-mono text-white">
                  <span className="font-bold">{pointsData.theoryPoints}</span> / {pointsData.theoryMaxPoints} pts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(pointsData.theoryPoints / pointsData.theoryMaxPoints) * 100}%` }}
                />
              </div>
            </div>

            {/* Quiz Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-200">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                  Quiz Assessment (+3 correct, -1 wrong)
                </span>
                <span className="font-mono text-white">
                  <span className="font-bold">{pointsData.quizPoints}</span> / {pointsData.quizMaxPoints} pts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(pointsData.quizPoints / pointsData.quizMaxPoints) * 100}%` }}
                />
              </div>
            </div>

            {/* Visualizations Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Visualizations (2 × 5 pts)
                </span>
                <span className="font-mono text-white">
                  <span className="font-bold">{pointsData.visualizationPoints}</span> / {pointsData.visualizationMaxPoints} pts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${(pointsData.visualizationPoints / pointsData.visualizationMaxPoints) * 100}%` }}
                />
              </div>
            </div>

            {/* Game Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-200">
                  <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                  Game Levels (6 × 6 pts - Penalties)
                </span>
                <span className="font-mono text-white">
                  <span className="font-bold">{pointsData.gameNetPoints}</span> / {pointsData.gameMaxPoints} pts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(pointsData.gameNetPoints / pointsData.gameMaxPoints) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4 CATEGORY DETAIL CARDS ─── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight uppercase mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Category-Wise Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Card 1: THEORY */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {pointsData.theoryPoints} <span className="text-sm font-semibold text-slate-400">/ 24</span>
                  </div>
                  <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    24 Max Points
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Theory Learning
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  12 comprehensive curriculum modules at 2 points each.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Scoring Rule:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">12 modules × 2 points</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Completed:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {pointsData.theoryCompletedCount} of {pointsData.theoryTotalModules} modules
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Calculation:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {pointsData.theoryCompletedCount} × 2 = {pointsData.theoryPoints} pts
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {pointsData.theoryCompletedCount === 12 ? '✓ Fully Completed' : `${12 - pointsData.theoryCompletedCount} remaining`}
              </span>
              <button
                onClick={() => handleNav('theory')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Go to Learn <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: QUIZ */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {pointsData.quizPoints} <span className="text-sm font-semibold text-slate-400">/ 30</span>
                  </div>
                  <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                    30 Max Points
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Quiz Assessment
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  10 questions with +3 pts per correct answer and -1 pt per wrong answer.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Scoring Rule:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">+3 correct, -1 wrong</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Results:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    <span className="text-emerald-600 dark:text-emerald-400">+{pointsData.quizCorrectCount} correct</span>,{' '}
                    <span className="text-rose-600 dark:text-rose-400">-{pointsData.quizWrongCount} wrong</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Calculation:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    ({pointsData.quizCorrectCount} × 3) - ({pointsData.quizWrongCount} × 1) = {pointsData.quizPoints} pts
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {pointsData.quizAttempted ? '✓ Assessment Attempted' : 'Not Attempted Yet'}
              </span>
              <button
                onClick={() => handleNav('quiz')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 hover:underline cursor-pointer"
              >
                {pointsData.quizAttempted ? 'Retake Quiz' : 'Take Quiz'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: VISUALIZATIONS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {pointsData.visualizationPoints} <span className="text-sm font-semibold text-slate-400">/ 10</span>
                  </div>
                  <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                    10 Max Points
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Visualizations
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  2 core video visualization modules at 5 points each.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Scoring Rule:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">2 modules × 5 points</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Completed:</span>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                    {pointsData.visualizationCompletedCount} of {pointsData.visualizationTotalModules} modules
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Calculation:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {pointsData.visualizationCompletedCount} × 5 = {pointsData.visualizationPoints} pts
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {pointsData.visualizationCompletedCount === 2 ? '✓ All Videos Watched' : `${2 - pointsData.visualizationCompletedCount} video remaining`}
              </span>
              <button
                onClick={() => handleNav('lab')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 hover:underline cursor-pointer"
              >
                Go to Visualize <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: GAME */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {pointsData.gameNetPoints} <span className="text-sm font-semibold text-slate-400">/ 36</span>
                  </div>
                  <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    36 Max Points
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Binary Search Game
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  6 progressive levels at 6 points each, subject to game penalties.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Scoring Rule:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">6 levels × 6 points</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Base Points:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {pointsData.gameCompletedCount} levels × 6 = {pointsData.gameBasePoints} pts
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Penalties Deducted:</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    -{pointsData.totalGamePenalties} pts
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-600 dark:text-slate-300 font-bold">Net Game Score:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {pointsData.gameNetPoints} pts
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {pointsData.gameCompletedCount === 6 ? '✓ All 6 Levels Completed' : `${6 - pointsData.gameCompletedCount} levels remaining`}
              </span>
              <button
                onClick={() => handleNav('game')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                Play Game <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── GAME PENALTIES AUDIT PANEL ─── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Game Penalties & Integrity Audit
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Detailed record of hint and guided solve assistance during game levels.
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 self-start sm:self-auto">
            Total Penalty: -{pointsData.totalGamePenalties} pts
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Hint Penalties */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Hints Used</span>
              <span className="font-mono text-rose-600 font-bold">-1 pt / hint</span>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {pointsData.gameHintsUsed} <span className="text-xs font-normal text-slate-400">times</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Deduction: <span className="font-semibold text-rose-600">-{pointsData.hintPenaltyPoints} pts</span>
            </div>
          </div>

          {/* Guided Solve Penalties */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Guided Solves Used</span>
              <span className="font-mono text-rose-600 font-bold">-2 pts / solve</span>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {pointsData.gameGuidedSolvesUsed} <span className="text-xs font-normal text-slate-400">times</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Deduction: <span className="font-semibold text-rose-600">-{pointsData.guidedPenaltyPoints} pts</span>
            </div>
          </div>

          {/* Net Impact */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Game Impact</span>
              <span className="font-mono text-emerald-600 font-bold">Max 36 pts</span>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {pointsData.gameNetPoints} <span className="text-xs font-normal text-slate-400">/ 36 pts</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Base: {pointsData.gameBasePoints} pts • Penalties: -{pointsData.totalGamePenalties} pts
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 bg-blue-50/60 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100/60 dark:border-blue-900/40">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong>Academic Note:</strong> Completing game levels without opening Hints or Guided Solve preserves your full 6 points per level (36/36 total).
          </span>
        </div>
      </div>

      {/* ─── OFFICIAL 100-POINT SCORING TABLE ─── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            Official 100-Point Distribution Table
          </h3>
          <span className="text-xs font-mono font-bold text-slate-400">
            TOTAL = 100 PTS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Scoring Rule</th>
                <th className="py-3 px-4 text-center">Maximum</th>
                <th className="py-3 px-4 text-center">Current Earned</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {/* Theory */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" /> Theory
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                  12 modules × 2 points
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                  24
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                  {pointsData.theoryPoints}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    pointsData.theoryCompletedCount === 12
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {pointsData.theoryCompletedCount}/12 Complete
                  </span>
                </td>
              </tr>

              {/* Quiz */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-500" /> Quiz
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                  +3 correct, -1 wrong
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                  30
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-600 dark:text-purple-400">
                  {pointsData.quizPoints}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    pointsData.quizAttempted
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {pointsData.quizAttempted ? `${pointsData.quizCorrectCount} Correct` : 'Pending'}
                  </span>
                </td>
              </tr>

              {/* Visualizations */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" /> Visualizations
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                  2 modules × 5 points
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                  10
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {pointsData.visualizationPoints}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    pointsData.visualizationCompletedCount === 2
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {pointsData.visualizationCompletedCount}/2 Complete
                  </span>
                </td>
              </tr>

              {/* Game */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-emerald-500" /> Game
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                  6 levels × 6 points (less penalties)
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                  36
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {pointsData.gameNetPoints}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    pointsData.gameCompletedCount === 6
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {pointsData.gameCompletedCount}/6 Complete
                  </span>
                </td>
              </tr>

              {/* Grand Total */}
              <tr className="bg-slate-50/90 dark:bg-slate-800/80 font-black">
                <td className="py-4 px-4 text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  Grand Total
                </td>
                <td className="py-4 px-4 text-slate-500 text-xs">
                  Theory + Quiz + Visualizations + Game
                </td>
                <td className="py-4 px-4 text-center font-mono text-base text-slate-900 dark:text-white">
                  100
                </td>
                <td className="py-4 px-4 text-center font-mono text-lg text-amber-600 dark:text-amber-400">
                  {pointsData.totalPoints}
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                    {pointsData.percentage}% Achieved
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
