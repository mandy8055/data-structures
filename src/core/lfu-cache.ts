// Copyright 2024-2025 the @mskr/data-structures authors. All rights reserved. MIT license.

import { DoublyLinkedList } from './doubly-linked-list.ts';

/**
 * A generic Least Frequently Used (LFU) Cache implementation.
 *
 * This class provides an O(1) time complexity implementation of the LFU cache
 * eviction policy. It maintains items based on their access frequency and
 * recency within each frequency level.
 *
 * Features:
 * - O(1) time complexity for get and put operations
 * - Configurable capacity
 * - Automatic eviction of least frequently used items
 * - Implements Iterable interface for use in for...of loops
 * - Type-safe implementation using generics
 *
 * The implementation uses a combination of HashMaps and DoublyLinkedLists to
 * achieve O(1) time complexity for the main operations.
 *
 * @template K The type of keys stored in the cache
 * @template V The type of values stored in the cache
 *
 * @example
 * ```typescript
 * const cache = new LFUCache<string, number>(2);
 * cache.put("a", 1);
 * cache.put("b", 2);
 * console.log(cache.get("a")); // 1
 * cache.put("c", 3); // evicts "b" since "a" was accessed more recently
 * console.log(cache.has("b")); // false
 * ```
 */
export class LFUCache<K, V> implements Iterable<[K, V]> {
  /** @ignore */
  private capacity: number;
  /** @ignore */
  private cache: Map<K, [V, number]>;
  /** @ignore */
  private frequencies: Map<number, DoublyLinkedList<K>>;
  /** @ignore */
  private minFrequency: number;

  /**
   * Creates a new LFU Cache with the specified capacity
   * @param capacity Maximum number of items the cache can hold
   * @throws {Error} If capacity is less than or equal to 0
   */
  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }
    this.capacity = capacity;
    this.cache = new Map();
    this.frequencies = new Map();
    this.minFrequency = 0;
  }

  /**
   * Returns the current number of items in the cache
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Retrieves an item from the cache
   * @param key The key of the item to retrieve
   * @returns The value associated with the key, or undefined if not found
   */
  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (!item) {
      return undefined;
    }

    const [value, frequency] = item;
    this.incrementFrequency(key, frequency);
    return value;
  }

  /**
   * Adds or updates an item in the cache
   * @param key The key of the item
   * @param value The value to store
   */
  put(key: K, value: V): void {
    if (this.capacity <= 0) return;

    const currentItem = this.cache.get(key);
    if (currentItem) {
      const [_, frequency] = currentItem;
      this.cache.set(key, [value, frequency]);
      this.incrementFrequency(key, frequency);
      return;
    }

    if (this.cache.size >= this.capacity) {
      this.evict();
    }

    // Add new item with frequency 1
    this.cache.set(key, [value, 1]);
    if (!this.frequencies.has(1)) {
      this.frequencies.set(1, new DoublyLinkedList<K>());
    }
    this.frequencies.get(1)!.append(key);
    this.minFrequency = 1;
  }

  /**
   * Checks if an item exists in the cache
   * @param key The key to check
   * @returns true if the key exists in the cache
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Removes an item from the cache
   * @param key The key of the item to remove
   * @returns true if an item was removed
   */
  delete(key: K): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    const [_, frequency] = item;
    const freqList = this.frequencies.get(frequency)!;

    // Remove from frequency list
    const index = freqList.indexOf(key);
    if (index !== -1) {
      freqList.removeAt(index);
    }

    // Update minFrequency if necessary
    if (freqList.isEmpty() && this.minFrequency === frequency) {
      this.minFrequency = frequency + 1;
      if (this.cache.size === 0) {
        this.minFrequency = 0;
      }
    }

    // Remove from cache
    this.cache.delete(key);
    return true;
  }

  /**
   * Removes all items from the cache
   */
  clear(): void {
    this.cache.clear();
    this.frequencies.clear();
    this.minFrequency = 0;
  }

  /**
   * Returns an iterator of all [key, value] pairs in the cache
   */
  entries(): IterableIterator<[K, V]> {
    return this.generateEntries();
  }

  /**
   * @ignore
   * Iterator implementation
   */
  [Symbol.iterator](): Iterator<[K, V]> {
    return this.generateEntries();
  }

  /** @ignore */
  private *generateEntries(): IterableIterator<[K, V]> {
    for (const [key, [value, _]] of this.cache) {
      yield [key, value];
    }
  }

  /** @ignore */
  private incrementFrequency(key: K, frequency: number): void {
    const currentFreqList = this.frequencies.get(frequency)!;
    const index = currentFreqList.indexOf(key);
    if (index !== -1) {
      currentFreqList.removeAt(index);
    }

    // Update minFrequency if necessary
    if (this.minFrequency === frequency && currentFreqList.isEmpty()) {
      this.minFrequency++;
    }

    const newFrequency = frequency + 1;
    if (!this.frequencies.has(newFrequency)) {
      this.frequencies.set(newFrequency, new DoublyLinkedList<K>());
    }

    this.frequencies.get(newFrequency)!.append(key);
    this.cache.set(key, [this.cache.get(key)![0], newFrequency]);
  }

  /** @ignore */
  private evict(): void {
    const minFreqList = this.frequencies.get(this.minFrequency)!;
    if (!minFreqList.isEmpty()) {
      const keyToRemove = minFreqList.removeFirst();
      this.cache.delete(keyToRemove);
    }
  }
}
