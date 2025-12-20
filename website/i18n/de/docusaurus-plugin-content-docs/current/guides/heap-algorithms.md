---
id: heap-algorithms
title: Heap-Algorithmen und Muster
sidebar_label: Heap-Algorithmen
description: Gängige Algorithmen und Muster mit Binary Heaps
keywords: [binary-heap, heap, algorithms, k-largest, median, top-k]
---

# Heap-Algorithmen und Muster

Meistern Sie gängige algorithmische Muster mit MinHeap und MaxHeap.

## Die K größten Elemente finden

Die K größten Elemente aus einem Stream oder Array effizient finden.

### Mit MinHeap

```typescript
import { MinHeap } from '@msnkr/data-structures';

function findKLargest(arr: number[], k: number): number[] {
  const minHeap = new MinHeap<number>();

  for (const num of arr) {
    minHeap.insert(num);

    // Nur k größte Elemente behalten
    if (minHeap.size > k) {
      minHeap.remove(); // Kleinstes entfernen
    }
  }

  // In absteigender Reihenfolge zurückgeben
  return minHeap.toArray().sort((a, b) => b - a);
}

const numbers = [3, 1, 5, 12, 2, 11, 9, 7, 4, 8];
console.log(findKLargest(numbers, 3)); // [12, 11, 9]
```

**Zeitkomplexität:** O(n log k), wobei n die Array-Länge ist
**Speicherkomplexität:** O(k)

**Warum MinHeap?** Wir behalten die k größten Elemente, indem wir einen Heap der Größe k unterhalten. Das kleinste Element (Wurzel des MinHeap) befindet sich am unteren Ende unseres "Top k"-Bereichs, wodurch es einfach zu entfernen ist, wenn wir ein größeres Element finden.

### Für K kleinste Elemente

```typescript
import { MaxHeap } from '@msnkr/data-structures';

function findKSmallest(arr: number[], k: number): number[] {
  const maxHeap = new MaxHeap<number>();

  for (const num of arr) {
    maxHeap.insert(num);

    if (maxHeap.size > k) {
      maxHeap.remove(); // Größtes entfernen
    }
  }

  return maxHeap.toArray().sort((a, b) => a - b);
}

console.log(findKSmallest(numbers, 3)); // [1, 2, 3]
```

## Stream Median Finder

Den Median eines Zahlenstroms in Echtzeit finden.

### Zwei-Heap-Ansatz

```typescript
import { MinHeap, MaxHeap } from '@msnkr/data-structures';

class MedianFinder {
  private maxHeap = new MaxHeap<number>(); // Untere Hälfte
  private minHeap = new MinHeap<number>(); // Obere Hälfte

  /**
   * Eine Zahl zur Datenstruktur hinzufügen
   * Zeitkomplexität: O(log n)
   */
  addNum(num: number): void {
    // Zuerst zum Max Heap (untere Hälfte) hinzufügen
    this.maxHeap.insert(num);

    // Ausgleichen: sicherstellen, dass Max der unteren <= Min der oberen
    if (!this.minHeap.isEmpty() && this.maxHeap.peek() > this.minHeap.peek()) {
      this.minHeap.insert(this.maxHeap.remove());
    }

    // Größen ausgleichen: maxHeap sollte gleich oder 1 Element mehr haben
    if (this.minHeap.size > this.maxHeap.size) {
      this.maxHeap.insert(this.minHeap.remove());
    }
    if (this.maxHeap.size > this.minHeap.size + 1) {
      this.minHeap.insert(this.maxHeap.remove());
    }
  }

  /**
   * Den Median finden
   * Zeitkomplexität: O(1)
   */
  findMedian(): number {
    if (this.maxHeap.size === 0) {
      throw new Error('Keine Elemente');
    }

    if (this.maxHeap.size > this.minHeap.size) {
      return this.maxHeap.peek(); // Ungerade Anzahl von Elementen
    }

    // Gerade Anzahl von Elementen
    return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
  }
}

// Verwendung
const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
console.log(mf.findMedian()); // 1.5

mf.addNum(3);
console.log(mf.findMedian()); // 2

mf.addNum(4);
console.log(mf.findMedian()); // 2.5
```

**Warum zwei Heaps?**

