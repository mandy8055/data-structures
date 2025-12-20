---
id: choosing-data-structure
title: Die richtige Datenstruktur wählen
sidebar_label: Datenstruktur wählen
description: Entscheidungsleitfaden zur Auswahl der optimalen Datenstruktur
keywords: [data-structures, comparison, guide, performance, selection]
---

# Die richtige Datenstruktur wählen

Ein umfassender Leitfaden zur Auswahl der optimalen Datenstruktur für Ihren Anwendungsfall.

## Schneller Entscheidungsbaum

```
Benötigen Sie Key-Value-Mapping?
├─ Ja → Benötigen Sie sortierte Reihenfolge?
│  ├─ Ja → SortedMap
│  └─ Nein → Benötigen Sie bidirektionale Suche?
│     ├─ Ja → BiDirectionalMap
│     └─ Nein → JavaScript Map (nativ)
│
└─ Nein → Benötigen Sie geordnete Sammlung?
   ├─ Prioritätsbasiert → PriorityQueue / BinaryHeap
   ├─ FIFO (Queue) → Queue
   ├─ LIFO (Stack) → Array oder Deque
   ├─ Beide Enden → Deque
   ├─ Sortierte eindeutige Werte → RedBlackTree
   ├─ String-Präfix-Suche → Trie
   ├─ Sequentieller Zugriff → LinkedList / DoublyLinkedList
   └─ LRU-Caching → LRUCache
```

## Nach Anwendungsfall

### Caching

| Anforderung        | Beste Wahl                    | Warum                                              |
| ------------------ | ----------------------------- | -------------------------------------------------- |
| Cache fester Größe | **LRUCache**                  | Automatische Entfernung der am wenigsten genutzten |
| Einfacher Cache    | JavaScript Map                | Nativ, schnell, keine Größenbeschränkung           |
| Mit TTL            | **LRUCache** (mit ttl-Option) | Integrierter Ablauf                                |
| Multi-Level Cache  | **LRUCache** + Map            | Schnellen und langsamen Speicher schichten         |

**Beispiel:**

```typescript
const cache = new LRUCache<string, Data>({
  capacity: 100,
  ttl: 300000, // 5 Minuten
});
```

### Sammlungen

#### Lineare Sammlungen

| Bedarf                               | Beste Wahl                          | Zeitkomplexität |
| ------------------------------------ | ----------------------------------- | --------------- |
| Am Anfang hinzufügen/entfernen       | LinkedList                          | O(1)            |
| Am Ende hinzufügen/entfernen         | LinkedList, Array                   | O(1)            |
| An beiden Enden hinzufügen/entfernen | **DoublyLinkedList** oder **Deque** | O(1)            |
| Zufälliger Zugriff per Index         | Array                               | O(1)            |
| Sequentielle Iteration               | LinkedList, DoublyLinkedList        | O(n)            |
| Rückwärts-Iteration                  | **DoublyLinkedList**                | O(n)            |

**Wann LinkedList vs. Array verwenden:**

```typescript
// ✅ LinkedList verwenden, wenn:
// - Häufige Einfügungen/Löschungen an Enden
// - Größe ändert sich häufig
// - Kein Zufallszugriff erforderlich
const taskQueue = new LinkedList<Task>();

// ✅ Array verwenden, wenn:
// - Zufallszugriff erforderlich (arr[i])
// - Größe relativ stabil
// - Häufige indexbasierte Operationen
const items = [1, 2, 3];
```

#### Queue-Operationen

| Muster                    | Beste Wahl        | Operationen                                        |
| ------------------------- | ----------------- | -------------------------------------------------- |
| FIFO (First-In-First-Out) | **Queue**         | enqueue(), dequeue()                               |
| LIFO (Last-In-First-Out)  | Array (als Stack) | push(), pop()                                      |
| Prioritätsbasiert         | **PriorityQueue** | enqueue(), dequeue() nach Priorität                |
| Beide Enden               | **Deque**         | addFirst(), addLast(), removeFirst(), removeLast() |

**Beispielszenarien:**

```typescript
// Task-Verarbeitung (FIFO)
const tasks = new Queue<Task>();

// Rückgängig/Wiederherstellen (LIFO)
const undoStack: Action[] = [];

// Event-Behandlung nach Priorität
const events = new PriorityQueue<Event>({
  comparator: (a, b) => a.priority - b.priority,
});

// Sliding Window
const window = new Deque<number>();
```

### Maps und Lookups

| Anforderung                 | Beste Wahl           | Suchzeit               |
| --------------------------- | -------------------- | ---------------------- |
| Key→Value-Suche             | JavaScript Map       | O(1) durchschnittl.    |
| Key→Value UND Value→Key     | **BiDirectionalMap** | O(1)                   |
| Nach Schlüssel sortiert     | **SortedMap**        | O(log n)               |
| Min/Max-Schlüsselzugriff    | **SortedMap**        | O(log n)               |
| Präfixbasierte String-Suche | **Trie**             | O(m), m=Schlüssellänge |

**Vergleich:**

