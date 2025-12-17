---
id: sorted-map
title: SortedMap
sidebar_label: SortedMap
description: Key-value map with O(log n) operations and sorted key iteration
keywords: [sorted-map, red-black-tree, ordered-map, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# SortedMap

A generic key-value collection that maintains entries sorted by key using a Red-Black Tree, ensuring O(log n) performance for most operations and ordered iteration.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='SortedMap' />

## Usage

```typescript
import { SortedMap } from '@msnkr/data-structures';

const map = new SortedMap<number, string>();
```

## API Reference

### Properties

- `size: number` - Number of key-value pairs in the map
- `isEmpty(): boolean` - Whether the map is empty

### Methods

#### Map Operations

```typescript
// Set a key-value pair - O(log n)
map.set(key, value);

// Get value by key - O(log n)
const value = map.get(key);

// Check if key exists - O(log n)
const exists = map.has(key);

// Delete entry by key - O(log n)
const deleted = map.delete(key);
```

:::tip Performance
All basic operations are O(log n), making SortedMap efficient even for large datasets while maintaining sorted order.
:::

#### Min/Max Operations

```typescript
// Get smallest key - O(log n)
const first = map.firstKey();

// Get largest key - O(log n)
const last = map.lastKey();

// Get entry with smallest key - O(log n)
const [firstKey, firstValue] = map.firstEntry();

// Get entry with largest key - O(log n)
const [lastKey, lastValue] = map.lastEntry();
```

#### Collection Operations

```typescript
// Get all keys in sorted order - O(n)
const keys = map.keys();

// Get all values in key-sorted order - O(n)
const values = map.values();

// Get all entries in key-sorted order - O(n)
const entries = map.entries();

// Remove all entries - O(1)
map.clear();
```

#### Iteration

```typescript
// Iterate entries in key-sorted order
for (const [key, value] of map) {
  console.log(key, value);
}

// forEach iteration
map.forEach((value, key, map) => {
  console.log(key, value);
});
```

:::info Sorted Iteration
Unlike regular Map, SortedMap guarantees iteration in sorted key order.
:::

## Examples

### Basic Number-String Map

```typescript
const map = new SortedMap<number, string>();

map.set(5, 'five');
map.set(3, 'three');
map.set(7, 'seven');
map.set(1, 'one');

console.log(map.get(3)); // "three"
console.log(map.firstKey()); // 1
console.log(map.lastKey()); // 7

// Iterate in sorted key order
for (const [key, value] of map) {
  console.log(key, value);
}
// Output:
// 1 "one"
// 3 "three"
// 5 "five"
// 7 "seven"
```

### Leaderboard System

```typescript
interface PlayerScore {
  username: string;
  timestamp: Date;
}

// Sorted by score (higher is better)
const leaderboard = new SortedMap<number, PlayerScore>({
  comparator: (a, b) => b - a, // Descending order
});

leaderboard.set(100, { username: 'alice', timestamp: new Date() });
leaderboard.set(250, { username: 'bob', timestamp: new Date() });
leaderboard.set(180, { username: 'charlie', timestamp: new Date() });

// Get top player
const [topScore, topPlayer] = leaderboard.firstEntry();
console.log(`${topPlayer.username} leads with ${topScore} points!`);

// Iterate from highest to lowest score
for (const [score, player] of leaderboard) {
  console.log(`${player.username}: ${score}`);
}
// Output:
// bob: 250
// charlie: 180
// alice: 100
```

### Time-Series Data Storage

```typescript
interface DataPoint {
  value: number;
  source: string;
}

const timeSeries = new SortedMap<Date, DataPoint>({
  comparator: (a, b) => a.getTime() - b.getTime(),
});

timeSeries.set(new Date('2025-12-17T10:00'), { value: 42, source: 'sensor1' });
timeSeries.set(new Date('2025-12-17T09:00'), { value: 38, source: 'sensor1' });
timeSeries.set(new Date('2025-12-17T11:00'), { value: 45, source: 'sensor1' });

// Get earliest data point
const [earliestTime, earliestData] = timeSeries.firstEntry();
console.log(`First reading: ${earliestData.value} at ${earliestTime}`);

// Iterate chronologically
for (const [timestamp, data] of timeSeries) {
  console.log(`${timestamp.toISOString()}: ${data.value}`);
}
```

### Custom Object Keys with Comparator

```typescript
interface User {
  id: number;
  name: string;
}

const userMap = new SortedMap<User, string>({
  comparator: (a, b) => a.id - b.id,
});

userMap.set({ id: 1, name: 'Alice' }, 'admin');
userMap.set({ id: 3, name: 'Charlie' }, 'user');
userMap.set({ id: 2, name: 'Bob' }, 'moderator');

// Iterate by user ID order
for (const [user, role] of userMap) {
  console.log(`${user.name} (ID: ${user.id}): ${role}`);
}
// Output:
// Alice (ID: 1): admin
// Bob (ID: 2): moderator
// Charlie (ID: 3): user
```

### Initialize with Entries

```typescript
const map = new SortedMap<number, string>({
  entries: [
    [5, 'five'],
    [3, 'three'],
    [7, 'seven'],
    [1, 'one'],
  ],
});

console.log(map.firstEntry()); // [1, "one"]
console.log(map.lastEntry()); // [7, "seven"]
console.log([...map.keys()]); // [1, 3, 5, 7]
```

### Alphabetically Sorted Names

```typescript
const nameAges = new SortedMap<string, number>({
  comparator: (a, b) => a.localeCompare(b),
});

nameAges.set('Charlie', 30);
nameAges.set('Alice', 25);
nameAges.set('David', 28);
nameAges.set('Bob', 35);

// Will iterate in alphabetical order of names
for (const [name, age] of nameAges) {
  console.log(`${name}: ${age}`);
}
// Output:
// Alice: 25
// Bob: 35
// Charlie: 30
// David: 28
```

### Configuration by Priority

```typescript
interface Config {
  key: string;
  value: unknown;
  priority: number;
}

const configs = new SortedMap<number, Config>({
  comparator: (a, b) => a - b,
});

configs.set(1, { key: 'theme', value: 'dark', priority: 1 });
configs.set(10, { key: 'language', value: 'en', priority: 10 });
configs.set(5, { key: 'notifications', value: true, priority: 5 });

// Process configs in priority order
for (const [priority, config] of configs) {
  console.log(`Applying ${config.key} (priority ${priority})`);
}
```

### Price Range Queries

```typescript
const products = new SortedMap<number, string>();

products.set(10.99, 'Notebook');
products.set(5.49, 'Pen');
products.set(25.00, 'Calculator');
products.set(2.99, 'Eraser');
products.set(15.50, 'Ruler');

// Get cheapest and most expensive
console.log(`Cheapest: ${products.firstEntry()}`); // [2.99, "Eraser"]
console.log(`Most expensive: ${products.lastEntry()}`); // [25.00, "Calculator"]

// List all products by price
for (const [price, product] of products) {
  console.log(`${product}: $${price}`);
}
```

## Error Handling

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new SortedMap<number, string>();
  empty.firstKey(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Map is empty!');
  }
}

