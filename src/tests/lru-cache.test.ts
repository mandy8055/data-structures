import { assertEquals, assertThrows } from '@std/assert';
import { LRUCache } from '../core/lru-cache.ts';

Deno.test('LRUCache - constructor with valid capacity', () => {
  const cache = new LRUCache<string, number>({ capacity: 3 });
  assertEquals(cache.size, 0);
});

Deno.test('LRUCache - constructor throws error for invalid capacity', () => {
  assertThrows(
    () => new LRUCache<string, number>({ capacity: 0 }),
    Error,
    'Capacity must be greater than 0',
  );

  assertThrows(
    () => new LRUCache<string, number>({ capacity: -1 }),
    Error,
    'Capacity must be greater than 0',
  );
});

Deno.test('LRUCache - basic put and get operations', () => {
  const cache = new LRUCache<string, number>({ capacity: 3 });
  cache.put('a', 1);
  assertEquals(cache.get('a'), 1);
  assertEquals(cache.size, 1);
});

Deno.test('LRUCache - updating existing values', () => {
  const cache = new LRUCache<string, number>({ capacity: 3 });
  cache.put('a', 1);
  cache.put('a', 2);
  assertEquals(cache.get('a'), 2);
  assertEquals(cache.size, 1);
});

Deno.test('LRUCache - evicting least recently used item', () => {
  const cache = new LRUCache<string, number>({ capacity: 3 });
  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);
  cache.put('d', 4);

  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.get('b'), 2);
  assertEquals(cache.get('c'), 3);
  assertEquals(cache.get('d'), 4);
  assertEquals(cache.size, 3);
});

Deno.test('LRUCache - updating access order on get', () => {
  const cache = new LRUCache<string, number>({ capacity: 3 });
  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);

  // Access 'a', making 'b' the least recently used
  cache.get('a');
  cache.put('d', 4);

  assertEquals(cache.get('b'), undefined);
  assertEquals(cache.get('a'), 1);
  assertEquals(cache.size, 3);
});

Deno.test('LRUCache - TTL expiration', async () => {
  const cache = new LRUCache<string, number>({ capacity: 2, ttl: 50 });
  cache.put('a', 1);

  assertEquals(cache.get('a'), 1);

  // Wait for TTL to expire
  await new Promise((resolve) => setTimeout(resolve, 60));

  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.size, 0);
});

Deno.test('LRUCache - has check with TTL', async () => {
  const cache = new LRUCache<string, number>({ capacity: 2, ttl: 50 });
  cache.put('a', 1);

  assertEquals(cache.has('a'), true);

  await new Promise((resolve) => setTimeout(resolve, 60));

  assertEquals(cache.has('a'), false);
  assertEquals(cache.size, 0);
});

Deno.test('LRUCache - has operation', () => {
  const cache = new LRUCache<string, number>({ capacity: 2 });
  cache.put('a', 1);

  assertEquals(cache.has('a'), true);
  assertEquals(cache.has('b'), false);
});

Deno.test('LRUCache - delete existing item', () => {
  const cache = new LRUCache<string, number>({ capacity: 2 });
  cache.put('a', 1);
  cache.put('b', 2);

  assertEquals(cache.delete('a'), true);
  assertEquals(cache.size, 1);
  assertEquals(cache.get('a'), undefined);
});

Deno.test('LRUCache - delete non-existent item', () => {
  const cache = new LRUCache<string, number>({ capacity: 2 });
  assertEquals(cache.delete('nonexistent'), false);
});

Deno.test('LRUCache - clear all items', () => {
  const cache = new LRUCache<string, number>({ capacity: 2 });
  cache.put('a', 1);
  cache.put('b', 2);

  cache.clear();
  assertEquals(cache.size, 0);
  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.get('b'), undefined);
});

Deno.test('LRUCache - entries in most to least recently used order', () => {
  const cache = new LRUCache<string, number>({ capacity: 3 });
  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);
  cache.get('a'); // Move 'a' to most recent

  const entries = cache.entries();
  assertEquals(entries, [
    ['a', 1],
    ['c', 3],
    ['b', 2],
  ]);
});

