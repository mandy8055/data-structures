---
id: task-queue-linked-list
title: Task Queue
sidebar_label: Task Queue
description: Process tasks in order using LinkedList
keywords: [linked-list, queue, task, example]
---

# Task Queue with LinkedList

Process tasks in First-In-First-Out (FIFO) order.

## Implementation

```typescript
import { LinkedList } from '@msnkr/data-structures';

interface Task {
  id: number;
  name: string;
  priority?: string;
}

const taskQueue = new LinkedList<Task>();

// Add tasks to queue
taskQueue.append({ id: 1, name: 'Process payment' });
taskQueue.append({ id: 2, name: 'Send confirmation email' });
taskQueue.append({ id: 3, name: 'Update inventory' });

// Add high-priority task at the front
taskQueue.prepend({ id: 0, name: 'Emergency backup', priority: 'HIGH' });

// Process tasks in order
while (!taskQueue.isEmpty()) {
  const task = taskQueue.removeFirst();
  console.log(`Processing task #${task.id}: ${task.name}`);
}
```

## Output

```
Processing task #0: Emergency backup
Processing task #1: Process payment
Processing task #2: Send confirmation email
Processing task #3: Update inventory
```

## Real-world Usage

```typescript
class TaskProcessor {
  private queue = new LinkedList<Task>();

  addTask(task: Task): void {
    this.queue.append(task);
    console.log(`Added task: ${task.name} (Queue size: ${this.queue.size})`);
  }

  processNext(): Task | null {
    if (this.queue.isEmpty()) {
      return null;
    }
    return this.queue.removeFirst();
  }

  peek(): Task | null {
    return this.queue.get(0);
  }

  clear(): void {
    this.queue.clear();
  }
}

const processor = new TaskProcessor();
processor.addTask({ id: 1, name: 'Task 1' });
processor.addTask({ id: 2, name: 'Task 2' });
console.log('Next task:', processor.peek());
```

## See Also

- [LinkedList API Reference](../api/linked-list.md)
- [Queue API Reference](../api/queue.md) - Dedicated FIFO queue
- [PriorityQueue](../api/priority-queue.md) - For priority-based processing
