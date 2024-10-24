import { EmptyStructureError, IndexOutOfBoundsError } from '../errors/index.ts';
import type { DoublyLinkedListNode } from '../types/index.ts';

/**
 * A generic doubly linked list implementation.
 *
 * This class provides a doubly linked list data structure with operations for adding,
 * removing, and accessing elements. The list maintains both head and tail pointers
 * for efficient operations at both ends of the list, and each node contains references
 * to both its next and previous nodes.
 *
 * Features:
 * - O(1) insertions at the beginning and end
 * - O(1) removals from the beginning and end
 * - O(n) access to arbitrary elements
 * - Bidirectional traversal capabilities
 * - Implements Iterable interface for use in for...of loops
 * - Type-safe implementation using generics
 *
 * @template T The type of elements stored in the linked list
 *
 * @example
 * ```typescript
 * const list = new DoublyLinkedList<number>();
 * list.append(1);
 * list.append(2);
 * list.prepend(0);
 * console.log(list.toArray()); // [0, 1, 2]
 * console.log([...list.reverseIterator()]); // [2, 1, 0]
 * ```
 */
export class DoublyLinkedList<T> {
  private head: DoublyLinkedListNode<T> | null = null;
  private tail: DoublyLinkedListNode<T> | null = null;
  private count = 0;

  /**
   * Creates a new node with the given value
   * @private
   */
  private createNode(value: T): DoublyLinkedListNode<T> {
    return { value, next: null, prev: null };
  }

  /**
   * Returns the number of elements in the list
   */
  get size(): number {
    return this.count;
  }

  /**
   * Checks if the list is empty
   * @returns {boolean} true if the list contains no elements
   */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Adds a new element to the end of the list
   * @param value The value to append
   */
  append(value: T): void {
    const newNode = this.createNode(value);

    if (!this.head) {
      this.head = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
    }
    this.tail = newNode;
    this.count++;
  }

  /**
   * Adds a new element to the beginning of the list
   * @param value The value to prepend
   */
  prepend(value: T): void {
    const newNode = this.createNode(value);

    if (!this.head) {
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
    }
    this.head = newNode;
    this.count++;
  }

  /**
   * Inserts an element at the specified position
   * @param value The value to insert
   * @param index The position at which to insert the value
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

    // Find the node at the insertion point
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    const newNode = this.createNode(value);
    newNode.prev = current!.prev;
    newNode.next = current;
    current!.prev!.next = newNode;
    current!.prev = newNode;
    this.count++;
  }

  /**
   * Returns the element at the specified position
   * @param index The index of the element to return
   * @throws {IndexOutOfBoundsError} If index is out of bounds
   * @returns The element at the specified position
   */
  get(index: number): T {
    if (index < 0 || index >= this.count) {
      throw new IndexOutOfBoundsError();
    }

    // Optimize by starting from the closer end
    if (index <= this.count / 2) {
      let current = this.head;
      for (let i = 0; i < index; i++) {
        current = current!.next;
      }
      return current!.value;
    } else {
      let current = this.tail;
      for (let i = this.count - 1; i > index; i--) {
        current = current!.prev;
      }
      return current!.value;
    }
  }

  /**
   * Removes and returns the first element
   * @throws {EmptyStructureError} If the list is empty
   * @returns The first element in the list
   */
  removeFirst(): T {
    if (!this.head) {
      throw new EmptyStructureError();
    }

    const value = this.head.value;
    this.head = this.head.next;
    this.count--;

    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }

    return value;
  }

  /**
   * Removes and returns the last element
   * @throws {EmptyStructureError} If the list is empty
   * @returns The last element in the list
   */
  removeLast(): T {
    if (!this.tail) {
      throw new EmptyStructureError();
    }

    const value = this.tail.value;
    this.tail = this.tail.prev;
    this.count--;

    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }

    return value;
  }

  /**
   * Removes and returns the element at the specified position
   * @param index The position of the element to remove
   * @throws {IndexOutOfBoundsError} If index is out of bounds
   * @returns The element that was removed
   */
  removeAt(index: number): T {
    if (index < 0 || index >= this.count) {
      throw new IndexOutOfBoundsError();
    }

    if (index === 0) {
      return this.removeFirst();
    }

    if (index === this.count - 1) {
      return this.removeLast();
    }

    // Find the node to remove
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    current!.prev!.next = current!.next;
    current!.next!.prev = current!.prev;
    this.count--;

    return current!.value;
  }

  /**
   * Removes the first occurrence of the specified element
   * @param value The element to remove
   * @returns {boolean} true if element was found and removed
   */
  remove(value: T): boolean {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        if (current === this.head) {
          this.removeFirst();
        } else if (current === this.tail) {
          this.removeLast();
        } else {
          current.prev!.next = current.next;
          current.next!.prev = current.prev;
          this.count--;
        }
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * Returns the index of the first occurrence of the specified element
   * @param value The element to find
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
   * @param value The value to check for
   * @returns {boolean} true if the element exists in the list
   */
  contains(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  /**
   * Converts the list to an array
   * @returns An array containing all elements in the list
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
   * Creates a forward iterator for the list
   */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  /**
   * Creates a reverse iterator for the list
   * @returns An iterator that traverses the list from tail to head
   */
  *reverseIterator(): IterableIterator<T> {
    let current = this.tail;
    while (current) {
      yield current.value;
      current = current.prev;
    }
  }
}
