import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { LESSONS } from '../../data/lessonsData';
import { LessonModule } from '../../types';
import { BstArchitectureFlow } from './BstArchitectureFlow';
import { TerminologyRecapSection } from './TerminologyRecapSection';
import { useUserProgress } from '../../context/UserProgressContext';
import { soundManager } from '../../utils/audio';
import { getKeyRulesForLesson } from '../../data/keyRulesData';

interface LearnPageProps {
  initialTopicIndex?: number;
  onGoToPractice?: () => void;
  onGoToGame?: () => void;
}

export interface LearnTocItem {
  serial: number;
  formattedSerial: string;
  id: string;
  title: string;
  shortTitle: string;
  lessonIndex?: number; // Index in LESSONS array
  isRecap?: boolean;
}

/**
 * 20 structured topics in the Theory Curriculum with clean serial numbers 01 to 20
 */
export const LEARN_TOC_TOPICS: LearnTocItem[] = [
  { serial: 1, formattedSerial: '01', id: 'lesson-1', lessonIndex: 0, title: '1. What is a Tree?', shortTitle: 'What is a Tree?' },
  { serial: 2, formattedSerial: '02', id: 'lesson-2', lessonIndex: 1, title: '2. What is a Binary Tree?', shortTitle: 'Binary Tree' },
  { serial: 3, formattedSerial: '03', id: 'lesson-3', lessonIndex: 2, title: '3. What is a Binary Search Tree?', shortTitle: 'What is a BST?' },
  { serial: 4, formattedSerial: '04', id: 'lesson-4', lessonIndex: 3, title: '4. BST Property', shortTitle: 'BST Property' },
  { serial: 5, formattedSerial: '05', id: 'terminology-recap', isRecap: true, title: '5. Terminology Recap', shortTitle: 'Terminology Recap' },
  { serial: 6, formattedSerial: '06', id: 'lesson-12', lessonIndex: 11, title: '6. Searching in a BST', shortTitle: 'Searching' },
  { serial: 7, formattedSerial: '07', id: 'lesson-13', lessonIndex: 12, title: '7. Insertion in a BST', shortTitle: 'Insertion' },
  { serial: 8, formattedSerial: '08', id: 'lesson-14', lessonIndex: 13, title: '8. Deletion Overview', shortTitle: 'Deletion Overview' },
  { serial: 9, formattedSerial: '09', id: 'lesson-15', lessonIndex: 14, title: '9. Delete Leaf Node', shortTitle: 'Delete Leaf' },
  { serial: 10, formattedSerial: '10', id: 'lesson-16', lessonIndex: 15, title: '10. Delete Node with One Child', shortTitle: 'Delete 1-Child' },
  { serial: 11, formattedSerial: '11', id: 'lesson-17', lessonIndex: 16, title: '11. Delete Node with Two Children', shortTitle: 'Delete 2-Children' },
  { serial: 12, formattedSerial: '12', id: 'lesson-18', lessonIndex: 17, title: '12. Inorder Successor', shortTitle: 'Inorder Successor' },
  { serial: 13, formattedSerial: '13', id: 'lesson-19', lessonIndex: 18, title: '13. Inorder Predecessor', shortTitle: 'Inorder Predecessor' },
  { serial: 14, formattedSerial: '14', id: 'lesson-20', lessonIndex: 19, title: '14. Inorder Traversal', shortTitle: 'Inorder (Sorted)' },
  { serial: 15, formattedSerial: '15', id: 'lesson-21', lessonIndex: 20, title: '15. Preorder Traversal', shortTitle: 'Preorder' },
  { serial: 16, formattedSerial: '16', id: 'lesson-22', lessonIndex: 21, title: '16. Postorder Traversal', shortTitle: 'Postorder' },
  { serial: 17, formattedSerial: '17', id: 'lesson-23', lessonIndex: 22, title: '17. Tree Height', shortTitle: 'Tree Height' },
  { serial: 18, formattedSerial: '18', id: 'lesson-24', lessonIndex: 23, title: '18. Node Depth', shortTitle: 'Node Depth' },
  { serial: 19, formattedSerial: '19', id: 'lesson-25', lessonIndex: 24, title: '19. Balanced vs Unbalanced BST', shortTitle: 'Balanced vs Unbalanced' },
  { serial: 20, formattedSerial: '20', id: 'lesson-26', lessonIndex: 25, title: '20. Time Complexity', shortTitle: 'Time Complexity' },
];