```typescript
// Standard-Map
const map = new Map<string, number>();
map.set('a', 1);
map.get('a'); // O(1)

// Bidirektionale Map
const biMap = new BiDirectionalMap<string, number>();
biMap.set('a', 1);
biMap.get('a'); // O(1) - Wert nach Schlüssel abrufen
biMap.getKey(1); // O(1) - Schlüssel nach Wert abrufen

// Sortierte Map
const sorted = new SortedMap<number, string>();
sorted.set(3, 'drei');
sorted.set(1, 'eins');
sorted.firstKey(); // 1 - O(log n)
for (const [k, v] of sorted) {
  // Iteriert in sortierter Reihenfolge
}

// Trie für Strings
const trie = new Trie<number>();
trie.insert('apple', 1);
trie.getAllWithPrefix('app'); // ['apple'] - O(p+n)
```

### Sets und eindeutige Werte

| Anforderung                  | Beste Wahl            | Hinweise             |
| ---------------------------- | --------------------- | -------------------- |
| Eindeutige Werte, unsortiert | JavaScript Set        | Nativ, schnell       |
| Eindeutige Werte, sortiert   | **RedBlackTree**      | O(log n) Operationen |
| Min/Max-Zugriff              | **RedBlackTree**      | O(log n)             |
| Duplikat-Prüfung             | Set oder RedBlackTree | O(1) oder O(log n)   |

```typescript
// Unsortierte eindeutige Werte
const uniqueIds = new Set<string>();

// Sortierte eindeutige Werte
const sortedScores = new RedBlackTree<number>();
sortedScores.insert(85);
sortedScores.insert(92);
sortedScores.min(); // 85
sortedScores.max(); // 92
```

### Tree-Operationen

| Bedarf             | Beste Wahl                         | Operationen                                  |
| ------------------ | ---------------------------------- | -------------------------------------------- |
| Sortierte Sammlung | **RedBlackTree**                   | insert(), remove(), contains() alle O(log n) |
| Priority Queue     | **PriorityQueue** / **BinaryHeap** | Effizienter Min/Max-Zugriff                  |
| String-Suche       | **Trie**                           | Präfix-Matching, Autocomplete                |

### Prioritäts- und Heap-Operationen

| Anwendungsfall         | Beste Wahl                       | Warum                              |
| ---------------------- | -------------------------------- | ---------------------------------- |
| Task-Scheduling        | **PriorityQueue**                | Queue-ähnliche API mit Prioritäten |
| K größte/kleinste      | **BinaryHeap** (MinHeap/MaxHeap) | Effiziente Top-k-Algorithmen       |
| Median-Tracking        | MinHeap + MaxHeap                | Zwei-Heap-Ansatz                   |
| Dijkstra's Algorithmus | **PriorityQueue**                | Benötigt Min-Prioritäts-Extraktion |

```typescript
// Task-Scheduling
const scheduler = new PriorityQueue<Task>({
  comparator: (a, b) => b.priority - a.priority,
});

// K größte Elemente
const minHeap = new MinHeap<number>();
for (const num of numbers) {
  minHeap.insert(num);
  if (minHeap.size > k) minHeap.remove();
}
```

## Leistungsvergleich

### Zeitkomplexität

| Datenstruktur        | Insert     | Delete     | Search     | Access   | Min/Max  |
| -------------------- | ---------- | ---------- | ---------- | -------- | -------- |
| **Array**            | O(n)       | O(n)       | O(n)       | O(1)     | O(n)     |
| **LinkedList**       | O(1)\*     | O(n)       | O(n)       | O(n)     | O(n)     |
| **DoublyLinkedList** | O(1)\*     | O(n)       | O(n)       | O(n)     | O(n)     |
| **Queue**            | O(1)       | O(1)       | O(n)       | -        | -        |
| **Deque**            | O(1)       | O(1)       | O(n)       | O(1)     | -        |
| **PriorityQueue**    | O(log n)   | O(log n)   | O(n)       | O(1)\*\* | O(1)\*\* |
| **BinaryHeap**       | O(log n)   | O(log n)   | O(n)       | O(1)\*\* | O(1)\*\* |
| **RedBlackTree**     | O(log n)   | O(log n)   | O(log n)   | -        | O(log n) |
| **SortedMap**        | O(log n)   | O(log n)   | O(log n)   | -        | O(log n) |
| **Trie**             | O(m)\*\*\* | O(m)\*\*\* | O(m)\*\*\* | -        | -        |
| **BiMap**            | O(1)       | O(1)       | O(1)       | O(1)     | -        |
| **LRUCache**         | O(1)       | O(1)       | -          | O(1)     | -        |

\* Nur an Enden
\*\* Peek-Operation
\*\*\* m = String-Länge

### Speicherkomplexität

| Datenstruktur        | Speicher                 | Hinweise                         |
| -------------------- | ------------------------ | -------------------------------- |
| Alle                 | O(n)                     | Linear in Anzahl der Elemente    |
| **LinkedList**       | O(n)                     | Zusätzlicher Zeiger pro Knoten   |
| **DoublyLinkedList** | O(n)                     | Zwei Zeiger pro Knoten           |
| **Trie**             | O(ALPHABET_SIZE × N × M) | Kann groß sein für lange Strings |
| **BiMap**            | O(2n)                    | Zwei interne Maps                |

