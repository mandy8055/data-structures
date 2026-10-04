// Copyright 2025-2026 the @dstoolkit/data-structures authors. All rights reserved. MIT license.

import {
  EmptyStructureError,
  IndexOutOfBoundsError,
  InvalidOperationError,
} from '../errors/index.ts';
import type { NestedNode, TreeOptions } from '../types/index.ts';
import { Queue } from './queue.ts';

/**
 * @ignore
 * Internal mutable state of a TreeNode. Never exposed outside this module.
 */
interface NodeState<T> {
  value: T;
  parent: TreeNode<T> | null;
  children: TreeNode<T>[];
  tree: Tree<T> | null;
  view: ReadonlyArray<TreeNode<T>> | null;
}

/** @ignore Token guarding TreeNode construction to this module. */
const NODE_TOKEN: unique symbol = Symbol('TreeNode');

/** @ignore Fast internal accessor for nodes already known to be valid. */
let stateOf: <T>(node: TreeNode<T>) => NodeState<T>;
/** @ignore Brand-checked accessor for untrusted arguments. */
let maybeStateOf: <T>(node: unknown) => NodeState<T> | null;
/** @ignore Internal node factory. */
let newNode: <T>(
  tree: Tree<T>,
  parent: TreeNode<T> | null,
  value: T,
) => TreeNode<T>;

/**
 * A node of an n-ary {@link Tree}.
 *
 * Nodes can only be created by a `Tree` (via `setRoot`, `addChild`,
 * `insertChildAt`, `fromNested`, `map` or `filter`). Their structure is
 * read-only from the outside; all structural changes go through the owning
 * `Tree`, which enforces ownership, cycle prevention and size limits.
 *
 * @template T The type of value stored in the node
 */
export class TreeNode<T> {
  /** @ignore */
  #s: NodeState<T>;

  static {
    stateOf = <U>(node: TreeNode<U>): NodeState<U> => node.#s;
    maybeStateOf = <U>(node: unknown): NodeState<U> | null =>
      typeof node === 'object' && node !== null && #s in node
        ? (node as unknown as TreeNode<U>).#s
        : null;
    newNode = <U>(
      tree: Tree<U>,
      parent: TreeNode<U> | null,
      value: U,
    ): TreeNode<U> =>
      new TreeNode<U>(NODE_TOKEN, {
        value,
        parent,
        children: [],
        tree,
        view: null,
      });
  }

  /**
   * @ignore
   * TreeNode instances are created only by Tree.
   */
  private constructor(token: symbol, state: NodeState<T>) {
    if (token !== NODE_TOKEN) {
      throw new InvalidOperationError(
        'TreeNode instances can only be created by a Tree',
      );
    }
    this.#s = state;
  }

  /**
   * The value stored in this node
   */
  get value(): T {
    return this.#s.value;
  }

  /**
   * Replaces the value stored in this node. This is not a structural change
   * and does not invalidate active iterators.
   * @param v The new value
   */
  set value(v: T) {
    this.#s.value = v;
  }

  /**
   * The parent of this node, or null for the root (or a detached node)
   */
  get parent(): TreeNode<T> | null {
    return this.#s.parent;
  }

  /**
   * A frozen, read-only snapshot of this node's children in order.
   * Mutating the tree produces a new snapshot; the internal array is never
   * exposed.
   */
  get children(): ReadonlyArray<TreeNode<T>> {
    const s = this.#s;
    if (s.view === null) {
      s.view = Object.freeze(s.children.slice());
    }
    return s.view;
  }

  /**
   * Whether this node has no children
   */
  get isLeaf(): boolean {
    return this.#s.children.length === 0;
  }

  /**
   * Whether this node is the root of the tree that owns it.
   * Detached (removed) nodes are never roots.
   */
  get isRoot(): boolean {
    return this.#s.parent === null && this.#s.tree !== null;
  }
}

