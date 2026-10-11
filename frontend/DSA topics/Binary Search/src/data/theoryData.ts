import { TheoryLesson } from '../types';

export const BINARY_SEARCH_CODE = {
  python: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = low + (high - low) // 2

        if arr[mid] == target:
            return mid

        if arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1`,
  java: `static int binarySearch(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (arr[mid] == target)
            return mid;

        if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }

    return -1;
}`,
  cpp: `int binarySearch(int arr[], int n, int target) {
    int low = 0;
    int high = n - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (arr[mid] == target)
            return mid;

        if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }

    return -1;
}`,
  c: `int binarySearch(int arr[], int n, int target) {
    int low = 0;
    int high = n - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (arr[mid] == target)
            return mid;

        if (arr[mid] < target)
            low = mid + 1;
        else
            high = mid - 1;
    }

    return -1;
}`,
};

export const THEORY_LESSONS: TheoryLesson[] = [
  // =========================================================================
  // CHAPTER 01: WHAT IS BINARY SEARCH?
  // =========================================================================
  {
    id: 1,
    chapterNumber: '01',
    categoryLabel: 'CORE FOUNDATION',
    lessonNumber: 1,
    title: '1. What is Binary Search?',
    shortDesc: 'Learn how Binary Search finds a target efficiently by repeatedly dividing a sorted search range in half.',
    readTime: '2 min read',
    executiveDefinition:
      'Binary Search finds a target in a sorted array by comparing the target with the middle element and eliminating half of the remaining search space after each comparison.',
    criticalSpecifications: [
      'Divide and conquer: Search a sorted array, check the middle element, and eliminate half the search space.',
      'Logarithmic efficiency: Operates in O(log n) time, drastically outperforming linear O(n) scans.',
      'Key Formula: mid = low + (high - low) / 2.',
      'Main Challenge: Array must be sorted; search range must remain correct at every step.',
    ],
    analogy: {
      title: 'Guess the Secret Number (1 to 100)',
      description:
        'If you guess 50 and are told "Higher!", you instantly know the answer is between 51 and 100. You immediately discard 50 numbers in a single step!',
    },
    example: {
      title: 'First Comparison Trace',
      description: 'Array: [5, 11, 18, 23, 37, 45, 62], Target = 23',
      steps: [
        'low = 0, high = 6',
        'mid = 0 + (6 - 0) / 2 = 3',
        'arr[mid] = 23',
        '23 = target -> FOUND!',
      ],
    },
    visualDiagram: {
      type: 'before-after',
      operationLabel: 'Divide and Conquer Half-Elimination',
      notes: 'Each comparison removes roughly half of the remaining search space.',
      diagramText: `  Array:   [5]  [11]  [18]  [23]  [37]  [45]  [62]
  Indices:  0     1     2     3     4     5     6
  Target:  23
            LOW ───────────→ MID ←─────────── HIGH
           (idx 0)         (idx 3)          (idx 6)
  
  Search → Find Middle → Compare → Narrow Range → Result`,
    },
    content: `### Understanding Binary Search
Binary Search finds a target in a sorted array by comparing the target with the middle element and eliminating half of the remaining search space after each comparison.

* **Divide and conquer**: With each inspection, half of all remaining candidates are discarded.
* **Logarithmic time O(log n)**: In 1,000,000 elements, Binary Search needs at most 20 comparisons!
* **Important**: Binary Search requires the data to be sorted.`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'Best Case: O(1) | Average & Worst Case: O(log n)',
    spaceComplexity: 'Iterative: O(1) Auxiliary Space',
    keyTakeaway:
      'Binary Search finds a target in a sorted array by comparing the target with the middle element and eliminating half of the remaining search space after each comparison.',
    interactiveDemoType: 'binary-search',
  },

  // =========================================================================
  // CHAPTER 02: ENSURE SORTED ARRAY
  // =========================================================================
  {
    id: 2,
    chapterNumber: '02',
    categoryLabel: 'PRECONDITIONS',
    lessonNumber: 2,
    title: '2. Ensure Sorted Array',
    shortDesc: 'Understand why Binary Search strictly demands sorted data and why unsorted input causes failures.',
    readTime: '2 min read',
    executiveDefinition:
      'Binary Search strictly requires the input array to be sorted so that the relationship between target and arr[mid] reliably eliminates one full half of the search space.',
    criticalSpecifications: [
      'Important: Binary Search requires the data to be sorted.',
      'Order Invariant: arr[0] <= arr[1] <= ... <= arr[n-1] for ascending order.',
      'Unsorted Danger: On unsorted data, the target could lie in either half regardless of arr[mid].',
      'Cost Balance: If searching once, O(n) linear search is cheaper than O(n log n) sorting. If searching repeatedly, sort once and search fast.',
    ],
    analogy: {
      title: 'The Alphabetical Dictionary',
      description:
        'You can instantly jump to words starting with "M" in a dictionary because words are alphabetized. If the pages were shuffled randomly, you would have to scan every single page!',
    },
    example: {
      title: 'Sorted vs Unsorted Array Behavior',
      description: 'Why sorted data enables elimination:',
      steps: [
        'Sorted: [5, 11, 18, 23, 37, 45, 62] -> arr[3] = 23 guarantees all elements to right are >= 23.',
        'If target = 45 > 23, we are 100% certain 45 cannot be in indices 0, 1, 2, or 3.',
        'We safely discard the left half!',
      ],
    },
    visualDiagram: {
      type: 'comparison',
      operationLabel: 'Sorted Guarantee vs Unsorted Ambiguity',
      notes: 'Important: Binary Search requires the data to be sorted.',
      diagramText: `  SORTED:   [5,  11, 18, 23, 37, 45, 62]  Target = 45
            Since 45 > 23, discard [5, 11, 18, 23] with 100% confidence!
  
  UNSORTED: [45,  5, 62, 11, 23, 18, 37]  Target = 45
            mid = 11. Target 45 > 11, but 45 is actually on the LEFT!
            Eliminating left half would permanently lose the target!`,
    },
    content: `### The Precondition: Sorted Data
