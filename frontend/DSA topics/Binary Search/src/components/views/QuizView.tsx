import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Check,
  Eye,
  Home,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { QuizQuestion, UserProgress } from '../../types';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { soundEffects } from '../../services/sound';
import { awardXP, awardQuizQuestionPoints } from '../../services/storage';
import { PointToastData } from '../common/PointToast';

interface QuizViewProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
  onNavigateHome?: () => void;
  onShowPointToast?: (toast: PointToastData) => void;
}

interface QuestionAnswerState {
  selectedOption: string | null;
  draggedOrder: string[];
  isSubmitted: boolean;
  isCorrect: boolean;
  isTimeout?: boolean;
  pointsDelta?: number;
}

const QUESTION_TIME_LIMIT = 20; // 20 seconds per question

export const QuizView: React.FC<QuizViewProps> = ({
  progress,
  onUpdateProgress,
  onNavigateHome,
  onShowPointToast,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, QuestionAnswerState>>({});
  // Track whether the quiz has been started by the user (prompted once at the beginning)
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(() => {
    const answeredCount = Object.keys(progress.topicPoints?.quizQuestionAnswered || {}).length;
    return answeredCount > 0;
  });
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_LIMIT);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [reviewQuestionIdx, setReviewQuestionIdx] = useState<number | null>(null);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIdx];
  const currentAnswerState = answers[currentIdx] || {
    selectedOption: null,
    draggedOrder: [],
    isSubmitted: false,
    isCorrect: false,
  };

  const isCurrentSubmitted = Boolean(currentAnswerState.isSubmitted);

  // Sync initial state if progress already contains scored questions
  useEffect(() => {
    const tpScores = progress.topicPoints?.quizQuestionScores || {};
    const tpAnswered = progress.topicPoints?.quizQuestionAnswered || {};
    if (Object.keys(tpAnswered).length > 0) {
      setAnswers((prev) => {
        const next = { ...prev };
        QUIZ_QUESTIONS.forEach((q, idx) => {
          if (tpAnswered[q.id] && !next[idx]?.isSubmitted) {
            const score = tpScores[q.id] ?? 0;
            const isCorrect = score === 3;
            const isTimeout = score === 0;
            next[idx] = {
              selectedOption: isCorrect ? (typeof q.correctAnswer === 'string' ? q.correctAnswer : null) : null,
              draggedOrder: Array.isArray(q.correctAnswer) ? q.correctAnswer : [],
              isSubmitted: true,
              isCorrect,
              isTimeout,
              pointsDelta: score,
            };
          }
        });
        return next;
      });
    }
  }, []);

  // Initialize drag order or answer state if not yet set
  useEffect(() => {
    if (!answers[currentIdx]) {
      if (currentQ.type === 'drag-order' && Array.isArray(currentQ.options)) {
        const shuffled = [...currentQ.options].sort(() => Math.random() - 0.5);
        setAnswers((prev) => ({
          ...prev,
          [currentIdx]: {
            selectedOption: null,
            draggedOrder: shuffled,
            isSubmitted: false,
            isCorrect: false,
          },
        }));
      } else {
        setAnswers((prev) => ({
          ...prev,
          [currentIdx]: {
            selectedOption: null,
            draggedOrder: [],
            isSubmitted: false,
            isCorrect: false,
          },
        }));
      }
    }
  }, [currentIdx, currentQ]);

  // Update timer on question switch
  useEffect(() => {
    if (answers[currentIdx]?.isSubmitted) {
      setTimeLeft(0);
    } else if (isQuizStarted) {
      // Once started at the beginning, each unsubmitted question automatically receives 20s
      setTimeLeft(QUESTION_TIME_LIMIT);
    } else {
      setTimeLeft(QUESTION_TIME_LIMIT);
    }
  }, [currentIdx, answers, isQuizStarted]);

  // 20-Second Countdown timer for active unsubmitted question (runs automatically once quiz has been started)
  useEffect(() => {
    if (quizFinished) return;
    if (!isQuizStarted) return;
    if (answers[currentIdx]?.isSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleQuestionTimeout(currentIdx);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIdx, isQuizStarted, answers, quizFinished]);

  // Start Quiz button handler (triggered once at the beginning to commence the quiz)
  const handleStartQuiz = () => {
    soundEffects.playClick();
    setIsQuizStarted(true);
    setTimeLeft(QUESTION_TIME_LIMIT);
  };

  // Timeout handler: closes question and gives 0 points
  const handleQuestionTimeout = (qIdx: number) => {
    const q = QUIZ_QUESTIONS[qIdx];
    if (!q) return;
    if (answers[qIdx]?.isSubmitted) return;

    soundEffects.playError();

    // Award 0 points and persist immediately
    const { updated } = awardQuizQuestionPoints(progress, q.id, 'timeout');
    onUpdateProgress(updated);

    setAnswers((prev) => ({
      ...prev,
      [qIdx]: {
        selectedOption: null,
        draggedOrder: [],
        isSubmitted: true,
        isCorrect: false,
        isTimeout: true,
        pointsDelta: 0,
      },
    }));
  };

  const handleSelectOption = (opt: string) => {
    if (!isQuizStarted || isCurrentSubmitted) return;
    soundEffects.playClick();
    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: {
        ...(prev[currentIdx] || {
          draggedOrder: [],
          isSubmitted: false,
          isCorrect: false,
        }),
        selectedOption: opt,
      },
    }));
  };

  const handleDragReorder = (sourceIdx: number, targetIdx: number) => {
    if (!isQuizStarted || isCurrentSubmitted) return;
    const currentList =
      currentAnswerState.draggedOrder.length > 0
        ? [...currentAnswerState.draggedOrder]
        : [...(currentQ.options || [])];
    const [moved] = currentList.splice(sourceIdx, 1);
    currentList.splice(targetIdx, 0, moved);

    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: {
        ...(prev[currentIdx] || {
          selectedOption: null,
          isSubmitted: false,
          isCorrect: false,
        }),
        draggedOrder: currentList,
      },
    }));
  };

  const handleSubmitAnswer = () => {
    if (!isQuizStarted || isCurrentSubmitted) return;
    soundEffects.playClick();

    let isCorrect = false;
    if (currentQ.type === 'drag-order') {
      const correctArr = currentQ.correctAnswer as string[];
      const order = currentAnswerState.draggedOrder;
      isCorrect =
        order.length === correctArr.length &&
        order.every((val, idx) => val === correctArr[idx]);
    } else {
      isCorrect = currentAnswerState.selectedOption === currentQ.correctAnswer;
    }

    if (isCorrect) {
      soundEffects.playSuccess();
    } else {
      soundEffects.playError();
    }

    // Award/deduct points (+3 for correct, -1 for wrong)
    const outcome = isCorrect ? 'correct' : 'wrong';
    const { updated, pointsDelta } = awardQuizQuestionPoints(progress, currentQ.id, outcome);
    onUpdateProgress(updated);

    if (onShowPointToast) {
      if (isCorrect) {
        onShowPointToast({
          points: 3,
          reason: 'Correct Answer',
          type: 'increase',
        });
      } else {
        onShowPointToast({
          points: -1,
          reason: 'Incorrect Answer',
          type: 'decrease',
        });
      }
    }

    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: {
        ...(prev[currentIdx] || {
          selectedOption: null,
          draggedOrder: [],
        }),
        isSubmitted: true,
        isCorrect,
        isTimeout: false,
        pointsDelta,
      },
    }));
  };

  const handlePreviousQuestion = () => {
    if (currentIdx > 0) {
      soundEffects.playClick();
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    soundEffects.playClick();

    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const totalCorrect = (Object.values(answers) as QuestionAnswerState[]).reduce(
      (acc, ans) => acc + (ans?.isCorrect ? 1 : 0),
      0
    );

    const totalScorePercent = Math.round(
      (totalCorrect / QUIZ_QUESTIONS.length) * 100
    );

    setQuizFinished(true);

    if (totalScorePercent >= 70) {
      soundEffects.playSuccess();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore
      }
    }

    const { updated } = awardXP(
      progress,
      150,
      'quiz_completed',
      'Quiz Completed',
      `Scored ${totalScorePercent}% on Assessment`
    );

    onUpdateProgress({
      ...updated,
      quizCompleted: true,
      quizHighScore: Math.max(updated.quizHighScore, totalScorePercent),
      quizTotalQuestionsAnswered:
        (updated.quizTotalQuestionsAnswered || 0) + QUIZ_QUESTIONS.length,
    });
  };

  const handleRestartQuiz = () => {
    soundEffects.playClick();
    setCurrentIdx(0);
    setAnswers({});
    setIsQuizStarted(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setQuizFinished(false);
    setReviewQuestionIdx(null);
  };

  // Compute live score stats
  const answersList = Object.values(answers) as QuestionAnswerState[];
  const totalCorrect = answersList.filter((a) => a?.isCorrect).length;
  const totalTimeouts = answersList.filter((a) => a?.isTimeout).length;
  const totalIncorrect = answersList.filter((a) => a?.isSubmitted && !a.isCorrect && !a.isTimeout).length;
  const finalScorePercent = Math.round(
    (totalCorrect / QUIZ_QUESTIONS.length) * 100
  );
  const currentQuizPoints = progress.topicPoints?.quizEarned ?? 0;

  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-5 pb-16 max-w-4xl mx-auto">
      {/* ─── 1. TOP HEADER CARD (MATCHING REFERENCE IMAGE 1) ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-start gap-4">
          {/* Rounded square purple icon container with graduation cap */}
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-2xs">
            <GraduationCap className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="space-y-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Binary Search Knowledge Check
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Test your understanding of binary search, its properties, boundaries, range reduction, and algorithmic technique.
            </p>
          </div>
        </div>

        {/* Scoring Pills Row */}
        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          {/* Correct Answer Pill */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              Correct answer: <strong className="font-bold font-mono text-emerald-800 dark:text-emerald-200">+3 points</strong>
            </span>
          </span>

          {/* Wrong Answer Pill */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/90 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>
              Wrong answer: <strong className="font-bold font-mono text-rose-800 dark:text-rose-200">-1 point</strong>
            </span>
          </span>
        </div>
      </div>

      {/* ─── 2. STEPPER PILLS NAVIGATION CARD (MATCHING REFERENCE IMAGE 1) ─── */}
      {!quizFinished && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 shadow-2xs">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 custom-scrollbar">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const ans = answers[idx];
              const isCurrent = idx === currentIdx;

              let buttonStyle = 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800';

              if (isCurrent) {
                buttonStyle = 'bg-blue-600 dark:bg-indigo-600 text-white font-bold border-blue-600 shadow-xs ring-2 ring-blue-500/20';
              } else if (ans?.isSubmitted) {
                if (ans.isCorrect) {
                  buttonStyle = 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold';
                } else if (ans.isTimeout) {
                  buttonStyle = 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold';
                } else {
                  buttonStyle = 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setCurrentIdx(idx);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${buttonStyle}`}
                >
                  <span>Q{idx + 1}</span>
                  {ans?.isSubmitted && ans.isCorrect && (
                    <Check className="w-3 h-3 stroke-[3]" />
                  )}
                  {ans?.isSubmitted && !ans.isCorrect && !ans.isTimeout && (
                    <span className="text-[10px]">✕</span>
                  )}
                  {ans?.isSubmitted && ans.isTimeout && (
                    <span className="text-[10px]">⏱</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 3. QUESTION CARD (MATCHING REFERENCE IMAGE 1) ─── */}
      {!quizFinished ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header Row of the Question */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            {/* Left Category / Number Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70">
                Q{currentIdx + 1} of 10
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Q{currentIdx + 1}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                CORE-0{currentIdx + 1}
              </span>
            </div>

            {/* Right Action: [ ✨ Start Quiz / Submit ] & [ 🕒 20s left ] Timer */}
            <div className="flex items-center gap-2.5">
              {!isCurrentSubmitted ? (
                <>
                  {!isQuizStarted ? (
                    <button
                      onClick={handleStartQuiz}
                      className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>Start Quiz</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!currentAnswerState.selectedOption && currentQ.type !== 'drag-order'}
                      className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 disabled:opacity-40 disabled:pointer-events-none text-white shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                    >
                      <span>Submit Answer</span>
                    </button>
                  )}

                  {/* 20s Timer Badge (ticking automatically once quiz is started at the beginning) */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border flex items-center gap-1.5 transition-colors ${
                      isQuizStarted
                        ? timeLeft <= 10
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse font-bold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timeLeft}s left</span>
                  </div>
                </>
              ) : (
                /* Evaluated Points Status Pill */
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-mono font-black border flex items-center gap-1.5 ${
                      currentAnswerState.isTimeout
                        ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                        : currentAnswerState.isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                    }`}
                  >
                    {currentAnswerState.isTimeout ? (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Closed (0 pts)</span>
                      </>
                    ) : currentAnswerState.isCorrect ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>+3 points</span>
                      </>
                    ) : (
                      <>
                        <span>✕</span>
                        <span>-1 point</span>
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
              {currentIdx + 1}. {currentQ.question}
            </h2>
          </div>

          {/* Prompt banner shown ONCE at the beginning if student has not started quiz yet */}
          {!isQuizStarted && !isCurrentSubmitted && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200 text-xs font-medium flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Click <strong>Start Quiz</strong> above to begin the 20-second timer per question and unlock answer options.</span>
              </span>
              <button
                onClick={handleStartQuiz}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                Start Quiz
              </button>
            </div>
          )}

          {/* Timeout Banner when question closes without submission */}
          {isCurrentSubmitted && currentAnswerState.isTimeout && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Time expired! The question was closed without submission. <strong>0 points</strong> awarded.</span>
            </div>
          )}

          {/* Options List (MCQ / Predict Output / True-False) */}
          {currentQ.type !== 'drag-order' && currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = currentAnswerState.selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let cardStyle =
                  'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';
                let letterStyle =
                  'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';

                // If not started yet: preview mode with light gray text
                if (!isQuizStarted && !isCurrentSubmitted) {
                  cardStyle =
                    'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/40 text-slate-400 dark:text-slate-500 cursor-not-allowed';
                  letterStyle =
                    'bg-slate-100/80 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500';
                } else if (isCurrentSubmitted) {
                  if (isCorrect) {
                    cardStyle =
                      'border-emerald-500 dark:border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-semibold ring-2 ring-emerald-200 dark:ring-emerald-900/50';
                    letterStyle =
                      'bg-emerald-600 text-white';
                  } else if (isSelected && !isCorrect) {
                    cardStyle =
                      'border-rose-400 dark:border-rose-600 bg-rose-50/70 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 ring-2 ring-rose-200 dark:ring-rose-900/50';
                    letterStyle =
                      'bg-rose-600 text-white';
                  } else {
                    cardStyle =
                      'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 opacity-60 text-slate-400 dark:text-slate-500';
                    letterStyle =
                      'bg-slate-100 dark:bg-slate-800 text-slate-400';
                  }
                } else if (isSelected) {
                  cardStyle =
                    'border-blue-600 dark:border-indigo-500 bg-blue-50/60 dark:bg-indigo-950/50 text-blue-900 dark:text-blue-100 font-semibold ring-2 ring-blue-300 dark:ring-indigo-900/50';
                  letterStyle =
                    'bg-blue-600 text-white';
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    disabled={!isQuizStarted || isCurrentSubmitted}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Letter Badge (A, B, C, D) */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-bold font-mono text-xs flex items-center justify-center shrink-0 transition-colors ${letterStyle}`}
                      >
                        {optionLetters[optIdx] || optIdx + 1}
                      </div>

                      <span className="leading-relaxed font-normal">{opt}</span>
                    </div>

                    {isCurrentSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {isCurrentSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Drag & Drop Reordering Mode */}
          {currentQ.type === 'drag-order' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Drag cards to rearrange them into the correct chronological sequence:
              </p>

              <div className="space-y-2">
                {(currentAnswerState.draggedOrder.length > 0
                  ? currentAnswerState.draggedOrder
                  : currentQ.options || []
                ).map((item, idx) => (
                  <div
                    key={item}
                    draggable={isQuizStarted && !isCurrentSubmitted}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', String(idx));
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const sourceIdx = Number(e.dataTransfer.getData('text/plain'));
                      handleDragReorder(sourceIdx, idx);
                    }}
                    className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                      !isQuizStarted && !isCurrentSubmitted
                        ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                        : isCurrentSubmitted
                        ? currentAnswerState.isCorrect
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200'
                          : 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-mono text-[11px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isCurrentSubmitted ? 'Submitted' : 'Drag to reorder'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation Box when question is completed */}
          {isCurrentSubmitted && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-xs space-y-1.5 animate-fadeIn">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Explanation:
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Footer Navigation Bar */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentIdx === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {isQuizStarted && !isCurrentSubmitted && (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswerState.selectedOption && currentQ.type !== 'drag-order'}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  Submit Answer
                </button>
              )}

              {isCurrentSubmitted && (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>
                    {currentIdx + 1 < QUIZ_QUESTIONS.length
                      ? 'Next Question'
                      : 'View Final Results'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ─── FINAL QUIZ COMPLETION RESULTS ─── */
        <div className="space-y-6 animate-fadeIn">
          <div
            className={`rounded-3xl p-8 sm:p-10 border shadow-lg text-center relative overflow-hidden transition-all ${
              finalScorePercent >= 80
                ? 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 dark:from-emerald-950/60 dark:via-slate-900 dark:to-emerald-950/30 border-emerald-300 dark:border-emerald-700/80 shadow-emerald-500/10'
                : finalScorePercent >= 60
                ? 'bg-gradient-to-b from-blue-50 via-white to-blue-50/40 dark:from-blue-950/60 dark:via-slate-900 dark:to-blue-950/30 border-blue-300 dark:border-blue-700/80 shadow-blue-500/10'
                : 'bg-gradient-to-b from-amber-50 via-white to-amber-50/40 dark:from-amber-950/60 dark:via-slate-900 dark:to-amber-950/30 border-amber-300 dark:border-amber-700/80 shadow-amber-500/10'
            }`}
          >
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-md mb-4 text-white ${
                  finalScorePercent >= 80
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-200 dark:shadow-emerald-950'
                    : finalScorePercent >= 60
                    ? 'bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 shadow-blue-200 dark:shadow-blue-950'
                    : 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-200 dark:shadow-amber-950'
                }`}
              >
                <Trophy className="w-10 h-10" />
              </div>

              <div
                className={`px-4 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider mb-2 border ${
                  finalScorePercent >= 80
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : finalScorePercent >= 60
                    ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                    : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                }`}
              >
                {finalScorePercent >= 80
                  ? '★ OUTSTANDING MASTERY (GRADE A+) ★'
                  : finalScorePercent >= 60
                  ? '★ PROFICIENT (GRADE B) ★'
                  : 'PRACTICE RECOMMENDED (GRADE C)'}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                BINARY SEARCH QUIZ COMPLETED!
              </h2>

              <div className="my-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border-2 border-blue-400/50 dark:border-blue-500/50 shadow-xl max-w-sm w-full mx-auto ring-4 ring-blue-500/10 dark:ring-blue-500/20">
                <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-400 uppercase block mb-1">
                  TOPIC QUIZ POINTS EARNED
                </span>

                <div className="flex items-baseline justify-center gap-1 font-mono font-black">
                  <span className="text-6xl sm:text-7xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                    {currentQuizPoints}
                  </span>
                  <span className="text-2xl text-slate-400">/ 30 pts</span>
                </div>

                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <span>{totalCorrect} Correct ({totalCorrect * 3} pts)</span>
                  <span className="text-slate-400">•</span>
                  <span>{finalScorePercent}% Accuracy</span>
                </div>
              </div>

              {/* Highlight Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Correct (+3)</span>
                  <span className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                    <Check className="w-4 h-4 stroke-[3]" /> {totalCorrect}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Incorrect (-1)</span>
                  <span className="text-xl font-mono font-black text-rose-600 dark:text-rose-400">
                    {totalIncorrect}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Timeouts (0)</span>
                  <span className="text-xl font-mono font-black text-amber-500">
                    {totalTimeouts}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Reward XP</span>
                  <span className="text-xl font-mono font-black text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
                    <Sparkles className="w-4 h-4" /> +150
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full max-w-lg mx-auto">
                <button
                  onClick={handleRestartQuiz}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-500 hover:from-blue-800 hover:via-blue-700 hover:to-indigo-600 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/25 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
                {onNavigateHome && (
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onNavigateHome();
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Back to Home</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Breakdown List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Question Breakdown & Answers
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {totalCorrect} of {QUIZ_QUESTIONS.length} Correct
              </span>
            </div>

            <div className="space-y-3">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const ans = answers[idx];
                const isCorrect = ans?.isCorrect;
                const isTimeout = ans?.isTimeout;
                const isExpanded = reviewQuestionIdx === idx;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border transition-all ${
                      isCorrect
                        ? 'border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                        : isTimeout
                        ? 'border-amber-200/80 dark:border-amber-800/60 bg-amber-50/30 dark:bg-amber-950/20'
                        : 'border-rose-200/80 dark:border-rose-800/60 bg-rose-50/30 dark:bg-rose-950/20'
                    }`}
                  >
                    <div
                      onClick={() => setReviewQuestionIdx(isExpanded ? null : idx)}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : isTimeout
                              ? 'bg-amber-500 text-white'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                            {q.question}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5">
                            {isCorrect
                              ? '✓ Solved Correctly (+3 pts)'
                              : isTimeout
                              ? '⏱ Time Expired (0 pts)'
                              : '✕ Incorrect (-1 pt)'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-3 py-1 rounded-lg text-xs font-mono font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                      >
                        {isExpanded ? 'Hide' : 'Explain'}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 text-xs space-y-2 border-t border-slate-200/60 dark:border-slate-800">
                        <div className="pt-2 text-slate-600 dark:text-slate-300">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            Correct Answer:{' '}
                          </span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            {Array.isArray(q.correctAnswer)
                              ? q.correctAnswer.join(' ➔ ')
                              : q.correctAnswer}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800">
                          💡 <strong className="text-slate-800 dark:text-slate-200">Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
