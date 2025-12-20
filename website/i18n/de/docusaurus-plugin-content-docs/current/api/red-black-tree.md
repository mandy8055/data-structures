---
id: red-black-tree
title: RedBlackTree
sidebar_label: RedBlackTree
description: Selbstbalancierender binärer Suchbaum mit garantierten O(log n) Operationen
keywords:
  [
    red-black-tree,
    self-balancing-tree,
    bst,
    data-structure,
    typescript,
    javascript,
  ]
---

import InstallTabs from '@site/src/components/InstallTabs';

# RedBlackTree

Selbstbalancierende binäre Suchbaumimplementierung, die Balance durch Rot-Schwarz-Färbungsregeln aufrechterhält und O(log n) Leistung für Einfüge-, Lösch- und Suchoperationen gewährleistet.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='RedBlackTree' />

## Verwendung

```typescript
import { RedBlackTree } from '@msnkr/data-structures';

const tree = new RedBlackTree<number>();
```

## API-Referenz

### Eigenschaften

- `size: number` - Anzahl der Elemente im Baum
- `isEmpty(): boolean` - Ob der Baum leer ist

### Methoden

#### Baumoperationen

```typescript
// Element einfügen - O(log n)
tree.insert(value);

// Element entfernen - O(log n)
const removed = tree.remove(value);

// Prüfen ob Element existiert - O(log n)
const exists = tree.contains(value);
```

:::tip Selbstbalancierung
Rot-Schwarz-Bäume balancieren sich automatisch nach Einfügungen und Löschungen neu und garantieren O(log n) Leistung auch im schlimmsten Fall.
:::

#### Min/Max-Operationen

```typescript
// Minimales Element abrufen - O(log n)
const min = tree.min();

// Maximales Element abrufen - O(log n)
const max = tree.max();
```

#### Hilfsmethoden

```typescript
// Alle Elemente entfernen - O(1)
tree.clear();

// In sortiertes Array konvertieren - O(n)
const array = tree.toArray();
```

#### Iteration

```typescript
// In sortierter Reihenfolge iterieren (In-Order-Traversierung)
for (const value of tree) {
  console.log(value);
}
```

:::info Sortierte Iteration
Die Iteration gibt Elemente durch In-Order-Traversierung immer in sortierter Reihenfolge zurück.
:::

## Beispiele

### Grundlegender Zahlenbaum

```typescript
const tree = new RedBlackTree<number>();

tree.insert(5);
tree.insert(3);
tree.insert(7);
tree.insert(1);
tree.insert(9);

console.log(tree.contains(3)); // true
console.log(tree.contains(4)); // false

console.log(tree.min()); // 1
console.log(tree.max()); // 9
console.log(tree.size); // 5

// In sortierter Reihenfolge iterieren
for (const value of tree) {
  console.log(value); // 1, 3, 5, 7, 9
}
```

### Sortiertes Set eindeutiger Werte

```typescript
const uniqueNumbers = new RedBlackTree<number>();

// Doppelte Werte einfügen hat keine Wirkung
uniqueNumbers.insert(5);
uniqueNumbers.insert(3);
uniqueNumbers.insert(5); // Duplikat, wird ignoriert

console.log(uniqueNumbers.size); // 2 (nicht 3)
console.log(uniqueNumbers.toArray()); // [3, 5]
```

### Benutzerdefinierter Vergleich für Objekte

```typescript
interface User {
  id: number;
  name: string;
}

const userTree = new RedBlackTree<User>({
  comparator: (a, b) => a.id - b.id,
});

userTree.insert({ id: 3, name: 'Charlie' });
userTree.insert({ id: 1, name: 'Alice' });
userTree.insert({ id: 2, name: 'Bob' });

// Prüfen ob Benutzer existiert
console.log(userTree.contains({ id: 2, name: 'Bob' })); // true

// In ID-Reihenfolge iterieren
for (const user of userTree) {
  console.log(user.name); // Alice, Bob, Charlie
}
```

