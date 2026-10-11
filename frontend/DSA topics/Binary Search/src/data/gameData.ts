export interface BinarySearchChallenge {
  id: string;
  challengeNumber: number;
  totalChallengesInLevel: number;
  question: string;
  instruction: string;
  array: number[];
  target: number;
  targetExists: boolean;
  targetIndex?: number;
  initialLow?: number;
  initialHigh?: number;
  mode?: 'standard' | 'first-occurrence' | 'last-occurrence' | 'missing' | 'speed' | 'boss' | 'debug';
  targetAction?: 'LEFT' | 'RIGHT' | 'FOUND' | 'NOT_FOUND';
  hints: string[]; // Progressive clues [1: Concept, 2: Direction, 3: Calculation & Exact Action]
  guide: {
    ruleTitle: string;
    ruleDescription: string;
    example: string;
  };
  feedback: {
    correctTitle: string;
    correctActionText: string;
    reason: string;
    incorrectTip: string;
  };
  xpReward: number;
}

export interface BinarySearchLevelConfig {
  id: number;
  levelNumber: number;
  title: string;
  subtitle: string;
  difficulty: 'MEDIUM' | 'MEDIUM-HARD' | 'HARD' | 'DIFFICULT' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  xpReward: number;
  stars: number;
  hints: string[];
  challenges: BinarySearchChallenge[];
}

