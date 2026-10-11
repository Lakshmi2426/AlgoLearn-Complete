import React, { useEffect } from 'react';
import {
  Lightbulb,
  X,
  Lock,
  Unlock,
  Sparkles,
  Compass,
  KeyRound,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export interface HintStages {
  stage1: string;
  stage2: string;
  stage3: string;
}

export const TOPIC_HINT_STAGES: Record<string, HintStages> = {
  // Tree Basics / Introduction
  basics: {
    stage1: 'Think about how nodes are connected in a tree diagram.',
    stage2: 'Look at the connecting lines between nodes. In graph theory, individual data elements are vertices, and the links connecting them have a standard name.',
    stage3: 'Rule out execution stack frames and array indices. Trees are acyclic hierarchical structures joined by links called edges.'
  },
  'tree-basics': {
    stage1: 'Think about how nodes are connected in a tree diagram.',
    stage2: 'Look at the connecting lines between nodes. In graph theory, individual data elements are vertices, and the links connecting them have a standard name.',
    stage3: 'Rule out execution stack frames and array indices. Trees are acyclic hierarchical structures joined by links called edges.'
  },

  // Tree Terminology
  terminology: {
    stage1: 'Recall how nodes branch downwards from their parent in a hierarchy.',
    stage2: 'Examine node 20 and notice that nodes 40 and 50 branch downwards directly beneath it. Determine whether they represent upstream ancestors or immediate offspring.',
    stage3: 'Ancestors and parents sit above on the path towards the root; nodes positioned immediately below a parent are its children.'
  },
  'tree-terminology': {
    stage1: 'Recall how nodes branch downwards from their parent in a hierarchy.',
    stage2: 'Examine node 20 and notice that nodes 40 and 50 branch downwards directly beneath it. Determine whether they represent upstream ancestors or immediate offspring.',
    stage3: 'Ancestors and parents sit above on the path towards the root; nodes positioned immediately below a parent are its children.'
  },

  // Types of Trees / General Trees
  types: {
    stage1: 'Think about the tree structure that places no restriction on the number of child branches a node can have.',
    stage2: 'Binary tree variations strictly cap child branches at two per node. Identify the overarching, unrestricted tree category.',
    stage3: 'Consider the broad classification describing the most universal form of tree before any branching limitations are applied (General Tree).'
  },
  'types-of-trees': {
    stage1: 'Think about the tree structure that places no restriction on the number of child branches a node can have.',
    stage2: 'Binary tree variations strictly cap child branches at two per node. Identify the overarching, unrestricted tree category.',
    stage3: 'Consider the broad classification describing the most universal form of tree before any branching limitations are applied (General Tree).'
  },
  'general-trees': {
    stage1: 'Think about the tree structure that places no restriction on the number of child branches a node can have.',
    stage2: 'Binary tree variations strictly cap child branches at two per node. Identify the overarching, unrestricted tree category.',
    stage3: 'Consider the broad classification describing the most universal form of tree before any branching limitations are applied (General Tree).'
  },

  // Binary Trees / Leaf nodes
  'binary-tree': {
    stage1: 'Remember the botanical definition of a leaf node at the terminal boundary of a branch.',
    stage2: 'Trace through each node in the tree and check its outgoing degree: leaf nodes have exactly zero child nodes attached below them.',
    stage3: 'Node 10 branches to 5 and 15; node 5 branches to 2 and 7. Nodes that have children cannot be leaves; look for nodes with 0 children.'
  },
  'binary-tree-basics': {
    stage1: 'Remember the botanical definition of a leaf node at the terminal boundary of a branch.',
    stage2: 'Trace through each node in the tree and check its outgoing degree: leaf nodes have exactly zero child nodes attached below them.',
    stage3: 'Node 10 branches to 5 and 15; node 5 branches to 2 and 7. Nodes that have children cannot be leaves; look for nodes with 0 children.'
  },

  // Binary Search Trees (BST)
  bst: {
    stage1: 'Recall the BST ordering rule that governs node placement relative to the parent.',
    stage2: 'Compare the candidate value 7 directly against root node 10. Does a smaller numerical value branch left or right in a BST?',
    stage3: 'In a Binary Search Tree, all values smaller than a node belong in its left subtree, while larger values go to the right.'
  },
  'binary-search-trees': {
    stage1: 'Recall the BST ordering rule that governs node placement relative to the parent.',
    stage2: 'Compare the candidate value 7 directly against root node 10. Does a smaller numerical value branch left or right in a BST?',
    stage3: 'In a Binary Search Tree, all values smaller than a node belong in its left subtree, while larger values go to the right.'
  },

  // Tree Traversals
  traversals: {
    stage1: 'Think about the meaning of the Latin prefix "Pre-" and how it relates to visiting the root node.',
    stage2: 'Traversal names specify when the Root is visited relative to its children: Preorder, Inorder, or Postorder.',
    stage3: 'Preorder visits the Root before any child branch (Root → Left → Right), whereas Inorder visits Root in between and Postorder visits Root after.'
  },
  'tree-traversal': {
    stage1: 'Think about the meaning of the Latin prefix "Pre-" and how it relates to visiting the root node.',
    stage2: 'Traversal names specify when the Root is visited relative to its children: Preorder, Inorder, or Postorder.',
    stage3: 'Preorder visits the Root before any child branch (Root → Left → Right), whereas Inorder visits Root in between and Postorder visits Root after.'
  },

  // Tree Applications
  applications: {
    stage1: 'Think about how nested HTML tags create a hierarchy in web development.',
    stage2: 'Web browsers parse nested tags into a standard hierarchical tree of document elements.',
    stage3: 'The browser\'s Document Object Model (DOM) is structured as a hierarchical tree of parent and child nodes.'
  },
  'tree-applications': {
    stage1: 'Think about how nested HTML tags create a hierarchy in web development.',
    stage2: 'Web browsers parse nested tags into a standard hierarchical tree of document elements.',
    stage3: 'The browser\'s Document Object Model (DOM) is structured as a hierarchical tree of parent and child nodes.'
  }
};

export const QUIZ_HINT_STAGES: Record<string, HintStages> = {
  q1: {
    stage1: 'Consider the mathematical relationship between the number of nodes (N) and the number of connecting branches (edges) in any valid, loop-free tree.',
    stage2: 'Start with small examples: a 1-node tree has 0 edges, a 2-node tree has 1 edge, and a 3-node tree has 2 edges. Notice the fixed difference.',
    stage3: 'Every additional node attached to a tree introduces exactly one new connecting edge. Use the universal tree rule: Number of Edges = N - 1.'
  },
  q2: {
    stage1: 'Recall that every tree is a graph, but trees must obey strict structural constraints regarding hierarchy and connectivity.',
    stage2: 'Think about whether you can loop back to a previously visited node through an alternate path in a valid tree hierarchy.',
    stage3: 'A tree is defined as an acyclic, connected graph with a single root; unlike general graphs, it can never contain closed cycles or loops.'
  },
  q3: {
    stage1: 'Picture the botanical metaphor of a tree: what defines the nodes at the very ends of the branches?',
    stage2: 'Leaf nodes are also called terminal or external nodes because they terminate paths in the hierarchy.',
    stage3: 'Because no further branches extend beneath a leaf node, its total count of children (out-degree) is strictly 0.'
  },
  q4: {
    stage1: 'Recall how Depth is defined: it measures the number of edge steps on the path from the root down to a target node.',
    stage2: 'Ask yourself how many edge hops are needed to travel from the root node to the root node itself.',
    stage3: 'Since the root is the origin of the entire tree, the distance in edges from the root to itself is zero.'
  },
  q5: {
    stage1: 'Look closely at the Latin prefix "Bi-" in "Binary" (like bicycle or binoculars).',
    stage2: 'Nodes in a binary tree do not require children, but there is a strict upper limit on how many child branches can emerge from any single node.',
    stage3: 'By definition, a binary tree restricts the branching factor so that every node can have 0, 1, or at most 2 children.'
  },
  q6: {
    stage1: 'Think about spatial positioning when drawing or visualizing a branching binary hierarchy on paper or a screen.',
    stage2: 'Consider standard traversal orders and computer science terminology that reference child branches by horizontal direction.',
    stage3: 'Because the two branches split horizontally beneath a parent, they are conventionally designated the Left Child and Right Child.'
  },
  q7: {
    stage1: 'Recall the core ordering invariant that allows Binary Search Trees to perform rapid search and retrieval operations.',
    stage2: 'Think of a standard number line: smaller numbers are positioned toward one direction, and larger numbers toward the opposite direction.',
    stage3: 'In a BST, every key value that is strictly less than the parent node is routed into its Left subtree.'
  },
  q8: {
    stage1: 'To list elements in ascending order, you must visit smaller values first, then the root value, then larger values.',
    stage2: 'In a BST, all smaller elements reside in the left subtree, and all larger elements reside in the right subtree. Which traversal pattern follows: Left → Root → Right?',
    stage3: 'The traversal that processes the root "in between" its left and right subtrees (Inorder) naturally retrieves BST elements in sorted order.'
  },
  q9: {
    stage1: 'Analyze the Latin prefixes of traversal methods: Pre- (before), In- (between), and Post- (after).',
    stage2: 'Observe when the Root is processed in the pattern: the Root node is evaluated before visiting any of its child branches.',
    stage3: 'Because the Root is visited before (pre-) traversing the left and right subtrees, this sequence is named Preorder.'
  },
  q10: {
    stage1: 'Reflect on how web pages are structured: HTML tags enclose inner elements, forming parent-child hierarchies.',
    stage2: 'Consider the standard web API and acronym used by JavaScript to manipulate page elements (e.g., document.querySelector).',
    stage3: 'Browsers convert the nested hierarchy of HTML markup into the Document Object Model (DOM) Tree.'
  },
  q5_2: {
    stage1: 'Think about trees before any restrictions on branching are introduced.',
    stage2: 'Binary trees restrict branching to 2 children. General trees have no such constraint.',
    stage3: 'The General Tree is the universal classification where a node may have 0, 1, 2, 3, 4, or any number of children.'
  },
  q6_2: {
    stage1: 'Consider what the modifier "Strictly" or "Full" implies about child node counts.',
    stage2: 'In this binary tree type, no node is allowed to have an odd child count of exactly 1.',
    stage3: 'A Full or Strictly Binary Tree requires every node to have either 0 children (leaf) or exactly 2 children.'
  },
  q7_2: {
    stage1: 'Recall how Binary Search operates: dividing the remaining search space by half with every comparison.',
    stage2: 'When the height of a balanced tree with N nodes is proportional to log2(N), traversal from root to leaf takes logarithmic steps.',
    stage3: 'A balanced BST eliminates half the tree at each node comparison, yielding an average time complexity of O(log N).'
  },
  q10_2: {
    stage1: 'Think of how computer hard drives and storage systems nest folders inside other folders starting from root.',
    stage2: 'Each directory can hold files (terminal nodes) or further directories (branching nodes) originating from a single root drive.',
    stage3: 'Operating systems organize storage as a Hierarchical File System Tree.'
  }
};

export const QUIZ_GUIDED_SOLVE: Record<string, { steps: { title: string; explanation: string }[]; answer: string }> = {
  q1: {
    steps: [
      { title: 'Tree Axiom', explanation: 'A tree is a connected acyclic graph with N nodes.' },
      { title: 'Edge Count Invariant', explanation: 'Each node except the root is connected by exactly one incoming edge from its parent.' },
      { title: 'Calculation', explanation: 'Total edges = N - 1. For 10 nodes, total edges = 10 - 1 = 9 edges.' }
    ],
    answer: '9 edges'
  },
  q2: {
    steps: [
      { title: 'Graph vs Tree', explanation: 'Graphs may have multiple paths between vertices and closed circuits.' },
      { title: 'Acyclic Property', explanation: 'A tree must be acyclic (no cycles) and have a single designated root.' },
      { title: 'Conclusion', explanation: 'A tree is hierarchical and cannot contain any closed cycles or loops.' }
    ],
    answer: 'A tree is hierarchical and cannot contain any closed cycles or loops'
  },
  q3: {
    steps: [
      { title: 'Leaf Definition', explanation: 'A leaf node is an external node at the perimeter of the tree hierarchy.' },
      { title: 'Branching Degree', explanation: 'Because no edges branch downward beneath a leaf, its child count is 0.' }
    ],
    answer: 'It has exactly 0 children'
  },
  q4: {
    steps: [
      { title: 'Depth Metric', explanation: 'Depth measures the edge count along the simple path from root to target.' },
      { title: 'Root Distance', explanation: 'The root is 0 edge hops away from itself.' }
    ],
    answer: '0'
  },
  q5: {
    steps: [
      { title: 'Binary Definition', explanation: 'Binary indicates base-2 branching.' },
      { title: 'Child Limit', explanation: 'Each node may have 0, 1, or 2 children (Left and Right).' }
    ],
    answer: 'At most 2 children'
  },
  q5_2: {
    steps: [
      { title: 'Tree Taxonomies', explanation: 'Binary and BST trees enforce a maximum degree of 2.' },
      { title: 'Unrestricted Branching', explanation: 'A General Tree allows arbitrary child branching without limits.' }
    ],
    answer: 'General Tree'
  },
  q6: {
    steps: [
      { title: 'Directional Convention', explanation: 'Binary trees branch in two directions beneath each parent.' },
      { title: 'Standard Terminology', explanation: 'The two children are designated Left Child and Right Child.' }
    ],
    answer: 'Left Child and Right Child'
  },
  q6_2: {
    steps: [
      { title: 'Strictly Binary Property', explanation: 'Full / Strictly binary trees forbid single-child internal nodes.' },
      { title: 'Degree Constraint', explanation: 'Every non-leaf node must have exactly 2 children.' }
    ],
    answer: 'Strictly 2 children (no node has only 1 child)'
  },
  q7: {
    steps: [
      { title: 'BST Invariant', explanation: 'Binary Search Trees enforce left-to-right numerical order.' },
      { title: 'Smaller Values', explanation: 'All elements smaller than the current node must be placed in the Left subtree.' }
    ],
    answer: 'In the Left subtree'
  },
  q7_2: {
    steps: [
      { title: 'Halving Search Space', explanation: 'At every comparison in a balanced BST, half of the remaining subtrees are discarded.' },
      { title: 'Logarithmic Work', explanation: 'Traversing height h = log2(N) gives average time complexity O(log N).' }
    ],
    answer: 'O(log N)'
  },
  q8: {
    steps: [
      { title: 'BST Traversal Comparison', explanation: 'Left contains smaller elements, Root contains middle value, Right contains larger elements.' },
      { title: 'Inorder Sequence', explanation: 'Left → Root → Right visits smaller, current, then larger in sorted ascending order.' }
    ],
    answer: 'Inorder'
  },
  q9: {
    steps: [
      { title: 'Root Position', explanation: 'Preorder visits the Root before either of its child branches.' },
      { title: 'Sequence', explanation: 'Preorder sequence: Root → Left → Right.' }
    ],
    answer: 'Preorder'
  },
  q10: {
    steps: [
      { title: 'Document Model', explanation: 'HTML tags wrap inside each other, creating parent-child element relations.' },
      { title: 'DOM Tree', explanation: 'Browsers model this hierarchy as a Document Object Model (DOM) Tree.' }
    ],
    answer: 'As a Document Object Model (DOM) Tree'
  },
  q10_2: {
    steps: [
      { title: 'Folder Structure', explanation: 'Folders branch into subfolders and files starting from the root directory.' },
      { title: 'Hierarchy', explanation: 'Operating systems structure this as a Hierarchical File System Tree.' }
    ],
    answer: 'As a Hierarchical File System Tree'
  }
};

export const getContextualHints = (
  topicId: string,
  question?: string,
  existingHint?: string,
  questionId?: string
): HintStages => {
  const normQId = (questionId || '').toLowerCase().trim();
  if (QUIZ_HINT_STAGES[normQId]) {
    return QUIZ_HINT_STAGES[normQId];
  }

  const normId = (topicId || '').toLowerCase().trim();
  if (QUIZ_HINT_STAGES[normId]) {
    return QUIZ_HINT_STAGES[normId];
  }
  if (TOPIC_HINT_STAGES[normId]) {
    return TOPIC_HINT_STAGES[normId];
  }

  // Keyword detection from question
  if (question) {
    const qLower = question.toLowerCase();
    if (qLower.includes('how many edges') && qLower.includes('nodes')) {
      return QUIZ_HINT_STAGES['q1'];
    }
    if (qLower.includes('distinguishes a tree from a general graph') || (qLower.includes('graph') && qLower.includes('cycle'))) {
      return QUIZ_HINT_STAGES['q2'];
    }
    if (qLower.includes('true about a leaf node') || (qLower.includes('leaf') && qLower.includes('children'))) {
      return QUIZ_HINT_STAGES['q3'];
    }
    if (qLower.includes('depth of the root') || qLower.includes('depth(root)')) {
      return QUIZ_HINT_STAGES['q4'];
    }
    if (qLower.includes('binary tree') && qLower.includes('at most')) {
      return QUIZ_HINT_STAGES['q5'];
    }
    if (qLower.includes('two children traditionally called')) {
      return QUIZ_HINT_STAGES['q6'];
    }
    if (qLower.includes('smaller than the current node')) {
      return QUIZ_HINT_STAGES['q7'];
    }
    if (qLower.includes('ascending sorted order')) {
      return QUIZ_HINT_STAGES['q8'];
    }
    if (qLower.includes('root node first') || qLower.includes('root → left → right')) {
      return QUIZ_HINT_STAGES['q9'];
    }
    if (qLower.includes('html document elements') || qLower.includes('dom')) {
      return QUIZ_HINT_STAGES['q10'];
    }

    if (qLower.includes('connect') && (qLower.includes('node') || qLower.includes('two nodes'))) {
      return TOPIC_HINT_STAGES['basics'];
    }
    if (qLower.includes('children') || qLower.includes('parent') || qLower.includes('node 20') || qLower.includes('node 40')) {
      return TOPIC_HINT_STAGES['terminology'];
    }
    if (qLower.includes('bst') || qLower.includes('binary search tree') || qLower.includes('candidate node 7')) {
      return TOPIC_HINT_STAGES['bst'];
    }
    if (qLower.includes('leaf') || qLower.includes('leaves') || qLower.includes('which nodes are leaves')) {
      return TOPIC_HINT_STAGES['binary-tree'];
    }
    if (qLower.includes('traversal') || qLower.includes('preorder') || qLower.includes('inorder') || qLower.includes('postorder')) {
      return TOPIC_HINT_STAGES['traversals'];
    }
    if (qLower.includes('dom') || qLower.includes('browser') || qLower.includes('html')) {
      return TOPIC_HINT_STAGES['applications'];
    }
    if (qLower.includes('any number') || qLower.includes('no limit') || qLower.includes('general tree')) {
      return TOPIC_HINT_STAGES['types'];
    }
  }

  return {
    stage1: existingHint || 'Think carefully about the foundational hierarchical tree rules governing this problem.',
    stage2: question
      ? `Analyze "${question.slice(0, 75)}..." by breaking down its core constraints and eliminating choices that violate tree rules.`
      : 'Analyze the relationships between parent nodes and their children step-by-step.',
    stage3: 'Compare each remaining choice against the exact structural properties of this problem to identify the correct approach.'
  };
};

interface ProgressiveHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  topicId?: string;
  topicTitle?: string;
  question?: string;
  questionId?: string;
  existingHint?: string;
  revealedStage: number;
  onRevealNextStage: () => void;
  customHints?: HintStages;
  returnButtonText?: string;
  initialMode?: 'hint' | 'guidedSolve';
  onHintUsed?: () => void;
  onGuidedSolveUsed?: () => void;
}

