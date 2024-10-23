// Core data structures
export { LinkedList } from './core/linked-list.ts';
// export { DoublyLinkedList } from "./doubly_linked_list.ts";
// export { Queue } from "./queue.ts";
// export { Deque } from "./deque.ts";
// export { PriorityQueue } from "./priority_queue.ts";

// Heap implementations
// export { MinHeap } from "./heap/min_heap.ts";
// export { MaxHeap } from "./heap/max_heap.ts";
// export { type Heap } from "./heap/heap_interface.ts";

// Types and interfaces
export type { Comparable } from './types/index.ts';
export type {
  DoublyLinkedListNode,
  LinkedListNode,
  QueueNode,
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

// Version information
export const VERSION = '1.0.0';

/**
 * @module
 * A comprehensive collection of data structures implemented in TypeScript for Deno.
 *
 * Basic usage:
 * ```ts
 * import { LinkedList, Queue, MinHeap } from "jsr:@msk/data-structures";
 *
 * const list = new LinkedList<number>();
 * list.append(1);
 *
 * const queue = new Queue<string>();
 * queue.enqueue("first");
 *
 * const heap = new MinHeap<number>();
 * heap.insert(5);
 * ```
 */
