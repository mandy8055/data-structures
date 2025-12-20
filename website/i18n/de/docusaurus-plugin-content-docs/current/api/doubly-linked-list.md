---
id: doubly-linked-list
title: DoublyLinkedList
sidebar_label: DoublyLinkedList
description: Doppelt verkettete Liste mit O(1) Operationen an beiden Enden und bidirektionalem Durchlauf
keywords:
  [
    doubly-linked-list,
    linked-list,
    data-structure,
    typescript,
    javascript,
    bidirectional,
  ]
---

import InstallTabs from '@site/src/components/InstallTabs';

# DoublyLinkedList

Doppelt verkettete Listenimplementierung mit effizienten Operationen an beiden Enden und bidirektionalem Durchlauf. Jeder Knoten hält Referenzen sowohl zum vorherigen als auch zum nächsten Knoten.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='DoublyLinkedList' />

## Verwendung

```typescript
import { DoublyLinkedList } from '@msnkr/data-structures';

const list = new DoublyLinkedList<number>();
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
Einfügungen sowohl am Anfang als auch am Ende erfolgen in O(1) konstanter Zeit.
:::

#### Elemente entfernen

```typescript
// Vom Anfang entfernen - O(1)
const first = list.removeFirst();

// Vom Ende entfernen - O(1)
const last = list.removeLast();

// An Position entfernen - O(n)
const element = list.removeAt(1);

// Erstes Vorkommen eines Werts entfernen - O(n)
const removed = list.remove(42);
```

:::tip O(1) Entfernen an beiden Enden
Anders als bei einfach verketteten Listen unterstützt DoublyLinkedList O(1) Entfernen vom Ende dank Rückwärtszeigern.
:::

#### Auf Elemente zugreifen

```typescript
// Element an Position abrufen - O(min(n/2, k))
const element = list.get(0);

// Position eines Elements finden - O(n)
const index = list.indexOf(42);

// Element-Existenz prüfen - O(n)
const exists = list.contains(42);
```

:::info Optimierter Zugriff
Die `get()`-Methode ist optimiert und sucht vom nächstgelegenen Ende (Kopf oder Ende), wodurch der Zugriff auf Indizes nahe dem Ende 2x schneller ist als bei einfach verketteten Listen.
:::

#### Iteration

```typescript
const list = new DoublyLinkedList<string>();
list.append('a');
list.append('b');
list.append('c');

// Vorwärtsiteration (Kopf zu Ende)
for (const value of list) {
  console.log(value); // "a", "b", "c"
}

// Rückwärtsiteration (Ende zu Kopf)
for (const value of list.reverseIterator()) {
  console.log(value); // "c", "b", "a"
}
```

#### Hilfsmethoden

```typescript
// In Array konvertieren - O(n)
const array = list.toArray();

// Alle Elemente entfernen - O(1)
list.clear();
```

## Beispiele

### Grundlegende Verwendung mit bidirektionalem Durchlauf

```typescript
const list = new DoublyLinkedList<number>();

// Elemente hinzufügen
list.append(1); // [1]
list.append(2); // [1, 2]
list.append(3); // [1, 2, 3]

// Vorwärts durchlaufen
console.log('Vorwärts:', [...list]); // [1, 2, 3]

// Rückwärts durchlaufen
console.log('Rückwärts:', [...list.reverseIterator()]); // [3, 2, 1]
```

### Browser-Verlaufsimplementierung

```typescript
class BrowserHistory {
  private history = new DoublyLinkedList<string>();
  private currentIndex = -1;

  visit(url: string): void {
    // Vorwärtsverlauf entfernen
    while (this.currentIndex < this.history.size - 1) {
      this.history.removeLast();
    }

    this.history.append(url);
    this.currentIndex++;
  }

  back(): string | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history.get(this.currentIndex);
    }
    return null;
  }

  forward(): string | null {
    if (this.currentIndex < this.history.size - 1) {
      this.currentIndex++;
      return this.history.get(this.currentIndex);
    }
    return null;
  }
}

const browser = new BrowserHistory();
browser.visit('google.com');
browser.visit('github.com');
browser.visit('stackoverflow.com');

console.log(browser.back()); // "github.com"
console.log(browser.back()); // "google.com"
console.log(browser.forward()); // "github.com"
```

### Musik-Playlist mit Shuffle

```typescript
const playlist = new DoublyLinkedList<string>();