/**
 * A generic n-ary (rooted, ordered) tree implementation.
 *
 * Each node may have any number of ordered children. The tree is designed to
 * safely hold arbitrary or untrusted data:
 *
 * Features:
 * - Fully iterative algorithms (no recursion) — safe on arbitrarily deep trees
 * - Ownership validation: nodes from another tree, or removed nodes, are rejected
 * - Cycle prevention when moving subtrees
 * - Validated, prototype-pollution-safe construction from nested objects
 * - Optional `maxSize` / `maxDepth` bounds
 * - Pre-order, post-order and level-order traversal generators
 * - Fail-fast iterators: structural modification during iteration throws
 * - Implements Iterable interface (pre-order) for use in for...of loops
 *
 * @template T The type of values stored in the tree
 *
 * @example
 * ```typescript
 * const tree = new Tree<string>();
 * const root = tree.setRoot('/');
 * const usr = tree.addChild(root, 'usr');
 * const bin = tree.addChild(usr, 'bin');
 * tree.addChild(root, 'etc');
 *
 * console.log([...tree]); // ['/', 'usr', 'bin', 'etc']
 * console.log(tree.path(bin)); // ['/', 'usr', 'bin']
 * console.log(tree.height); // 2
 * ```
 */
export class Tree<T> implements Iterable<T> {
  /** @ignore */
  private rootNode: TreeNode<T> | null = null;
  /** @ignore */
  private count = 0;
  /** @ignore */
  private version = 0;
  /** @ignore */
  private readonly maxSize: number;
  /** @ignore */
  private readonly maxDepth: number;
  /** @ignore */
  private readonly options: TreeOptions;

  /**
   * Creates an empty tree
   * @param options Optional limits; `maxSize` bounds the number of nodes and
   * `maxDepth` bounds the depth of any node (root has depth 0). Both must be
   * positive integers when provided and are unbounded by default.
   * @throws {InvalidOperationError} If an option is not a positive integer
   */
  constructor(options?: TreeOptions) {
    const maxSize = options?.maxSize;
    const maxDepth = options?.maxDepth;
    if (maxSize !== undefined && !Tree.isPositiveInteger(maxSize)) {
      throw new InvalidOperationError('maxSize must be a positive integer');
    }
    if (maxDepth !== undefined && !Tree.isPositiveInteger(maxDepth)) {
      throw new InvalidOperationError('maxDepth must be a positive integer');
    }
    this.maxSize = maxSize ?? Infinity;
    this.maxDepth = maxDepth ?? Infinity;
    this.options = { maxSize, maxDepth };
  }

  /**
   * @ignore
   * @private
   */
  private static isPositiveInteger(n: unknown): boolean {
    return typeof n === 'number' && Number.isInteger(n) && n > 0;
  }

  /**
   * The root node, or null if the tree is empty
   */
  get root(): TreeNode<T> | null {
    return this.rootNode;
  }

  /**
   * Returns the number of nodes in the tree
   */
  get size(): number {
    return this.count;
  }

  /**
   * Number of edges on the longest root-to-leaf path.
   * An empty tree has height -1 and a single node has height 0.
   * Time complexity: O(n)
   */
  get height(): number {
    return this.rootNode === null ? -1 : this.heightFrom(this.rootNode);
  }

  /**
   * Checks if the tree is empty
   * @returns {boolean} true if the tree contains no nodes
   */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Removes all nodes from the tree. Every previously owned node becomes
   * detached. Time complexity: O(n)
   */
  clear(): void {
    if (this.rootNode !== null) {
      this.detachSubtree(this.rootNode);
    }
    this.rootNode = null;
    this.count = 0;
    this.version++;
  }

  /**
   * Creates the root node of an empty tree
   * @param value The value for the root
   * @returns The new root node
   * @throws {InvalidOperationError} If the tree already has a root
   */
  setRoot(value: T): TreeNode<T> {
    if (this.rootNode !== null) {
      throw new InvalidOperationError('Tree already has a root');
    }
    this.version++;
    return this.attach(null, value);
  }

  /**
   * Appends a new child to the given parent.
   * Time complexity: O(1), or O(depth) when `maxDepth` is set
   * @param parent A node owned by this tree
   * @param value The value for the new child
   * @returns The new child node
   * @throws {InvalidOperationError} If parent is not owned by this tree or a
   * limit would be exceeded
   */
  addChild(parent: TreeNode<T>, value: T): TreeNode<T> {
    const ps = this.assertOwned(parent);
    return this.insertChecked(parent, ps.children.length, value);
  }

