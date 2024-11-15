// Copyright 2024-2025 the @mskr/data-structures authors. All rights reserved. MIT license.

/**
 * A Least Frequently Used (LFU) Cache implementation using HashMaps for O(1) operations.
 *
 * The LFU Cache is a fixed-size cache that removes the least frequently used item when
 * the cache reaches its capacity. If multiple items have the same frequency, it removes
 * the least recently used among them. It provides constant time O(1) operations for both
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
 * const cache = new LFUCache<string, number>({ capacity: 3 });
 *
 * // Add some items
 * cache.put("a", 1);
 * cache.put("b", 2);
 * cache.put("c", 3);
 *
 * // Access an item (increases its frequency)
 * console.log(cache.get("a")); // 1
 * console.log(cache.get("a")); // 1
 *
 * // Add a new item when at capacity
 * cache.put("d", 4); // Evicts either "b" or "c" (whichever was accessed less)
 *
 * // Create a cache with time-based expiration
 * const timedCache = new LFUCache<string, number>({
 *   capacity: 100,
 *   ttl: 60000 // Items expire after 60 seconds
 * });
 * ```
 */
export class LFUCache<K, V> implements Iterable<[K, V]> {
  /** @ignore */
  private capacity: number;
  /** @ignore */
  private cache: Map<K, V>;
  /** @ignore */
  private frequencies: Map<K, number>;
  /** @ignore */
  private freqLists: Map<number, Set<K>>;
  /** @ignore */
  private minFreq: number;
  /** @ignore */
  private ttl?: number;
  /** @ignore */
  private timestamps?: Map<K, number>;
  /** @ignore */
  private accessOrder: Map<number, Map<K, number>>;
  /** @ignore */
  private accessCounter: number;

  /**
   * Creates a new LFU Cache
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
    this.frequencies = new Map();
    this.freqLists = new Map();
    this.minFreq = 0;
    this.accessOrder = new Map();
    this.accessCounter = 0;

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

    if (this.isExpired(key)) {
      this.delete(key);
      return undefined;
    }

    this.incrementFrequency(key);
    return this.cache.get(key);
  }

  /**
   * Adds or updates an item in the cache
   * @param key The key of the item
   * @param value The value to store
   */
  put(key: K, value: V): void {
    if (this.capacity <= 0) return;

    if (this.isExpired(key)) {
      this.delete(key);
    }

    if (this.cache.has(key)) {
      this.cache.set(key, value);
      this.incrementFrequency(key);
    } else {
      if (this.size >= this.capacity) {
        this.removeLFU();
      }

      this.cache.set(key, value);
      this.frequencies.set(key, 1);
      if (!this.freqLists.has(1)) {
        this.freqLists.set(1, new Set());
        this.accessOrder.set(1, new Map());
      }
      this.freqLists.get(1)!.add(key);
      this.accessOrder.get(1)!.set(key, ++this.accessCounter);
      this.minFreq = 1;
    }

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

    const freq = this.frequencies.get(key)!;
    const freqSet = this.freqLists.get(freq)!;
    freqSet.delete(key);
    this.accessOrder.get(freq)?.delete(key);

    if (freqSet.size === 0) {
      this.freqLists.delete(freq);
      this.accessOrder.delete(freq);
      if (freq === this.minFreq) {
        this.minFreq = this.findNewMinFreq();
      }
    }

    this.cache.delete(key);
    this.frequencies.delete(key);
    this.timestamps?.delete(key);
    return true;
  }

  /**
   * Removes all items from the cache
   */
  clear(): void {
    this.cache.clear();
    this.frequencies.clear();
    this.freqLists.clear();
    this.timestamps?.clear();
    this.accessOrder.clear();
    this.minFreq = 0;
    this.accessCounter = 0;
  }

  /**
   * Returns an array of all entries in the cache ordered by frequency (highest to lowest)
   * and then by recency within each frequency level
   * @returns An array of [key, value] pairs
   */
  entries(): [K, V][] {
    const entries: [K, V][] = [];
    const freqs = Array.from(this.freqLists.keys()).sort((a, b) => b - a);

    for (const freq of freqs) {
      const keys = Array.from(this.freqLists.get(freq)!);
      // Sort keys by access order within the same frequency
      keys.sort((a, b) => {
        const aAccess = this.accessOrder.get(freq)?.get(a) || 0;
        const bAccess = this.accessOrder.get(freq)?.get(b) || 0;
        return bAccess - aAccess; // Most recent first
      });

      for (const key of keys) {
        if (!this.isExpired(key)) {
          const value = this.cache.get(key);
          if (value !== undefined) {
            entries.push([key, value]);
          }
        }
      }
    }

    return entries;
  }

  /**
   * @ignore
   * Creates an iterator for the cache
   * Iteration order is from highest frequency to lowest,
   * and by recency within each frequency level
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
        return { value: undefined as unknown as [K, V], done: true };
      },
    };
  }

  /** @ignore */
  private incrementFrequency(key: K): void {
    const freq = this.frequencies.get(key)!;
    const freqSet = this.freqLists.get(freq)!;
    freqSet.delete(key);
    this.accessOrder.get(freq)?.delete(key);

    if (freqSet.size === 0) {
      this.freqLists.delete(freq);
      this.accessOrder.delete(freq);
      if (freq === this.minFreq) {
        this.minFreq = freq + 1;
      }
    }

    const newFreq = freq + 1;
    this.frequencies.set(key, newFreq);

    if (!this.freqLists.has(newFreq)) {
      this.freqLists.set(newFreq, new Set());
      this.accessOrder.set(newFreq, new Map());
    }
    this.freqLists.get(newFreq)!.add(key);
    this.accessOrder.get(newFreq)!.set(key, ++this.accessCounter);
  }

  /** @ignore */
  private removeLFU(): void {
    if (this.minFreq === 0 || !this.freqLists.has(this.minFreq)) return;

    const leastFreqSet = this.freqLists.get(this.minFreq)!;
    const leastFreqAccessOrder = this.accessOrder.get(this.minFreq)!;

    // Find the least recently used key among the least frequent items
    let lruKey = Array.from(leastFreqSet)[0];
    let minAccess = leastFreqAccessOrder.get(lruKey) || Infinity;

    for (const key of leastFreqSet) {
      const access = leastFreqAccessOrder.get(key) || Infinity;
      if (access < minAccess) {
        minAccess = access;
        lruKey = key;
      }
    }

    this.delete(lruKey);
  }

  /** @ignore */
  private findNewMinFreq(): number {
    if (this.freqLists.size === 0) return 0;
    return Math.min(...this.freqLists.keys());
  }

  /** @ignore */
  private isExpired(key: K): boolean {
    if (!this.ttl || !this.timestamps) return false;
    const timestamp = this.timestamps.get(key);
    if (!timestamp) return true;
    return Date.now() - timestamp > this.ttl;
  }
}