### Initialisierung mit Werten

```typescript
const tree = new RedBlackTree<number>({
  initial: [5, 3, 7, 1, 9, 4, 6],
});

console.log(tree.min()); // 1
console.log(tree.max()); // 9
console.log(tree.size); // 7
console.log(tree.toArray()); // [1, 3, 4, 5, 6, 7, 9]
```

### Groß-/Kleinschreibung-unabhängige String-Sortierung

```typescript
const names = new RedBlackTree<string>({
  comparator: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
});

names.insert('Charlie');
names.insert('alice');
names.insert('BOB');

// Wird in Groß-/Kleinschreibung-unabhängiger alphabetischer Reihenfolge iterieren
for (const name of names) {
  console.log(name); // alice, BOB, Charlie
}
```

### Aufgabenpriorisierungssystem

```typescript
interface Task {
  id: number;
  priority: number;
  name: string;
}

// Höhere Prioritätszahl = höhere Priorität
const tasks = new RedBlackTree<Task>({
  comparator: (a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // Absteigend
    }
    return a.id - b.id; // Tiebreaker nach ID
  },
});

tasks.insert({ id: 1, priority: 2, name: 'Mittlere Aufgabe' });
tasks.insert({ id: 2, priority: 3, name: 'Hohe Priorität Aufgabe' });
tasks.insert({ id: 3, priority: 1, name: 'Niedrige Priorität Aufgabe' });

// In Prioritätsreihenfolge iterieren
for (const task of tasks) {
  console.log(`${task.name} (Priorität: ${task.priority})`);
}
// Ausgabe:
// Hohe Priorität Aufgabe (Priorität: 3)
// Mittlere Aufgabe (Priorität: 2)
// Niedrige Priorität Aufgabe (Priorität: 1)
```

### Bestenlisten-System

```typescript
interface Player {
  username: string;
  score: number;
}

const leaderboard = new RedBlackTree<Player>({
  comparator: (a, b) => {
    // Nach Punktzahl absteigend sortieren
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    // Bei gleicher Punktzahl alphabetisch nach Benutzernamen
    return a.username.localeCompare(b.username);
  },
});

leaderboard.insert({ username: 'alice', score: 100 });
leaderboard.insert({ username: 'bob', score: 250 });
leaderboard.insert({ username: 'charlie', score: 180 });

console.log('Bestenliste:');
for (const player of leaderboard) {
  console.log(`${player.username}: ${player.score}`);
}
// Ausgabe:
// bob: 250
// charlie: 180
// alice: 100
```

### Zeitintervall-Planung

```typescript
interface TimeSlot {
  start: Date;
  end: Date;
  event: string;
}

const schedule = new RedBlackTree<TimeSlot>({
  comparator: (a, b) => a.start.getTime() - b.start.getTime(),
});

schedule.insert({
  start: new Date('2025-12-17T10:00'),
  end: new Date('2025-12-17T11:00'),
  event: 'Team-Meeting',
});

schedule.insert({
  start: new Date('2025-12-17T09:00'),
  end: new Date('2025-12-17T09:30'),
  event: 'Morgenbesprechung',
});

schedule.insert({
  start: new Date('2025-12-17T14:00'),
  end: new Date('2025-12-17T15:00'),
  event: 'Kundenpräsentation',
});

// Zeitplan in chronologischer Reihenfolge anzeigen
console.log('Heutiger Zeitplan:');
for (const slot of schedule) {
  console.log(`${slot.start.toLocaleTimeString()}: ${slot.event}`);
}
```

### Deduplizieren und Sortieren

