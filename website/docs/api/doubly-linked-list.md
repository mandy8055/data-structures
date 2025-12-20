---
id: doubly-linked-list
title: DoublyLinkedList
sidebar_label: DoublyLinkedList
description: Doubly linked list with O(1) operations at both ends and bidirectional traversal
keywords:
  [
    doubly-linked-list,
    linked-list,
    data-structure,
    typescript,
    javascript,
    bidirectional,
  ]
---

import InstallTabs from '@site/src/components/InstallTabs';

# DoublyLinkedList

A doubly linked list implementation that supports efficient operations at both ends and bidirectional traversal. Each node maintains references to both previous and next nodes.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='DoublyLinkedList' />

## Usage

```typescript
import { DoublyLinkedList } from '@msnkr/data-structures';

const list = new DoublyLinkedList<number>();
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
Insertions at both the beginning and end are O(1) constant time.
:::

#### Removing Elements

```typescript
// Remove from start - O(1)
const first = list.removeFirst();

// Remove from end - O(1)
const last = list.removeLast();

// Remove at specific position - O(n)
const element = list.removeAt(1);

// Remove first occurrence of value - O(n)
const removed = list.remove(42);
```

:::tip O(1) Removal at Both Ends
Unlike singly linked lists, DoublyLinkedList supports O(1) removal from the end thanks to the previous pointer.
:::

#### Accessing Elements

```typescript
// Get element at position - O(min(n/2, k))
const element = list.get(0);

// Find position of element - O(n)
const index = list.indexOf(42);

// Check if element exists - O(n)
const exists = list.contains(42);
```

:::info Optimized Access
The `get()` method is optimized to search from the closest end (head or tail), making it up to 2x faster than singly linked lists for indices near the end.
:::

#### Iteration

```typescript
const list = new DoublyLinkedList<string>();
list.append('a');
list.append('b');
list.append('c');

// Forward iteration (head to tail)
for (const value of list) {
  console.log(value); // "a", "b", "c"
}

// Reverse iteration (tail to head)
for (const value of list.reverseIterator()) {
  console.log(value); // "c", "b", "a"
}
```

#### Utility Methods

```typescript
// Convert to array - O(n)
const array = list.toArray();

// Remove all elements - O(1)
list.clear();
```

## Examples

### Basic Usage with Bidirectional Traversal

```typescript
const list = new DoublyLinkedList<number>();

// Add elements
list.append(1); // [1]
list.append(2); // [1, 2]
list.append(3); // [1, 2, 3]

// Forward traversal
console.log('Forward:', [...list]); // [1, 2, 3]

// Reverse traversal
console.log('Reverse:', [...list.reverseIterator()]); // [3, 2, 1]
```

### Efficient Operations at Both Ends

```typescript
const deque = new DoublyLinkedList<string>();

// Add at both ends
deque.append('end'); // [end]
deque.prepend('start'); // [start, end]

// Remove from both ends - both O(1)
const first = deque.removeFirst(); // "start"
const last = deque.removeLast(); // "end"

console.log(deque.isEmpty()); // true
```

## Error Handling

```typescript
import {
  EmptyStructureError,
  IndexOutOfBoundsError,
} from '@msnkr/data-structures';

try {
  const empty = new DoublyLinkedList<number>();
  empty.removeLast(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('List is empty!');
  }
}

try {
  const list = new DoublyLinkedList<number>();
  list.append(1);
  list.insertAt(2, 10); // Throws IndexOutOfBoundsError
} catch (error) {
  if (error instanceof IndexOutOfBoundsError) {
    console.log('Index out of range!');
  }
}
```

:::caution Error Conditions

- `removeFirst()`, `removeLast()` throw `EmptyStructureError` on empty list
- `get()`, `insertAt()`, `removeAt()` throw `IndexOutOfBoundsError` for invalid indices
  :::

## Performance Characteristics

| Operation       | Time Complexity | Description                 |
| --------------- | --------------- | --------------------------- |
| `append()`      | O(1)            | Add element to end          |
| `prepend()`     | O(1)            | Add element to start        |
| `insertAt()`    | O(n)            | Insert at specific position |
| `removeFirst()` | O(1)            | Remove element from start   |
| `removeLast()`  | O(1)            | Remove element from end     |
| `removeAt()`    | O(n)            | Remove at specific position |
| `remove()`      | O(n)            | Remove first occurrence     |
| `get()`         | O(min(n/2, k))  | Access element (optimized)  |
| `indexOf()`     | O(n)            | Find position of element    |
| `contains()`    | O(n)            | Search for element          |
| `clear()`       | O(1)            | Remove all elements         |
| `toArray()`     | O(n)            | Convert to array            |

**Space Complexity:** O(n) where n is the number of elements (2 pointers per node vs 1 for singly linked)

## Implementation Details

### Internal Structure

- Uses a doubly linked node structure
- Each node contains: value, previous pointer, next pointer
- Maintains both head and tail pointers
- Bidirectional traversal support

### Advantages over LinkedList

1. **O(1) removal from end** - No need to traverse to find previous node
2. **Optimized access** - Can search from closest end (head or tail)
3. **Bidirectional iteration** - Forward and reverse traversal
4. **Easier node removal** - Direct access to previous node

### Trade-offs

- **More memory** - 2 pointers per node vs 1 in singly linked list
- **Slightly more complex** - More pointer updates on modifications

:::info When to Use DoublyLinkedList
Perfect for:

- Browser history, undo/redo functionality
- Music players with forward/backward navigation
- LRU cache implementations
- When frequent removals from both ends are needed
- Applications requiring bidirectional traversal
  :::

:::warning When to Use LinkedList Instead
Consider singly LinkedList when:

- Memory is constrained (only need 1 pointer per node)
- Only forward traversal is needed
- Don't need O(1) removal from the end
  :::

## See Also

**Examples:**

- [Browser History](../examples/browser-history-doubly-linked) - Back/forward navigation
- [Music Playlist](../examples/music-playlist) - Bidirectional playlist traversal

**Related Data Structures:**

- [LinkedList](./linked-list) - Singly linked list with lower memory overhead
- [Deque](./deque) - Double-ended queue (array-based alternative)
- [Queue](./queue) - First-In-First-Out (FIFO) queue
