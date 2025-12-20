---
id: task-queue-linked-list
title: Task Queue
sidebar_label: Task Queue
description: Aufgaben der Reihe nach mit LinkedList verarbeiten
keywords: [linked-list, queue, task, example]
---

# Task Queue mit LinkedList

Verarbeiten Sie Aufgaben in First-In-First-Out (FIFO) Reihenfolge.

## Implementierung

```typescript
import { LinkedList } from '@msnkr/data-structures';

interface Task {
  id: number;
  name: string;
  priority?: string;
}

const taskQueue = new LinkedList<Task>();

// Aufgaben zur Warteschlange hinzufügen
taskQueue.append({ id: 1, name: 'Process payment' });
taskQueue.append({ id: 2, name: 'Send confirmation email' });
taskQueue.append({ id: 3, name: 'Update inventory' });

// Aufgabe mit hoher Priorität an den Anfang setzen
taskQueue.prepend({ id: 0, name: 'Emergency backup', priority: 'HIGH' });

// Aufgaben der Reihe nach verarbeiten
while (!taskQueue.isEmpty()) {
  const task = taskQueue.removeFirst();
  console.log(`Processing task #${task.id}: ${task.name}`);
}
```

## Ausgabe

```
Processing task #0: Emergency backup
Processing task #1: Process payment
Processing task #2: Send confirmation email
Processing task #3: Update inventory
```

## Praktische Verwendung

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

## Siehe auch

- [LinkedList API-Referenz](../api/linked-list.md)
- [Queue API-Referenz](../api/queue.md) - Dedizierte FIFO-Warteschlange
- [PriorityQueue](../api/priority-queue.md) - Für prioritätsbasierte Verarbeitung
