---
id: red-black-tree
title: RedBlackTree
sidebar_label: RedBlackTree
description: Self-balancing binary search tree with O(log n) guaranteed operations
keywords:
  [
    red-black-tree,
    self-balancing-tree,
    bst,
    data-structure,
    typescript,
    javascript,
  ]
---

import InstallTabs from '@site/src/components/InstallTabs';

# RedBlackTree

A self-balancing binary search tree implementation that maintains balance using red-black coloring rules, ensuring O(log n) operations for insertion, deletion, and search.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='RedBlackTree' />

## Usage

```typescript
import { RedBlackTree } from '@msnkr/data-structures';

const tree = new RedBlackTree<number>();
```

## API Reference

### Properties

- `size: number` - Number of elements in the tree
- `isEmpty(): boolean` - Whether the tree is empty

### Methods

#### Tree Operations

```typescript
// Insert element - O(log n)
tree.insert(value);

// Remove element - O(log n)
const removed = tree.remove(value);

// Check if element exists - O(log n)
const exists = tree.contains(value);
```

:::tip Self-Balancing
Red-Black Tree automatically rebalances after insertions and deletions, guaranteeing O(log n) performance even in worst-case scenarios.
:::

#### Min/Max Operations

```typescript
// Get minimum element - O(log n)
const min = tree.min();

// Get maximum element - O(log n)
const max = tree.max();
```

#### Utility Operations

```typescript
// Remove all elements - O(1)
tree.clear();

// Convert to sorted array - O(n)
const array = tree.toArray();
```

#### Iteration

```typescript
// Iterate in sorted order (in-order traversal)
for (const value of tree) {
  console.log(value);
}
```

:::info Sorted Iteration
Iteration always returns elements in sorted order via in-order traversal.
:::

## Examples

### Basic Number Tree

```typescript
const tree = new RedBlackTree<number>();

tree.insert(5);
tree.insert(3);
tree.insert(7);
tree.insert(1);
tree.insert(9);

console.log(tree.contains(3)); // true
console.log(tree.contains(4)); // false

console.log(tree.min()); // 1
console.log(tree.max()); // 9
console.log(tree.size); // 5

// Iterate in sorted order
for (const value of tree) {
  console.log(value); // 1, 3, 5, 7, 9
}
```

### Sorted Set of Unique Values

```typescript
const uniqueNumbers = new RedBlackTree<number>();

// Inserting duplicates has no effect
uniqueNumbers.insert(5);
uniqueNumbers.insert(3);
uniqueNumbers.insert(5); // Duplicate, ignored

console.log(uniqueNumbers.size); // 2 (not 3)
console.log(uniqueNumbers.toArray()); // [3, 5]
```

### Custom Comparison with Objects

```typescript
interface User {
  id: number;
  name: string;
}

const userTree = new RedBlackTree<User>({
  comparator: (a, b) => a.id - b.id,
});

userTree.insert({ id: 3, name: 'Charlie' });
userTree.insert({ id: 1, name: 'Alice' });
userTree.insert({ id: 2, name: 'Bob' });

// Check if user exists
console.log(userTree.contains({ id: 2, name: 'Bob' })); // true

// Iterate in ID order
for (const user of userTree) {
  console.log(user.name); // Alice, Bob, Charlie
}
```

### Initialize with Values

```typescript
const tree = new RedBlackTree<number>({
  initial: [5, 3, 7, 1, 9, 4, 6],
});

console.log(tree.min()); // 1
console.log(tree.max()); // 9
console.log(tree.size); // 7
console.log(tree.toArray()); // [1, 3, 4, 5, 6, 7, 9]
```

### Event Timeline

```typescript
interface Event {
  timestamp: Date;
  type: string;
  data: unknown;
}

const timeline = new RedBlackTree<Event>({
  comparator: (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
});

timeline.insert({
  timestamp: new Date('2025-12-17T10:00'),
  type: 'login',
  data: {},
});
timeline.insert({
  timestamp: new Date('2025-12-17T09:00'),
  type: 'startup',
  data: {},
});
timeline.insert({
  timestamp: new Date('2025-12-17T11:00'),
  type: 'logout',
  data: {},
});

// Get earliest event
const first = timeline.min();
console.log(first.type); // "startup"

// Process events chronologically
for (const event of timeline) {
  console.log(`${event.timestamp.toISOString()}: ${event.type}`);
}
```

### Product Catalog by Price

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
}

const catalog = new RedBlackTree<Product>({
  comparator: (a, b) => {
    if (a.price !== b.price) {
      return a.price - b.price;
    }
    return a.id.localeCompare(b.id);
  },
});

catalog.insert({ id: 'p1', name: 'Widget', price: 19.99 });
catalog.insert({ id: 'p2', name: 'Gadget', price: 9.99 });
catalog.insert({ id: 'p3', name: 'Tool', price: 29.99 });

