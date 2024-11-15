// Copyright 2024-2025 the @mskr/data-structures authors. All rights reserved. MIT license.

import { assertEquals, assertThrows } from '@std/assert';
import { LFUCache } from '../core/lfu-cache.ts';

Deno.test('LFUCache - constructor with valid capacity', () => {
  const cache = new LFUCache<string, number>({ capacity: 3 });
  assertEquals(cache.size, 0);
});

Deno.test('LFUCache - constructor throws error for invalid capacity', () => {
  assertThrows(
    () => new LFUCache<string, number>({ capacity: 0 }),
    Error,
    'Capacity must be greater than 0',
  );

  assertThrows(
    () => new LFUCache<string, number>({ capacity: -1 }),
    Error,
    'Capacity must be greater than 0',
  );
});

Deno.test('LFUCache - basic put and get operations', () => {
  const cache = new LFUCache<string, number>({ capacity: 3 });
  cache.put('a', 1);
  assertEquals(cache.get('a'), 1);
  assertEquals(cache.size, 1);
});

Deno.test('LFUCache - updating existing values', () => {
  const cache = new LFUCache<string, number>({ capacity: 3 });
  cache.put('a', 1);
  cache.put('a', 2);
  assertEquals(cache.get('a'), 2);
  assertEquals(cache.size, 1);
});

Deno.test('LFUCache - evicting least frequently used item', () => {
  const cache = new LFUCache<string, number>({ capacity: 2 });
  cache.put('a', 1); // freq: 1
  cache.put('b', 2); // freq: 1
  cache.get('b'); // freq: 2
  cache.put('c', 3); // should evict 'a' (freq: 1)

  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.get('b'), 2);
  assertEquals(cache.get('c'), 3);
  assertEquals(cache.size, 2);
});

Deno.test(
  'LFUCache - evicting least recently used among least frequently used',
  () => {
    const cache = new LFUCache<string, number>({ capacity: 3 });
    cache.put('a', 1);
    cache.put('b', 2);
    cache.put('c', 3);

    // Increase frequency of 'b'
    cache.get('b');

    // Add new item, should evict 'a' (same frequency as 'c' but less recent)
    cache.put('d', 4);

    assertEquals(cache.get('a'), undefined);
    assertEquals(cache.get('b'), 2);
    assertEquals(cache.get('c'), 3);
    assertEquals(cache.get('d'), 4);
  },
);

Deno.test('LFUCache - frequency counting', () => {
  const cache = new LFUCache<string, number>({ capacity: 2 });
  cache.put('a', 1);
  cache.get('a'); // freq: 2
  cache.get('a'); // freq: 3
  cache.put('b', 2); // freq: 1
  cache.put('c', 3); // should evict 'b' (lowest freq)

  assertEquals(cache.get('a'), 1);
  assertEquals(cache.get('b'), undefined);
  assertEquals(cache.get('c'), 3);
});

Deno.test('LFUCache - TTL expiration', async () => {
  const cache = new LFUCache<string, number>({ capacity: 2, ttl: 50 });
  cache.put('a', 1);

  assertEquals(cache.get('a'), 1);

  await new Promise((resolve) => setTimeout(resolve, 60));

  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.size, 0);
});

Deno.test('LFUCache - has check with TTL', async () => {
  const cache = new LFUCache<string, number>({ capacity: 2, ttl: 50 });
  cache.put('a', 1);

  assertEquals(cache.has('a'), true);

  await new Promise((resolve) => setTimeout(resolve, 60));

  assertEquals(cache.has('a'), false);
  assertEquals(cache.size, 0);
});

Deno.test('LFUCache - has operation', () => {
  const cache = new LFUCache<string, number>({ capacity: 2 });
  cache.put('a', 1);

  assertEquals(cache.has('a'), true);
  assertEquals(cache.has('b'), false);
});

Deno.test('LFUCache - delete existing item', () => {
  const cache = new LFUCache<string, number>({ capacity: 2 });
  cache.put('a', 1);
  cache.put('b', 2);

  assertEquals(cache.delete('a'), true);
  assertEquals(cache.size, 1);
  assertEquals(cache.get('a'), undefined);
});

Deno.test('LFUCache - delete non-existent item', () => {
  const cache = new LFUCache<string, number>({ capacity: 2 });
  assertEquals(cache.delete('nonexistent'), false);
});

Deno.test('LFUCache - clear all items', () => {
  const cache = new LFUCache<string, number>({ capacity: 2 });
  cache.put('a', 1);
  cache.put('b', 2);

  cache.clear();
  assertEquals(cache.size, 0);
  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.get('b'), undefined);
});

