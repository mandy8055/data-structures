---
id: priority-queue
title: PriorityQueue
sidebar_label: PriorityQueue
description: Binary-Heap-basierte Prioritätswarteschlange mit O(log n) Enqueue/Dequeue-Operationen
keywords:
  [priority-queue, heap, data-structure, typescript, javascript, min-heap]
---

import InstallTabs from '@site/src/components/InstallTabs';

# PriorityQueue

Generische Prioritätswarteschlangen-Implementierung, unterstützt von einem binären Min-Heap, bei dem Elemente nach Priorität und nicht nach Einfügereihenfolge entnommen werden.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='PriorityQueue' />

## Verwendung

```typescript
import { PriorityQueue } from '@msnkr/data-structures';

const queue = new PriorityQueue<number>();
```

## API-Referenz

### Eigenschaften

- `size: number` - Anzahl der Elemente in der Warteschlange
- `isEmpty(): boolean` - Ob die Warteschlange leer ist

### Methoden

#### Warteschlangenoperationen

```typescript
// Element hinzufügen - O(log n)
queue.enqueue(5);

// Element mit höchster Priorität entfernen - O(log n)
const next = queue.dequeue();

// Element mit höchster Priorität ansehen - O(1)
const top = queue.peek();
```

:::tip Leistung
Enqueue- und Dequeue-Operationen erfolgen in O(log n), wodurch die Prioritätswarteschlange auch bei Tausenden von Elementen effizient ist.
:::

#### Hilfsmethoden

```typescript
// Prüfen ob Element existiert - O(n)
const exists = queue.contains(42);

// Alle Elemente entfernen - O(1)
queue.clear();

// In Array konvertieren (Heap-Reihenfolge) - O(n)
const array = queue.toArray();

// In sortiertes Array konvertieren (Prioritätsreihenfolge) - O(n log n)
const sorted = queue.toSortedArray();
```

#### Iteration

```typescript
// In Heap-Reihenfolge iterieren (nicht notwendigerweise Prioritätsreihenfolge)
for (const value of queue) {
  console.log(value);
}
```

:::info Iterationsreihenfolge
Der Iterator gibt Elemente in Heap-Reihenfolge zurück, die möglicherweise nicht der Prioritätsreihenfolge entspricht. Verwenden Sie `toSortedArray()` für sortierte Ausgabe.
:::

## Beispiele

### Grundlegende Zahlen-Prioritätswarteschlange

```typescript
const queue = new PriorityQueue<number>();

// Standardmäßig haben kleinere Zahlen höhere Priorität (Min-Heap)
queue.enqueue(5);
queue.enqueue(3);
queue.enqueue(7);
queue.enqueue(1);

console.log(queue.dequeue()); // 1 (höchste Priorität)
console.log(queue.dequeue()); // 3
console.log(queue.peek()); // 5 (ansehen ohne zu entfernen)
```

### Benutzerdefinierte Priorität für Objekte

```typescript
interface Task {
  name: string;
  priority: number;
}

// Höhere Prioritätszahlen bedeuten höhere Priorität
const taskQueue = new PriorityQueue<Task>({
  comparator: (a, b) => b.priority - a.priority,
});

taskQueue.enqueue({ name: 'Niedrige Priorität', priority: 1 });
taskQueue.enqueue({ name: 'Hohe Priorität', priority: 3 });
taskQueue.enqueue({ name: 'Mittlere Priorität', priority: 2 });

console.log(taskQueue.dequeue()); // { name: "Hohe Priorität", priority: 3 }
console.log(taskQueue.dequeue()); // { name: "Mittlere Priorität", priority: 2 }
console.log(taskQueue.dequeue()); // { name: "Niedrige Priorität", priority: 1 }
```

### Initialisierung mit Werten

```typescript
const queue = new PriorityQueue<number>({
  initial: [5, 3, 7, 1, 4],
});

console.log(queue.size); // 5
console.log(queue.dequeue()); // 1
console.log(queue.peek()); // 3
```

