// Copyright 2025-2026 the @mskr/data-structures authors. All rights reserved. MIT license.

import { DoublyLinkedList } from './doubly-linked-list.ts';

/**
 * A Least Recently Used (LRU) Cache implementation using a HashMap and DoublyLinkedList.
 *
 * The LRU Cache is a fixed-size cache that removes the least recently used item when
 * the cache reaches its capacity. It provides constant time O(1) operations for both
 * getting and putting elements.
 *
 * Features:
 * - O(1) get operations
 * - O(1) put operations
 * - Fixed capacity with automatic eviction
 * - Type-safe implementation using generics
 * - Optional time-based expiration
 * - Implements Iterable interface for use in for...of loops
 *
 * @template K The type of keys stored in the cache
 * @template V The type of values stored in the cache
 *
 * @example
 * ```typescript
 * // Create a cache with capacity of 3
 * const cache = new LRUCache<string, number>({ capacity: 3 });
 *
 * // Add some items
 * cache.put("a", 1);
 * cache.put("b", 2);
 * cache.put("c", 3);
 *
 * // Access an item (marks it as recently used)
 * console.log(cache.get("a")); // 1
 *
 * // Add a new item when at capacity
 * cache.put("d", 4); // Evicts "b" as it's the least recently used
 *
 * // Create a cache with time-based expiration
 * const timedCache = new LRUCache<string, number>({
 *   capacity: 100,
 *   ttl: 60000 // Items expire after 60 seconds
 * });
 * ```
 */
export class LRUCache<K, V> implements Iterable<[K, V]> {
  /** @ignore */
  private capacity: number;
  /** @ignore */
  private cache: Map<K, V>;
  /** @ignore */
  private list: DoublyLinkedList<K>;
  /** @ignore */
  private ttl?: number;
  /** @ignore */
  private timestamps?: Map<K, number>;

  /**
   * Creates a new LRU Cache
   * @param options Configuration options for the cache
   */
  constructor(options: {
    /**
     * Maximum number of items the cache can hold
     */
    capacity: number;
    /**
     * Optional time-to-live in milliseconds for cache entries
     */
    ttl?: number;
  }) {
    if (options.capacity <= 0) {
      throw new Error('Capacity must be greater than 0');
    }

    this.capacity = options.capacity;
    this.cache = new Map();
    this.list = new DoublyLinkedList<K>();

    if (options.ttl !== undefined) {
      this.ttl = options.ttl;
      this.timestamps = new Map();
    }
  }

  /**
   * Returns the number of elements in the cache
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Retrieves an item from the cache
   * @param key The key of the item to retrieve
   * @returns The value associated with the key, or undefined if not found or expired
   */
  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    // Check if the item has expired
    if (this.isExpired(key)) {
      this.delete(key);
      return undefined;
    }

    // Move to front (mark as recently used)
    this.list.remove(key);
    this.list.prepend(key);

    return this.cache.get(key);
  }

  /**
   * Adds or updates an item in the cache
   * @param key The key of the item
   * @param value The value to store
   */
  put(key: K, value: V): void {
    // Update existing item
    if (this.cache.has(key)) {
      this.cache.set(key, value);
      this.list.remove(key);
      this.list.prepend(key);
    } else {
      // Add new item
      if (this.size >= this.capacity) {
        // Remove least recently used item
        const lru = this.list.removeLast();
        this.cache.delete(lru);
        this.timestamps?.delete(lru);
      }

      this.cache.set(key, value);
      this.list.prepend(key);
    }

    // Update timestamp if TTL is enabled
    if (this.timestamps) {
      this.timestamps.set(key, Date.now());
    }
  }

  /**
   * Checks if a key exists in the cache and hasn't expired
   * @param key The key to check
   * @returns {boolean} true if the key exists and hasn't expired
   */
  has(key: K): boolean {
    if (!this.cache.has(key)) return false;
    if (this.isExpired(key)) {
      this.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Removes an item from the cache
   * @param key The key of the item to remove
   * @returns {boolean} true if an item was removed
   */
  delete(key: K): boolean {
    if (!this.cache.has(key)) return false;

    this.list.remove(key);
    this.cache.delete(key);
    this.timestamps?.delete(key);
    return true;
  }

  /**
   * Removes all items from the cache
   */
  clear(): void {
    this.cache.clear();
    this.list.clear();
    this.timestamps?.clear();
  }

  /**
   * Returns an array of all entries in the cache in order of most to least recently used
   * @returns An array of [key, value] pairs
   */
  entries(): [K, V][] {
    const entries: [K, V][] = [];

    for (const key of this.list) {
      if (!this.isExpired(key)) {
        const value = this.cache.get(key);
        if (value !== undefined) {
          entries.push([key, value]);
        }
      }
    }

    return entries;
  }

  /**
   * @ignore
   * Creates an iterator for the cache
   * Iteration order is from most recently used to least recently used
   */
  [Symbol.iterator](): Iterator<[K, V]> {
    const entries = this.entries();
    let index = 0;

    return {
      next: (): IteratorResult<[K, V]> => {
        if (index < entries.length) {
          return {
            value: entries[index++],
            done: false,
          };
        }
        return { value: undefined as unknown, done: true };
      },
    };
  }

  /** @ignore */
  private isExpired(key: K): boolean {
    if (!this.ttl || !this.timestamps) return false;
    const timestamp = this.timestamps.get(key);
    if (!timestamp) return true;
    return Date.now() - timestamp > this.ttl;
  }
}
