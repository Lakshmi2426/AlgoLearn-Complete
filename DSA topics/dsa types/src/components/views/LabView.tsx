import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Play,
  CheckCircle2,
  Upload,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  Clock,
  Keyboard,
  FileVideo,
  ChevronRight,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { soundEffects } from '../../services/sound';
import { EducationalVideoPlayer } from '../lab/EducationalVideoPlayer';
import { LESSONS_DATA, LessonData } from '../../data/labVideoData';

interface LabViewProps {
  progress: UserProgress;
  onUpdateProgress: (
    updated: UserProgress | ((prev: UserProgress) => UserProgress)
  ) => void;
}

interface CustomVideoState {
  file: File | null;
  url: string | null;
  name: string;
}

export const LabView: React.FC<LabViewProps> = ({
  progress,
  onUpdateProgress,
}) => {
  // Selected lesson (1 for Lesson 01, 2 for Lesson 02)
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [autoPlayTrigger, setAutoPlayTrigger] = useState<number>(0);

  // Optional custom user video uploads
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
      setVideo1({ file, url, name: file.name });
      setSelectedLessonId(1);
      setAutoPlayTrigger(Date.now());
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
      setVideo2({ file, url, name: file.name });
      setSelectedLessonId(2);
      setAutoPlayTrigger(Date.now());
      soundEffects.playSuccess();

      if (!progress.completedLabs?.includes(2)) {
        onUpdateProgress((prev) => ({
          ...prev,
          completedLabs: [...(prev.completedLabs || []), 2],
          xp: prev.xp + 50,
        }));
      }
    }
  };

  const handleLessonSwitch = (lessonId: number) => {
    if (lessonId === selectedLessonId) return;
    soundEffects.playClick();
    setSelectedLessonId(lessonId);
    setAutoPlayTrigger(Date.now());

    // Award lab completion upon watching
    if (!progress.completedLabs?.includes(lessonId)) {
      onUpdateProgress((prev) => ({
        ...prev,
        completedLabs: [...(prev.completedLabs || []), lessonId],
        xp: prev.xp + 50,
      }));
    }
  };

  // Active Lesson object
  const activeLesson: LessonData =
    LESSONS_DATA.find((l) => l.id === selectedLessonId) || LESSONS_DATA[0];

  const currentCustomUrl = selectedLessonId === 1 ? video1.url : video2.url;
  const currentCustomName = selectedLessonId === 1 ? video1.name : video2.name;

  const isLesson1Completed = progress.completedLabs?.includes(1);
  const isLesson2Completed = progress.completedLabs?.includes(2);

  return (
    <div className="space-y-6 pb-16 max-w-[calc(14.6in+2.5rem)] w-full mx-auto font-sans">
      {/* Hidden File Inputs for Custom Video Uploads */}
      <input
        type="file"
        ref={fileInputRef1}
        onChange={handleUpload1}
        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
        className="hidden"
        aria-label={`Upload video for Lesson 01 ${LESSONS_DATA[0].title}`}
      />
      <input
        type="file"
        ref={fileInputRef2}
        onChange={handleUpload2}
        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
        className="hidden"
        aria-label={`Upload video for Lesson 02 ${LESSONS_DATA[1].title}`}
      />

      {/* ─── PAGE HEADER & EDUCATIONAL PLAYLIST SEQUENCE ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 font-mono text-[11px] font-bold tracking-wider uppercase border border-indigo-200 dark:border-indigo-900/60">
              Interactive Video Lab
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold border border-emerald-200 dark:border-emerald-900/60">
              2 Lessons in Sequence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            VISUALIZE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Watch the official animated educational presentations with full-screen controls, synchronized narration transcripts, and concept bookmarks.
          </p>
        </div>

        {/* Upload Custom Video action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (selectedLessonId === 1) {
                fileInputRef1.current?.click();
              } else {
                fileInputRef2.current?.click();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-800 shadow-xs transition-all cursor-pointer active:scale-95"
            title="Upload an alternative video file for the active lesson"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Upload Video File</span>
          </button>
        </div>
      </div>

      {/* ─── EDUCATIONAL PLAYLIST SEQUENCE BAR ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-2 sm:p-2.5 shadow-xs">
        <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
          Educational Video Curriculum (Click to Switch):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Lesson 01 Card */}
          <button
            onClick={() => handleLessonSwitch(1)}
            className={`p-3 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
              selectedLessonId === 1
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  selectedLessonId === 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                01
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    Lesson 01
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    • 1:10
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {LESSONS_DATA[0].title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              {isLesson1Completed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Completed</span>
                </span>
              ) : selectedLessonId === 1 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md">
                  <Play className="w-3 h-3 fill-current" />
                  <span>Now Playing</span>
                </span>
              ) : (
                <span className="text-xs text-slate-400">Select</span>
              )}
            </div>
          </button>

          {/* Lesson 02 Card */}
          <button
            onClick={() => handleLessonSwitch(2)}
            className={`p-3 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
              selectedLessonId === 2
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  selectedLessonId === 2
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                02
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    Lesson 02
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    • 1:01
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {LESSONS_DATA[1].title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              {isLesson2Completed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Completed</span>
                </span>
              ) : selectedLessonId === 2 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md">
                  <Play className="w-3 h-3 fill-current" />
                  <span>Now Playing</span>
                </span>
              ) : (
                <span className="text-xs text-slate-400">Select</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* ─── UNIFIED STANDARDIZED FULL-SCREEN VIDEO PLAYER ─── */}
      <div ref={playerContainerRef} className="w-full overflow-x-auto custom-scrollbar flex flex-col items-center">
        <EducationalVideoPlayer
          activeLesson={activeLesson}
          customVideoUrl={currentCustomUrl}
          customVideoName={currentCustomName}
          autoPlayTrigger={autoPlayTrigger}
          onSelectLesson={handleLessonSwitch}
          onUploadClick={() => {
            if (selectedLessonId === 1) {
              fileInputRef1.current?.click();
            } else {
              fileInputRef2.current?.click();
            }
          }}
          onLessonComplete={(completedId) => {
            if (!progress.completedLabs?.includes(completedId)) {
              onUpdateProgress((prev) => ({
                ...prev,
                completedLabs: [...(prev.completedLabs || []), completedId],
                xp: prev.xp + 50,
              }));
              soundEffects.playSuccess();
            }
          }}
          allLessons={LESSONS_DATA}
        />
      </div>

      {/* ─── EDUCATIONAL CONTENT PRESERVATION PANEL ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left 2 Cols: Lesson Details & Scene Breakdown Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Lesson Overview */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60 uppercase">
                  {activeLesson.lessonNumber} CURRICULUM
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {activeLesson.filename}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-md border border-amber-200 dark:border-amber-900/60">
                <Award className="w-3.5 h-3.5" />
                <span>+50 XP on completion</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {activeLesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {activeLesson.description}
              </p>
            </div>

            {/* Topic Chips */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              {activeLesson.chips.map((chip, cIdx) => (
                <span
                  key={cIdx}
                  className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Detailed Scene-by-Scene Educational Matter Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  Educational Syllabus & Scene Transcripts
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {activeLesson.scenes.length} Scenes Preserved
              </span>
            </div>

            <div className="space-y-3">
              {activeLesson.scenes.map((sc, idx) => (
                <div
                  key={sc.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-2 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {sc.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {sc.badge}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {Math.floor(sc.timeStart)}s - {Math.floor(sc.timeEnd)}s
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    "{sc.narration}"
                  </p>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5 pt-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider shrink-0">
                      Key Concept:
                    </span>
                    <span>{sc.keyConcept}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Player Shortcuts & Asset Integrity Checklist */}
        <div className="space-y-6">
          {/* Keyboard Navigation Shortcuts */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Keyboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                Keyboard Controls
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-400">Play / Pause</span>
                <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                  Space
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-400">Rewind / Forward 5s</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                    ←
                  </kbd>
                  <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                    →
                  </kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-400">Volume Up / Down</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                    ↑
                  </kbd>
                  <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                    ↓
                  </kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-400">Mute / Unmute</span>
                <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                  M
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-400">Fullscreen Toggle</span>
                <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                  F
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-400">Restart from 0:00</span>
                <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                  R
                </kbd>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-400">Prev / Next Video</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                    P
                  </kbd>
                  <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold shadow-2xs">
                    N
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Quality & Integrity Guarantee */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <FileVideo className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                Video Standards
              </h3>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Original final video assets preserved</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Synchronized native voiceover audio</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standardized 14.6-inch 16:9 widescreen player for both videos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero stretching or cropping (object-fit: contain)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Independent audio playback (no overlap)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
