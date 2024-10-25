import { assertEquals, assertExists, assertThrows } from '@std/assert';

import { EmptyStructureError } from '../errors/index.ts';
import { SortedMap } from '../core/sorted-map.ts';

// Constructor tests
Deno.test('SortedMap - should create an empty map', () => {
  const map = new SortedMap<number, string>();
  assertEquals(map.size, 0);
  assertEquals(map.isEmpty(), true);
});

Deno.test('SortedMap - should initialize with entries', () => {
  const entries: [number, string][] = [
    [3, 'three'],
    [1, 'one'],
    [2, 'two'],
  ];
  const map = new SortedMap<number, string>({ entries });
  assertEquals(map.size, 3);
  assertEquals(map.entries(), [
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
  ]);
});

Deno.test('SortedMap - should use custom comparator', () => {
  const map = new SortedMap<number, string>({
    comparator: (a, b) => b - a,
    entries: [
      [3, 'three'],
      [1, 'one'],
      [2, 'two'],
    ],
  });
  assertEquals(map.entries(), [
    [3, 'three'],
    [2, 'two'],
    [1, 'one'],
  ]);
});

// Basic operations tests
Deno.test('SortedMap - should set and get values', () => {
  const map = new SortedMap<number, string>();
  map.set(1, 'one');
  assertEquals(map.get(1), 'one');
  assertEquals(map.size, 1);
});

Deno.test('SortedMap - should update existing values', () => {
  const map = new SortedMap<number, string>();
  map.set(1, 'one');
  map.set(1, 'ONE');
  assertEquals(map.get(1), 'ONE');
  assertEquals(map.size, 1);
});

Deno.test('SortedMap - should check existence of keys', () => {
  const map = new SortedMap<number, string>();
  map.set(1, 'one');
  assertEquals(map.has(1), true);
  assertEquals(map.has(2), false);
});

Deno.test('SortedMap - should delete entries', () => {
  const map = new SortedMap<number, string>();
  map.set(1, 'one');
  assertEquals(map.delete(1), true);
  assertEquals(map.has(1), false);
  assertEquals(map.size, 0);
  assertEquals(map.delete(1), false);
});

Deno.test('SortedMap - should clear all entries', () => {
  const map = new SortedMap<number, string>();
  map.set(1, 'one');
  map.set(2, 'two');
  map.clear();
  assertEquals(map.size, 0);
  assertEquals(map.isEmpty(), true);
});

// Ordered operations tests
Deno.test('SortedMap - should maintain sorted order', () => {
  const map = new SortedMap<number, string>();
  map.set(3, 'three');
  map.set(1, 'one');
  map.set(2, 'two');
  assertEquals(map.entries(), [
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
  ]);
});

Deno.test('SortedMap - should get first and last keys', () => {
  const map = new SortedMap<number, string>();
  map.set(3, 'three');
  map.set(1, 'one');
  map.set(2, 'two');
  assertEquals(map.firstKey(), 1);
  assertEquals(map.lastKey(), 3);
});

Deno.test(
  'SortedMap - should throw on first/last operations when empty',
  () => {
    const emptyMap = new SortedMap<number, string>();
    assertThrows(() => emptyMap.firstKey(), EmptyStructureError);
    assertThrows(() => emptyMap.lastKey(), EmptyStructureError);
  },
);

// Iteration tests
Deno.test('SortedMap - should iterate entries in sorted order', () => {
  const entries: [number, string][] = [
    [3, 'three'],
    [1, 'one'],
    [2, 'two'],
  ];
  const sortedEntries = [...entries].sort(([a], [b]) => a - b);
  const map = new SortedMap<number, string>({ entries });

  const result: [number, string][] = [];
  for (const entry of map) {
    result.push(entry);
  }
  assertEquals(result, sortedEntries);
});

// Edge cases
Deno.test('SortedMap - should handle undefined values', () => {
  const map = new SortedMap<number, string | undefined>();
  map.set(1, undefined);
  assertEquals(map.get(1), undefined);
  assertEquals(map.has(1), true);
});

// Performance characteristics
Deno.test(
  'SortedMap - should handle large number of entries efficiently',
  () => {
    const map = new SortedMap<number, number>();
    const n = 10000;
    for (let i = 0; i < n; i++) {
      map.set(Math.random() * n, i);
    }
    assertEquals(map.size, n);
    let prev = map.firstKey();
    for (const [key] of map) {
      assertExists(key >= prev);
      prev = key;
    }
  },
);

Deno.test('firstEntry: should return the first entry', () => {
  const map = new SortedMap<number, string>();
  map.set(3, 'three');
  map.set(1, 'one');
  map.set(2, 'two');

  assertEquals(map.firstEntry(), [1, 'one']);
});

Deno.test('lastEntry: should return the last entry', () => {
  const map = new SortedMap<number, string>();
  map.set(3, 'three');
  map.set(1, 'one');
  map.set(2, 'two');

  assertEquals(map.lastEntry(), [3, 'three']);
});

Deno.test('keys: should return all keys in sorted order', () => {
  const map = new SortedMap<number, string>();
  map.set(3, 'three');
  map.set(1, 'one');
  map.set(2, 'two');

  assertEquals(map.keys(), [1, 2, 3]);
});

Deno.test('values: should return all values in key-sorted order', () => {
  const map = new SortedMap<number, string>();
  map.set(3, 'three');
  map.set(1, 'one');
  map.set(2, 'two');

  assertEquals(map.values(), ['one', 'two', 'three']);
});

Deno.test(
  'forEach: should execute a callback for each entry in sorted order',
  () => {
    const map = new SortedMap<number, string>();
    map.set(3, 'three');
    map.set(1, 'one');
    map.set(2, 'two');

    const results: [number, string][] = [];
    map.forEach((value, key) => {
      results.push([key, value]);
    });

    assertEquals(results, [
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
    ]);
  },
);

Deno.test('firstEntry: should throw an error when map is empty', () => {
  const map = new SortedMap<number, string>();
  assertThrows(
    () => map.firstEntry(),
    EmptyStructureError,
    'Cannot get first entry of empty map',
  );
});

Deno.test('lastEntry: should throw an error when map is empty', () => {
  const map = new SortedMap<number, string>();
  assertThrows(
    () => map.lastEntry(),
    EmptyStructureError,
    'Cannot get last entry of empty map',
  );
});
