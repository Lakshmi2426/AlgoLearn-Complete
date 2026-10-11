export type GameDifficulty =
  | 'MEDIUM'
  | 'MEDIUM-HARD'
  | 'HARD'
  | 'DIFFICULT'
  | 'Medium'
  | 'Medium-Hard'
  | 'Hard'
  | 'Difficult'
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert';

export interface GameMetaData {
  id: number;
  levelNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  tagline: string;
  description: string;
  detailedObjective: string;
  difficulty: GameDifficulty;
  duration: string;
  xpReward: number;
  skills: string[];
  interactionType: string;
  hintAvailability: string;
  iconName?: string;
  howToPlay: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
  previewData?: {
    array?: number[];
    target?: number;
    low?: number;
    mid?: number;
    high?: number;
  };
}

export const GAME_CATALOG: GameMetaData[] = [
  // =========================================================================
  // LEVEL 01: MIDPOINT & BOUNDARIES
  // =========================================================================
  {
    id: 1,
    levelNumber: 1,
    title: 'MIDPOINT & BOUNDARIES',
    shortTitle: 'Midpoint & Boundaries',
    subtitle: 'Search Range Definition',
    tagline: 'Learn how LOW, HIGH, and MID define the search range and calculate mid.',
    description: 'Identify LOW, HIGH, calculate MID with standard and overflow-safe formulas, and use the midpoint correctly.',
    detailedObjective: 'Understand how LOW, HIGH, and MID define the current search range. Master both midpoint formulas: mid = (low + high) / 2 and mid = low + (high - low) / 2 with integer floor division.',
    difficulty: 'MEDIUM',
    duration: '2 min',
    xpReward: 100,
    skills: ['Boundary Pointers', 'Midpoint Calculation', 'Overflow-Safe Formula', 'Search Window Invariants'],
    interactionType: 'Identify LOW, HIGH, and verify the correct MID',
    hintAvailability: '3-stage progressive hints',
    iconName: 'target',
    howToPlay: [
      { stepNumber: 1, title: 'Observe Range', description: 'LOW and HIGH define the active range (e.g. low = 0, high = 6).' },
      { stepNumber: 2, title: 'Calculate Mid', description: 'mid = Math.floor((low + high) / 2) or low + Math.floor((high - low) / 2).' },
      { stepNumber: 3, title: 'Confirm Midpoint', description: 'Inspect arr[mid] and confirm the midpoint element.' },
    ],
    previewData: { array: [5, 12, 18, 23, 31, 39, 45], target: 23, low: 0, mid: 3, high: 6 },
  },

  // =========================================================================
  // LEVEL 02: CHOOSE THE CORRECT HALF
  // =========================================================================
  {
    id: 2,
    levelNumber: 2,
    title: 'CHOOSE THE CORRECT HALF',
    shortTitle: 'Choose the Correct Half',
    subtitle: 'Core Binary Search Decision Rule',
    tagline: 'Compare TARGET with arr[mid] and eliminate half of the search space.',
    description: 'Apply the core decision rule: TARGET < arr[mid] → left half, TARGET > arr[mid] → right half, TARGET == arr[mid] → FOUND.',
    detailedObjective: 'Master the fundamental Binary Search decision-making rule. Actively choose the correct half, update LOW or HIGH, and recalculate the new MID.',
    difficulty: 'MEDIUM',
    duration: '2 min',
    xpReward: 120,
    skills: ['Target Comparison', 'Direction Decision', 'Half Elimination', 'Pointer Updates'],
    interactionType: 'Active directional choice (Search Left Half vs Search Right Half)',
    hintAvailability: '3-stage progressive hints',
    iconName: 'predict',
    howToPlay: [
      { stepNumber: 1, title: 'Compare Target', description: 'Inspect arr[mid] and compare it directly with TARGET.' },
      { stepNumber: 2, title: 'Choose Half', description: 'TARGET < arr[mid] → Search Left. TARGET > arr[mid] → Search Right.' },
      { stepNumber: 3, title: 'Observe Update', description: 'Watch boundaries shift and the next midpoint recalculate.' },
    ],
    previewData: { array: [6, 14, 22, 35, 47, 59, 73], target: 59, low: 0, mid: 3, high: 6 },
  },

  // =========================================================================
  // LEVEL 03: COMPLETE THE SEARCH
  // =========================================================================
  {
    id: 3,
    levelNumber: 3,
    title: 'COMPLETE THE SEARCH',
    shortTitle: 'Complete the Search',
    subtitle: 'End-to-End Search Execution',
    tagline: 'Perform the complete Binary Search sequence from start to finish.',
    description: 'Execute the full cycle across multiple iterations: calculate MID → compare → choose half → update range → repeat until FOUND.',
    detailedObjective: 'Perform the complete Binary Search process while maintaining the correct state across multiple iterations until the target is found.',
    difficulty: 'MEDIUM-HARD',
    duration: '3 min',
    xpReward: 150,
    skills: ['Full Execution', 'Iterative Loop', 'State Tracking', 'Logarithmic Convergence'],
    interactionType: 'Multi-iteration interactive search to convergence',
    hintAvailability: '3-stage progressive hints',
    iconName: 'build',
    howToPlay: [
      { stepNumber: 1, title: 'Start Search', description: 'Compute mid for the full array and compare arr[mid] to target.' },
      { stepNumber: 2, title: 'Iterate Half Choices', description: 'Choose left or right, narrowing LOW and HIGH at each iteration.' },
      { stepNumber: 3, title: 'Declare Found', description: 'When arr[mid] === TARGET, confirm Target Found in O(log N) steps.' },
    ],
    previewData: { array: [5, 12, 19, 28, 37, 46, 55, 64, 73, 82, 91], target: 73, low: 0, mid: 5, high: 10 },
  },

  // =========================================================================
  // LEVEL 04: NOT FOUND & SEARCH RANGE COLLAPSE
  // =========================================================================
  {
    id: 4,
    levelNumber: 4,
    title: 'NOT FOUND & SEARCH RANGE COLLAPSE',
    shortTitle: 'Not Found & Range Collapse',
    subtitle: 'Termination Conditions & Empty Range',
    tagline: 'Search an absent target until LOW > HIGH, then confirm NOT FOUND.',
    description: 'Understand how Binary Search detects that a target does not exist when the search range collapses to empty.',
    detailedObjective: 'Master termination conditions and unsuccessful searches. Continue narrowing until low > high, verifying that the search space is empty.',
    difficulty: 'HARD',
    duration: '3 min',
    xpReward: 180,
    skills: ['Termination Conditions', 'Empty Search Space', 'Pointer Inversion', 'Unsuccessful Search (-1)'],
    interactionType: 'Search until range exhaustion, then confirm Target Not Found',
    hintAvailability: '3-stage progressive hints',
    iconName: 'speed',
    howToPlay: [
      { stepNumber: 1, title: 'Narrow Window', description: 'Execute binary search steps for a value absent from the array.' },
      { stepNumber: 2, title: 'Pointers Cross', description: 'Watch boundaries narrow until low > high (0 elements remaining).' },
      { stepNumber: 3, title: 'Confirm Not Found', description: 'Click TARGET NOT FOUND once the search range collapses.' },
    ],
    previewData: { array: [10, 20, 30, 40, 50, 60, 70], target: 45, low: 0, mid: 3, high: 6 },
  },

  // =========================================================================
  // LEVEL 05: DUPLICATES & OCCURRENCE SEARCH
  // =========================================================================
  {
    id: 5,
    levelNumber: 5,
    title: 'DUPLICATES & OCCURRENCE SEARCH',
    shortTitle: 'Duplicates & Occurrence Search',
    subtitle: 'First & Last Occurrence (Bounds)',
    tagline: 'Locate the exact first or last occurrence when duplicates exist.',
    description: 'Learn why finding a match is not enough when duplicates exist. Continue searching left for lower bound or right for upper bound.',
    detailedObjective: 'Master Binary Search variations for duplicate elements. After finding TARGET == arr[mid], continue searching left for first occurrence or right for last occurrence.',
    difficulty: 'HARD',
    duration: '3 min',
    xpReward: 200,
    skills: ['Duplicate Elements', 'First Occurrence', 'Last Occurrence', 'Lower Bound', 'Upper Bound'],
    interactionType: 'Duplicate-aware boundary narrowing until exact occurrence confirmed',
    hintAvailability: '3-stage progressive hints',
    iconName: 'target',
    howToPlay: [
      { stepNumber: 1, title: 'Match Found', description: 'arr[mid] matches target, but duplicate values exist adjacent to mid.' },
      { stepNumber: 2, title: 'Continue Search', description: 'For First Occurrence search LEFT; for Last Occurrence search RIGHT.' },
      { stepNumber: 3, title: 'Lock Boundary', description: 'Confirm match only when no more duplicates exist in that direction.' },
    ],
    previewData: { array: [4, 12, 18, 18, 18, 32, 45, 60], target: 18, low: 0, mid: 3, high: 7 },
  },

  // =========================================================================
  // LEVEL 06: BINARY SEARCH MASTER
  // =========================================================================
  {
    id: 6,
    levelNumber: 6,
    title: 'BINARY SEARCH MASTER',
    shortTitle: 'Binary Search Master',
    subtitle: 'Final Boss: Debugging & Advanced Reasoning',
    tagline: 'Debug boundary mistakes and conquer the final comprehensive search exam.',
    description: 'Final Boss Level: Identify and fix realistic Binary Search logic bugs, then execute complete search on large arrays.',
    detailedObjective: 'Combine Binary Search reasoning, boundary management, debugging, and algorithmic thinking into the final boss challenge.',
    difficulty: 'DIFFICULT',
    duration: '4 min',
    xpReward: 250,
    skills: ['Algorithmic Debugging', 'Boundary Invariant Proofs', 'Large Datasets', 'Complete Mastery'],
    interactionType: 'Diagnose & fix pointer bug followed by comprehensive 14-element search',
    hintAvailability: '3-stage progressive hints',
    iconName: 'debug',
    howToPlay: [
      { stepNumber: 1, title: 'Diagnose Bug', description: 'Spot incorrect pointer update logic (e.g. wrong direction or low = mid).' },
      { stepNumber: 2, title: 'Execute Fix', description: 'Apply the proper boundary update (low = mid + 1) and search right.' },
      { stepNumber: 3, title: 'Conquer Master Exam', description: 'Complete a 14-element multi-iteration search with zero guidance.' },
    ],
    previewData: { array: [3, 8, 14, 21, 29, 38, 47, 56, 68, 77, 85, 93, 102, 115], target: 77, low: 0, mid: 6, high: 13 },
  },
];
