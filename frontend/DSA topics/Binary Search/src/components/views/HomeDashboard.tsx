import React from 'react';
import {
  ArrowRight,
  Lightbulb,
  BookOpen,
  Star,
  Rocket,
  Target,
  Sigma,
  Puzzle,
  Search,
  Scale,
  Share2,
  ListFilter,
  Zap,
  Folder,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { TabType, UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';

interface HomeDashboardProps {
  progress: UserProgress;
  onSelectTab: (tab: TabType) => void;
  onSelectGameLevel?: (levelId: number) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectTab,
}) => {
  const handleStartLearning = () => {
    soundEffects.playClick();
    onSelectTab('theory');
  };

  const arrayItems = [5, 11, 18, 23, 37, 45, 62];

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* ─── CARD 1: HERO CARD (BINARY SEARCH & OVERVIEW) ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                THEORY CURRICULUM • MODULE 02 • CHAPTER 01
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none uppercase font-mono">
              BINARY SEARCH
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg font-normal">
              Learn how Binary Search finds a target efficiently by repeatedly dividing a sorted search range in half.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-[11px] text-amber-900 dark:text-amber-200 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span><strong>Important:</strong> Binary Search requires the data to be sorted.</span>
            </div>
          </div>

          {/* Right Column: Search Icon Squircle + Array Diagram */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 py-2">
            {/* Blue Rounded Square with Search Icon */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              <Search className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.4]" />
            </div>

            {/* Array Visual Box Container */}
            <div className="flex flex-col items-center shrink-0 w-full sm:w-auto">
              {/* "mid -> 3" label & downward arrow */}
              <div className="w-full relative h-7">
                <div className="absolute left-[50%] -translate-x-1/2 flex flex-col items-center">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 font-mono leading-none">
                    mid → 3
                  </span>
                  <svg width="10" height="14" viewBox="0 0 10 14" className="stroke-blue-600 dark:stroke-blue-400">
                    <line x1="5" y1="0" x2="5" y2="9" strokeDasharray="2 2" strokeWidth="1.5" />
                    <path d="M 2 7 L 5 11 L 8 7" fill="none" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Indices Row (0 to 6) */}
              <div className="flex w-full justify-center">
                {arrayItems.map((_, idx) => (
                  <div
                    key={idx}
                    className="w-8 sm:w-10 text-center text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-300 font-mono"
                  >
                    {idx}
                  </div>
                ))}
              </div>

              {/* Array Cells Box */}
              <div className="flex border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-2xs mt-1">
                {arrayItems.map((val, idx) => {
                  const isMid = idx === 3;
                  const isLast = idx === arrayItems.length - 1;
                  return (
                    <div
                      key={idx}
                      className={`w-8 sm:w-10 h-9 sm:h-11 flex items-center justify-center text-xs sm:text-sm font-mono transition-colors ${
                        !isLast ? 'border-r border-slate-300 dark:border-slate-700' : ''
                      } ${
                        isMid
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 font-extrabold ring-2 ring-blue-500 inset'
                          : 'text-slate-900 dark:text-slate-100 font-semibold'
                      }`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>

              {/* Bracket arrows: LOW ─────────→ MID ←───────── HIGH */}
              <div className="w-full max-w-[224px] sm:max-w-[280px] relative mt-1.5">
                <svg viewBox="0 0 280 22" className="w-full h-5 stroke-blue-500 dark:stroke-blue-400">
                  {/* Left branch pointing to low */}
                  <path d="M 125 3 L 125 11 L 8 11" strokeDasharray="3 3" strokeWidth="1.5" fill="none" />
                  <path d="M 14 7 L 6 11 L 14 15" fill="none" strokeWidth="1.5" />
                  {/* Right branch pointing to high */}
                  <path d="M 155 3 L 155 11 L 272 11" strokeDasharray="3 3" strokeWidth="1.5" fill="none" />
                  <path d="M 266 7 L 274 11 L 266 15" fill="none" strokeWidth="1.5" />
                </svg>

                <div className="flex justify-between items-center text-[11px] font-bold text-slate-800 dark:text-slate-200 font-mono -mt-1 px-1">
                  <span>low → 0</span>
                  <span>high → 6</span>
                </div>
              </div>

              {/* Target Highlight & Communication Subtext */}
              <div className="flex flex-col items-center mt-1.5 space-y-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  TARGET = 23 (FOUND)
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Search → Find Middle → Compare → Narrow Range
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3 Quick Highlight Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/80">
          {/* Card 1: Core Idea */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Target className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Core Idea</h4>
                <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  Divide and conquer.
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 leading-tight">
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Search a sorted array</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Check the middle element</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Eliminate half the search space</span>
              </div>
            </div>
          </div>

          {/* Card 2: Key Formula */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sigma className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Key Formula</h4>
                <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 font-mono">
                  mid = low + (high - low) / 2
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 leading-tight">
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Compare target with arr[mid]</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Move low or high</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Repeat until found or low &gt; high</span>
              </div>
            </div>
          </div>

          {/* Card 3: Main Challenge */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Puzzle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Main Challenge</h4>
                <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 leading-tight">
                  Keep the search range correct at every step.
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 leading-tight">
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Array must be sorted</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Calculate mid correctly</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Update low / high correctly</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Handle target-not-found cases</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CARD 2: 1. THE MAIN IDEA ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-2xs">
            <Lightbulb className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            1. The Main Idea
          </h2>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-4 space-y-2.5">
            <h3 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 leading-snug">
              How does Binary Search work?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Binary Search finds a target in a sorted array by comparing the target with the middle element and eliminating half of the remaining search space after each comparison.
            </p>
          </div>

          {/* Right Pipeline Visual Container */}
          <div className="lg:col-span-8 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto custom-scrollbar py-1">
              {/* Step 1: Sorted Array */}
              <div className="flex flex-col items-center text-center shrink-0 w-16 sm:w-20">
                <div className="w-11 h-11 rounded-full bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-xs mb-2">
                  <ListFilter className="w-5 h-5 stroke-[2.2]" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Sorted Array</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Input must be sorted.</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-blue-400 dark:text-blue-500 shrink-0 -mt-6" />

              {/* Step 2: Find Middle */}
              <div className="flex flex-col items-center text-center shrink-0 w-16 sm:w-20">
                <div className="w-11 h-11 rounded-full bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-xs mb-2">
                  <Search className="w-5 h-5 stroke-[2.2]" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Find Middle</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Calculate the middle index.</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-blue-400 dark:text-blue-500 shrink-0 -mt-6" />

              {/* Step 3: Compare */}
              <div className="flex flex-col items-center text-center shrink-0 w-16 sm:w-20">
                <div className="w-11 h-11 rounded-full bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-xs mb-2">
                  <Scale className="w-5 h-5 stroke-[2.2]" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Compare</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Compare target with the middle value.</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-blue-400 dark:text-blue-500 shrink-0 -mt-6" />

              {/* Step 4: Narrow Range */}
              <div className="flex flex-col items-center text-center shrink-0 w-16 sm:w-20">
                <div className="w-11 h-11 rounded-full bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-xs mb-2">
                  <Share2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Narrow Range</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Search the left or right half.</span>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-blue-400 dark:text-blue-500 shrink-0 -mt-6" />

              {/* Step 5: Result */}
              <div className="flex flex-col items-center text-center shrink-0 w-16 sm:w-20">
                <div className="w-11 h-11 rounded-full bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-xs mb-2">
                  <Target className="w-5 h-5 stroke-[2.2]" />
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">Result</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Target found or not found.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CARD 3: 2. CONCEPT ROADMAP ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-2xs">
            <BookOpen className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            2. Concept Roadmap
          </h2>
        </div>

        {/* 5-Node Timeline with Dotted Connecting Line */}
        <div className="relative px-2 sm:px-4">
          {/* Dotted Line */}
          <div className="hidden sm:block absolute top-[13px] left-[9%] right-[9%] h-[2px] border-t-2 border-dashed border-blue-200 dark:border-blue-800/80 z-0" />

          {/* 5 Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-3 relative z-10">
            {/* Step 01: Understand Problem */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200/60 dark:border-blue-800">
                01
              </span>
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs border border-blue-100 dark:border-slate-800 mb-2">
                <Search className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Understand the <br /> Problem
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Identify the target.</span>
            </div>

            {/* Step 02: Ensure Sorted Array */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200/60 dark:border-blue-800">
                02
              </span>
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs border border-blue-100 dark:border-slate-800 mb-2">
                <ListFilter className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Ensure Sorted <br /> Array
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Binary Search requires sorted data.</span>
            </div>

            {/* Step 03: Initialize low, high */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200/60 dark:border-blue-800">
                03
              </span>
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs border border-blue-100 dark:border-slate-800 mb-2">
                <Scale className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Initialize <br /> low, high
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Set the search boundaries.</span>
            </div>

            {/* Step 04: Find Middle & Compare */}
            <div className="flex flex-col items-center text-center">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200/60 dark:border-blue-800">
                04
              </span>
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs border border-blue-100 dark:border-slate-800 mb-2">
                <Share2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Find Middle &amp; <br /> Compare
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Check the middle value.</span>
            </div>

            {/* Step 05: Narrow Search Space */}
            <div className="flex flex-col items-center text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200/60 dark:border-blue-800">
                05
              </span>
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs border border-blue-100 dark:border-slate-800 mb-2">
                <Target className="w-5 h-5 stroke-[2.2]" />
              </div>
              <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Narrow <br /> Search Space
              </strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Keep the half that may contain the target.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CARD 4: 3. WHY THIS TOPIC MATTERS ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors">
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-2xs">
            <Star className="w-4 h-4 stroke-[2.4]" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            3. Why This Topic Matters
          </h2>
        </div>

        {/* 3 Color-Coded Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Efficient Search (Blue) */}
          <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 shadow-xs">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              Efficient Search
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Binary Search works in O(log n) time, making it much faster than scanning a large sorted array one element at a time.
            </p>
          </div>

          {/* Card 2: Large Datasets (Emerald / Green) */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-xs">
              <Folder className="w-5 h-5 fill-current" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              Large Datasets
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              It is especially useful when searching large amounts of sorted data efficiently.
            </p>
          </div>

          {/* Card 3: Real-World Use (Sky Blue) */}
          <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
            <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center mb-4 shadow-xs">
              <Globe className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              Real-World Use
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Used in databases, search systems, libraries, and applications that work with sorted data.
            </p>
          </div>
        </div>
      </div>

      {/* ─── CARD 5: 4. READY TO START? ─── */}
      <div className="rounded-3xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100/90 dark:border-blue-900/50 p-6 sm:p-8 lg:p-10 shadow-xs transition-colors flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Graphic & Text */}
        <div className="flex items-center gap-5 sm:gap-6 text-center sm:text-left">
          {/* Rocket Icon Container */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Rocket className="w-9 h-9 stroke-[2.2]" />
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              4. Ready to Start?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md">
              Begin your Binary Search journey and master efficient searching in sorted data.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartLearning}
          className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-500 hover:from-blue-800 hover:via-blue-700 hover:to-indigo-600 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2.5 group cursor-pointer active:scale-95 shrink-0"
        >
          <span>Start Learning →</span>
        </button>
      </div>
    </div>
  );
};