  /**
   * Inserts a new child at the given position among the parent's children.
   * Time complexity: O(k) where k is the number of siblings
   * @param parent A node owned by this tree
   * @param index Position in `[0, parent.children.length]`
   * @param value The value for the new child
   * @returns The new child node
   * @throws {InvalidOperationError} If parent is not owned by this tree or a
   * limit would be exceeded
   * @throws {IndexOutOfBoundsError} If index is out of range
   */
  insertChildAt(parent: TreeNode<T>, index: number, value: T): TreeNode<T> {
    const ps = this.assertOwned(parent);
    if (!Number.isInteger(index) || index < 0 || index > ps.children.length) {
      throw new IndexOutOfBoundsError();
    }
    return this.insertChecked(parent, index, value);
  }

  /**
   * Removes a node and its entire subtree. Removing the root empties the
   * tree. Every removed node becomes detached and is rejected by all
   * subsequent Tree operations.
   * Time complexity: O(s + k) where s is the subtree size and k the number of
   * siblings
   * @param node A node owned by this tree
   * @throws {InvalidOperationError} If node is not owned by this tree
   */
  remove(node: TreeNode<T>): void {
    const s = this.assertOwned(node);
    const parent = s.parent;
    if (parent === null) {
      this.clear();
      return;
    }
    const ps = stateOf(parent);
    ps.children.splice(ps.children.indexOf(node), 1);
    ps.view = null;
    s.parent = null;
    this.count -= this.detachSubtree(node);
    this.version++;
  }

  /**
   * Moves a node (with its subtree) under a new parent within this tree.
   * Time complexity: O(depth + k), plus O(subtree size) when `maxDepth` is set
   * @param node The node to move (owned by this tree)
   * @param newParent The new parent (owned by this tree)
   * @param index Optional position among newParent's children, evaluated
   * after node is removed from its current position. Defaults to appending.
   * @throws {InvalidOperationError} If either node is not owned by this tree,
   * if newParent is node or one of its descendants, or if `maxDepth` would be
   * exceeded
   * @throws {IndexOutOfBoundsError} If index is out of range
   */
  move(node: TreeNode<T>, newParent: TreeNode<T>, index?: number): void {
    const s = this.assertOwned(node);
    const nps = this.assertOwned(newParent);

    // Cycle check: walk up from newParent looking for node.
    let cursor: TreeNode<T> | null = newParent;
    while (cursor !== null) {
      if (cursor === node) {
        throw new InvalidOperationError(
          'Cannot move a node under itself or one of its descendants',
        );
      }
      cursor = stateOf(cursor).parent;
    }

    const sameParent = s.parent === newParent;
    const limit = nps.children.length - (sameParent ? 1 : 0);
    const target = index ?? limit;
    if (!Number.isInteger(target) || target < 0 || target > limit) {
      throw new IndexOutOfBoundsError();
    }

    if (this.maxDepth !== Infinity) {
      const deepest = this.depthOf(newParent) + 1 + this.heightFrom(node);
      if (deepest > this.maxDepth) {
        throw new InvalidOperationError('Tree maxDepth would be exceeded');
      }
    }
    // Size is unchanged by a move, so maxSize always remains satisfied.

    // node is never the root here: the root is an ancestor of every node,
    // so the cycle check above would have thrown.
    const oldParent = s.parent as TreeNode<T>;
    const ops = stateOf(oldParent);
    ops.children.splice(ops.children.indexOf(node), 1);
    ops.view = null;
    nps.children.splice(target, 0, node);
    nps.view = null;
    s.parent = newParent;
    this.version++;
  }

  /**
   * Checks whether a node is owned by this tree. Returns false for nodes of
   * other trees, detached nodes and non-node values (never throws).
   * Time complexity: O(1)
   * @param node The node to check
   * @returns {boolean} true if the node belongs to this tree
   */
  contains(node: TreeNode<T>): boolean {
    const s = maybeStateOf<T>(node);
    return s !== null && s.tree === this;
  }

  /**
   * Finds the first node, in pre-order, whose value satisfies the predicate.
   * Time complexity: O(n)
   * @param predicate Test function receiving the value and node
   * @returns The first matching node, or null if none matches
   * @throws {InvalidOperationError} If the predicate modifies the tree
   */
  find(
    predicate: (value: T, node: TreeNode<T>) => boolean,
  ): TreeNode<T> | null {
    let found: TreeNode<T> | null = null;
    this.walkPreOrder((node, s) => {
      if (predicate(s.value, node)) {
        found = node;
        return false;
      }
      return true;
    });
    return found;
  }

