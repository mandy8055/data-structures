// Copyright 2024-2025 the @mskr/data-structures authors. All rights reserved. MIT license.

import { EmptyStructureError } from '../errors/index.ts';
import type { Comparable } from '../types/index.ts';
import { compareNumbers, compareStrings } from '../utils/index.ts';

/**
 * Abstract base class for Binary Heap implementations.
 *
 * A Binary Heap is a complete binary tree that satisfies the heap property:
 * - In a max heap, for any given node C, if P is a parent node of C, then the value of P is greater than or equal to the value of C
 * - In a min heap, for any given node C, if P is a parent node of C, then the value of P is less than or equal to the value of C
 *
 * Features:
 * - O(log n) insertions
 * - O(log n) removal of root element
 * - O(1) peek of root element
 * - Maintains heap property after modifications
 * - Type-safe implementation using generics
 * - Support for custom comparators
 * - Implements Iterable interface for use in for...of loops
 *
 * @template T The type of elements stored in the heap
 *
 * @example
 * ```typescript
 * const minHeap = new MinHeap<number>();
 * minHeap.insert(5);
 * minHeap.insert(3);
 * minHeap.insert(7);
 * console.log(minHeap.peek()); // 3
 * console.log(minHeap.remove()); // 3
 * ```
 *
 * @example
 * ```typescript
 * const minHeap = new MinHeap<number>(null, [5, 3, 8, 1]);
 * console.log(minHeap.peek()); // 1
 * console.log(minHeap.size); // 4
 * // Similarly for MaxHeap
 * const maxHeap = new MaxHeap<number>(null, [5, 3, 8, 1]);
 * console.log(maxHeap.peek()); // 8
 * console.log(maxHeap.size); // 4
 * ```
 */
export abstract class BinaryHeap<T> implements Iterable<T> {
  /**
   * @ignore
   * Heap array which stores the elements
   */
  protected heap: T[];
  /**
   * @ignore
   * Custom Comparator that can be passed to Heap
   */
  protected compare: (a: T, b: T) => number;

  /**
   * Creates an empty binary heap
   * @param comparator Optional custom comparison function
   * @param initial Optional array of elements to initialize the heap
   */
  constructor(comparator?: (a: T, b: T) => number, initial?: T[]) {
    this.heap = [];
    this.compare = comparator || this.getDefaultComparator();

    if (initial && initial.length > 0) {
      this.buildHeap(initial);
    }
  }

  /**
   * Returns the number of elements in the heap
   */
  get size(): number {
    return this.heap.length;
  }

  /**
   * Checks if the heap is empty
   * @returns {boolean} true if the heap contains no elements
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Returns the root element without removing it
   * @throws {EmptyStructureError} If the heap is empty
   * @returns The root element in the heap
   */
  peek(): T {
    if (this.isEmpty()) {
      throw new EmptyStructureError();
    }
    return this.heap[0];
  }

  /**
   * Inserts a new element into the heap
   * @param value The value to insert
   */
  insert(value: T): void {
    this.heap.push(value);
    this.siftUp(this.size - 1);
  }

  /**
   * Removes and returns the root element
   * @throws {EmptyStructureError} If the heap is empty
   * @returns The root element in the heap
   */
  remove(): T {
    if (this.isEmpty()) {
      throw new EmptyStructureError();
    }

    const root = this.heap[0];
    const last = this.heap.pop()!;

    if (!this.isEmpty()) {
      this.heap[0] = last;
      this.siftDown(0);
    }

    return root;
  }

  /**
   * Checks if the heap contains the specified element
   * @param value The value to check for
   * @returns {boolean} true if the element exists in the heap
   */
  contains(value: T): boolean {
    return this.heap.some((item) => this.compare(item, value) === 0);
  }

  /**
   * Removes all elements from the heap
   */
  clear(): void {
    this.heap = [];
  }

  /**
   * Converts the heap to an array
   * @returns An array containing all elements in the heap (level-order)
   */
  toArray(): T[] {
    return [...this.heap];
  }

  /**
   * @ignore
   * Creates an iterator for the heap (level-order traversal)
   */
  [Symbol.iterator](): Iterator<T> {
    return this.heap[Symbol.iterator]();
  }

