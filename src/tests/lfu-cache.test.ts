import { assertEquals, assertThrows } from '@std/assert';
import { LFUCache } from '../core/lfu-cache.ts';

Deno.test('LFUCache - constructor with valid capacity', () => {
  const cache = new LFUCache<string, number>(3);
  assertEquals(cache.size, 0);
});

Deno.test('LFUCache - constructor throws error for invalid capacity', () => {
  assertThrows(
    () => new LFUCache<string, number>(0),
    Error,
    'Capacity must be greater than 0',
  );

  assertThrows(
    () => new LFUCache<string, number>(-1),
    Error,
    'Capacity must be greater than 0',
  );
});

Deno.test('LFUCache - basic put and get operations', () => {
  const cache = new LFUCache<string, number>(3);
  cache.put('a', 1);
  assertEquals(cache.get('a'), 1);
  assertEquals(cache.size, 1);
});

Deno.test('LFUCache - updating existing values', () => {
  const cache = new LFUCache<string, number>(3);
  cache.put('a', 1);
  cache.put('a', 2);
  assertEquals(cache.get('a'), 2);
  assertEquals(cache.size, 1);
});

Deno.test('LFUCache - evicting least frequently used item', () => {
  const cache = new LFUCache<string, number>(3);

  // Add initial items
  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);

  // Access 'b' and 'c' to increase their frequencies
  cache.get('b');
  cache.get('c');

  // Add new item, should evict 'a' (least frequently used)
  cache.put('d', 4);

  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.get('b'), 2);
  assertEquals(cache.get('c'), 3);
  assertEquals(cache.get('d'), 4);
  assertEquals(cache.size, 3);
});

Deno.test('LFUCache - eviction with equal frequencies', () => {
  const cache = new LFUCache<string, number>(3);

  // Add items with same frequency
  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);

  // Add new item, should evict 'a' (least recently used among least frequent)
  cache.put('d', 4);

  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.get('b'), 2);
  assertEquals(cache.get('c'), 3);
  assertEquals(cache.get('d'), 4);
});

Deno.test('LFUCache - frequency increment on access', () => {
  const cache = new LFUCache<string, number>(3);

  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);

  // Increase frequency of 'a'
  cache.get('a');
  cache.get('a');

  // Add new item, should evict 'b' or 'c' (not 'a')
  cache.put('d', 4);

  assertEquals(cache.get('a'), 1);
  assertEquals(cache.size, 3);
});

Deno.test('LFUCache - has operation', () => {
  const cache = new LFUCache<string, number>(2);
  cache.put('a', 1);

  assertEquals(cache.has('a'), true);
  assertEquals(cache.has('b'), false);

  // Verify 'has' doesn't affect frequency
  cache.put('b', 2);
  cache.put('c', 3);

  assertEquals(cache.has('a'), false);
});

Deno.test('LFUCache - delete existing item', () => {
  const cache = new LFUCache<string, number>(2);
  cache.put('a', 1);
  cache.put('b', 2);

  assertEquals(cache.delete('a'), true);
  assertEquals(cache.size, 1);
  assertEquals(cache.get('a'), undefined);

  // Verify frequency handling after delete
  cache.put('c', 3);
  cache.put('d', 4);
  assertEquals(cache.get('b'), 2);
});

Deno.test('LFUCache - delete non-existent item', () => {
  const cache = new LFUCache<string, number>(2);
  assertEquals(cache.delete('nonexistent'), false);
});

Deno.test('LFUCache - clear all items', () => {
  const cache = new LFUCache<string, number>(2);
  cache.put('a', 1);
  cache.put('b', 2);

  cache.clear();
  assertEquals(cache.size, 0);
  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.get('b'), undefined);

  // Verify cache works correctly after clear
  cache.put('c', 3);
  assertEquals(cache.get('c'), 3);
});

Deno.test('LFUCache - entries in frequency order', () => {
  const cache = new LFUCache<string, number>(3);
  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);

  // Increase frequencies
  cache.get('a'); // freq 2
  cache.get('a'); // freq 3
  cache.get('b'); // freq 2

  const entries = Array.from(cache.entries());
  assertEquals(entries, [
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);
});

Deno.test('LFUCache - iteration order', () => {
  const cache = new LFUCache<string, number>(3);
  cache.put('a', 1);
  cache.put('b', 2);
  cache.put('c', 3);

  // Increase frequencies
  cache.get('b'); // freq 2
  cache.get('c'); // freq 2
  cache.get('c'); // freq 3

  const entries: [string, number][] = [];
  for (const entry of cache) {
    entries.push(entry);
  }

  assertEquals(entries, [
    ['c', 3],
    ['b', 2],
    ['a', 1],
  ]);
});

Deno.test('LFUCache - empty cache iteration', () => {
  const cache = new LFUCache<string, number>(3);
  const entries: [string, number][] = [];

  for (const entry of cache) {
    entries.push(entry);
  }

  assertEquals(entries, []);
});

Deno.test('LFUCache - complex mixed operations', () => {
  const cache = new LFUCache<string, number>(3);

  cache.put('a', 1);
  cache.put('b', 2);
  cache.get('b');
  cache.put('c', 3);
  cache.get('c');
  cache.get('c');
  cache.delete('b');
  cache.put('d', 4);
  cache.put('e', 5);

  const entries = Array.from(cache.entries());
  assertEquals(entries, [
    ['c', 3],
    ['e', 5],
    ['d', 4],
  ]);
  assertEquals(cache.size, 3);
});

Deno.test('LFUCache - frequency handling after updates', () => {
  const cache = new LFUCache<string, number>(3);

  cache.put('a', 1);
  cache.get('a'); // freq 2
  cache.put('a', 10); // should maintain freq 2

  cache.put('b', 2);
  cache.put('c', 3);
  cache.put('d', 4); // should evict 'b' or 'c', not 'a'

  assertEquals(cache.get('a'), 10);
  assertEquals(cache.size, 3);
});

Deno.test('LFUCache - maintaining min frequency', () => {
  const cache = new LFUCache<string, number>(3);

  cache.put('a', 1);
  cache.put('b', 2);
  cache.get('a'); // freq 2
  cache.put('c', 3);

  // 'b' and 'c' have freq 1, 'a' has freq 2
  cache.delete('b');
  cache.put('d', 4); // should work with updated min frequency

  assertEquals(cache.get('c'), 3);
  assertEquals(cache.get('d'), 4);
});

Deno.test('LFUCache - capacity edge cases', () => {
  const cache = new LFUCache<string, number>(1);

  cache.put('a', 1);
  cache.get('a'); // freq 2
  cache.put('b', 2); // should evict 'a' despite higher frequency

  assertEquals(cache.get('a'), undefined);
  assertEquals(cache.get('b'), 2);
  assertEquals(cache.size, 1);
});
