---
id: queue
title: Queue
sidebar_label: Queue
description: First-In-First-Out (FIFO) Warteschlangenimplementierung mit O(1) Enqueue- und Dequeue-Operationen
keywords: [queue, fifo, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# Queue

Eine First-In-First-Out (FIFO) Warteschlangenimplementierung, die effizient das Einfügen am Ende und das Entfernen am Anfang unterstützt.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='Queue' />

## Verwendung

```typescript
import { Queue } from '@msnkr/data-structures';

const queue = new Queue<number>();
```

## API-Referenz

### Eigenschaften

- `size: number` - Anzahl der Elemente in der Warteschlange
- `isEmpty(): boolean` - Ob die Warteschlange leer ist

### Methoden

#### Elemente hinzufügen

```typescript
// Am Ende hinzufügen (enqueue) - O(1)
queue.enqueue(1);
```

:::tip Performance
Enqueue-Operationen sind O(1) konstante Zeit - extrem schnell!
:::

#### Elemente entfernen

```typescript
// Vom Anfang entfernen (dequeue) - O(1)
const first = queue.dequeue();
```

#### Zugriff auf Elemente

```typescript
// Element am Anfang ansehen - O(1)
const front = queue.peek();

// Prüfen, ob Element existiert - O(n)
const exists = queue.contains(1);
```

#### Iteration

```typescript
// Vorwärts-Iteration (Anfang bis Ende) - nicht-destruktiv
for (const value of queue) {
  console.log(value);
}

// Elemente leeren (entfernt während der Iteration) - O(n)
for (const value of queue.drain()) {
  console.log(value); // Jedes Element verarbeiten und entfernen
}
```

#### Weitere Operationen

```typescript
// Alle Elemente entfernen - O(1)
queue.clear();

// In Array konvertieren - O(n)
const array = queue.toArray();
```

## Beispiele

### Grundlegende Warteschlangenoperationen

```typescript
const queue = new Queue<number>();

// Elemente hinzufügen
queue.enqueue(1); // [1]
queue.enqueue(2); // [1, 2]
queue.enqueue(3); // [1, 2, 3]

console.log([...queue]); // [1, 2, 3]

// Elemente entfernen
const first = queue.dequeue(); // 1
const second = queue.dequeue(); // 2
```

### Aufgaben in Reihenfolge verarbeiten

```typescript
interface Task {
  id: number;
  name: string;
}

const taskQueue = new Queue<Task>();

// Aufgaben zur Verarbeitung hinzufügen
taskQueue.enqueue({ id: 1, name: 'Task 1' });
taskQueue.enqueue({ id: 2, name: 'Task 2' });

// Aufgaben in FIFO-Reihenfolge verarbeiten
while (!taskQueue.isEmpty()) {
  const task = taskQueue.dequeue();
  console.log(`Processing ${task.name}`);
}
```

### Datenpufferung

```typescript
const buffer = new Queue<string>();

// Eingehende Daten puffern
function receiveData(data: string) {
  buffer.enqueue(data);
}

// Gepufferte Daten verarbeiten
function processBuffer() {
  while (!buffer.isEmpty()) {
    const data = buffer.dequeue();
    console.log(`Processing: ${data}`);
  }
}

receiveData('chunk1');
receiveData('chunk2');
processBuffer(); // Verarbeitet in Reihenfolge: chunk1, chunk2
```

### Warteschlangenelemente leeren

Die `drain()`-Methode bietet eine sauberere Möglichkeit, alle Elemente zu verarbeiten und zu entfernen:

```typescript
const queue = new Queue<number>();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

// Synchrone Verarbeitung - leert alle Elemente
for (const item of queue.drain()) {
  console.log(item); // 1, 2, 3
}
console.log(queue.size); // 0 - Warteschlange ist jetzt leer

// Asynchrone Verarbeitung
const asyncQueue = new Queue<string>();
asyncQueue.enqueue('task1');
asyncQueue.enqueue('task2');

for (const task of asyncQueue.drain()) {
  await processTask(task);
}

// Frühzeitiger Abbruch - verbleibende Elemente bleiben in der Warteschlange
const partialQueue = new Queue<number>();
partialQueue.enqueue(1);
partialQueue.enqueue(2);
partialQueue.enqueue(3);

for (const item of partialQueue.drain()) {
  if (item === 2) break;
}
console.log(partialQueue.size); // 1 - Element 3 bleibt
```

## Fehlerbehandlung

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new Queue<number>();
  empty.dequeue(); // Wirft EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Queue is empty!');
  }
}
```

:::caution Leere Warteschlange
Der Aufruf von `dequeue()` oder `peek()` auf einer leeren Warteschlange wirft einen `EmptyStructureError`.
:::

## Leistungsmerkmale

| Operation    | Zeitkomplexität | Beschreibung               |
| ------------ | --------------- | -------------------------- |
| `enqueue()`  | O(1)            | Element am Ende hinzufügen |
| `dequeue()`  | O(1)            | Element vom Anfang entfernen |
| `peek()`     | O(1)            | Element am Anfang ansehen |
| `contains()` | O(n)            | Nach Element suchen |
| `clear()`    | O(1)            | Alle Elemente entfernen |
| `toArray()`  | O(n)            | In Array konvertieren |

:::tip Anwendungsfälle

- Aufgabenplanung
- Anforderungsverarbeitung
- Pufferverwaltung
- Nachrichtenwarteschlangen
- Breitensuche (BFS)
  :::

## Siehe auch

- [Deque](./deque) - Doppelendige Warteschlange mit O(1) Operationen an beiden Enden
- [PriorityQueue](./priority-queue) - Warteschlange mit prioritätsbasierter Reihenfolge
- [LinkedList](./linked-list) - Einfach verkettete Liste (alternative Warteschlangenimplementierung)
