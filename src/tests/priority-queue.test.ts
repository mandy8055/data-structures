import { assertEquals, assertThrows } from '@std/assert';
import { PriorityQueue } from '../core/priority-queue.ts';
import { EmptyStructureError } from '../mod.ts';

Deno.test('PriorityQueue operations', async (t) => {
  await t.step('should create an empty priority queue', () => {
    const queue = new PriorityQueue<number>();
    assertEquals(queue.size, 0);
    assertEquals(queue.isEmpty(), true);
  });

  await t.step('should handle number priorities correctly', () => {
    const queue = new PriorityQueue<number>();
    queue.enqueue(5);
    queue.enqueue(3);
    queue.enqueue(7);
    queue.enqueue(1);

    assertEquals(queue.peek(), 1); // Smallest number has highest priority by default
    assertEquals(queue.dequeue(), 1);
    assertEquals(queue.peek(), 3);
  });

  await t.step('should support custom comparison for objects', () => {
    interface Task {
      name: string;
      priority: number;
    }

    const queue = new PriorityQueue<Task>({
      comparator: (a, b) => b.priority - a.priority, // Higher number = higher priority
    });

    queue.enqueue({ name: 'Low', priority: 1 });
    queue.enqueue({ name: 'High', priority: 3 });
    queue.enqueue({ name: 'Medium', priority: 2 });

    assertEquals(queue.peek().name, 'High');
    assertEquals(queue.dequeue().priority, 3);
    assertEquals(queue.peek().name, 'Medium');
  });

  await t.step('should initialize with initial values', () => {
    const queue = new PriorityQueue<number>({
      initial: [5, 3, 7, 1],
    });

    assertEquals(queue.size, 4);
    assertEquals(queue.dequeue(), 1);
    assertEquals(queue.dequeue(), 3);
  });

  await t.step(
    'should maintain priority order with string length priority',
    () => {
      const queue = new PriorityQueue<string>({
        comparator: (a, b) => a.length - b.length,
      });

      queue.enqueue('hello');
      queue.enqueue('hi');
      queue.enqueue('greetings');
      queue.enqueue('hey');
      assertEquals(queue.toArray(), ['hi', 'hey', 'greetings', 'hello']);
      const values = [...queue];
      assertEquals(values, ['hi', 'hey', 'greetings', 'hello']);

      assertEquals(queue.dequeue(), 'hi');
      assertEquals(queue.dequeue(), 'hey');
      assertEquals(queue.dequeue(), 'hello');
      assertEquals(queue.dequeue(), 'greetings');
    },
  );

  await t.step('should throw on empty queue operations', () => {
    const queue = new PriorityQueue<number>();
    assertThrows(() => queue.peek(), EmptyStructureError);
    assertThrows(() => queue.dequeue(), EmptyStructureError);
  });

  await t.step('should check for element existence', () => {
    const queue = new PriorityQueue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    assertEquals(queue.contains(2), true);
    assertEquals(queue.contains(4), false);
  });

  await t.step('should clear all elements', () => {
    const queue = new PriorityQueue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    queue.clear();
    assertEquals(queue.size, 0);
    assertEquals(queue.isEmpty(), true);
  });

  await t.step('should convert to sorted array', () => {
    const queue = new PriorityQueue<number>();
    queue.enqueue(5);
    queue.enqueue(3);
    queue.enqueue(7);
    queue.enqueue(1);

    const sorted = queue.toSortedArray();
    assertEquals(sorted, [1, 3, 5, 7]);
    assertEquals(queue.size, 4); // Original queue should remain unchanged
  });
});

// Example with complex objects
Deno.test('PriorityQueue with complex objects', async (t) => {
  interface Patient {
    name: string;
    severity: number;
    arrivalTime: number;
  }

  await t.step('should handle multiple priority criteria', () => {
    const emergencyRoom = new PriorityQueue<Patient>({
      comparator: (a, b) => {
        // First compare by severity (higher severity = higher priority)
        const severityDiff = b.severity - a.severity;
        if (severityDiff !== 0) return severityDiff;

        // If severity is equal, compare by arrival time (earlier = higher priority)
        return a.arrivalTime - b.arrivalTime;
      },
    });

    emergencyRoom.enqueue({ name: 'John', severity: 3, arrivalTime: 2 });
    emergencyRoom.enqueue({ name: 'Jane', severity: 5, arrivalTime: 3 });
    emergencyRoom.enqueue({ name: 'Bob', severity: 3, arrivalTime: 1 });

    // Jane should be first (highest severity)
    assertEquals(emergencyRoom.dequeue().name, 'Jane');
    // Bob should be second (same severity as John, but arrived earlier)
    assertEquals(emergencyRoom.dequeue().name, 'Bob');
    // John should be last
    assertEquals(emergencyRoom.dequeue().name, 'John');
  });
});