try {
  const empty = new SortedMap<number, string>();
  empty.lastEntry(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Cannot get entry from empty map!');
  }
}

// Non-existent keys return undefined
const map = new SortedMap<number, string>();
console.log(map.get(999)); // undefined
console.log(map.delete(999)); // false
```

:::caution Empty Map Operations
`firstKey()`, `lastKey()`, `firstEntry()`, and `lastEntry()` throw `EmptyStructureError` on empty maps.
:::

## Performance Characteristics

| Operation       | Time Complexity | Description                     |
| --------------- | --------------- | ------------------------------- |
| `set()`         | O(log n)        | Add or update key-value pair    |
| `get()`         | O(log n)        | Retrieve value by key           |
| `has()`         | O(log n)        | Check if key exists             |
| `delete()`      | O(log n)        | Remove entry by key             |
| `firstKey()`    | O(log n)        | Get smallest key                |
| `lastKey()`     | O(log n)        | Get largest key                 |
| `firstEntry()`  | O(log n)        | Get entry with smallest key     |
| `lastEntry()`   | O(log n)        | Get entry with largest key      |
| `keys()`        | O(n)            | Get all keys (sorted)           |
| `values()`      | O(n)            | Get all values (key order)      |
| `entries()`     | O(n)            | Get all entries (key order)     |
| `clear()`       | O(1)            | Remove all entries              |

**Space Complexity:** O(n) where n is the number of entries

## Implementation Details

### Red-Black Tree Backing

- Uses a self-balancing Red-Black Tree for storage
- Maintains O(log n) performance for all operations
- Guarantees balanced tree structure
- In-order traversal provides sorted iteration

### Comparator Function

The comparator determines key ordering:
- **Return negative**: `a` comes before `b`
- **Return positive**: `b` comes before `a`
- **Return zero**: Keys are equal (update value)

```typescript
// Ascending order (default for numbers)
(a, b) => a - b

// Descending order
(a, b) => b - a

// String comparison
(a, b) => a.localeCompare(b)
```

:::info When to Use SortedMap
Perfect for:
- **Leaderboards** - Maintain scores in sorted order
- **Time-series data** - Store events chronologically
- **Priority-based configs** - Process by priority
- **Range queries** - Need min/max efficiently
- **Ordered iteration** - Always iterate in sorted order
- **Log storage** - Timestamp-based retrieval
:::

:::warning When to Avoid
Consider alternatives when:
- **Don't need sorting** → Use regular Map (O(1) operations)
- **Need O(1) access** → Use Map or [LRUCache](./lru-cache)
- **Keys aren't comparable** → Use Map with custom keys
- **Memory constrained** → Map has less overhead than tree structure
:::

## Comparison with Map

| Feature              | SortedMap            | Map                   |
| -------------------- | -------------------- | --------------------- |
| **set/get/delete**   | O(log n)             | O(1) average          |
| **Iteration order**  | Sorted by key        | Insertion order       |
| **firstKey/lastKey** | O(log n)             | N/A (must iterate)    |
| **Memory overhead**  | Higher (tree nodes)  | Lower (hash table)    |
| **Use case**         | Ordered data         | Fast unordered access |

## See Also

- [RedBlackTree](./red-black-tree) - Underlying self-balancing tree structure
- [BiMap](./bi-map) - Bidirectional map with O(1) lookups
- [LRUCache](./lru-cache) - Cache with automatic eviction
- [Trie](./trie) - Prefix tree for string keys
