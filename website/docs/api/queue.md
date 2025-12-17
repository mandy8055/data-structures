---
id: queue
title: Queue
sidebar_label: Queue
description: First-In-First-Out (FIFO) queue implementation with O(1) enqueue and dequeue operations
keywords: [queue, fifo, data-structure, typescript, javascript]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Queue

A First-In-First-Out (FIFO) queue implementation that efficiently supports insertion at the back and removal from the front.

## Installation

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install @msnkr/data-structures
```

</TabItem>
<TabItem value="deno" label="Deno (JSR)">

```typescript
import { Queue } from 'jsr:@mskr/data-structures';
```

</TabItem>
<TabItem value="browser" label="Browser (CDN)">

```html
<script type="module">
  import { Queue } from 'https://esm.sh/jsr/@mskr/data-structures';
</script>
```

</TabItem>
</Tabs>

## Usage

```typescript
import { Queue } from '@msnkr/data-structures';

const queue = new Queue<number>();
```

## API Reference

### Properties

- `size: number` - Number of elements in the queue
- `isEmpty(): boolean` - Whether the queue is empty

### Methods

#### Adding Elements

```typescript
// Add to back (enqueue) - O(1)
queue.enqueue(1);
```

:::tip Performance
Enqueue operations are O(1) constant time - extremely fast!
:::

#### Removing Elements

```typescript
// Remove from front (dequeue) - O(1)
const first = queue.dequeue();
```

#### Accessing Elements

```typescript
// Peek at front element - O(1)
const front = queue.peek();

// Check if element exists - O(n)
const exists = queue.contains(1);
```

#### Iteration

```typescript
// Forward iteration (front to back) - non-destructive
for (const value of queue) {
  console.log(value);
}

// Drain elements (removes as it iterates) - O(n)
for (const value of queue.drain()) {
  console.log(value); // Process and remove each element
}
```

#### Other Operations

```typescript
// Remove all elements - O(1)
queue.clear();

// Convert to array - O(n)
const array = queue.toArray();
```

## Examples

### Basic Queue Operations

```typescript
const queue = new Queue<number>();

// Enqueue elements
queue.enqueue(1); // [1]
queue.enqueue(2); // [1, 2]
queue.enqueue(3); // [1, 2, 3]

console.log([...queue]); // [1, 2, 3]

// Dequeue elements
const first = queue.dequeue(); // 1
const second = queue.dequeue(); // 2
```

### Processing Tasks in Order

```typescript
interface Task {
  id: number;
  name: string;
}

const taskQueue = new Queue<Task>();

// Add tasks to process
taskQueue.enqueue({ id: 1, name: 'Task 1' });
taskQueue.enqueue({ id: 2, name: 'Task 2' });

// Process tasks in FIFO order
while (!taskQueue.isEmpty()) {
  const task = taskQueue.dequeue();
  console.log(`Processing ${task.name}`);
}
```

### Buffering Data

```typescript
const buffer = new Queue<string>();

// Buffer incoming data
function receiveData(data: string) {
  buffer.enqueue(data);
}

// Process buffered data
function processBuffer() {
  while (!buffer.isEmpty()) {
    const data = buffer.dequeue();
    console.log(`Processing: ${data}`);
  }
}

receiveData('chunk1');
receiveData('chunk2');
processBuffer(); // Processes in order: chunk1, chunk2
```

### Draining Queue Elements

The `drain()` method provides a cleaner way to process and remove all elements:

```typescript
const queue = new Queue<number>();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

// Synchronous processing - drains all elements
for (const item of queue.drain()) {
  console.log(item); // 1, 2, 3
}
console.log(queue.size); // 0 - queue is now empty

// Asynchronous processing
const asyncQueue = new Queue<string>();
asyncQueue.enqueue('task1');
asyncQueue.enqueue('task2');

for (const task of asyncQueue.drain()) {
  await processTask(task);
}

// Early termination - remaining items stay in queue
const partialQueue = new Queue<number>();
partialQueue.enqueue(1);
partialQueue.enqueue(2);
partialQueue.enqueue(3);

for (const item of partialQueue.drain()) {
  if (item === 2) break;
}
console.log(partialQueue.size); // 1 - item 3 remains
```

## Error Handling

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new Queue<number>();
  empty.dequeue(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Queue is empty!');
  }
}
```

:::caution Empty Queue
Calling `dequeue()` or `peek()` on an empty queue throws an `EmptyStructureError`.
:::

## Performance Characteristics

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| `enqueue()` | O(1) | Add element to back |
| `dequeue()` | O(1) | Remove element from front |
| `peek()` | O(1) | View front element |
| `contains()` | O(n) | Search for element |
| `clear()` | O(1) | Remove all elements |
| `toArray()` | O(n) | Convert to array |

:::tip Use Cases
Queue is perfect for:
- Task scheduling
- Request processing
- Buffer management
- Message queues
- Breadth-First Search (BFS)
:::

## See Also

- **Deque** - Double-ended queue with operations at both ends _(coming soon)_
- **PriorityQueue** - Queue with priority-based ordering _(coming soon)_
