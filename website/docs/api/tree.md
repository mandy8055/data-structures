---
id: tree
title: Tree
sidebar_label: Tree
description: Generic n-ary tree with safe, iterative traversal and validated construction
keywords:
  [tree, n-ary-tree, hierarchy, traversal, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# Tree

A generic n-ary (rooted, ordered) tree where every node can have any number of children. Ideal for hierarchies such as file systems, category trees, org charts, menus and parsed documents. Every algorithm is iterative, so the tree is safe to use with very deep or untrusted data.

## Installation

<InstallTabs packageName='@dstoolkit/data-structures' importName='Tree' />

## Usage

```typescript
import { Tree } from '@dstoolkit/data-structures';

const tree = new Tree<string>();
const root = tree.setRoot('root');
```

## API Reference

### Construction

```typescript
// Unbounded tree
const tree = new Tree<string>();

// With optional limits (positive integers)
const bounded = new Tree<string>({ maxSize: 10_000, maxDepth: 64 });
```

- `maxSize` - Maximum number of nodes in the tree
- `maxDepth` - Maximum depth of any node (the root has depth `0`)

### Properties

- `root: TreeNode<T> | null` - The root node, or `null` if empty
- `size: number` - Number of nodes in the tree
- `height: number` - Edges on the longest root-to-leaf path (`-1` when empty, `0` for a single node)
- `isEmpty(): boolean` - Whether the tree is empty

### TreeNode

Nodes are created only by the tree and are read-only from the outside, except for their value.

- `value: T` - The stored value (can be reassigned)
- `parent: TreeNode<T> | null` - Parent node (`null` for the root)
- `children: ReadonlyArray<TreeNode<T>>` - A frozen snapshot of the children
- `isLeaf: boolean` - Whether the node has no children
- `isRoot: boolean` - Whether the node is the root of its tree

### Methods

#### Building and Modifying

```typescript
// Create the root (throws if a root already exists) - O(1)
const root = tree.setRoot('root');

// Append a child - O(1)
const child = tree.addChild(root, 'child');

// Insert a child at a position - O(k)
tree.insertChildAt(root, 0, 'first');

// Move a node (with its subtree) under a new parent - O(depth + k)
tree.move(child, otherNode); // append
tree.move(child, otherNode, 0); // at index

// Remove a node and its entire subtree - O(s + k)
tree.remove(child);

// Remove everything - O(n)
tree.clear();
```

where `k` is the number of siblings and `s` is the size of the removed subtree

#### Querying

```typescript
// Ownership check - O(1)
tree.contains(node); // true / false

// First match in pre-order - O(n)
const node = tree.find((value) => value === 'docs');

// All matches in pre-order - O(n)
const leaves = tree.findAll((_value, node) => node.isLeaf);

// Depth of a node (root is 0) - O(depth)
tree.depth(node);

// Values from the root down to the node - O(depth)
tree.path(node); // ['root', 'docs', 'api']
```

#### Traversal

All traversals are generators and accept an optional `from` node to traverse only that subtree.

```typescript
// Pre-order: node, then children left to right - O(n)
[...tree.preOrder()];

// Post-order: children left to right, then node - O(n)
[...tree.postOrder()];

// Level-order (breadth-first) - O(n)
[...tree.levelOrder()];

// Subtree traversal
[...tree.preOrder(someNode)];

// Default iteration is pre-order
for (const value of tree) {
  console.log(value);
}
const values = tree.toArray();
```

#### Transforming

```typescript
// Bottom-up reduction (leaves to root) - O(n)
const total = tree.fold<number>(
  (value, childResults) => value + childResults.reduce((a, b) => a + b, 0),
);

// New tree with the same shape and mapped values - O(n)
const upper = tree.map((value) => value.toUpperCase());

// New tree keeping nodes whose value AND all ancestors pass - O(n)
const visible = tree.filter((value) => !value.startsWith('.'));
```

`filter` drops a failing node together with its whole subtree (descendants of a failing node are not tested). If the root fails, the result is empty.

#### Nested Objects

```typescript
// Build from a plain { value, children? } object - O(n)
const fromData = Tree.fromNested({
  value: 'root',
  children: [{ value: 'a', children: [{ value: 'a1' }] }, { value: 'b' }],
});

// Convert back (leaves have no `children` key) - O(n)
const nested = fromData.toNested();
```

## Examples

### File System Paths

```typescript
const fs = new Tree<string>();
const root = fs.setRoot('/');
const home = fs.addChild(root, 'home');
const user = fs.addChild(home, 'alice');
const docs = fs.addChild(user, 'docs');
fs.addChild(root, 'etc');

console.log(fs.path(docs).join('/').replace('//', '/')); // "/home/alice/docs"
console.log(fs.depth(docs)); // 3
console.log([...fs.levelOrder()]); // ['/', 'home', 'etc', 'alice', 'docs']
```

### Summing Values up a Hierarchy

```typescript
interface Item {
  name: string;
  cost: number;
}

const budget = new Tree<Item>();
const total = budget.setRoot({ name: 'Total', cost: 0 });
const travel = budget.addChild(total, { name: 'Travel', cost: 0 });
budget.addChild(travel, { name: 'Flights', cost: 1200 });
budget.addChild(travel, { name: 'Hotels', cost: 800 });
budget.addChild(total, { name: 'Equipment', cost: 500 });

const sum = budget.fold<number>(
  (item, children) => item.cost + children.reduce((a, b) => a + b, 0),
);
console.log(sum); // 2500

const travelOnly = budget.fold<number>(
  (item, children) => item.cost + children.reduce((a, b) => a + b, 0),
  travel,
);
console.log(travelOnly); // 2000
```

### Rendering an Indented Outline

```typescript
const outline = Tree.fromNested({
  value: 'Guide',
  children: [
    { value: 'Install', children: [{ value: 'npm' }, { value: 'Deno' }] },
    { value: 'Usage' },
  ],
});

for (const node of outline.findAll(() => true)) {
  console.log('  '.repeat(outline.depth(node)) + node.value);
}
// Guide
//   Install
//     npm
//     Deno
//   Usage
```

## Error Handling

```typescript
import {
  EmptyStructureError,
  IndexOutOfBoundsError,
  InvalidOperationError,
  Tree,
} from '@dstoolkit/data-structures';

const tree = new Tree<number>();

try {
  tree.fold(() => 0); // Empty tree
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Tree is empty');
  }
}

const root = tree.setRoot(1);
try {
  tree.insertChildAt(root, 5, 2); // Only index 0 is valid
} catch (error) {
  if (error instanceof IndexOutOfBoundsError) {
    console.log('Invalid index');
  }
}

const other = new Tree<number>();
other.setRoot(0);
try {
  other.addChild(root, 2); // root belongs to `tree`, not `other`
} catch (error) {
  if (error instanceof InvalidOperationError) {
    console.log('Node does not belong to this tree');
  }
}

// Queries that can miss never throw
console.log(tree.find((v) => v === 42)); // null
console.log(tree.findAll((v) => v === 42)); // []
```

| Error                   | Thrown when                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `EmptyStructureError`   | `fold()` is called on an empty tree without a `from` node                                     |
| `IndexOutOfBoundsError` | `insertChildAt()` or `move()` receives an index outside the valid range                       |
| `InvalidOperationError` | Wrong owner, detached node, root already set, cycle in `move`, invalid input/options, limits  |
| `InvalidOperationError` | A traversal continues after the tree was structurally modified (see Safety Guarantees below)  |

## Safety Guarantees

`Tree` is built to hold arbitrary and untrusted data safely.

- **No recursion.** Every traversal, `fold`, `height`, `map`, `filter`, `find`, `fromNested` and `toNested` uses an explicit stack or queue. A tree that is hundreds of thousands of levels deep will not overflow the call stack.
- **Ownership validation.** Every node remembers which tree owns it. Passing a node from another tree throws `InvalidOperationError`. Removed nodes (and their descendants) become _detached_ and are rejected by every tree. `contains(node)` is a constant-time ownership check.
- **Read-only structure.** `node.children` returns a frozen snapshot, never the internal array. Structure can only change through `Tree` methods.
- **Cycle prevention.** `move(node, newParent)` throws if `newParent` is `node` itself or one of its descendants.
- **Untrusted input in `fromNested`.** Each input node must be a non-null object with its own `value` property, and `children` (if present) must be an array. Only `value` and `children` are read, so keys like `__proto__` or `constructor` cannot pollute prototypes. Cycles and shared references (the same object appearing twice) are detected and rejected instead of looping forever.
- **Optional bounds.** `maxSize` and `maxDepth` are enforced by `addChild`, `insertChildAt`, `move` and `fromNested`. `fromNested` checks them while building, so oversized input fails fast.
- **Fail-fast iterators.** Structural changes (`setRoot`, `addChild`, `insertChildAt`, `remove`, `move`, `clear`) invalidate running traversals; the next step throws `InvalidOperationError`. Callbacks passed to `find`, `findAll`, `fold`, `map` and `filter` that modify the tree throw in the same way. Assigning `node.value` is not a structural change.

:::tip
Use `maxSize` and `maxDepth` whenever a tree is built from user-supplied data to put a hard cap on memory use.
:::

## Performance Characteristics

| Operation                                  | Time Complexity | Extra Space | Description                          |
| ------------------------------------------ | --------------- | ----------- | ------------------------------------ |
| `setRoot()`                                | O(1)            | O(1)        | Create the root                      |
| `addChild()`                               | O(1)\*          | O(1)        | Append a child                       |
| `insertChildAt()`                          | O(k)            | O(1)        | Insert a child at an index           |
| `remove()`                                 | O(s + k)        | O(s)        | Remove a node and its subtree        |
| `move()`                                   | O(depth + k)\*  | O(1)        | Move a subtree (with cycle check)    |
| `contains()`                               | O(1)            | O(1)        | Ownership check                      |
| `depth()` / `path()`                       | O(depth)        | O(1) / O(d) | Depth / values from root             |
| `find()` / `findAll()`                     | O(n)            | O(n)        | Pre-order search                     |
| `preOrder()`                               | O(n)            | O(n)        | Explicit stack (O(h) for narrow trees) |
| `postOrder()`                              | O(n)            | O(h)        | Explicit stack                       |
| `levelOrder()`                             | O(n)            | O(w)        | Queue                                |
| `fold()`                                   | O(n)            | O(h + k)    | Bottom-up reduction                  |
| `height`                                   | O(n)            | O(n)        | Longest root-to-leaf path            |
| `map()` / `filter()`                       | O(n)            | O(n)        | Build a new tree                     |
| `fromNested()` / `toNested()`              | O(n)            | O(n)        | Convert from/to nested objects       |
| `clear()`                                  | O(n)            | O(n)        | Detach all nodes                     |

where:

- `n` = number of nodes
- `h` = height of the tree
- `w` = maximum width (nodes on one level)
- `k` = number of siblings
- `s` = size of the removed subtree

\* When `maxDepth` is set, `addChild`/`insertChildAt` also pay O(depth), and `move` also pays O(size of the moved subtree), to check the limit.

:::info When to Use Tree
Perfect for:

- **File systems and folders** - Paths and breadcrumbs with `path()`
- **Category and menu hierarchies** - Ordered children and subtree moves
- **Org charts and budgets** - Roll up values with `fold()`
- **Parsed documents** - Outlines, ASTs and nested JSON structures
:::

:::warning When to Avoid
Consider alternatives when:

- **You need sorted values** → Use [RedBlackTree](./red-black-tree)
- **You need prefix lookups on strings** → Use [Trie](./trie)
- **You need key-value lookups** → Use [SortedMap](./sorted-map) or `Map`
:::

## See Also

### Related Examples

- [File System Explorer](../examples/tree-file-system.md)
- [Budget Rollup](../examples/tree-budget-rollup.md)

### Other Data Structures

- [Trie](./trie.md) - Prefix tree for string keys
- [RedBlackTree](./red-black-tree.md) - Sorted unique values
- [Queue](./queue.md) - Used internally for level-order traversal
