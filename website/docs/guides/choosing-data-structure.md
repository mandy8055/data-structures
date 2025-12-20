---
id: choosing-data-structure
title: Choosing the Right Data Structure
sidebar_label: Choosing Data Structure
description: Decision guide for selecting the optimal data structure
keywords: [data-structures, comparison, guide, performance, selection]
---

# Choosing the Right Data Structure

A comprehensive guide to selecting the optimal data structure for your use case.

## Quick Decision Tree

```
Need key-value mapping?
├─ Yes → Need sorted order?
│  ├─ Yes → SortedMap
│  └─ No → Need bidirectional lookup?
│     ├─ Yes → BiDirectionalMap
│     └─ No → JavaScript Map (native)
│
└─ No → Need ordered collection?
   ├─ Priority-based → PriorityQueue / BinaryHeap
   ├─ FIFO (Queue) → Queue
   ├─ LIFO (Stack) → Array or Deque
   ├─ Both ends → Deque
   ├─ Sorted unique values → RedBlackTree
   ├─ String prefix search → Trie
   ├─ Sequential access → LinkedList / DoublyLinkedList
   └─ LRU caching → LRUCache
```

## By Use Case

### Caching

| Requirement       | Best Choice                    | Why                              |
| ----------------- | ------------------------------ | -------------------------------- |
| Fixed-size cache  | **LRUCache**                   | Automatic eviction of least used |
| Simple cache      | JavaScript Map                 | Native, fast, no size limit      |
| With TTL          | **LRUCache** (with ttl option) | Built-in expiration              |
| Multi-level cache | **LRUCache** + Map             | Layer fast and slow storage      |

**Example:**

```typescript
const cache = new LRUCache<string, Data>({
  capacity: 100,
  ttl: 300000, // 5 minutes
});
```

### Collections

#### Linear Collections

| Need                    | Best Choice                       | Time Complexity |
| ----------------------- | --------------------------------- | --------------- |
| Add/remove at front     | LinkedList                        | O(1)            |
| Add/remove at end       | LinkedList, Array                 | O(1)            |
| Add/remove at both ends | **DoublyLinkedList** or **Deque** | O(1)            |
| Random access by index  | Array                             | O(1)            |
| Sequential iteration    | LinkedList, DoublyLinkedList      | O(n)            |
| Reverse iteration       | **DoublyLinkedList**              | O(n)            |

**When to use LinkedList vs Array:**

```typescript
// ✅ Use LinkedList when:
// - Frequent insertions/deletions at ends
// - Size changes frequently
// - Don't need random access
const taskQueue = new LinkedList<Task>();

// ✅ Use Array when:
// - Need random access (arr[i])
// - Size relatively stable
// - Frequent index-based operations
const items = [1, 2, 3];
```

#### Queue Operations

| Pattern                   | Best Choice       | Operations                                         |
| ------------------------- | ----------------- | -------------------------------------------------- |
| FIFO (First-In-First-Out) | **Queue**         | enqueue(), dequeue()                               |
| LIFO (Last-In-First-Out)  | Array (as stack)  | push(), pop()                                      |
| Priority-based            | **PriorityQueue** | enqueue(), dequeue() by priority                   |
| Both ends                 | **Deque**         | addFirst(), addLast(), removeFirst(), removeLast() |

**Example scenarios:**

```typescript
// Task processing (FIFO)
const tasks = new Queue<Task>();

// Undo/Redo (LIFO)
const undoStack: Action[] = [];

// Event handling by priority
const events = new PriorityQueue<Event>({
  comparator: (a, b) => a.priority - b.priority,
});

// Sliding window
const window = new Deque<number>();
```

### Maps and Lookups