- **MaxHeap** speichert die kleinere Hälfte (Wurzel = größte der kleinen Zahlen)
- **MinHeap** speichert die größere Hälfte (Wurzel = kleinste der großen Zahlen)
- Median ist entweder das Maximum der unteren Hälfte oder der Durchschnitt beider Wurzeln

## Top K häufige Elemente

Die K häufigsten Elemente in einem Array finden.

```typescript
import { MinHeap } from '@msnkr/data-structures';

interface FrequencyPair {
  element: number;
  frequency: number;
}

function topKFrequent(arr: number[], k: number): number[] {
  // Häufigkeiten zählen
  const freqMap = new Map<number, number>();
  for (const num of arr) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Min Heap verwenden, um k häufigste zu behalten
  const minHeap = new MinHeap<FrequencyPair>({
    comparator: (a, b) => a.frequency - b.frequency,
  });

  for (const [element, frequency] of freqMap) {
    minHeap.insert({ element, frequency });

    if (minHeap.size > k) {
      minHeap.remove(); // Am wenigsten häufiges entfernen
    }
  }

  return minHeap.toArray().map((pair) => pair.element);
}

const numbers = [1, 1, 1, 2, 2, 3, 4, 4, 4, 4];
console.log(topKFrequent(numbers, 2)); // [1, 4]
```

## K sortierte Arrays zusammenführen

Mehrere sortierte Arrays effizient mit einem Heap zusammenführen.

```typescript
import { MinHeap } from '@msnkr/data-structures';

interface HeapNode {
  value: number;
  arrayIndex: number;
  elementIndex: number;
}

function mergeKSorted(arrays: number[][]): number[] {
  const minHeap = new MinHeap<HeapNode>({
    comparator: (a, b) => a.value - b.value,
  });

  // Heap mit erstem Element aus jedem Array initialisieren
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > 0) {
      minHeap.insert({
        value: arrays[i][0],
        arrayIndex: i,
        elementIndex: 0,
      });
    }
  }

  const result: number[] = [];

  while (!minHeap.isEmpty()) {
    const node = minHeap.remove();
    result.push(node.value);

    // Nächstes Element aus demselben Array hinzufügen
    const nextIndex = node.elementIndex + 1;
    if (nextIndex < arrays[node.arrayIndex].length) {
      minHeap.insert({
        value: arrays[node.arrayIndex][nextIndex],
        arrayIndex: node.arrayIndex,
        elementIndex: nextIndex,
      });
    }
  }

  return result;
}

// Verwendung
const arrays = [
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
];
console.log(mergeKSorted(arrays)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

**Zeitkomplexität:** O(N log k), wobei N die Gesamtzahl der Elemente ist, k die Anzahl der Arrays

## Sliding Window Maximum

Das Maximum in jedem Sliding Window mit einem Heap finden.

```typescript
import { MaxHeap } from '@msnkr/data-structures';

interface WindowElement {
  value: number;
  index: number;
}

function slidingWindowMaximum(arr: number[], k: number): number[] {
  const maxHeap = new MaxHeap<WindowElement>({
    comparator: (a, b) => a.value - b.value,
  });

  const result: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    // Aktuelles Element hinzufügen
    maxHeap.insert({ value: arr[i], index: i });

    // Elemente außerhalb des Fensters entfernen
    while (!maxHeap.isEmpty() && maxHeap.peek().index <= i - k) {
      maxHeap.remove();
    }

    // Maximum des aktuellen Fensters hinzufügen
    if (i >= k - 1) {
      result.push(maxHeap.peek().value);
    }
  }

  return result;
}

const arr = [1, 3, -1, -3, 5, 3, 6, 7];
console.log(slidingWindowMaximum(arr, 3)); // [3, 3, 5, 5, 6, 7]
```

## K-größtes Element im Stream

Das K-größte Element beibehalten, während neue Zahlen eintreffen.

```typescript
import { MinHeap } from '@msnkr/data-structures';

class KthLargest {
  private minHeap: MinHeap<number>;
  private k: number;

  constructor(k: number, nums: number[]) {
    this.k = k;
    this.minHeap = new MinHeap<number>();

    // Mit gegebenen Zahlen initialisieren
    for (const num of nums) {
      this.add(num);
    }
  }

