# Red-Black Tree

A generic self-balancing binary search tree implementation that maintains balance using red-black coloring rules to ensure O(log n) operations.

## Usage

```typescript
import { RedBlackTree } from 'jsr:@mskr/data-structures';

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
// Iterate in sorted order
for (const value of tree) {
  console.log(value);
}
```

## Examples

### Basic Number Tree

```typescript
const tree = new RedBlackTree<number>();

tree.insert(5);
tree.insert(3);
tree.insert(7);

console.log(tree.contains(3)); // true
console.log(tree.min()); // 3
console.log(tree.max()); // 7

// Iterate in sorted order
for (const value of tree) {
  console.log(value); // 3, 5, 7
}
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

userTree.insert({ id: 1, name: 'Alice' });
userTree.insert({ id: 2, name: 'Bob' });
userTree.insert({ id: 3, name: 'Charlie' });

console.log(userTree.contains({ id: 2, name: 'Bob' })); // true
```

### Initial Values

```typescript
const tree = new RedBlackTree<number>({
  initial: [5, 3, 7, 1, 4],
});

console.log(tree.min()); // 1
console.log(tree.max()); // 7
```

### Custom String Ordering

```typescript
const names = new RedBlackTree<string>({
  comparator: (a, b) => a.localeCompare(b),
});

names.insert('Charlie');
names.insert('Alice');
names.insert('Bob');

// Will iterate in alphabetical order
for (const name of names) {
  console.log(name); // Alice, Bob, Charlie
}
```

### With Custom Class

```typescript
class Product {
  constructor(public id: number, public name: string, public price: number) {}
}

const products = new RedBlackTree<Product>({
  comparator: (a, b) => {
    // First compare by price
    if (a.price !== b.price) {
      return a.price - b.price;
    }
    // Then by id
    return a.id - b.id;
  },
});
```

## Error Handling

```typescript
try {
  const empty = new RedBlackTree<number>();
  empty.min(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Tree is empty!');
  }
}
```

## Performance Characteristics

- Insert: O(log n)
- Remove: O(log n)
- Contains: O(log n)
- Min/Max: O(log n)
- toArray: O(n)
- Space complexity: O(n)

## Implementation Details

The Red-Black Tree maintains the following properties to ensure balanced operations:

1. Every node is either red or black
2. The root is always black
3. All leaves (NIL nodes) are black
4. If a node is red, both its children are black
5. Every path from root to leaves contains the same number of black nodes

### Key Features

1. Generic type support
2. Customizable element ordering through comparator function
3. Optional initialization with existing values
4. In-order traversal for sorted iteration
5. Self-balancing for guaranteed O(log n) operations
6. Type-safe implementation with full TypeScript support

### Balancing Operations

The tree maintains balance through color adjustments and rotations:

1. Left rotation: Used when right child becomes too heavy
2. Right rotation: Used when left child becomes too heavy
3. Color flips: Used to maintain red-black properties
4. Recoloring during insert and delete operations

### Comparison Handling

The tree supports flexible element comparison through:

1. Default comparison using < and > operators
2. Custom comparator function for complex objects
3. Consistent handling of equality for duplicates
