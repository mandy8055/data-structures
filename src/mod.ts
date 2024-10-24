/**
 * @module
 * A comprehensive collection of data structures implemented in TypeScript for Deno.
 *
 * Basic usage:
 * ```ts
 * import { LinkedList, DoublyLinkedList, Deque } from "jsr:@msk/data-structures";
 *
 * const list = new LinkedList<number>();
 * list.append(1);
 *
 * const dll = new DoublyLinkedList<number>();
 * // Add elements
 * dll.append(1);
 * dll.append(2);
 * dll.append(3);
 *
 * // Forward traversal
 * console.log('Forward:', [...dll]); // [1, 2, 3]
 *
 * // Reverse traversal
 * console.log('Reverse:', [...dll.reverseIterator()]); // [3, 2, 1]
 *
 * const deque = new Deque<number>();
 * deque.addFirst(1); // [1]
 * deque.addLast(2); // [1, 2]
 * deque.addFirst(0); // [0, 1, 2]
 * console.log([...deque]); // [0, 1, 2]
 * ```
 */

// Core data structures
export { LinkedList } from './core/linked-list.ts';
export { DoublyLinkedList } from './core/doubly-linked-list.ts';
export { Deque } from './core/deque.ts';
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

/** Version information */
export const VERSION = '1.0.0';
