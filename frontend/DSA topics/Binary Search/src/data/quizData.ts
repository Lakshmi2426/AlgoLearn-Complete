import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'What condition is required for Binary Search to work correctly?',
    options: [
      'A. The array must be sorted',
      'B. The array must contain only even numbers',
      'C. The array must contain unique values',
      'D. The array must have a fixed size',
    ],
    correctAnswer: 'A. The array must be sorted',
    explanation:
      'Binary Search relies on the ordering of the data so it can eliminate half of the search space after each comparison.',
    hints: [
      'Consider the order of elements needed to know which half to discard.',
      'Without ordered elements, you cannot predict which direction the target lies.',
      'The data elements must be arranged in sorted order.',
    ],
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: 'What is the main idea behind Binary Search?',
    options: [
      'A. Check every element one by one',
      'B. Divide the search space and check the middle',
      'C. Sort the array after every comparison',
      'D. Compare only the first and last elements',
    ],
    correctAnswer: 'B. Divide the search space and check the middle',
    explanation:
      'Binary Search repeatedly checks the middle element and eliminates the half that cannot contain the target.',
    hints: [
      'Think about the divide-and-conquer approach.',
      'Instead of checking sequentially, where do you start comparing in the range?',
      'Check the middle element to divide the search space in half.',
    ],
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: 'Which variables usually represent the current search boundaries?',
    options: [
      'A. start and end',
      'B. push and pop',
      'C. low and high',
      'D. left and bottom',
    ],
    correctAnswer: 'C. low and high',
    explanation:
      '`low` and `high` define the current portion of the sorted array being searched.',
    hints: [
      'These two pointers track the lower and upper bounds of the active search range.',
      'They start at index 0 and index n - 1 respectively.',
      'The standard variable names are low and high.',
    ],
  },
  {
    id: 4,
    type: 'predict-output',
    question:
      'Given the array below, what is the middle element?\n\n[5, 11, 18, 23, 37, 45, 62]',
    options: ['A. 11', 'B. 18', 'C. 23', 'D. 37'],
    correctAnswer: 'C. 23',
    explanation:
      'With indexes 0 through 6, the middle index is 3, so the middle element is 23.',
    hints: [
      'Calculate mid = Math.floor((0 + 6) / 2).',
      'Index 3 is the exact middle index of this 7-element array.',
      'The element located at index 3 is 23.',
    ],
  },
  {
    id: 5,
    type: 'scenario',
    question:
      'If the target is smaller than the middle element, what should Binary Search do?',
    options: [
      'A. Search the right half',
      'B. Search the left half',
      'C. Restart the entire search',
      'D. Sort the array again',
    ],
    correctAnswer: 'B. Search the left half',
    explanation:
      'Because the array is sorted, all elements to the right of the middle are larger, so the search can continue only in the left half.',
    hints: [
      'In a sorted array, where are smaller values located relative to mid?',
      'Smaller values are always to the left of the middle element.',
      'Discard the right half and search the left half by setting high = mid - 1.',
    ],
  },
  {
    id: 6,
    type: 'multiple-choice',
    question:
      'If the target is greater than the middle element, what should happen?',
    options: [
      'A. Move `high` to `mid - 1`',
      'B. Move `low` to `mid + 1`',
      'C. Stop immediately',
      'D. Search from index 0 again',
    ],
    correctAnswer: 'B. Move `low` to `mid + 1`',
    explanation:
      'Since the target is greater than the middle value, the left half can be eliminated and the search continues to the right.',
    hints: [
      'When target > arr[mid], the target must be in the higher indexed portion.',
      'You need to shift the lower boundary past the middle index.',
      'Set low to mid + 1 to narrow the search space to the right.',
    ],
  },
  {
    id: 7,
    type: 'scenario',
    question: 'What happens when `arr[mid] == target`?',
    options: [
      'A. Search the left half',
      'B. Search the right half',
      'C. The target is found',
      'D. The array must be sorted again',
    ],
    correctAnswer: 'C. The target is found',
    explanation:
      'When the middle element equals the target, Binary Search has found the target and can stop.',
    hints: [
      'Check if the comparison condition signifies a match.',
      'No further searching or range reduction is needed once you hit the target.',
      'The target is found and the search terminates successfully, returning mid.',
    ],
  },
  {
    id: 8,
    type: 'multiple-choice',
    question: 'What is the worst-case time complexity of Binary Search?',
    options: ['A. O(1)', 'B. O(n)', 'C. O(log n)', 'D. O(n²)'],
    correctAnswer: 'C. O(log n)',
    explanation:
      'Each comparison removes roughly half of the remaining search space, resulting in logarithmic time.',
    hints: [
      'The search space is cut in half at each iteration: n, n/2, n/4, ...',
      'How many times can you divide n by 2 until you reach 1?',
      'The number of steps is proportional to log2(n), giving O(log n).',
    ],
  },
  {
    id: 9,
    type: 'predict-output',
    question:
      'Consider:\n\nArray = [10, 20, 30, 40, 50, 60, 70]\nTarget = 60\n\nWhat is the first middle value checked?',
    options: ['A. 20', 'B. 30', 'C. 40', 'D. 50'],
    correctAnswer: 'C. 40',
    explanation:
      'The array has indexes 0 through 6. The middle index is 3, and `arr[3] = 40`.\n\nThen:\n60 > 40\n\nso the next search is in the right half.',
    hints: [
      'Determine low = 0 and high = 6.',
      'Calculate mid = Math.floor((0 + 6) / 2) = 3.',
      'arr[3] has the value 40, which is the first middle value inspected.',
    ],
  },
  {
    id: 10,
    type: 'multiple-choice',
    question: 'Which statement about Binary Search is correct?',
    options: [
      'A. It always checks every element',
      'B. It requires sorted data and repeatedly halves the search space',
      'C. It works only with linked lists',
      'D. Its worst-case time complexity is O(n²)',
    ],
    correctAnswer:
      'B. It requires sorted data and repeatedly halves the search space',
    explanation:
      'Binary Search uses sorted data, checks the middle element, and eliminates half of the remaining search space at each step.',
    hints: [
      'Recall the prerequisite condition and the core mechanism.',
      'Linear search checks every element, but binary search does not.',
      'Binary search requires sorted data and repeatedly halves the search space.',
    ],
  },
];
