---
id: binary-heap
title: BinaryHeap (MinHeap, MaxHeap)
sidebar_label: BinaryHeap
description: Min-heap and max-heap implementations with O(log n) insert/remove
keywords:
  [
    binary-heap,
    min-heap,
    max-heap,
    heap,
    data-structure,
    typescript,
    javascript,
  ]
---

import InstallTabs from '@site/src/components/InstallTabs';

# BinaryHeap

A generic binary heap implementation providing both MinHeap and MaxHeap variants with efficient priority-based operations.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='MinHeap, MaxHeap' />

## Usage

```typescript
import { MinHeap, MaxHeap } from '@msnkr/data-structures';

const minHeap = new MinHeap<number>();
const maxHeap = new MaxHeap<number>();
```

## API Reference

### Properties

- `size: number` - Number of elements in the heap
- `isEmpty(): boolean` - Whether the heap is empty

### Methods

#### Basic Operations

```typescript
// Insert element - O(log n)
heap.insert(5);

// Remove root element - O(log n)
const root = heap.remove();

// Peek at root element - O(1)
const top = heap.peek();
```

:::tip Performance
Insert and remove operations are O(log n), with O(1) access to the minimum (MinHeap) or maximum (MaxHeap) element.
:::

#### Searching and Utility

```typescript
// Check if element exists - O(n)
const exists = heap.contains(42);

// Remove all elements - O(1)
heap.clear();

// Convert to array (level-order) - O(n)
const array = heap.toArray();
```

#### Iteration

```typescript
// Level-order traversal
for (const value of heap) {
  console.log(value);
}
```

## Examples

### MinHeap Usage

```typescript
const minHeap = new MinHeap<number>();

// Insert elements
minHeap.insert(5);
minHeap.insert(3);
minHeap.insert(7);
minHeap.insert(1);

console.log(minHeap.peek()); // 1 (minimum element)
console.log(minHeap.remove()); // 1
console.log(minHeap.peek()); // 3 (new minimum)
console.log(minHeap.size); // 3
```

### MaxHeap Usage

```typescript
const maxHeap = new MaxHeap<number>();

// Insert elements
maxHeap.insert(5);
maxHeap.insert(3);
maxHeap.insert(7);
maxHeap.insert(10);

console.log(maxHeap.peek()); // 10 (maximum element)
console.log(maxHeap.remove()); // 10
console.log(maxHeap.peek()); // 7 (new maximum)
```

### Efficient Heap Construction

```typescript
// Create a heap from an array - O(n)
const minHeap = new MinHeap<number>(null, [5, 3, 8, 1, 7, 4]);
console.log(minHeap.peek()); // 1 (minimum element)
console.log(minHeap.size); // 6

// Similarly for MaxHeap
const maxHeap = new MaxHeap<number>(null, [5, 3, 8, 1, 7]);
console.log(maxHeap.peek()); // 8 (maximum element)
console.log(maxHeap.size); // 5
```

:::tip Efficient Initialization
Building a heap from an array uses an O(n) heapify algorithm, which is significantly faster than inserting elements one by one (O(n log n)).
:::

### Custom Comparator for Objects

```typescript
interface Person {
  name: string;
  age: number;
}

// Min-heap by age
const byAge = (a: Person, b: Person) => a.age - b.age;
const minHeap = new MinHeap<Person>(byAge);

minHeap.insert({ name: 'Alice', age: 25 });
minHeap.insert({ name: 'Bob', age: 20 });
minHeap.insert({ name: 'Charlie', age: 30 });

console.log(minHeap.peek()); // { name: "Bob", age: 20 }
```

### Type-Safe Comparable Objects

```typescript
class ComparablePerson implements Comparable<ComparablePerson> {
  constructor(public name: string, public age: number) {}

  compareTo(other: ComparablePerson): number {
    return this.age - other.age;
  }
}

const heap = new MinHeap<ComparablePerson>();
heap.insert(new ComparablePerson('Alice', 25));
heap.insert(new ComparablePerson('Bob', 20));

console.log(heap.peek()); // ComparablePerson { name: "Bob", age: 20 }
```

## Error Handling

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new MinHeap<number>();
  empty.remove(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Heap is empty!');
  }
}

try {
  const empty = new MaxHeap<number>();
  empty.peek(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Cannot peek at empty heap!');
  }
}
```

:::caution Empty Heap
`remove()` and `peek()` throw `EmptyStructureError` when called on an empty heap.
:::

## Performance Characteristics

| Operation        | Time Complexity | Description           |
| ---------------- | --------------- | --------------------- |
| `insert()`       | O(log n)        | Add element to heap   |
| `remove()`       | O(log n)        | Remove root element   |
| `peek()`         | O(1)            | View root element     |
| `contains()`     | O(n)            | Search for element    |
| `toArray()`      | O(n)            | Convert to array      |
| `clear()`        | O(1)            | Remove all elements   |
| **Construction** | O(n)            | Build heap from array |

**Space Complexity:** O(n) where n is the number of elements

## Implementation Details

### Array-Based Storage

The heap is implemented as a complete binary tree stored in an array. For any node at index `i`:

- **Left child**: `2i + 1`
- **Right child**: `2i + 2`
- **Parent**: `⌊(i - 1) / 2⌋`

```
       1
      / \
     3   2
    / \
   5   4

Array: [1, 3, 2, 5, 4]
Indices: 0  1  2  3  4
```

### Heap Property

**MinHeap**: Parent ≤ Children (root is minimum)
**MaxHeap**: Parent ≥ Children (root is maximum)

### Heapify Algorithm

When initializing with an array, the heap uses Floyd's heapify algorithm:

- Starts from the last non-leaf node
- Works backwards, "sifting down" each node
- Time complexity: O(n) - more efficient than n insertions (O(n log n))

:::info When to Use BinaryHeap
Perfect for:

- Finding min/max element efficiently
- Priority queue implementations
- K largest/smallest elements problems
- Heap sort algorithm
- Median finding (two-heap approach)
- Streaming data with top-k queries
  :::

:::warning MinHeap vs MaxHeap
Choose based on your needs:

- **MinHeap**: Quick access to minimum element
- **MaxHeap**: Quick access to maximum element
- Can't efficiently access both min and max simultaneously
  :::

## Comparison with PriorityQueue

| Feature         | BinaryHeap                | PriorityQueue                |
| --------------- | ------------------------- | ---------------------------- |
| **API**         | `insert()`, `remove()`    | `enqueue()`, `dequeue()`     |
| **Use Case**    | Low-level heap operations | Queue-like priority handling |
| **Abstraction** | Direct heap manipulation  | Higher-level queue interface |

:::tip Which to Use?

- Use **PriorityQueue** for task scheduling, event queues (queue semantics)
- Use **BinaryHeap** for algorithms requiring direct heap operations (heap sort, etc.)
  :::

## See Also

**Guides:**

- [Heap Algorithms](../guides/heap-algorithms) - K-largest elements, median finder, and more

**Related Data Structures:**

- [PriorityQueue](./priority-queue) - Higher-level priority queue built on heap
- [Queue](./queue) - First-In-First-Out (FIFO) queue
