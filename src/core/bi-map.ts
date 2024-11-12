/**
 * A bidirectional map implementation that maintains one-to-one mappings between
 * two sets of elements. Each key maps to a unique value, and each value maps to
 * a unique key.
 *
 * Space Complexity: O(n) where n is the number of key-value pairs
 *
 * @template K The type of the keys
 * @template V The type of the values
 */
export class BiDirectionalMap<K, V> {
  /** @ignore */
  private forward: Map<K, V>;
  /** @ignore */
  private reverse: Map<V, K>;

  /**
   * Creates a new empty BiDirectionalMap.
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  constructor() {
    this.forward = new Map<K, V>();
    this.reverse = new Map<V, K>();
  }

  /**
   * Sets a bidirectional mapping between a key and a value.
   * If either the key or value already exists, their previous mappings are removed.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @param key The key to map
   * @param value The value to map
   * @returns The BiDirectionalMap instance for method chaining
   */
  set(key: K, value: V): this {
    const existingValue = this.forward.get(key);
    const existingKey = this.reverse.get(value);

    if (existingValue !== undefined) {
      this.reverse.delete(existingValue);
    }
    if (existingKey !== undefined) {
      this.forward.delete(existingKey);
    }

    this.forward.set(key, value);
    this.reverse.set(value, key);

    return this;
  }

  /**
   * Gets the value associated with a key.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @param key The key to look up
   * @returns The associated value, or undefined if the key doesn't exist
   */
  get(key: K): V | undefined {
    return this.forward.get(key);
  }

  /**
   * Gets the key associated with a value.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @param value The value to look up
   * @returns The associated key, or undefined if the value doesn't exist
   */
  getKey(value: V): K | undefined {
    return this.reverse.get(value);
  }

  /**
   * Checks if a key exists in the map.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @param key The key to check
   * @returns true if the key exists, false otherwise
   */
  hasKey(key: K): boolean {
    return this.forward.has(key);
  }

  /**
   * Checks if a value exists in the map.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @param value The value to check
   * @returns true if the value exists, false otherwise
   */
  hasValue(value: V): boolean {
    return this.reverse.has(value);
  }

  /**
   * Deletes a mapping by its key.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @param key The key to delete
   * @returns true if the mapping was deleted, false if the key didn't exist
   */
  deleteKey(key: K): boolean {
    const value = this.forward.get(key);
    if (value === undefined) {
      return false;
    }

    this.forward.delete(key);
    this.reverse.delete(value);
    return true;
  }

  /**
   * Deletes a mapping by its value.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @param value The value to delete
   * @returns true if the mapping was deleted, false if the value didn't exist
   */
  deleteValue(value: V): boolean {
    const key = this.reverse.get(value);
    if (key === undefined) {
      return false;
    }

    this.forward.delete(key);
    this.reverse.delete(value);
    return true;
  }

  /**
   * Clears all mappings from the map.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  clear(): void {
    this.forward.clear();
    this.reverse.clear();
  }

  /**
   * Gets the number of mappings in the map.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * @returns The size of the map
   */
  get size(): number {
    return this.forward.size;
  }

  /**
   * Returns an iterator of all keys in the map.
   *
   * Time Complexity: O(1) for iterator creation
   * Space Complexity: O(1)
   *
   * @returns An iterator of keys
   */
  keys(): IterableIterator<K> {
    return this.forward.keys();
  }

  /**
   * Returns an iterator of all values in the map.
   *
   * Time Complexity: O(1) for iterator creation
   * Space Complexity: O(1)
   *
   * @returns An iterator of values
   */
  values(): IterableIterator<V> {
    return this.forward.values();
  }

  /**
   * Returns an iterator of all key-value pairs in the map.
   *
   * Time Complexity: O(1) for iterator creation
   * Space Complexity: O(1)
   *
   * @returns An iterator of [key, value] pairs
   */
  entries(): IterableIterator<[K, V]> {
    return this.forward.entries();
  }

  /**
   * Applies a callback function to each key-value pair in the map.
   *
   * Time Complexity: O(n) where n is the number of entries
   * Space Complexity: O(1)
   *
   * @param callbackfn The function to call for each entry
   * @param thisArg The value to use as 'this' in the callback
   */
  forEach(
    callbackfn: (value: V, key: K, map: BiDirectionalMap<K, V>) => void,
    thisArg?: unknown,
  ): void {
    this.forward.forEach((value, key) => {
      callbackfn.call(thisArg, value, key, this);
    });
  }

  /**
   * Creates a new BiDirectionalMap from an array of key-value pairs.
   *
   * Time Complexity: O(n) where n is the number of entries
   * Space Complexity: O(n)
   *
   * @param entries An array of key-value pairs
   * @returns A new BiDirectionalMap containing the entries
   */
  static fromEntries<K, V>(
    entries: Iterable<readonly [K, V]>,
  ): BiDirectionalMap<K, V> {
    const map = new BiDirectionalMap<K, V>();
    for (const [key, value] of entries) {
      map.set(key, value);
    }
    return map;
  }

  /**
   * Converts the map to a plain object.
   *
   * Time Complexity: O(n) where n is the number of entries
   * Space Complexity: O(n)
   *
   * @returns A plain object representation of the map
   */
  toObject(): Record<string, V> {
    return Object.fromEntries(this.forward);
  }
}