  /**
   * @ignore
   * Gets the default comparator based on the type of the first element
   * @protected
   */
  protected getDefaultComparator(): (a: T, b: T) => number {
    return (a: T, b: T) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return compareNumbers(a, b);
      }
      if (typeof a === 'string' && typeof b === 'string') {
        return compareStrings(a, b);
      }
      if (this.isComparable(a) && this.isComparable(b)) {
        return a.compareTo(b);
      }
      throw new Error('No valid comparison method found for type');
    };
  }

  /**
   * @ignore
   * Type guard to check if an object implements the Comparable interface
   * @protected
   */
  protected isComparable(obj: unknown): obj is Comparable<T> {
    return typeof obj === 'object' && obj !== null && 'compareTo' in obj;
  }

  /**
   * @ignore
   * Gets the parent index for a given child index
   * @protected
   */
  protected getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  /**
   * @ignore
   * Efficiently builds a heap from an initial array in O(n) time
   * @protected
   * @param initial Array of elements to build the heap from
   */
  protected buildHeap(initial: T[]): void {
    this.heap = [...initial];
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.siftDown(i);
    }
  }

  /**
   * @ignore
   * Gets the left child index for a given parent index
   * @protected
   */
  protected getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  /**
   * @ignore
   * Gets the right child index for a given parent index
   * @protected
   */
  protected getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  /**
   * @ignore
   * Moves an element up the heap until heap property is satisfied
   * @protected
   */
  protected abstract siftUp(index: number): void;

  /**
   * @ignore
   * Moves an element down the heap until heap property is satisfied
   * @protected
   */
  protected abstract siftDown(index: number): void;
}

/**
 * MinHeap implementation where the root is always the minimum element.
 *
 * All operations inherited from {@link BinaryHeap} are available.
 *
 * @template T The type of elements stored in the heap
 *
 * @example
 * ```typescript
 * const minHeap = new MinHeap<number>();
 * minHeap.insert(5);
 * minHeap.insert(3);
 * console.log(minHeap.peek()); // 3
 * console.log(minHeap.remove()); // 3
 * console.log(minHeap.size); // 1
 * // Level-order traversal
 * for (const value of minHeap) {
 *  console.log(value);
 * }
 * ```
 */
export class MinHeap<T> extends BinaryHeap<T> {
  /**
   * @ignore
   * Moves an element up in the heap until it is in the correct position
   * to maintain the min heap property (parent is smaller than or equal to children)
   * @protected
   * @param {number} index - The index of the element to sift up
   */
  protected siftUp(index: number): void {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
        [this.heap[index], this.heap[parentIndex]] = [
          this.heap[parentIndex],
          this.heap[index],
        ];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * @ignore
   * Moves an element down in the heap until it is in the correct position
   * to maintain the min heap property (parent is smaller than or equal to children)
   * @protected
   * @param {number} index - The index of the element to sift down
   */
  protected siftDown(index: number): void {
    while (true) {
      let smallest = index;
      const leftChild = this.getLeftChildIndex(index);
      const rightChild = this.getRightChildIndex(index);

      if (
        leftChild < this.size &&
        this.compare(this.heap[leftChild], this.heap[smallest]) < 0
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < this.size &&
        this.compare(this.heap[rightChild], this.heap[smallest]) < 0
      ) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [
          this.heap[smallest],
          this.heap[index],
        ];
        index = smallest;
      } else {
        break;
      }
    }
  }
}

/**
 * MaxHeap implementation where the root is always the maximum element.
 *
 * All operations inherited from {@link BinaryHeap} are available.
 *
 * @template T The type of elements stored in the heap
 *
 * @example
 * ```typescript
 * const maxHeap = new MaxHeap<number>();
 * maxHeap.insert(5);
 * maxHeap.insert(3);
 * console.log(maxHeap.peek()); // 5
 * console.log(maxHeap.remove()); // 5
 * console.log(maxHeap.size); // 1
 * // Level-order traversal
 * for (const value of maxHeap) {
 *  console.log(value);
 * }
 * ```
 */
export class MaxHeap<T> extends BinaryHeap<T> {
  /**
   * @ignore
   * Moves an element up in the heap until it is in the correct position
   * to maintain the max heap property (parent is larger than or equal to children)
   * @protected
   * @param {number} index - The index of the element to sift up
   */
  protected siftUp(index: number): void {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.compare(this.heap[index], this.heap[parentIndex]) > 0) {
        [this.heap[index], this.heap[parentIndex]] = [
          this.heap[parentIndex],
          this.heap[index],
        ];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  /**
   * @ignore
   * Moves an element down in the heap until it is in the correct position
   * to maintain the max heap property (parent is larger than or equal to children)
   * @protected
   * @param {number} index - The index of the element to sift down
   */
  protected siftDown(index: number): void {
    while (true) {
      let largest = index;
      const leftChild = this.getLeftChildIndex(index);
      const rightChild = this.getRightChildIndex(index);

      if (
        leftChild < this.size &&
        this.compare(this.heap[leftChild], this.heap[largest]) > 0
      ) {
        largest = leftChild;
      }

      if (
        rightChild < this.size &&
        this.compare(this.heap[rightChild], this.heap[largest]) > 0
      ) {
        largest = rightChild;
      }

      if (largest !== index) {
        [this.heap[index], this.heap[largest]] = [
          this.heap[largest],
          this.heap[index],
        ];
        index = largest;
      } else {
        break;
      }
    }
  }
}
