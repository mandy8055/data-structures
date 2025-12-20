---
id: priority-queue
title: PriorityQueue
sidebar_label: PriorityQueue
description: Priority queue with O(log n) enqueue/dequeue backed by binary heap
keywords:
  [priority-queue, heap, data-structure, typescript, javascript, min-heap]
---

import InstallTabs from '@site/src/components/InstallTabs';

# PriorityQueue

A generic priority queue implementation backed by a binary min-heap, where elements are dequeued based on their priority rather than insertion order.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='PriorityQueue' />

## Usage

```typescript
import { PriorityQueue } from '@msnkr/data-structures';

const queue = new PriorityQueue<number>();
```

## API Reference

### Properties

- `size: number` - Number of elements in the queue
- `isEmpty(): boolean` - Whether the queue is empty

### Methods

#### Queue Operations

```typescript
// Add element - O(log n)
queue.enqueue(5);

// Remove highest priority element - O(log n)
const next = queue.dequeue();

// Peek at highest priority element - O(1)
const top = queue.peek();
```

:::tip Performance
Enqueue and dequeue operations are O(log n), making priority queues efficient even with thousands of elements.
:::

#### Utility Operations

```typescript
// Check if element exists - O(n)
const exists = queue.contains(42);

// Remove all elements - O(1)
queue.clear();

// Convert to array (heap order) - O(n)
const array = queue.toArray();

// Convert to sorted array (priority order) - O(n log n)
const sorted = queue.toSortedArray();
```

#### Iteration

```typescript
// Iterate in heap order (not necessarily priority order)
for (const value of queue) {
  console.log(value);
}
```

:::info Iteration Order
The iterator returns elements in heap order, which may not be priority order. For sorted output, use `toSortedArray()`.
:::

## Examples

### Basic Number Priority Queue

```typescript
const queue = new PriorityQueue<number>();

// By default, smaller numbers have higher priority (min-heap)
queue.enqueue(5);
queue.enqueue(3);
queue.enqueue(7);
queue.enqueue(1);

console.log(queue.dequeue()); // 1 (highest priority)
console.log(queue.dequeue()); // 3
console.log(queue.peek()); // 5 (next without removing)
```

### Custom Priority with Objects

```typescript
interface Task {
  name: string;
  priority: number;
}

// Higher priority number means higher priority
const taskQueue = new PriorityQueue<Task>({
  comparator: (a, b) => b.priority - a.priority,
});

taskQueue.enqueue({ name: 'Low Priority', priority: 1 });
taskQueue.enqueue({ name: 'High Priority', priority: 3 });
taskQueue.enqueue({ name: 'Medium Priority', priority: 2 });

console.log(taskQueue.dequeue()); // { name: "High Priority", priority: 3 }
console.log(taskQueue.dequeue()); // { name: "Medium Priority", priority: 2 }
console.log(taskQueue.dequeue()); // { name: "Low Priority", priority: 1 }
```

### Initialize with Values

```typescript
const queue = new PriorityQueue<number>({
  initial: [5, 3, 7, 1, 4],
});

console.log(queue.size); // 5
console.log(queue.dequeue()); // 1
console.log(queue.peek()); // 3
```

:::tip Efficient Initialization
Initializing with an array uses an O(n) heapify algorithm, which is more efficient than enqueueing elements one by one (O(n log n)).
:::

## Error Handling

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new PriorityQueue<number>();
  empty.dequeue(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Queue is empty!');
  }
}

try {
  const empty = new PriorityQueue<number>();
  empty.peek(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Cannot peek at empty queue!');
  }
}
```

:::caution Empty Queue
`dequeue()` and `peek()` throw `EmptyStructureError` when called on an empty queue. Always check `isEmpty()` first.
:::

## Performance Characteristics

| Operation          | Time Complexity | Description                     |
| ------------------ | --------------- | ------------------------------- |
| `enqueue()`        | O(log n)        | Add element with priority       |
| `dequeue()`        | O(log n)        | Remove highest priority element |
| `peek()`           | O(1)            | View highest priority element   |
| `contains()`       | O(n)            | Search for element              |
| `toArray()`        | O(n)            | Convert to array (heap order)   |
| `toSortedArray()`  | O(n log n)      | Convert to sorted array         |
| `clear()`          | O(1)            | Remove all elements             |
| **Initialization** | O(n)            | Create from array               |

**Space Complexity:** O(n) where n is the number of elements

## Implementation Details

### Internal Structure

- Backed by a binary min-heap (array-based)
- Heap property ensures root is always highest priority
- Custom comparators allow flexible priority definitions
- Default: smaller values = higher priority

### Comparator Function

The comparator function determines priority:

- **Return negative**: `a` has higher priority than `b`
- **Return positive**: `b` has higher priority than `a`
- **Return zero**: Equal priority

```typescript
// Min-heap (default): smaller values have higher priority
(a, b) => a - b

// Max-heap: larger values have higher priority
(a, b) => b - a
```

:::info When to Use PriorityQueue
Perfect for:

- Task scheduling with priorities
- Event-driven simulations
- Dijkstra's shortest path algorithm
- Huffman coding
- A\* pathfinding
- Job scheduling systems
- Merge k sorted lists
  :::

:::warning When to Avoid
Consider alternatives when:

- **Need FIFO order** → Use [Queue](./queue)
- **Need LIFO order** → Use [Deque](./deque) as stack
- **Need stable ordering** → Priority queue doesn't guarantee order for equal priorities
  :::

## See Also

**Examples:**

- [Event Queue](../examples/event-queue) - Processing events by timestamp

**Guides:**

- [Heap Algorithms](../guides/heap-algorithms) - Dijkstra's algorithm and more

**Related Data Structures:**

- [BinaryHeap](./binary-heap) - Low-level heap implementation (MinHeap, MaxHeap)
- [Queue](./queue) - First-In-First-Out (FIFO) queue
- [Deque](./deque) - Double-ended queue