playlist.append('Song 1');
playlist.append('Song 2');
playlist.append('Song 3');
playlist.append('Song 4');

// Vorwärts abspielen
console.log('Vorwärts abspielen:');
for (const song of playlist) {
  console.log(`♪ ${song}`);
}

// Rückwärts abspielen
console.log('\nRückwärts abspielen:');
for (const song of playlist.reverseIterator()) {
  console.log(`♪ ${song}`);
}
```

### Texteditor Rückgängig/Wiederholen

```typescript
class TextEditor {
  private states = new DoublyLinkedList<string>();
  private currentIndex = -1;

  constructor() {
    this.states.append(''); // Initialer leerer Zustand
    this.currentIndex = 0;
  }

  type(text: string): void {
    const currentState = this.states.get(this.currentIndex) || '';
    const newState = currentState + text;

    // Gesamten Wiederholungsverlauf entfernen
    while (this.currentIndex < this.states.size - 1) {
      this.states.removeLast();
    }

    this.states.append(newState);
    this.currentIndex++;
  }

  undo(): string {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    return this.states.get(this.currentIndex) || '';
  }

  redo(): string {
    if (this.currentIndex < this.states.size - 1) {
      this.currentIndex++;
    }
    return this.states.get(this.currentIndex) || '';
  }

  getText(): string {
    return this.states.get(this.currentIndex) || '';
  }
}

const editor = new TextEditor();
editor.type('Hello');
editor.type(' World');
console.log(editor.getText()); // "Hello World"
console.log(editor.undo()); // "Hello"
console.log(editor.undo()); // ""
console.log(editor.redo()); // "Hello"
```

### LRU-Cache-Implementierung

```typescript
class LRUCache<K, V> {
  private capacity: number;
  private cache = new Map<K, V>();
  private order = new DoublyLinkedList<K>();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Zu zuletzt verwendet verschieben
    this.order.remove(key);
    this.order.append(key);

    return this.cache.get(key);
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.order.remove(key);
    } else if (this.cache.size >= this.capacity) {
      // Am wenigsten verwendeten entfernen
      const lru = this.order.removeFirst();
      if (lru !== undefined) {
        this.cache.delete(lru);
      }
    }

    this.cache.set(key, value);
    this.order.append(key);
  }
}

const cache = new LRUCache<string, number>(3);
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);
console.log(cache.get('a')); // 1
cache.put('d', 4); // Entfernt 'b'
```

## Zeitkomplexität

| Operation   | Durchschnitt | Schlimmstenfalls |
| ----------- | ------------ | ---------------- |
| append      | O(1)         | O(1)             |
| prepend     | O(1)         | O(1)             |
| insertAt    | O(n)         | O(n)             |
| removeFirst | O(1)         | O(1)             |
| removeLast  | O(1)         | O(1)             |
| removeAt    | O(n)         | O(n)             |
| remove      | O(n)         | O(n)             |
| get         | O(n)         | O(n)             |
| indexOf     | O(n)         | O(n)             |
| contains    | O(n)         | O(n)             |

## Vergleich mit einfach verketteter Liste

| Merkmal                         | DoublyLinkedList         | LinkedList                      |
| ------------------------------- | ------------------------ | ------------------------------- |
| Entfernen vom Ende              | O(1)                     | O(n)                            |
| Rückwärtsiteration              | Unterstützt              | Nicht unterstützt               |
| Speichernutzung                 | 2 Zeiger pro Knoten      | 1 Zeiger pro Knoten             |
| Zugriff auf Elemente nahe Ende  | Schneller (vom Ende aus) | Langsamer (nur vom Kopf aus)    |

## Best Practices

### Wann DoublyLinkedList verwenden

- ✅ Bidirektionaler Durchlauf erforderlich
- ✅ Häufiges Entfernen von beiden Enden
- ✅ Implementierung von LRU-Caches oder Rückgängig/Wiederholen
- ✅ Zugriff auf Elemente nahe dem Ende erforderlich

### Wann LinkedList (einfach verkettet) verwenden

- ✅ Nur Vorwärtsdurchlauf erforderlich
- ✅ Speicher ist begrenzt
- ✅ Selten oder nie vom Ende entfernen

## Verwandte Datenstrukturen

- **LinkedList** - Einfach verkettete Liste mit geringerer Speichernutzung
- **Deque** - Array-basierte doppelendige Warteschlange mit schnellerem Zugriff
- **Queue** - FIFO-Warteschlange mit Operationen nur an einem Ende
