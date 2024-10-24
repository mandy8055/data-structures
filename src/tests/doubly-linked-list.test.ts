import { assertEquals, assertThrows } from '@std/assert';
import { DoublyLinkedList } from '../core/doubly-linked-list.ts';
import { EmptyStructureError, IndexOutOfBoundsError } from '../mod.ts';

Deno.test('DoublyLinkedList - basic operations', async (t) => {
  await t.step('should create an empty list', () => {
    const list = new DoublyLinkedList<number>();
    assertEquals(list.size, 0);
    assertEquals(list.isEmpty(), true);
  });

  await t.step('should append elements', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    list.append(2);
    assertEquals(list.size, 2);
    assertEquals(list.toArray(), [1, 2]);
  });

  await t.step('should prepend elements', () => {
    const list = new DoublyLinkedList<number>();
    list.prepend(1);
    list.prepend(2);
    assertEquals(list.toArray(), [2, 1]);
  });

  await t.step('should insert at position', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    list.append(3);
    list.insertAt(2, 1);
    assertEquals(list.toArray(), [1, 2, 3]);
  });

  await t.step('should append and prepend using insertAt', () => {
    const list = new DoublyLinkedList<number>();
    list.append(2);
    list.append(3);
    list.insertAt(1, 0);
    assertEquals(list.toArray(), [1, 2, 3]);
    list.insertAt(4, list.size);
    assertEquals(list.toArray(), [1, 2, 3, 4]);
  });

  await t.step('should clear the list', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.clear();
    assertEquals(list.size, 0);
    assertEquals(list.isEmpty(), true);
  });

  await t.step('should throw on invalid insert', () => {
    const list = new DoublyLinkedList<number>();
    assertThrows(() => list.insertAt(1, -1), IndexOutOfBoundsError);
    assertThrows(() => list.insertAt(1, 1), IndexOutOfBoundsError);
  });

  await t.step('should remove elements from both ends', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);
    assertEquals(list.removeFirst(), 1);
    assertEquals(list.removeLast(), 3);
    assertEquals(list.toArray(), [2]);
  });

  await t.step('should remove elements at position', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);
    assertEquals(list.removeAt(1), 2);
    assertEquals(list.toArray(), [1, 3]);
  });

  await t.step('should remove by value', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);
    assertEquals(list.remove(2), true);
    assertEquals(list.remove(4), false);
    assertEquals(list.toArray(), [1, 3]);
  });

  await t.step('should throw on invalid removal', () => {
    const list = new DoublyLinkedList<number>();
    assertThrows(() => list.removeFirst(), EmptyStructureError);
    assertThrows(() => list.removeLast(), EmptyStructureError);
    assertThrows(() => list.removeAt(0), IndexOutOfBoundsError);
  });

  await t.step('should find elements', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);
    assertEquals(list.indexOf(2), 1);
    assertEquals(list.indexOf(4), -1);
    assertEquals(list.contains(2), true);
    assertEquals(list.contains(4), false);
  });

  await t.step('should throw IndexOutOfBoundsError when list is empty', () => {
    const list = new DoublyLinkedList<number>();
    assertThrows(() => list.get(0), IndexOutOfBoundsError);
  });

  await t.step('should throw IndexOutOfBoundsError for negative index', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    assertThrows(() => list.get(-1), IndexOutOfBoundsError);
  });

  await t.step('should throw IndexOutOfBoundsError for index >= size', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    assertThrows(() => list.get(1), IndexOutOfBoundsError);
    assertThrows(() => list.get(2), IndexOutOfBoundsError);
  });

  await t.step('should return correct element from first half of list', () => {
    const list = new DoublyLinkedList<number>();
    [1, 2, 3, 4, 5].forEach((n) => list.append(n));

    assertEquals(list.get(0), 1, 'First element should be 1');
    assertEquals(list.get(1), 2, 'Second element should be 2');
    assertEquals(list.get(2), 3, 'Middle element should be 3');
  });

  await t.step('should return correct element from second half of list', () => {
    const list = new DoublyLinkedList<number>();
    [1, 2, 3, 4, 5].forEach((n) => list.append(n));

    assertEquals(list.get(3), 4, 'Fourth element should be 4');
    assertEquals(list.get(4), 5, 'Last element should be 5');
  });

  await t.step('should handle single element list', () => {
    const list = new DoublyLinkedList<number>();
    list.append(42);
    assertEquals(list.get(0), 42, 'Single element should be accessible');
  });

  await t.step('should work with different data types', async (t) => {
    await t.step('should work with strings', () => {
      const list = new DoublyLinkedList<string>();
      list.append('hello');
      list.append('world');
      assertEquals(list.get(0), 'hello');
      assertEquals(list.get(1), 'world');
    });

    await t.step('should work with objects', () => {
      const list = new DoublyLinkedList<{ id: number }>();
      list.append({ id: 1 });
      list.append({ id: 2 });
      assertEquals(list.get(0), { id: 1 });
      assertEquals(list.get(1), { id: 2 });
    });
  });

  await t.step('should support forward iteration', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);
    const values = [...list];
    assertEquals(values, [1, 2, 3]);
  });

  await t.step('should support reverse iteration', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);
    const values = [...list.reverseIterator()];
    assertEquals(values, [3, 2, 1]);
  });
});