:::tip Effiziente Initialisierung
Die Initialisierung mit einem Array verwendet einen O(n) Heapify-Algorithmus, der effizienter ist als das einzelne Einreihen von Elementen (O(n log n)).
:::

### Aufgabenplanungssystem

```typescript
interface ScheduledTask {
  name: string;
  priority: number;
  deadline: Date;
}

const scheduler = new PriorityQueue<ScheduledTask>({
  comparator: (a, b) => {
    // Zuerst nach Priorität vergleichen (höher ist dringender)
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // Dann nach Deadline vergleichen (früher ist dringender)
    return a.deadline.getTime() - b.deadline.getTime();
  },
});

scheduler.enqueue({
  name: 'PR überprüfen',
  priority: 2,
  deadline: new Date('2025-12-20'),
});

scheduler.enqueue({
  name: 'Kritischen Fehler beheben',
  priority: 3,
  deadline: new Date('2025-12-18'),
});

scheduler.enqueue({
  name: 'Dokumentation aktualisieren',
  priority: 1,
  deadline: new Date('2025-12-19'),
});

// Aufgaben in Prioritätsreihenfolge verarbeiten
while (!scheduler.isEmpty()) {
  const task = scheduler.dequeue();
  console.log(`Verarbeite: ${task.name} (Priorität: ${task.priority})`);
}
```

### Event-Warteschlange mit Zeitstempeln

```typescript
interface Event {
  type: string;
  timestamp: Date;
}

const events = new PriorityQueue<Event>({
  comparator: (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
});

events.enqueue({ type: 'login', timestamp: new Date('2025-12-17T10:00:00') });
events.enqueue({ type: 'click', timestamp: new Date('2025-12-17T09:30:00') });
events.enqueue({ type: 'logout', timestamp: new Date('2025-12-17T11:00:00') });

// Events in chronologischer Reihenfolge verarbeiten
console.log(events.dequeue()); // { type: "click", timestamp: ... }
console.log(events.dequeue()); // { type: "login", timestamp: ... }
console.log(events.dequeue()); // { type: "logout", timestamp: ... }
```

### Dijkstra Kürzeste-Wege-Algorithmus

```typescript
interface Node {
  id: string;
  distance: number;
}

function dijkstra(graph: Map<string, [string, number][]>, start: string) {
  const distances = new Map<string, number>();
  const pq = new PriorityQueue<Node>({
    comparator: (a, b) => a.distance - b.distance,
  });

  pq.enqueue({ id: start, distance: 0 });
  distances.set(start, 0);

  while (!pq.isEmpty()) {
    const current = pq.dequeue()!;

    const neighbors = graph.get(current.id) || [];
    for (const [neighborId, weight] of neighbors) {
      const newDistance = current.distance + weight;
      const oldDistance = distances.get(neighborId) ?? Infinity;

      if (newDistance < oldDistance) {
        distances.set(neighborId, newDistance);
        pq.enqueue({ id: neighborId, distance: newDistance });
      }
    }
  }

  return distances;
}
```

### Krankenhaus-Notaufnahme-Triage

```typescript
interface Patient {
  name: string;
  severity: number; // 1-5, 5 ist am schwersten
  arrivalTime: Date;
}

const emergencyRoom = new PriorityQueue<Patient>({
  comparator: (a, b) => {
    // Zuerst nach Schweregrad
    if (a.severity !== b.severity) {
      return b.severity - a.severity;
    }
    // Bei gleichem Schweregrad nach Ankunftszeit
    return a.arrivalTime.getTime() - b.arrivalTime.getTime();
  },
});

emergencyRoom.enqueue({
  name: 'Max Mustermann',
  severity: 2,
  arrivalTime: new Date('2025-12-17T10:00'),
});

emergencyRoom.enqueue({
  name: 'Anna Schmidt',
  severity: 5,
  arrivalTime: new Date('2025-12-17T10:05'),
});

emergencyRoom.enqueue({
  name: 'Klaus Müller',
  severity: 3,
  arrivalTime: new Date('2025-12-17T10:02'),
});

// Patienten nach Schweregrad und Ankunftszeit behandeln
while (!emergencyRoom.isEmpty()) {
  const patient = emergencyRoom.dequeue()!;
  console.log(`Behandle: ${patient.name} (Schweregrad: ${patient.severity})`);
}
// Ausgabe:
// Behandle: Anna Schmidt (Schweregrad: 5)
// Behandle: Klaus Müller (Schweregrad: 3)
// Behandle: Max Mustermann (Schweregrad: 2)
```

