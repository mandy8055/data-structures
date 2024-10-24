import { assertEquals, assertThrows } from '@std/assert';
import { Deque } from '../core/deque.ts';
import { EmptyStructureError } from '../mod.ts';

Deno.test('Deque - basic operations', async (t) => {
  await t.step('should create an empty deque', () => {
    const deque = new Deque<number>();
    assertEquals(deque.size, 0);
    assertEquals(deque.isEmpty(), true);
  });

  await t.step('should add elements to front', () => {
    const deque = new Deque<number>();
    deque.addFirst(1);
    deque.addFirst(2);
    assertEquals(deque.size, 2);
    assertEquals(deque.toArray(), [2, 1]);
  });

  await t.step('should add elements to back', () => {
    const deque = new Deque<number>();
    deque.addLast(1);
    deque.addLast(2);
    assertEquals(deque.size, 2);
    assertEquals(deque.toArray(), [1, 2]);
  });

  await t.step('should remove elements from front', () => {
    const deque = new Deque<number>();
    deque.addLast(1);
    deque.addLast(2);
    assertEquals(deque.removeFirst(), 1);
    assertEquals(deque.size, 1);
    assertEquals(deque.toArray(), [2]);
  });

  await t.step('should remove elements from back', () => {
    const deque = new Deque<number>();
    deque.addLast(1);
    deque.addLast(2);
    assertEquals(deque.removeLast(), 2);
    assertEquals(deque.size, 1);
    assertEquals(deque.toArray(), [1]);
  });

  await t.step('should peek elements from front', () => {
    const deque = new Deque<number>();
    deque.addLast(1);
    deque.addLast(2);
    assertEquals(deque.peekFirst(), 1);
    assertEquals(deque.size, 2); // Size should not change
  });

  await t.step('should peek elements from back', () => {
    const deque = new Deque<number>();
    deque.addLast(1);
    deque.addLast(2);
    assertEquals(deque.peekLast(), 2);
    assertEquals(deque.size, 2); // Size should not change
  });

  await t.step('should clear the deque', () => {
    const deque = new Deque<number>();
    deque.addLast(1);
    deque.addLast(2);
    deque.clear();
    assertEquals(deque.size, 0);
    assertEquals(deque.isEmpty(), true);
  });

  await t.step('should throw on empty deque operations', () => {
    const deque = new Deque<number>();
    assertThrows(() => deque.removeFirst(), EmptyStructureError);
    assertThrows(() => deque.removeLast(), EmptyStructureError);
    assertThrows(() => deque.peekFirst(), EmptyStructureError);
    assertThrows(() => deque.peekLast(), EmptyStructureError);
  });

  await t.step('should check for element existence', () => {
    const deque = new Deque<number>();
    deque.addLast(1);
    deque.addLast(2);
    deque.addLast(3);
    assertEquals(deque.contains(2), true);
    assertEquals(deque.contains(4), false);
  });

  await t.step('should work with different data types', async (t) => {
    await t.step('should work with strings', () => {
      const deque = new Deque<string>();
      deque.addFirst('hello');
      deque.addLast('world');
      assertEquals(deque.peekFirst(), 'hello');
      assertEquals(deque.peekLast(), 'world');
    });

    await t.step('should work with objects', () => {
      const deque = new Deque<{ id: number }>();
      deque.addFirst({ id: 1 });
      deque.addLast({ id: 2 });
      assertEquals(deque.peekFirst(), { id: 1 });
      assertEquals(deque.peekLast(), { id: 2 });
    });
  });

  await t.step('should support forward iteration', () => {
    const deque = new Deque<number>();
    deque.addLast(1);
    deque.addLast(2);
    deque.addLast(3);
    const values = [...deque];
    assertEquals(values, [1, 2, 3]);
  });

  await t.step('should support reverse iteration', () => {
    const deque = new Deque<number>();
    deque.addLast(1);
    deque.addLast(2);
    deque.addLast(3);
    const values = [...deque.reverseIterator()];
    assertEquals(values, [3, 2, 1]);
  });

  await t.step('should maintain order with mixed operations', () => {
    const deque = new Deque<number>();
    deque.addFirst(2); // [2]
    deque.addLast(3); // [2, 3]
    deque.addFirst(1); // [1, 2, 3]
    assertEquals(deque.toArray(), [1, 2, 3]);
    assertEquals(deque.removeFirst(), 1);
    assertEquals(deque.removeLast(), 3);
    assertEquals(deque.toArray(), [2]);
  });
});
