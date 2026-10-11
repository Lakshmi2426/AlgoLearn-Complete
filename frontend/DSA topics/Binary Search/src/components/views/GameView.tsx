import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Lightbulb,
  Compass,
  ArrowLeft,
  HelpCircle,
  Calculator,
  GitBranch,
} from 'lucide-react';
import { UserProgress } from '../../types';
import { GAME_LEVELS, BinarySearchLevelConfig, BinarySearchChallenge } from '../../data/gameData';
import { GAME_CATALOG } from '../../data/gameMeta';
import { soundEffects } from '../../services/sound';
import { awardXP, awardGameLevelPoints, deductHintPoints, deductGuidedSolvePoints } from '../../services/storage';
import {
  GuidedSubStage,
  getGuidedStepDetails,
  calculateTotalGuideStages,
  getExpectedAction,
} from '../../services/guidedSolveEngine';

// Modular Game Components
import { BinarySearchBoard } from '../game/BinarySearchBoard';
import { BinarySearchActionControls } from '../game/BinarySearchActionControls';
import { BinarySearchGuidedSolve } from '../game/BinarySearchGuidedSolve';
import { LevelCardGrid } from '../game/LevelCardGrid';
import { BinarySearchLabCard } from '../game/BinarySearchLabCard';
import { InGameLab } from '../game/InGameLab';
import { GameFeedbackCard } from '../game/GameFeedbackCard';
import { LevelCompleteModal } from '../game/LevelCompleteModal';
import { PointToastData } from '../common/PointToast';

interface GameViewProps {
  progress: UserProgress;
  activeLevelId: number;
  onSelectLevel: (levelId: number) => void;
  onUpdateProgress: (updated: UserProgress) => void;
  onShowPointToast?: (toast: PointToastData) => void;
}

interface MoveSnapshot {
  low: number;
  high: number;
  mid: number;
  stepsTaken: string[];
  feedback: {
    status: 'correct' | 'incorrect' | null;
    title: string;
    actionText: string;
    reason: string;
  } | null;
}

