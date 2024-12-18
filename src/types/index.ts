// Copyright 2024-2025 the @mskr/data-structures authors. All rights reserved. MIT license.

/**
 * @ignore
 * Interface for objects that can be compared to each other.
 * @template T The type of objects being compared
 */
export interface Comparable<T> {
  /**
   * Compares this object with another object of the same type.
   * @param other The object to compare with
   * @returns A negative number if this object is less than the other,
   *          zero if they are equal, or a positive number if this object is greater
   */
  compareTo(other: T): number;
}

/**
 * @ignore
 * Represents a node in a singly linked list.
 * @template T The type of value stored in the node
 */
export interface LinkedListNode<T> {
  /** The value stored in the node */
  value: T;
  /** Reference to the next node in the list */
  next: LinkedListNode<T> | null;
}

/**
 * @ignore
 * Represents a node in a doubly linked list.
 * @template T The type of value stored in the node
 */
export interface DoublyLinkedListNode<T> {
  /** The value stored in the node */
  value: T;
  /** Reference to the next node in the list */
  next: DoublyLinkedListNode<T> | null;
  /** Reference to the previous node in the list */
  prev: DoublyLinkedListNode<T> | null;
}

/**
 * @ignore
 * Represents a node in the Trie.
 * @template T The type of value associated with complete words
 */
export interface TrieNode<T> {
  /** Map denoting the children which are currently associated with this node */
  children: Map<string, TrieNode<T>>;
  /** The value stored in the Trie Node */
  value: T | null;
  /** Flag to represent if the current node marks the end of inserted word */
  isEndOfWord: boolean;
}

/**
 * @ignore
 * Represents the color of a node in a Red-Black Tree.
 */
export enum RBColor {
  RED,
  BLACK,
}

/**
 * @ignore
 * Represents a node in a Red-Black Tree.
 * @template T The type of value stored in the node
 */
export interface RBNode<T> {
  /** The value stored in the node */
  value: T;
  /** Color of the node (RED or BLACK) */
  color: RBColor;
  /** Reference to the left child node */
  left: RBNode<T> | null;
  /** Reference to the right child node */
  right: RBNode<T> | null;
  /** Reference to the parent node */
  parent: RBNode<T> | null;
}
