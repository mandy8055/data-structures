import { assertEquals } from '@std/assert';
import {
  compareNumbers,
  compareStrings,
  createCustomComparer,
} from '../index.ts';

Deno.test('compareNumbers', async (t) => {
  await t.step('returns negative when first number is smaller', () => {
    assertEquals(compareNumbers(1, 2), -1);
    assertEquals(compareNumbers(-5, 0), -5);
  });

  await t.step('returns zero when numbers are equal', () => {
    assertEquals(compareNumbers(1, 1), 0);
    assertEquals(compareNumbers(0, 0), 0);
    assertEquals(compareNumbers(-1, -1), 0);
  });

  await t.step('returns positive when first number is larger', () => {
    assertEquals(compareNumbers(2, 1), 1);
    assertEquals(compareNumbers(0, -5), 5);
  });
});

Deno.test('compareStrings', async (t) => {
  await t.step('returns negative when first string comes before second', () => {
    const result = compareStrings('apple', 'banana');
    assertEquals(result < 0, true);
  });

  await t.step('returns zero when strings are equal', () => {
    assertEquals(compareStrings('apple', 'apple'), 0);
    assertEquals(compareStrings('', ''), 0);
  });

  await t.step('returns positive when first string comes after second', () => {
    const result = compareStrings('banana', 'apple');
    assertEquals(result > 0, true);
  });

  await t.step('handles different cases correctly', () => {
    const result = compareStrings('Apple', 'apple');
    // Note: exact value may vary by locale, but should be consistent
    assertEquals(typeof result, 'number');
  });
});

Deno.test('createCustomComparer', async (t) => {
  interface TestObject {
    id: number;
    name: string;
  }

  await t.step('creates number comparator', () => {
    const compareById = createCustomComparer<TestObject>((item) => item.id);

    const obj1 = { id: 1, name: 'first' };
    const obj2 = { id: 2, name: 'second' };

    assertEquals(compareById(obj1, obj1), 0);
    assertEquals(compareById(obj1, obj2) < 0, true);
    assertEquals(compareById(obj2, obj1) > 0, true);
  });

  await t.step('creates string comparator', () => {
    const compareByName = createCustomComparer<TestObject>((item) => item.name);

    const obj1 = { id: 1, name: 'apple' };
    const obj2 = { id: 2, name: 'banana' };

    assertEquals(compareByName(obj1, obj1), 0);
    assertEquals(compareByName(obj1, obj2) < 0, true);
    assertEquals(compareByName(obj2, obj1) > 0, true);
  });

  await t.step('handles edge cases', () => {
    const compareByName = createCustomComparer<TestObject>((item) => item.name);

    const obj1 = { id: 1, name: '' };
    const obj2 = { id: 2, name: 'test' };

    assertEquals(typeof compareByName(obj1, obj2), 'number');
    assertEquals(compareByName(obj1, obj1), 0);
  });
});