**Important: Binary Search requires the data to be sorted.**

Binary Search relies entirely on the mathematical property of monotonicity:
1. Every element before \`mid\` is less than or equal to \`arr[mid]\`.
2. Every element after \`mid\` is greater than or equal to \`arr[mid]\`.

Without this property, comparing the target against \`arr[mid]\` provides zero useful information about which half contains the target.`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'Verification: O(n) | Binary Search: O(log n)',
    spaceComplexity: 'O(1) Auxiliary Space',
    keyTakeaway:
      'Important: Binary Search requires the data to be sorted. Never run Binary Search on unsorted data without sorting first.',
    interactiveDemoType: 'binary-search',
  },

  // =========================================================================
  // CHAPTER 03: INITIALIZE LOW AND HIGH
  // =========================================================================
  {
    id: 3,
    chapterNumber: '03',
    categoryLabel: 'BOUNDARY POINTERS',
    lessonNumber: 3,
    title: '3. Initialize low, high',
    shortDesc: 'Master how low and high define the search range and maintain the candidate boundaries.',
    readTime: '2 min read',
    executiveDefinition:
      'The boundary pointers low and high define the inclusive active search window [low, high] where the target can possibly exist.',
    criticalSpecifications: [
      'low = 0: Initializes to the first valid index of the array.',
      'high = n - 1: Initializes to the last valid index of the array.',
      'Active search range: All indices k where low <= k <= high are candidate solutions.',
      'Search stops when low > high: An inverted window proves the target does not exist.',
    ],
    analogy: {
      title: 'Sliding Bookends on a Shelf',
      description:
        'Imagine two bookends holding a row of books. You start with the bookends at the far ends. At each step, you slide either the left or right bookend closer, narrowing down the books in between.',
    },
    example: {
      title: 'Boundary Initialization',
      description: 'Array size n = 7: [5, 11, 18, 23, 37, 45, 62]',
      steps: [
        'Set low = 0 (points to value 5)',
        'Set high = n - 1 = 6 (points to value 62)',
        'The candidate search range covers all 7 elements: [0 .. 6]',
      ],
    },
    visualDiagram: {
      type: 'before-after',
      operationLabel: 'Boundary Initialization Diagram',
      notes: 'low and high define the current search range.',
      diagramText: `  Array:   [5]  [11]  [18]  [23]  [37]  [45]  [62]
  Indices:  0     1     2     3     4     5     6
            ↑                                   ↑
           low                                 high
         (idx 0)                             (idx 6)
  
  Current Search Range: Indices 0 through 6 (7 elements)`,
    },
    content: `### Boundary Pointers: low and high
At every moment during Binary Search, the search space is bounded by:
* \`low\`: The lowest index that could contain the target.
* \`high\`: The highest index that could contain the target.

As the algorithm makes comparisons, either \`low\` increases or \`high\` decreases, narrowing the search space until either the target is found or the range becomes empty (\`low > high\`).`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'Initialization: O(1) Constant Time',
    spaceComplexity: 'O(1) Auxiliary Space',
    keyTakeaway:
      'low and high define the current search range. The search remains valid as long as low <= high.',
    interactiveDemoType: 'binary-search',
  },

  // =========================================================================
  // CHAPTER 04: FIND MIDDLE INDEX
  // =========================================================================
  {
    id: 4,
    chapterNumber: '04',
    categoryLabel: 'KEY FORMULA',
    lessonNumber: 4,
    title: '4. Find Middle (Key Formula)',
    shortDesc: 'Understand how to calculate the middle index correctly and prevent integer overflow.',
    readTime: '2 min read',
    executiveDefinition:
      'The middle index is computed using mid = low + (high - low) / 2 to divide the candidate range cleanly in half while avoiding 32-bit integer overflow.',
    criticalSpecifications: [
      'Key Formula: mid = low + (high - low) / 2.',
      'Integer Overflow Protection: In C, C++, and Java, (low + high) can exceed 2,147,483,647 and turn negative.',
      'Floor Division: In JavaScript, use Math.floor(); in Python, use // operator.',
      'Even-Length Arrays: When an array has an even number of elements, this formula picks the lower-middle element.',
    ],
    analogy: {
      title: 'Measuring From the Starting Post',
      description:
        'Instead of adding two mile markers together, measure the distance between them (high - low), cut that distance in half, and add it to the starting marker (low).',
    },
    example: {
      title: 'Calculating mid on [5, 11, 18, 23, 37, 45, 62]',
      description: 'low = 0, high = 6',
      steps: [
        'high - low = 6 - 0 = 6',
        '(high - low) / 2 = 6 / 2 = 3',
        'mid = low + 3 = 0 + 3 = 3',
        'arr[mid] = arr[3] = 23',
      ],
    },
    visualDiagram: {
      type: 'before-after',
      operationLabel: 'Middle Calculation Mechanics',
      notes: 'Safe formula prevents integer addition overflow.',
      diagramText: `  Formula:  mid = low + (high - low) / 2
  
  Example 1: low = 0, high = 6
             mid = 0 + (6 - 0) / 2 = 3 (Points to element 23)
  
  Example 2 (Large Arrays): low = 1,500,000,000 | high = 2,000,000,000
             low + high = 3.5 billion -> OVERFLOW in 32-bit signed int!
             low + (high - low) / 2 = 1.5B + 250M = 1.75B (Correct!)`,
    },
    content: `### The Formula for mid
Always calculate \`mid\` using:
\`\`\`text
mid = low + (high - low) / 2
\`\`\`

While mathematically equal to \`(low + high) / 2\`, this formula prevents integer overflow in compiled languages like Java, C++, and C when working with large arrays.`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'Computation: O(1) Constant Time',
    spaceComplexity: 'O(1) Auxiliary Space',
    keyTakeaway:
      'Always calculate mid using mid = low + (high - low) / 2 to avoid overflow and pinpoint the center element accurately.',
    interactiveDemoType: 'binary-search',
  },

  // =========================================================================
  // CHAPTER 05: COMPARE TARGET WITH ARR[MID]
  // =========================================================================
  {
    id: 5,
    chapterNumber: '05',
    categoryLabel: 'COMPARISON LOGIC',
    lessonNumber: 5,
    title: '5. Compare Target with arr[mid]',
    shortDesc: 'Understand the three-way comparison logic: match found, search left, or search right.',
    readTime: '2 min read',
    executiveDefinition:
      'Comparing target with arr[mid] results in one of three mutually exclusive outcomes: the target is found, it lies in the left half, or it lies in the right half.',
    criticalSpecifications: [
      'Match: If arr[mid] === target, the search succeeds; return mid.',
      'Smaller: If target < arr[mid], search the left half (high = mid - 1).',
      'Greater: If target > arr[mid], search the right half (low = mid + 1).',
      'Strict Exclusion: Because arr[mid] was already inspected and was not equal, mid is excluded from the new range.',
    ],
    analogy: {
      title: 'A Two-Pan Balance Scale',
      description:
        'Place the target on one pan and the middle element on the other. If balanced, you found your answer! If one side is heavier, you instantly know which direction to search.',
    },
    example: {
      title: 'Comparing Target 45 with arr[mid] = 23',
      description: 'Array: [5, 11, 18, 23, 37, 45, 62], mid = 3, target = 45',
      steps: [
        'Read arr[mid] = arr[3] = 23',
        'Compare: Is 45 === 23? No.',
        'Compare: Is 45 < 23? No.',
        'Compare: Is 45 > 23? Yes! The target can only exist to the right of 23.',
        'Action: Search right half (low = mid + 1).',
      ],
    },
    visualDiagram: {
      type: 'before-after',
      operationLabel: 'Three-Way Comparison Branching',
      notes: 'Each comparison removes roughly half of the remaining search space.',
      diagramText: `                     Compare target vs arr[mid]
                            /      |      \\
                           /       |       \\
             target === arr[mid]   target < arr[mid]   target > arr[mid]
                   ↓                      ↓                   ↓
              TARGET FOUND          SEARCH LEFT         SEARCH RIGHT
               return mid;         high = mid - 1;     low = mid + 1;`,
    },
    content: `### Three-Way Comparison Branching
Every iteration of Binary Search executes a three-way branch:
1. **\`arr[mid] === target\`**: Target found! Return \`mid\`.
2. **\`arr[mid] < target\`**: Target is larger, so it must be in the right half. Update \`low = mid + 1\`.
3. **\`arr[mid] > target\`**: Target is smaller, so it must be in the left half. Update \`high = mid - 1\`.`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'Comparison: O(1) Constant Time',
    spaceComplexity: 'O(1) Auxiliary Space',
    keyTakeaway:
      'If target < arr[mid], search left. If target > arr[mid], search right. If target = arr[mid], the target is found.',
    interactiveDemoType: 'binary-search',
  },

  // =========================================================================
  // CHAPTER 06: NARROW SEARCH SPACE
  // =========================================================================
  {
    id: 6,
    chapterNumber: '06',
    categoryLabel: 'WINDOW REDUCTION',
    lessonNumber: 6,
    title: '6. Narrow Search Space',
    shortDesc: 'Learn how low = mid + 1 and high = mid - 1 safely discard half the elements.',
    readTime: '2 min read',
    executiveDefinition:
      'Narrowing the search range eliminates half the remaining elements by updating either low = mid + 1 or high = mid - 1.',
    criticalSpecifications: [
      'Eliminate half: Each comparison cuts the candidate search space by roughly 50%.',
      'Right Shift: low = mid + 1 discards all indices from low to mid.',
      'Left Shift: high = mid - 1 discards all indices from mid to high.',
      'Convergence: Moving past mid guarantees that the window strictly shrinks on every step, preventing infinite loops.',
    ],
    analogy: {
      title: 'Tearing a Phone Book in Half',
      description:
        'With each test, you literally tear away half of the phone book and toss it into the recycling bin. 1,000 pages becomes 500, then 250, then 125, then 62, then 31, then 15, then 7, then 3, then 1!',
    },
    example: {
      title: 'Discarding Left Half Example',
      description: 'Array: [5, 11, 18, 23, 37, 45, 62], Target = 45',
      steps: [
        'Initial range: [5, 11, 18, 23, 37, 45, 62] (7 elements)',
        'mid = 3 (val = 23). Since 45 > 23, we search right.',
        'Update low = mid + 1 = 4.',
        'Eliminated: [5, 11, 18, 23] (4 elements discarded!)',
        'New range: [37, 45, 62] (3 elements remaining)',
      ],
    },
    visualDiagram: {
      type: 'before-after',
      operationLabel: 'Search Space Reduction Step',
      notes: 'Each comparison removes roughly half of the remaining search space.',
      diagramText: `  Original Range: [ 5,  11,  18,  23,  37,  45,  62 ]  (7 elements)
  Target: 45      mid = 3 (value 23)
  
  Since 45 > 23:
  DISCARDED:      [ 5,  11,  18,  23 ] ❌ (Left half eliminated)
  NEW RANGE:      [ 37,  45,  62 ]     ✓ (low = 4, high = 6)`,
    },
    content: `### Eliminating the Non-Viable Half
Because the array is sorted:
* If \`target > arr[mid]\`, no element at or before \`mid\` can possibly equal \`target\`. We safely set \`low = mid + 1\`.
* If \`target < arr[mid]\`, no element at or after \`mid\` can possibly equal \`target\`. We safely set \`high = mid - 1\`.

Each comparison removes roughly half of the remaining search space!`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'O(1) Pointer Update',
    spaceComplexity: 'O(1) Auxiliary Space',
    keyTakeaway:
      'Updating low = mid + 1 or high = mid - 1 eliminates the middle element and half the remaining search space, guaranteeing rapid convergence.',
    interactiveDemoType: 'binary-search',
  },

  // =========================================================================
  // CHAPTER 07: EXAMPLE (TARGET FOUND)
  // =========================================================================
  {
    id: 7,
    chapterNumber: '07',
    categoryLabel: 'STEP-BY-STEP TRACE',
    lessonNumber: 7,
    title: '7. Step-by-Step Example (Target Found)',
    shortDesc: 'Walk through a complete trace where target 23 is found in the array.',
    readTime: '2 min read',
    executiveDefinition:
      'A complete visual trace demonstrating how Binary Search inspects mid, identifies a match, and returns the target index.',
    criticalSpecifications: [
      'Array: [5, 11, 18, 23, 37, 45, 62].',
      'Target = 23.',
      'Step 1: low = 0, high = 6, mid = 3, arr[mid] = 23.',
      'Result: 23 = target -> FOUND at index 3.',
    ],
    analogy: {
      title: 'Direct Hit in the Center',
      description:
        'When the target happens to be in the exact middle of the array, Binary Search finds it on the very first comparison, completing in O(1) best-case time!',
    },
    example: {
      title: 'Beginner-Friendly Trace (Target = 23)',
      description: 'Array: [5, 11, 18, 23, 37, 45, 62], Target = 23',
      steps: [
        'Step 1: low = 0, high = 6',
        'mid = 0 + (6 - 0) / 2 = 3',
        'arr[mid] = 23',
        'Result: 23 = target -> FOUND',
      ],
    },
    visualDiagram: {
      type: 'before-after',
      operationLabel: 'Target = 23 Found Diagram',
      notes: 'Highlight 23 as the middle element.',
      diagramText: `  Array:   [5]  [11]  [18]  [23]  [37]  [45]  [62]
  Indices:  0     1     2     3     4     5     6
            LOW ───────────→ MID ←─────────── HIGH
           (idx 0)         (idx 3)          (idx 6)
  
  Step 1:
  low = 0, high = 6, mid = 3
  arr[mid] = 23
  Result: 23 = target -> FOUND! Return index 3.`,
    },
    content: `### Example Walkthrough: Target Found
Consider searching for **Target = 23** in the sorted array:
\`\`\`text
Array: [5, 11, 18, 23, 37, 45, 62]
Target = 23
\`\`\`

**Step 1:**
* \`low = 0\`
* \`high = 6\`
* \`mid = 3\`
* \`arr[mid] = 23\`

**Result:**
* \`23 = target\`
* **FOUND** at index 3!`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'Best Case: O(1) Immediate Match',
    spaceComplexity: 'O(1) Auxiliary Space',
    keyTakeaway:
      'When arr[mid] === target, the search concludes immediately and returns the middle index.',
    interactiveDemoType: 'binary-search',
  },

  // =========================================================================
  // CHAPTER 08: EXAMPLE (TARGET NOT FOUND)
  // =========================================================================
  {
    id: 8,
    chapterNumber: '08',
    categoryLabel: 'STEP-BY-STEP TRACE',
    lessonNumber: 8,
    title: '8. Step-by-Step Example (Not Found)',
    shortDesc: 'Trace an example where target 30 is absent and the search range becomes empty.',
    readTime: '2 min read',
    executiveDefinition:
      'A complete step-by-step trace showing how Binary Search handles a missing target (30) until the search range becomes empty (low > high).',
    criticalSpecifications: [
      'Array: [5, 11, 18, 23, 37, 45, 62].',
      'Target = 30.',
      '30 > 23: Search right half.',
      '30 < 45: Search left half.',
      'Search range becomes empty: NOT FOUND (-1).',
    ],
    analogy: {
      title: 'Searching Between the Pages',
      description:
        'When searching for a word that does not exist in the dictionary, your search range eventually shrinks down to zero pages. You know with certainty that the word is missing!',
    },
    example: {
      title: 'Simple Not-Found Example (Target = 30)',
      description: 'Array: [5, 11, 18, 23, 37, 45, 62], Target = 30',
      steps: [
        'Step 1: low = 0, high = 6, mid = 3, arr[3] = 23. 30 > 23 -> Search right half (low = 4, high = 6).',
        'Step 2: low = 4, high = 6, mid = 5, arr[5] = 45. 30 < 45 -> Search left half (low = 4, high = 4).',
        'Step 3: low = 4, high = 4, mid = 4, arr[4] = 37. 30 < 37 -> Search left half (low = 4, high = 3).',
        'Search range becomes empty (low > high) -> NOT FOUND (return -1).',
      ],
    },
    visualDiagram: {
      type: 'before-after',
      operationLabel: 'Target = 30 Not Found Trace',
      notes: 'Search stops when low > high.',
      diagramText: `  Array: [5, 11, 18, 23, 37, 45, 62], Target = 30
  
  1. mid = 3 (val 23): 30 > 23 -> Search right half [37, 45, 62]
  2. mid = 5 (val 45): 30 < 45 -> Search left half [37]
  3. mid = 4 (val 37): 30 < 37 -> Search left half []
  
  Search range becomes empty (low: 4 > high: 3)
  Result: NOT FOUND (return -1)`,
    },
    content: `### Example Walkthrough: Target Not Found
Consider searching for **Target = 30** in the array:
\`\`\`text
Array: [5, 11, 18, 23, 37, 45, 62]
Target = 30
\`\`\`

1. **Step 1:** \`arr[3] = 23\`. Since \`30 > 23\`, search right half (\`low = 4, high = 6\`).
2. **Step 2:** \`arr[5] = 45\`. Since \`30 < 45\`, search left half (\`low = 4, high = 4\`).
3. **Step 3:** \`arr[4] = 37\`. Since \`30 < 37\`, search left half (\`low = 4, high = 3\`).

Now \`low (4) > high (3)\`. **Search range becomes empty. NOT FOUND.** Return \`-1\`.`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'Worst Case: O(log n) Full Traversal',
    spaceComplexity: 'O(1) Auxiliary Space',
    keyTakeaway:
      'Search stops when low > high. An empty search range conclusively proves the target is not in the array.',
    interactiveDemoType: 'binary-search',
  },

  // =========================================================================
  // CHAPTER 09: THE BINARY SEARCH ALGORITHM
  // =========================================================================
  {
    id: 9,
    chapterNumber: '09',
    categoryLabel: 'CORE ALGORITHM',
    lessonNumber: 9,
    title: '9. The Binary Search Algorithm',
    shortDesc: 'Review the formal 8-step algorithm that guides all Binary Search implementations.',
    readTime: '2 min read',
    executiveDefinition:
      'The complete Binary Search algorithm structured in 8 concise, unambiguous steps.',
    criticalSpecifications: [
      '1. Set low = 0.',
      '2. Set high = n - 1.',
      '3. Find mid = low + (high - low) / 2.',
      '4. Compare arr[mid] with target.',
      '5. If equal, return the index.',
      '6. If target is smaller, search the left half (high = mid - 1).',
      '7. Otherwise, search the right half (low = mid + 1).',
      '8. Repeat until found or low > high. If not found, return -1.',
    ],
    analogy: {
      title: 'The Algorithmic Recipe',
      description:
        'Like following a precise recipe, executing these 8 steps guarantees you will either find the target index or know with 100% certainty that it is not there.',
    },
    example: {
      title: 'Algorithm Summary',
      description: 'The standard 8-step iterative logic:',
      steps: [
        '1. Set low = 0.',
        '2. Set high = n - 1.',
        '3. Find mid.',
        '4. Compare arr[mid] with target.',
        '5. If equal, return the index.',
        '6. If target is smaller, search the left half.',
        '7. Otherwise, search the right half.',
        '8. Repeat until found or low > high.',
      ],
    },
    visualDiagram: {
      type: 'before-after',
      operationLabel: 'The 8-Step Algorithm Pipeline',
      notes: 'Repeat until found or low > high.',
      diagramText: `  [1. Set low = 0] ──→ [2. Set high = n - 1]
                                ↓
                 ┌──→ < low <= high ? > ─── NO ───→ [ Return -1 (Not Found) ]
                 │          │ YES
                 │          ↓
                 │   [3. Find mid = low + (high - low) / 2]
                 │          ↓
                 │   [4. Compare arr[mid] with target]
                 │          ↓
                 │   < 5. arr[mid] === target ? > ─── YES ──→ [ Return mid (Found) ]
                 │          │ NO
                 │          ↓
                 │   < 6. target < arr[mid] ? >
                 │    /                    \\
                 │  YES                     NO
                 │   ↓                       ↓
                 │ [ high = mid - 1 ]   [7. low = mid + 1 ]
                 └───┴───────────────────────┘`,
    },
    content: `### The 8-Step Binary Search Algorithm
\`\`\`text
1. Set low = 0.
2. Set high = n - 1.
3. Find mid.
4. Compare arr[mid] with target.
5. If equal, return the index.
6. If target is smaller, search the left half.
7. Otherwise, search the right half.
8. Repeat until found or low > high.
\`\`\`

This standard algorithm terminates in at most $\\lfloor\\log_2 n\\rfloor + 1$ iterations.`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'O(log n) Logarithmic Time',
    spaceComplexity: 'O(1) Auxiliary Space',
    keyTakeaway:
      'Repeat until found or low > high. Each iteration eliminates half the remaining elements until the target is found or proven absent.',
    interactiveDemoType: 'binary-search',
  },

  // =========================================================================
  // CHAPTER 10: COMPLEXITY ANALYSIS
  // =========================================================================
  {
    id: 10,
    chapterNumber: '10',
    categoryLabel: 'COMPLEXITY ANALYSIS',
    lessonNumber: 10,
    title: '10. Complexity Analysis',
    shortDesc: 'Understand Time Complexity (Best: O(1), Avg/Worst: O(log n)) and Space Complexity (Iterative: O(1)).',
    readTime: '2 min read',
    executiveDefinition:
      'Binary Search runs in O(log n) time because each comparison removes roughly half of the remaining search space, using O(1) auxiliary memory.',
    criticalSpecifications: [
      'Time Complexity Best Case: O(1) - When target matches arr[mid] on the very first comparison.',
      'Time Complexity Average Case: O(log n) - Halving the array log2(n) times.',
      'Time Complexity Worst Case: O(log n) - When target is at a leaf position or absent.',
      'Space Complexity: Iterative: O(1) - Requires only three pointer variables (low, mid, high).',
      'Each comparison removes roughly half of the remaining search space.',
    ],
    analogy: {
      title: 'Power of Powers of Two',
      description:
        '2^10 is ~1,000. 2^20 is ~1,000,000. 2^30 is ~1,000,000,000. That means Binary Search takes only 30 comparisons to search through ONE BILLION elements!',
    },
    example: {
      title: 'Complexity Comparison',
      description: 'Linear Search O(n) vs Binary Search O(log n):',
      steps: [
        'n = 8: Linear takes 8 steps; Binary takes 3 steps (log2 8 = 3)',
        'n = 1,024: Linear takes 1,024 steps; Binary takes 10 steps',
        'n = 1,048,576: Linear takes ~1M steps; Binary takes only 20 steps!',
      ],
    },
    visualDiagram: {
      type: 'comparison',
      operationLabel: 'Complexity Breakdown & Scaling',
      notes: 'Each comparison removes roughly half of the remaining search space.',
      diagramText: `  ┌─────────────────────────────────────────────────────────────┐
  │                     COMPLEXITY SUMMARY                      │
  ├─────────────────────────────────────────────────────────────┤
  │  Time Complexity:                                           │
  │    • Best Case    : O(1)      (Found on first check)        │
  │    • Average Case : O(log n)  (Repeated halving)            │
  │    • Worst Case   : O(log n)  (Last element or not found)   │
  │                                                             │
  │  Space Complexity:                                          │
  │    • Iterative    : O(1)      (Constant auxiliary memory)   │
  │                                                             │
  │  Each comparison removes roughly half of the search space.  │
  └─────────────────────────────────────────────────────────────┘`,
    },
    content: `### Complexity Analysis
\`\`\`text
Time Complexity
Best Case: O(1)
Average Case: O(log n)
Worst Case: O(log n)

Space Complexity
Iterative: O(1)
\`\`\`

**Why Binary Search is so fast:**
Each comparison removes roughly half of the remaining search space. After $k$ comparisons, the remaining elements are $n / 2^k$. When $n / 2^k = 1$, $k = \\log_2 n$.`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'Best: O(1) | Average: O(log n) | Worst: O(log n)',
    spaceComplexity: 'Iterative: O(1) Auxiliary Space',
    keyTakeaway:
      'Time complexity is O(log n) and iterative space complexity is O(1). Each comparison removes roughly half of the remaining search space.',
    interactiveDemoType: 'binary-search',
  },

  // =========================================================================
  // CHAPTER 11: MULTI-LANGUAGE IMPLEMENTATIONS
  // =========================================================================
  {
    id: 11,
    chapterNumber: '11',
    categoryLabel: 'MULTI-LANGUAGE CODE',
    lessonNumber: 11,
    title: '11. Code Implementations (Python, Java, C++, C)',
    shortDesc: 'Inspect production implementations across Python, Java, C++, and C.',
    readTime: '2 min read',
    executiveDefinition:
      'Standard, beginner-friendly Binary Search implementations maintaining identical logic across Python, Java, C++, and C.',
    criticalSpecifications: [
      'Python: def binary_search(arr, target) using integer floor division //.',
      'Java: static int binarySearch(int[] arr, int target) using (high - low) / 2.',
      'C++: int binarySearch(int arr[], int n, int target).',
      'C: int binarySearch(int arr[], int n, int target).',
    ],
    analogy: {
      title: 'One Algorithm, Multiple Dialects',
      description:
        'Just as the sentence "The book is open" means the same thing in English, Spanish, or French, Binary Search follows the exact same logic in every programming language.',
    },
    example: {
      title: 'Language Feature Highlights',
      description: 'Subtle differences in language syntax:',
      steps: [
        'Python: len(arr), // operator, snake_case',
        'Java: arr.length, static method signature',
        'C & C++: Explicit size parameter n, pointer passing',
      ],
    },
    visualDiagram: {
      type: 'before-after',
      operationLabel: 'Universal Algorithm Blueprint',
      notes: 'Preserves all active language tabs.',
      diagramText: `  Python     │ Java       │ C++        │ C
  ───────────┼────────────┼────────────┼──────────
  //         │ / 2        │ / 2        │ / 2
  low = 0    │ int low=0  │ int low=0  │ int low=0
  low<=high  │ low<=high  │ low<=high  │ low<=high
  return -1  │ return -1  │ return -1  │ return -1`,
    },
    content: `### Multi-Language Code Implementations
Binary Search is universally implemented with the same structure:
1. Initialize \`low = 0\` and \`high = length - 1\`.
2. Loop while \`low <= high\`.
3. Compute \`mid = low + (high - low) / 2\`.
4. Branch on \`arr[mid] == target\`, \`arr[mid] < target\`, or \`arr[mid] > target\`.
5. Return \`-1\` if not found.`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'O(log n) in all 4 languages',
    spaceComplexity: 'O(1) in all 4 languages',
    keyTakeaway:
      'Binary Search logic is identical across Python, Java, C++, and C. Master the concepts once, and you can write it in any language.',
    interactiveDemoType: 'binary-search',
  },

  // =========================================================================
  // CHAPTER 12: MASTER SUMMARY & CHECKPOINT
  // =========================================================================
  {
    id: 12,
    chapterNumber: '12',
    categoryLabel: 'MASTER SUMMARY',
    lessonNumber: 12,
    title: '12. Master Cheat Sheet & Checkpoint',
    shortDesc: 'Review the 10 Golden Rules, key formulas, common pitfalls, and complete mastery checklist.',
    readTime: '2 min read',
    executiveDefinition:
      'A consolidated reference summary of Binary Search rules, checklist items, pitfalls, and core takeaways.',
    criticalSpecifications: [
      '✓ Binary Search works on sorted data.',
      '✓ It checks the middle element.',
      '✓ It eliminates half of the search space.',
      '✓ low and high define the current search range.',
      '✓ mid identifies the middle position.',
      '✓ If target < arr[mid], search left.',
      '✓ If target > arr[mid], search right.',
      '✓ If target = arr[mid], the target is found.',
      '✓ Search stops when low > high.',
      '✓ Time complexity is O(log n).',
    ],
    analogy: {
      title: 'The Aviator\'s Pre-Flight Checklist',
      description:
        'Before you fly or write Binary Search in an interview, run through the checklist: Is data sorted? Is loop condition low <= high? Is mid computed safely? Are pointers updated past mid?',
    },
    example: {
      title: 'Master Checklist Recap',
      description: 'Ten essential checkpoints:',
      steps: [
        '1. Binary Search works on sorted data.',
        '2. It checks the middle element.',
        '3. It eliminates half of the search space.',
        '4. low and high define the current search range.',
        '5. mid identifies the middle position.',
        '6. If target < arr[mid], search left.',
        '7. If target > arr[mid], search right.',
        '8. If target = arr[mid], the target is found.',
        '9. Search stops when low > high.',
        '10. Time complexity is O(log n).',
      ],
    },
    visualDiagram: {
      type: 'before-after',
      operationLabel: 'Binary Search Master Cheat Sheet',
      notes: 'Important: Binary Search requires the data to be sorted.',
      diagramText: `  ╔═══════════════════════════════════════════════════════════════════════╗
  ║                  BINARY SEARCH MASTER CHEAT SHEET                     ║
  ╠═══════════════════════════════════════════════════════════════════════╣
  ║  • Precondition   : Array MUST BE SORTED                             ║
  ║  • Core Strategy  : Divide & Conquer (Eliminate half each step)       ║
  ║  • Key Formula    : mid = low + (high - low) / 2                     ║
  ║  • Loop Invariant : while (low <= high)                              ║
  ║  • Found Match    : arr[mid] == target -> return mid                 ║
  ║  • Search Left    : target < arr[mid]  -> high = mid - 1             ║
  ║  • Search Right   : target > arr[mid]  -> low = mid + 1              ║
  ║  • Not Found      : low > high         -> return -1                  ║
  ║  • Time Complexity: Best: O(1) | Average: O(log n) | Worst: O(log n) ║
  ║  • Space Aux      : Iterative O(1) Constant Space                    ║
  ╚═══════════════════════════════════════════════════════════════════════╝`,
    },
    content: `### Executive Summary & Review
* **Core Idea**: Divide and conquer.
* **Key Formula**: \`mid = low + (high - low) / 2\`
* **Main Challenge**: Keep the search range correct at every step.
* **Important**: Binary Search requires the data to be sorted.
* **Time Complexity**: $O(\\log n)$.
* **Space Complexity**: Iterative $O(1)$.`,
    codeSnippet: BINARY_SEARCH_CODE,
    timeComplexity: 'Best: O(1) | Average: O(log n) | Worst: O(log n)',
    spaceComplexity: 'Iterative: O(1) Auxiliary Space',
    keyTakeaway:
      'Learn how Binary Search finds a target efficiently by repeatedly dividing a sorted search range in half.',
    interactiveDemoType: 'binary-search',
  },
];

export const THEORY_CATEGORIES = [
  {
    id: '01',
    number: '01',
    title: 'BINARY SEARCH',
    shortTitle: 'Binary Search Curriculum',
    description: 'Complete 12-chapter comprehensive curriculum on Binary Search, divide and conquer, pointer boundaries, algorithms, complexities, and implementations.',
    iconName: 'Search',
    badge: '12 Chapters',
    lessons: THEORY_LESSONS,
  },
];