  add(val: number): number {
    this.minHeap.insert(val);

    // Nur k größte Elemente behalten
    if (this.minHeap.size > this.k) {
      this.minHeap.remove();
    }

    return this.minHeap.peek(); // K-größtes
  }
}

// Verwendung
const kthLargest = new KthLargest(3, [4, 5, 8, 2]);
console.log(kthLargest.add(3)); // 4 (3. größtes: [8,5,4])
console.log(kthLargest.add(5)); // 5 (3. größtes: [8,5,5])
console.log(kthLargest.add(10)); // 5 (3. größtes: [10,8,5])
```

## Heap Sort

Ein Array mit der Heap-Datenstruktur sortieren.

```typescript
import { MaxHeap } from '@msnkr/data-structures';

function heapSort(arr: number[]): number[] {
  // Heap aus Array aufbauen - O(n)
  const maxHeap = new MaxHeap<number>(null, arr);

  const sorted: number[] = [];

  // Maximum wiederholt extrahieren - O(n log n)
  while (!maxHeap.isEmpty()) {
    sorted.unshift(maxHeap.remove()); // Am Anfang hinzufügen
  }

  return sorted;
}

const arr = [3, 1, 4, 1, 5, 9, 2, 6];
console.log(heapSort(arr)); // [1, 1, 2, 3, 4, 5, 6, 9]
```

**Zeitkomplexität:** O(n log n)
**Speicherkomplexität:** O(n)

## Task-Scheduling mit Abklingzeit

Tasks mit Abklingzeiten mit einem Heap planen.

```typescript
import { MaxHeap } from '@msnkr/data-structures';

interface Task {
  name: string;
  frequency: number;
  nextAvailable: number;
}

function scheduleTasksWithCooldown(
  tasks: string[],
  cooldown: number,
): string[] {
  // Task-Häufigkeiten zählen
  const freqMap = new Map<string, number>();
  for (const task of tasks) {
    freqMap.set(task, (freqMap.get(task) || 0) + 1);
  }

  // Max Heap nach Häufigkeit erstellen
  const maxHeap = new MaxHeap<Task>({
    comparator: (a, b) => a.frequency - b.frequency,
  });

  for (const [name, frequency] of freqMap) {
    maxHeap.insert({ name, frequency, nextAvailable: 0 });
  }

  const result: string[] = [];
  let time = 0;

  while (!maxHeap.isEmpty()) {
    const available: Task[] = [];

    // Einen Zyklus ausführen
    for (let i = 0; i <= cooldown && !maxHeap.isEmpty(); i++) {
      const task = maxHeap.remove();

      result.push(task.name);
      task.frequency--;

      if (task.frequency > 0) {
        task.nextAvailable = time + cooldown + 1;
        available.push(task);
      }

      time++;
    }

    // Tasks zurück hinzufügen, die weitere Ausführungen benötigen
    for (const task of available) {
      maxHeap.insert(task);
    }
  }

  return result;
}

const tasks = ['A', 'A', 'A', 'B', 'B', 'C'];
console.log(scheduleTasksWithCooldown(tasks, 2));
// Mögliche Ausgabe: ['A', 'B', 'C', 'A', 'B', 'idle', 'A']
```

## Leistungsmerkmale

| Operation      | MinHeap/MaxHeap | Beschreibung       |
| -------------- | --------------- | ------------------ |
| Insert         | O(log n)        | Element hinzufügen |
| Remove/Extract | O(log n)        | Wurzel entfernen   |
| Peek/Top       | O(1)            | Wurzel anzeigen    |
| Heapify        | O(n)            | Aus Array aufbauen |
| Find           | O(n)            | Element suchen     |

## Wann Heaps verwenden

✅ **Gut für:**

- K größte/kleinste Elemente finden
- Prioritätsbasierte Verarbeitung
- Median-Wartung
- K sortierte Sequenzen zusammenführen
- Scheduling mit Prioritäten

❌ **Nicht ideal für:**

- Suche nach beliebigen Elementen
- Sortierte Reihenfolge beibehalten (verwenden Sie RedBlackTree)
- FIFO/LIFO-Operationen (verwenden Sie Queue/Stack)

## Verwandte Themen

- [BinaryHeap API-Referenz](../api/binary-heap.md)
- [PriorityQueue API-Referenz](../api/priority-queue.md)
- [Event Queue Beispiel](../examples/event-queue.md)
