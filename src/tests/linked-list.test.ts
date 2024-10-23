import { assertEquals, assertThrows } from '@std/assert';
import { LinkedList } from '../linked-list.ts';
import { EmptyStructureError, IndexOutOfBoundsError } from '../mod.ts';

Deno.test('LinkedList - basic operations', async (t) => {
  await t.step('should create an empty list', () => {
    const list = new LinkedList<number>();
    assertEquals(list.size(), 0);
    assertEquals(list.isEmpty(), true);
  });

  await t.step('should append elements', () => {
    const list = new LinkedList<number>();
    list.append(1);
    list.append(2);
    assertEquals(list.size(), 2);
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
