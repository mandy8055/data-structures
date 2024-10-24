import { EmptyStructureError } from '../errors/index.ts';
import { DoublyLinkedList } from './doubly-linked-list.ts';

/**
 * A generic double-ended queue (Deque) implementation.
 *
 * This class provides a deque data structure that allows insertion and removal
 * of elements from both ends with O(1) time complexity. It internally uses a
 * DoublyLinkedList for efficient operations at both ends.
 *
 * Features:
 * - O(1) insertions at both ends
 * - O(1) removals from both ends
 * - FIFO (First-In-First-Out) when used from one end
 * - LIFO (Last-In-First-Out) when used from one end
 * - Bidirectional operations
 * - Implements Iterable interface for use in for...of loops
 * - Type-safe implementation using generics
 *
 * @template T The type of elements stored in the deque
 *
 * @example
 * ```typescript
 * const deque = new Deque<number>();
 * deque.addFirst(1);
 * deque.addLast(2);
 * deque.addFirst(0);
 * console.log(deque.toArray()); // [0, 1, 2]
 * console.log(deque.removeFirst()); // 0
 * console.log(deque.removeLast()); // 2
 * ```
 */
export class Deque<T> implements Iterable<T> {
  private list: DoublyLinkedList<T>;

  /**
   * Creates an empty deque
   */
  constructor() {
    this.list = new DoublyLinkedList<T>();
  }

  /**
   * Returns the number of elements in the deque
   */
  get size(): number {
    return this.list.size;
  }

  /**
   * Checks if the deque is empty
   * @returns {boolean} true if the deque contains no elements
   */
  isEmpty(): boolean {
    return this.list.isEmpty();
  }

  /**
   * Adds an element to the front of the deque
   * @param value The value to add
   */
  addFirst(value: T): void {
    this.list.prepend(value);
  }

  /**
   * Adds an element to the end of the deque
   * @param value The value to add
   */
  addLast(value: T): void {
    this.list.append(value);
  }

  /**
   * Removes and returns the first element
   * @throws {EmptyStructureError} If the deque is empty
   * @returns The first element in the deque
   */
  removeFirst(): T {
    if (this.isEmpty()) {
      throw new EmptyStructureError();
    }
    return this.list.removeFirst();
  }

  /**
   * Removes and returns the last element
   * @throws {EmptyStructureError} If the deque is empty
   * @returns The last element in the deque
   */
  removeLast(): T {
    if (this.isEmpty()) {
      throw new EmptyStructureError();
    }
    return this.list.removeLast();
  }

  /**
   * Returns the first element without removing it
   * @throws {EmptyStructureError} If the deque is empty
   * @returns The first element in the deque
   */
  peekFirst(): T {
    if (this.isEmpty()) {
      throw new EmptyStructureError();
    }
    return this.list.get(0);
  }

  /**
   * Returns the last element without removing it
   * @throws {EmptyStructureError} If the deque is empty
   * @returns The last element in the deque
   */
  peekLast(): T {
    if (this.isEmpty()) {
      throw new EmptyStructureError();
    }
    return this.list.get(this.size - 1);
  }

  /**
   * Checks if the deque contains the specified element
   * @param value The value to check for
   * @returns {boolean} true if the element exists in the deque
   */
  contains(value: T): boolean {
    return this.list.contains(value);
  }

  /**
   * Removes all elements from the deque
   */
  clear(): void {
    this.list.clear();
  }

  /**
   * Converts the deque to an array
   * @returns An array containing all elements in the deque (front to back)
   */
  toArray(): T[] {
    return this.list.toArray();
  }

  /**
   * Creates a forward iterator for the deque (front to back)
   */
  [Symbol.iterator](): Iterator<T> {
    return this.list[Symbol.iterator]();
  }

  /**
   * Creates a reverse iterator for the deque (back to front)
   * @returns An iterator that traverses the deque from back to front
   */
  reverseIterator(): IterableIterator<T> {
    return this.list.reverseIterator();
  }
}
