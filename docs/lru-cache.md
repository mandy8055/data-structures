# LRUCache

A Least Recently Used (LRU) Cache implementation that provides efficient O(1) operations for both accessing and storing elements, with automatic eviction of least recently used items when capacity is reached.

## Usage

```typescript
import { LRUCache } from 'jsr:@mskr/data-structures';

const cache = new LRUCache<string, number>({ capacity: 3 });
```

## API Reference

### Constructor Options

```typescript
interface LRUCacheOptions {
  capacity: number; // Required: Maximum number of items the cache can hold
  ttl?: number; // Optional: Time-to-live in milliseconds for cache entries
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

#### Adding/Updating Elements

```typescript
// Add or update an item - O(1)
cache.put('key', value);
```

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
cache.put('d', 4); // Evicts "b" as it's the least recently used

console.log(cache.has('b')); // false
console.log([...cache]); // [["d", 4], ["c", 3], ["a", 1]]
```

### Time-Based Expiration

```typescript
const cache = new LRUCache<string, object>({
  capacity: 100,
  ttl: 60000, // Items expire after 60 seconds
});

cache.put('key', { data: 'value' });

// After 61 seconds...
console.log(cache.get('key')); // undefined (expired)
```

### Iteration Order

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
// "a" 1
// "c" 3
// "b" 2
```

## Error Handling

```typescript
try {
  const cache = new LRUCache<string, number>({ capacity: -1 });
} catch (error) {
  console.log('Invalid capacity!'); // Throws Error for invalid capacity
}
```

## Performance Characteristics

Key features and performance characteristics:

1. O(1) time complexity for all basic operations:

   - Get operations
   - Put operations
   - Delete operations
   - Size queries

2. Memory usage:

   - Stores up to specified capacity
   - Additional overhead for internal data structures
   - Optional timestamp storage for TTL feature

3. Automatic eviction:

   - Removes least recently used items when capacity is reached
   - Optional time-based expiration of items

4. Type Safety:
   - Full TypeScript support with generics
   - Separate key and value types