| Requirement                | Best Choice          | Lookup Time        |
| -------------------------- | -------------------- | ------------------ |
| Key→Value lookup           | JavaScript Map       | O(1) avg           |
| Key→Value AND Value→Key    | **BiDirectionalMap** | O(1)               |
| Sorted by key              | **SortedMap**        | O(log n)           |
| Min/Max key access         | **SortedMap**        | O(log n)           |
| Prefix-based string lookup | **Trie**             | O(m), m=key length |

**Comparison:**

```typescript
// Standard map
const map = new Map<string, number>();
map.set('a', 1);
map.get('a'); // O(1)

// Bidirectional map
const biMap = new BiDirectionalMap<string, number>();
biMap.set('a', 1);
biMap.get('a'); // O(1) - get value by key
biMap.getKey(1); // O(1) - get key by value

// Sorted map
const sorted = new SortedMap<number, string>();
sorted.set(3, 'three');
sorted.set(1, 'one');
sorted.firstKey(); // 1 - O(log n)
for (const [k, v] of sorted) {
  // Iterates in sorted order
}

// Trie for strings
const trie = new Trie<number>();
trie.insert('apple', 1);
trie.getAllWithPrefix('app'); // ['apple'] - O(p+n)
```

### Sets and Unique Values

| Requirement             | Best Choice         | Notes               |
| ----------------------- | ------------------- | ------------------- |
| Unique values, unsorted | JavaScript Set      | Native, fast        |
| Unique values, sorted   | **RedBlackTree**    | O(log n) operations |
| Min/Max access          | **RedBlackTree**    | O(log n)            |
| Duplicate checking      | Set or RedBlackTree | O(1) or O(log n)    |

```typescript
// Unsorted unique values
const uniqueIds = new Set<string>();

// Sorted unique values
const sortedScores = new RedBlackTree<number>();
sortedScores.insert(85);
sortedScores.insert(92);
sortedScores.min(); // 85
sortedScores.max(); // 92
```

### Tree Operations

| Need              | Best Choice                        | Operations                                  |
| ----------------- | ---------------------------------- | ------------------------------------------- |
| Sorted collection | **RedBlackTree**                   | insert(), remove(), contains() all O(log n) |
| Priority queue    | **PriorityQueue** / **BinaryHeap** | Efficient min/max access                    |
| String search     | **Trie**                           | Prefix matching, autocomplete               |

### Priority and Heap Operations

| Use Case             | Best Choice                      | Why                            |
| -------------------- | -------------------------------- | ------------------------------ |
| Task scheduling      | **PriorityQueue**                | Queue-like API with priorities |
| K largest/smallest   | **BinaryHeap** (MinHeap/MaxHeap) | Efficient top-k algorithms     |
| Median tracking      | MinHeap + MaxHeap                | Two-heap approach              |
| Dijkstra's algorithm | **PriorityQueue**                | Need min-priority extraction   |

```typescript
// Task scheduling
const scheduler = new PriorityQueue<Task>({
  comparator: (a, b) => b.priority - a.priority,
});

// K largest elements
const minHeap = new MinHeap<number>();
for (const num of numbers) {
  minHeap.insert(num);
  if (minHeap.size > k) minHeap.remove();
}
```

## Performance Comparison

### Time Complexity

| Data Structure       | Insert     | Delete     | Search     | Access   | Min/Max  |
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

\* At ends only
\*\* Peek operation
\*\*\* m = string length

### Space Complexity

| Data Structure       | Space                    | Notes                         |
| -------------------- | ------------------------ | ----------------------------- |
| All                  | O(n)                     | Linear in number of elements  |
| **LinkedList**       | O(n)                     | Additional pointer per node   |
| **DoublyLinkedList** | O(n)                     | Two pointers per node         |
| **Trie**             | O(ALPHABET_SIZE × N × M) | Can be large for long strings |
| **BiMap**            | O(2n)                    | Two internal maps             |

## Common Scenarios

### 1. Web Browser History

**Requirement:** Navigate back/forward through visited pages

**Best Choice:** DoublyLinkedList

