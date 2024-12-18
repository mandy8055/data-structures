// Copyright 2024-2025 the @mskr/data-structures authors. All rights reserved. MIT license.

import { EmptyStructureError, IndexOutOfBoundsError } from '../errors/index.ts';
import type { LinkedListNode } from '../types/index.ts';

/**
 * A generic singly linked list implementation.
 *
 * This class provides a standard linked list data structure with operations for adding,
 * removing, and accessing elements. The list maintains both head and tail pointers
 * for efficient operations at both ends of the list.
 *
 * Features:
 * - O(1) insertions at the beginning and end
 * - O(n) access to arbitrary elements
 * - Implements Iterable interface for use in for...of loops
 * - Type-safe implementation using generics
 *
 * @template T The type of elements stored in the linked list
 *
 * @example
 * ```typescript
 * const list = new LinkedList<number>();
 * list.append(1);
 * list.append(2);
 * list.prepend(0);
 * console.log(list.toArray()); // [0, 1, 2]
 * ```
 */
export class LinkedList<T> {
  /** @ignore */
  private head: LinkedListNode<T> | null = null;
  /** @ignore */
  private tail: LinkedListNode<T> | null = null;
  /** @ignore */
  private count = 0;

  /**
   * @ignore
   * Creates a new node with the given value
   */
  private createNode(value: T): LinkedListNode<T> {
    return { value, next: null };
  }

  /**
   * Returns the number of elements in the list
   */
  get size(): number {
    return this.count;
  }

  /**
   * Checks if the list is empty
   */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Adds a new element to the end of the list
   */
  append(value: T): void {
    const newNode = this.createNode(value);

    if (!this.head) {
      this.head = newNode;
    } else {
      this.tail!.next = newNode;
    }
    this.tail = newNode;
    this.count++;
  }

  /**
   * Adds a new element to the beginning of the list
   */
  prepend(value: T): void {
    const newNode = this.createNode(value);

    if (!this.head) {
      this.tail = newNode;
    } else {
      newNode.next = this.head;
    }
    this.head = newNode;

    this.count++;
  }

  /**
   * Inserts an element at the specified position
   * @throws {IndexOutOfBoundsError} If index is out of bounds
   */
  insertAt(value: T, index: number): void {
    if (index < 0 || index > this.count) {
      throw new IndexOutOfBoundsError();
    }

    if (index === 0) {
      this.prepend(value);
      return;
    }

    if (index === this.count) {
      this.append(value);
      return;
    }

    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current!.next;
    }

    const newNode = this.createNode(value);
    newNode.next = current!.next;
    current!.next = newNode;
    this.count++;
  }

  /**
   * Returns the element at the specified position
   * @throws {IndexOutOfBoundsError} If index is out of bounds
   */
  get(index: number): T {
    if (index < 0 || index >= this.count) {
      throw new IndexOutOfBoundsError();
    }

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    return current!.value;
  }

  /**
   * Removes and returns the first element
   * @throws {EmptyStructureError} If the list is empty
   */
  removeFirst(): T {
    if (!this.head) {
      throw new EmptyStructureError();
    }

    const value = this.head.value;
    this.head = this.head.next;
    this.count--;

    if (this.count === 0) {
      this.tail = null;
    }

    return value;
  }

  /**
   * Removes and returns the element at the specified position
   * @throws {IndexOutOfBoundsError} If index is out of bounds
   */
  removeAt(index: number): T {
    if (index < 0 || index >= this.count) {
      throw new IndexOutOfBoundsError();
    }

    if (index === 0) {
      return this.removeFirst();
    }

    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current!.next;
    }

    const value = current!.next!.value;
    current!.next = current!.next!.next;

    if (index === this.count - 1) {
      this.tail = current;
    }

    this.count--;
    return value;
  }

  /**
   * Removes the first occurrence of the specified element
   * @returns {boolean} true if element was found and removed
   */
  remove(value: T): boolean {
    if (!this.head) {
      return false;
    }

    if (this.head.value === value) {
      this.removeFirst();
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        if (!current.next) {
          this.tail = current;
        }
        this.count--;
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * Returns the index of the first occurrence of the specified element
   * @returns {number} index of element or -1 if not found
   */
  indexOf(value: T): number {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }

    return -1;
  }

  /**
   * Checks if the list contains the specified element
   */
  contains(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  /**
   * Converts the list to an array
   */
  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  /**
   * Removes all elements from the list
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  /**
   * @ignore
   * Creates an iterator for the list
   */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
