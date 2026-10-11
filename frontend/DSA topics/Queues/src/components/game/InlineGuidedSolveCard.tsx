import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameChallenge, GameLevelConfig } from '../../types';
import { soundEffects } from '../../services/sound';

export interface InlineGuidedSolveCardProps {
  challenge: GameChallenge;
  level: GameLevelConfig;
  currentQueue: (string | number)[];
  onClose: () => void;
  onFinish: () => void;
  onNextLevel?: () => void;
  hasNextLevel?: boolean;
  onUpdateQueuePreview?: (previewQueue: (string | number)[]) => void;
}

interface StepData {
  stepNumber: number;
  totalSteps: number;
  actionPill: string;
  operationBadge: string;
  frontOrTopBadge: string;
  countBadge: string;
  actionIntentTitle: string;
  actionIntentBody: string;
  resultTitle: string;
  resultBody: string;
  conceptText: string;
  resultingQueue: (string | number)[];
}

export const InlineGuidedSolveCard: React.FC<InlineGuidedSolveCardProps> = ({
  challenge,
  level,
  currentQueue,
  onClose,
  onFinish,
  onNextLevel,
  hasNextLevel = false,
  onUpdateQueuePreview,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepExecuted, setStepExecuted] = useState<boolean>(false);
  const [guidedComplete, setGuidedComplete] = useState<boolean>(false);

  const capacity = challenge.capacity || 5;
  const initial = challenge.initialStack || [];
  const target = challenge.targetStack || [];
  const targetVal = challenge.targetValue !== undefined ? challenge.targetValue : challenge.availableElements?.[0] || 'X';

  const isStack =
    (level.title && level.title.toLowerCase().includes('stack')) ||
    challenge.mode === 'pop' ||
    challenge.mode === 'push';
  const structureName = isStack ? 'stack' : 'queue';

  // Construct steps based on challenge characteristics
  const steps: StepData[] = React.useMemo(() => {
    switch (challenge.mode) {
      case 'pop': {
        const removed = initial.length > 0 ? initial[initial.length - 1] : targetVal;
        const nextQueue = target.length > 0 ? [...target] : initial.slice(0, -1);
        const newTop = nextQueue.length > 0 ? nextQueue[nextQueue.length - 1] : 'EMPTY';
        return [
          {
            stepNumber: 1,
            totalSteps: 1,
            actionPill: `→ POP ${removed}`,
            operationBadge: `POP ${removed}`,
            frontOrTopBadge: `TOP: ${newTop}`,
            countBadge: `${nextQueue.length} / ${capacity}`,
            actionIntentTitle: '1. ACTION & INTENT',
            actionIntentBody: `Now we need to remove the TOP element. The POP operation always removes the element at TOP. The current TOP is ${removed}.`,
            resultTitle: '2. REAL STACK RESULT',
            resultBody: `${removed} has been removed. ${newTop} is now the TOP element.`,
            conceptText:
              challenge.feedback?.lifoReason ||
              'This demonstrates LIFO: Last In, First Out. Only the element at the top can be accessed or removed directly.',
            resultingQueue: nextQueue,
          },
        ];
      }

      case 'push': {
        const nextQueue = target.length > 0 ? [...target] : [...initial, targetVal];
        return [
          {
            stepNumber: 1,
            totalSteps: 1,
            actionPill: `→ PUSH ${targetVal}`,
            operationBadge: `PUSH ${targetVal}`,
            frontOrTopBadge: `TOP: ${targetVal}`,
            countBadge: `${nextQueue.length} / ${capacity}`,
            actionIntentTitle: '1. ACTION & INTENT',
            actionIntentBody: `Now we need to add the new element to the TOP. The PUSH operation always inserts the arriving element at TOP. We are pushing [${targetVal}].`,
            resultTitle: '2. REAL STACK RESULT',
            resultBody: `[${targetVal}] has been pushed onto TOP. [${targetVal}] is now the TOP element.`,
            conceptText:
              challenge.feedback?.lifoReason ||
              'This demonstrates LIFO: Last In, First Out. New elements are pushed onto the top of the stack.',
            resultingQueue: nextQueue,
          },
        ];
      }

      case 'enqueue': {
        const nextQueue = target.length > 0 ? [...target] : [...initial, targetVal];
        const prevFront = initial.length > 0 ? initial[0] : targetVal;
        const newRear = targetVal;
        return [
          {
            stepNumber: 1,
            totalSteps: 1,
            actionPill: `→ ENQUEUE ${targetVal}`,
            operationBadge: `ENQUEUE ${targetVal}`,
            frontOrTopBadge: `FRONT: ${prevFront}`,
            countBadge: `${nextQueue.length} / ${capacity}`,
            actionIntentTitle: '1. ACTION & INTENT',
            actionIntentBody: `Now we need to add the new element to the REAR. The ENQUEUE operation always inserts the arriving element at the REAR pointer. We are enqueuing [${targetVal}].`,
            resultTitle: '2. REAL QUEUE RESULT',
            resultBody: `[${targetVal}] has been enqueued at REAR. FRONT remains [${prevFront}]. Queue size is now ${nextQueue.length} / ${capacity}.`,
            conceptText:
              challenge.feedback?.lifoReason ||
              'This demonstrates FIFO: First In, First Out. Arriving elements join at the back (REAR), while departures leave from the front (FRONT).',
            resultingQueue: nextQueue,
          },
        ];
      }

      case 'dequeue': {
        const removed = initial.length > 0 ? initial[0] : 'ELEMENT';
        const nextQueue = target.length > 0 ? [...target] : initial.slice(1);
        const newFront = nextQueue.length > 0 ? nextQueue[0] : 'EMPTY';
        return [
          {
            stepNumber: 1,
            totalSteps: 1,
            actionPill: `→ DEQUEUE ${removed}`,
            operationBadge: `DEQUEUE ${removed}`,
            frontOrTopBadge: `FRONT: ${newFront}`,
            countBadge: `${nextQueue.length} / ${capacity}`,
            actionIntentTitle: '1. ACTION & INTENT',
            actionIntentBody: `Now we need to remove the FRONT element. The DEQUEUE operation always removes the earliest arrival currently at FRONT. The current FRONT is [${removed}].`,
            resultTitle: '2. REAL QUEUE RESULT',
            resultBody: `[${removed}] has been removed. [${newFront}] is now the FRONT element. Queue size is now ${nextQueue.length} / ${capacity}.`,
            conceptText:
              challenge.feedback?.lifoReason ||
              'This demonstrates FIFO: First In, First Out. Only the element at the FRONT can be accessed or removed directly.',
            resultingQueue: nextQueue,
          },
        ];
      }

      case 'peek':
      case 'identify_front': {
        const frontVal = initial.length > 0 ? initial[0] : targetVal;
        return [
          {
            stepNumber: 1,
            totalSteps: 1,
            actionPill: `→ PEEK FRONT [${frontVal}]`,
            operationBadge: `FRONT: ${frontVal}`,
            frontOrTopBadge: `FRONT: ${frontVal}`,
            countBadge: `${initial.length} / ${capacity}`,
            actionIntentTitle: '1. ACTION & INTENT',
            actionIntentBody: `Now we need to inspect the FRONT element. Under FIFO, the earliest arrival always sits at index 0 (FRONT pointer). The current FRONT is [${frontVal}].`,
            resultTitle: '2. REAL QUEUE RESULT',
            resultBody: `Survivor [${frontVal}] is confirmed at the FRONT pointer. Queue contents remain unchanged (${initial.length} items).`,
            conceptText:
              challenge.feedback?.lifoReason ||
              'PEEK provides O(1) constant-time access to inspect the next element to be served without modifying the queue.',
            resultingQueue: [...initial],
          },
        ];
      }

      case 'identify_rear': {
        const rearVal = initial.length > 0 ? initial[initial.length - 1] : targetVal;
        const frontVal = initial.length > 0 ? initial[0] : rearVal;
        return [
          {
            stepNumber: 1,
            totalSteps: 1,
            actionPill: `→ IDENTIFY REAR [${rearVal}]`,
            operationBadge: `REAR: ${rearVal}`,
            frontOrTopBadge: `FRONT: ${frontVal}`,
            countBadge: `${initial.length} / ${capacity}`,
            actionIntentTitle: '1. ACTION & INTENT',
            actionIntentBody: `Now we need to identify where new elements enter. In a Queue, arrivals always enter at the REAR pointer. The newest arrival is [${rearVal}].`,
            resultTitle: '2. REAL QUEUE RESULT',
            resultBody: `Survivor [${rearVal}] is identified at the REAR pointer (index [${Math.max(0, initial.length - 1)}]).`,
            conceptText:
              challenge.feedback?.lifoReason ||
              'The REAR pointer tracks the newest addition, ensuring subsequent elements preserve chronological order.',
            resultingQueue: [...initial],
          },
        ];
      }

      case 'overflow': {
        return [
          {
            stepNumber: 1,
            totalSteps: 1,
            actionPill: `→ TEST OVERFLOW GUARD`,
            operationBadge: `OVERFLOW TEST`,
            frontOrTopBadge: `CAPACITY: ${capacity}`,
            countBadge: `${initial.length} / ${capacity}`,
            actionIntentTitle: '1. ACTION & INTENT',
            actionIntentBody: `The queue has reached maximum capacity (${capacity}/${capacity}). We attempt to enqueue another element to verify the boundary guardrail.`,
            resultTitle: '2. REAL QUEUE RESULT',
            resultBody: `QueueOverflowException caught safely! No memory overwrite occurred; buffer invariants are preserved.`,
            conceptText:
              challenge.feedback?.lifoReason ||
              'Boundary guardrails like isFull() prevent buffer overruns and protect program memory from corruption.',
            resultingQueue: [...initial],
          },
        ];
      }

      case 'underflow': {
        return [
          {
            stepNumber: 1,
            totalSteps: 1,
            actionPill: `→ TEST UNDERFLOW GUARD`,
            operationBadge: `UNDERFLOW TEST`,
            frontOrTopBadge: `FRONT: NONE`,
            countBadge: `0 / ${capacity}`,
            actionIntentTitle: '1. ACTION & INTENT',
            actionIntentBody: `The queue is empty (0 elements). We attempt to DEQUEUE from the empty line to verify the defensive underflow guardrail.`,
            resultTitle: '2. REAL QUEUE RESULT',
            resultBody: `QueueUnderflowException caught safely! The system defends against reading or removing from an empty container.`,
            conceptText:
              challenge.feedback?.lifoReason ||
              'isEmpty() defensive checks prevent null-pointer dereferences and runtime crashes when containers are empty.',
            resultingQueue: [],
          },
        ];
      }

      case 'choice':
      default: {
        const correctChoice = challenge.choices?.find((c) => c.isCorrect);
        const correctLabel = correctChoice ? correctChoice.label : String(targetVal);
        const frontVal = initial.length > 0 ? initial[0] : 'NONE';
        return [
          {
            stepNumber: 1,
            totalSteps: 1,
            actionPill: `→ ANALYZE PRINCIPLES`,
            operationBadge: `CORRECT ANSWER`,
            frontOrTopBadge: `FRONT: ${frontVal}`,
            countBadge: `${initial.length} / ${capacity}`,
            actionIntentTitle: '1. ACTION & INTENT',
            actionIntentBody: `Analyze the core question: "${challenge.question}". We apply foundational FIFO rules.`,
            resultTitle: '2. REAL QUEUE RESULT',
            resultBody: `The correct answer is: "${correctLabel}". Verified against Queue invariants.`,
            conceptText:
              challenge.feedback?.lifoReason ||
              'Queues enforce strict FIFO (First In, First Out) order across all operations.',
            resultingQueue: target.length > 0 ? [...target] : [...initial],
          },
        ];
      }
    }
  }, [challenge, capacity, initial, target, targetVal]);

  const activeStep = steps[currentStepIndex] || steps[0];
  const guidedPoints = React.useMemo(() => {
    switch (challenge.mode) {
      case 'enqueue':
        return [`Add ${String(targetVal)} at the REAR.`, 'FIFO keeps existing items in their current order.', `The queue becomes ${activeStep.resultingQueue.join(' → ')}.`];
      case 'dequeue':
        return ['Remove the item at the FRONT.', 'FIFO serves the earliest arrival first.', `The remaining queue is ${activeStep.resultingQueue.join(' → ') || 'empty'}.`];
      case 'pop':
        return [`Remove ${String(targetVal)} from the TOP.`, 'LIFO removes the most recently added item first.', `The remaining stack is ${activeStep.resultingQueue.join(' → ') || 'empty'}.`];
      case 'push':
        return [`Add ${String(targetVal)} at the TOP.`, 'LIFO makes the new item the next item removed.', `The stack becomes ${activeStep.resultingQueue.join(' → ')}.`];
      case 'identify_front':
      case 'peek':
        return ['Inspect the FRONT item without removing it.', 'The FRONT is the next item served by FIFO.', `The FRONT value is ${String(initial[0] ?? targetVal)}.`];
      case 'identify_rear':
        return ['Inspect the REAR item.', 'The REAR marks where new queue items enter.', `The REAR value is ${String(initial[initial.length - 1] ?? targetVal)}.`];
      case 'overflow':
        return ['Check whether the queue is full.', 'Reject the new item when capacity is reached.', 'The existing queue remains unchanged.'];
      case 'underflow':
        return ['Check whether the queue is empty.', 'Reject dequeue when there is no FRONT item.', 'The empty queue remains unchanged.'];
      default:
        return ['Read the problem rule.', 'Apply the queue operation shown above.', 'Use Next Step to see the result.'];
    }
  }, [activeStep.resultingQueue, challenge.mode, initial, targetVal]);

  // A guided step is applied only when the learner explicitly advances.
  useEffect(() => {
    setStepExecuted(false);
  }, [currentStepIndex]);

  const handleNextOrFinish = () => {
    soundEffects.playClick();
    if (!stepExecuted) {
      soundEffects.playSuccess();
      setStepExecuted(true);
      onUpdateQueuePreview?.(activeStep.resultingQueue);
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      soundEffects.playSuccess();
      onFinish();
      setGuidedComplete(true);
    }
  };

  const handlePrevStep = () => {
    soundEffects.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-amber-400 dark:border-amber-500 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in zoom-in-98 duration-200">
      {/* ─── 1. TOP HEADER & CONTROLS ─── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lightbulb className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">
                GUIDED SOLVE
              </span>
              <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 uppercase tracking-wider">
                INTERACTIVE WALKTHROUGH
              </span>
            </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Read the explanation, then use Next Step to perform one operation on the {structureName}.
            </p>
          </div>
        </div>

        {/* Right side: Step badge and Exit button */}
        <div className="flex items-center gap-2">
          <span className="font-mono font-black text-xs px-3 py-1 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl border border-slate-200 dark:border-slate-700">
            STEP {activeStep.stepNumber} / {activeStep.totalSteps}
          </span>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
            title="Exit Guided Solve"
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-blue-400 bg-blue-50/70 p-3 shadow-xs dark:border-blue-500 dark:bg-blue-950/40">
        <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">Current Question</span>
        <p className="mt-1 text-base font-black leading-snug text-slate-950 dark:text-white">{challenge.question}</p>
      </div>

      {/* ─── 2. SHORT STEP EXPLANATION ─── */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3 sm:p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-blue-600 dark:text-blue-400">
          <Info className="h-4 w-4 shrink-0" />
          <span>What happens</span>
        </div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
          {guidedPoints.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </div>

      {/* ─── 3. BOTTOM CONTROLS ─── */}
      <div className="flex items-center justify-end gap-3 pt-1 flex-wrap">
        <div className="flex items-center gap-2">
          {currentStepIndex > 0 && (
            <button
              onClick={handlePrevStep}
              className="px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          )}

          <button
            onClick={handleNextOrFinish}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm uppercase shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>
              {!stepExecuted ? 'NEXT STEP' : currentStepIndex === steps.length - 1 ? 'FINISH' : 'NEXT STEP'}
            </span>
            <span>→</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {guidedComplete && (
        <div className="flex flex-col gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">Guided Solve Complete</p>
            <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-200">The walkthrough is finished. Continue with the game or choose the next level.</p>
          </div>
          {hasNextLevel && onNextLevel && (
            <button
              onClick={onNextLevel}
              className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase text-white transition-colors hover:bg-emerald-700"
            >
              Next Level →
            </button>
          )}
        </div>
      )}
    </div>
  );
};
