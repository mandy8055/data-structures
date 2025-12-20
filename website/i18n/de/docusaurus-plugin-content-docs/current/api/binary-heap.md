---
id: binary-heap
title: BinaryHeap (MinHeap, MaxHeap)
sidebar_label: BinaryHeap
description: Min-Heap- und Max-Heap-Implementierungen mit O(log n) Einfügen/Entfernen
keywords: [binary-heap, min-heap, max-heap, heap, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# BinaryHeap

Eine generische binäre Heap-Implementierung, die sowohl MinHeap- als auch MaxHeap-Varianten mit effizienten prioritätsbasierten Operationen bereitstellt.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='MinHeap, MaxHeap' />

## Verwendung

```typescript
import { MinHeap, MaxHeap } from '@msnkr/data-structures';

const minHeap = new MinHeap<number>();
const maxHeap = new MaxHeap<number>();
```

## API-Referenz

### Eigenschaften

- `size: number` - Anzahl der Elemente im Heap
- `isEmpty(): boolean` - Ob der Heap leer ist

### Methoden

#### Grundlegende Operationen

```typescript
// Element einfügen - O(log n)
heap.insert(5);

// Wurzelelement entfernen - O(log n)
const root = heap.remove();

// Wurzelelement ansehen - O(1)
const top = heap.peek();
```

:::tip Performance
Einfüge- und Entfernoperationen sind O(log n), mit O(1) Zugriff auf das minimale (MinHeap) oder maximale (MaxHeap) Element.
:::

#### Suche und Hilfsfunktionen

```typescript
// Prüfen, ob Element existiert - O(n)
const exists = heap.contains(42);

// Alle Elemente entfernen - O(1)
heap.clear();

// In Array konvertieren (Level-Order) - O(n)
const array = heap.toArray();
```

#### Iteration

```typescript
// Level-Order-Traversierung
for (const value of heap) {
  console.log(value);
}
```

## Beispiele

### MinHeap-Verwendung

```typescript
const minHeap = new MinHeap<number>();

// Elemente einfügen
minHeap.insert(5);
minHeap.insert(3);
minHeap.insert(7);
minHeap.insert(1);

console.log(minHeap.peek()); // 1 (minimales Element)
console.log(minHeap.remove()); // 1
console.log(minHeap.peek()); // 3 (neues Minimum)
console.log(minHeap.size); // 3
```

### MaxHeap-Verwendung

```typescript
const maxHeap = new MaxHeap<number>();

// Elemente einfügen
maxHeap.insert(5);
maxHeap.insert(3);
maxHeap.insert(7);
maxHeap.insert(10);

console.log(maxHeap.peek()); // 10 (maximales Element)
console.log(maxHeap.remove()); // 10
console.log(maxHeap.peek()); // 7 (neues Maximum)
```

### Effiziente Heap-Konstruktion

```typescript
// Heap aus Array erstellen - O(n)
const minHeap = new MinHeap<number>(null, [5, 3, 8, 1, 7, 4]);
console.log(minHeap.peek()); // 1 (minimales Element)
console.log(minHeap.size); // 6

// Ebenso für MaxHeap
const maxHeap = new MaxHeap<number>(null, [5, 3, 8, 1, 7]);
console.log(maxHeap.peek()); // 8 (maximales Element)
console.log(maxHeap.size); // 5
```

:::tip Effiziente Initialisierung
Der Aufbau eines Heaps aus einem Array verwendet einen O(n) Heapify-Algorithmus, der deutlich schneller ist als das Einfügen von Elementen einzeln (O(n log n)).
:::

### Benutzerdefinierter Komparator für Objekte

```typescript
interface Person {
  name: string;
  age: number;
}

// Min-Heap nach Alter
const byAge = (a: Person, b: Person) => a.age - b.age;
const minHeap = new MinHeap<Person>(byAge);

minHeap.insert({ name: 'Alice', age: 25 });
minHeap.insert({ name: 'Bob', age: 20 });
minHeap.insert({ name: 'Charlie', age: 30 });

console.log(minHeap.peek()); // { name: "Bob", age: 20 }
```

### K größte Elemente finden

```typescript
function findKLargest(arr: number[], k: number): number[] {
  const minHeap = new MinHeap<number>();

  for (const num of arr) {
    minHeap.insert(num);
    if (minHeap.size > k) {
      minHeap.remove(); // Kleinstes entfernen
    }
  }

  return minHeap.toArray().sort((a, b) => b - a);
}

const numbers = [3, 1, 5, 12, 2, 11, 9, 7];
console.log(findKLargest(numbers, 3)); // [12, 11, 9]
```

### Median-Finder

```typescript
class MedianFinder {
  private maxHeap = new MaxHeap<number>(); // Untere Hälfte
  private minHeap = new MinHeap<number>(); // Obere Hälfte

  addNum(num: number): void {
    // Zuerst zum Max-Heap hinzufügen (untere Hälfte)
    this.maxHeap.insert(num);

    // Ausgleichen: Größtes von unten nach oben verschieben
    this.minHeap.insert(this.maxHeap.remove());

    // Größen ausgleichen: maxHeap sollte gleich viele oder 1 Element mehr haben
    if (this.maxHeap.size < this.minHeap.size) {
      this.maxHeap.insert(this.minHeap.remove());
    }
  }

  findMedian(): number {
    if (this.maxHeap.size > this.minHeap.size) {
      return this.maxHeap.peek();
    }
    return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
  }
}

const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
console.log(mf.findMedian()); // 1.5
mf.addNum(3);
console.log(mf.findMedian()); // 2
```

## Fehlerbehandlung

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new MinHeap<number>();
  empty.remove(); // Wirft EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Heap is empty!');
  }
}

