import binarySearchVideo from '../Videos/Binary Search.mp4';
import binarySearchAlgorithmVideo from '../Videos/Binary Search Algorithm.mp4';

export interface EducationalScene {
  id: number;
  timeStart: number;
  timeEnd: number;
  title: string;
  badge: string;
  badgeColor: string;
  narration: string;
  keyConcept: string;
  type: 'concept' | 'array' | 'linkedlist' | 'stack-queue' | 'stack-lifo' | 'push' | 'peek' | 'pop' | 'overflow' | 'underflow' | 'complexity';
}

export interface LessonData {
  id: number;
  lessonNumber: string;
  title: string;
  description: string;
  chips: string[];
  filename: string;
  videoSrc?: string;
  duration: number; // in seconds
  scenes: EducationalScene[];
}

export const LESSONS_DATA: LessonData[] = [
  {
    id: 1,
    lessonNumber: 'VIDEO 01',
    title: 'BINARY SEARCH',
    description:
      'Learn how Binary Search finds a target efficiently by repeatedly dividing a sorted array into smaller search ranges.',
    chips: ['Sorted Array', 'Low / Mid / High', 'Divide & Conquer', 'O(log n)'],
    filename: 'Binary Search.mp4',
    videoSrc: binarySearchVideo,
    duration: 50,
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 10,
        title: 'What is Binary Search?',
        badge: 'DIVIDE & CONQUER: O(log n)',
        badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-600/70',
        narration:
          'Binary Search finds a target efficiently by repeatedly dividing a sorted array into smaller search ranges.',
        keyConcept: 'Binary Search works by repeatedly dividing the search space in half.',
        type: 'concept',
      },
      {
        id: 2,
        timeStart: 10,
        timeEnd: 20,
        title: 'The Sorted Array Requirement',
        badge: 'PREREQUISITE: MUST BE SORTED',
        badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-600/70',
        narration:
          'Binary Search requires a sorted array. Without sorted order, halving the search space could eliminate the target.',
        keyConcept: 'Binary Search requires a sorted array.',
        type: 'array',
      },
      {
        id: 3,
        timeStart: 20,
        timeEnd: 30,
        title: 'Setting Low, Mid, and High Pointers',
        badge: 'POINTERS: low=0, mid=3, high=6',
        badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-600/70',
        narration:
          'low points to index 0, high to index 6, and mid points to index 3. mid equals low plus high minus low over 2.',
        keyConcept: 'LOW ─────────→ MID ←───────── HIGH',
        type: 'concept',
      },
      {
        id: 4,
        timeStart: 30,
        timeEnd: 40,
        title: 'Compare and Eliminate Half',
        badge: 'COMPARE: arr[mid] vs target',
        badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-600/70',
        narration:
          'Check the middle element. If target is smaller, search left; if greater, search right. Eliminate half the search space.',
        keyConcept: 'Sorted Array → Find Middle → Compare → Narrow Search',
        type: 'concept',
      },
      {
        id: 5,
        timeStart: 40,
        timeEnd: 50,
        title: 'Target Found & Complexity',
        badge: 'FOUND ✓: O(log n) TIME',
        badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-600/70',
        narration:
          'Target 23 matches arr[3]. Target found! Best case is O(1), average and worst case run in O(log n) time.',
        keyConcept: 'BEST CASE: O(1) | AVERAGE/WORST: O(log n) | SPACE: O(1)',
        type: 'complexity',
      },
    ],
  },
  {
    id: 2,
    lessonNumber: 'VIDEO 02',
    title: 'BINARY SEARCH ALGORITHM',
    description:
      'Follow the Binary Search algorithm step by step using low, mid, and high to find a target or determine that it is not present.',
    chips: ['Low / Mid / High', 'Mid Calculation', 'Range Update', 'Target Found / Not Found'],
    filename: 'Binary Search Algorithm.mp4',
    videoSrc: binarySearchAlgorithmVideo,
    duration: 50,
    scenes: [
      {
        id: 1,
        timeStart: 0,
        timeEnd: 10,
        title: 'Algorithm Setup: Boundaries',
        badge: 'INITIALIZE: low=0, high=n-1',
        badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-600/70',
        narration:
          'Set low to index 0 and high to n minus 1. The search loop continues as long as low is less than or equal to high.',
        keyConcept: '• Set low and high boundaries before entering search loop.',
        type: 'concept',
      },
      {
        id: 2,
        timeStart: 10,
        timeEnd: 20,
        title: 'Calculate Middle Safely',
        badge: 'FORMULA: mid = low + (high - low)/2',
        badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-600/70',
        narration:
          'Calculate mid safely using low plus high minus low over 2 to prevent integer addition overflow.',
        keyConcept: '• Calculate mid accurately at every iteration.',
        type: 'concept',
      },
      {
        id: 3,
        timeStart: 20,
        timeEnd: 30,
        title: 'Branching: Compare with arr[mid]',
        badge: 'BRANCH: TARGET < MID ?',
        badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-600/70',
        narration:
          'Compare target with arr[mid]. If equal, return mid. If target is smaller, set high to mid minus 1. If greater, set low to mid plus 1.',
        keyConcept: 'LOW → MID → COMPARE → TARGET < MID ? YES: high=mid-1, NO: low=mid+1',
        type: 'concept',
      },
      {
        id: 4,
        timeStart: 30,
        timeEnd: 40,
        title: 'Handling Missing Elements',
        badge: 'NOT FOUND TRACE: Target = 30',
        badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-600/70',
        narration:
          'Searching for 30: 30 is greater than 23 so search right; then 30 is less than 45 so search left. The search range becomes empty!',
        keyConcept: '30 > 23 (search right) → 30 < 45 (search left) → Range empty → NOT FOUND',
        type: 'concept',
      },
      {
        id: 5,
        timeStart: 40,
        timeEnd: 50,
        title: 'Loop Termination & Result',
        badge: 'TERMINATION: low > high',
        badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-600/70',
        narration:
          'Stop when found or low exceeds high. When range is empty, return minus one. Guaranteed completion in logarithmic steps.',
        keyConcept: '• Stop when found or low > high. Return index or -1.',
        type: 'complexity',
      },
    ],
  },
];
