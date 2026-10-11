import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  CheckCircle2,
  Film,
  Sparkles,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';
import { awardVideoPoints } from '../../services/storage';
import { EducationalVideoPlayer } from '../lab/EducationalVideoPlayer';
import { LESSONS_DATA, LessonData } from '../../data/labVideoData';
import { PointToastData } from '../common/PointToast';

interface LabViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
  onShowPointToast?: (toast: PointToastData) => void;
}

interface CustomVideoState {
  file: File | null;
  url: string | null;
  name: string;
}

export const LabView: React.FC<LabViewProps> = ({
  progress,
  onUpdateProgress,
  onShowPointToast,
}) => {
  // Active selected lesson (1 for BINARY SEARCH, 2 for BINARY SEARCH ALGORITHM)
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [autoPlayTrigger, setAutoPlayTrigger] = useState<number>(0);

  // Custom uploaded videos per card (optional user upload override)
  const [video1, setVideo1] = useState<CustomVideoState>({
    file: null,
    url: null,
    name: '',
  });

  const [video2, setVideo2] = useState<CustomVideoState>({
    file: null,
    url: null,
    name: '',
  });

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      if (video1.url) URL.revokeObjectURL(video1.url);
      if (video2.url) URL.revokeObjectURL(video2.url);
    };
  }, [video1.url, video2.url]);

  // Handle Video 1 Upload
  const handleUpload1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (video1.url) URL.revokeObjectURL(video1.url);
      const url = URL.createObjectURL(file);
      setVideo1({
        file,
        url,
        name: file.name,
      });
      setSelectedLessonId(1);
      soundEffects.playSuccess();

      if (!progress.completedLabs?.includes(1)) {
        onUpdateProgress((prev) => ({
          ...prev,
          completedLabs: [...(prev.completedLabs || []), 1],
          xp: prev.xp + 50,
        }));
      }
    }
  };

  // Handle Video 2 Upload
  const handleUpload2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (video2.url) URL.revokeObjectURL(video2.url);
      const url = URL.createObjectURL(file);
      setVideo2({
        file,
        url,
        name: file.name,
      });
      setSelectedLessonId(2);
      soundEffects.playSuccess();
    }
  };

  const handleLessonWatch = (lessonId: number) => {
    soundEffects.playClick();
    setSelectedLessonId(lessonId);
    setAutoPlayTrigger(Date.now());

    // Smooth scroll to video player if not visible
    if (playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Selected Lesson object
  const activeLesson: LessonData =
    LESSONS_DATA.find((l) => l.id === selectedLessonId) || LESSONS_DATA[0];

  const currentCustomUrl = selectedLessonId === 1 ? video1.url : video2.url;
  const currentCustomName = selectedLessonId === 1 ? video1.name : video2.name;

  const isLesson1Completed = progress.topicPoints?.completedVideos?.includes(1) || progress.completedLabs?.includes(1);
  const isLesson2Completed = progress.topicPoints?.completedVideos?.includes(2) || progress.completedLabs?.includes(2);

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Hidden File Inputs for Custom Video Uploads */}
      <input
        type="file"
        ref={fileInputRef1}
        onChange={handleUpload1}
        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
        className="hidden"
        aria-label="Upload video for Video 01 Binary Search"
      />
      <input
        type="file"
        ref={fileInputRef2}
        onChange={handleUpload2}
        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
        className="hidden"
        aria-label="Upload video for Video 02 Binary Search Algorithm"
      />

      {/* ─── VISUALIZE SECTION HEADING ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            VISUALIZE
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            2 videos • 5 points each • Total 10 visualization points available
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold self-start sm:self-center flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Earned: {progress.topicPoints?.visualizeEarned || 0} / 10 pts</span>
        </div>
      </div>

      {/* ─── TWO VIDEO CARDS GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* ─── VIDEO CARD 01: BINARY SEARCH ─── */}
        <div
          onClick={() => handleLessonWatch(1)}
          className={`bg-white dark:bg-slate-900 rounded-3xl border p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer ${
            selectedLessonId === 1
              ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/25 shadow-lg shadow-blue-500/10'
              : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            {/* Top Row: Video label + Points Badge + Video Icon Container */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider border border-slate-200/80 dark:border-slate-700/80">
                  VIDEO 01
                </span>
                <span className="text-[11px] font-mono font-black px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  +5 pts
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-900/60">
                  Binary Search.mp4
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {isLesson1Completed && (
                  <span
                    className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300/60 dark:border-emerald-800"
                    title="Completed (+5 pts earned)"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </span>
                )}
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-2xs">
                  <Film className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                BINARY SEARCH
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-normal">
                Learn how Binary Search finds a target efficiently by repeatedly dividing a sorted array into smaller search ranges.
              </p>
            </div>

            {/* Topic Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {['Sorted Array', 'Low / Mid / High', 'Divide & Conquer', 'O(log n)'].map((chip) => (
                <span
                  key={chip}
                  className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Area: CLICK TO WATCH */}
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-xs font-mono font-bold text-slate-400">
              {isLesson1Completed ? '✓ Completed (5 pts)' : 'Watch to completion (+5 pts)'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLessonWatch(1);
              }}
              className={`py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] ${
                selectedLessonId === 1
                  ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-500 hover:from-blue-800 hover:via-blue-700 hover:to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/30'
                  : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60'
              }`}
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>WATCH VIDEO 01</span>
            </button>
          </div>
        </div>

        {/* ─── VIDEO CARD 02: BINARY SEARCH ALGORITHM ─── */}
        <div
          onClick={() => handleLessonWatch(2)}
          className={`bg-white dark:bg-slate-900 rounded-3xl border p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer ${
            selectedLessonId === 2
              ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/25 shadow-lg shadow-blue-500/10'
              : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="space-y-4">
            {/* Top Row: Video label + Points Badge + Video Icon Container */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider border border-slate-200/80 dark:border-slate-700/80">
                  VIDEO 02
                </span>
                <span className="text-[11px] font-mono font-black px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  +5 pts
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-900/60">
                  Binary Search Algorithm.mp4
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {isLesson2Completed && (
                  <span
                    className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300/60 dark:border-emerald-800"
                    title="Completed (+5 pts earned)"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </span>
                )}
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-2xs">
                  <Film className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                BINARY SEARCH ALGORITHM
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-normal">
                Follow the Binary Search algorithm step by step using low, mid, and high to find a target or determine that it is not present.
              </p>
            </div>

            {/* Topic Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {['Low / Mid / High', 'Mid Calculation', 'Range Update', 'Target Found / Not Found'].map(
                (chip) => (
                  <span
                    key={chip}
                    className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Bottom Action Area: CLICK TO WATCH */}
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-xs font-mono font-bold text-slate-400">
              {isLesson2Completed ? '✓ Completed (5 pts)' : 'Watch to completion (+5 pts)'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLessonWatch(2);
              }}
              className={`py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] ${
                selectedLessonId === 2
                  ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-500 hover:from-blue-800 hover:via-blue-700 hover:to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/30'
                  : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/60'
              }`}
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>WATCH VIDEO 02</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── REUSABLE INTERACTIVE VIDEO PLAYER SECTION ─── */}
      <div ref={playerContainerRef} className="space-y-4 pt-2">
        <EducationalVideoPlayer
          activeLesson={activeLesson}
          customVideoUrl={currentCustomUrl}
          customVideoName={currentCustomName}
          autoPlayTrigger={autoPlayTrigger}
          onUploadClick={() => {
            if (selectedLessonId === 1) {
              fileInputRef1.current?.click();
            } else {
              fileInputRef2.current?.click();
            }
          }}
          onLessonComplete={(completedId) => {
            // Award points ONLY when video is fully completed (5 pts per video, max 10 pts)
            const { updated } = awardVideoPoints(progress, completedId);
            onUpdateProgress(updated);
            soundEffects.playSuccess();
            if (onShowPointToast) {
              onShowPointToast({
                points: 5,
                reason: 'Video Completed',
                type: 'increase',
              });
            }
          }}
        />
      </div>
    </div>
  );
};