// Get cheapest product
const cheapest = catalog.min();
console.log(`Cheapest: ${cheapest.name} at $${cheapest.price}`);
```

### Removing Elements

```typescript
const tree = new RedBlackTree<number>({ initial: [5, 3, 7, 1, 9] });

console.log(tree.remove(3)); // true
console.log(tree.remove(3)); // false (already removed)

console.log(tree.contains(3)); // false
console.log(tree.size); // 4
console.log(tree.toArray()); // [1, 5, 7, 9]
```

## Error Handling

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new RedBlackTree<number>();
  empty.min(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Tree is empty!');
  }
}

try {
  const empty = new RedBlackTree<number>();
  empty.max(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Cannot get max from empty tree!');
  }
}

// Non-existent elements
const tree = new RedBlackTree<number>();
console.log(tree.contains(999)); // false
console.log(tree.remove(999)); // false
```

:::caution Empty Tree Operations
`min()` and `max()` throw `EmptyStructureError` when called on an empty tree. Always check `isEmpty()` first.
:::

## Performance Characteristics

| Operation    | Time Complexity | Description              |
| ------------ | --------------- | ------------------------ |
| `insert()`   | O(log n)        | Add element to tree      |
| `remove()`   | O(log n)        | Remove element from tree |
| `contains()` | O(log n)        | Check if element exists  |
| `min()`      | O(log n)        | Get minimum element      |
| `max()`      | O(log n)        | Get maximum element      |
| `toArray()`  | O(n)            | Convert to sorted array  |
| `clear()`    | O(1)            | Remove all elements      |

**Space Complexity:** O(n) where n is the number of elements

:::tip Guaranteed Performance
Unlike regular binary search trees which can degrade to O(n), Red-Black Trees guarantee O(log n) for all operations through self-balancing.
:::

## Implementation Details

### Red-Black Properties

The tree maintains these invariants for balanced performance:

1. **Every node is red or black**
2. **Root is always black**
3. **All leaves (NIL) are black**
4. **Red nodes have black children** (no two red nodes in a row)
5. **All paths from root to leaves have equal black node count** (black-height)

### Balancing Operations

The tree stays balanced through:

**Rotations:**

- **Left rotation**: When right subtree becomes too heavy
- **Right rotation**: When left subtree becomes too heavy

**Recoloring:**

- Color flips to maintain red-black properties
- Applied during insertion and deletion

### Tree Structure Example

```
         7(B)
        /     \
      4(R)    11(R)
     /  \     /   \
   2(B) 5(B) 8(B) 14(B)

(B) = Black node
(R) = Red node
```

:::info When to Use RedBlackTree
Perfect for:

- **Sorted unique values** - Maintain sorted set
- **Range queries** - Need min/max efficiently
- **Ordered iteration** - Always traverse in sorted order
- **Guaranteed performance** - Need O(log n) worst-case
- **Set operations** - Union, intersection (via sorted iteration)
- **Database indexing** - Efficient lookups with ordering
  :::

:::warning When to Avoid
Consider alternatives when:

- **Don't need sorting** → Use HashSet/Set (O(1) operations)
- **Need duplicates** → Red-Black Tree stores unique values only
- **Memory constrained** → Each node has color and 2-3 pointers
- **Simple use case** → Regular Set might be simpler
  :::

## Comparison with Other Structures

| Feature              | RedBlackTree        | Set/HashSet            | Array (sorted)           |
| -------------------- | ------------------- | ---------------------- | ------------------------ |
| **Insert**           | O(log n)            | O(1) average           | O(n) (shift elements)    |
| **Search**           | O(log n)            | O(1) average           | O(log n) (binary search) |
| **Delete**           | O(log n)            | O(1) average           | O(n) (shift elements)    |
| **Min/Max**          | O(log n)            | O(n) (must scan)       | O(1) (at ends)           |
| **Sorted iteration** | O(n)                | O(n log n) (must sort) | O(n) (already sorted)    |
| **Memory**           | Higher (tree nodes) | Lower (hash table)     | Lowest (contiguous)      |
| **Duplicates**       | No                  | No                     | Yes (if allowed)         |

## Red-Black Tree vs AVL Tree

Both are self-balancing BSTs, but with trade-offs:

| Feature       | RedBlackTree                       | AVL Tree                    |
| ------------- | ---------------------------------- | --------------------------- |
| **Balancing** | Less strict (faster insert/delete) | More strict (faster search) |
| **Height**    | ≤ 2 × log(n)                       | ≤ 1.44 × log(n)             |
| **Use case**  | Frequent modifications             | Read-heavy workloads        |
| **Rotations** | Fewer (faster updates)             | More (better balance)       |

## See Also

### Related Examples

- [Task Priority System](../examples/task-priority-tree.md)
- [Case-Insensitive Sorting](../examples/case-insensitive-sorting.md)

### Other Data Structures

- [SortedMap](./sorted-map.md) - Key-value store built on Red-Black Tree
- [BinaryHeap](./binary-heap.md) - For priority queue operations
- [PriorityQueue](./priority-queue.md) - Alternative for priority-based processing