const TERMINOLOGY_SUBTOPICS = [
  { id: 'lesson-5', serial: '5.1', title: 'Root Node' },
  { id: 'lesson-6', serial: '5.2', title: 'Parent Node' },
  { id: 'lesson-7', serial: '5.3', title: 'Child Node' },
  { id: 'lesson-8', serial: '5.4', title: 'Leaf Node' },
  { id: 'lesson-9', serial: '5.5', title: 'Internal Node' },
  { id: 'lesson-10', serial: '5.6', title: 'Left Subtree' },
  { id: 'lesson-11', serial: '5.7', title: 'Right Subtree' },
];

export const LearnPage: React.FC<LearnPageProps> = ({
  initialTopicIndex = 0,
  onGoToPractice,
  onGoToGame,
}) => {
  const { stats, completeLesson, addXP } = useUserProgress();

  // Map initialTopicIndex prop to active topic index (0 to 19)
  const getResolvedTopicIndex = (rawIdx: number | undefined): number => {
    if (rawIdx === undefined || rawIdx < 0) return 0;
    // If passed as a 0..19 topic index directly:
    if (rawIdx >= 0 && rawIdx < LEARN_TOC_TOPICS.length) {
      // Check if it's already an index in LEARN_TOC_TOPICS
      // Also check if rawIdx matches a lessonIndex in LESSONS (e.g. 11..25)
      const matchingByLesson = LEARN_TOC_TOPICS.findIndex((t) => t.lessonIndex === rawIdx);
      if (matchingByLesson !== -1 && rawIdx >= 11) {
        return matchingByLesson;
      }
      // If rawIdx is between 4 and 10, it's one of the terminology subtopics
      if (rawIdx >= 4 && rawIdx <= 10) {
        return 4; // Topic 5: Terminology Recap
      }
      return rawIdx;
    }
    // If rawIdx is >= 20 and < LESSONS.length, search by lessonIndex
    if (rawIdx < LESSONS.length) {
      const match = LEARN_TOC_TOPICS.findIndex((t) => t.lessonIndex === rawIdx);
      if (match !== -1) return match;
    }
    return 0;
  };

  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(() => {
    if (initialTopicIndex !== undefined && initialTopicIndex >= 0) {
      return getResolvedTopicIndex(initialTopicIndex);
    }
    // Find first unfinished topic
    const firstUnfinished = LEARN_TOC_TOPICS.findIndex((t) => {
      if (t.isRecap) {
        return !(stats?.completedLessons || []).includes('terminology-recap');
      }
      return !(stats?.completedLessons || []).includes(t.id);
    });
    return firstUnfinished !== -1 ? firstUnfinished : 0;
  });

  const [isTerminologyExpanded, setIsTerminologyExpanded] = useState<boolean>(() => {
    return activeTopicIndex === 4;
  });
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);

  const currentTopic = LEARN_TOC_TOPICS[activeTopicIndex] || LEARN_TOC_TOPICS[0];
  const isTerminologyRecap = !!currentTopic.isRecap;
  const currentLesson: LessonModule =
    currentTopic.lessonIndex !== undefined ? LESSONS[currentTopic.lessonIndex] || LESSONS[0] : LESSONS[0];

  // Sync with initialTopicIndex prop when changed externally
  useEffect(() => {
    if (initialTopicIndex !== undefined && initialTopicIndex >= 0) {
      const resolved = getResolvedTopicIndex(initialTopicIndex);
      selectTopic(resolved, false);
      if (initialTopicIndex >= 4 && initialTopicIndex <= 10) {
        setIsTerminologyExpanded(true);
        setTimeout(() => {
          const subId = LESSONS[initialTopicIndex]?.id;
          if (subId) {
            const el = document.getElementById(`term-section-${subId}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [initialTopicIndex]);

  // Handle selecting a topic by index (0 to 19)
  const selectTopic = (topicIdx: number, shouldPlaySound = true) => {
    if (shouldPlaySound) soundManager.playClick();
    const target = LEARN_TOC_TOPICS[topicIdx] || LEARN_TOC_TOPICS[0];
    if (target.isRecap) {
      setIsTerminologyExpanded(true);
    } else {
      setIsTerminologyExpanded(false);
    }
    setActiveTopicIndex(topicIdx);
    setMobileTocOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Terminology Recap expansion in TOC
  const handleToggleTerminologyRecap = (shouldPlaySound = true) => {
    if (shouldPlaySound) soundManager.playClick();
    if (activeTopicIndex !== 4) {
      setActiveTopicIndex(4);
      setIsTerminologyExpanded(true);
    } else {
      setIsTerminologyExpanded((prev) => !prev);
    }
    setMobileTocOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle clicking an individual subtopic underneath Terminology Recap
  const handleSelectSubtopic = (lessonId: string) => {
    soundManager.playClick();
    if (activeTopicIndex !== 4) {
      setActiveTopicIndex(4);
    }
    setIsTerminologyExpanded(true);
    setMobileTocOpen(false);
    setTimeout(() => {
      const el = document.getElementById(`term-section-${lessonId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Handle global reset to restart curriculum from zero
  useEffect(() => {
    const handleGlobalReset = () => {
      setActiveTopicIndex(0);
      setIsTerminologyExpanded(false);
    };

    window.addEventListener('bst-reset-progress', handleGlobalReset);
    window.addEventListener('bst-reset-current-activity', handleGlobalReset);
    return () => {
      window.removeEventListener('bst-reset-progress', handleGlobalReset);
      window.removeEventListener('bst-reset-current-activity', handleGlobalReset);
    };
  }, []);

  const isCurrentCompleted = currentTopic.isRecap
    ? (stats?.completedLessons || []).includes('terminology-recap')
    : (stats?.completedLessons || []).includes(currentTopic.id);

  const isTerminologyCompleted = (stats?.completedLessons || []).includes('terminology-recap');

  // Handle Mark as Completed button click for regular lessons
  const handleToggleMarkCompleted = () => {
    if (!isCurrentCompleted) {
      soundManager.playSuccess();
      completeLesson(currentTopic.id);
    } else {
      soundManager.playClick();
    }
  };

  // Handle Mark as Completed for Terminology Recap
  const handleToggleTerminologyCompleted = () => {
    if (!isTerminologyCompleted) {
      soundManager.playSuccess();
      completeLesson('terminology-recap');
    } else {
      soundManager.playClick();
    }
  };

  return (
    <div id="learn-page-root" className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* 1. Header Theory Curriculum Hero Banner */}
      <div
        id="learn-curriculum-banner"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 text-xs">
          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-[11px]">
            THEORY CURRICULUM // VOL. 01 &nbsp; Binary Search Tree Foundations
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Binary Search Tree
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
          A comprehensive 20-topic technical curriculum covering Binary Search Tree fundamentals, node hierarchy, search invariants, real-time node lookups, dynamic insertions, deletions, and structural traversals.
        </p>

        {/* Quick action button for Terminology Recap */}
        <div className="mt-4 flex items-center gap-2">
          <button
            id="learn-banner-terminology-recap-btn"
            onClick={() => selectTopic(4)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono flex items-center gap-1.5 border transition-all cursor-pointer ${
              isTerminologyRecap
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-indigo-50/80 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-slate-700 hover:bg-indigo-100 dark:hover:bg-slate-750'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Topic 05: Terminology Recap</span>
          </button>
        </div>
      </div>

      {/* Mobile Table of Contents Toggle Bar */}
      <div className="lg:hidden bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
            {`Topic ${currentTopic.formattedSerial}/${LEARN_TOC_TOPICS.length}: ${currentTopic.shortTitle}`}
          </span>
        </div>
        <button
          onClick={() => {
            soundManager.playClick();
            setMobileTocOpen(!mobileTocOpen);
          }}
          className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 border border-indigo-200/80 dark:border-slate-700 cursor-pointer"
        >
          <span>{mobileTocOpen ? 'Close Table of Contents' : 'Table of Contents'}</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: TABLE OF CONTENTS PANEL                                      */}
        {/* ========================================================================= */}
        <aside
          id="learn-table-of-contents"
          className={`${
            mobileTocOpen ? 'block' : 'hidden lg:block'
          } lg:col-span-4 xl:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden sticky top-6`}
        >
          {/* Table of Contents Header */}
          <div className="px-5 py-4 flex items-center justify-between bg-slate-50/40 dark:bg-slate-850/40">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              TABLE OF CONTENTS
            </h2>
            <span className="font-mono text-xs text-slate-400 dark:text-slate-500 font-semibold">
              {LEARN_TOC_TOPICS.length} Topics
            </span>
          </div>

          {/* Table of Contents List of 20 Topics with clean 01-20 Serial Numbers */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-0.5 custom-scrollbar max-h-[calc(100vh-14rem)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0">
            {LEARN_TOC_TOPICS.map((topic, idx) => {
              const isDone = topic.isRecap
                ? (stats?.completedLessons || []).includes('terminology-recap')
                : (stats?.completedLessons || []).includes(topic.id);
              const isActive = idx === activeTopicIndex;

              return (
                <React.Fragment key={topic.id}>
                  <button
                    id={`toc-topic-item-${topic.serial}`}
                    onClick={() => {
                      if (topic.isRecap) {
                        handleToggleTerminologyRecap();
                      } else {
                        selectTopic(idx);
                      }
                    }}
                    className={`w-full text-left py-3 px-4 text-xs transition-all flex items-center justify-between gap-3 cursor-pointer group select-none border-l-[3px] ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white font-bold'
                        : 'border-transparent hover:bg-slate-50/80 dark:hover:bg-slate-850/60 text-slate-600 dark:text-slate-400 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Serial Number in mono formatted 01 to 20 */}
                      <span
                        className={`font-mono text-xs font-bold transition-colors flex-shrink-0 ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                        }`}
                      >
                        {topic.formattedSerial}
                      </span>

                      {/* Topic Title */}
                      <span
                        className={`truncate text-xs ${
                          isActive
                            ? 'text-slate-900 dark:text-white font-bold'
                            : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                        }`}
                      >
                        {topic.shortTitle}
                      </span>
                    </div>

                    {/* Small Circle Indicator at Right Edge */}
                    <div className="flex items-center justify-center flex-shrink-0 ml-2">
                      {isActive ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 ring-2 ring-indigo-600/25" />
                      ) : isDone ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expandable 7 Terminology Subtopics under Topic 05 */}
                  {topic.isRecap && isTerminologyExpanded && (
                    <div
                      id="toc-terminology-subtopics-list"
                      className="py-1 space-y-0.5 bg-slate-50/70 dark:bg-slate-850/50 border-l-[3px] border-indigo-200/80 dark:border-indigo-900/60 mx-2 pl-2 pr-2 my-0.5 rounded-r-xl transition-all"
                    >
                      {TERMINOLOGY_SUBTOPICS.map((subtopic) => {
                        const isSubDone = (stats?.completedLessons || []).includes(subtopic.id);

                        return (
                          <button
                            key={subtopic.id}
                            id={`toc-subtopic-${subtopic.id}`}
                            onClick={() => handleSelectSubtopic(subtopic.id)}
                            className="w-full text-left py-2 px-3 text-xs rounded-lg transition-colors flex items-center justify-between gap-2 cursor-pointer group text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-850/80 font-medium"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">
                                {subtopic.serial}
                              </span>
                              <span className="truncate text-xs group-hover:text-slate-900 dark:group-hover:text-slate-200">
                                {subtopic.title}
                              </span>
                            </div>

                            <div className="flex items-center justify-center flex-shrink-0 ml-1">
                              {isSubDone ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-slate-400" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: TOPIC CONTENT MAIN / TERMINOLOGY RECAP                      */}
        {/* ========================================================================= */}
        <main
          id="learn-content-main"
          className="lg:col-span-8 xl:col-span-8 space-y-6"
        >
          {isTerminologyRecap ? (
            /* Dedicated Terminology Recap Section (Topic 05) */
            <TerminologyRecapSection
              onGoToChapter={(chapterNumber) => {
                const foundTopic = LEARN_TOC_TOPICS.findIndex((t) => t.serial === chapterNumber);
                if (foundTopic !== -1) {
                  selectTopic(foundTopic);
                }
              }}
              onPrevTopic={() => selectTopic(3)} // Back to Topic 04 BST Property
              onNextTopic={() => selectTopic(5)} // Forward to Topic 06 Searching in a BST
              isCompleted={isTerminologyCompleted}
              onToggleComplete={handleToggleTerminologyCompleted}
            />
          ) : (
            /* Standard Lesson Card Container */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 lg:p-9 shadow-xs space-y-7 transition-colors">
              {/* Topic Header with Proper Serial Number */}
              <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {currentTopic.serial}. {currentLesson.shortTitle}
                </h1>

                <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  {currentLesson.tagline}
                </p>
              </div>

              {/* 1. Executive Summary Card */}
              <div className="space-y-2">
                <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                    Executive Summary:
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {currentLesson.definition}
                  </p>
                </div>
              </div>

              {/* 2. Everyday Analogy Card with Blue Left Line */}
              <div className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl border-l-4 border-indigo-600 dark:border-indigo-500 border-t border-r border-b border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>EVERYDAY ANALOGY: MENTAL MODEL</span>
                </div>
                <p className="text-xs sm:text-sm italic text-slate-700 dark:text-slate-300 leading-relaxed">
                  "{currentLesson.whyItMatters}"
                </p>
              </div>

              {/* 3. Key Points */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  KEY POINTS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLesson.bulletPoints.map((point, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3.5 Key Rules */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  KEY RULES
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentLesson.keyRules || getKeyRulesForLesson(currentLesson.id)).map((rule, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Architecture Diagram / BST Concept Flow */}
              <BstArchitectureFlow topicNumber={currentTopic.serial} />

              {/* 5. Key Takeaway Card */}
              <div
                id="learn-key-takeaway-card"
                className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
              >
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4" />
                  <span>KEY TAKEAWAY</span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {currentLesson.keyConcept}
                </p>
              </div>

              {/* 6. Bottom Navigation Controls */}
              <div
                id="learn-bottom-navigation"
                className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800"
              >
                {/* Left: Previous Topic */}
                <div className="flex items-center justify-start">
                  {activeTopicIndex === 5 ? ( // Topic 06 (Searching) -> Previous is Topic 05 (Terminology Recap)
                    <button
                      id="learn-nav-prev-btn"
                      onClick={() => selectTopic(4)}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Topic 05: Terminology Recap</span>
                    </button>
                  ) : activeTopicIndex > 0 ? (
                    <button
                      id="learn-nav-prev-btn"
                      onClick={() => selectTopic(activeTopicIndex - 1)}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous Topic</span>
                    </button>
                  ) : (
                    <div className="text-xs font-semibold text-slate-300 dark:text-slate-600 flex items-center gap-2 select-none">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous Topic</span>
                    </div>
                  )}
                </div>

                {/* Center: Mark as Completed */}
                <div className="flex items-center justify-center">
                  <button
                    id="learn-nav-mark-completed-btn"
                    onClick={handleToggleMarkCompleted}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 ${
                      isCurrentCompleted
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{isCurrentCompleted ? 'Completed' : 'Mark as Completed'}</span>
                  </button>
                </div>

                {/* Right: Next Topic & Topic Counter */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  {activeTopicIndex === 3 ? ( // Topic 04 (BST Property) -> Next is Topic 05 (Terminology Recap)
                    <button
                      id="learn-nav-next-btn"
                      onClick={() => selectTopic(4)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      <span>Topic 05: Terminology Recap</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : activeTopicIndex < LEARN_TOC_TOPICS.length - 1 ? (
                    <button
                      id="learn-nav-next-btn"
                      onClick={() => selectTopic(activeTopicIndex + 1)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      <span>Next Topic</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      id="learn-nav-finish-btn"
                      onClick={onGoToGame}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      <span>Finish Syllabus</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <div className="text-xs font-mono text-slate-400 dark:text-slate-500 text-right">
                    Topic {currentTopic.formattedSerial} of {String(LEARN_TOC_TOPICS.length).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
