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

Deno.test('Queue - drain operations', async (t) => {
  await t.step('should drain all elements in FIFO order', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    const drained = [...queue.drain()];
    assertEquals(drained, [1, 2, 3]);
    assertEquals(queue.size, 0);
    assertEquals(queue.isEmpty(), true);
  });

  await t.step('should drain empty queue without errors', () => {
    const queue = new Queue<number>();
    const drained = [...queue.drain()];
    assertEquals(drained, []);
    assertEquals(queue.size, 0);
  });

  await t.step('should support early termination with break', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    const drained: number[] = [];
    for (const item of queue.drain()) {
      drained.push(item);
      if (item === 2) break;
    }
    assertEquals(drained, [1, 2]);
    assertEquals(queue.size, 1);
    assertEquals(queue.peek(), 3);
  });

  await t.step('should work with synchronous processing', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    const results: number[] = [];
    for (const item of queue.drain()) {
      results.push(item * 2);
    }
    assertEquals(results, [2, 4, 6]);
    assertEquals(queue.isEmpty(), true);
  });

  await t.step('should work with asynchronous processing', async () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    const results: number[] = [];
    const process = async (item: number) => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      return item * 2;
    };
    for (const item of queue.drain()) {
      results.push(await process(item));
    }
    assertEquals(results, [2, 4, 6]);
    assertEquals(queue.isEmpty(), true);
  });

  await t.step('should work with different data types', async (t) => {
    await t.step('should drain strings', () => {
      const queue = new Queue<string>();
      queue.enqueue('hello');
      queue.enqueue('world');
      const drained = [...queue.drain()];
      assertEquals(drained, ['hello', 'world']);
      assertEquals(queue.isEmpty(), true);
    });

    await t.step('should drain objects', () => {
      const queue = new Queue<{ id: number }>();
      queue.enqueue({ id: 1 });
      queue.enqueue({ id: 2 });
      const drained = [...queue.drain()];
      assertEquals(drained, [{ id: 1 }, { id: 2 }]);
      assertEquals(queue.isEmpty(), true);
    });
  });

  await t.step('should handle multiple drain calls', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    const first = [...queue.drain()];
    assertEquals(first, [1, 2, 3]);
    assertEquals(queue.isEmpty(), true);

    const second = [...queue.drain()];
    assertEquals(second, []);
    assertEquals(queue.isEmpty(), true);
  });

  await t.step('should work correctly after partial drain', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    const drained: number[] = [];
    for (const item of queue.drain()) {
      drained.push(item);
      if (item === 1) break;
    }

    assertEquals(drained, [1]);
    assertEquals(queue.size, 2);

    queue.enqueue(4);
    assertEquals(queue.toArray(), [2, 3, 4]);

    const remaining = [...queue.drain()];
    assertEquals(remaining, [2, 3, 4]);
    assertEquals(queue.isEmpty(), true);
  });
});
