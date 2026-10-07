// Mapping for the 8 Integrated DSA Mini-Website Modules
// (Queue is strictly excluded as per integration requirements)

export interface ModuleRouteConfig {
  moduleId: string;
  folderName: string;
  title: string;
  routeHash: string;
}

export const INTEGRATED_MODULES: Record<string, ModuleRouteConfig> = {
  bfs: {
    moduleId: 'bfs',
    folderName: 'BFS',
    title: 'Breadth First Search (BFS)',
    routeHash: '#/topics/BFS',
  },
  cll: {
    moduleId: 'cll',
    folderName: 'CLL',
    title: 'Circular Linked List (CLL)',
    routeHash: '#/topics/CLL',
  },
  dll: {
    moduleId: 'dll',
    folderName: 'Doubly LL',
    title: 'Doubly Linked List (DLL)',
    routeHash: '#/topics/DLL',
  },
  'dsa-types': {
    moduleId: 'dsa-types',
    folderName: 'dsa types',
    title: 'Data Structure and Types',
    routeHash: '#/topics/dsa-types',
  },
  hashing: {
    moduleId: 'hashing',
    folderName: 'Hashing',
    title: 'Hashing & Collision Resolution',
    routeHash: '#/topics/Hashing',
  },
  'linear-search': {
    moduleId: 'linear-search',
    folderName: 'Linear search',
    title: 'Linear Search',
    routeHash: '#/topics/Linear-search',
  },
  sll: {
    moduleId: 'sll',
    folderName: 'SLL',
    title: 'Singly Linked List (SLL)',
    routeHash: '#/topics/SLL',
  },
  stack: {
    moduleId: 'stack',
    folderName: 'Stack',
    title: 'Stack',
    routeHash: '#/topics/Stack',
  },
};

/**
 * Maps a topic ID or Title to an integrated module configuration if present.
 * Strictly excludes Queue.
 */
export function getIntegratedModuleForTopic(
  topicIdOrTitle: string
): ModuleRouteConfig | null {
  if (!topicIdOrTitle) return null;
  const norm = topicIdOrTitle.toLowerCase().trim();

  // Explicit guard against Queue
  if (norm === 'queue' || norm.includes('circular-queue') || norm.includes('priority-queue')) {
    return null;
  }

  if (norm === 'bfs' || norm === 'breadth-first-search' || norm.includes('breadth')) {
    return INTEGRATED_MODULES.bfs;
  }
  if (norm === 'cll' || norm === 'circular-linked-list' || norm.includes('circular linked')) {
    return INTEGRATED_MODULES.cll;
  }
  if (norm === 'dll' || norm === 'doubly-linked-list' || norm.includes('doubly linked')) {
    return INTEGRATED_MODULES.dll;
  }
  if (
    norm === 'dsa-types' ||
    norm === 'dsa types' ||
    norm === 'data-structures-and-types' ||
    norm.includes('data structure and types')
  ) {
    return INTEGRATED_MODULES['dsa-types'];
  }
  if (norm === 'hashing' || norm.includes('hashing') || norm.includes('collision')) {
    return INTEGRATED_MODULES.hashing;
  }
  if (norm === 'linear-search' || norm === 'linear search' || norm.includes('linear search')) {
    return INTEGRATED_MODULES['linear-search'];
  }
  if (norm === 'sll' || norm === 'singly-linked-list' || norm.includes('singly linked')) {
    return INTEGRATED_MODULES.sll;
  }
  if (norm === 'stack' || norm.includes('stack')) {
    return INTEGRATED_MODULES.stack;
  }

  return null;
}

/**
 * Resolves an active module config from window.location.hash.
 * Supports /#/topics/BFS, #topics/BFS, #/topics/BFS, etc.
 */
export function getModuleFromHash(hash: string): ModuleRouteConfig | null {
  if (!hash) return null;
  let cleanHash = hash.replace(/^[\/#]+/, '').trim();
  if (!cleanHash.toLowerCase().startsWith('topics/')) return null;

  const topicSlug = cleanHash.slice('topics/'.length).trim().toLowerCase();

  // Explicit guard against Queue
  if (topicSlug === 'queue' || topicSlug.startsWith('queue/')) {
    return null;
  }

  if (topicSlug === 'bfs' || topicSlug === 'breadth-first-search') return INTEGRATED_MODULES.bfs;
  if (topicSlug === 'cll' || topicSlug === 'circular-linked-list') return INTEGRATED_MODULES.cll;
  if (topicSlug === 'dll' || topicSlug === 'doubly-linked-list') return INTEGRATED_MODULES.dll;
  if (
    topicSlug === 'dsa-types' ||
    topicSlug === 'dsa types' ||
    topicSlug === 'data-structures-and-types'
  ) {
    return INTEGRATED_MODULES['dsa-types'];
  }
  if (topicSlug === 'hashing' || topicSlug === 'hashing-and-collision-resolution') return INTEGRATED_MODULES.hashing;
  if (topicSlug === 'linear-search' || topicSlug === 'linear search') {
    return INTEGRATED_MODULES['linear-search'];
  }
  if (topicSlug === 'sll' || topicSlug === 'singly-linked-list') return INTEGRATED_MODULES.sll;
  if (topicSlug === 'stack') return INTEGRATED_MODULES.stack;

  return null;
}