try {
  const empty = new MaxHeap<number>();
  empty.peek(); // Wirft EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Cannot peek at empty heap!');
  }
}
```

:::caution Leerer Heap
`remove()` und `peek()` werfen `EmptyStructureError`, wenn sie auf einem leeren Heap aufgerufen werden.
:::

## Leistungsmerkmale

| Operation        | Zeitkomplexität | Beschreibung                 |
| ---------------- | --------------- | ---------------------------- |
| `insert()`       | O(log n)        | Element zum Heap hinzufügen  |
| `remove()`       | O(log n)        | Wurzelelement entfernen      |
| `peek()`         | O(1)            | Wurzelelement ansehen        |
| `contains()`     | O(n)            | Nach Element suchen          |
| `toArray()`      | O(n)            | In Array konvertieren        |
| `clear()`        | O(1)            | Alle Elemente entfernen      |
| **Konstruktion** | O(n)            | Heap aus Array aufbauen      |

**Platzkomplexität:** O(n), wobei n die Anzahl der Elemente ist

## Implementierungsdetails

### Array-basierte Speicherung

Der Heap wird als vollständiger Binärbaum in einem Array gespeichert. Für jeden Knoten am Index `i`:

- **Linkes Kind**: `2i + 1`
- **Rechtes Kind**: `2i + 2`
- **Elternteil**: `⌊(i - 1) / 2⌋`

```
       1
      / \
     3   2
    / \
   5   4

Array: [1, 3, 2, 5, 4]
Indizes: 0  1  2  3  4
```

### Heap-Eigenschaft

**MinHeap**: Elternteil ≤ Kinder (Wurzel ist Minimum)
**MaxHeap**: Elternteil ≥ Kinder (Wurzel ist Maximum)

### Heapify-Algorithmus

Bei der Initialisierung mit einem Array verwendet der Heap den Heapify-Algorithmus von Floyd:
- Beginnt beim letzten Nicht-Blatt-Knoten
- Arbeitet rückwärts und "siftet" jeden Knoten nach unten
- Zeitkomplexität: O(n) - effizienter als n Einfügungen (O(n log n))

:::info Wann BinaryHeap verwenden
Perfekt für:
- Effizientes Finden von Min/Max-Elementen
- Priority-Queue-Implementierungen
- K größte/kleinste Elemente Probleme
- Heapsort-Algorithmus
- Median-Findung (Zwei-Heap-Ansatz)
- Streaming-Daten mit Top-k-Abfragen
:::

:::warning MinHeap vs MaxHeap
Wählen Sie basierend auf Ihren Anforderungen:
- **MinHeap**: Schneller Zugriff auf minimales Element
- **MaxHeap**: Schneller Zugriff auf maximales Element
- Kann Min und Max nicht gleichzeitig effizient abrufen
:::

## Vergleich mit PriorityQueue

| Merkmal             | BinaryHeap                | PriorityQueue                |
| ------------------- | ------------------------- | ---------------------------- |
| **API**             | `insert()`, `remove()`    | `enqueue()`, `dequeue()`     |
| **Anwendungsfall**  | Low-Level-Heap-Operationen | Queue-ähnliche Prioritätsbehandlung |
| **Abstraktion**     | Direkte Heap-Manipulation | Höherstufige Queue-Schnittstelle |

:::tip Welches verwenden?
- Verwenden Sie **PriorityQueue** für Aufgabenplanung, Ereigniswarteschlangen (Queue-Semantik)
- Verwenden Sie **BinaryHeap** für Algorithmen, die direkte Heap-Operationen erfordern (Heapsort usw.)
:::

## Siehe auch

- [PriorityQueue](./priority-queue) - Höherstufige Priority-Queue auf Heap-Basis
- [Queue](./queue) - First-In-First-Out (FIFO) Warteschlange
