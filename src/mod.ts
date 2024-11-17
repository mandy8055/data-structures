// Copyright 2024-2025 the @mskr/data-structures authors. All rights reserved. MIT license.
/**
 * @module
 * A comprehensive collection of data structures implemented in TypeScript for Deno.
 */

// Core data structures
// LinkedLists
export { LinkedList } from './core/linked-list.ts';
export { DoublyLinkedList } from './core/doubly-linked-list.ts';
// Queues
export { Queue } from './core/queue.ts';
export { Deque } from './core/deque.ts';
export { PriorityQueue } from './core/priority-queue.ts';
// Special Maps and Caches
export { SortedMap } from './core/sorted-map.ts';
export { BiDirectionalMap } from './core/bi-map.ts';
export { LRUCache } from './core/lru-cache.ts';

// Heap implementations
export { BinaryHeap, MaxHeap, MinHeap } from './core/binary-heap.ts';

// Special Trees implementation
export { RedBlackTree } from './core/red-black-tree.ts';
export { Trie } from './core/trie.ts';

// Optional: Common errors/exceptions
export {
  EmptyStructureError,
  IndexOutOfBoundsError,
  InvalidOperationError,
} from './errors/index.ts';

// Optional: Constants
export {
  DEFAULT_CAPACITY,
  GROWTH_FACTOR,
  MAX_ARRAY_SIZE,
} from './constants/index.ts';