  /**
   * Finds all nodes, in pre-order, whose values satisfy the predicate.
   * Time complexity: O(n)
   * @param predicate Test function receiving the value and node
   * @returns The matching nodes (empty array if none)
   * @throws {InvalidOperationError} If the predicate modifies the tree
   */
  findAll(
    predicate: (value: T, node: TreeNode<T>) => boolean,
  ): TreeNode<T>[] {
    const result: TreeNode<T>[] = [];
    this.walkPreOrder((node, s) => {
      if (predicate(s.value, node)) result.push(node);
      return true;
    });
    return result;
  }

  /**
   * Returns the depth of a node (number of edges from the root; root is 0).
   * Time complexity: O(depth)
   * @param node A node owned by this tree
   * @returns The depth of the node
   * @throws {InvalidOperationError} If node is not owned by this tree
   */
  depth(node: TreeNode<T>): number {
    this.assertOwned(node);
    return this.depthOf(node);
  }

  /**
   * Returns the values on the path from the root to the given node.
   * Time complexity: O(depth)
   * @param node A node owned by this tree
   * @returns Values ordered from root to node (inclusive)
   * @throws {InvalidOperationError} If node is not owned by this tree
   */
  path(node: TreeNode<T>): T[] {
    this.assertOwned(node);
    const values: T[] = [];
    let cursor: TreeNode<T> | null = node;
    while (cursor !== null) {
      const s: NodeState<T> = stateOf(cursor);
      values.push(s.value);
      cursor = s.parent;
    }
    return values.reverse();
  }

  /**
   * Iterates values in pre-order (node, then children left to right).
   * Time complexity: O(n); extra space O(n) worst case for the explicit stack
   * @param from Optional subtree root owned by this tree (defaults to root)
   * @returns A generator of values
   * @throws {InvalidOperationError} If from is not owned by this tree, or
   * (on a later `next()`) if the tree was structurally modified
   */
  preOrder(from?: TreeNode<T>): Generator<T> {
    return this.preOrderGen(this.startNode(from), this.version);
  }

  /**
   * Iterates values in post-order (children left to right, then node).
   * Time complexity: O(n); extra space O(h)
   * @param from Optional subtree root owned by this tree (defaults to root)
   * @returns A generator of values
   * @throws {InvalidOperationError} If from is not owned by this tree, or
   * (on a later `next()`) if the tree was structurally modified
   */
  postOrder(from?: TreeNode<T>): Generator<T> {
    return this.postOrderGen(this.startNode(from), this.version);
  }

  /**
   * Iterates values level by level (breadth-first), left to right.
   * Time complexity: O(n); extra space O(w) where w is the maximum width
   * @param from Optional subtree root owned by this tree (defaults to root)
   * @returns A generator of values
   * @throws {InvalidOperationError} If from is not owned by this tree, or
   * (on a later `next()`) if the tree was structurally modified
   */
  levelOrder(from?: TreeNode<T>): Generator<T> {
    return this.levelOrderGen(this.startNode(from), this.version);
  }

  /**
   * @ignore
   * Creates an iterator over the tree's values in pre-order
   */
  [Symbol.iterator](): Iterator<T> {
    return this.preOrder();
  }

  /**
   * Converts the tree to an array of values in pre-order
   * @returns An array containing all values
   */
  toArray(): T[] {
    return [...this.preOrder()];
  }

  /**
   * Reduces the tree bottom-up (leaves to root). The reducer is called once
   * per node, after all of its children, with the results of its children in
   * order. Implemented as an iterative post-order traversal.
   * Time complexity: O(n); extra space O(h + k)
   * @param reducer Combines a node's value with its children's results
   * @param from Optional subtree root owned by this tree (defaults to root)
   * @returns The result computed for the starting node
   * @throws {EmptyStructureError} If the tree is empty and no `from` is given
   * @throws {InvalidOperationError} If from is not owned by this tree, or the
   * reducer modifies the tree
   */
  fold<R>(
    reducer: (value: T, childResults: R[], node: TreeNode<T>) => R,
    from?: TreeNode<T>,
  ): R {
    let start: TreeNode<T>;
    if (from === undefined) {
      if (this.rootNode === null) throw new EmptyStructureError();
      start = this.rootNode;
    } else {
      this.assertOwned(from);
      start = from;
    }
    const version = this.version;
    const nodes: TreeNode<T>[] = [start];
    const indices: number[] = [0];
    const results: R[][] = [[]];
    for (;;) {
      const top = nodes.length - 1;
      const node = nodes[top];
      const s = stateOf(node);
      const i = indices[top];
      if (i < s.children.length) {
        indices[top] = i + 1;
        nodes.push(s.children[i]);
        indices.push(0);
        results.push([]);
        continue;
      }
      const r = reducer(s.value, results[top], node);
      this.checkVersion(version);
      nodes.pop();
      indices.pop();
      results.pop();
      if (top === 0) return r;
      results[top - 1].push(r);
    }
  }

