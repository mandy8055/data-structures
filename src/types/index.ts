/**
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
 * Represents a node in a queue implementation.
 * @template T The type of value stored in the node
 */
export interface QueueNode<T> {
  /** The value stored in the node */
  value: T;
  /** Reference to the next node in the queue */
  next: QueueNode<T> | null;
}

/**
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
