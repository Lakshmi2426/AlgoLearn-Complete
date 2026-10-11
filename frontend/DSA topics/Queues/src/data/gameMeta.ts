export interface GameMetaData {
  id: number;
  levelNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  tagline: string;
  description: string;
  detailedObjective: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  duration: string;
  xpReward: number;
  skills: string[];
  interactionType: string;
  hintAvailability: string;
  iconName: 'build' | 'predict' | 'speed' | 'debug' | 'trophy' | 'infinity';
  howToPlay: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
  previewData?: {
    stackItems?: string[];
    topPointer?: string;
    operationsTrace?: string[];
    popZoneLabel?: string;
  };
}

export type GameLevelMeta = GameMetaData;

export const GAME_CATALOG: GameMetaData[] = [
  // ==========================================
  // GAME 1 — BASIC: CORE OPERATIONS, BOUNDARIES & INVARIANTS
  // ==========================================
  {
    id: 1,
    levelNumber: 1,
    title: 'Game 1 — Basic: Core Operations, Boundaries & Invariants',
    shortTitle: 'Basic: Core Operations',
    subtitle: 'Insertion Invariants, Extractions, FRONT/REAR Pointers & Boundary Saturation',
    tagline:
      'Master core FIFO operations, boundary pointer tracking, and capacity exception guardrails.',
    description:
      'Analyze initial queue states, evaluate new requests, execute FIFO insertions and removals, locate boundary pointers, and handle full-buffer overflow limits.',
    detailedObjective:
      'Given queue states and arriving requests, independently determine whether to insert or extract elements according to FIFO rules, locate FRONT and REAR pointers, and test overflow exception guardrails when capacity is reached.',
    difficulty: 'Beginner',
    duration: '4–5 min',
    xpReward: 100,
    skills: [
      'FIFO Invariant',
      'REAR Ingestion',
      'FRONT Extraction',
      'Pointer Identification',
      'Capacity Saturation',
    ],
    interactionType: 'Interactive Queue Placement, Dequeue Extraction, Pointer Analysis & Exception Test',
    hintAvailability: '3-stage guided hints available',
    iconName: 'build',
    howToPlay: [
      {
        stepNumber: 1,
        title: 'Evaluate Request & Queue State',
        description: 'Analyze the given initial queue state and problem scenario to determine the required action.',
      },
      {
        stepNumber: 2,
        title: 'Execute Operation independently',
        description: 'Perform the correct FIFO insertion or extraction based on data structure invariants.',
      },
      {
        stepNumber: 3,
        title: 'Track Boundary Pointers',
        description: 'Locate position 0 (FRONT exit head) and the highest index (REAR entrance tail).',
      },
      {
        stepNumber: 4,
        title: 'Verify Boundary Limits',
        description: 'Test overflow guardrails when buffer capacity is reached.',
      },
    ],
    previewData: {
      stackItems: ['[10] (FRONT)', '[20]', '[30]', '[40] (REAR)'],
      topPointer: '10',
      popZoneLabel: 'BASIC FIFO OPERATIONS & POINTER PIPELINE',
    },
  },

  // ==========================================
  // GAME 2 — MODERATE: EXECUTION TRACING & STATE SHIFTS
  // ==========================================
  {
    id: 2,
    levelNumber: 2,
    title: 'Game 2 — Moderate: Execution Tracing & State Shift Prediction',
    shortTitle: 'Moderate: Execution Tracing',
    subtitle: 'Interleaved Transaction Sequences, Multi-Step State Tracking & Underflow Guard',
    tagline:
      'Trace multi-step operation sequences, track pointer shifts, and catch empty-queue exceptions.',
    description:
      'Solve multi-step transactional problems requiring mental state tracking across interleaved enqueues and dequeues, outcome forecasting, and empty-queue underflow defense.',
    detailedObjective:
      'Analyze interleaved operation sequences (ENQUEUE → DEQUEUE → ENQUEUE → DEQUEUE), track state shifts after every transaction, predict remaining elements, and test empty underflow exception guardrails.',
    difficulty: 'Intermediate',
    duration: '5–6 min',
    xpReward: 125,
    skills: [
      'Multi-Step Tracing',
      'Interleaved Sequences',
      'State Shift Tracking',
      'Outcome Forecasting',
      'Queue Underflow Defense',
    ],
    interactionType: 'Multi-Step Sequence Simulation, State Tracking & Underflow Guardrail Verification',
    hintAvailability: '3-stage guided hints available',
    iconName: 'predict',
    howToPlay: [
      {
        stepNumber: 1,
        title: 'Analyze Transaction Sequence',
        description: 'Inspect multi-step interleaved operation logs and track element positions mentally.',
      },
      {
        stepNumber: 2,
        title: 'Execute Interleaved Steps',
        description: 'Perform sequential extractions and insertions as mandated by chronological FIFO sequence.',
      },
      {
        stepNumber: 3,
        title: 'Forecast Final Queue State',
        description: 'Calculate remaining elements inside the queue and identify the final FRONT element.',
      },
      {
        stepNumber: 4,
        title: 'Test Empty Underflow Defense',
        description: 'Verify empty-queue conditions and trigger the Underflow exception guardrail.',
      },
    ],
    previewData: {
      operationsTrace: [
        'ENQUEUE(10) → [10]',
        'ENQUEUE(20) → [10, 20]',
        'DEQUEUE()   → 10 removed, [20] remains',
        'ENQUEUE(30) → [20, 30]',
        'DEQUEUE()   → 20 removed, [30] remains',
      ],
      stackItems: ['[30] (FRONT)'],
      topPointer: '30',
      popZoneLabel: 'MODERATE MULTI-STEP TRACING PIPELINE',
    },
  },

  // ==========================================
  // GAME 3 — DIFFICULT: MULTI-STATION ROUTING & CIRCULAR STREAMING ENGINE
  // ==========================================
  {
    id: 3,
    levelNumber: 3,
    title: 'Game 3 — Difficult: Multi-Station Routing & Circular Streaming Engine',
    shortTitle: 'Difficult: Circular Streaming',
    subtitle: 'Multi-Channel Task Dispatch, Modulo Ring Buffers & Real-Time Packet Engine',
    tagline:
      'Solve complex scenarios with isolated service channels, modulo ring wraparound, and packet buffering.',
    description:
      'Conquer advanced systems engineering challenges: route tasks to specialized multi-queue dispatchers, calculate modulo arithmetic (rear + 1) % MAX for circular ring wraparound, and absorb network packet bursts.',
    detailedObjective:
      'Route requests across dedicated channel queues, calculate circular queue index wraparound using modulo arithmetic to recycle vacant slots, inspect Head-of-Line streaming packets, and transmit payloads in strict arrival order.',
    difficulty: 'Advanced',
    duration: '6–8 min',
    xpReward: 150,
    skills: [
      'Multi-Channel Dispatching',
      'Circular Ring Wraparound',
      'Modulo Arithmetic (rear + 1) % MAX',
      'Network Burst Absorption',
      'Head-of-Line Transmission',
    ],
    interactionType: 'Multi-Queue Routing, Circular Modulo Execution & Real-Time Packet Ingestion Engine',
    hintAvailability: '3-stage guided hints available',
    iconName: 'infinity',
    howToPlay: [
      {
        stepNumber: 1,
        title: 'Route Task Channels',
        description: 'Direct task requests into dedicated service queues with isolated FIFO orderings.',
      },
      {
        stepNumber: 2,
        title: 'Calculate Modulo Wraparound',
        description: 'Use (rear + 1) % MAX to calculate target index and insert items into recycled front slots.',
      },
      {
        stepNumber: 3,
        title: 'Absorb Streaming Bursts',
        description: 'Ingest high-speed network traffic bursts into the FIFO buffer to prevent packet loss.',
      },
      {
        stepNumber: 4,
        title: 'Transmit Head-of-Line Packets',
        description: 'Inspect FRONT packet [0] and transmit frames over the wire link in exact arrival sequence.',
      },
    ],
    previewData: {
      stackItems: ['Ring Buffer: [60 (slot 0), _, 30, 40, 50]', 'Wire Stream: [PKT-100, PKT-101]'],
      topPointer: 'Ring Slot 0: 60 | Wire FRONT: PKT-100',
      popZoneLabel: 'CIRCULAR RING & REAL-TIME STREAMING ENGINE',
    },
  },
];
