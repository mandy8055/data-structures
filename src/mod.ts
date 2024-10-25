/**
 * @module
 * A comprehensive collection of data structures implemented in TypeScript for Deno.
 */

// Core data structures
export { LinkedList } from './core/linked-list.ts';
export { DoublyLinkedList } from './core/doubly-linked-list.ts';
export { Deque } from './core/deque.ts';
export { PriorityQueue } from './core/priority-queue.ts';

// Heap implementations
export { BinaryHeap, MaxHeap, MinHeap } from './core/binary-heap.ts';

// Types and interfaces
export type { Comparable } from './types/index.ts';
export type {
  DoublyLinkedListNode,
  LinkedListNode,
  QueueNode,
  TrieNode,
} from './types/index.ts';

// Optional: Common errors/exceptions
export {
  EmptyStructureError,
  IndexOutOfBoundsError,
  InvalidOperationError,
} from './errors/index.ts';

// Optional: Utility functions
export {
  compareNumbers,
  compareStrings,
  createCustomComparer,
} from './utils/index.ts';

// Optional: Constants
export {
  DEFAULT_CAPACITY,
  GROWTH_FACTOR,
  MAX_ARRAY_SIZE,
} from './constants/index.ts';

/** Version information */
export const VERSION = '1.0.0';
