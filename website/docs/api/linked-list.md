---
id: linked-list
title: LinkedList
sidebar_label: LinkedList
description: Singly linked list with O(1) insertions at both ends
keywords:
  [linked-list, singly-linked-list, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# LinkedList

A singly linked list implementation that provides efficient operations for adding and removing elements, especially at the beginning and end.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='LinkedList' />

## Usage

```typescript
import { LinkedList } from '@msnkr/data-structures';

const list = new LinkedList<number>();
```

## API Reference

### Properties

- `size: number` - Number of elements in the list
- `isEmpty(): boolean` - Whether the list is empty

### Methods

#### Adding Elements

```typescript
// Add to end - O(1)
list.append(1);

// Add to start - O(1)
list.prepend(0);

// Insert at specific position - O(n)
list.insertAt(2, 1);
```

:::tip Performance
Insertions at the beginning and end are O(1) constant time.
:::

#### Removing Elements

```typescript
// Remove from start - O(1)
const first = list.removeFirst();

// Remove at specific position - O(n)
const element = list.removeAt(1);

// Remove first occurrence of value - O(n)
const removed = list.remove(42);
```

#### Accessing Elements

```typescript
// Get element at position - O(n)
const element = list.get(0);

// Find position of element - O(n)
const index = list.indexOf(42);

// Check if element exists - O(n)
const exists = list.contains(42);
```

#### Utility Methods

```typescript
// Convert to array - O(n)
const array = list.toArray();

// Remove all elements - O(1)
list.clear();
```

#### Iteration

```typescript
const list = new LinkedList<string>();
list.append('a');
list.append('b');

// Forward iteration
for (const value of list) {
  console.log(value);
}
```

## Examples

### Basic Usage

```typescript
const list = new LinkedList<number>();

// Add elements
list.append(1); // [1]
list.append(2); // [1, 2]
list.prepend(0); // [0, 1, 2]

console.log(list.toArray()); // [0, 1, 2]
console.log(list.size); // 3
```

### Building a Task List

```typescript
const tasks = new LinkedList<string>();

// Add tasks
tasks.append('Review PRs');
tasks.append('Write tests');
tasks.prepend('Morning standup'); // High priority

// Process tasks in order
while (!tasks.isEmpty()) {
  const task = tasks.removeFirst();
  console.log(`Processing: ${task}`);
}
```

## Error Handling

```typescript
import {
  EmptyStructureError,
  IndexOutOfBoundsError,
} from '@msnkr/data-structures';

try {
  const empty = new LinkedList<number>();
  empty.removeFirst(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('List is empty!');
  }
}

try {
  const list = new LinkedList<number>();
  list.append(1);
  list.get(10); // Throws IndexOutOfBoundsError
} catch (error) {
  if (error instanceof IndexOutOfBoundsError) {
    console.log('Index out of range!');
  }
}
```

:::caution Error Conditions

- `removeFirst()` throws `EmptyStructureError` on empty list
- `get()`, `insertAt()`, `removeAt()` throw `IndexOutOfBoundsError` for invalid indices
  :::

## Performance Characteristics

| Operation       | Time Complexity | Description                 |
| --------------- | --------------- | --------------------------- |
| `append()`      | O(1)            | Add element to end          |
| `prepend()`     | O(1)            | Add element to start        |
| `insertAt()`    | O(n)            | Insert at specific position |
| `removeFirst()` | O(1)            | Remove element from start   |
| `removeAt()`    | O(n)            | Remove at specific position |
| `remove()`      | O(n)            | Remove first occurrence     |
| `get()`         | O(n)            | Access element at position  |
| `indexOf()`     | O(n)            | Find position of element    |
| `contains()`    | O(n)            | Search for element          |
| `clear()`       | O(1)            | Remove all elements         |
| `toArray()`     | O(n)            | Convert to array            |

**Space Complexity:** O(n) where n is the number of elements

## Implementation Details

### Internal Structure

- Uses a singly linked node structure
- Maintains both head and tail pointers for O(1) append
- Each node contains a value and next pointer

:::info When to Use LinkedList
Perfect for:

- Frequent insertions/deletions at the beginning
- Forward-only traversal
- When memory overhead of doubly linked list isn't needed
- Building queues, stacks, or simple lists
  :::

:::warning When to Avoid
Consider alternatives when:

- **Random access is frequent** → Use Array
- **Bidirectional traversal needed** → Use [DoublyLinkedList](./doubly-linked-list)
- **Memory is extremely constrained** → Use Array
  :::

## See Also

**Examples:**

- [Task Queue](../examples/task-queue-linked-list) - Building a task processing queue
- [Navigation History](../examples/navigation-history) - Managing navigation history

**Related Data Structures:**

- [DoublyLinkedList](./doubly-linked-list) - Bidirectional linked list with reverse iteration
- [Queue](./queue) - First-In-First-Out (FIFO) queue
- [Deque](./deque) - Double-ended queue
