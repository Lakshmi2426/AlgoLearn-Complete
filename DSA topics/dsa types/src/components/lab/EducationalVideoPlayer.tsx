import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  Minimize2,
  Subtitles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Film,
  X,
  Info,
} from 'lucide-react';
import { LessonData, EducationalScene, LESSONS_DATA } from '../../data/labVideoData';

export type { LessonData, EducationalScene };

interface EducationalVideoPlayerProps {
  activeLesson: LessonData;
  customVideoUrl?: string | null;
  customVideoName?: string | null;
  autoPlayTrigger?: number;
  onSelectLesson?: (lessonId: number) => void;
  onUploadClick?: () => void;
  onLessonComplete?: (lessonId: number) => void;
  allLessons?: LessonData[];
}

export const EducationalVideoPlayer: React.FC<EducationalVideoPlayerProps> = ({
  activeLesson,
  customVideoUrl,
  customVideoName,
  autoPlayTrigger,
  onSelectLesson,
  onUploadClick,
  onLessonComplete,
  allLessons = LESSONS_DATA,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(activeLesson.duration);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.9);
  const [prevVolume, setPrevVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fsControlsVisible, setFsControlsVisible] = useState<boolean>(true);
  const [isHoveringControls, setIsHoveringControls] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);
  const [videoLoadError, setVideoLoadError] = useState<string | null>(null);
  const [sizeMode, setSizeMode] = useState<'14.6-wide' | '14.6-diag' | 'fit'>('14.6-wide');

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resolved video source path
  const effectiveVideoSrc =
    customVideoUrl ||
    activeLesson.videoSrc ||
    `/Videos/${encodeURIComponent(activeLesson.filename)}`;

  const totalDuration = videoDuration > 0 ? videoDuration : activeLesson.duration;

  // Auto-hide controls in full-screen during active playback
  const resetInactivityTimer = useCallback(() => {
    setFsControlsVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (isFullscreen && isPlaying && !isHoveringControls && !isDragging) {
      hideTimerRef.current = setTimeout(() => {
        setFsControlsVisible(false);
      }, 3500);
    }
  }, [isFullscreen, isPlaying, isHoveringControls, isDragging]);

  // When changing lessons: pause, clean up, reset playback state completely
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setIsVideoEnded(false);
    setVideoLoadError(null);
    setVideoDuration(activeLesson.duration);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
      try {
        videoRef.current.load();
      } catch (err) {
        console.warn('Video load error:', err);
      }
    }
  }, [activeLesson.id, activeLesson.filename, activeLesson.duration]);

  // Handle external autoplay trigger
  useEffect(() => {
    if (autoPlayTrigger && autoPlayTrigger > 0 && videoRef.current) {
      setCurrentTime(0);
      setIsVideoEnded(false);
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay with audio was blocked by browser policy; retry muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    }
  }, [autoPlayTrigger]);

  // Time & metadata handlers for native video
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (dur && !isNaN(dur) && isFinite(dur) && dur > 0) {
        setVideoDuration(dur);
      }
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
      videoRef.current.playbackRate = playbackSpeed;
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setIsVideoEnded(true);
    if (onLessonComplete) {
      onLessonComplete(activeLesson.id);
    }
  };

  // Play / Pause / Resume
  const handleTogglePlay = () => {
    if (!videoRef.current) return;

    if (isVideoEnded || currentTime >= totalDuration - 0.3) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsVideoEnded(false);
    }

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsVideoEnded(false);
          })
          .catch((err) => {
            console.warn('Playback blocked:', err);
            // If autoplay policy blocks unmuted audio, mute and play
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    }
    resetInactivityTimer();
  };

  // Seek time
  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(newTime, totalDuration));
    setCurrentTime(clamped);
    setIsVideoEnded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
    resetInactivityTimer();
  };

  // Relative skip
  const handleSkipTime = (deltaSeconds: number) => {
    handleSeek(currentTime + deltaSeconds);
  };

  // Restart from 0:00
  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsVideoEnded(false);
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    resetInactivityTimer();
  };

  // Volume & Mute
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) {
      setPrevVolume(val);
      setIsMuted(false);
      if (videoRef.current) {
        videoRef.current.volume = val;
        videoRef.current.muted = false;
      }
    } else {
      setIsMuted(true);
      if (videoRef.current) {
        videoRef.current.volume = 0;
        videoRef.current.muted = true;
      }
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted || volume === 0) {
      const restored = prevVolume > 0 ? prevVolume : 0.8;
      setIsMuted(false);
      setVolume(restored);
      videoRef.current.muted = false;
      videoRef.current.volume = restored;
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      videoRef.current.muted = true;
    }
  };

  // Speed
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Previous Video in Playlist
  const handlePrevVideo = () => {
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex > 0 && onSelectLesson) {
      onSelectLesson(allLessons[currentIndex - 1].id);
    } else {
      handleRestart();
    }
  };

  // Next Video in Playlist
  const handleNextVideo = () => {
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex < allLessons.length - 1 && onSelectLesson) {
      onSelectLesson(allLessons[currentIndex + 1].id);
    }
  };

  const canGoPrev = allLessons.findIndex((l) => l.id === activeLesson.id) > 0;
  const canGoNext = allLessons.findIndex((l) => l.id === activeLesson.id) < allLessons.length - 1;

  // Fullscreen
  const enterFullscreen = useCallback(() => {
    setIsFullscreen(true);
    setFsControlsVisible(true);
    resetInactivityTimer();
    try {
      const doc = document as any;
      const fsElem =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;
      if (containerRef.current && !fsElem) {
        const el = containerRef.current as any;
        if (typeof el.requestFullscreen === 'function') {
          el.requestFullscreen().catch(() => {});
        } else if (typeof el.webkitRequestFullscreen === 'function') {
          el.webkitRequestFullscreen();
        }
      }
    } catch {}
  }, [resetInactivityTimer]);

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
    setFsControlsVisible(true);
    try {
      const doc = document as any;
      const fsElem =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;
      if (fsElem) {
        if (typeof doc.exitFullscreen === 'function') {
          doc.exitFullscreen().catch(() => {});
        } else if (typeof doc.webkitExitFullscreen === 'function') {
          doc.webkitExitFullscreen();
        }
      }
    } catch {}
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) enterFullscreen();
    else exitFullscreen();
  };

  // Sync fullscreen change with document fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      const doc = document as any;
      const fsElem =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;
      setIsFullscreen(!!fsElem);
      if (!fsElem) setFsControlsVisible(true);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handleTogglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSkipTime(-5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSkipTime(5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((prev) => {
            const next = Math.min(1, prev + 0.1);
            if (videoRef.current) {
              videoRef.current.volume = next;
              videoRef.current.muted = false;
            }
            setIsMuted(false);
            return next;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((prev) => {
            const next = Math.max(0, prev - 0.1);
            if (videoRef.current) {
              videoRef.current.volume = next;
              videoRef.current.muted = next === 0;
            }
            setIsMuted(next === 0);
            return next;
          });
          break;
        case 'KeyM':
          e.preventDefault();
          handleToggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyR':
          e.preventDefault();
          handleRestart();
          break;
        case 'KeyN':
          e.preventDefault();
          if (canGoNext) handleNextVideo();
          break;
        case 'KeyP':
          e.preventDefault();
          if (canGoPrev) handlePrevVideo();
          break;
        case 'Escape':
          if (isFullscreen) {
            e.preventDefault();
            exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, totalDuration, isMuted, volume, isFullscreen, canGoNext, canGoPrev]);

  // Draggable Scrubber Logic
  const updateScrubberFromClientX = (clientX: number) => {
    if (!progressTrackRef.current) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    handleSeek(ratio * totalDuration);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    updateScrubberFromClientX(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateScrubberFromClientX(e.clientX);
    }
    if (progressTrackRef.current) {
      const rect = progressTrackRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverTime(ratio * totalDuration);
      setHoverPosition(ratio * 100);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Find active educational scene
  const currentSceneIndex = activeLesson.scenes.findIndex(
    (s) => currentTime >= s.timeStart && currentTime < s.timeEnd
  );
  const activeSceneIndexValid =
    currentSceneIndex >= 0 ? currentSceneIndex : activeLesson.scenes.length - 1;
  const activeScene = activeLesson.scenes[activeSceneIndexValid];

  // Time formatter: mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const getContainerStyle = () => {
    if (isFullscreen) return undefined;
    if (sizeMode === '14.6-wide') {
      return {
        width: 'calc(14.6in + 2.5rem)',
        minWidth: 'calc(14.6in + 2.5rem)',
      };
    }
    if (sizeMode === '14.6-diag') {
      return {
        width: 'calc(12.725in + 2.5rem)',
        minWidth: 'calc(12.725in + 2.5rem)',
      };
    }
    return {
      width: '100%',
      maxWidth: '100%',
    };
  };

  const getVideoDisplayAreaStyle = () => {
    if (isFullscreen) return undefined;
    if (sizeMode === '14.6-wide') {
      return {
        width: '14.6in',
        minWidth: '14.6in',
        height: 'calc(14.6in * 9 / 16)', // 8.2125in = 788.4px
        aspectRatio: '16 / 9',
      };
    }
    if (sizeMode === '14.6-diag') {
      return {
        width: '12.725in',
        minWidth: '12.725in',
        height: 'calc(12.725in * 9 / 16)', // 7.158in = 687.2px
        aspectRatio: '16 / 9',
      };
    }
    return {
      width: '100%',
      maxWidth: '100%',
      aspectRatio: '16 / 9',
    };
  };

  return (
    <div
      ref={containerRef}
      id="unified-video-player-container"
      className={`font-sans select-none transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-0 overflow-hidden'
          : 'bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-3xl p-3 sm:p-5 shadow-2xl shadow-slate-950/40 space-y-3 mx-auto'
      }`}
      style={getContainerStyle()}
    >
      {/* ─── 1. TOP STATUS BAR (NON-FULLSCREEN) ─── */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold tracking-wider text-indigo-400 uppercase">
                  {activeLesson.lessonNumber}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                  {formatTime(totalDuration)} • {sizeMode === '14.6-wide' ? '14.6" Widescreen (14.6in × 8.21in)' : sizeMode === '14.6-diag' ? '14.6" Diagonal (12.73in × 7.16in)' : 'Responsive Fit'}
                </span>
                {customVideoName && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                    Custom: {customVideoName}
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight uppercase">
                {activeLesson.title}
              </h2>
            </div>
          </div>

          {/* Size Mode Controls & Playlist Prev/Next Quick Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* 14.6" Display Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setSizeMode('14.6-wide')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  sizeMode === '14.6-wide'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="14.6-inch Physical Width (14.6in × 8.21in)"
              >
                14.6" Widescreen
              </button>
              <button
                onClick={() => setSizeMode('14.6-diag')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  sizeMode === '14.6-diag'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="14.6-inch Physical Diagonal Display (12.73in × 7.16in)"
              >
                14.6" Diagonal
              </button>
              <button
                onClick={() => setSizeMode('fit')}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  sizeMode === 'fit'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Fit to Window Viewport"
              >
                Fit
              </button>
            </div>

            <button
              onClick={handlePrevVideo}
              disabled={!canGoPrev}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                canGoPrev
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 active:scale-95'
                  : 'bg-slate-800/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
              }`}
              title="Previous Video in Playlist (Key: P)"
              aria-label="Previous Video"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev Video</span>
            </button>

            <button
              onClick={handleNextVideo}
              disabled={!canGoNext}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                canGoNext
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-600/30 active:scale-95'
                  : 'bg-slate-800/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
              }`}
              title="Next Video in Playlist (Key: N)"
              aria-label="Next Video"
            >
              <span className="hidden sm:inline">Next Video</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── 2. STANDARDIZED FULL VIDEO DISPLAY CONTAINER (14.6 INCH SIZE) ─── */}
      <div
        id="video-display-area"
        onClick={handleTogglePlay}
        className={`overflow-hidden relative flex items-center justify-center select-none bg-black cursor-pointer group mx-auto ${
          isFullscreen
            ? 'w-full h-full'
            : 'rounded-2xl border border-slate-800 shadow-inner'
        }`}
        style={getVideoDisplayAreaStyle()}
      >
        {/* Native HTML5 Video Element - Immutable Original Video Asset */}
        <video
          ref={videoRef}
          key={effectiveVideoSrc}
          src={effectiveVideoSrc}
          preload="auto"
          playsInline
          controls={false}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => {
            setIsPlaying(true);
            setIsVideoEnded(false);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={handleVideoEnded}
          onError={() => {
            setVideoLoadError(
              'Failed to load video file. Please ensure the MP4 file is available.'
            );
          }}
          className="w-full h-full object-contain bg-black pointer-events-none"
        >
          <source src={effectiveVideoSrc} type="video/mp4" />
          <source
            src={`/Videos/${encodeURIComponent(activeLesson.filename)}`}
            type="video/mp4"
          />
          Your browser does not support HTML5 MP4 video.
        </video>

        {/* Load Error Fallback Warning */}
        {videoLoadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/95 text-center z-30">
            <Info className="w-10 h-10 text-amber-400 mb-3" />
            <h3 className="text-white font-bold text-base mb-1">Video Asset Notice</h3>
            <p className="text-slate-400 text-xs max-w-md">{videoLoadError}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRestart();
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Retry Loading Video
            </button>
          </div>
        )}

        {/* Big Glowing Center Play Overlay when Paused */}
        {!isPlaying && !isVideoEnded && !videoLoadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity cursor-pointer z-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.85)] transform transition-transform group-hover:scale-110 active:scale-95">
              <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Video Completed Overlay */}
        {isVideoEnded && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm z-30 p-6 text-center animate-fade-in"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase mb-1">
              Lesson Video Completed!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 font-normal">
              You watched the complete educational presentation for {activeLesson.title}.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-all cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Replay Video</span>
              </button>
              {canGoNext && (
                <button
                  onClick={handleNextVideo}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <span>Continue to Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Synchronized On-Screen Educational Closed Captions */}
        {showCaptions && activeScene && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-3 left-4 right-4 sm:left-12 sm:right-12 z-20 pointer-events-none transition-opacity duration-200 ${
              isFullscreen && !fsControlsVisible ? 'bottom-6' : 'bottom-3'
            }`}
          >
            <div className="mx-auto max-w-3xl px-4 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/60 shadow-xl text-center">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase mr-2">
                [{activeScene.badge}]
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
                "{activeScene.narration}"
              </span>
            </div>
          </div>
        )}

        {/* Fullscreen Floating Exit Header */}
        {isFullscreen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-4 left-4 right-4 flex items-center justify-between z-40 transition-opacity duration-200 ${
              fsControlsVisible
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs font-mono font-bold border border-white/20">
                {activeLesson.lessonNumber}: {activeLesson.title}
              </span>
              {activeScene && (
                <span className="px-3 py-1.5 rounded-xl bg-indigo-950/80 backdrop-blur-md text-indigo-300 text-xs font-mono font-bold border border-indigo-500/40">
                  Topic {activeSceneIndexValid + 1}/{activeLesson.scenes.length}: {activeScene.title}
                </span>
              )}
            </div>
            <button
              onClick={exitFullscreen}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Fullscreen</span>
            </button>
          </div>
        )}
      </div>

      {/* ─── 3. VIDEO CONTROLS TOOLBAR ─── */}
      <div
        id="video-controls-toolbar"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onMouseEnter={() => {
          setIsHoveringControls(true);
          setFsControlsVisible(true);
          if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
          }
        }}
        onMouseLeave={() => {
          setIsHoveringControls(false);
          resetInactivityTimer();
        }}
        className={`w-full transition-all duration-300 ${
          isFullscreen
            ? `absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 z-40 p-4 sm:p-5 rounded-2xl bg-slate-950/95 backdrop-blur-md border border-white/15 shadow-2xl text-white ${
                fsControlsVisible
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`
            : 'pt-1 space-y-3 text-slate-100'
        }`}
      >
        {/* DRAGGABLE TIMELINE PROGRESS SCRUBBER */}
        <div className="w-full select-none">
          <div
            ref={progressTrackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onMouseLeave={() => setHoverTime(null)}
            className="relative w-full h-7 flex items-center cursor-pointer group touch-none"
            role="slider"
            aria-label="Seek Video Timeline"
            aria-valuemin={0}
            aria-valuemax={totalDuration}
            aria-valuenow={currentTime}
          >
            {/* Horizontal Track Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 relative overflow-hidden group-hover:h-2.5 transition-all">
              {/* Scene Boundary Tick Markers on the scrubber */}
              {activeLesson.scenes.map((sc, scIdx) => {
                if (scIdx === 0) return null;
                const tickPercent = (sc.timeStart / totalDuration) * 100;
                return (
                  <div
                    key={sc.id}
                    style={{ left: `${tickPercent}%` }}
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-600/70 z-10"
                    title={`${sc.title} (${formatTime(sc.timeStart)})`}
                  />
                );
              })}

              {/* Played Fill Bar */}
              <div
                className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full transition-[width] duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Hover Tooltip Preview */}
            {hoverTime !== null && (
              <div
                className="absolute -top-7 transform -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[11px] font-mono font-bold text-white shadow-md pointer-events-none z-30"
                style={{ left: `${hoverPosition}%` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}

            {/* Circular Draggable Scrubber Thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-indigo-500 bg-white shadow-md transition-transform duration-75 pointer-events-none ${
                isDragging ? 'scale-125 ring-4 ring-indigo-500/30' : 'group-hover:scale-110'
              }`}
              style={{ left: `calc(${progressPercent}% - 8px)` }}
            />
          </div>

          {/* Time & Chapter Metadata Bar */}
          <div className="flex items-center justify-between font-mono text-xs font-semibold px-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold">{formatTime(currentTime)}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">{formatTime(totalDuration)}</span>
            </div>

            {activeScene && (
              <div className="text-[11px] font-mono text-indigo-400 font-bold truncate max-w-[200px] sm:max-w-md">
                Topic {activeSceneIndexValid + 1}/{activeLesson.scenes.length}: {activeScene.title}
              </div>
            )}

            <div className="text-[11px] font-mono text-slate-400">
              Remaining: -{formatTime(Math.max(0, totalDuration - currentTime))}
            </div>
          </div>
        </div>

        {/* PRIMARY CONTROLS ROW */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
          {/* Left Group: Prev, Rewind 5s, Play/Pause/Resume, Forward 5s, Next, Restart */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Previous Video in Playlist */}
            <button
              onClick={handlePrevVideo}
              disabled={!canGoPrev}
              className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95 border ${
                canGoPrev
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-800/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
              }`}
              title="Previous Video (Key: P)"
              aria-label="Previous Video"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Rewind 5s */}
            <button
              onClick={() => handleSkipTime(-5)}
              className="p-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center cursor-pointer active:scale-95 group"
              title="Rewind 5 seconds (Key: ←)"
              aria-label="Rewind 5 seconds"
            >
              <RotateCcw className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
            </button>

            {/* Main Play / Pause / Resume Button */}
            <button
              onClick={handleTogglePlay}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer tracking-wide"
              aria-label={isPlaying ? 'Pause video (Space)' : 'Play video (Space)'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>{currentTime > 0 ? 'RESUME' : 'PLAY'}</span>
                </>
              )}
            </button>

            {/* Forward 5s */}
            <button
              onClick={() => handleSkipTime(5)}
              className="p-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center cursor-pointer active:scale-95 group"
              title="Forward 5 seconds (Key: →)"
              aria-label="Forward 5 seconds"
            >
              <RotateCw className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>

            {/* Next Video in Playlist */}
            <button
              onClick={handleNextVideo}
              disabled={!canGoNext}
              className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95 border ${
                canGoNext
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-800/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
              }`}
              title="Next Video (Key: N)"
              aria-label="Next Video"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Restart / Replay Button */}
            <button
              onClick={handleRestart}
              className="p-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center cursor-pointer active:scale-95 group"
              title="Restart from Beginning (Key: R)"
              aria-label="Restart Video"
            >
              <RefreshCw className="w-4 h-4 group-hover:-rotate-90 transition-transform" />
            </button>
          </div>

          {/* Middle Group: Playback Speed Control */}
          <div className="flex items-center rounded-xl p-1 font-mono text-xs bg-slate-800/90 border border-slate-700">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label={`Set speed to ${spd}x`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Right Group: Captions, Volume Control, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Subtitles / Caption Toggle */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                showCaptions
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={showCaptions ? 'Captions Active (Click to Hide)' : 'Captions Off (Click to Show)'}
              aria-label="Toggle Captions"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Volume Control Slider & Mute Toggle */}
            <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 bg-slate-800 border border-slate-700 text-slate-200">
              <button
                onClick={handleToggleMute}
                className="hover:text-indigo-400 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute (Key: M)' : 'Mute (Key: M)'}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume Slider"
                className="w-14 sm:w-20 h-1.5 rounded-full accent-indigo-500 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-400 w-6">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center cursor-pointer active:scale-95"
              title={isFullscreen ? 'Exit Fullscreen (Key: F / Esc)' : 'Fullscreen (Key: F)'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── 4. CHAPTER SCENE NAVIGATOR CHIPS ─── */}
      {!isFullscreen && (
        <div className="pt-2">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>Video Scene Index (Click to Jump):</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {activeLesson.scenes.map((sc, idx) => {
              const isCurrent = activeSceneIndexValid === idx;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSeek(sc.timeStart)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                      : 'bg-slate-800 hover:bg-slate-700/80 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isCurrent ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                    }`}
                  />
                  <span>
                    {idx + 1}. {sc.title}
                  </span>
                  <span className="text-[10px] opacity-70">
                    ({formatTime(sc.timeStart)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
