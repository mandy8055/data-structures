import type { TrieNode } from '../types/index.ts';

/**
 * A generic Trie (prefix tree) implementation.
 *
 * This class provides a Trie data structure optimized for efficient string operations
 * such as insertion, search, and prefix matching. The Trie can store additional data
 * of type T associated with each word.
 *
 * Features:
 * - O(m) insertions and lookups where m is key length
 * - Case sensitive/insensitive operations
 * - Prefix matching support
 * - Associate custom values with words
 * - Memory-efficient storage of strings with common prefixes
 * - Iterative traversal capabilities
 *
 * @template T The type of values associated with words in the trie
 *
 * @example
 * ```typescript
 * const trie = new Trie<number>();
 * trie.insert("hello", 1);
 * trie.insert("help", 2);
 * console.log(trie.search("hello")); // 1
 * console.log(trie.getAllWithPrefix("hel")); // ["hello", "help"]
 * ```
 */
export class Trie<T> {
  private root: TrieNode<T>;
  private wordCount: number;
  private caseSensitive: boolean;

  /**
   * Creates a new Trie instance
   * @param caseSensitive Whether searches should be case-sensitive (default: true)
   */
  constructor(caseSensitive = true) {
    this.root = this.createNode();
    this.wordCount = 0;
    this.caseSensitive = caseSensitive;
  }

  /**
   * Creates a new TrieNode
   * @private
   */
  private createNode(): TrieNode<T> {
    return {
      children: new Map(),
      value: null,
      isEndOfWord: false,
    };
  }

  /**
   * Normalizes the key based on case sensitivity setting
   * @private
   */
  private normalizeKey(key: string): string {
    return this.caseSensitive ? key : key.toLowerCase();
  }

  /**
   * Returns the number of words in the trie
   */
  get size(): number {
    return this.wordCount;
  }

  /**
   * Checks if the trie is empty
   * @returns {boolean} true if the trie contains no words
   */
  isEmpty(): boolean {
    return this.wordCount === 0;
  }

  /**
   * Inserts a word into the trie with an associated value
   * @param word The word to insert
   * @param value The value to associate with the word
   */
  insert(word: string, value: T): void {
    if (!word) return;

    const normalizedWord = this.normalizeKey(word);
    let current = this.root;

    for (const char of normalizedWord) {
      if (!current.children.has(char)) {
        current.children.set(char, this.createNode());
      }
      current = current.children.get(char)!;
    }

    if (!current.isEndOfWord) {
      this.wordCount++;
    }
    current.isEndOfWord = true;
    current.value = value;
  }

  /**
   * Searches for a word in the trie
   * @param word The word to search for
   * @returns The value associated with the word, or null if not found
   */
  search(word: string): T | null {
    const node = this.getNode(word);
    return node?.isEndOfWord ? node.value : null;
  }

  /**
   * Checks if a word exists in the trie
   * @param word The word to check
   * @returns {boolean} true if the word exists
   */
  contains(word: string): boolean {
    const node = this.getNode(word);
    return node?.isEndOfWord ?? false;
  }

  /**
   * Checks if any word in the trie starts with the given prefix
   * @param prefix The prefix to check
   * @returns {boolean} true if any word starts with the prefix
   */
  hasPrefix(prefix: string): boolean {
    return this.getNode(prefix) !== null;
  }

  /**
   * Gets all words that start with the given prefix
   * @param prefix The prefix to search for
   * @returns An array of words with the given prefix
   */
  getAllWithPrefix(prefix: string): string[] {
    const words: string[] = [];
    const node = this.getNode(prefix);

    if (node) {
      this.collectWords(node, this.normalizeKey(prefix), words);
    }

    return words;
  }

  /**
   * Gets all words in the trie with their associated values
   * @returns An array of [word, value] pairs
   */
  entries(): [string, T][] {
    const entries: [string, T][] = [];
    this.collectEntries(this.root, '', entries);
    return entries;
  }

  /**
   * Removes a word from the trie
   * @param word The word to remove
   * @returns {boolean} true if the word was found and removed
   */
  remove(word: string): boolean {
    if (!word) return false;

    const normalizedWord = this.normalizeKey(word);
    const stack: [TrieNode<T>, string][] = [];
    let current = this.root;

    // Traverse to the end node while building a stack
    for (const char of normalizedWord) {
      const next = current.children.get(char);
      if (!next) return false;
      stack.push([current, char]);
      current = next;
    }

    if (!current.isEndOfWord) return false;

    // Mark as not end of word and clear value
    current.isEndOfWord = false;
    current.value = null;
    this.wordCount--;

    // Remove nodes if they have no other children
    if (current.children.size === 0) {
      while (stack.length > 0) {
        const [parent, char] = stack.pop()!;
        const node = parent.children.get(char)!;

        if (node.children.size === 0 && !node.isEndOfWord) {
          parent.children.delete(char);
        } else {
          break;
        }
      }
    }

    return true;
  }

  /**
   * Removes all words from the trie
   */
  clear(): void {
    this.root = this.createNode();
    this.wordCount = 0;
  }

  /**
   * Gets the node at the end of the given word path
   * @private
   */
  private getNode(word: string): TrieNode<T> | null {
    if (!word) return null;

    const normalizedWord = this.normalizeKey(word);
    let current = this.root;

    for (const char of normalizedWord) {
      const next = current.children.get(char);
      if (!next) return null;
      current = next;
    }

    return current;
  }

  /**
   * Recursively collects all words under a node
   * @private
   */
  private collectWords(
    node: TrieNode<T>,
    prefix: string,
    result: string[],
  ): void {
    if (node.isEndOfWord) {
      result.push(prefix);
    }

    for (const [char, child] of node.children) {
      this.collectWords(child, prefix + char, result);
    }
  }

  /**
   * Recursively collects all entries under a node
   * @private
   */
  private collectEntries(
    node: TrieNode<T>,
    prefix: string,
    result: [string, T][],
  ): void {
    if (node.isEndOfWord && node.value !== null) {
      result.push([prefix, node.value]);
    }

    for (const [char, child] of node.children) {
      this.collectEntries(child, prefix + char, result);
    }
  }
}