export const GameView: React.FC<GameViewProps> = ({
  progress,
  activeLevelId,
  onSelectLevel,
  onUpdateProgress,
  onShowPointToast,
}) => {
  const triggerPointToast = (data: PointToastData) => {
    if (onShowPointToast) {
      onShowPointToast(data);
    }
  };
  // Navigation: 'levels' (selection hub), 'playing' (active gameplay), or 'lab' (experiment sandbox)
  const [screenMode, setScreenMode] = useState<'levels' | 'playing' | 'lab'>('levels');

  // Active level configuration
  const currentLevel: BinarySearchLevelConfig =
    GAME_LEVELS.find((l) => l.id === activeLevelId) || GAME_LEVELS[0];

  // Active challenge within the level
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const challenges = currentLevel.challenges || [];
  const safeChallengeIndex = Math.min(
    currentChallengeIndex,
    Math.max(0, challenges.length - 1)
  );
  const currentChallenge: BinarySearchChallenge =
    challenges[safeChallengeIndex] || challenges[0];

  // Game Performance Stats
  const [score, setScore] = useState<number>(1200);
  const [streak, setStreak] = useState<number>(3);
  const [mistakes, setMistakes] = useState<number>(0);

  // Active Challenge Board State
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(currentChallenge.array.length - 1);
  const [mid, setMid] = useState<number>(
    Math.floor((currentChallenge.array.length - 1) / 2)
  );
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isFound, setIsFound] = useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  // Move History for Undo
  const [history, setHistory] = useState<MoveSnapshot[]>([]);
  const [stepsTaken, setStepsTaken] = useState<string[]>([]);

  // Feedback State
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'incorrect' | null;
    title: string;
    actionText: string;
    reason: string;
  } | null>(null);

  // Hints State: 3 progressive stages (0 = closed, 1 = concept, 2 = direction, 3 = exact)
  const [hintStage, setHintStage] = useState<number>(0);
  const [hintsUsedInLevel, setHintsUsedInLevel] = useState<boolean>(false);

  // Guided Solve Tutor State
  const [isGuidedSolveOpen, setIsGuidedSolveOpen] = useState<boolean>(false);
  const [guidedSolvesUsedInLevel, setGuidedSolvesUsedInLevel] = useState<boolean>(false);
  const [lastEarnedPoints, setLastEarnedPoints] = useState<number>(10);
  const [guidedSubStage, setGuidedSubStage] = useState<GuidedSubStage>('EXPLAIN_RANGE');
  const [guidedStepNumber, setGuidedStepNumber] = useState<number>(1);
  const [guidedTotalSteps, setGuidedTotalSteps] = useState<number>(4);
  const [guidedWrongAttempt, setGuidedWrongAttempt] = useState<{
    action: string;
    message: string;
  } | null>(null);
  const [guidedLastSuccess, setGuidedLastSuccess] = useState<{
    pointerUpdated: 'LOW' | 'HIGH';
    oldValue: number;
    newValue: number;
    formula: string;
    explanation: string;
  } | null>(null);

  // Dynamic details of the current guided step
  const guidedStepDetails = useMemo(() => {
    return getGuidedStepDetails(
      currentChallenge,
      low,
      high,
      mid,
      guidedSubStage,
      guidedStepNumber,
      guidedTotalSteps,
      guidedLastSuccess
    );
  }, [
    currentChallenge,
    low,
    high,
    mid,
    guidedSubStage,
    guidedStepNumber,
    guidedTotalSteps,
    guidedLastSuccess,
  ]);

  // How to Play Helper Toggle
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // Level Complete Modal State
  const [isLevelModalOpen, setIsLevelModalOpen] = useState<boolean>(false);

  // Initialize or Reset a Challenge
  const initializeChallenge = useCallback(
    (challenge: BinarySearchChallenge) => {
      if (!challenge) return;
      const initialLow =
        challenge.initialLow !== undefined ? challenge.initialLow : 0;
      const initialHigh =
        challenge.initialHigh !== undefined
          ? challenge.initialHigh
          : challenge.array.length - 1;
      const initialMid = Math.floor(initialLow + (initialHigh - initialLow) / 2);

      setLow(initialLow);
      setHigh(initialHigh);
      setMid(initialMid);
      setIsSolved(false);
      setIsFound(false);
      setIsNotFound(false);
      setHistory([]);
      setStepsTaken([]);
      setFeedback(null);
      setHintStage(0);
      setIsGuidedSolveOpen(false);
      setGuidedSubStage('EXPLAIN_RANGE');
      setGuidedStepNumber(1);
      setGuidedWrongAttempt(null);
      setGuidedLastSuccess(null);
    },
    []
  );

  // Reset when level or challenge changes
  useEffect(() => {
    if (currentChallenge) {
      initializeChallenge(currentChallenge);
    }
  }, [activeLevelId, safeChallengeIndex, currentChallenge, initializeChallenge]);

  // Launch a selected level directly into gameplay
  const handleOpenLevel = (levelId: number) => {
    soundEffects.playClick();
    onSelectLevel(levelId);
    setCurrentChallengeIndex(0);
    setMistakes(0);
    setGuidedSolvesUsedInLevel(false);
    setHintsUsedInLevel(false);
    const targetLevel = GAME_LEVELS.find((l) => l.id === levelId) || GAME_LEVELS[0];
    if (targetLevel && targetLevel.challenges && targetLevel.challenges[0]) {
      initializeChallenge(targetLevel.challenges[0]);
    }
    setScreenMode('playing');
  };

  // Question-Level Reset (resets array/pointers without resetting score/streak)
  const handleQuestionReset = () => {
    soundEffects.playClick();
    if (currentChallenge) {
      initializeChallenge(currentChallenge);
    }
  };

  // Level Reset (resets back to Challenge 1 of the active level)
  const handleResetLevel = () => {
    soundEffects.playClick();
    setCurrentChallengeIndex(0);
    setMistakes(0);
    setGuidedSolvesUsedInLevel(false);
    setHintsUsedInLevel(false);
    if (currentLevel.challenges[0]) {
      initializeChallenge(currentLevel.challenges[0]);
    }
  };

  // Undo Last Move
  const handleUndo = () => {
    if (history.length === 0 || isSolved) return;
    soundEffects.playClick();
    const previous = history[history.length - 1];
    setLow(previous.low);
    setHigh(previous.high);
    setMid(previous.mid);
    setStepsTaken(previous.stepsTaken);
    setFeedback(previous.feedback);
    setHistory((prev) => prev.slice(0, -1));

    if (isGuidedSolveOpen) {
      setGuidedWrongAttempt(null);
      setGuidedLastSuccess(null);
      setGuidedSubStage('EXPLAIN_RANGE');
      setGuidedStepNumber((prev) => Math.max(1, prev - 1));
    }
  };

  // Save State Snapshot before moving
  const saveSnapshot = () => {
    setHistory((prev) => [
      ...prev,
      {
        low,
        high,
        mid,
        stepsTaken: [...stepsTaken],
        feedback: feedback ? { ...feedback } : null,
      },
    ]);
  };

  // Handle Level Completion
  const triggerLevelCompletion = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    soundEffects.playSuccess();

    // Safely Award XP
    const awardResult = awardXP(
      progress,
      currentLevel.xpReward,
      `game-level-${currentLevel.id}`,
      currentLevel.title,
      `Completed all challenges in ${currentLevel.title}`
    );

    const baseProgress = awardResult.updated;

    // Award Game Level Points with deductions: -3 pts for Guided Solve, -2 pts for Hint
    const { updated: progressWithPoints, pointsAwarded } = awardGameLevelPoints(
      baseProgress,
      currentLevel.id,
      guidedSolvesUsedInLevel ? 1 : 0,
      hintsUsedInLevel ? 1 : 0
    );
    const finalPoints = pointsAwarded > 0 ? pointsAwarded : 10;
    setLastEarnedPoints(finalPoints);
    triggerPointToast({
      points: finalPoints,
      reason: 'Level Completed',
      type: 'increase',
    });

    const currentCompleted = Array.isArray(progressWithPoints.completedGameLevels)
      ? progressWithPoints.completedGameLevels
      : [];
    const finalCompleted = currentCompleted.includes(currentLevel.id)
      ? currentCompleted
      : [...currentCompleted, currentLevel.id];

    const finalProgress: UserProgress = {
      ...progressWithPoints,
      completedGameLevels: finalCompleted,
    };
    onUpdateProgress(finalProgress);

    setIsLevelModalOpen(true);
  };

  // Guided Solve Toggle
  const handleToggleGuidedSolve = () => {
    soundEffects.playClick();
    if (isGuidedSolveOpen) {
      setIsGuidedSolveOpen(false);
      return;
    }

    // Flag guided solve usage for deduction (-3 pts)
    setGuidedSolvesUsedInLevel(true);
    triggerPointToast({
      points: -3,
      reason: 'Guided Solve Used',
      type: 'decrease',
    });
    // Immediately update progress in storage and app state so Progress section updates right away
    const { updated: progressAfterGuided } = deductGuidedSolvePoints(progress, currentLevel.id);
    onUpdateProgress(progressAfterGuided);

    // Temporarily dismiss hints per spec
    setHintStage(0);
    setGuidedWrongAttempt(null);
    setGuidedLastSuccess(null);

    const total = calculateTotalGuideStages(currentChallenge, low, high);
    setGuidedTotalSteps(total);

    const midVal =
      mid >= 0 && mid < currentChallenge.array.length
        ? currentChallenge.array[mid]
        : null;
    const isOutOfRange = low > high;

    if (isOutOfRange) {
      setGuidedSubStage('COMPARE');
      setGuidedStepNumber(total);
    } else if (
      midVal === currentChallenge.target &&
      !(
        currentChallenge.mode === 'first-occurrence' &&
        mid > 0 &&
        currentChallenge.array[mid - 1] === currentChallenge.target
      ) &&
      !(
        currentChallenge.mode === 'last-occurrence' &&
        mid < currentChallenge.array.length - 1 &&
        currentChallenge.array[mid + 1] === currentChallenge.target
      )
    ) {
      setGuidedSubStage('COMPARE');
      setGuidedStepNumber(Math.max(1, total - 1));
    } else {
      setGuidedSubStage('EXPLAIN_RANGE');
      setGuidedStepNumber(1);
    }

    setIsGuidedSolveOpen(true);
  };

  // Player Action: Search Left Half
  const handleSearchLeft = () => {
    if (isSolved) return;

    if (low > high) {
      soundEffects.playError();
      setMistakes((prev) => prev + 1);
      setStreak(0);
      setFeedback({
        status: 'incorrect',
        title: 'Search Window is Empty!',
        actionText: `low (${low}) > high (${high}).`,
        reason: 'Pointers have crossed. The target is not in the array. Select "TARGET NOT FOUND".',
      });
      return;
    }

    // Guided Solve Validation
    if (isGuidedSolveOpen) {
      const expected = getExpectedAction(currentChallenge, low, high, mid);
      if (expected !== 'LEFT') {
        soundEffects.playError();
        setMistakes((prev) => prev + 1);
        setStreak(0);

        let errorMsg = `The target (${currentChallenge.target}) is greater than arr[${mid}] (${currentChallenge.array[mid]}). Because the array is sorted, the target cannot be in the left half. You must search the RIGHT half.`;
        if (expected === 'FOUND') {
          errorMsg = `arr[${mid}] matches target ${currentChallenge.target}! Choose "TARGET FOUND" instead of searching left.`;
        } else if (expected === 'NOT_FOUND') {
          errorMsg = `Search window is empty (low: ${low} > high: ${high}). Choose "TARGET NOT FOUND".`;
        }
        setGuidedWrongAttempt({ action: 'LEFT', message: errorMsg });
        return;
      }

      setGuidedWrongAttempt(null);
      const nextHigh = mid - 1;
      if (currentChallenge.targetAction === 'LEFT') {
        setGuidedSubStage('TARGET_FOUND');
        setGuidedStepNumber(guidedTotalSteps);
      } else {
        setGuidedLastSuccess({
          pointerUpdated: 'HIGH',
          oldValue: high,
          newValue: nextHigh,
          formula: 'high = mid - 1',
          explanation: `Target (${currentChallenge.target}) < arr[${mid}] (${currentChallenge.array[mid]}): All elements at and to the right of index [${mid}] are eliminated. HIGH pointer updated to [${nextHigh}].`,
        });
        setGuidedSubStage('ACTION_RESULT');
        setGuidedStepNumber((prev) => Math.min(guidedTotalSteps, prev + 1));
      }
    }

    // Check if challenge is an explicit direction decision question expecting 'LEFT'
    if (currentChallenge.targetAction === 'LEFT') {
      soundEffects.playSuccess();
      setIsSolved(true);
      setIsFound(true);
      const points = 100 + streak * 15;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);

      const nextHigh = mid - 1;
      const nextMid = nextHigh >= low ? Math.floor(low + (nextHigh - low) / 2) : -1;
      setHigh(nextHigh);
      setMid(nextMid);

      const stepLog = `Target ${currentChallenge.target} < arr[${mid}] (${currentChallenge.array[mid]}) → Correctly Searched Left (high = ${nextHigh})!`;
      setStepsTaken((prev) => [...prev, stepLog]);

      setFeedback({
        status: 'correct',
        title: currentChallenge.feedback?.correctTitle || '🎉 Correct Direction: Searched Left!',
        actionText: currentChallenge.feedback?.correctActionText || `High pointer shifted to [${nextHigh}]. Right half eliminated.`,
        reason: currentChallenge.feedback?.reason || `Target (${currentChallenge.target}) < arr[${mid}] (${currentChallenge.array[mid]}). Correct half chosen!`,
      });

      if (currentChallengeIndex === challenges.length - 1) {
        setTimeout(triggerLevelCompletion, 500);
      }
      return;
    }

    if (currentChallenge.targetAction === 'RIGHT') {
      soundEffects.playError();
      setMistakes((prev) => prev + 1);
      setStreak(0);
      setFeedback({
        status: 'incorrect',
        title: 'Incorrect Direction!',
        actionText: `Target (${currentChallenge.target}) > arr[${mid}] (${currentChallenge.array[mid]}).`,
        reason: currentChallenge.feedback?.incorrectTip || 'Target is greater than the middle element. You must search the RIGHT half.',
      });
      return;
    }

    saveSnapshot();

    const midVal = currentChallenge.array[mid];
    const target = currentChallenge.target;

    // Check duplicate first-occurrence special rule
    const isFirstOccurrenceTarget =
      currentChallenge.mode === 'first-occurrence' &&
      midVal === target &&
      mid > 0 &&
      currentChallenge.array[mid - 1] === target;

    const isCorrect = target < midVal || isFirstOccurrenceTarget;

    if (isCorrect) {
      soundEffects.playClick();
      const nextHigh = mid - 1;
      const nextMid =
        nextHigh >= low ? Math.floor(low + (nextHigh - low) / 2) : -1;

      const stepLog = `Step ${stepsTaken.length + 1}: Checked mid = [${mid}] (${midVal}). Target ${target} < ${midVal} → Searched Left (high = ${nextHigh})`;
      setStepsTaken((prev) => [...prev, stepLog]);

      setHigh(nextHigh);
      setMid(nextMid);
      setScore((prev) => prev + 25);

      let actionHint = `High pointer shifted to [${nextHigh}]. Right half eliminated.`;
      if (nextHigh < low) {
        actionHint += ` Pointers crossed (low: ${low} > high: ${nextHigh}). Target is absent! Click "TARGET NOT FOUND".`;
      } else if (nextMid >= 0 && currentChallenge.array[nextMid] === target) {
        actionHint += ` New mid is index [${nextMid}] (value: ${currentChallenge.array[nextMid]}). Matches target! Click "TARGET FOUND".`;
      }

      setFeedback({
        status: 'correct',
        title: 'Correct Direction: Searched Left!',
        actionText: actionHint,
        reason: isFirstOccurrenceTarget
          ? `arr[${mid}] matches target, but arr[${mid - 1}] is also ${target}! Searching left to find the FIRST occurrence.`
          : `Target (${target}) < arr[${mid}] (${midVal}). Since array is sorted, target cannot exist in the right half.`,
      });
    } else {
      soundEffects.playError();
      setMistakes((prev) => prev + 1);
      setStreak(0);

      if (midVal === target) {
        setFeedback({
          status: 'incorrect',
          title: 'Target is Already at Midpoint!',
          actionText: `arr[${mid}] is ${midVal}, which matches target ${target}!`,
          reason: 'You should click "TARGET FOUND" instead of searching left.',
        });
      } else {
        setFeedback({
          status: 'incorrect',
          title: 'Incorrect Direction!',
          actionText: `Target (${target}) > arr[${mid}] (${midVal}).`,
          reason: `Target is greater than the middle element. You must search the RIGHT half, not the left.`,
        });
      }
    }
  };

  // Player Action: Search Right Half
  const handleSearchRight = () => {
    if (isSolved) return;

    if (low > high) {
      soundEffects.playError();
      setMistakes((prev) => prev + 1);
      setStreak(0);
      setFeedback({
        status: 'incorrect',
        title: 'Search Window is Empty!',
        actionText: `low (${low}) > high (${high}).`,
        reason: 'Pointers have crossed. The target is not in the array. Select "TARGET NOT FOUND".',
      });
      return;
    }

    // Guided Solve Validation
    if (isGuidedSolveOpen) {
      const expected = getExpectedAction(currentChallenge, low, high, mid);
      if (expected !== 'RIGHT') {
        soundEffects.playError();
        setMistakes((prev) => prev + 1);
        setStreak(0);

        let errorMsg = `The target (${currentChallenge.target}) is less than arr[${mid}] (${currentChallenge.array[mid]}). Because the array is sorted, the target cannot be in the right half. You must search the LEFT half.`;
        if (expected === 'FOUND') {
          errorMsg = `arr[${mid}] matches target ${currentChallenge.target}! Choose "TARGET FOUND" instead of searching right.`;
        } else if (expected === 'NOT_FOUND') {
          errorMsg = `Search window is empty (low: ${low} > high: ${high}). Choose "TARGET NOT FOUND".`;
        }
        setGuidedWrongAttempt({ action: 'RIGHT', message: errorMsg });
        return;
      }

      setGuidedWrongAttempt(null);
      const nextLow = mid + 1;
      if (currentChallenge.targetAction === 'RIGHT') {
        setGuidedSubStage('TARGET_FOUND');
        setGuidedStepNumber(guidedTotalSteps);
      } else {
        setGuidedLastSuccess({
          pointerUpdated: 'LOW',
          oldValue: low,
          newValue: nextLow,
          formula: 'low = mid + 1',
          explanation: `Target (${currentChallenge.target}) > arr[${mid}] (${currentChallenge.array[mid]}): All elements at and to the left of index [${mid}] are eliminated. LOW pointer updated to [${nextLow}].`,
        });
        setGuidedSubStage('ACTION_RESULT');
        setGuidedStepNumber((prev) => Math.min(guidedTotalSteps, prev + 1));
      }
    }

    // Check if challenge is an explicit direction decision question expecting 'RIGHT'
    if (currentChallenge.targetAction === 'RIGHT') {
      soundEffects.playSuccess();
      setIsSolved(true);
      setIsFound(true);
      const points = 100 + streak * 15;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);

      const nextLow = mid + 1;
      const nextMid = nextLow <= high ? Math.floor(nextLow + (high - nextLow) / 2) : -1;
      setLow(nextLow);
      setMid(nextMid);

      const stepLog = `Target ${currentChallenge.target} > arr[${mid}] (${currentChallenge.array[mid]}) → Correctly Searched Right (low = ${nextLow})!`;
      setStepsTaken((prev) => [...prev, stepLog]);

      setFeedback({
        status: 'correct',
        title: currentChallenge.feedback?.correctTitle || '🎉 Correct Direction: Searched Right!',
        actionText: currentChallenge.feedback?.correctActionText || `Low pointer shifted to [${nextLow}]. Left half eliminated.`,
        reason: currentChallenge.feedback?.reason || `Target (${currentChallenge.target}) > arr[${mid}] (${currentChallenge.array[mid]}). Right half chosen!`,
      });

      if (currentChallengeIndex === challenges.length - 1) {
        setTimeout(triggerLevelCompletion, 500);
      }
      return;
    }

    if (currentChallenge.targetAction === 'LEFT') {
      soundEffects.playError();
      setMistakes((prev) => prev + 1);
      setStreak(0);
      setFeedback({
        status: 'incorrect',
        title: 'Incorrect Direction!',
        actionText: `Target (${currentChallenge.target}) < arr[${mid}] (${currentChallenge.array[mid]}).`,
        reason: currentChallenge.feedback?.incorrectTip || 'Target is smaller than the middle element. You must search the LEFT half.',
      });
      return;
    }

    saveSnapshot();

    const midVal = currentChallenge.array[mid];
    const target = currentChallenge.target;

    // Check duplicate last-occurrence special rule
    const isLastOccurrenceTarget =
      currentChallenge.mode === 'last-occurrence' &&
      midVal === target &&
      mid < currentChallenge.array.length - 1 &&
      currentChallenge.array[mid + 1] === target;

    const isCorrect = target > midVal || isLastOccurrenceTarget;

    if (isCorrect) {
      soundEffects.playClick();
      const nextLow = mid + 1;
      const nextMid =
        nextLow <= high ? Math.floor(nextLow + (high - nextLow) / 2) : -1;

      const stepLog = `Step ${stepsTaken.length + 1}: Checked mid = [${mid}] (${midVal}). Target ${target} > ${midVal} → Searched Right (low = ${nextLow})`;
      setStepsTaken((prev) => [...prev, stepLog]);

      setLow(nextLow);
      setMid(nextMid);
      setScore((prev) => prev + 25);

      let actionHint = `Low pointer shifted to [${nextLow}]. Left half eliminated.`;
      if (nextLow > high) {
        actionHint += ` Pointers crossed (low: ${nextLow} > high: ${high}). Target is absent! Click "TARGET NOT FOUND".`;
      } else if (nextMid >= 0 && currentChallenge.array[nextMid] === target) {
        actionHint += ` New mid is index [${nextMid}] (value: ${currentChallenge.array[nextMid]}). Matches target! Click "TARGET FOUND".`;
      }

      setFeedback({
        status: 'correct',
        title: 'Correct Direction: Searched Right!',
        actionText: actionHint,
        reason: isLastOccurrenceTarget
          ? `arr[${mid}] matches target, but arr[${mid + 1}] is also ${target}! Searching right to find the LAST occurrence.`
          : `Target (${target}) > arr[${mid}] (${midVal}). Since array is sorted, target cannot exist in the left half.`,
      });
    } else {
      soundEffects.playError();
      setMistakes((prev) => prev + 1);
      setStreak(0);

      if (midVal === target) {
        setFeedback({
          status: 'incorrect',
          title: 'Target is Already at Midpoint!',
          actionText: `arr[${mid}] is ${midVal}, which matches target ${target}!`,
          reason: 'You should click "TARGET FOUND" instead of searching right.',
        });
      } else {
        setFeedback({
          status: 'incorrect',
          title: 'Incorrect Direction!',
          actionText: `Target (${target}) < arr[${mid}] (${midVal}).`,
          reason: `Target is smaller than the middle element. You must search the LEFT half, not the right.`,
        });
      }
    }
  };

  // Player Action: Target Found
  const handleTargetFound = () => {
    if (isSolved) return;

    // Guided Solve Validation
    if (isGuidedSolveOpen) {
      const expected = getExpectedAction(currentChallenge, low, high, mid);
      if (expected !== 'FOUND') {
        soundEffects.playError();
        setMistakes((prev) => prev + 1);
        setStreak(0);

        let errorMsg = `arr[${mid}] is ${currentChallenge.array[mid]}, which does not match target ${currentChallenge.target}. Compare values and choose which half to search.`;
        if (low > high) {
          errorMsg = `Search range is empty (low: ${low} > high: ${high}). Choose "TARGET NOT FOUND".`;
        } else if (
          currentChallenge.mode === 'first-occurrence' &&
          currentChallenge.array[mid] === currentChallenge.target &&
          mid > 0 &&
          currentChallenge.array[mid - 1] === currentChallenge.target
        ) {
          errorMsg = `arr[${mid}] is ${currentChallenge.target}, but arr[${mid - 1}] is ALSO ${currentChallenge.target}! To find the FIRST occurrence, search the LEFT half.`;
        } else if (
          currentChallenge.mode === 'last-occurrence' &&
          currentChallenge.array[mid] === currentChallenge.target &&
          mid < currentChallenge.array.length - 1 &&
          currentChallenge.array[mid + 1] === currentChallenge.target
        ) {
          errorMsg = `arr[${mid}] is ${currentChallenge.target}, but arr[${mid + 1}] is ALSO ${currentChallenge.target}! To find the LAST occurrence, search the RIGHT half.`;
        }
        setGuidedWrongAttempt({ action: 'FOUND', message: errorMsg });
        return;
      }

      setGuidedWrongAttempt(null);
      setGuidedSubStage('TARGET_FOUND');
      setGuidedStepNumber(guidedTotalSteps);
    }

    if (low > high) {
      soundEffects.playError();
      setMistakes((prev) => prev + 1);
      setStreak(0);
      setFeedback({
        status: 'incorrect',
        title: 'Search Range is Empty!',
        actionText: `low (${low}) > high (${high}).`,
        reason: 'Pointers have crossed. Target does not exist in array. Click "TARGET NOT FOUND".',
      });
      return;
    }

    const midVal = currentChallenge.array[mid];
    const target = currentChallenge.target;

    // Check first occurrence constraint
    if (
      currentChallenge.mode === 'first-occurrence' &&
      midVal === target &&
      mid > 0 &&
      currentChallenge.array[mid - 1] === target
    ) {
      soundEffects.playError();
      setMistakes((prev) => prev + 1);
      setStreak(0);
      setFeedback({
        status: 'incorrect',
        title: 'Not the First Occurrence!',
        actionText: `arr[${mid}] is ${target}, but index [${mid - 1}] is also ${target}!`,
        reason: 'This level requires locating the FIRST occurrence. Continue searching left.',
      });
      return;
    }

    // Check last occurrence constraint
    if (
      currentChallenge.mode === 'last-occurrence' &&
      midVal === target &&
      mid < currentChallenge.array.length - 1 &&
      currentChallenge.array[mid + 1] === target
    ) {
      soundEffects.playError();
      setMistakes((prev) => prev + 1);
      setStreak(0);
      setFeedback({
        status: 'incorrect',
        title: 'Not the Last Occurrence!',
        actionText: `arr[${mid}] is ${target}, but index [${mid + 1}] is also ${target}!`,
        reason: 'This level requires locating the LAST occurrence. Continue searching right.',
      });
      return;
    }

    if (midVal === target) {
      soundEffects.playSuccess();
      setIsSolved(true);
      setIsFound(true);
      const points = 100 + streak * 15;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);

      const stepLog = `Final Step: TARGET FOUND at index [${mid}] (${midVal})!`;
      setStepsTaken((prev) => [...prev, stepLog]);

      setFeedback({
        status: 'correct',
        title: '🎉 Bullseye! Target Found!',
        actionText: `Target ${target} located at index [${mid}]!`,
        reason: `arr[${mid}] === ${target}. Successful binary search lookup in O(log N) time!`,
      });

      // Check if last challenge in level
      if (currentChallengeIndex === challenges.length - 1) {
        setTimeout(triggerLevelCompletion, 500);
      }
    } else {
      soundEffects.playError();
      setMistakes((prev) => prev + 1);
      setStreak(0);
      setFeedback({
        status: 'incorrect',
        title: 'Target Value Does Not Match Midpoint!',
        actionText: `arr[${mid}] is ${midVal}, not target ${target}.`,
        reason: `Target ${target} does not equal arr[mid]. You must determine whether to search left or right.`,
      });
    }
  };

  // Player Action: Target Not Found
  const handleTargetNotFound = () => {
    if (isSolved) return;

    // Guided Solve Validation
    if (isGuidedSolveOpen) {
      const expected = getExpectedAction(currentChallenge, low, high, mid);
      if (expected !== 'NOT_FOUND') {
        soundEffects.playError();
        setMistakes((prev) => prev + 1);
        setStreak(0);

        const errorMsg = `Active search range [${low} .. ${high}] still contains candidates! Continue searching before declaring target not found.`;
        setGuidedWrongAttempt({ action: 'NOT_FOUND', message: errorMsg });
        return;
      }

      setGuidedWrongAttempt(null);
      setGuidedSubStage('TARGET_NOT_FOUND');
      setGuidedStepNumber(guidedTotalSteps);
    }

    if (low <= high) {
      soundEffects.playError();
      setMistakes((prev) => prev + 1);
      setStreak(0);
      setFeedback({
        status: 'incorrect',
        title: 'Search Window Still Active!',
        actionText: `Active range [${low} .. ${high}] still contains candidates.`,
        reason: 'You cannot declare target not found until low > high (pointers cross). Continue searching!',
      });
      return;
    }

    // Pointers have crossed (low > high)
    soundEffects.playSuccess();
    setIsSolved(true);
    setIsNotFound(true);
    const points = 100 + streak * 15;
    setScore((prev) => prev + points);
    setStreak((prev) => prev + 1);

    const stepLog = `Final Step: Pointers crossed (low: ${low}, high: ${high}) → Confirmed Target ${currentChallenge.target} NOT in array (returned -1).`;
    setStepsTaken((prev) => [...prev, stepLog]);

    setFeedback({
      status: 'correct',
      title: '✓ Target Not Found Confirmed!',
      actionText: `Pointers crossed (low > high). Target is absent from array.`,
      reason: `Search range is empty. Binary search returns -1 with complete mathematical certainty.`,
    });

    // Check if last challenge in level
    if (currentChallengeIndex === challenges.length - 1) {
      setTimeout(triggerLevelCompletion, 500);
    }
  };

  // Next Challenge Navigation within active level
  const handleNextChallenge = () => {
    soundEffects.playClick();
    if (currentChallengeIndex < challenges.length - 1) {
      const nextIdx = currentChallengeIndex + 1;
      setCurrentChallengeIndex(nextIdx);
      if (challenges[nextIdx]) {
        initializeChallenge(challenges[nextIdx]);
      }
    } else {
      triggerLevelCompletion();
    }
  };

  // Guided Solve Next Step: Explains and executes step by step
  const handleGuidedNextStep = () => {
    soundEffects.playClick();
    setGuidedWrongAttempt(null);

    // If challenge is solved, Next Step advances to the next challenge!
    if (isSolved) {
      if (currentChallengeIndex < challenges.length - 1) {
        handleNextChallenge();
      } else {
        setIsGuidedSolveOpen(false);
      }
      return;
    }

    if (guidedSubStage === 'EXPLAIN_RANGE') {
      setGuidedSubStage('CALCULATE_MID');
      setGuidedStepNumber((prev) => Math.min(guidedTotalSteps, prev + 1));
    } else if (guidedSubStage === 'CALCULATE_MID') {
      setGuidedSubStage('COMPARE');
      setGuidedStepNumber((prev) => Math.min(guidedTotalSteps, prev + 1));
    } else if (guidedSubStage === 'COMPARE') {
      // EXECUTE the expected binary search action step by step!
      const expected = getExpectedAction(currentChallenge, low, high, mid);
      if (expected === 'LEFT') {
        handleSearchLeft();
      } else if (expected === 'RIGHT') {
        handleSearchRight();
      } else if (expected === 'FOUND') {
        handleTargetFound();
      } else if (expected === 'NOT_FOUND') {
        handleTargetNotFound();
      }
    } else if (guidedSubStage === 'ACTION_RESULT') {
      const isOutOfRange = low > high;
      const midVal =
        mid >= 0 && mid < currentChallenge.array.length
          ? currentChallenge.array[mid]
          : null;

      if (isOutOfRange) {
        setGuidedSubStage('COMPARE');
        setGuidedStepNumber(guidedTotalSteps);
      } else if (
        midVal === currentChallenge.target &&
        !(
          currentChallenge.mode === 'first-occurrence' &&
          mid > 0 &&
          currentChallenge.array[mid - 1] === currentChallenge.target
        ) &&
        !(
          currentChallenge.mode === 'last-occurrence' &&
          mid < currentChallenge.array.length - 1 &&
          currentChallenge.array[mid + 1] === currentChallenge.target
        )
      ) {
        setGuidedSubStage('COMPARE');
        setGuidedStepNumber(Math.min(guidedTotalSteps, guidedStepNumber + 1));
      } else {
        setGuidedSubStage('EXPLAIN_RANGE');
        setGuidedStepNumber((prev) => Math.min(guidedTotalSteps, prev + 1));
      }
    } else if (guidedSubStage === 'TARGET_FOUND' || guidedSubStage === 'TARGET_NOT_FOUND') {
      if (currentChallengeIndex < challenges.length - 1) {
        handleNextChallenge();
      } else {
        setIsGuidedSolveOpen(false);
      }
    }
  };

  // Hint Cycling (1 -> 2 -> 3 -> 0)
  const handleCycleHint = () => {
    soundEffects.playClick();
    const nextStage = hintStage >= 3 ? 0 : hintStage + 1;
    if (nextStage > 0 && !hintsUsedInLevel) {
      triggerPointToast({
        points: -2,
        reason: 'Hint Used',
        type: 'decrease',
      });
      // Immediately update progress in storage and app state so Progress section updates right away
      const { updated: progressAfterHint } = deductHintPoints(progress, currentLevel.id);
      onUpdateProgress(progressAfterHint);
    }
    setHintsUsedInLevel(true);
    setHintStage(nextStage);
  };

  // Calculate Progress Percent within Level
  const progressPercent = Math.round(
    ((currentChallengeIndex + (isSolved ? 1 : 0)) / challenges.length) * 100
  );

  // If Lab Mode is active, render the dedicated Experiment Lab
  if (screenMode === 'lab') {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <InGameLab onBackToGame={() => setScreenMode('levels')} />
      </div>
    );
  }

  const completedLevels = Array.isArray(progress.completedGameLevels)
    ? progress.completedGameLevels
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 pb-16">
      {/* ========================================================================= */}
      {/* SCREEN 1: LEVEL SELECTION SCREEN (HUB) */}
      {/* ========================================================================= */}
      {screenMode === 'levels' && (
        <div className="space-y-8">
          {/* Header Section: Title & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                  DSA Battle Arena
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Interactive Learning Game
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                BINARY SEARCH BATTLE
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                Master Binary Search by finding targets, narrowing search ranges, and making the correct decisions.
              </p>
            </div>

            {/* Global Stats Counter Bar */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Level Tracker */}
              <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                  Level
                </span>
                <span className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 font-mono">
                  {currentLevel.levelNumber < 10 ? `0${currentLevel.levelNumber}` : currentLevel.levelNumber} of 6
                </span>
              </div>
            </div>
          </div>

          {/* 6 LEVEL CARDS: Main Entry Points */}
          <LevelCardGrid
            levels={GAME_CATALOG}
            activeLevelId={activeLevelId}
            completedLevelIds={completedLevels}
            levelScores={progress.topicPoints?.gameLevelScores}
            onSelectLevel={handleOpenLevel}
          />

          {/* BINARY SEARCH EXPERIMENT LAB: Placed directly below the 6 cards */}
          <BinarySearchLabCard onOpenLab={() => setScreenMode('lab')} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: ACTIVE GAMEPLAY SCREEN */}
      {/* ========================================================================= */}
      {screenMode === 'playing' && (
        <div className="space-y-6">
          {/* Top In-Game Navigation & Stats Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setScreenMode('levels');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-300 dark:border-slate-700 active:scale-95 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Levels</span>
              </button>

              <div className="hidden sm:block">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  {currentLevel.title}
                </span>
              </div>
            </div>

            {/* In-game HUD stats */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                Level {currentLevel.levelNumber < 10 ? `0${currentLevel.levelNumber}` : currentLevel.levelNumber} of 6
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {currentLevel.title} — Challenge {currentChallengeIndex + 1} of {challenges.length}
              </span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                Level Progress {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* CURRENT BINARY SEARCH CHALLENGE CARD */}
          <div className="rounded-3xl p-5 sm:p-7 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Challenge Header & Target Display */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase">
                    Round {currentChallenge.challengeNumber} of {currentChallenge.totalChallengesInLevel}
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">
                    {currentChallenge.question}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  {currentChallenge.instruction}
                </p>
              </div>

              {/* Action Toolbar: Hint, Guided Solve (Orange-Yellow Gradient), Question Reset */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Hint Button */}
                <button
                  onClick={handleCycleHint}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    hintStage > 0
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hint {hintStage > 0 ? `(${hintStage}/3)` : '(3)'}</span>
                </button>

                {/* Guided Solve: Explicit Orange-Yellow Mixed Gradient */}
                <button
                  onClick={handleToggleGuidedSolve}
                  className="px-3.5 py-2 rounded-xl font-mono text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-white shadow-md shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border border-amber-400/50"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{isGuidedSolveOpen ? 'Hide Guide' : 'Guided Solve'}</span>
                </button>
              </div>
            </div>

            {/* Guided Solve Interactive Tutor Panel (when open) */}
            {isGuidedSolveOpen && (
              <BinarySearchGuidedSolve
                stepDetails={guidedStepDetails}
                wrongAttempt={guidedWrongAttempt}
                onNextStep={handleGuidedNextStep}
                onExitGuide={() => setIsGuidedSolveOpen(false)}
                onSearchLeft={handleSearchLeft}
                onSearchRight={handleSearchRight}
                onTargetFound={handleTargetFound}
                onTargetNotFound={handleTargetNotFound}
                onNextChallenge={handleNextChallenge}
                isSolved={isSolved}
                isLastChallenge={currentChallengeIndex === challenges.length - 1}
              />
            )}

            {/* Hint Banner (when active) */}
            {hintStage > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-900 dark:text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>
                      {hintStage === 1
                        ? 'Clue 1: Core Concept'
                        : hintStage === 2
                        ? 'Clue 2: Search Direction'
                        : 'Clue 3: Exact Calculation & Move'}
                    </span>
                  </span>
                  <button
                    onClick={() => setHintStage(0)}
                    className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="text-xs text-amber-950 dark:text-amber-100 font-medium leading-relaxed">
                  {currentChallenge.hints[hintStage - 1]}
                </p>
              </div>
            )}

            {/* Quick Reference: MID FORMULAS & BINARY SEARCH RULE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Box 1: Mid Formulas */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Mid Formulas</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Math.floor (Integer Div)
                  </span>
                </div>
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Standard</span>
                    <code className="font-bold text-slate-800 dark:text-slate-200">
                      mid = Math.floor((low + high) / 2)
                    </code>
                  </div>
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Overflow-Safe</span>
                    <code className="font-bold text-indigo-600 dark:text-indigo-400">
                      mid = low + Math.floor((high - low) / 2)
                    </code>
                  </div>
                </div>
              </div>

              {/* Box 2: Binary Search Rule */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>Binary Search Rule</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Sorted Invariant
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                  <div className="bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-750 flex flex-col justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">target &lt; arr[mid]</span>
                    <strong className="text-blue-600 dark:text-blue-400 text-xs">high = mid - 1</strong>
                  </div>
                  <div className="bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-750 flex flex-col justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">target &gt; arr[mid]</span>
                    <strong className="text-cyan-600 dark:text-cyan-400 text-xs">low = mid + 1</strong>
                  </div>
                  <div className="bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-750 flex flex-col justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">arr[mid] === target</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-xs">TARGET FOUND</strong>
                  </div>
                  <div className="bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-750 flex flex-col justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">low &gt; high</span>
                    <strong className="text-rose-600 dark:text-rose-400 text-xs">NOT FOUND (-1)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Horizontal Sorted Array Board */}
            <BinarySearchBoard
              array={currentChallenge.array}
              target={currentChallenge.target}
              low={low}
              high={high}
              mid={mid}
              isFound={isFound}
              isNotFound={isNotFound}
              highlightConcept={isGuidedSolveOpen ? guidedStepDetails.highlightConcept : null}
            />

            {/* Player Actions & Bottom Controls */}
            <BinarySearchActionControls
              onSearchLeft={handleSearchLeft}
              onSearchRight={handleSearchRight}
              onTargetFound={handleTargetFound}
              onTargetNotFound={handleTargetNotFound}
              onUndo={handleUndo}
              onResetLevel={handleResetLevel}
              onNext={handleNextChallenge}
              canUndo={history.length > 0}
              isSolved={isSolved}
              isLastChallenge={currentChallengeIndex === challenges.length - 1}
              guidedActive={isGuidedSolveOpen}
              isYourTurn={isGuidedSolveOpen && guidedStepDetails.isWaitingForPlayer}
            />

            {/* Immediate Feedback Card */}
            {feedback && (
              <GameFeedbackCard
                status={feedback.status}
                title={feedback.title}
                actionText={feedback.actionText}
                reason={feedback.reason}
                xpEarned={feedback.status === 'correct' ? 50 : undefined}
                onNextChallenge={isSolved ? handleNextChallenge : undefined}
                onRetry={feedback.status === 'incorrect' ? handleQuestionReset : undefined}
                isLastChallenge={currentChallengeIndex === challenges.length - 1}
              />
            )}

            {/* Steps Taken History & How to Play */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Steps Taken Log */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                  <span>Steps Taken in Round</span>
                  <span className="text-slate-700 dark:text-slate-200">{stepsTaken.length} move{stepsTaken.length === 1 ? '' : 's'}</span>
                </div>
                {stepsTaken.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    No moves taken yet. Calculate mid and choose an action above!
                  </p>
                ) : (
                  <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {stepsTaken.map((st, idx) => (
                      <li
                        key={idx}
                        className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-slate-200 dark:border-slate-750 flex items-start gap-1.5"
                      >
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* How to Play Guide Accordion */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <button
                  onClick={() => setShowHowToPlay(!showHowToPlay)}
                  className="w-full flex items-center justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                    <span>How to Play & Decision Rules</span>
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 text-xs">
                    {showHowToPlay ? 'Hide' : 'Show'}
                  </span>
                </button>

                {showHowToPlay ? (
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-1 font-mono">
                    <p>
                      <strong>1. Check Mid:</strong> mid = Math.floor((low + high) / 2).
                    </p>
                    <p>
                      <strong>2. Target == arr[mid]:</strong> Match found! Select TARGET FOUND.
                    </p>
                    <p>
                      <strong>3. Target &lt; arr[mid]:</strong> Value must be left. Select SEARCH LEFT (high = mid - 1).
                    </p>
                    <p>
                      <strong>4. Target &gt; arr[mid]:</strong> Value must be right. Select SEARCH RIGHT (low = mid + 1).
                    </p>
                    <p>
                      <strong>5. low &gt; high:</strong> Search space exhausted. Select TARGET NOT FOUND.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    Click above to view the standard binary search rules, pointer boundary updates, and termination conditions.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Complete Modal with [ RETURN TO LEVELS ] and [ NEXT LEVEL → ] */}
      <LevelCompleteModal
        isOpen={isLevelModalOpen}
        level={currentLevel}
        xpEarned={currentLevel.xpReward}
        pointsEarned={lastEarnedPoints}
        comparisonsCount={stepsTaken.length > 0 ? stepsTaken.length : 1}
        mistakes={mistakes}
        outcomeText={isFound ? 'TARGET FOUND' : isNotFound ? 'TARGET NOT FOUND' : 'LEVEL COMPLETE'}
        hasNextLevel={activeLevelId < GAME_LEVELS.length}
        onReturnToLevels={() => {
          setIsLevelModalOpen(false);
          setScreenMode('levels');
        }}
        onNextLevel={() => {
          setIsLevelModalOpen(false);
          if (activeLevelId < GAME_LEVELS.length) {
            const nextLvlId = activeLevelId + 1;
            onSelectLevel(nextLvlId);
            setCurrentChallengeIndex(0);
            setMistakes(0);
            const nextLvl = GAME_LEVELS.find((l) => l.id === nextLvlId) || GAME_LEVELS[0];
            if (nextLvl && nextLvl.challenges && nextLvl.challenges[0]) {
              initializeChallenge(nextLvl.challenges[0]);
            }
            setScreenMode('playing');
          } else {
            setScreenMode('levels');
          }
        }}
        onReplayLevel={() => {
          setIsLevelModalOpen(false);
          handleResetLevel();
          setScreenMode('playing');
        }}
      />
    </div>
  );
};
