import { EmptyStructureError } from '../errors/index.ts';
import { RBColor, type RBNode } from '../types/index.ts';

/**
 * A generic Red-Black Tree implementation providing self-balancing binary search tree operations.
 *
 * A Red-Black Tree is a type of self-balancing binary search tree where each node has an extra
 * bit representing color (red or black). These colors are used to ensure the tree remains
 * approximately balanced during insertions and deletions.
 *
 * Properties maintained by Red-Black Trees:
 * 1. Every node is either red or black
 * 2. The root is black
 * 3. All leaves (NIL) are black
 * 4. If a node is red, then both its children are black
 * 5. Every path from root to leaves contains the same number of black nodes
 *
 * Features:
 * - O(log n) insertions
 * - O(log n) deletions
 * - O(log n) lookups
 * - Customizable key comparison
 * - Type-safe implementation using generics
 * - Implements Iterable interface for use in for...of loops
 *
 * @template T The type of elements stored in the tree
 *
 * @example
 * ```typescript
 * // Simple number-based tree
 * const tree = new RedBlackTree<number>();
 * tree.insert(5);
 * tree.insert(3);
 * tree.insert(7);
 * console.log(tree.contains(3)); // true
 *
 * // Custom comparison for objects
 * interface User {
 *   id: number;
 *   name: string;
 * }
 * const userTree = new RedBlackTree<User>({
 *   comparator: (a, b) => a.id - b.id
 * });
 * ```
 */
export class RedBlackTree<T> implements Iterable<T> {
  private root: RBNode<T> | null = null;
  private size_: number = 0;
  private compare: (a: T, b: T) => number;

  /**
   * Creates a new Red-Black Tree
   * @param options Configuration options for the tree
   */
  constructor(options?: {
    /**
     * Custom comparison function. Default uses less than/greater than operators.
     * Return negative if a < b, positive if a > b, and 0 if equal.
     */
    comparator?: (a: T, b: T) => number;
    /**
     * Initial values to populate the tree
     */
    initial?: T[];
  }) {
    this.compare = options?.comparator ?? this.defaultCompare;

    if (options?.initial) {
      for (const value of options.initial) {
        this.insert(value);
      }
    }
  }

  /**
   * @ignore
   * Creates a new node with the given value
   * @private
   * @param value The value to store in the node
   * @returns {RBNode<T>} A new red node with the given value
   */
  private createNode(value: T): RBNode<T> {
    return {
      value,
      color: RBColor.RED,
      left: null,
      right: null,
      parent: null,
    };
  }

  /**
   * Returns the number of elements in the tree
   */
  get size(): number {
    return this.size_;
  }

  /**
   * Checks if the tree is empty
   * @returns {boolean} true if the tree contains no elements
   */
  isEmpty(): boolean {
    return this.size_ === 0;
  }

  /**
   * Inserts a value into the tree
   * @param value The value to insert
   */
  insert(value: T): void {
    const node = this.createNode(value);

    if (!this.root) {
      this.root = node;
      this.root.color = RBColor.BLACK;
      this.size_++;
      return;
    }

    let current = this.root;
    let parent: RBNode<T> | null = null;

    // Find insertion point
    while (current) {
      parent = current;
      const comp = this.compare(value, current.value);

      if (comp < 0) {
        current = current.left!;
      } else if (comp > 0) {
        current = current.right!;
      } else {
        // Value already exists, update it
        current.value = value;
        return;
      }
    }

    // Insert new node
    node.parent = parent;
    const comp = this.compare(value, parent!.value);
    if (comp < 0) {
      parent!.left = node;
    } else {
      parent!.right = node;
    }

    this.size_++;
    this.fixInsert(node);
  }

  /**
   * Checks if a value exists in the tree
   * @param value The value to search for
   * @returns {boolean} true if the value exists in the tree
   */
  contains(value: T): boolean {
    let current = this.root;

    while (current) {
      const comp = this.compare(value, current.value);
      if (comp === 0) return true;
      current = comp < 0 ? current.left : current.right;
    }

    return false;
  }

  /**
   * Removes a value from the tree if it exists
   * @param value The value to remove
   * @returns {boolean} true if the value was removed, false if it didn't exist
   */
  remove(value: T): boolean {
    const node = this.findNode(value);
    if (!node) return false;

    this.deleteNode(node);
    this.size_--;
    return true;
  }