  /**
   * Creates a new tree with the same shape and options, whose values are
   * produced by `fn`. `fn` is called once per node in pre-order.
   * Time complexity: O(n)
   * @param fn Mapping function receiving the value and node
   * @returns A new, independent tree
   * @throws {InvalidOperationError} If fn modifies the tree
   */
  map<U>(fn: (value: T, node: TreeNode<T>) => U): Tree<U> {
    const out = new Tree<U>(this.options);
    this.copyInto(
      out,
      (value, node) => ({ keep: true, value: fn(value, node) }),
    );
    return out;
  }

  /**
   * Creates a new tree containing only the nodes for which the predicate
   * holds for the node itself AND every one of its ancestors. When a node
   * fails, its whole subtree is dropped (descendants are not tested), so the
   * result keeps the original parent/child relationships of surviving nodes.
   * If the root fails, the result is empty. Values are copied by reference.
   * Time complexity: O(n)
   * @param predicate Test function receiving the value and node
   * @returns A new, independent tree with the same options
   * @throws {InvalidOperationError} If the predicate modifies the tree
   */
  filter(predicate: (value: T, node: TreeNode<T>) => boolean): Tree<T> {
    const out = new Tree<T>(this.options);
    this.copyInto(out, (value, node) => ({
      keep: predicate(value, node),
      value,
    }));
    return out;
  }

  /**
   * Builds a tree from a nested `{ value, children? }` object. The input is
   * treated as untrusted: every node must be a non-null object with an own
   * `value` property, and `children`, if present, must be an array. Only
   * `value` and `children` are read. Cycles and shared references (the same
   * object reachable twice) are rejected, and `maxSize`/`maxDepth` are
   * enforced while building. Iterative; safe for very deep input.
   * Time complexity: O(n)
   * @param input The nested description of the tree
   * @param options Optional limits for the new tree
   * @returns A new tree
   * @throws {InvalidOperationError} On malformed input, cycles, shared
   * references, invalid options or exceeded limits
   */
  static fromNested<T>(input: NestedNode<T>, options?: TreeOptions): Tree<T> {
    const tree = new Tree<T>(options);
    const hasOwn = Object.prototype.hasOwnProperty;
    const visited = new Set<object>();
    const srcStack: unknown[] = [input];
    const parentStack: (TreeNode<T> | null)[] = [null];
    const depthStack: number[] = [0];

    while (srcStack.length > 0) {
      const src = srcStack.pop();
      const parent = parentStack.pop() ?? null;
      const depth = depthStack.pop() as number;

      if (typeof src !== 'object' || src === null) {
        throw new InvalidOperationError(
          'Invalid nested node: expected a non-null object',
        );
      }
      if (visited.has(src)) {
        throw new InvalidOperationError(
          'Invalid nested input: cycle or shared reference detected',
        );
      }
      visited.add(src);
      if (!hasOwn.call(src, 'value')) {
        throw new InvalidOperationError(
          'Invalid nested node: missing "value" property',
        );
      }
      const children = hasOwn.call(src, 'children')
        ? (src as { children?: unknown }).children
        : undefined;
      if (children !== undefined && !Array.isArray(children)) {
        throw new InvalidOperationError(
          'Invalid nested node: "children" must be an array',
        );
      }
      if (depth > tree.maxDepth) {
        throw new InvalidOperationError('Tree maxDepth would be exceeded');
      }
      // No per-node maxSize check is needed here: maxSize >= 1 admits the
      // root, and every other pending node was counted by the fail-fast
      // check below before it was pushed.
      const node = tree.attach(parent, (src as { value: T }).value);

      if (children !== undefined && children.length > 0) {
        // Every pending entry becomes a node or throws, so fail fast.
        if (tree.count + srcStack.length + children.length > tree.maxSize) {
          throw new InvalidOperationError('Tree maxSize would be exceeded');
        }
        for (let i = children.length - 1; i >= 0; i--) {
          const child: unknown = children[i];
          if (typeof child !== 'object' || child === null) {
            throw new InvalidOperationError(
              'Invalid nested node: expected a non-null object',
            );
          }
          srcStack.push(child);
          parentStack.push(node);
          depthStack.push(depth + 1);
        }
      }
    }
    return tree;
  }

