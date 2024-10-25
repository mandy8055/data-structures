import { assertEquals, assertThrows } from '@std/assert';
import { EmptyStructureError } from '../errors/index.ts';
import { RedBlackTree } from '../core/red-black-tree.ts';

Deno.test('RedBlackTree - Basic Operations', async (t) => {
  await t.step('constructor - creates empty tree', () => {
    const tree = new RedBlackTree<number>();
    assertEquals(tree.size, 0);
    assertEquals(tree.isEmpty(), true);
  });

  await t.step('constructor - initializes with values', () => {
    const tree = new RedBlackTree<number>({ initial: [5, 3, 7] });
    assertEquals(tree.size, 3);
    assertEquals(tree.isEmpty(), false);
    assertEquals(tree.contains(5), true);
    assertEquals(tree.contains(3), true);
    assertEquals(tree.contains(7), true);
  });

  await t.step('constructor - uses custom comparator', () => {
    const tree = new RedBlackTree<number>({
      comparator: (a, b) => b - a, // Reverse order
      initial: [5, 3, 7],
    });
    const array = tree.toArray();
    assertEquals(array, [7, 5, 3]); // Should be in reverse order
  });
});

Deno.test('RedBlackTree - Insertion', async (t) => {
  await t.step('insert - maintains correct size', () => {
    const tree = new RedBlackTree<number>();
    tree.insert(1);
    assertEquals(tree.size, 1);
    tree.insert(2);
    assertEquals(tree.size, 2);
    // Duplicate insertion shouldn't increase size
    tree.insert(2);
    assertEquals(tree.size, 2);
  });

  await t.step('insert - maintains order', () => {
    const tree = new RedBlackTree<number>();
    const values = [5, 3, 7, 1, 9, 6, 4];
    for (const value of values) {
      tree.insert(value);
    }
    assertEquals(tree.toArray(), [1, 3, 4, 5, 6, 7, 9]);
  });

  await t.step('insert - handles duplicates', () => {
    const tree = new RedBlackTree<number>();
    tree.insert(5);
    tree.insert(5);
    assertEquals(tree.size, 1);
    assertEquals(tree.toArray(), [5]);
  });
});

Deno.test('RedBlackTree - Deletion', async (t) => {
  await t.step('remove - returns correct boolean', () => {
    const tree = new RedBlackTree<number>({ initial: [5, 3, 7] });
    assertEquals(tree.remove(3), true);
    assertEquals(tree.remove(3), false); // Already removed
    assertEquals(tree.remove(10), false); // Never existed
  });

  await t.step('remove - maintains correct size', () => {
    const tree = new RedBlackTree<number>({ initial: [5, 3, 7] });
    assertEquals(tree.size, 3);
    tree.remove(3);
    assertEquals(tree.size, 2);
    tree.remove(7);
    assertEquals(tree.size, 1);
    tree.remove(5);
    assertEquals(tree.size, 0);
  });

  await t.step('remove - maintains order', () => {
    const tree = new RedBlackTree<number>({ initial: [5, 3, 7, 1, 9, 6, 4] });
    tree.remove(5);
    tree.remove(3);
    assertEquals(tree.toArray(), [1, 4, 6, 7, 9]);
  });
});

Deno.test('RedBlackTree - Search Operations', async (t) => {
  await t.step('contains - returns correct boolean', () => {
    const tree = new RedBlackTree<number>({ initial: [5, 3, 7] });
    assertEquals(tree.contains(3), true);
    assertEquals(tree.contains(10), false);
  });

  await t.step('min - returns minimum value', () => {
    const tree = new RedBlackTree<number>({ initial: [5, 3, 7, 1, 9] });
    assertEquals(tree.min(), 1);
  });

  await t.step('min - throws on empty tree', () => {
    const tree = new RedBlackTree<number>();
    assertThrows(
      () => tree.min(),
      EmptyStructureError,
      'Cannot get minimum of empty tree',
    );
  });

  await t.step('max - returns maximum value', () => {
    const tree = new RedBlackTree<number>({ initial: [5, 3, 7, 1, 9] });
    assertEquals(tree.max(), 9);
  });

  await t.step('max - throws on empty tree', () => {
    const tree = new RedBlackTree<number>();
    assertThrows(
      () => tree.max(),
      EmptyStructureError,
      'Cannot get maximum of empty tree',
    );
  });
});

Deno.test('RedBlackTree - Utility Operations', async (t) => {
  await t.step('clear - removes all elements', () => {
    const tree = new RedBlackTree<number>({ initial: [5, 3, 7] });
    tree.clear();
    assertEquals(tree.size, 0);
    assertEquals(tree.isEmpty(), true);
    assertEquals(tree.toArray(), []);
  });

  await t.step('toArray - returns sorted array', () => {
    const tree = new RedBlackTree<number>({ initial: [5, 3, 7, 1, 9, 6, 4] });
    assertEquals(tree.toArray(), [1, 3, 4, 5, 6, 7, 9]);
  });

  await t.step('toArray - returns empty array for empty tree', () => {
    const tree = new RedBlackTree<number>();
    assertEquals(tree.toArray(), []);
  });
});

Deno.test('RedBlackTree - Iterator', async (t) => {
  await t.step('iterator - traverses in order', () => {
    const tree = new RedBlackTree<number>({ initial: [5, 3, 7, 1, 9, 6, 4] });
    const values = [];
    for (const value of tree) {
      values.push(value);
    }
    assertEquals(values, [1, 3, 4, 5, 6, 7, 9]);
  });

  await t.step('iterator - works with empty tree', () => {
    const tree = new RedBlackTree<number>();
    const values = [];
    for (const value of tree) {
      values.push(value);
    }
    assertEquals(values, []);
  });
});

