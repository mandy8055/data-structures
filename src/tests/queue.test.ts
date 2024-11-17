import { assertEquals, assertThrows } from '@std/assert';
import { Queue } from '../core/queue.ts';
import { EmptyStructureError } from '../mod.ts';

Deno.test('Queue - basic operations', async (t) => {
  await t.step('should create an empty queue', () => {
    const queue = new Queue<number>();
    assertEquals(queue.size, 0);
    assertEquals(queue.isEmpty(), true);
  });

  await t.step('should enqueue elements', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    assertEquals(queue.size, 2);
    assertEquals(queue.toArray(), [1, 2]);
  });

  await t.step('should dequeue elements', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    assertEquals(queue.dequeue(), 1);
    assertEquals(queue.size, 1);
    assertEquals(queue.toArray(), [2]);
  });

  await t.step('should peek at front element', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    assertEquals(queue.peek(), 1);
    assertEquals(queue.size, 2); // Size should not change
  });

  await t.step('should clear the queue', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.clear();
    assertEquals(queue.size, 0);
    assertEquals(queue.isEmpty(), true);
  });

  await t.step('should throw on empty queue operations', () => {
    const queue = new Queue<number>();
    assertThrows(() => queue.dequeue(), EmptyStructureError);
    assertThrows(() => queue.peek(), EmptyStructureError);
  });

  await t.step('should check for element existence', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    assertEquals(queue.contains(2), true);
    assertEquals(queue.contains(4), false);
  });

  await t.step('should work with different data types', async (t) => {
    await t.step('should work with strings', () => {
      const queue = new Queue<string>();
      queue.enqueue('hello');
      queue.enqueue('world');
      assertEquals(queue.peek(), 'hello');
      assertEquals(queue.toArray(), ['hello', 'world']);
    });

    await t.step('should work with objects', () => {
      const queue = new Queue<{ id: number }>();
      queue.enqueue({ id: 1 });
      queue.enqueue({ id: 2 });
      assertEquals(queue.peek(), { id: 1 });
      assertEquals(queue.toArray(), [{ id: 1 }, { id: 2 }]);
    });
  });

  await t.step('should support iteration', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    const values = [...queue];
    assertEquals(values, [1, 2, 3]);
  });

  await t.step('should maintain FIFO order with multiple operations', () => {
    const queue = new Queue<number>();
    queue.enqueue(1); // [1]
    queue.enqueue(2); // [1, 2]
    queue.enqueue(3); // [1, 2, 3]
    assertEquals(queue.toArray(), [1, 2, 3]);
    assertEquals(queue.dequeue(), 1); // [2, 3]
    assertEquals(queue.dequeue(), 2); // [3]
    assertEquals(queue.toArray(), [3]);
    queue.enqueue(4); // [3, 4]
    assertEquals(queue.peek(), 3);
    assertEquals(queue.toArray(), [3, 4]);
  });

  await t.step('should handle consecutive enqueue/dequeue operations', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    assertEquals(queue.dequeue(), 1);
    queue.enqueue(2);
    assertEquals(queue.dequeue(), 2);
    assertEquals(queue.isEmpty(), true);
  });

  await t.step('should preserve order after clear and new operations', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.clear();
    queue.enqueue(3);
    queue.enqueue(4);
    assertEquals(queue.toArray(), [3, 4]);
  });
});