```typescript
const history = new DoublyLinkedList<string>();
history.append('/home');
history.append('/products');
// Navigate with forward/reverse iteration
```

**Alternative:** Array with index pointer (simpler but less efficient for modifications)

### 2. Autocomplete/Search Suggestions

**Requirement:** Find all words starting with a prefix

**Best Choice:** Trie

```typescript
const trie = new Trie<number>(false); // case-insensitive
trie.insert('apple', 100);
trie.insert('application', 85);
trie.getAllWithPrefix('app'); // ['apple', 'application']
```

**Alternative:** Array with filter (simpler but O(n) per search)

### 3. Leaderboard

**Requirement:** Maintain player scores in rank order

**Best Choice:** SortedMap

```typescript
const leaderboard = new SortedMap<number, Player>({
  comparator: (a, b) => b - a, // Descending
});
```

**Alternative:** Array + sort (simpler but O(n log n) per update)

### 4. Rate Limiting

**Requirement:** Track request counts per user with expiration

**Best Choice:** LRUCache with TTL

```typescript
const rateLimiter = new LRUCache<string, number>({
  capacity: 10000,
  ttl: 60000, // 1 minute
});
```

### 5. Event Processing

**Requirement:** Process events in priority order

**Best Choice:** PriorityQueue

```typescript
const events = new PriorityQueue<Event>({
  comparator: (a, b) => a.priority - b.priority,
});
```

### 6. User ID ↔ Username Mapping

**Requirement:** Look up in both directions

**Best Choice:** BiDirectionalMap

```typescript
const users = new BiDirectionalMap<number, string>();
users.set(1, 'alice');
users.get(1); // 'alice'
users.getKey('alice'); // 1
```

## Decision Factors

### 1. Access Patterns

- **Random access:** Array, Map
- **Sequential:** LinkedList, Queue
- **Sorted:** RedBlackTree, SortedMap
- **Priority:** PriorityQueue, BinaryHeap

### 2. Modification Frequency

- **Frequent inserts/deletes:** LinkedList, Heap
- **Mostly reads:** Array, Map
- **Balanced:** Tree structures

### 3. Size Constraints

- **Fixed size:** LRUCache
- **Dynamic size:** Most structures
- **Large datasets:** Consider space overhead

### 4. Performance Requirements

- **Constant time critical:** Map, BiMap, LRUCache
- **Logarithmic acceptable:** Trees, Heaps
- **Linear acceptable:** LinkedList search

## Anti-Patterns

### ❌ Using Array for Frequent Insertions/Deletions

```typescript
// Bad: O(n) for each shift
const arr = [1, 2, 3];
arr.unshift(0); // Shifts all elements

// Good: O(1)
const list = new LinkedList<number>();
list.prepend(0);
```

### ❌ Using LinkedList for Random Access

```typescript
// Bad: O(n) to find index
list.get(1000);

// Good: O(1)
arr[1000];
```

### ❌ Not Using LRUCache for Caching

```typescript
// Bad: No automatic eviction
const cache = new Map<string, Data>();
if (cache.size > 100) {
  // Manual eviction logic needed
}

// Good: Automatic LRU eviction
const cache = new LRUCache<string, Data>({ capacity: 100 });
```

## Summary

Choose based on your primary operation:

- **Caching:** LRUCache
- **FIFO/LIFO:** Queue / Stack (Array)
- **Priority:** PriorityQueue
- **Sorted:** RedBlackTree, SortedMap
- **Bidirectional lookup:** BiDirectionalMap
- **String prefix:** Trie
- **Sequential:** LinkedList
- **Both ends:** Deque / DoublyLinkedList

When in doubt, start simple (Array, Map) and optimize based on profiling!

## Related Topics

- [Caching Strategies Guide](./caching-strategies.md)
- [Heap Algorithms Guide](./heap-algorithms.md)
- [API Reference](../api/bi-map.md)
