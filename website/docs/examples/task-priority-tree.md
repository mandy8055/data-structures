---
id: task-priority-tree
title: Task Priority System
sidebar_label: Task Priority System
description: Implement a task priority system with RedBlackTree
keywords: [red-black-tree, priority, task, sorting, example]
---

# Task Priority System with RedBlackTree

Use RedBlackTree to maintain tasks in priority order with efficient lookups.

## Implementation

```typescript
import { RedBlackTree } from '@msnkr/data-structures';

interface Task {
  id: number;
  priority: number;
  name: string;
}

// Higher priority number = higher priority
const tasks = new RedBlackTree<Task>({
  comparator: (a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // Descending by priority
    }
    return a.id - b.id; // Tie-breaker by ID
  },
});

// Add tasks
tasks.insert({ id: 1, priority: 2, name: 'Medium task' });
tasks.insert({ id: 2, priority: 3, name: 'High priority task' });
tasks.insert({ id: 3, priority: 1, name: 'Low priority task' });

// Get highest priority task
const highestPriority = tasks.max();
console.log(highestPriority); // { id: 2, priority: 3, name: 'High priority task' }

// Process tasks in priority order
for (const task of tasks) {
  console.log(`Processing: ${task.name} (Priority: ${task.priority})`);
}
```

## Output

```
Processing: High priority task (Priority: 3)
Processing: Medium task (Priority: 2)
Processing: Low priority task (Priority: 1)
```

## Why RedBlackTree?

- **Sorted order** - Always maintains priority ordering
- **O(log n) operations** - Efficient inserts and deletes
- **No duplicates** - Automatic deduplication by task

## See Also

- [RedBlackTree API Reference](../api/red-black-tree.md)
- [PriorityQueue API Reference](../api/priority-queue.md)
