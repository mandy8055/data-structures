import { assert, assertEquals, assertThrows } from '@std/assert';
import { EmptyStructureError } from '../errors/index.ts';
import { RedBlackTree } from '../core/red-black-tree.ts';
import { RBColor, type RBNode } from '../types/index.ts';

/**
 * Walks the tree's internal node structure and verifies red-black
 * invariants: the root is black, no red node has a red child, and every
 * root-to-leaf path has the same black-height.
 */
function assertRedBlackInvariants<T>(tree: RedBlackTree<T>): void {
  // deno-lint-ignore no-explicit-any
  const root = (tree as any).root as RBNode<T> | null;

  if (!root) return;
  assertEquals(root.color, RBColor.BLACK, 'root must be black');

  function blackHeight(node: RBNode<T> | null): number {
    if (!node) return 1;

    if (node.color === RBColor.RED) {
      const leftRed = node.left?.color === RBColor.RED;
      const rightRed = node.right?.color === RBColor.RED;
      assert(!leftRed && !rightRed, 'red node must not have a red child');
    }

    const leftHeight = blackHeight(node.left);
    const rightHeight = blackHeight(node.right);
    assertEquals(
      leftHeight,
      rightHeight,
      'left and right subtrees must have equal black-height',
    );

    return leftHeight + (node.color === RBColor.BLACK ? 1 : 0);
  }

  blackHeight(root);
}

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

Deno.test('RedBlackTree - Balance Invariants After Deletion', async (t) => {
  await t.step(
    'maintains black-height when deleting a black node whose replacement is null',
    () => {
      // Regression test: deleting a black leaf (or a black node with a null
      // replacement child) must still trigger rebalancing, otherwise the
      // tree's black-height invariant silently breaks.
      const tree = new RedBlackTree<number>();
      const values = [
        31,
        23,
        22,
        5,
        28,
        44,
        21,
        42,
        13,
        29,
        10,
        25,
        46,
        3,
        8,
        7,
        39,
        24,
        40,
        22,
      ];
      for (const value of values) {
        tree.insert(value);
      }

      tree.remove(3);

      assertRedBlackInvariants(tree);
    },
  );

  await t.step(
    'maintains invariants across randomized insert/delete sequences',
    () => {
      let seed = 42;
      const random = () => {
        // Simple deterministic PRNG (mulberry32) for reproducible test runs.
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };

      for (let trial = 0; trial < 25; trial++) {
        const tree = new RedBlackTree<number>();
        const present = new Set<number>();
        const insertCount = 30 + Math.floor(random() * 50);

        for (let i = 0; i < insertCount; i++) {
          const value = Math.floor(random() * 500);
          tree.insert(value);
          present.add(value);
        }
        assertRedBlackInvariants(tree);

        const deletionOrder = Array.from(present);
        for (let i = deletionOrder.length - 1; i > 0; i--) {
          const j = Math.floor(random() * (i + 1));
          [deletionOrder[i], deletionOrder[j]] = [
            deletionOrder[j],
            deletionOrder[i],
          ];
        }

        for (const value of deletionOrder) {
          tree.remove(value);
          assertRedBlackInvariants(tree);
        }

        assertEquals(tree.size, 0);
      }
    },
  );
});