  /**
   * Returns the minimum value in the tree
   * @throws {EmptyStructureError} If the tree is empty
   */
  min(): T {
    if (!this.root) {
      throw new EmptyStructureError('Cannot get minimum of empty tree');
    }

    return this.minimum(this.root).value;
  }

  /**
   * Returns the maximum value in the tree
   * @throws {EmptyStructureError} If the tree is empty
   */
  max(): T {
    if (!this.root) {
      throw new EmptyStructureError('Cannot get maximum of empty tree');
    }

    let current = this.root;
    while (current.right) {
      current = current.right;
    }
    return current.value;
  }

  /**
   * Removes all elements from the tree
   */
  clear(): void {
    this.root = null;
    this.size_ = 0;
  }

  /**
   * Converts the tree to an array using in-order traversal
   * @returns An array containing all elements in sorted order
   */
  toArray(): T[] {
    const result: T[] = [];
    this.inorderTraversal(this.root, (value) => result.push(value));
    return result;
  }

  /**
   * @ignore
   * Creates an iterator that traverses the tree in-order
   */
  [Symbol.iterator](): Iterator<T> {
    const values = this.toArray();
    let index = 0;

    return {
      next(): IteratorResult<T> {
        if (index < values.length) {
          return { value: values[index++], done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }

  /**
   * @ignore
   * Default comparison function for values
   * @private
   * @param a First value to compare
   * @param b Second value to compare
   * @returns {number} Negative if a < b, positive if a > b, 0 if equal
   */
  private defaultCompare(a: T, b: T): number {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  /**
   * @ignore
   * Finds a node with the given value in the tree
   * @private
   * @param value The value to search for
   * @returns {RBNode<T> | null} The node containing the value, or null if not found
   */
  private findNode(value: T): RBNode<T> | null {
    let current = this.root;

    while (current) {
      const comp = this.compare(value, current.value);
      if (comp === 0) return current;
      current = comp < 0 ? current.left : current.right;
    }

    return null;
  }

  /**
   * @ignore
   * Performs a left rotation on the given node
   * @private
   * @param node The node to rotate
   */
  private rotateLeft(node: RBNode<T>): void {
    const right = node.right!;
    node.right = right.left;

    if (right.left) {
      right.left.parent = node;
    }

    right.parent = node.parent;

    if (!node.parent) {
      this.root = right;
    } else if (node === node.parent.left) {
      node.parent.left = right;
    } else {
      node.parent.right = right;
    }

    right.left = node;
    node.parent = right;
  }

  /**
   * @ignore
   * Performs a right rotation on the given node
   * @private
   * @param node The node to rotate
   */
  private rotateRight(node: RBNode<T>): void {
    const left = node.left!;
    node.left = left.right;

    if (left.right) {
      left.right.parent = node;
    }

    left.parent = node.parent;

    if (!node.parent) {
      this.root = left;
    } else if (node === node.parent.right) {
      node.parent.right = left;
    } else {
      node.parent.left = left;
    }

    left.right = node;
    node.parent = left;
  }

  /**
   * @ignore
   * Fixes the Red-Black Tree properties after insertion
   * @private
   * @param node The newly inserted node
   */
  private fixInsert(node: RBNode<T>): void {
    while (node !== this.root && node.parent?.color === RBColor.RED) {
      if (node.parent === node.parent.parent?.left) {
        const uncle = node.parent.parent.right;

        if (uncle?.color === RBColor.RED) {
          node.parent.color = RBColor.BLACK;
          uncle.color = RBColor.BLACK;
          node.parent.parent.color = RBColor.RED;
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this.rotateLeft(node);
          }
          node.parent!.color = RBColor.BLACK;
          node.parent!.parent!.color = RBColor.RED;
          this.rotateRight(node.parent!.parent!);
        }
      } else {
        const uncle = node.parent.parent?.left;

        if (uncle?.color === RBColor.RED) {
          node.parent.color = RBColor.BLACK;
          uncle.color = RBColor.BLACK;
          node.parent.parent!.color = RBColor.RED;
          node = node.parent.parent!;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rotateRight(node);
          }
          node.parent!.color = RBColor.BLACK;
          node.parent!.parent!.color = RBColor.RED;
          this.rotateLeft(node.parent!.parent!);
        }
      }
    }

    this.root!.color = RBColor.BLACK;
  }

  /**
   * @ignore
   * Deletes a node from the tree
   * @private
   * @param node The node to delete
   */
  private deleteNode(node: RBNode<T>): void {
    let x: RBNode<T> | null;
    let y = node;
    let yOriginalColor = y.color;

    if (!node.left) {
      x = node.right;
      this.transplant(node, node.right);
    } else if (!node.right) {
      x = node.left;
      this.transplant(node, node.left);
    } else {
      y = this.minimum(node.right);
      yOriginalColor = y.color;
      x = y.right;

      if (y.parent === node) {
        if (x) x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = node.right;
        y.right.parent = y;
      }

      this.transplant(node, y);
      y.left = node.left;
      y.left.parent = y;
      y.color = node.color;
    }

    if (yOriginalColor === RBColor.BLACK && x) {
      this.fixDelete(x);
    }
  }

  /**
   * @ignore
   * Fixes the Red-Black Tree properties after deletion
   * @private
   * @param node The node to start fixing from
   */
  private fixDelete(node: RBNode<T>): void {
    while (node !== this.root && node.color === RBColor.BLACK) {
      if (node === node.parent!.left) {
        let w = node.parent!.right!;

        if (w.color === RBColor.RED) {
          w.color = RBColor.BLACK;
          node.parent!.color = RBColor.RED;
          this.rotateLeft(node.parent!);
          w = node.parent!.right!;
        }

        if (
          (!w.left || w.left.color === RBColor.BLACK) &&
          (!w.right || w.right.color === RBColor.BLACK)
        ) {
          w.color = RBColor.RED;
          node = node.parent!;
        } else {
          if (!w.right || w.right.color === RBColor.BLACK) {
            if (w.left) w.left.color = RBColor.BLACK;
            w.color = RBColor.RED;
            this.rotateRight(w);
            w = node.parent!.right!;
          }

          w.color = node.parent!.color;
          node.parent!.color = RBColor.BLACK;
          if (w.right) w.right.color = RBColor.BLACK;
          this.rotateLeft(node.parent!);
          node = this.root!;
        }
      } else {
        let w = node.parent!.left!;

        if (w.color === RBColor.RED) {
          w.color = RBColor.BLACK;
          node.parent!.color = RBColor.RED;
          this.rotateRight(node.parent!);
          w = node.parent!.left!;
        }

        if (
          (!w.right || w.right.color === RBColor.BLACK) &&
          (!w.left || w.left.color === RBColor.BLACK)
        ) {
          w.color = RBColor.RED;
          node = node.parent!;
        } else {
          if (!w.left || w.left.color === RBColor.BLACK) {
            if (w.right) w.right.color = RBColor.BLACK;
            w.color = RBColor.RED;
            this.rotateLeft(w);
            w = node.parent!.left!;
          }

          w.color = node.parent!.color;
          node.parent!.color = RBColor.BLACK;
          if (w.left) w.left.color = RBColor.BLACK;
          this.rotateRight(node.parent!);
          node = this.root!;
        }
      }
    }

    node.color = RBColor.BLACK;
  }

  /**
   * @ignore
   * Replaces one subtree with another subtree
   * @private
   * @param u The root of the subtree to replace
   * @param v The root of the replacement subtree
   */
  private transplant(u: RBNode<T>, v: RBNode<T> | null): void {
    if (!u.parent) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    if (v) {
      v.parent = u.parent;
    }
  }

  /**
   * @ignore
   * Finds the node with the minimum value in a subtree
   * @private
   * @param node The root of the subtree
   * @returns {RBNode<T>} The node with the minimum value
   */
  private minimum(node: RBNode<T>): RBNode<T> {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

  /**
   * @ignore
   * Performs an in-order traversal of the tree
   * @private
   * @param node The root of the subtree to traverse
   * @param visit Function to call for each node's value
   */
  private inorderTraversal(
    node: RBNode<T> | null,
    visit: (value: T) => void,
  ): void {
    if (!node) return;

    this.inorderTraversal(node.left, visit);
    visit(node.value);
    this.inorderTraversal(node.right, visit);
  }
}
