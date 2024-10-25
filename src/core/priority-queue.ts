import { MinHeap } from './binary-heap.ts';

/**
 * A generic priority queue implementation using a binary heap.
 *
 * A Priority Queue is an abstract data type that operates similar to a regular queue
 * but with each element having a priority associated with it. Elements with higher
 * priority are dequeued before elements with lower priority.
 *
 * Features:
 * - O(log n) enqueue operations
 * - O(log n) dequeue operations
 * - O(1) peek operations
 * - Customizable priority comparison
 * - Type-safe implementation using generics
 * - Support for both min and max priority queues
 * - Implements Iterable interface for use in for...of loops
 *
 * @template T The type of elements stored in the queue
 *
 * @example
 * ```typescript
 * // Simple number priority queue (smaller numbers have higher priority)
 * const queue = new PriorityQueue<number>();
 * queue.enqueue(5);
 * queue.enqueue(3);
 * queue.enqueue(7);
 * console.log(queue.dequeue()); // 3
 *
 * // Custom priority queue with objects
 * interface Task {
 *   name: string;
 *   priority: number;
 * }
 * const taskQueue = new PriorityQueue<Task>({
 *   comparator: (a, b) => b.priority - a.priority // Higher priority number = higher priority
 * });
 * ```
 */
export class PriorityQueue<T> implements Iterable<T> {
  private heap: MinHeap<T>;

  /**
   * Creates a new priority queue
   * @param options Configuration options for the priority queue
   */
  constructor(options?: {
    /**
     * Custom comparison function. Default prioritizes smaller values.
     * Return negative if a has higher priority than b,
     * positive if b has higher priority than a,
     * and 0 if they have equal priority.
     */
    comparator?: (a: T, b: T) => number;
    /**
     * Initial values to populate the queue
     */
    initial?: T[];
  }) {
    this.heap = new MinHeap<T>(options?.comparator);

    if (options?.initial) {
      for (const value of options.initial) {
        this.enqueue(value);
      }
    }
  }

  /**
   * Returns the number of elements in the queue
   */
  get size(): number {
    return this.heap.size;
  }

  /**
   * Checks if the queue is empty
   * @returns {boolean} true if the queue contains no elements
   */
  isEmpty(): boolean {
    return this.heap.isEmpty();
  }

  /**
   * Adds an element to the queue
   * @param value The value to add
   */
  enqueue(value: T): void {
    this.heap.insert(value);
  }

  /**
   * Removes and returns the highest priority element
   * @throws {EmptyStructureError} If the queue is empty
   * @returns The highest priority element in the queue
   */
  dequeue(): T {
    return this.heap.remove();
  }

  /**
   * Returns the highest priority element without removing it
   * @throws {EmptyStructureError} If the queue is empty
   * @returns The highest priority element in the queue
   */
  peek(): T {
    return this.heap.peek();
  }

  /**
   * Checks if the queue contains the specified element
   * @param value The value to check for
   * @returns {boolean} true if the element exists in the queue
   */
  contains(value: T): boolean {
    return this.heap.contains(value);
  }

  /**
   * Removes all elements from the queue
   */
  clear(): void {
    this.heap.clear();
  }

  /**
   * Converts the queue to an array
   * @returns An array containing all elements in the queue
   * Note: The array order is based on the internal heap structure,
   * not necessarily in priority order
   */
  toArray(): T[] {
    return this.heap.toArray();
  }

  /**
   * Returns an array of elements in priority order
   * Note: This operation is O(n log n) as it requires removing all elements
   * @returns An array containing all elements sorted by priority
   */
  toSortedArray(): T[] {
    const result: T[] = [];
    const tempHeap = new MinHeap<T>(this.heap['compare']);

    // Copy all elements to a temporary heap
    for (const value of this.heap) {
      tempHeap.insert(value);
    }

    // Remove elements in priority order
    while (!tempHeap.isEmpty()) {
      result.push(tempHeap.remove());
    }

    return result;
  }

  /**
   * Creates an iterator for the queue
   * Note: Iteration order is based on the internal heap structure,
   * not necessarily in priority order
   */
  [Symbol.iterator](): Iterator<T> {
    return this.heap[Symbol.iterator]();
  }
}
