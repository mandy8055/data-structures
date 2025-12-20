---
id: deque
title: Deque
sidebar_label: Deque
description: Doppelendige Warteschlange mit O(1) Operationen an beiden Enden
keywords: [deque, double-ended-queue, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# Deque

Doppelendige Warteschlangenimplementierung mit effizienten Einfüge- und Löschoperationen an beiden Enden.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='Deque' />

## Verwendung

```typescript
import { Deque } from '@msnkr/data-structures';

const deque = new Deque<number>();
```

## API-Referenz

### Eigenschaften

- `size: number` - Anzahl der Elemente in der Deque
- `isEmpty(): boolean` - Ob die Deque leer ist

### Methoden

#### Elemente hinzufügen

```typescript
// Am Anfang hinzufügen - O(1)
deque.addFirst(1);

// Am Ende hinzufügen - O(1)
deque.addLast(2);
```

:::tip Leistung
Hinzufüge- und Löschoperationen an beiden Enden erfolgen in O(1) konstanter Zeit.
:::

#### Elemente entfernen

```typescript
// Vom Anfang entfernen - O(1)
const first = deque.removeFirst();

// Vom Ende entfernen - O(1)
const last = deque.removeLast();
```

#### Auf Elemente zugreifen

```typescript
// Erstes Element ansehen - O(1)
const first = deque.peekFirst();

// Letztes Element ansehen - O(1)
const last = deque.peekLast();

// Element-Existenz prüfen - O(n)
const exists = deque.contains(1);
```

#### Iteration

```typescript
// Vorwärtsiteration (vom Anfang zum Ende)
for (const value of deque) {
  console.log(value);
}

// Rückwärtsiteration (vom Ende zum Anfang)
for (const value of deque.reverseIterator()) {
  console.log(value);
}
```

#### Weitere Operationen

```typescript
// Alle Elemente entfernen - O(1)
deque.clear();

// In Array konvertieren - O(n)
const array = deque.toArray();
```

## Beispiele

### Grundlegende Verwendung an beiden Enden

```typescript
const deque = new Deque<number>();

// Elemente an beiden Enden hinzufügen
deque.addFirst(1); // [1]
deque.addLast(2); // [1, 2]
deque.addFirst(0); // [0, 1, 2]

console.log([...deque]); // [0, 1, 2]
```

### Warteschlangenoperationen (FIFO)

```typescript
const queue = new Deque<string>();

// Einreihen
queue.addLast('first');
queue.addLast('second');

// Entfernen
const first = queue.removeFirst(); // "first"
const second = queue.removeFirst(); // "second"
```

### Stapeloperationen (LIFO)

```typescript
const stack = new Deque<number>();

// Push
stack.addFirst(1);
stack.addFirst(2);

// Pop
const top = stack.removeFirst(); // 2
```

## Fehlerbehandlung

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new Deque<number>();
  empty.removeFirst(); // Wirft EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Deque is empty!');
  }
}
```

:::caution Leere Deque
Das Aufrufen von `removeFirst()`, `removeLast()`, `peekFirst()` oder `peekLast()` auf einer leeren Deque wirft einen `EmptyStructureError`.
:::

## Leistungsmerkmale

| Operation       | Zeitkomplexität | Beschreibung           |
| --------------- | --------------- | ---------------------- |
| `addFirst()`    | O(1)            | Element am Anfang hinzufügen |
| `addLast()`     | O(1)            | Element am Ende hinzufügen |
| `removeFirst()` | O(1)            | Element vom Anfang entfernen |
| `removeLast()`  | O(1)            | Element vom Ende entfernen |
| `peekFirst()`   | O(1)            | Erstes Element ansehen |
| `peekLast()`    | O(1)            | Letztes Element ansehen |
| `contains()`    | O(n)            | Nach Element suchen |
| `clear()`       | O(1)            | Alle Elemente entfernen |
| `toArray()`     | O(n)            | In Array konvertieren |

:::tip Anwendungsfälle
Deque ist ideal für:

- Doppelendige Puffer
- Gleichzeitiges Implementieren von Warteschlangen und Stapeln
- Sliding-Window-Algorithmen
- Rückgängig/Wiederholen-Stapel
  :::

## Siehe auch

- [Queue](./queue) - First In First Out (FIFO) Warteschlange mit O(1) Enqueue/Dequeue
- **[PriorityQueue](./priority-queue.md)** - Warteschlange mit prioritätsbasierter Sortierung