### Job-Planung mit Prioritäten

```typescript
interface Job {
  id: number;
  priority: number;
  estimatedTime: number; // Minuten
}

const jobQueue = new PriorityQueue<Job>({
  comparator: (a, b) => {
    // Höhere Priorität zuerst
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // Bei gleicher Priorität kürzere Jobs zuerst
    return a.estimatedTime - b.estimatedTime;
  },
});

jobQueue.enqueue({ id: 1, priority: 2, estimatedTime: 30 });
jobQueue.enqueue({ id: 2, priority: 3, estimatedTime: 15 });
jobQueue.enqueue({ id: 3, priority: 2, estimatedTime: 10 });

console.log(jobQueue.dequeue()); // Job 2 (Priorität 3)
console.log(jobQueue.dequeue()); // Job 3 (Priorität 2, Zeit 10)
console.log(jobQueue.dequeue()); // Job 1 (Priorität 2, Zeit 30)
```

## Zeitkomplexität

| Operation     | Durchschnitt | Schlimmstenfalls |
| ------------- | ------------ | ---------------- |
| enqueue       | O(log n)     | O(log n)         |
| dequeue       | O(log n)     | O(log n)         |
| peek          | O(1)         | O(1)             |
| contains      | O(n)         | O(n)             |
| clear         | O(1)         | O(1)             |
| toArray       | O(n)         | O(n)             |
| toSortedArray | O(n log n)   | O(n log n)       |

## Best Practices

### Wann PriorityQueue verwenden

- ✅ Elemente müssen nach Priorität statt FIFO verarbeitet werden
- ✅ Implementierung von Dijkstra Kürzeste Wege, A\* Suche und anderen Algorithmen
- ✅ Aufgabenplanungssysteme
- ✅ Event-Simulation und diskrete Event-Systeme
- ✅ Zusammenführen von k sortierten Listen

### Wann PriorityQueue nicht verwenden

- ❌ FIFO-Reihenfolge erforderlich (verwenden Sie Queue)
- ❌ LIFO-Reihenfolge erforderlich (verwenden Sie Stack/Array)
- ❌ Direktzugriff erforderlich (verwenden Sie Array)
- ❌ Alle Elemente haben gleiche Priorität (verwenden Sie Queue)

### Comparator-Tipps

```typescript
// Min-Heap (Standard) - kleinere Werte zuerst
const minHeap = new PriorityQueue<number>();

// Max-Heap - größere Werte zuerst
const maxHeap = new PriorityQueue<number>({
  comparator: (a, b) => b - a,
});

// Benutzerdefinierter Vergleich für Objekte
const taskQueue = new PriorityQueue<Task>({
  comparator: (a, b) => {
    // Mehrere Bedingungen
    if (a.priority !== b.priority) return b.priority - a.priority;
    return a.deadline.getTime() - b.deadline.getTime();
  },
});
```

## Verwandte Datenstrukturen

- **BinaryHeap** - Zugrundeliegende Heap-Implementierung
- **Queue** - FIFO-Warteschlange ohne Prioritäten
- **Deque** - Doppelendige Warteschlange ohne Prioritäten
- **SortedMap** - Sortierte Schlüssel-Wert-Map
