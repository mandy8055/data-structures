import { EmptyStructureError } from '../errors/index.ts';
import { RedBlackTree } from './red-black-tree.ts';

/**
 * A generic key-value map that maintains its entries sorted by key using a Red-Black Tree.
 *
 * SortedMap provides an ordered map implementation where entries are kept sorted by their
 * keys. This implementation uses a Red-Black Tree as its underlying data structure,
 * ensuring O(log n) performance for most operations.
 *
 * Features:
 * - O(log n) insertions
 * - O(log n) deletions
 * - O(log n) lookups
 * - Maintains entries sorted by key
 * - Supports custom key comparison
 * - Type-safe implementation using generics
 * - Implements Iterable interface for entries
 *
 * @template K The type of keys stored in the map
 * @template V The type of values stored in the map
 *
 * @example
 * ```typescript
 * // Simple number-string map
 * const map = new SortedMap<number, string>();
 * map.set(5, "five");
 * map.set(3, "three");
 * map.set(7, "seven");
 * console.log(map.get(3)); // "three"
 *
 * // Custom comparison for object keys
 * interface User {
 *   id: number;
 *   name: string;
 * }
 * const userMap = new SortedMap<User, string>({
 *   comparator: (a, b) => a.id - b.id
 * });
 * ```
 */
export class SortedMap<K, V> implements Iterable<[K, V]> {
  private tree: RedBlackTree<[K, V]>;
  private keyComparator: (a: K, b: K) => number;

  /**
   * Creates a new SortedMap
   * @param options Configuration options for the map
   */
  constructor(options?: {
    /**
     * Custom comparison function for keys. Default uses less than/greater than operators.
     * Return negative if a < b, positive if a > b, and 0 if equal.
     */
    comparator?: (a: K, b: K) => number;
    /**
     * Initial entries to populate the map
     */
    entries?: [K, V][];
  }) {
    this.keyComparator = options?.comparator ?? this.defaultCompare;
    this.tree = new RedBlackTree<[K, V]>({
      comparator: (a, b) => this.keyComparator(a[0], b[0]),
      initial: options?.entries,
    });
  }

  /**
   * Returns the number of entries in the map
   */
  get size(): number {
    return this.tree.size;
  }

  /**
   * Checks if the map is empty
   * @returns {boolean} true if the map contains no entries
   */
  isEmpty(): boolean {
    return this.tree.isEmpty();
  }

  /**
   * Sets a value for the given key, overwriting if the key already exists
   * @param key The key to set
   * @param value The value to associate with the key
   */
  set(key: K, value: V): void {
    this.tree.insert([key, value]);
  }

  /**
   * Gets the value associated with a key
   * @param key The key to look up
   * @returns The value associated with the key, or undefined if the key doesn't exist
   */
  get(key: K): V | undefined {
    const found = this.tree
      .toArray()
      .find(([k]) => this.keyComparator(k, key) === 0);
    return found?.[1];
  }

  /**
   * Checks if a key exists in the map
   * @param key The key to check for
   * @returns {boolean} true if the key exists
   */
  has(key: K): boolean {
    const dummyValue = {} as V;
    return this.tree.contains([key, dummyValue]);
  }

  /**
   * Removes an entry from the map
   * @param key The key to remove
   * @returns {boolean} true if the key was removed, false if it didn't exist
   */
  delete(key: K): boolean {
    const dummyValue = {} as V;
    return this.tree.remove([key, dummyValue]);
  }

  /**
   * Returns the smallest key in the map
   * @throws {EmptyStructureError} If the map is empty
   */
  firstKey(): K {
    if (this.isEmpty()) {
      throw new EmptyStructureError('Cannot get first key of empty map');
    }
    return this.tree.min()[0];
  }

  /**
   * Returns the largest key in the map
   * @throws {EmptyStructureError} If the map is empty
   */
  lastKey(): K {
    if (this.isEmpty()) {
      throw new EmptyStructureError('Cannot get last key of empty map');
    }
    return this.tree.max()[0];
  }

  /**
   * Returns the entry with the smallest key
   * @throws {EmptyStructureError} If the map is empty
   */
  firstEntry(): [K, V] {
    if (this.isEmpty()) {
      throw new EmptyStructureError('Cannot get first entry of empty map');
    }
    return this.tree.min();
  }

  /**
   * Returns the entry with the largest key
   * @throws {EmptyStructureError} If the map is empty
   */
  lastEntry(): [K, V] {
    if (this.isEmpty()) {
      throw new EmptyStructureError('Cannot get last entry of empty map');
    }
    return this.tree.max();
  }

  /**
   * Removes all entries from the map
   */
  clear(): void {
    this.tree.clear();
  }

  /**
   * Returns all keys in the map in sorted order
   */
  keys(): K[] {
    return this.tree.toArray().map(([k]) => k);
  }

  /**
   * Returns all values in the map in key-sorted order
   */
  values(): V[] {
    return this.tree.toArray().map(([_, v]) => v);
  }

  /**
   * Returns all entries in the map as [key, value] pairs in key-sorted order
   */
  entries(): [K, V][] {
    return this.tree.toArray();
  }

  /**
   * Creates an iterator that traverses the map entries in key-sorted order
   */
  [Symbol.iterator](): Iterator<[K, V]> {
    return this.tree[Symbol.iterator]();
  }

  /**
   * Executes a callback for each entry in the map in key-sorted order
   * @param callback Function to execute for each entry
   */
  forEach(callback: (value: V, key: K, map: SortedMap<K, V>) => void): void {
    for (const [key, value] of this) {
      callback(value, key, this);
    }
  }

  /**
   * @ignore
   * Default comparison function for values
   * @private
   * @param a First value to compare
   * @param b Second value to compare
   * @returns {number} Negative if a < b, positive if a > b, 0 if equal
   */
  private defaultCompare(a: K, b: K): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
}
