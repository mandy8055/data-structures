import { assertEquals, assertThrows } from '@std/assert';
import { MaxHeap, MinHeap } from '../core/binary-heap.ts';
import { EmptyStructureError } from '../mod.ts';

// First, let's create a class that implements the Comparable interface
class ComparableItem {
  constructor(private value: number) {}

  compareTo(other: ComparableItem): number {
    return this.value - other.value;
  }

  getValue(): number {
    return this.value;
  }
}

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

Deno.test('BinaryHeap - Additional Coverage Tests', async (t) => {
  await t.step('should convert heap to array correctly', () => {
    const heap = new MinHeap<number>();
    heap.insert(3);
    heap.insert(1);
    heap.insert(4);
    heap.insert(2);

    const array = heap.toArray();
    assertEquals(array.length, 4);
    // Verify the array contains all inserted elements
    assertEquals(new Set(array), new Set([1, 2, 3, 4]));
    // Verify the original heap is unchanged
    assertEquals(heap.size, 4);
    assertEquals(heap.peek(), 1);
  });

  await t.step('should handle string comparison correctly', () => {
    const heap = new MinHeap<string>();
    heap.insert('banana');
    heap.insert('apple');
    heap.insert('cherry');

    assertEquals(heap.peek(), 'apple');
    assertEquals(heap.remove(), 'apple');
    assertEquals(heap.peek(), 'banana');
  });

  await t.step('should handle Comparable interface objects', () => {
    const heap = new MinHeap<ComparableItem>();
    heap.insert(new ComparableItem(5));
    heap.insert(new ComparableItem(3));
    heap.insert(new ComparableItem(7));

    assertEquals(heap.peek().getValue(), 3);
    assertEquals(heap.remove().getValue(), 3);
    assertEquals(heap.peek().getValue(), 5);
  });
});

Deno.test('BinaryHeap - Coverage Enhancement Tests', async (t) => {
  // Test for invalid comparison type
  await t.step('should throw error for unsupported type comparison', () => {
    const heap = new MinHeap<{ x: number }>();

    // First insert will succeed because no comparison is needed yet
    heap.insert({ x: 1 });

    // Second insert will trigger comparison and throw error
    assertThrows(
      () => heap.insert({ x: 2 }),
      Error,
      'No valid comparison method found for type',
    );
  });

  // Test for right child being smallest in MinHeap siftDown
  await t.step(
    'should handle right child being smallest in MinHeap siftDown',
    () => {
      const heap = new MinHeap<number>();

      // Insert elements in a specific order to create the desired heap structure
      heap.insert(5); // root
      heap.insert(4); // left child
      heap.insert(2); // right child

      // At this point, the heap should look like:
      //       2
      //      / \
      //     4   5

      // Verify the structure after sifting
      assertEquals(heap.peek(), 2);

      // Remove the root to trigger siftDown
      assertEquals(heap.remove(), 2);

      // After removal and siftDown, verify the new structure
      assertEquals(heap.peek(), 4);
      assertEquals(heap.remove(), 4);
      assertEquals(heap.peek(), 5);

      // Verify final size
      assertEquals(heap.size, 1);
    },
  );

  // Additional test to ensure complete coverage of right child comparison
  await t.step('should handle complex right child siftDown scenarios', () => {
    const heap = new MinHeap<number>();

    // Create a more complex heap structure
    heap.insert(10); // Will become root
    heap.insert(8); // Will become left child
    heap.insert(3); // Will become right child
    heap.insert(9); // Additional nodes
    heap.insert(7);
    heap.insert(1);

    // The heap will rebalance with 1 at the root
    assertEquals(heap.peek(), 1);

    // Remove root to trigger complex siftDown
    heap.remove();

    // Verify the structure maintains heap property
    assertEquals(heap.peek(), 3);

    // Remove elements to verify complete structure
    const elements = [];
    while (!heap.isEmpty()) {
      elements.push(heap.remove());
    }

    // Verify elements come out in ascending order
    assertEquals(elements, [3, 7, 8, 9, 10]);
  });
});