export const GAME_LEVELS: BinarySearchLevelConfig[] = [
  // =========================================================================
  // LEVEL 01: MIDPOINT & BOUNDARIES
  // Difficulty: MEDIUM
  // =========================================================================
  {
    id: 1,
    levelNumber: 1,
    title: 'Level 01: Midpoint & Boundaries',
    subtitle: 'Search Range Definition',
    difficulty: 'MEDIUM',
    description: 'Learn how LOW, HIGH, and MID define the search range and master midpoint calculations.',
    xpReward: 100,
    stars: 3,
    hints: [
      'In a 0-indexed array with range [low .. high], the midpoint is: mid = Math.floor((low + high) / 2).',
      'The overflow-safe formula is: mid = low + Math.floor((high - low) / 2).',
      'Inspect the midpoint element arr[mid] to check if it matches the target, and confirm the midpoint!',
    ],
    challenges: [
      {
        id: 'l1-c1',
        challengeNumber: 1,
        totalChallengesInLevel: 1,
        question: 'CALCULATE MIDPOINT [LOW: 0, HIGH: 6]',
        instruction: 'Array has 7 elements: [5, 12, 18, 23, 31, 39, 45]. Search range is [0 .. 6]. Calculate mid = Math.floor((0 + 6) / 2) = 3. Check arr[3] (value 23). It matches target 23! Click "TARGET FOUND" to confirm the midpoint.',
        array: [5, 12, 18, 23, 31, 39, 45],
        target: 23,
        targetExists: true,
        targetIndex: 3,
        initialLow: 0,
        initialHigh: 6,
        targetAction: 'FOUND',
        mode: 'standard',
        hints: [
          'Binary search always inspects the middle: mid = Math.floor((low + high) / 2).',
          'low = 0, high = 6 → mid = Math.floor(6 / 2) = 3. The element at index 3 is 23.',
          'arr[3] matches target 23! Click "TARGET FOUND" to confirm the midpoint.',
        ],
        guide: {
          ruleTitle: 'Midpoint Calculation',
          ruleDescription: 'Binary Search computes the center of the active search range using integer division.',
          example: 'low = 0, high = 6 → mid = Math.floor((0 + 6) / 2) = 3.',
        },
        feedback: {
          correctTitle: '🎉 Midpoint Calculated & Verified!',
          correctActionText: 'Target 23 confirmed at midpoint index [3]!',
          reason: 'mid = Math.floor((0 + 6) / 2) = 3. arr[3] === 23 matches the target.',
          incorrectTip: 'Calculate mid = Math.floor((0 + 6) / 2) = 3 and verify arr[3] matches 23.',
        },
        xpReward: 100,
      },
    ],
  },

  // =========================================================================
  // LEVEL 02: CHOOSE THE CORRECT HALF
  // Difficulty: MEDIUM
  // =========================================================================
  {
    id: 2,
    levelNumber: 2,
    title: 'Level 02: Choose the Correct Half',
    subtitle: 'Core Decision Rule & Half-Elimination',
    difficulty: 'MEDIUM',
    description: 'Compare TARGET with arr[mid] and actively choose which half of the search space to eliminate.',
    xpReward: 120,
    stars: 3,
    hints: [
      'If TARGET > arr[mid], the target must be in the right half. Choose SEARCH RIGHT HALF (low = mid + 1).',
      'If TARGET < arr[mid], the target must be in the left half. Choose SEARCH LEFT HALF (high = mid - 1).',
      'Actively choose the correct direction to narrow the search space.',
    ],
    challenges: [
      {
        id: 'l2-c1',
        challengeNumber: 1,
        totalChallengesInLevel: 2,
        question: 'WHICH HALF? TARGET [ 59 ]',
        instruction: 'Array: [6, 14, 22, 35, 47, 59, 73]. Current mid = 3 (arr[3] = 35). Target is 59. Compare 59 with 35 and choose the correct half to search!',
        array: [6, 14, 22, 35, 47, 59, 73],
        target: 59,
        targetExists: true,
        targetIndex: 5,
        targetAction: 'RIGHT',
        hints: [
          'Compare target 59 with the middle element arr[3] (35).',
          'Since 59 > 35 and the array is sorted in ascending order, 59 must be in the right half.',
          'Click "Search Right Half". This updates low = mid + 1 = 4, eliminating the entire left half.',
        ],
        guide: {
          ruleTitle: 'Eliminating the Left Half',
          ruleDescription: 'When TARGET > arr[mid], all elements at and before mid are strictly less than target. Set low = mid + 1 to search the right half.',
          example: 'Target 59 > 35 → search RIGHT HALF (low = 4, high = 6).',
        },
        feedback: {
          correctTitle: '🎉 Correct Half Chosen: Right Half!',
          correctActionText: 'Low pointer moved to [4]. Left half [0 .. 3] completely eliminated!',
          reason: 'Target (59) > arr[3] (35). In sorted arrays, all items <= 35 cannot contain 59.',
          incorrectTip: 'Compare 59 to 35. 59 is greater, so search the RIGHT half.',
        },
        xpReward: 60,
      },
      {
        id: 'l2-c2',
        challengeNumber: 2,
        totalChallengesInLevel: 2,
        question: 'WHICH HALF? TARGET [ 17 ]',
        instruction: 'Array: [3, 8, 17, 24, 38, 50, 62, 75]. Current mid = 3 (arr[3] = 24). Target is 17. Compare 17 with 24 and choose the correct half to search!',
        array: [3, 8, 17, 24, 38, 50, 62, 75],
        target: 17,
        targetExists: true,
        targetIndex: 2,
        targetAction: 'LEFT',
        hints: [
          'Compare target 17 with the middle element arr[3] (24).',
          'Since 17 < 24, 17 must be located in the left half.',
          'Click "Search Left Half". This updates high = mid - 1 = 2, eliminating the entire right half.',
        ],
        guide: {
          ruleTitle: 'Eliminating the Right Half',
          ruleDescription: 'When TARGET < arr[mid], all elements at and after mid are strictly greater than target. Set high = mid - 1 to search the left half.',
          example: 'Target 17 < 24 → search LEFT HALF (low = 0, high = 2).',
        },
        feedback: {
          correctTitle: '🎉 Correct Half Chosen: Left Half!',
          correctActionText: 'High pointer moved to [2]. Right half [3 .. 7] completely eliminated!',
          reason: 'Target (17) < arr[3] (24). In sorted arrays, all items >= 24 cannot contain 17.',
          incorrectTip: 'Compare 17 to 24. 17 is smaller, so search the LEFT half.',
        },
        xpReward: 60,
      },
    ],
  },

  // =========================================================================
  // LEVEL 03: COMPLETE THE SEARCH
  // Difficulty: MEDIUM-HARD
  // =========================================================================
  {
    id: 3,
    levelNumber: 3,
    title: 'Level 03: Complete the Search',
    subtitle: 'Full Multi-Iteration Search Execution',
    difficulty: 'MEDIUM-HARD',
    description: 'Execute the complete Binary Search sequence across multiple iterations until the target is found.',
    xpReward: 150,
    stars: 3,
    hints: [
      'Calculate mid, compare arr[mid] with target, choose left or right, and update boundaries.',
      'Repeat the process until arr[mid] matches the target, then click TARGET FOUND.',
      'Notice how the search range cuts in half at every single step (O(log N)).',
    ],
    challenges: [
      {
        id: 'l3-c1',
        challengeNumber: 1,
        totalChallengesInLevel: 2,
        question: 'SEARCH FOR TARGET [ 73 ]',
        instruction: 'Array: [5, 12, 19, 28, 37, 46, 55, 64, 73, 82, 91]. Target is 73. Execute the full Binary Search cycle across multiple iterations until the target is found!',
        array: [5, 12, 19, 28, 37, 46, 55, 64, 73, 82, 91],
        target: 73,
        targetExists: true,
        targetIndex: 8,
        mode: 'standard',
        hints: [
          'Step 1: low = 0, high = 10 → mid = 5 (arr[5] = 46). Target 73 > 46 → Search Right Half (low becomes 6).',
          'Step 2: low = 6, high = 10 → mid = 8 (arr[8] = 73). Target 73 === arr[8]!',
          'Target matches at index 8! Click "TARGET FOUND".',
        ],
        guide: {
          ruleTitle: 'Full Binary Search Cycle',
          ruleDescription: 'At each iteration, compare target with arr[mid]. If greater, search right; if smaller, search left; if equal, target is found!',
          example: 'mid = 5 (46) < 73 → right → mid = 8 (73) === 73 → FOUND.',
        },
        feedback: {
          correctTitle: '🎉 Target 73 Located via Full Binary Search!',
          correctActionText: 'Target 73 found at index [8] in 2 comparisons!',
          reason: 'Complete search executed with optimal half-eliminations and zero errors.',
          incorrectTip: 'Compare target with arr[mid] at each step and update pointers accordingly.',
        },
        xpReward: 75,
      },
      {
        id: 'l3-c2',
        challengeNumber: 2,
        totalChallengesInLevel: 2,
        question: 'SEARCH FOR TARGET [ 21 ]',
        instruction: 'Array: [2, 7, 13, 21, 30, 42, 51, 63, 72, 85, 94, 99]. Target is 21. Execute all required iterations to narrow the range and locate the target!',
        array: [2, 7, 13, 21, 30, 42, 51, 63, 72, 85, 94, 99],
        target: 21,
        targetExists: true,
        targetIndex: 3,
        mode: 'standard',
        hints: [
          'Iteration 1: mid = 5 (42). 21 < 42 → Search Left Half (high = 4).',
          'Iteration 2: low = 0, high = 4 → mid = 2 (13). 21 > 13 → Search Right Half (low = 3).',
          'Iteration 3: low = 3, high = 4 → mid = 3 (21). arr[3] === 21 → Click "TARGET FOUND"!',
        ],
        guide: {
          ruleTitle: 'Multiple Iterations to Convergence',
          ruleDescription: 'In a 12-element array, it takes up to ceil(log2(12)) = 4 comparisons to find any element.',
          example: '12 elements → 5 candidates → 2 candidates → 1 match.',
        },
        feedback: {
          correctTitle: '🎉 Multi-Step Convergence Success!',
          correctActionText: 'Target 21 located at index [3] after 3 iterations!',
          reason: 'Maintained exact pointer state: Left (high = 4) → Right (low = 3) → Match at index [3].',
          incorrectTip: 'Check each iteration carefully: Left when target < mid, Right when target > mid.',
        },
        xpReward: 75,
      },
    ],
  },

  // =========================================================================
  // LEVEL 04: NOT FOUND & SEARCH RANGE COLLAPSE
  // Difficulty: HARD
  // =========================================================================
  {
    id: 4,
    levelNumber: 4,
    title: 'Level 04: Not Found & Search Range Collapse',
    subtitle: 'Termination Conditions & Empty Range',
    difficulty: 'HARD',
    description: 'Learn how Binary Search detects that a target does not exist when the search range collapses (low > high).',
    xpReward: 180,
    stars: 3,
    hints: [
      'When searching for an absent target, continue narrowing boundaries until low > high.',
      'Do not declare Target Not Found while candidates still exist in [low .. high].',
      'Once low > high (search range collapses to 0), click TARGET NOT FOUND.',
    ],
    challenges: [
      {
        id: 'l4-c1',
        challengeNumber: 1,
        totalChallengesInLevel: 2,
        question: 'SEARCH ABSENT TARGET [ 45 ]',
        instruction: 'Array: [10, 20, 30, 40, 50, 60, 70]. Target 45 is absent. Continue Binary Search until pointers cross (low > high), then declare TARGET NOT FOUND!',
        array: [10, 20, 30, 40, 50, 60, 70],
        target: 45,
        targetExists: false,
        mode: 'missing',
        hints: [
          'Iter 1: mid = 3 (40). 45 > 40 → Search Right (low = 4).',
          'Iter 2: low = 4, high = 6 → mid = 5 (60). 45 < 60 → Search Left (high = 4).',
          'Iter 3: low = 4, high = 4 → mid = 4 (50). 45 < 50 → Search Left (high = 3). Now low (4) > high (3) → Click "TARGET NOT FOUND"!',
        ],
        guide: {
          ruleTitle: 'Empty Search Range Termination',
          ruleDescription: 'The loop continues while low <= high. When low > high, the remaining search window is empty, proving mathematically that the target does not exist.',
          example: 'low = 4, high = 3 → 4 > 3 → range empty → Target Not Found (-1).',
        },
        feedback: {
          correctTitle: '✓ Target Not Found Confirmed!',
          correctActionText: 'The search range is empty, so the target is not present.',
          reason: 'Pointers crossed (low: 4 > high: 3). Target 45 is proven absent with O(log N) mathematical certainty.',
          incorrectTip: 'Do not declare Not Found early! Continue searching until low > high.',
        },
        xpReward: 90,
      },
      {
        id: 'l4-c2',
        challengeNumber: 2,
        totalChallengesInLevel: 2,
        question: 'SEARCH ABSENT TARGET [ 2 ]',
        instruction: 'Array: [3, 8, 15, 24, 33, 47, 58, 69]. Target 2 is smaller than any element in the array. Narrow boundaries until the search space collapses, then confirm Not Found!',
        array: [3, 8, 15, 24, 33, 47, 58, 69],
        target: 2,
        targetExists: false,
        mode: 'missing',
        hints: [
          'Iter 1: mid = 3 (24). 2 < 24 → Search Left (high = 2).',
          'Iter 2: mid = 1 (8). 2 < 8 → Search Left (high = 0).',
          'Iter 3: mid = 0 (3). 2 < 3 → Search Left (high = -1). Now low (0) > high (-1) → Click "TARGET NOT FOUND"!',
        ],
        guide: {
          ruleTitle: 'Lower Boundary Collapse',
          ruleDescription: 'When the target is smaller than all array values, HIGH decrements below 0 (high = -1), triggering low (0) > high (-1).',
          example: 'high becomes -1, low remains 0 → low > high.',
        },
        feedback: {
          correctTitle: '✓ Boundary Collapse Verified!',
          correctActionText: 'The search range is empty, so the target is not present.',
          reason: 'Pointers crossed with high = -1 < low = 0. Concluded in exactly 3 comparisons.',
          incorrectTip: 'Keep searching left until high falls below low.',
        },
        xpReward: 90,
      },
    ],
  },

  // =========================================================================
  // LEVEL 05: DUPLICATES & OCCURRENCE SEARCH
  // Difficulty: HARD
  // =========================================================================
  {
    id: 5,
    levelNumber: 5,
    title: 'Level 05: Duplicates & Occurrence Search',
    subtitle: 'First & Last Occurrence (Lower & Upper Bounds)',
    difficulty: 'HARD',
    description: 'Learn why finding a match is not enough when duplicates exist. Continue searching left for lower bound or right for upper bound.',
    xpReward: 200,
    stars: 3,
    hints: [
      'Finding arr[mid] === target is not enough when duplicates exist!',
      'For FIRST OCCURRENCE: if the element to the left is also target, continue searching LEFT (high = mid - 1).',
      'For LAST OCCURRENCE: if the element to the right is also target, continue searching RIGHT (low = mid + 1).',
    ],
    challenges: [
      {
        id: 'l5-c1',
        challengeNumber: 1,
        totalChallengesInLevel: 2,
        question: 'FIND FIRST OCCURRENCE [ 18 ]',
        instruction: 'Array: [4, 12, 18, 18, 18, 32, 45, 60]. Target 18 appears multiple times. Locate the FIRST occurrence (lower bound)! If mid is 18 but index [mid - 1] is also 18, continue searching LEFT.',
        array: [4, 12, 18, 18, 18, 32, 45, 60],
        target: 18,
        targetExists: true,
        targetIndex: 2,
        mode: 'first-occurrence',
        hints: [
          'Iter 1: mid = 3 (18). arr[3] is 18, but arr[2] is also 18! Do not stop here: search LEFT HALF (high = 2).',
          'Iter 2: low = 0, high = 2 → mid = 1 (12). 18 > 12 → search RIGHT HALF (low = 2).',
          'Iter 3: low = 2, high = 2 → mid = 2 (18). arr[2] is 18, and arr[1] is 12. Index 2 is the FIRST occurrence! Click "TARGET FOUND".',
        ],
        guide: {
          ruleTitle: 'First Occurrence Search (Lower Bound)',
          ruleDescription: 'When arr[mid] === target, record mid as potential answer and continue searching the left half (high = mid - 1) to check for earlier occurrences.',
          example: 'Found at index 3 → check left → first occurrence is at index 2.',
        },
        feedback: {
          correctTitle: '🎉 First Occurrence Confirmed!',
          correctActionText: 'Target 18 earliest occurrence locked at index [2]!',
          reason: 'arr[2] === 18 and arr[1] !== 18. Verified first occurrence with lower bound binary search.',
          incorrectTip: 'Check if the previous element is also equal to target before confirming.',
        },
        xpReward: 100,
      },
      {
        id: 'l5-c2',
        challengeNumber: 2,
        totalChallengesInLevel: 2,
        question: 'FIND LAST OCCURRENCE [ 27 ]',
        instruction: 'Array: [5, 15, 27, 27, 27, 27, 40, 56]. Target 27 has duplicates. Locate the LAST occurrence (upper bound)! If arr[mid] is 27 but index [mid + 1] is also 27, continue searching RIGHT.',
        array: [5, 15, 27, 27, 27, 27, 40, 56],
        target: 27,
        targetExists: true,
        targetIndex: 5,
        mode: 'last-occurrence',
        hints: [
          'Iter 1: mid = 3 (27). arr[3] is 27, but arr[4] is also 27! Do not stop here: search RIGHT HALF (low = 4).',
          'Iter 2: low = 4, high = 7 → mid = 5 (27). arr[5] is 27, and arr[6] is 40 (not 27). Index 5 is the LAST occurrence!',
          'Index 5 is the final occurrence! Click "TARGET FOUND".',
        ],
        guide: {
          ruleTitle: 'Last Occurrence Search (Upper Bound)',
          ruleDescription: 'When arr[mid] === target, record mid as potential answer and continue searching the right half (low = mid + 1) to check for later occurrences.',
          example: 'Found at index 3 → check right → last occurrence is at index 5.',
        },
        feedback: {
          correctTitle: '🎉 Last Occurrence Confirmed!',
          correctActionText: 'Target 27 final occurrence locked at index [5]!',
          reason: 'arr[5] === 27 and arr[6] !== 27. Verified final occurrence with upper bound binary search.',
          incorrectTip: 'Check if the next element is also equal to target before confirming.',
        },
        xpReward: 100,
      },
    ],
  },

  // =========================================================================
  // LEVEL 06: BINARY SEARCH MASTER
  // Difficulty: DIFFICULT
  // =========================================================================
  {
    id: 6,
    levelNumber: 6,
    title: 'Level 06: Binary Search Master',
    subtitle: 'Final Boss: Debugging & Advanced Reasoning',
    difficulty: 'DIFFICULT',
    description: 'Diagnose and fix realistic Binary Search logic bugs, then execute complete search on large datasets.',
    xpReward: 250,
    stars: 3,
    hints: [
      'In Challenge 1: spot the faulty boundary update. Setting low = mid - 1 or low = mid when target > mid causes bugs and infinite loops!',
      'Choose the correct pointer update: move past mid into the right half (low = mid + 1).',
      'In Challenge 2: execute a flawless search on a 14-element dataset with zero guidance.',
    ],
    challenges: [
      {
        id: 'l6-c1',
        challengeNumber: 1,
        totalChallengesInLevel: 2,
        question: 'FINAL BOSS: DEBUG BOUNDARY UPDATE [ 72 ]',
        instruction: 'Array: [12, 24, 36, 48, 60, 72, 84, 96]. Target 72. A buggy script set low = mid - 1 when target > mid (wrong direction!). mid = 3 (48). Target 72 > 48. Fix the bug: choose SEARCH RIGHT HALF (low = mid + 1), then finish the search!',
        array: [12, 24, 36, 48, 60, 72, 84, 96],
        target: 72,
        targetExists: true,
        targetIndex: 5,
        mode: 'debug',
        hints: [
          'Target 72 > arr[3] (48). The bug moved left or decremented low, which loses the target!',
          'The algorithmic fix is: search RIGHT half by advancing low = mid + 1 = 4.',
          'Click "Search Right Half", then at index 5 click "TARGET FOUND".',
        ],
        guide: {
          ruleTitle: 'Debugging Pointer Update Invariants',
          ruleDescription: 'When target > arr[mid], low MUST be updated to mid + 1. Moving in the wrong direction eliminates the target; failing to increment mid causes infinite loops.',
          example: 'Target 72 > 48 → LOW must be set to mid + 1 = 4.',
        },
        feedback: {
          correctTitle: '🎉 Bug Diagnosed & Fixed!',
          correctActionText: 'Pointers corrected to [low = 4]! Target 72 located at index [5]!',
          reason: 'Eliminated the wrong-direction bug and maintained the binary search invariant.',
          incorrectTip: 'Target 72 > 48. The correct update is to search the RIGHT half (low = mid + 1).',
        },
        xpReward: 125,
      },
      {
        id: 'l6-c2',
        challengeNumber: 2,
        totalChallengesInLevel: 2,
        question: 'FINAL BOSS: 14-ELEMENT MASTER EXAM [ 77 ]',
        instruction: 'Array has 14 elements: [3, 8, 14, 21, 29, 38, 47, 56, 68, 77, 85, 93, 102, 115]. Target is 77. Complete all 4 iterations independently with zero mistakes!',
        array: [3, 8, 14, 21, 29, 38, 47, 56, 68, 77, 85, 93, 102, 115],
        target: 77,
        targetExists: true,
        targetIndex: 9,
        mode: 'boss',
        hints: [
          'Iter 1: low = 0, high = 13 → mid = 6 (47). 77 > 47 → Search Right Half (low = 7).',
          'Iter 2: low = 7, high = 13 → mid = 10 (85). 77 < 85 → Search Left Half (high = 9).',
          'Iter 3: low = 7, high = 9 → mid = 8 (68). 77 > 68 → Search Right Half (low = 9).',
          'Iter 4: low = 9, high = 9 → mid = 9 (77). 77 === 77 → Click "TARGET FOUND"!',
        ],
        guide: {
          ruleTitle: 'Master Search Convergence',
          ruleDescription: 'A 14-element search demonstrates complete algorithmic mastery: O(log2(14)) ≈ 4 comparisons.',
          example: '14 items → 7 items → 3 items → 1 match.',
        },
        feedback: {
          correctTitle: '👑 BINARY SEARCH MASTER CROWNED!',
          correctActionText: 'Target 77 found at index [9] after 4 flawless logarithmic comparisons!',
          reason: 'You have mastered boundary pointers, directional elimination, absent target detection, duplicate bounds, and debugging!',
          incorrectTip: 'Trace carefully: mid = 6 (47) -> Right, mid = 10 (85) -> Left, mid = 8 (68) -> Right, mid = 9 -> Found!',
        },
        xpReward: 125,
      },
    ],
  },
];
