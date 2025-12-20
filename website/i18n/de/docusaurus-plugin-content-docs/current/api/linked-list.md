---
id: linked-list
title: LinkedList
sidebar_label: LinkedList
description: Einfach verkettete Liste mit O(1) Einfügungen an den Enden
keywords:
  [linked-list, singly-linked-list, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# LinkedList

Einfach verkettete Listenimplementierung, die effiziente Operationen zum Hinzufügen und Entfernen von Elementen bietet, insbesondere am Anfang und Ende der Liste.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='LinkedList' />

## Verwendung

```typescript
import { LinkedList } from '@msnkr/data-structures';

const list = new LinkedList<number>();
```

## API-Referenz

### Eigenschaften

- `size: number` - Anzahl der Elemente in der Liste
- `isEmpty(): boolean` - Ob die Liste leer ist

### Methoden

#### Elemente hinzufügen

```typescript
// Am Ende hinzufügen - O(1)
list.append(1);

// Am Anfang hinzufügen - O(1)
list.prepend(0);

// An Position einfügen - O(n)
list.insertAt(2, 1);
```

:::tip Leistung
Einfügungen am Anfang und Ende erfolgen in O(1) konstanter Zeit.
:::

#### Elemente entfernen

```typescript
// Vom Anfang entfernen - O(1)
const first = list.removeFirst();

// An Position entfernen - O(n)
const element = list.removeAt(1);

// Erstes Vorkommen eines Werts entfernen - O(n)
const removed = list.remove(42);
```

#### Auf Elemente zugreifen

```typescript
// Element an Position abrufen - O(n)
const element = list.get(0);

// Position eines Elements finden - O(n)
const index = list.indexOf(42);

// Element-Existenz prüfen - O(n)
const exists = list.contains(42);
```

#### Hilfsmethoden

```typescript
// In Array konvertieren - O(n)
const array = list.toArray();

// Alle Elemente entfernen - O(1)
list.clear();
```

#### Iteration

```typescript
const list = new LinkedList<string>();
list.append('a');
list.append('b');

// Vorwärtsiteration
for (const value of list) {
  console.log(value);
}
```

## Beispiele

### Grundlegende Verwendung

```typescript
const list = new LinkedList<number>();

// Elemente hinzufügen
list.append(1); // [1]
list.append(2); // [1, 2]
list.prepend(0); // [0, 1, 2]

console.log(list.toArray()); // [0, 1, 2]
console.log(list.size); // 3
```

### Aufgabenliste erstellen

```typescript
const tasks = new LinkedList<string>();

// Aufgaben hinzufügen
tasks.append('PR überprüfen');
tasks.append('Tests schreiben');
tasks.prepend('Stand-up'); // Hohe Priorität

// Aufgaben in Reihenfolge verarbeiten
while (!tasks.isEmpty()) {
  const task = tasks.removeFirst();
  console.log(`Verarbeite: ${task}`);
}
```

### Navigationsverlauf verwalten

```typescript
const history = new LinkedList<string>();

// Benutzernavigation
history.append('/home');
history.append('/products');
history.append('/cart');

// Aktuelle Seite abrufen
const current = history.get(history.size - 1);
console.log(current); // "/cart"

// Prüfen ob besucht
const visited = history.contains('/products'); // true
```

## Fehlerbehandlung

```typescript
import {
  EmptyStructureError,
  IndexOutOfBoundsError,
} from '@msnkr/data-structures';

try {
  const empty = new LinkedList<number>();
  empty.removeFirst(); // Wirft EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Liste ist leer!');
  }
}

try {
  const list = new LinkedList<number>();
  list.append(1);
  list.get(10); // Wirft IndexOutOfBoundsError
} catch (error) {
  if (error instanceof IndexOutOfBoundsError) {
    console.log('Index außerhalb der Grenzen!');
  }
}
```

:::caution Fehlerbedingungen

- `removeFirst()` wirft `EmptyStructureError` bei leerer Liste
- `get()`, `insertAt()`, `removeAt()` werfen `IndexOutOfBoundsError` bei ungültigem Index
  :::

## Leistungsmerkmale

| Operation       | Zeitkomplexität | Beschreibung                    |
| --------------- | --------------- | ------------------------------- |
| `append()`      | O(1)            | Element am Ende hinzufügen      |
| `prepend()`     | O(1)            | Element am Anfang hinzufügen    |
| `insertAt()`    | O(n)            | An Position einfügen            |
| `removeFirst()` | O(1)            | Element vom Anfang entfernen    |
| `removeAt()`    | O(n)            | An Position entfernen           |
| `remove()`      | O(n)            | Erstes Vorkommen entfernen      |
| `get()`         | O(n)            | Auf Element an Position zugreifen |
| `indexOf()`     | O(n)            | Position eines Elements finden  |
| `contains()`    | O(n)            | Nach Element suchen             |
| `clear()`       | O(1)            | Alle Elemente entfernen         |
| `toArray()`     | O(n)            | In Array konvertieren           |

**Speicherkomplexität:** O(n), wobei n die Anzahl der Elemente ist

## Implementierungsdetails

### Interne Struktur

- Verwendet einfach verkettete Knotenstruktur
- Verwaltet sowohl Kopf- als auch Endzeiger für O(1) append-Operationen
- Jeder Knoten enthält einen Wert und einen Zeiger auf den nächsten Knoten

:::info Wann LinkedList verwenden
Ideal für:

- Häufiges Einfügen/Löschen am Anfang
- Nur Vorwärtsdurchlauf erforderlich
- Kein Speicher-Overhead einer doppelt verketteten Liste benötigt
- Erstellen von Warteschlangen, Stapeln oder einfachen Listen
  :::

:::warning Wann vermeiden
Alternativen in Betracht ziehen für:

- **Häufiger Direktzugriff** → Array verwenden
- **Bidirektionaler Durchlauf benötigt** → [DoublyLinkedList](./doubly-linked-list) verwenden
- **Extrem speicherbeschränkt** → Array verwenden
  :::

## Siehe auch

- [DoublyLinkedList](./doubly-linked-list) - Doppelt verkettete Liste mit Rückwärtsiteration
- [Queue](./queue) - First In First Out (FIFO) Warteschlange
- [Deque](./deque) - Doppelendige Warteschlange