Deno.test('LFUCache - entries in frequency order', () => {
  const cache = new LFUCache<string, number>({ capacity: 3 });
  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);
  cache.get('a'); // Increase frequency of 'a'
  cache.get('a'); // Increase frequency of 'a' again

  const entries = cache.entries();
  assertEquals(entries, [
    ['a', 1], // Highest frequency
    ['c', 3], // Lower frequency, more recent
    ['b', 2], // Lower frequency, less recent
  ]);
});

Deno.test('LFUCache - entries excluding expired items', async () => {
  const cache = new LFUCache<string, number>({ capacity: 2, ttl: 50 });
  cache.put('a', 1);
  cache.put('b', 2);

  await new Promise((resolve) => setTimeout(resolve, 60));

  assertEquals(cache.entries(), []);
});

Deno.test('LFUCache - iteration order', () => {
  const cache = new LFUCache<string, number>({ capacity: 3 });
  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);
  cache.get('b'); // Increase frequency of 'b'
  cache.get('b'); // Increase frequency of 'b' again

  const entries: [string, number][] = [];
  for (const entry of cache) {
    entries.push(entry);
  }

  assertEquals(entries, [
    ['b', 2], // Highest frequency
    ['c', 3], // Lower frequency, more recent
    ['a', 1], // Lower frequency, less recent
  ]);
});

Deno.test('LFUCache - empty cache iteration', () => {
  const cache = new LFUCache<string, number>({ capacity: 3 });
  const entries: [string, number][] = [];

  for (const entry of cache) {
    entries.push(entry);
  }

  assertEquals(entries, []);
});

Deno.test('LFUCache - complex mixed operations', () => {
  const cache = new LFUCache<string, number>({ capacity: 3 });

  cache.put('a', 1);
  cache.get('a'); // freq: 2
  cache.put('b', 2);
  cache.put('c', 3);
  cache.get('c'); // freq: 2
  cache.put('d', 4); // evicts 'b' (freq: 1)
  cache.delete('c');
  cache.put('e', 5);

  const entries = cache.entries();
  assertEquals(entries, [
    ['a', 1], // freq: 2
    ['e', 5], // freq: 1, more recent
    ['d', 4], // freq: 1, less recent
  ]);
  assertEquals(cache.size, 3);
});

Deno.test('LFUCache - order maintenance with updates', () => {
  const cache = new LFUCache<string, number>({ capacity: 3 });

  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);
  cache.put('b', 20); // Update existing value, frequency should increase

  const entries = cache.entries();
  assertEquals(entries, [
    ['b', 20], // Higher frequency due to update
    ['c', 3], // Original frequency, more recent
    ['a', 1], // Original frequency, less recent
  ]);
});

Deno.test('LFUCache - TTL timestamp cleanup on eviction', () => {
  const cache = new LFUCache<string, number>({ capacity: 2, ttl: 1000 });

  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3); // Should evict 'a'

  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.has('a'), false);
  assertEquals(cache.size, 2);

  const entries = cache.entries();
  assertEquals(entries, [
    ['c', 3],
    ['b', 2],
  ]);
});

Deno.test('LFUCache - TTL timestamp cleanup on clear', () => {
  const cache = new LFUCache<string, number>({ capacity: 2, ttl: 1000 });

  cache.put('a', 1);
  cache.put('b', 2);

  cache.clear();

  cache.put('c', 3);
  assertEquals(cache.has('c'), true);
  assertEquals(cache.size, 1);
});

Deno.test('LFUCache - TTL with missing timestamp', () => {
  const cache = new LFUCache<string, number>({ capacity: 2, ttl: 50 });
  cache.put('a', 1);

  // Force timestamp to be undefined by directly clearing timestamps Map
  // @ts-ignore - Accessing private property for testing
  cache.timestamps.delete('a');

  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.has('a'), false);
  assertEquals(cache.size, 0);
});

Deno.test('LFUCache - frequency retention after value update', () => {
  const cache = new LFUCache<string, number>({ capacity: 2 });

  cache.put('a', 1);
  cache.get('a'); // freq: 2
  cache.put('a', 10); // Should maintain frequency
  cache.put('b', 2);
  cache.put('c', 3); // Should evict 'b' (lowest freq) not 'a'

  assertEquals(cache.get('a'), 10);
  assertEquals(cache.get('b'), undefined);
  assertEquals(cache.get('c'), 3);
});

Deno.test('LFUCache - frequency list maintenance', () => {
  const cache = new LFUCache<string, number>({ capacity: 3 });

  cache.put('a', 1);
  cache.get('a'); // freq: 2
  cache.get('a'); // freq: 3
  cache.put('b', 2);
  cache.get('b'); // freq: 2
  cache.put('c', 3);

  // Verify that deleting middle frequency maintains list structure
  cache.delete('b');

  cache.put('d', 4);
  assertEquals(cache.get('a'), 1);
  assertEquals(cache.get('c'), 3);
  assertEquals(cache.get('d'), 4);
});
