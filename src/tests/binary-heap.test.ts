import { assertEquals, assertThrows } from '@std/assert';
import { MaxHeap, MinHeap } from '../core/binary-heap.ts';
import { EmptyStructureError } from '../mod.ts';

Deno.test('BinaryHeap - MinHeap operations', async (t) => {
  await t.step('should create an empty min heap', () => {
    const heap = new MinHeap<number>();
    assertEquals(heap.size, 0);
    assertEquals(heap.isEmpty(), true);
  });

  await t.step('should maintain min heap property', () => {
    const heap = new MinHeap<number>();
    heap.insert(5);
    heap.insert(3);
    heap.insert(7);
    heap.insert(1);
    assertEquals(heap.peek(), 1);
    assertEquals(heap.remove(), 1);
    assertEquals(heap.peek(), 3);
  });

  await t.step('should work with custom comparator', () => {
    const heap = new MinHeap<string>((a, b) => a.length - b.length);
    heap.insert('aaa');
    heap.insert('a');
    heap.insert('aa');
    assertEquals(heap.peek(), 'a');
    assertEquals(heap.remove(), 'a');
    assertEquals(heap.peek(), 'aa');
  });

  await t.step('should throw on empty heap operations', () => {
    const heap = new MinHeap<number>();
    assertThrows(() => heap.peek(), EmptyStructureError);
    assertThrows(() => heap.remove(), EmptyStructureError);
  });

  await t.step('should check for element existence', () => {
    const heap = new MinHeap<number>();
    heap.insert(1);
    heap.insert(2);
    heap.insert(3);
    assertEquals(heap.contains(2), true);
    assertEquals(heap.contains(4), false);
  });

  await t.step('should support iteration', () => {
    const heap = new MinHeap<number>();
    heap.insert(3);
    heap.insert(1);
    heap.insert(2);
    const values = [...heap];
    assertEquals(values.length, 3);
    // Note: Order is level-order, not necessarily sorted
  });
});

Deno.test('BinaryHeap - MaxHeap operations', async (t) => {
  await t.step('should create an empty max heap', () => {
    const heap = new MaxHeap<number>();
    assertEquals(heap.size, 0);
    assertEquals(heap.isEmpty(), true);
  });

  await t.step('should maintain max heap property', () => {
    const heap = new MaxHeap<number>();
    heap.insert(5);
    heap.insert(3);
    heap.insert(7);
    heap.insert(1);
    assertEquals(heap.peek(), 7);
    assertEquals(heap.remove(), 7);
    assertEquals(heap.peek(), 5);
  });

  await t.step('should work with objects using custom comparator', () => {
    interface Person {
      name: string;
      age: number;
    }
    const heap = new MaxHeap<Person>((a, b) => a.age - b.age);
    heap.insert({ name: 'Alice', age: 25 });
    heap.insert({ name: 'Bob', age: 30 });
    heap.insert({ name: 'Charlie', age: 20 });
    assertEquals(heap.peek().name, 'Bob');
    assertEquals(heap.remove().age, 30);
    assertEquals(heap.peek().name, 'Alice');
  });

  await t.step('should clear all elements', () => {
    const heap = new MaxHeap<number>();
    heap.insert(1);
    heap.insert(2);
    heap.insert(3);
    heap.clear();
    assertEquals(heap.size, 0);
    assertEquals(heap.isEmpty(), true);
  });
});
