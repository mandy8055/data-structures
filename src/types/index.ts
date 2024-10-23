export interface Comparable<T> {
  compareTo(other: T): number;
}

export interface LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null;
}

export interface DoublyLinkedListNode<T> {
  value: T;
  next: DoublyLinkedListNode<T> | null;
  prev: DoublyLinkedListNode<T> | null;
}

export interface QueueNode<T> {
  value: T;
  next: QueueNode<T> | null;
}
