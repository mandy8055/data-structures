---
id: deque
title: Deque
sidebar_label: Deque
description: Double-ended queue (deque) with O(1) operations at both ends
keywords: [deque, double-ended-queue, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# Deque

A double-ended queue (deque) implementation that efficiently supports insertion and removal of elements at both ends.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='Deque' />

## Usage

```typescript
import { Deque } from '@msnkr/data-structures';

const deque = new Deque<number>();
```

## API Reference

### Properties

- `size: number` - Number of elements in the deque
- `isEmpty(): boolean` - Whether the deque is empty

### Methods

#### Adding Elements

```typescript
// Add to front - O(1)
deque.addFirst(1);

// Add to back - O(1)
deque.addLast(2);
```

:::tip Performance
Add and remove operations at either end are O(1) constant time.
:::

#### Removing Elements

```typescript
// Remove from front - O(1)
const first = deque.removeFirst();

// Remove from back - O(1)
const last = deque.removeLast();
```

#### Accessing Elements

```typescript
// Peek at front element - O(1)
const first = deque.peekFirst();

// Peek at back element - O(1)
const last = deque.peekLast();

// Check if element exists - O(n)
const exists = deque.contains(1);
```

#### Iteration

```typescript
// Forward iteration (front to back)
for (const value of deque) {
  console.log(value);
}

// Reverse iteration (back to front)
for (const value of deque.reverseIterator()) {
  console.log(value);
}
```

#### Other Operations

```typescript
// Remove all elements - O(1)
deque.clear();

// Convert to array - O(n)
const array = deque.toArray();
```

## Examples

### Basic Usage with Both Ends

```typescript
const deque = new Deque<number>();

// Add elements at both ends
deque.addFirst(1); // [1]
deque.addLast(2); // [1, 2]
deque.addFirst(0); // [0, 1, 2]

console.log([...deque]); // [0, 1, 2]
```

### Queue Operations (FIFO)

```typescript
const queue = new Deque<string>();

// Enqueue
queue.addLast('first');
queue.addLast('second');

// Dequeue
const first = queue.removeFirst(); // "first"
const second = queue.removeFirst(); // "second"
```

### Stack Operations (LIFO)

```typescript
const stack = new Deque<number>();

// Push
stack.addFirst(1);
stack.addFirst(2);

// Pop
const top = stack.removeFirst(); // 2
```

## Error Handling

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new Deque<number>();
  empty.removeFirst(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Deque is empty!');
  }
}
```

:::caution Empty Deque
Calling `removeFirst()`, `removeLast()`, `peekFirst()` or `peekLast()` on an empty deque throws an `EmptyStructureError`.
:::

## Performance Characteristics

| Operation       | Time Complexity | Description               |
| --------------- | --------------- | ------------------------- |
| `addFirst()`    | O(1)            | Add element to front      |
| `addLast()`     | O(1)            | Add element to back       |
| `removeFirst()` | O(1)            | Remove element from front |
| `removeLast()`  | O(1)            | Remove element from back  |
| `peekFirst()`   | O(1)            | View front element        |
| `peekLast()`    | O(1)            | View back element         |
| `contains()`    | O(n)            | Search for element        |
| `clear()`       | O(1)            | Remove all elements       |
| `toArray()`     | O(n)            | Convert to array          |

:::tip Use Cases
Deque is perfect for:

- Double-ended buffers
- Implementing both queues and stacks
- Sliding window algorithms
- Undo/redo stacks
  :::

## See Also

- [Queue](./queue) - First-In-First-Out (FIFO) queue with O(1) enqueue/dequeue
- **PriorityQueue** - Queue with priority-based ordering _(coming soon)_
