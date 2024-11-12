import { assertEquals, assertFalse, assertStrictEquals } from '@std/assert';
import { BiDirectionalMap } from '../core/bi-map.ts';

Deno.test('BiDirectionalMap - basic operations', async (t) => {
  await t.step('should create an empty map', () => {
    const map = new BiDirectionalMap<string, number>();
    assertEquals(map.size, 0);
  });

  await t.step('should set and get values', () => {
    const map = new BiDirectionalMap<string, number>();
    map.set('one', 1);
    assertEquals(map.get('one'), 1);
    assertEquals(map.getKey(1), 'one');
  });

  await t.step('should handle existing key mappings', () => {
    const map = new BiDirectionalMap<string, number>();
    map.set('one', 1);
    map.set('one', 2); // Override existing key
    assertEquals(map.get('one'), 2);
    assertEquals(map.getKey(2), 'one');
    assertEquals(map.getKey(1), undefined);
  });

  await t.step('should handle existing value mappings', () => {
    const map = new BiDirectionalMap<string, number>();
    map.set('one', 1);
    map.set('two', 1); // Override existing value
    assertEquals(map.get('two'), 1);
    assertEquals(map.get('one'), undefined);
    assertEquals(map.getKey(1), 'two');
  });

  await t.step('should check existence of keys and values', () => {
    const map = new BiDirectionalMap<string, number>();
    map.set('one', 1);
    assertEquals(map.hasKey('one'), true);
    assertEquals(map.hasValue(1), true);
    assertEquals(map.hasKey('two'), false);
    assertEquals(map.hasValue(2), false);
  });

  await t.step('should delete by key', () => {
    const map = new BiDirectionalMap<string, number>();
    map.set('one', 1);
    assertEquals(map.deleteKey('one'), true);
    assertEquals(map.size, 0);
    assertEquals(map.deleteKey('one'), false);
  });

  await t.step('should delete by value', () => {
    const map = new BiDirectionalMap<string, number>();
    map.set('one', 1);
    assertEquals(map.deleteValue(1), true);
    assertEquals(map.size, 0);
    assertEquals(map.deleteValue(1), false);
  });

  await t.step('should clear all mappings', () => {
    const map = new BiDirectionalMap<string, number>();
    map.set('one', 1).set('two', 2);
    map.clear();
    assertEquals(map.size, 0);
    assertEquals(map.get('one'), undefined);
    assertEquals(map.getKey(1), undefined);
  });

  await t.step('should support iteration methods', () => {
    const map = new BiDirectionalMap<string, number>();
    map.set('one', 1).set('two', 2);

    // Test keys()
    const keys = [...map.keys()];
    assertEquals(keys, ['one', 'two']);

    // Test values()
    const values = [...map.values()];
    assertEquals(values, [1, 2]);

    // Test entries()
    const entries = [...map.entries()];
    assertEquals(entries, [
      ['one', 1],
      ['two', 2],
    ]);
  });

  await t.step('should support forEach', () => {
    const map = new BiDirectionalMap<string, number>();
    map.set('one', 1).set('two', 2);
    const results: Array<[number, string, BiDirectionalMap<string, number>]> =
      [];

    map.forEach((value, key, mapRef) => {
      results.push([value, key, mapRef]);
    });

    assertEquals(results.length, 2);
    assertEquals(results[0][0], 1);
    assertEquals(results[0][1], 'one');
    assertStrictEquals(results[0][2], map);
  });

  await t.step('should create map from entries', () => {
    const entries = [
      ['one', 1],
      ['two', 2],
    ] as const;
    const map = BiDirectionalMap.fromEntries(entries);
    assertEquals(map.size, 2);
    assertEquals(map.get('one'), 1);
    assertEquals(map.get('two'), 2);
  });

  await t.step('should convert to object', () => {
    const map = new BiDirectionalMap<string, number>();
    map.set('one', 1).set('two', 2);
    const obj = map.toObject();
    assertEquals(obj, { one: 1, two: 2 });
  });

  await t.step('should work with different data types', async (t) => {
    await t.step('should work with objects', () => {
      const map = new BiDirectionalMap<{ id: number }, string>();
      const key = { id: 1 };
      map.set(key, 'one');
      assertEquals(map.get(key), 'one');
      assertEquals(map.getKey('one'), key);
    });

    await t.step('should work with symbols', () => {
      const map = new BiDirectionalMap<symbol, number>();
      const sym = Symbol('test');
      map.set(sym, 1);
      assertEquals(map.get(sym), 1);
      assertEquals(map.getKey(1), sym);
    });
  });

  await t.step('should maintain bidirectional integrity', () => {
    const map = new BiDirectionalMap<string, number>();
    map.set('one', 1).set('two', 2).set('three', 1); // Should remove 'one' -> 1 mapping

    assertFalse(map.hasKey('one'));
    assertEquals(map.getKey(1), 'three');
    assertEquals(map.size, 2);
  });
});