  /**
   * Converts the tree to a nested `{ value, children? }` object. Leaf nodes
   * have no `children` property. Iterative; safe for very deep trees.
   * Time complexity: O(n)
   * @returns The nested representation, or null if the tree is empty
   */
  toNested(): NestedNode<T> | null {
    if (this.rootNode === null) return null;
    const rootState = stateOf(this.rootNode);
    const result: NestedNode<T> = { value: rootState.value };
    const nodes: TreeNode<T>[] = [this.rootNode];
    const outs: NestedNode<T>[] = [result];
    while (nodes.length > 0) {
      const s = stateOf(nodes.pop() as TreeNode<T>);
      const out = outs.pop() as NestedNode<T>;
      const len = s.children.length;
      if (len === 0) continue;
      const childOuts: NestedNode<T>[] = new Array(len);
      out.children = childOuts;
      for (let i = 0; i < len; i++) {
        const child = s.children[i];
        const childOut: NestedNode<T> = { value: stateOf(child).value };
        childOuts[i] = childOut;
        nodes.push(child);
        outs.push(childOut);
      }
    }
    return result;
  }

  /**
   * @ignore
   * Validates that node is a live node owned by this tree
   * @private
   */
  private assertOwned(node: TreeNode<T>): NodeState<T> {
    const s = maybeStateOf<T>(node);
    if (s === null) {
      throw new InvalidOperationError('Expected a TreeNode');
    }
    if (s.tree === null) {
      throw new InvalidOperationError(
        'Node has been removed from its tree and is detached',
      );
    }
    if (s.tree !== this) {
      throw new InvalidOperationError('Node does not belong to this tree');
    }
    return s;
  }

  /**
   * @ignore
   * Throws if the tree was structurally modified since `version` was captured
   * @private
   */
  private checkVersion(version: number): void {
    if (this.version !== version) {
      throw new InvalidOperationError(
        'Tree was structurally modified during iteration',
      );
    }
  }

  /**
   * @ignore
   * Resolves the start node of a traversal
   * @private
   */
  private startNode(from: TreeNode<T> | undefined): TreeNode<T> | null {
    if (from === undefined) return this.rootNode;
    this.assertOwned(from);
    return from;
  }

  /**
   * @ignore
   * Creates and links a node without limit checks (callers check limits).
   * Appends to the parent's children when index is omitted.
   * @private
   */
  private attach(
    parent: TreeNode<T> | null,
    value: T,
    index?: number,
  ): TreeNode<T> {
    const node = newNode(this, parent, value);
    if (parent === null) {
      this.rootNode = node;
    } else {
      const ps = stateOf(parent);
      if (index === undefined || index === ps.children.length) {
        ps.children.push(node);
      } else {
        ps.children.splice(index, 0, node);
      }
      ps.view = null;
    }
    this.count++;
    return node;
  }

  /**
   * @ignore
   * Checks limits, then inserts a new child
   * @private
   */
  private insertChecked(
    parent: TreeNode<T>,
    index: number,
    value: T,
  ): TreeNode<T> {
    if (this.count + 1 > this.maxSize) {
      throw new InvalidOperationError('Tree maxSize would be exceeded');
    }
    if (
      this.maxDepth !== Infinity && this.depthOf(parent) + 1 > this.maxDepth
    ) {
      throw new InvalidOperationError('Tree maxDepth would be exceeded');
    }
    this.version++;
    return this.attach(parent, value, index);
  }

  /**
   * @ignore
   * Depth of a node known to be valid
   * @private
   */
  private depthOf(node: TreeNode<T>): number {
    let d = 0;
    let cursor = stateOf(node).parent;
    while (cursor !== null) {
      d++;
      cursor = stateOf(cursor).parent;
    }
    return d;
  }

