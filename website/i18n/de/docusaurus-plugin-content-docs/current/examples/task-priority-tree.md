---
id: task-priority-tree
title: Task Priority System
sidebar_label: Task Priority System
description: Ein Aufgabenpriorität-System mit RedBlackTree implementieren
keywords: [red-black-tree, priority, task, sorting, example]
---

# Task Priority System mit RedBlackTree

Verwenden Sie RedBlackTree, um Aufgaben in Prioritätsreihenfolge mit effizienten Lookups zu verwalten.

## Implementierung

```typescript
import { RedBlackTree } from '@msnkr/data-structures';

interface Task {
  id: number;
  priority: number;
  name: string;
}

// Höhere Prioritätsnummer = höhere Priorität
const tasks = new RedBlackTree<Task>({
  comparator: (a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // Absteigend nach Priorität
    }
    return a.id - b.id; // Tie-Breaker nach ID
  },
});

// Aufgaben hinzufügen
tasks.insert({ id: 1, priority: 2, name: 'Medium task' });
tasks.insert({ id: 2, priority: 3, name: 'High priority task' });
tasks.insert({ id: 3, priority: 1, name: 'Low priority task' });

// Höchste Priorität abrufen
const highestPriority = tasks.max();
console.log(highestPriority); // { id: 2, priority: 3, name: 'High priority task' }

// Aufgaben in Prioritätsreihenfolge verarbeiten
for (const task of tasks) {
  console.log(`Processing: ${task.name} (Priority: ${task.priority})`);
}
```

## Ausgabe

```
Processing: High priority task (Priority: 3)
Processing: Medium task (Priority: 2)
Processing: Low priority task (Priority: 1)
```

## Warum RedBlackTree?

- **Sortierte Reihenfolge** - Behält immer die Prioritätsreihenfolge bei
- **O(log n) Operationen** - Effiziente Einfügungen und Löschungen
- **Keine Duplikate** - Automatische Deduplizierung nach Aufgabe

## Siehe auch

- [RedBlackTree API-Referenz](../api/red-black-tree.md)
- [PriorityQueue API-Referenz](../api/priority-queue.md)