Deno.test('LRUCache - entries excluding expired items', async () => {
  const cache = new LRUCache<string, number>({ capacity: 2, ttl: 50 });
  cache.put('a', 1);
  cache.put('b', 2);

  await new Promise((resolve) => setTimeout(resolve, 60));

  assertEquals(cache.entries(), []);
});

Deno.test('LRUCache - iteration order', () => {
  const cache = new LRUCache<string, number>({ capacity: 3 });
  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);
  cache.get('a'); // Move 'a' to most recent

  const entries: [string, number][] = [];
  for (const entry of cache) {
    entries.push(entry);
  }

  assertEquals(entries, [
    ['a', 1],
    ['c', 3],
    ['b', 2],
  ]);
});

Deno.test('LRUCache - empty cache iteration', () => {
  const cache = new LRUCache<string, number>({ capacity: 3 });
  const entries: [string, number][] = [];

  for (const entry of cache) {
    entries.push(entry);
  }

  assertEquals(entries, []);
});

Deno.test('LRUCache - complex mixed operations', () => {
  const cache = new LRUCache<string, number>({ capacity: 3 });

  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);
  cache.get('a');
  cache.put('d', 4);
  cache.delete('c');
  cache.put('e', 5);

  const entries = cache.entries();
  assertEquals(entries, [
    ['e', 5],
    ['d', 4],
    ['a', 1],
  ]);
  assertEquals(cache.size, 3);
});

Deno.test('LRUCache - order maintenance with updates', () => {
  const cache = new LRUCache<string, number>({ capacity: 3 });

  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);
  cache.put('b', 20); // Update existing value

  const entries = cache.entries();
  assertEquals(entries, [
    ['b', 20],
    ['c', 3],
    ['a', 1],
  ]);
});

Deno.test('LRUCache - TTL timestamp cleanup on eviction', () => {
  const cache = new LRUCache<string, number>({ capacity: 2, ttl: 1000 });

  // Fill the cache
  cache.put('a', 1);
  cache.put('b', 2);

  // This should evict "a" and clean up its timestamp
  cache.put('c', 3);

  // Verify "a" is completely removed
  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.has('a'), false);
  assertEquals(cache.size, 2);

  // Verify entry order
  const entries = cache.entries();
  assertEquals(entries, [
    ['c', 3],
    ['b', 2],
  ]);
});

Deno.test('LRUCache - TTL timestamp cleanup on clear', () => {
  const cache = new LRUCache<string, number>({ capacity: 2, ttl: 1000 });

  // Add items
  cache.put('a', 1);
  cache.put('b', 2);

  // Clear cache
  cache.clear();

  // Add new items to verify timestamps were cleared
  cache.put('c', 3);
  assertEquals(cache.has('c'), true);
  assertEquals(cache.size, 1);
});

Deno.test('LRUCache - TTL with missing timestamp', () => {
  const cache = new LRUCache<string, number>({ capacity: 2, ttl: 50 });
  cache.put('a', 1);

  // Force timestamp to be undefined by directly clearing timestamps Map
  // @ts-ignore - Accessing private property for testing
  cache.timestamps.delete('a');

  // Item should be considered expired when timestamp is missing
  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.has('a'), false);
  assertEquals(cache.size, 0);
});

Deno.test('LRUCache - TTL comprehensive timestamp handling', async () => {
  const cache = new LRUCache<string, number>({ capacity: 2, ttl: 50 });

  // Add items
  cache.put('a', 1);
  cache.put('b', 2);

  // Force timestamp to be undefined for one item
  // @ts-ignore - Accessing private property for testing
  cache.timestamps.delete('a');

  // Verify behavior
  assertEquals(cache.get('a'), undefined); // Should be undefined due to missing timestamp
  assertEquals(cache.get('b'), 2); // Should still be available

  // Wait for TTL to expire
  await new Promise((resolve) => setTimeout(resolve, 60));

  // Both items should now be unavailable
  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.get('b'), undefined);
  assertEquals(cache.size, 0);
});