  /**
   * @ignore
   * Height of the subtree rooted at node (iterative)
   * @private
   */
  private heightFrom(node: TreeNode<T>): number {
    let max = 0;
    const nodes: TreeNode<T>[] = [node];
    const depths: number[] = [0];
    while (nodes.length > 0) {
      const s = stateOf(nodes.pop() as TreeNode<T>);
      const d = depths.pop() as number;
      if (d > max) max = d;
      for (const child of s.children) {
        nodes.push(child);
        depths.push(d + 1);
      }
    }
    return max;
  }

  /**
   * @ignore
   * Clears the owner of every node in the subtree; returns the node count
   * @private
   */
  private detachSubtree(node: TreeNode<T>): number {
    let removed = 0;
    const stack: TreeNode<T>[] = [node];
    while (stack.length > 0) {
      const s = stateOf(stack.pop() as TreeNode<T>);
      s.tree = null;
      removed++;
      for (const child of s.children) stack.push(child);
    }
    return removed;
  }

  /**
   * @ignore
   * Pre-order walk over nodes calling visit; stops when visit returns false
   * @private
   */
  private walkPreOrder(
    visit: (node: TreeNode<T>, s: NodeState<T>) => boolean,
  ): void {
    if (this.rootNode === null) return;
    const version = this.version;
    const stack: TreeNode<T>[] = [this.rootNode];
    while (stack.length > 0) {
      const node = stack.pop() as TreeNode<T>;
      const s = stateOf(node);
      const proceed = visit(node, s);
      this.checkVersion(version);
      if (!proceed) return;
      for (let i = s.children.length - 1; i >= 0; i--) {
        stack.push(s.children[i]);
      }
    }
  }

  /**
   * @ignore
   * Copies this tree into an empty `out` tree in pre-order. `step` decides
   * whether to keep each node (dropping its subtree otherwise) and its value.
   * @private
   */
  private copyInto<U>(
    out: Tree<U>,
    step: (value: T, node: TreeNode<T>) => { keep: boolean; value: U },
  ): void {
    if (this.rootNode === null) return;
    const version = this.version;
    const src: TreeNode<T>[] = [this.rootNode];
    const dstParents: (TreeNode<U> | null)[] = [null];
    while (src.length > 0) {
      const node = src.pop() as TreeNode<T>;
      const parent = dstParents.pop() ?? null;
      const s = stateOf(node);
      const res = step(s.value, node);
      this.checkVersion(version);
      if (!res.keep) continue;
      const copy = out.attach(parent, res.value);
      for (let i = s.children.length - 1; i >= 0; i--) {
        src.push(s.children[i]);
        dstParents.push(copy);
      }
    }
  }

  /**
   * @ignore
   * @private
   */
  private *preOrderGen(
    start: TreeNode<T> | null,
    version: number,
  ): Generator<T> {
    if (start === null) return;
    const stack: TreeNode<T>[] = [start];
    while (stack.length > 0) {
      this.checkVersion(version);
      const s = stateOf(stack.pop() as TreeNode<T>);
      yield s.value;
      this.checkVersion(version);
      for (let i = s.children.length - 1; i >= 0; i--) {
        stack.push(s.children[i]);
      }
    }
  }

  /**
   * @ignore
   * @private
   */
  private *postOrderGen(
    start: TreeNode<T> | null,
    version: number,
  ): Generator<T> {
    if (start === null) return;
    const nodes: TreeNode<T>[] = [start];
    const indices: number[] = [0];
    while (nodes.length > 0) {
      this.checkVersion(version);
      const top = nodes.length - 1;
      const s = stateOf(nodes[top]);
      const i = indices[top];
      if (i < s.children.length) {
        indices[top] = i + 1;
        nodes.push(s.children[i]);
        indices.push(0);
        continue;
      }
      nodes.pop();
      indices.pop();
      yield s.value;
    }
    this.checkVersion(version);
  }

  /**
   * @ignore
   * @private
   */
  private *levelOrderGen(
    start: TreeNode<T> | null,
    version: number,
  ): Generator<T> {
    if (start === null) return;
    const queue = new Queue<TreeNode<T>>();
    queue.enqueue(start);
    while (!queue.isEmpty()) {
      this.checkVersion(version);
      const s = stateOf(queue.dequeue());
      yield s.value;
      this.checkVersion(version);
      for (const child of s.children) queue.enqueue(child);
    }
  }
}