export const ProgressiveHintModal: React.FC<ProgressiveHintModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  topicId,
  topicTitle,
  question,
  questionId,
  existingHint,
  revealedStage,
  onRevealNextStage,
  customHints,
  returnButtonText = 'Got It, Return to Challenge',
  initialMode = 'hint',
  onHintUsed,
  onGuidedSolveUsed,
}) => {
  const [modalMode, setModalMode] = React.useState<'hint' | 'guidedSolve'>(initialMode);

  React.useEffect(() => {
    setModalMode(initialMode);
  }, [initialMode, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      if (modalMode === 'hint' && onHintUsed) {
        onHintUsed();
      } else if (modalMode === 'guidedSolve' && onGuidedSolveUsed) {
        onGuidedSolveUsed();
      }
    }
  }, [isOpen, modalMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hints = customHints || getContextualHints(topicId || '', question, existingHint, questionId);
  const guided = questionId ? QUIZ_GUIDED_SOLVE[questionId] : undefined;

  return (
    <div
      id="progressive-hint-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 bg-black/65 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="progressive-hint-modal-card"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-3xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all transform animate-in zoom-in-95 duration-150 ${
          isDarkMode
            ? 'bg-[#0e1424] border-violet-900/50 text-slate-100 shadow-violet-950/60'
            : 'bg-white border-blue-100 text-black shadow-xl'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 sm:p-6 pb-3 border-b flex items-start justify-between gap-3 ${
            isDarkMode ? 'border-violet-950/60 bg-[#12192d]/70' : 'border-blue-100 bg-blue-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-2xl border shrink-0 ${
                modalMode === 'hint'
                  ? isDarkMode
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-amber-50 border-amber-200 text-amber-600'
                  : isDarkMode
                  ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-600'
              }`}
            >
              {modalMode === 'hint' ? (
                <Lightbulb className="w-5 h-5 text-amber-400" />
              ) : (
                <Compass className="w-5 h-5 text-violet-400" />
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                {modalMode === 'hint' ? 'Progressive Hint System' : 'Step-by-Step Guided Solve'}
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  isDarkMode ? 'text-violet-300/70' : 'text-blue-800'
                }`}
              >
                {modalMode === 'hint'
                  ? '3-stage hints · Deduces 5 points on current question'
                  : 'Complete walkthrough · Deduces 15 points on current question'}
              </p>
            </div>
          </div>

          <button
            id="close-hint-modal-btn"
            onClick={onClose}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              isDarkMode
                ? 'bg-[#182138] border-violet-950 hover:bg-[#202b48] text-slate-400 hover:text-white'
                : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800 hover:text-black'
            }`}
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers: Hint vs Guided Solve */}
        <div className={`flex border-b text-xs font-bold ${isDarkMode ? 'border-violet-950/40 bg-[#090d18]' : 'border-blue-100 bg-slate-50'}`}>
          <button
            onClick={() => {
              setModalMode('hint');
              if (onHintUsed) onHintUsed();
            }}
            className={`flex-1 py-2.5 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer border-b-2 ${
              modalMode === 'hint'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Hint (-5 pts)</span>
          </button>
          <button
            onClick={() => {
              setModalMode('guidedSolve');
              if (onGuidedSolveUsed) onGuidedSolveUsed();
            }}
            className={`flex-1 py-2.5 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer border-b-2 ${
              modalMode === 'guidedSolve'
                ? 'border-violet-500 text-violet-400 bg-violet-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-violet-400" />
            <span>Guided Solve (-15 pts)</span>
          </button>
        </div>

        {/* Question context chip & Point Deduction Warning Banner */}
        <div
          className={`px-5 sm:px-6 py-2.5 border-b text-[11px] sm:text-xs space-y-1 ${
            isDarkMode
              ? 'bg-[#090d17] border-violet-950/40 text-violet-300/80'
              : 'bg-blue-50/50 border-blue-100 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-[10px] shrink-0 opacity-70">
              Question:
            </span>
            <span className="truncate opacity-90 font-medium">{question}</span>
          </div>
          <div className="text-[10px] font-semibold text-rose-400 flex items-center gap-1.5">
            <span>⚠️ Point Deduction Active:</span>
            <span>{modalMode === 'hint' ? '5 points will be deducted for using this hint.' : '15 points will be deducted for using guided solve.'}</span>
          </div>
        </div>

        {/* Body */}
        {modalMode === 'hint' ? (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-4">
            {/* STAGE 1 */}
            <div
              id="hint-stage-1-card"
              className={`p-4 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-violet-950/25 border-violet-800/40 text-violet-100'
                  : 'bg-violet-50/70 border-violet-200 text-violet-950'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <h4 className="text-xs font-bold tracking-wide">
                    Stage 1: Concept Reminder
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isDarkMode
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  Available
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-95">
                {hints.stage1}
              </p>
            </div>

            {/* STAGE 2 */}
            <div
              id="hint-stage-2-card"
              className={`p-4 rounded-2xl border transition-all ${
                revealedStage >= 2
                  ? isDarkMode
                    ? 'bg-purple-950/25 border-purple-800/40 text-purple-100'
                    : 'bg-purple-50/70 border-purple-200 text-purple-950'
                  : isDarkMode
                  ? 'bg-[#121829]/60 border-violet-950/40 text-slate-400'
                  : 'bg-blue-50/30 border-blue-100 text-blue-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {revealedStage >= 2 ? (
                    <Compass className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Lock className="w-4 h-4 opacity-50" />
                  )}
                  <h4 className="text-xs font-bold tracking-wide">
                    Stage 2: Directional Guidance
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    revealedStage >= 2
                      ? isDarkMode
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                      : isDarkMode
                      ? 'bg-slate-800/60 text-slate-400 border border-slate-700/40'
                      : 'bg-blue-100 text-blue-900'
                  }`}
                >
                  {revealedStage >= 2 ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              {revealedStage >= 2 ? (
                <p className="text-xs leading-relaxed opacity-95">
                  {hints.stage2}
                </p>
              ) : (
                <div className="flex items-center gap-2 text-xs py-1 opacity-70">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Click &ldquo;Reveal Next Hint&rdquo; below to unlock directional guidance for this challenge.</span>
                </div>
              )}
            </div>

            {/* STAGE 3 */}
            <div
              id="hint-stage-3-card"
              className={`p-4 rounded-2xl border transition-all ${
                revealedStage >= 3
                  ? isDarkMode
                    ? 'bg-fuchsia-950/25 border-fuchsia-800/40 text-fuchsia-100'
                    : 'bg-fuchsia-50/70 border-fuchsia-200 text-fuchsia-950'
                  : isDarkMode
                  ? 'bg-[#121829]/60 border-violet-950/40 text-slate-400'
                  : 'bg-blue-50/30 border-blue-100 text-blue-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {revealedStage >= 3 ? (
                    <KeyRound className="w-4 h-4 text-fuchsia-400" />
                  ) : (
                    <Lock className="w-4 h-4 opacity-50" />
                  )}
                  <h4 className="text-xs font-bold tracking-wide">
                    Stage 3: Direct Solution Clue
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    revealedStage >= 3
                      ? isDarkMode
                        ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'
                        : 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200'
                      : isDarkMode
                      ? 'bg-slate-800/60 text-slate-400 border border-slate-700/40'
                      : 'bg-blue-100 text-blue-900'
                  }`}
                >
                  {revealedStage >= 3 ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              {revealedStage >= 3 ? (
                <p className="text-xs leading-relaxed opacity-95">
                  {hints.stage3}
                </p>
              ) : (
                <div className="flex items-center gap-2 text-xs py-1 opacity-70">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Click &ldquo;Reveal Next Hint&rdquo; to unlock the strongest clue without spoiling the final answer.</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            {guided ? (
              <div className="space-y-3.5">
                <div className="text-xs text-slate-300">
                  Follow this step-by-step reasoning to reach the correct answer:
                </div>
                {guided.steps.map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className={`p-3.5 rounded-2xl border ${
                      isDarkMode ? 'bg-[#12192e] border-violet-900/40' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold">
                        {sIdx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-violet-300">{st.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 pl-7">{st.explanation}</p>
                  </div>
                ))}
                <div className={`p-4 rounded-2xl border font-semibold text-xs ${
                  isDarkMode ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                }`}>
                  <span className="font-bold uppercase tracking-wider block mb-1">Conclusion:</span>
                  <div>Correct Choice: <strong className="text-emerald-400 underline">{guided.answer}</strong></div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border text-xs text-slate-300">
                Guided solve steps: Break down the question constraints, eliminate choices that contradict tree axioms, and identify the structurally sound answer.
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          className={`p-5 sm:p-6 pt-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
            isDarkMode ? 'border-violet-950/60 bg-[#10162a]/70' : 'border-blue-100 bg-blue-50/50'
          }`}
        >
          {/* Status counter & progress pills */}
          {modalMode === 'hint' ? (
            <div className="flex items-center justify-between sm:justify-start gap-2.5">
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? 'text-violet-200' : 'text-blue-950'
                }`}
              >
                Revealed {revealedStage} of 3 hints
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 rounded-full transition-all ${
                      revealedStage >= step
                        ? 'w-4 bg-violet-500'
                        : isDarkMode
                        ? 'w-2 bg-slate-800'
                        : 'w-2 bg-blue-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs font-semibold text-violet-300">
              Guided Solution Completed (-15 pts applied)
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {modalMode === 'hint' && revealedStage < 3 && (
              <button
                id="reveal-next-hint-btn"
                onClick={onRevealNextStage}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                  isDarkMode
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-950/50'
                    : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-200'
                }`}
              >
                <span>Reveal Next Hint ({revealedStage + 1}/3) →</span>
              </button>
            )}

            <button
              id="return-to-game-btn"
              onClick={onClose}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-[#141b2f] hover:bg-[#1c2642] border-violet-950/80 text-slate-200'
                  : 'bg-white hover:bg-blue-50 border-blue-200 text-blue-950 shadow-sm'
              }`}
            >
              {returnButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
