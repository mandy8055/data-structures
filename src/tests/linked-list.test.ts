import { assertEquals, assertThrows } from '@std/assert';
import { LinkedList } from '../core/linked-list.ts';
import { EmptyStructureError, IndexOutOfBoundsError } from '../mod.ts';

Deno.test('LinkedList - basic operations', async (t) => {
  await t.step('should create an empty list', () => {
    const list = new LinkedList<number>();
    assertEquals(list.size, 0);
    assertEquals(list.isEmpty(), true);
  });

  await t.step('should append elements', () => {
    const list = new LinkedList<number>();
    list.append(1);
    list.append(2);
    assertEquals(list.size, 2);
    assertEquals(list.toArray(), [1, 2]);
  });

  await t.step('should prepend elements', () => {
    const list = new LinkedList<number>();
    list.prepend(1);
    list.prepend(2);
    assertEquals(list.toArray(), [2, 1]);
  });

  await t.step('should insert at position', () => {
    const list = new LinkedList<number>();
    list.append(1);
    list.append(3);
    list.insertAt(2, 1);
    assertEquals(list.toArray(), [1, 2, 3]);
  });

  await t.step('should append and prepend using insertAt', () => {
    const list = new LinkedList<number>();
    list.append(2);
    list.append(3);
    list.insertAt(1, 0);
    assertEquals(list.toArray(), [1, 2, 3]);
    list.insertAt(4, list.size);
    assertEquals(list.toArray(), [1, 2, 3, 4]);
  });

  await t.step('should clear the linked list after creation', () => {
    const list = new LinkedList<number>();
    list.append(2);
    list.append(3);
    list.insertAt(1, 0);
    assertEquals(list.toArray(), [1, 2, 3]);
    list.clear();
    assertEquals(list.size, 0);
  });

  await t.step('should throw on invalid insert', () => {
    const list = new LinkedList<number>();
    assertThrows(() => list.insertAt(1, -1), IndexOutOfBoundsError);
    assertThrows(() => list.insertAt(1, 1), IndexOutOfBoundsError);
  });

  await t.step('should remove elements', () => {
    const list = new LinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);
    assertEquals(list.removeFirst(), 1);
    assertEquals(list.removeAt(1), 3);
    assertEquals(list.toArray(), [2]);
    assertEquals(list.remove(2), true);
    assertEquals(list.remove(4), false);
    assertEquals(list.size, 0);
    list.append(1);
    assertEquals(list.remove(1), true);
  });

  await t.step('should throw on invalid removal', () => {
    const list = new LinkedList<number>();
    assertThrows(() => list.removeFirst(), EmptyStructureError);
    assertThrows(() => list.removeAt(0), IndexOutOfBoundsError);
  });

  await t.step('should find elements', () => {
    const list = new LinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);
    assertEquals(list.indexOf(2), 1);
    assertEquals(list.indexOf(4), -1);
    assertEquals(list.contains(2), true);
    assertEquals(list.contains(4), false);
    assertEquals(list.get(2), 3);
    assertThrows(() => list.get(8), IndexOutOfBoundsError);
  });

  await t.step('should iterate elements', () => {
    const list = new LinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);
    const values = [...list];
    assertEquals(values, [1, 2, 3]);
  });
});

Deno.test('LinkedList - complex removal operations', async (t) => {
  await t.step('remove some middle value of the linked list', () => {
    const list = new LinkedList<number>();
    list.append(2);
    list.append(3);
    list.append(56);
    list.append(4);
    assertEquals(list.size, 4);
    list.remove(56);
    assertEquals(list.toArray(), [2, 3, 4]);
    assertEquals(list.size, 3);
  });

  await t.step('remove some non-existent value from the linked list', () => {
    const list = new LinkedList<number>();
    list.append(2);
    list.append(3);
    list.append(56);
    list.append(4);
    assertEquals(list.size, 4);
    const val = list.remove(79);
    assertEquals(list.toArray(), [2, 3, 56, 4]);
    assertEquals(list.size, 4);
    assertEquals(val, false);
  });

  await t.step('remove one value from a 2-sized linked list', () => {
    const list = new LinkedList<number>();
    list.append(3);
    list.append(4);
    assertEquals(list.size, 2);
    const val = list.remove(4);
    assertEquals(list.size, 1);
    assertEquals(val, true);
  });

  await t.step('remove head using removeAt method', () => {
    const list = new LinkedList<number>();
    list.append(3);
    list.append(4);
    list.append(8);
    assertEquals(list.size, 3);
    const val = list.removeAt(0);
    assertEquals(list.size, 2);
    assertEquals(val, 3);
  });

  await t.step('remove middle indexed value using removeAt method', () => {
    const list = new LinkedList<number>();
    list.append(3);
    list.append(4);
    list.append(11);
    list.append(8);
    assertEquals(list.size, 4);
    const val = list.removeAt(2);
    assertEquals(list.size, 3);
    assertEquals(val, 11);
  });
});

Deno.test('LinkedList - edge case for insertAt operation', async (t) => {
  await t.step('remove head using removeAt method', () => {
    const list = new LinkedList<number>();
    list.append(3);
    list.append(4);
    list.append(8);
    assertEquals(list.size, 3);
    list.insertAt(0, 2);
    assertEquals(list.size, 4);
    assertEquals(list.toArray(), [3, 4, 0, 8]);
  });
});