Deno.test('RedBlackTree - Complex Objects', async (t) => {
  interface User {
    id: number;
    name: string;
  }

  await t.step('handles complex objects with custom comparator', () => {
    const tree = new RedBlackTree<User>({
      comparator: (a, b) => a.id - b.id,
    });

    const users = [
      { id: 3, name: 'Charlie' },
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    for (const user of users) {
      tree.insert(user);
    }

    const sorted = tree.toArray();
    assertEquals(
      sorted.map((u) => u.id),
      [1, 2, 3],
    );
    assertEquals(
      sorted.map((u) => u.name),
      ['Alice', 'Bob', 'Charlie'],
    );
  });

  await t.step('maintains object references', () => {
    const tree = new RedBlackTree<User>({
      comparator: (a, b) => a.id - b.id,
    });

    const user = { id: 1, name: 'Alice' };
    tree.insert(user);

    // Modify the original object
    user.name = 'Alice Updated';

    // The tree should reflect the change
    const found = tree.toArray()[0];
    assertEquals(found.name, 'Alice Updated');
  });
});

Deno.test('RedBlackTree - Edge Cases', async (t) => {
  await t.step('handles negative numbers', () => {
    const tree = new RedBlackTree<number>();
    tree.insert(-5);
    tree.insert(-3);
    tree.insert(-7);
    assertEquals(tree.toArray(), [-7, -5, -3]);
  });

  await t.step('handles repeated insertions and deletions', () => {
    const tree = new RedBlackTree<number>();
    for (let i = 0; i < 100; i++) {
      tree.insert(i);
    }
    for (let i = 0; i < 50; i++) {
      tree.remove(i);
    }
    assertEquals(tree.size, 50);
    assertEquals(tree.min(), 50);
    assertEquals(tree.max(), 99);
  });

  await t.step('handles string comparisons', () => {
    const tree = new RedBlackTree<string>();
    tree.insert('banana');
    tree.insert('apple');
    tree.insert('cherry');
    assertEquals(tree.toArray(), ['apple', 'banana', 'cherry']);
  });
});

Deno.test('RedBlackTree - Complex Delete Cases', async (t) => {
  await t.step('handles right-side rebalancing during deletion', () => {
    const tree = new RedBlackTree<number>();

    // Create a specific tree structure that will trigger right-side rebalancing
    // Insert values in an order that creates the needed structure
    const values = [50, 25, 75, 10, 30, 60, 80, 5, 15, 27, 35];
    for (const value of values) {
      tree.insert(value);
    }

    // Remove nodes that will trigger the right-side rebalancing cases
    tree.remove(5); // This should trigger the right-side rebalancing
    tree.remove(15); // This will cause additional rebalancing

    // Verify the tree is still valid
    assertEquals(tree.contains(5), false);
    assertEquals(tree.contains(15), false);
    assertEquals(tree.size, values.length - 2);

    // Verify the remaining structure
    const remainingValues = tree.toArray();
    assertEquals(remainingValues, [10, 25, 27, 30, 35, 50, 60, 75, 80]);
  });

  await t.step('handles complex deletion with multiple rotations', () => {
    const tree = new RedBlackTree<number>();

    // Insert values to create a more complex tree structure
    const values = [20, 10, 30, 5, 15, 25, 35, 3, 7, 12, 17, 22, 27, 32, 37];
    for (const value of values) {
      tree.insert(value);
    }

    // Remove nodes in a specific order to trigger multiple rotations
    const removeOrder = [3, 7, 5, 12, 15];
    for (const value of removeOrder) {
      tree.remove(value);
    }

    // Verify the tree state
    assertEquals(tree.size, values.length - removeOrder.length);
    const remainingValues = tree.toArray();
    assertEquals(remainingValues, [10, 17, 20, 22, 25, 27, 30, 32, 35, 37]);
  });

  await t.step('triggers all fixDelete cases with systematic deletions', () => {
    const tree = new RedBlackTree<number>();

    // Create a specific tree structure
    const initialValues = [
      30,
      20,
      40,
      10,
      25,
      35,
      50,
      5,
      15,
      22,
      27,
      32,
      37,
      45,
      55,
    ];
    for (const value of initialValues) {
      tree.insert(value);
    }

    // Perform deletions that will trigger different cases
    const deletions = [
      5, // Triggers simple black node deletion
      15, // Triggers recoloring
      22, // Triggers rotation
      32, // Triggers complex rotation
      37, // Triggers right-side rebalancing
      40, // Triggers multiple rotations
      50, // Triggers final rebalancing
    ];

    for (const value of deletions) {
      tree.remove(value);
      // Verify tree is still valid after each deletion
      assertEquals(tree.contains(value), false);
    }

    // Verify final tree state
    const finalValues = tree.toArray();
    assertEquals(finalValues, [10, 20, 25, 27, 30, 35, 45, 55]);
  });

  await t.step(
    'handles deletion with consecutive recoloring operations',
    () => {
      const tree = new RedBlackTree<number>();

      // Create a structure that will require multiple recoloring operations
      const values = [
        25,
        15,
        35,
        10,
        20,
        30,
        40,
        5,
        12,
        17,
        22,
        27,
        32,
        37,
        45,
      ];
      for (const value of values) {
        tree.insert(value);
      }

      // Remove nodes that will trigger recoloring
      const removeSequence = [5, 12, 17, 27, 32];
      for (const value of removeSequence) {
        tree.remove(value);
      }

      // Verify final state
      assertEquals(tree.size, values.length - removeSequence.length);
      const finalArray = tree.toArray();
      assertEquals(finalArray, [10, 15, 20, 22, 25, 30, 35, 37, 40, 45]);
    },
  );
});
