// Copyright 2024-2025 the @mskr/data-structures authors. All rights reserved. MIT license.

import { EmptyStructureError } from '../errors/index.ts';
import { DoublyLinkedList } from './doubly-linked-list.ts';

/**
 * A generic queue implementation.
 *
 * This class provides a queue data structure that follows the First-In-First-Out (FIFO)
 * principle. It internally uses a DoublyLinkedList for efficient operations.
 *
 * Features:
 * - O(1) enqueue operations
 * - O(1) dequeue operations
 * - FIFO (First-In-First-Out) behavior
 * - Implements Iterable interface for use in for...of loops
 * - Generator-based drain() method for processing and removing all elements
 * - Type-safe implementation using generics
 *
 * @template T The type of elements stored in the queue
 *
 * @example
 * ```typescript
 * const queue = new Queue<number>();
 * queue.enqueue(1);
 * queue.enqueue(2);
 * queue.enqueue(3);
 * console.log(queue.toArray()); // [1, 2, 3]
 * console.log(queue.dequeue()); // 1
 * console.log(queue.peek()); // 2
 * // Iteration (front to back)
 * for (const value of queue) {
 *   console.log(value);
 * }
 * // Drain all elements
 * for (const value of queue.drain()) {
 *   await process(value);
 * }
 * ```
 */
export class Queue<T> implements Iterable<T> {
  /** @ignore */
  private list: DoublyLinkedList<T>;

  /**
   * Creates an empty queue
   */
  constructor() {
    this.list = new DoublyLinkedList<T>();
  }

  /**
   * Returns the number of elements in the queue
   */
  get size(): number {
    return this.list.size;
  }

  /**
   * Checks if the queue is empty
   * @returns {boolean} true if the queue contains no elements
   */
  isEmpty(): boolean {
    return this.list.isEmpty();
  }

  /**
   * Adds an element to the back of the queue
   * @param value The value to add
   */
  enqueue(value: T): void {
    this.list.append(value);
  }

  /**
   * Removes and returns the element at the front of the queue
   * @throws {EmptyStructureError} If the queue is empty
   * @returns The element at the front of the queue
   */
  dequeue(): T {
    if (this.isEmpty()) {
      throw new EmptyStructureError();
    }
    return this.list.removeFirst();
  }

  /**
   * Returns the element at the front of the queue without removing it
   * @throws {EmptyStructureError} If the queue is empty
   * @returns The element at the front of the queue
   */
  peek(): T {
    if (this.isEmpty()) {
      throw new EmptyStructureError();
    }
    return this.list.get(0);
  }

  /**
   * Checks if the queue contains the specified element
   * @param value The value to check for
   * @returns {boolean} true if the element exists in the queue
   */
  contains(value: T): boolean {
    return this.list.contains(value);
  }

  /**
   * Removes all elements from the queue
   */
  clear(): void {
    this.list.clear();
  }

  /**
   * Converts the queue to an array
   * @returns An array containing all elements in the queue (front to back)
   */
  toArray(): T[] {
    return this.list.toArray();
  }

  /**
   * Creates a generator that removes and yields elements from the front of the queue.
   * This is a destructive operation that modifies the queue by removing elements as they are yielded.
   *
   * @yields Elements from the front of the queue until the queue is empty
   *
   * @example
   * ```typescript
   * const queue = new Queue<number>();
   * queue.enqueue(1);
   * queue.enqueue(2);
   * queue.enqueue(3);
   *
   * // Synchronous processing
   * for (const item of queue.drain()) {
   *   console.log(item); // 1, 2, 3
   * }
   * console.log(queue.size); // 0 - queue is now empty
   *
   * // Asynchronous processing
   * for (const item of queue.drain()) {
   *   await process(item);
   * }
   *
   * // Early termination - remaining items stay in queue
   * for (const item of queue.drain()) {
   *   if (item === 2) break;
   * }
   * console.log(queue.size); // 1 - item 3 remains
   * ```
   */
  *drain(): IterableIterator<T> {
    while (!this.isEmpty()) {
      yield this.dequeue();
    }
  }

  /**
   * @ignore
   * Creates an iterator for the queue (front to back)
   */
  [Symbol.iterator](): Iterator<T> {
    return this.list[Symbol.iterator]();
  }
}