```typescript
function uniqueSorted<T>(items: T[], comparator?: (a: T, b: T) => number): T[] {
  const tree = new RedBlackTree<T>({ comparator });

  for (const item of items) {
    tree.insert(item);
  }

  return tree.toArray();
}

const numbers = [5, 2, 8, 2, 1, 9, 5, 3];
console.log(uniqueSorted(numbers)); // [1, 2, 3, 5, 8, 9]

const words = ['apple', 'banana', 'apple', 'cherry', 'banana'];
console.log(uniqueSorted(words)); // ['apple', 'banana', 'cherry']
```

### Bereichsabfragen (Werte in einem Bereich finden)

```typescript
function findInRange(
  tree: RedBlackTree<number>,
  min: number,
  max: number,
): number[] {
  const result: number[] = [];

  for (const value of tree) {
    if (value >= min && value <= max) {
      result.push(value);
    } else if (value > max) {
      break; // Sortiert, können vorzeitig abbrechen
    }
  }

  return result;
}

const tree = new RedBlackTree<number>();
[5, 3, 8, 1, 9, 4, 7].forEach((n) => tree.insert(n));

console.log(findInRange(tree, 3, 7)); // [3, 4, 5, 7]
```

## Zeitkomplexität

| Operation | Durchschnitt | Schlimmstenfalls |
| --------- | ------------ | ---------------- |
| insert    | O(log n)     | O(log n)         |
| remove    | O(log n)     | O(log n)         |
| contains  | O(log n)     | O(log n)         |
| min       | O(log n)     | O(log n)         |
| max       | O(log n)     | O(log n)         |
| clear     | O(1)         | O(1)             |
| toArray   | O(n)         | O(n)             |

## Vergleich mit anderen Datenstrukturen

| Merkmal           | RedBlackTree | Set       | Array (sortiert) |
| ----------------- | ------------ | --------- | ---------------- |
| Einfügen          | O(log n)     | O(1) avg  | O(n)             |
| Löschen           | O(log n)     | O(1) avg  | O(n)             |
| Suchen            | O(log n)     | O(1) avg  | O(log n)         |
| Sortierte Iteration | ✅ Immer   | ❌ Unsortiert | ✅ Ja         |
| Min/Max           | O(log n)     | O(n)      | O(1)             |
| Garantierte Balance | ✅ Ja      | N/A       | N/A              |

## Rot-Schwarz-Baum Eigenschaften

Rot-Schwarz-Bäume pflegen folgende Eigenschaften zur Gewährleistung der Balance:

1. Jeder Knoten ist entweder rot oder schwarz
2. Der Wurzelknoten ist schwarz
3. Alle Blattknoten (NIL) sind schwarz
4. Rote Knoten können keine roten Kindknoten haben
5. Alle Pfade von einem beliebigen Knoten zu seinen Blattknoten enthalten die gleiche Anzahl schwarzer Knoten

Diese Eigenschaften gewährleisten, dass der Baum ungefähr balanciert bleibt und O(log n) Operationen garantiert.

## Best Practices

### Wann RedBlackTree verwenden

- ✅ Sortiertes Set eindeutiger Werte pflegen erforderlich
- ✅ Häufige Einfügungen und Löschungen mit sortiertem Zugriff
- ✅ Min/Max-Operationen erforderlich
- ✅ Garantierte O(log n) Leistung erforderlich
- ✅ Bereichsabfragen erforderlich

### Wann RedBlackTree nicht verwenden

- ❌ Nur Einfügen und Suchen erforderlich (verwenden Sie Set)
- ❌ Sortierung nicht erforderlich (verwenden Sie Set oder Array)
- ❌ Häufiger Direktzugriff (verwenden Sie Array)
- ❌ Doppelte Werte erlaubt (verwenden Sie Array oder benutzerdefinierte Struktur)

## Verwandte Datenstrukturen

- **SortedMap** - Auf Rot-Schwarz-Baum basierende Schlüssel-Wert-Map
- **Set** - Ungeordnetes Set eindeutiger Werte
- **BinaryHeap** - Schnellere Min/Max-Operationen, aber keine sortierte Iteration
- **Trie** - Präfixbaum speziell für Strings