## Gängige Szenarien

### 1. Webbrowser-Verlauf

**Anforderung:** Rückwärts/vorwärts durch besuchte Seiten navigieren

**Beste Wahl:** DoublyLinkedList

```typescript
const history = new DoublyLinkedList<string>();
history.append('/home');
history.append('/products');
// Navigieren mit Vorwärts-/Rückwärts-Iteration
```

**Alternative:** Array mit Index-Zeiger (einfacher, aber weniger effizient für Änderungen)

### 2. Autocomplete/Suchvorschläge

**Anforderung:** Alle Wörter finden, die mit einem Präfix beginnen

**Beste Wahl:** Trie

```typescript
const trie = new Trie<number>(false); // Groß-/Kleinschreibung ignorieren
trie.insert('apple', 100);
trie.insert('application', 85);
trie.getAllWithPrefix('app'); // ['apple', 'application']
```

**Alternative:** Array mit Filter (einfacher, aber O(n) pro Suche)

### 3. Rangliste

**Anforderung:** Spielerbewertungen in Rangreihenfolge pflegen

**Beste Wahl:** SortedMap

```typescript
const leaderboard = new SortedMap<number, Player>({
  comparator: (a, b) => b - a, // Absteigend
});
```

**Alternative:** Array + Sortieren (einfacher, aber O(n log n) pro Aktualisierung)

### 4. Rate Limiting

**Anforderung:** Anfragezähler pro Benutzer mit Ablauf verfolgen

**Beste Wahl:** LRUCache mit TTL

```typescript
const rateLimiter = new LRUCache<string, number>({
  capacity: 10000,
  ttl: 60000, // 1 Minute
});
```

### 5. Event-Verarbeitung

**Anforderung:** Events in Prioritätsreihenfolge verarbeiten

**Beste Wahl:** PriorityQueue

```typescript
const events = new PriorityQueue<Event>({
  comparator: (a, b) => a.priority - b.priority,
});
```

### 6. Benutzer-ID ↔ Benutzername-Mapping

**Anforderung:** In beide Richtungen nachschlagen

**Beste Wahl:** BiDirectionalMap

```typescript
const users = new BiDirectionalMap<number, string>();
users.set(1, 'alice');
users.get(1); // 'alice'
users.getKey('alice'); // 1
```

## Entscheidungsfaktoren

### 1. Zugriffsmuster

- **Zufälliger Zugriff:** Array, Map
- **Sequentiell:** LinkedList, Queue
- **Sortiert:** RedBlackTree, SortedMap
- **Priorität:** PriorityQueue, BinaryHeap

### 2. Änderungshäufigkeit

- **Häufige Einfügungen/Löschungen:** LinkedList, Heap
- **Hauptsächlich Lesevorgänge:** Array, Map
- **Ausgewogen:** Tree-Strukturen

### 3. Größenbeschränkungen

- **Feste Größe:** LRUCache
- **Dynamische Größe:** Die meisten Strukturen
- **Große Datensätze:** Speicher-Overhead beachten

### 4. Leistungsanforderungen

- **Konstante Zeit kritisch:** Map, BiMap, LRUCache
- **Logarithmisch akzeptabel:** Trees, Heaps
- **Linear akzeptabel:** LinkedList-Suche

## Anti-Muster

### ❌ Array für häufige Einfügungen/Löschungen verwenden

```typescript
// Schlecht: O(n) für jede Verschiebung
const arr = [1, 2, 3];
arr.unshift(0); // Verschiebt alle Elemente

// Gut: O(1)
const list = new LinkedList<number>();
list.prepend(0);
```

### ❌ LinkedList für Zufallszugriff verwenden

```typescript
// Schlecht: O(n) um Index zu finden
list.get(1000);

// Gut: O(1)
arr[1000];
```

### ❌ LRUCache für Caching nicht verwenden

```typescript
// Schlecht: Keine automatische Entfernung
const cache = new Map<string, Data>();
if (cache.size > 100) {
  // Manuelle Entfernungslogik erforderlich
}

// Gut: Automatische LRU-Entfernung
const cache = new LRUCache<string, Data>({ capacity: 100 });
```

## Zusammenfassung

Wählen Sie basierend auf Ihrer primären Operation:

- **Caching:** LRUCache
- **FIFO/LIFO:** Queue / Stack (Array)
- **Priorität:** PriorityQueue
- **Sortiert:** RedBlackTree, SortedMap
- **Bidirektionale Suche:** BiDirectionalMap
- **String-Präfix:** Trie
- **Sequentiell:** LinkedList
- **Beide Enden:** Deque / DoublyLinkedList

Im Zweifelsfall einfach starten (Array, Map) und basierend auf Profiling optimieren!

## Verwandte Themen

- [Caching-Strategien-Leitfaden](./caching-strategies.md)
- [Heap-Algorithmen-Leitfaden](./heap-algorithms.md)
- [API-Referenz](../api/bi-map.md)
