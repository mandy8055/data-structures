---
id: lru-cache
title: LRUCache
sidebar_label: LRUCache
description: Least Recently Used cache with O(1) operations and automatic eviction
keywords: [lru-cache, cache, least-recently-used, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# LRUCache

A Least Recently Used (LRU) cache implementation that provides O(1) operations for accessing and storing elements, with automatic eviction of the least recently used items when capacity is reached.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='LRUCache' />

## Usage

```typescript
import { LRUCache } from '@msnkr/data-structures';

const cache = new LRUCache<string, number>({ capacity: 3 });
```

## API Reference

### Constructor Options

```typescript
interface LRUCacheOptions {
  capacity: number; // Required: Maximum number of items
  ttl?: number; // Optional: Time-to-live in milliseconds
}
```

### Properties

- `size: number` - Current number of elements in the cache

### Methods

#### Accessing Elements

```typescript
// Get value by key - O(1)
const value = cache.get('key');

// Check if key exists - O(1)
const exists = cache.has('key');
```

:::tip LRU Behavior
Accessing an element with `get()` marks it as recently used, moving it to the front of the cache.
:::

#### Adding/Updating Elements

```typescript
// Add or update an item - O(1)
cache.put('key', value);
```

:::info Capacity Management
When adding an item to a full cache, the least recently used item is automatically evicted.
:::

#### Removing Elements

```typescript
// Remove specific item - O(1)
const removed = cache.delete('key');

// Remove all items - O(1)
cache.clear();
```

#### Iteration

```typescript
// Get all entries (most to least recently used)
const entries = cache.entries();

// Iterate over cache entries
for (const [key, value] of cache) {
  console.log(key, value);
}
```

## Examples

### Basic Usage

```typescript
const cache = new LRUCache<string, number>({ capacity: 3 });

// Add some items
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);

console.log(cache.get('a')); // 1
console.log(cache.size); // 3

// Adding a new item when at capacity
cache.put('d', 4); // Evicts "b" (least recently used)

console.log(cache.has('b')); // false
console.log([...cache]); // [["d", 4], ["c", 3], ["a", 1]]
```

### API Response Caching

```typescript
interface APIResponse {
  data: unknown;
  timestamp: number;
}

const apiCache = new LRUCache<string, APIResponse>({ capacity: 100 });

async function fetchWithCache(url: string): Promise<unknown> {
  // Check cache first
  const cached = apiCache.get(url);
  if (cached) {
    console.log('Cache hit!');
    return cached.data;
  }

  // Fetch from API
  const response = await fetch(url);
  const data = await response.json();

  // Store in cache
  apiCache.put(url, {
    data,
    timestamp: Date.now(),
  });

  return data;
}

// Usage
await fetchWithCache('/api/users'); // API call
await fetchWithCache('/api/users'); // Cache hit!
```

### Database Query Cache

```typescript
interface QueryResult {
  rows: unknown[];
  count: number;
}

const queryCache = new LRUCache<string, QueryResult>({ capacity: 50 });

function executeQuery(sql: string): QueryResult {
  // Check cache
  const cached = queryCache.get(sql);
  if (cached) {
    return cached;
  }

  // Execute query (expensive operation)
  const result = database.execute(sql);

  // Cache result
  queryCache.put(sql, result);

  return result;
}
```

### Time-Based Expiration

```typescript
const sessionCache = new LRUCache<string, object>({
  capacity: 1000,
  ttl: 3600000, // 1 hour in milliseconds
});

// Store user session
sessionCache.put('session-123', {
  userId: 'user-456',
  loginTime: Date.now(),
});

// After 1 hour, the session expires automatically
setTimeout(() => {
  console.log(sessionCache.get('session-123')); // undefined (expired)
}, 3600001);
```

### Image Thumbnail Cache

```typescript
interface Thumbnail {
  url: string;
  width: number;
  height: number;
  blob: Blob;
}

const thumbnailCache = new LRUCache<string, Thumbnail>({
  capacity: 50,
  ttl: 300000, // 5 minutes
});

async function getThumbnail(imageId: string): Promise<Thumbnail> {
  const cached = thumbnailCache.get(imageId);
  if (cached) return cached;

  const thumbnail = await generateThumbnail(imageId);
  thumbnailCache.put(imageId, thumbnail);
  return thumbnail;
}
```

### LRU Iteration Order

```typescript
const cache = new LRUCache<string, number>({ capacity: 3 });

cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);
cache.get('a'); // Marks "a" as most recently used

// Entries are returned in order of most to least recently used
for (const [key, value] of cache) {
  console.log(key, value);
}
// Output:
// "a" 1 (most recently used - accessed with get)
// "c" 3
// "b" 2 (least recently used)
```

### Configuration Cache

```typescript
interface Config {
  theme: string;
  language: string;
  preferences: Record<string, unknown>;
}

const configCache = new LRUCache<string, Config>({ capacity: 100 });

function getUserConfig(userId: string): Config {
  const cached = configCache.get(userId);
  if (cached) return cached;

  // Load from database (expensive)
  const config = loadConfigFromDB(userId);
  configCache.put(userId, config);
  return config;
}

function updateUserConfig(userId: string, config: Config): void {
  // Update database
  saveConfigToDB(userId, config);

  // Invalidate cache
  configCache.delete(userId);
}
```

## Error Handling

```typescript
try {
  const cache = new LRUCache<string, number>({ capacity: -1 });
} catch (error) {
  console.log('Invalid capacity!'); // Throws Error for invalid capacity
}

try {
  const cache = new LRUCache<string, number>({ capacity: 0 });
} catch (error) {
  console.log('Capacity must be positive!');
}

// Non-existent keys return undefined
const cache = new LRUCache<string, number>({ capacity: 10 });
console.log(cache.get('nonexistent')); // undefined
console.log(cache.delete('nonexistent')); // false
```

:::caution Invalid Capacity
The constructor throws an error if capacity is not a positive integer.
:::

## Performance Characteristics

| Operation   | Time Complexity | Description                      |
| ----------- | --------------- | -------------------------------- |
| `put()`     | O(1)            | Add or update item               |
| `get()`     | O(1)            | Retrieve item (marks as used)    |
| `has()`     | O(1)            | Check if key exists              |
| `delete()`  | O(1)            | Remove specific item             |
| `clear()`   | O(1)            | Remove all items                 |
| `entries()` | O(n)            | Get all entries                  |

**Space Complexity:** O(capacity) - stores at most `capacity` items

## Implementation Details

### Internal Structure

- Uses a **HashMap** for O(1) key lookups
- Uses a **DoublyLinkedList** to track access order (most to least recent)
- Each access moves the item to the front of the list
- Eviction removes the item at the back of the list

### LRU Eviction Policy

When the cache is at capacity and a new item is added:
1. The least recently used item (back of list) is removed
2. The new item is added to the front
3. Both the HashMap and DoublyLinkedList are updated

### TTL (Time-To-Live) Feature

When TTL is configured:
- Each entry stores a timestamp
- On access, expired entries are automatically removed
- Expired entries don't count toward capacity

:::info When to Use LRUCache
Perfect for:
- **API response caching** - Reduce external API calls
- **Database query caching** - Cache frequent queries
- **Computed values** - Memoize expensive calculations
- **Session storage** - Temporary user session data
- **Image/asset caching** - Recently viewed media
- **Configuration caching** - User preferences and settings
:::

:::warning When to Avoid
Consider alternatives when:
- **Need custom eviction policy** → Implement custom cache
- **Need guaranteed persistence** → Use database
- **Items have varying costs** → Consider weighted LRU
- **Need distributed caching** → Use Redis or similar
:::

## Comparison with Native Map

| Feature              | LRUCache            | Map                 |
| -------------------- | ------------------- | ------------------- |
| **Max size**         | Enforced (capacity) | Unbounded           |
| **Eviction**         | Automatic (LRU)     | Manual only         |
| **Access tracking**  | Automatic           | None                |
| **TTL support**      | Built-in            | Manual              |
| **Memory management** | Predictable       | Can grow indefinitely |

## See Also

- [BiMap](./bi-map) - Bidirectional map
- [SortedMap](./sorted-map) - Key-value store with ordered keys
- [Trie](./trie) - Prefix tree for string keys
