import {
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from '@std/assert';
import { Tree, TreeNode } from '../core/tree.ts';
import {
  EmptyStructureError,
  IndexOutOfBoundsError,
  InvalidOperationError,
} from '../errors/index.ts';
import type { NestedNode } from '../types/index.ts';

/**
 * Builds the following tree and returns it with its nodes:
 *
 *            A
 *         /  |  \
 *        B   C   D
 *       / \      |
 *      E   F     G
 */
function buildSample() {
  const tree = new Tree<string>();
  const a = tree.setRoot('A');
  const b = tree.addChild(a, 'B');
  const c = tree.addChild(a, 'C');
  const d = tree.addChild(a, 'D');
  const e = tree.addChild(b, 'E');
  const f = tree.addChild(b, 'F');
  const g = tree.addChild(d, 'G');
  return { tree, a, b, c, d, e, f, g };
}

Deno.test('Tree - empty tree', async (t) => {
  await t.step('should create an empty tree', () => {
    const tree = new Tree<number>();
    assertEquals(tree.size, 0);
    assertEquals(tree.isEmpty(), true);
    assertEquals(tree.root, null);
    assertEquals(tree.height, -1);
    assertEquals(tree.toNested(), null);
    assertEquals(tree.toArray(), []);
    assertEquals([...tree.preOrder()], []);
    assertEquals([...tree.postOrder()], []);
    assertEquals([...tree.levelOrder()], []);
  });

  await t.step('should throw EmptyStructureError on fold', () => {
    const tree = new Tree<number>();
    assertThrows(() => tree.fold(() => 0), EmptyStructureError);
  });

  await t.step('should return null/[] for queries', () => {
    const tree = new Tree<number>();
    assertEquals(tree.find(() => true), null);
    assertEquals(tree.findAll(() => true), []);
  });

  await t.step('should map and filter to empty trees', () => {
    const tree = new Tree<number>();
    assertEquals(tree.map((v) => v * 2).isEmpty(), true);
    assertEquals(tree.filter(() => true).isEmpty(), true);
  });

  await t.step('should allow clear on an empty tree', () => {
    const tree = new Tree<number>();
    tree.clear();
    assertEquals(tree.size, 0);
  });
});

Deno.test('Tree - setRoot', async (t) => {
  await t.step('should set the root once', () => {
    const tree = new Tree<number>();
    const root = tree.setRoot(1);
    assertStrictEquals(tree.root, root);
    assertEquals(root.value, 1);
    assertEquals(root.isRoot, true);
    assertEquals(root.isLeaf, true);
    assertEquals(root.parent, null);
    assertEquals(tree.size, 1);
    assertEquals(tree.height, 0);
  });

  await t.step('should throw on second setRoot', () => {
    const tree = new Tree<number>();
    tree.setRoot(1);
    assertThrows(() => tree.setRoot(2), InvalidOperationError);
  });

  await t.step('should allow setRoot again after clear', () => {
    const tree = new Tree<number>();
    tree.setRoot(1);
    tree.clear();
    const root = tree.setRoot(2);
    assertEquals(root.value, 2);
    assertEquals(tree.size, 1);
  });
});

Deno.test('Tree - TreeNode', async (t) => {
  await t.step('should not be constructible directly', () => {
    const Ctor = TreeNode as unknown as new (...args: unknown[]) => unknown;
    assertThrows(() => new Ctor(Symbol('x'), {}), InvalidOperationError);
  });

  await t.step('should expose a frozen read-only children view', () => {
    const { tree, a, b, c, d } = buildSample();
    const view = a.children;
    assertEquals(view, [b, c, d]);
    assert(Object.isFrozen(view));
    assertThrows(() => {
      (view as TreeNode<string>[]).push(b);
    }, TypeError);
    assertEquals(tree.size, 7);
    assertStrictEquals(a.children, view); // cached until mutation
    const x = tree.addChild(a, 'X');
    assertEquals(view.length, 3); // old snapshot unaffected
    assertEquals(a.children, [b, c, d, x]);
  });

  await t.step('should allow setting values', () => {
    const { tree, b } = buildSample();
    b.value = 'BB';
    assertEquals(tree.toArray(), ['A', 'BB', 'E', 'F', 'C', 'D', 'G']);
  });

  await t.step('should report leaf/root state', () => {
    const { a, b, e } = buildSample();
    assertEquals(a.isRoot, true);
    assertEquals(b.isRoot, false);
    assertEquals(b.isLeaf, false);
    assertEquals(e.isLeaf, true);
    assertStrictEquals(e.parent, b);
  });
});

Deno.test('Tree - addChild / insertChildAt', async (t) => {
  await t.step('should build structure and track size and height', () => {
    const { tree, a, b, c, d, e, f, g } = buildSample();
    assertEquals(tree.size, 7);
    assertEquals(tree.height, 2);
    assertEquals(tree.depth(a), 0);
    assertEquals(tree.depth(b), 1);
    assertEquals(tree.depth(g), 2);
    assertEquals(tree.path(a), ['A']);
    assertEquals(tree.path(c), ['A', 'C']);
    assertEquals(tree.path(f), ['A', 'B', 'F']);
    assertEquals(tree.path(g), ['A', 'D', 'G']);
    tree.addChild(e, 'H');
    assertEquals(tree.height, 3);
    assertEquals(tree.size, 8);
    assertEquals(d.children.length, 1);
  });

  await t.step('should insert children at specific positions', () => {
    const tree = new Tree<number>();
    const root = tree.setRoot(0);
    tree.insertChildAt(root, 0, 2);
    tree.insertChildAt(root, 0, 1);
    tree.insertChildAt(root, 2, 4);
    tree.insertChildAt(root, 2, 3);
    assertEquals(root.children.map((n) => n.value), [1, 2, 3, 4]);
    assertEquals(tree.size, 5);
  });

  await t.step('should throw IndexOutOfBoundsError for bad index', () => {
    const tree = new Tree<number>();
    const root = tree.setRoot(0);
    tree.addChild(root, 1);
    assertThrows(() => tree.insertChildAt(root, -1, 9), IndexOutOfBoundsError);
    assertThrows(() => tree.insertChildAt(root, 2, 9), IndexOutOfBoundsError);
    assertThrows(() => tree.insertChildAt(root, 0.5, 9), IndexOutOfBoundsError);
    assertThrows(
      () => tree.insertChildAt(root, NaN, 9),
      IndexOutOfBoundsError,
    );
    assertEquals(tree.size, 2);
  });
});

Deno.test('Tree - remove', async (t) => {
  await t.step('should remove a leaf', () => {
    const { tree, b, e, f } = buildSample();
    tree.remove(e);
    assertEquals(tree.size, 6);
    assertEquals(b.children, [f]);
    assertEquals(tree.contains(e), false);
    assertEquals(e.parent, null);
    assertEquals(e.isRoot, false);
  });

  await t.step('should remove a middle node with its subtree', () => {
    const { tree, a, b, c, d, e, f } = buildSample();
    tree.remove(b);
    assertEquals(tree.size, 4);
    assertEquals(a.children, [c, d]);
    assertEquals(tree.toArray(), ['A', 'C', 'D', 'G']);
    for (const n of [b, e, f]) assertEquals(tree.contains(n), false);
  });

  await t.step('should empty the tree when removing the root', () => {
    const { tree, a, g } = buildSample();
    tree.remove(a);
    assertEquals(tree.size, 0);
    assertEquals(tree.isEmpty(), true);
    assertEquals(tree.root, null);
    assertEquals(tree.contains(a), false);
    assertEquals(tree.contains(g), false);
  });

  await t.step('should reject removed nodes in every operation', () => {
    const { tree, a, b, e } = buildSample();
    const other = new Tree<string>();
    const otherRoot = other.setRoot('Z');
    tree.remove(b);
    const ops: Array<(n: TreeNode<string>) => unknown> = [
      (n) => tree.addChild(n, 'x'),
      (n) => tree.insertChildAt(n, 0, 'x'),
      (n) => tree.remove(n),
      (n) => tree.move(n, a),
      (n) => tree.move(a, n),
      (n) => tree.depth(n),
      (n) => tree.path(n),
      (n) => tree.preOrder(n),
      (n) => tree.postOrder(n),
      (n) => tree.levelOrder(n),
      (n) => tree.fold(() => 0, n),
      (n) => other.addChild(n, 'x'),
      (n) => other.move(n, otherRoot),
      (n) => other.remove(n),
    ];
    for (const node of [b, e]) {
      for (const op of ops) {
        assertThrows(() => op(node), InvalidOperationError, 'detached');
      }
    }
  });

  await t.step('should detach all nodes on clear', () => {
    const { tree, b } = buildSample();
    tree.clear();
    assertThrows(() => tree.addChild(b, 'x'), InvalidOperationError);
  });
});

Deno.test('Tree - move', async (t) => {
  await t.step('should move a subtree to a new parent', () => {
    const { tree, b, c, d, g } = buildSample();
    tree.move(b, g);
    assertEquals(tree.size, 7);
    assertStrictEquals(b.parent, g);
    assertEquals(tree.path(b), ['A', 'D', 'G', 'B']);
    assertEquals(tree.height, 4);
    assertEquals(tree.toArray(), ['A', 'C', 'D', 'G', 'B', 'E', 'F']);
    assertEquals(tree.root!.children, [c, d]);
  });

  await t.step('should move to a specific index', () => {
    const { tree, a, b, c, d, g } = buildSample();
    tree.move(g, a, 0);
    assertEquals(a.children, [g, b, c, d]);
    assertEquals(d.isLeaf, true);
    // Reorder within the same parent: index is evaluated after removal.
    tree.move(g, a, 3);
    assertEquals(a.children, [b, c, d, g]);
    tree.move(d, a, 0);
    assertEquals(a.children, [d, b, c, g]);
    tree.move(d, a);
    assertEquals(a.children, [b, c, g, d]);
  });

  await t.step('should throw on out-of-range index', () => {
    const { tree, a, g } = buildSample();
    assertThrows(() => tree.move(g, a, 4), IndexOutOfBoundsError);
    assertThrows(() => tree.move(g, a, -1), IndexOutOfBoundsError);
    assertThrows(() => tree.move(g, a, 1.5), IndexOutOfBoundsError);
  });

  await t.step('should prevent cycles', () => {
    const { tree, a, b, e } = buildSample();
    assertThrows(() => tree.move(b, b), InvalidOperationError);
    assertThrows(() => tree.move(b, e), InvalidOperationError);
    assertThrows(() => tree.move(a, e), InvalidOperationError);
    assertThrows(() => tree.move(a, a), InvalidOperationError);
    assertEquals(tree.toArray(), ['A', 'B', 'E', 'F', 'C', 'D', 'G']);
  });

  await t.step('should reject cross-tree moves', () => {
    const { tree, a, b } = buildSample();
    const other = buildSample();
    assertThrows(() => tree.move(other.b, a), InvalidOperationError);
    assertThrows(() => tree.move(b, other.a), InvalidOperationError);
    assertThrows(() => other.tree.move(b, other.a), InvalidOperationError);
  });
});

Deno.test('Tree - ownership checks', async (t) => {
  await t.step('should reject foreign nodes in every method', () => {
    const treeA = buildSample();
    const treeB = buildSample();
    const foreign = treeA.b;
    const own = treeB.c;
    const ops: Array<() => unknown> = [
      () => treeB.tree.addChild(foreign, 'x'),
      () => treeB.tree.insertChildAt(foreign, 0, 'x'),
      () => treeB.tree.remove(foreign),
      () => treeB.tree.move(foreign, own),
      () => treeB.tree.move(own, foreign),
      () => treeB.tree.depth(foreign),
      () => treeB.tree.path(foreign),
      () => treeB.tree.preOrder(foreign),
      () => treeB.tree.postOrder(foreign),
      () => treeB.tree.levelOrder(foreign),
      () => treeB.tree.fold(() => 0, foreign),
    ];
    for (const op of ops) {
      assertThrows(op, InvalidOperationError, 'does not belong');
    }
    assertEquals(treeB.tree.contains(foreign), false);
    assertEquals(treeB.tree.contains(own), true);
  });

  await t.step('should reject non-node values', () => {
    const tree = new Tree<number>();
    tree.setRoot(1);
    const fake = { value: 1 } as unknown as TreeNode<number>;
    assertThrows(() => tree.addChild(fake, 2), InvalidOperationError);
    assertThrows(
      () => tree.depth(null as unknown as TreeNode<number>),
      InvalidOperationError,
    );
    assertEquals(tree.contains(fake), false);
    assertEquals(tree.contains(null as unknown as TreeNode<number>), false);
  });
});

Deno.test('Tree - traversal', async (t) => {
  await t.step('should traverse in pre-order', () => {
    const { tree, b, d } = buildSample();
    assertEquals([...tree.preOrder()], ['A', 'B', 'E', 'F', 'C', 'D', 'G']);
    assertEquals([...tree.preOrder(b)], ['B', 'E', 'F']);
    assertEquals([...tree.preOrder(d)], ['D', 'G']);
  });

  await t.step('should traverse in post-order', () => {
    const { tree, b, d } = buildSample();
    assertEquals([...tree.postOrder()], ['E', 'F', 'B', 'C', 'G', 'D', 'A']);
    assertEquals([...tree.postOrder(b)], ['E', 'F', 'B']);
    assertEquals([...tree.postOrder(d)], ['G', 'D']);
  });

  await t.step('should traverse in level-order', () => {
    const { tree, b, d } = buildSample();
    assertEquals([...tree.levelOrder()], ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    assertEquals([...tree.levelOrder(b)], ['B', 'E', 'F']);
    assertEquals([...tree.levelOrder(d)], ['D', 'G']);
  });

  await t.step('should use pre-order as default iterator', () => {
    const { tree } = buildSample();
    assertEquals([...tree], [...tree.preOrder()]);
    assertEquals(tree.toArray(), [...tree.preOrder()]);
    const seen: string[] = [];
    for (const v of tree) seen.push(v);
    assertEquals(seen, tree.toArray());
  });

  await t.step('should throw when mutated during iteration', () => {
    const makers = ['preOrder', 'postOrder', 'levelOrder'] as const;
    for (const m of makers) {
      const { tree, a, c, g } = buildSample();
      const it = tree[m]();
      it.next();
      tree.addChild(a, 'X');
      assertThrows(() => it.next(), InvalidOperationError, 'modified');

      // Mutation before the first next() also invalidates.
      const it2 = tree[m]();
      tree.remove(c);
      assertThrows(() => it2.next(), InvalidOperationError);

      // Mutation after the last element is yielded.
      const it3 = tree[m]();
      const n = tree.size;
      for (let i = 0; i < n; i++) it3.next();
      tree.move(g, a);
      assertThrows(() => it3.next(), InvalidOperationError);
    }
  });

  await t.step('should not invalidate iterators on value changes', () => {
    const { tree, b } = buildSample();
    const it = tree.preOrder();
    it.next();
    b.value = 'changed';
    assertEquals(it.next().value, 'changed');
  });

  await t.step('should throw when mutated via for...of', () => {
    const { tree, a } = buildSample();
    assertThrows(() => {
      for (const _ of tree) tree.addChild(a, 'loop');
    }, InvalidOperationError);
  });
});

Deno.test('Tree - fold', async (t) => {
  await t.step('should sum numeric values', () => {
    const tree = new Tree<number>();
    const r = tree.setRoot(1);
    const x = tree.addChild(r, 2);
    tree.addChild(r, 3);
    tree.addChild(x, 4);
    tree.addChild(x, 5);
    const sum = tree.fold<number>(
      (v, kids) => v + kids.reduce((a, b) => a + b, 0),
    );
    assertEquals(sum, 15);
  });

  await t.step('should build nested objects', () => {
    const { tree } = buildSample();
    type Out = { name: string; kids: Out[] };
    const out = tree.fold<Out>((v, kids) => ({ name: v, kids }));
    assertEquals(out, {
      name: 'A',
      kids: [
        {
          name: 'B',
          kids: [{ name: 'E', kids: [] }, { name: 'F', kids: [] }],
        },
        { name: 'C', kids: [] },
        { name: 'D', kids: [{ name: 'G', kids: [] }] },
      ],
    });
  });

  await t.step('should handle a single leaf', () => {
    const tree = new Tree<number>();
    const r = tree.setRoot(7);
    assertEquals(tree.fold<number>((v, kids) => v + kids.length), 7);
    assertEquals(tree.fold<number>((v) => v * 2, r), 14);
  });

  await t.step('should fold from a subtree', () => {
    const { tree, b } = buildSample();
    const s = tree.fold<string>((v, kids) => v + kids.join(''), b);
    assertEquals(s, 'BEF');
    let visitedNode: TreeNode<string> | null = null;
    tree.fold<number>((_v, _k, node) => {
      visitedNode = node;
      return 0;
    }, b);
    assertStrictEquals(visitedNode, b);
  });

  await t.step('should throw on empty tree', () => {
    assertThrows(() => new Tree<number>().fold(() => 0), EmptyStructureError);
  });

  await t.step('should throw if the reducer mutates the tree', () => {
    const { tree, a } = buildSample();
    assertThrows(
      () => tree.fold(() => tree.addChild(a, 'x')),
      InvalidOperationError,
    );
  });
});

Deno.test('Tree - find / findAll', async (t) => {
  await t.step('should find the first match in pre-order', () => {
    const { tree, b, e } = buildSample();
    assertStrictEquals(tree.find((v) => v === 'E'), e);
    assertStrictEquals(tree.find((v) => v > 'A'), b);
    assertStrictEquals(tree.find((_v, n) => n === e), e);
  });

  await t.step('should return null on miss', () => {
    const { tree } = buildSample();
    assertEquals(tree.find((v) => v === 'Z'), null);
  });

  await t.step('should find all matches', () => {
    const { tree, b, e, f, g } = buildSample();
    assertEquals(tree.findAll((_v, n) => n.isLeaf).length, 4);
    assertEquals(tree.findAll((v) => 'BEFG'.includes(v)), [b, e, f, g]);
    assertEquals(tree.findAll((v) => v === 'Z'), []);
  });

  await t.step('should throw if the predicate mutates the tree', () => {
    const { tree, a } = buildSample();
    assertThrows(
      () => tree.find(() => (tree.addChild(a, 'x'), false)),
      InvalidOperationError,
    );
    assertThrows(
      () => tree.findAll(() => (tree.addChild(a, 'x'), false)),
      InvalidOperationError,
    );
  });
});

Deno.test('Tree - map / filter', async (t) => {
  await t.step('should map values preserving shape', () => {
    const { tree } = buildSample();
    const mapped = tree.map((v) => v.toLowerCase());
    assertEquals(mapped.toArray(), ['a', 'b', 'e', 'f', 'c', 'd', 'g']);
    assertEquals(mapped.toNested(), {
      value: 'a',
      children: [
        { value: 'b', children: [{ value: 'e' }, { value: 'f' }] },
        { value: 'c' },
        { value: 'd', children: [{ value: 'g' }] },
      ],
    });
    assertEquals(mapped.size, 7);
    assertEquals(tree.toArray()[0], 'A'); // original untouched
    assertEquals(mapped.contains(tree.root!), false);
  });

  await t.step('should pass nodes to map and keep options', () => {
    const tree = new Tree<number>({ maxSize: 3 });
    const r = tree.setRoot(1);
    tree.addChild(r, 2);
    const depths = tree.map((_v, n) => tree.depth(n));
    assertEquals(depths.toArray(), [0, 1]);
    const d = depths.root!;
    depths.addChild(d, 9);
    assertThrows(() => depths.addChild(d, 9), InvalidOperationError);
  });

  await t.step('should filter keeping nodes whose ancestors pass', () => {
    const { tree } = buildSample();
    const tested: string[] = [];
    const filtered = tree.filter((v) => {
      tested.push(v);
      return v !== 'B';
    });
    assertEquals(filtered.toArray(), ['A', 'C', 'D', 'G']);
    // E and F are dropped with B and never tested.
    assertEquals(tested, ['A', 'B', 'C', 'D', 'G']);
  });

  await t.step('should return an empty tree when the root fails', () => {
    const { tree } = buildSample();
    assertEquals(tree.filter((v) => v !== 'A').isEmpty(), true);
  });

  await t.step('should throw if callbacks mutate the tree', () => {
    const { tree, a } = buildSample();
    assertThrows(
      () => tree.map((v) => (tree.addChild(a, 'x'), v)),
      InvalidOperationError,
    );
    assertThrows(
      () => tree.filter(() => (tree.addChild(a, 'x'), true)),
      InvalidOperationError,
    );
  });
});

Deno.test('Tree - limits', async (t) => {
  await t.step('should validate options', () => {
    const bad = [0, -1, 1.5, NaN, Infinity, '3' as unknown as number];
    for (const v of bad) {
      assertThrows(() => new Tree({ maxSize: v }), InvalidOperationError);
      assertThrows(() => new Tree({ maxDepth: v }), InvalidOperationError);
    }
    new Tree({ maxSize: 1, maxDepth: 1 });
    new Tree({});
  });

  await t.step('should enforce maxSize in addChild/insertChildAt', () => {
    const tree = new Tree<number>({ maxSize: 3 });
    const r = tree.setRoot(0);
    tree.addChild(r, 1);
    tree.insertChildAt(r, 0, 2);
    assertThrows(() => tree.addChild(r, 3), InvalidOperationError, 'maxSize');
    assertThrows(
      () => tree.insertChildAt(r, 0, 3),
      InvalidOperationError,
      'maxSize',
    );
    assertEquals(tree.size, 3);
  });

  await t.step('should allow move in a full tree (size unchanged)', () => {
    const tree = new Tree<number>({ maxSize: 3 });
    const r = tree.setRoot(0);
    const x = tree.addChild(r, 1);
    const y = tree.addChild(r, 2);
    tree.move(y, x);
    assertEquals(tree.size, 3);
    assertEquals(tree.height, 2);
  });

  await t.step('should enforce maxDepth in addChild/insertChildAt', () => {
    const tree = new Tree<number>({ maxDepth: 2 });
    const r = tree.setRoot(0);
    const x = tree.addChild(r, 1);
    const y = tree.insertChildAt(x, 0, 2);
    assertThrows(() => tree.addChild(y, 3), InvalidOperationError, 'maxDepth');
    assertThrows(
      () => tree.insertChildAt(y, 0, 3),
      InvalidOperationError,
      'maxDepth',
    );
    assertEquals(tree.height, 2);
  });

  await t.step('should enforce maxDepth in move', () => {
    const tree = new Tree<number>({ maxDepth: 2 });
    const r = tree.setRoot(0);
    const x = tree.addChild(r, 1);
    const y = tree.addChild(r, 2);
    tree.addChild(y, 3);
    assertThrows(() => tree.move(y, x), InvalidOperationError, 'maxDepth');
    const z = tree.addChild(r, 4);
    tree.move(z, x); // depth 2: allowed
    assertEquals(tree.depth(z), 2);
  });

  await t.step('should enforce maxSize/maxDepth in fromNested', () => {
    const input: NestedNode<number> = {
      value: 0,
      children: [{ value: 1, children: [{ value: 2 }] }, { value: 3 }],
    };
    assertEquals(Tree.fromNested(input, { maxSize: 4 }).size, 4);
    assertThrows(
      () => Tree.fromNested(input, { maxSize: 3 }),
      InvalidOperationError,
      'maxSize',
    );
    assertThrows(
      () => Tree.fromNested({ value: 0 }, { maxSize: 0 }),
      InvalidOperationError,
    );
    assertEquals(Tree.fromNested(input, { maxDepth: 2 }).height, 2);
    assertThrows(
      () => Tree.fromNested(input, { maxDepth: 1 }),
      InvalidOperationError,
      'maxDepth',
    );
  });

  await t.step('should fail fast on a huge children array', () => {
    const children: NestedNode<number>[] = [];
    children.length = 1_000_000_000; // sparse, would be huge if walked
    assertThrows(
      () => Tree.fromNested({ value: 0, children }, { maxSize: 10 }),
      InvalidOperationError,
      'maxSize',
    );
    // Without limits, the first hole is rejected immediately.
    assertThrows(
      () => Tree.fromNested({ value: 0, children }),
      InvalidOperationError,
      'non-null object',
    );
  });
});

Deno.test('Tree - fromNested / toNested', async (t) => {
  await t.step('should round-trip', () => {
    const { tree } = buildSample();
    const nested = tree.toNested()!;
    const copy = Tree.fromNested(nested);
    assertEquals(copy.toNested(), nested);
    assertEquals(copy.toArray(), tree.toArray());
    assertEquals([...copy.postOrder()], [...tree.postOrder()]);
    assertEquals(copy.size, tree.size);
    assertEquals(copy.height, tree.height);
  });

  await t.step('should accept explicit undefined/empty children', () => {
    const tree = Tree.fromNested<number>({
      value: 1,
      children: [{ value: 2, children: undefined }, { value: 3, children: [] }],
    });
    assertEquals(tree.toArray(), [1, 2, 3]);
  });

  await t.step('should reject malformed input', () => {
    const bad: unknown[] = [
      null,
      undefined,
      42,
      'str',
      true,
      {},
      { children: [] },
      { value: 1, children: 'nope' },
      { value: 1, children: null },
      { value: 1, children: { 0: { value: 2 }, length: 1 } },
      { value: 1, children: [null] },
      { value: 1, children: [7] },
      { value: 1, children: [{ notValue: 2 }] },
      Object.create({ value: 1 }), // inherited value is not accepted
    ];
    for (const input of bad) {
      assertThrows(
        () => Tree.fromNested(input as NestedNode<number>),
        InvalidOperationError,
      );
    }
  });

  await t.step('should not pollute Object.prototype', () => {
    const malicious = JSON.parse(
      '{"value":1,"__proto__":{"polluted":true},' +
        '"children":[{"value":2,"constructor":{"prototype":{"polluted":true}}}]}',
    );
    const special = { value: 3 };
    Object.defineProperty(special, 'constructor', {
      value: { prototype: { polluted: true } },
      enumerable: true,
    });
    malicious.children.push(special);
    const tree = Tree.fromNested<number>(malicious);
    assertEquals(tree.toArray(), [1, 2, 3]);
    // deno-lint-ignore no-explicit-any
    assertEquals(({} as any).polluted, undefined);
    // deno-lint-ignore no-explicit-any
    assertEquals((Object.prototype as any).polluted, undefined);
    const out = tree.toNested()!;
    assertEquals(Object.keys(out).sort(), ['children', 'value']);
    assertEquals(Object.getPrototypeOf(out), Object.prototype);
  });

  await t.step('should store a __proto__-keyed value safely', () => {
    const value = JSON.parse('{"__proto__":{"polluted":true}}');
    const tree = Tree.fromNested({ value });
    assertStrictEquals(tree.root!.value, value);
    // deno-lint-ignore no-explicit-any
    assertEquals(({} as any).polluted, undefined);
  });

  await t.step('should reject cyclic input', () => {
    const root: NestedNode<number> = { value: 1, children: [] };
    const child: NestedNode<number> = { value: 2, children: [root] };
    root.children!.push(child);
    assertThrows(
      () => Tree.fromNested(root),
      InvalidOperationError,
      'cycle or shared reference',
    );
    const self: NestedNode<number> = { value: 1, children: [] };
    self.children!.push(self);
    assertThrows(() => Tree.fromNested(self), InvalidOperationError);
  });

  await t.step('should reject shared references', () => {
    const shared: NestedNode<number> = { value: 2 };
    assertThrows(
      () => Tree.fromNested({ value: 1, children: [shared, shared] }),
      InvalidOperationError,
      'cycle or shared reference',
    );
  });

  await t.step('should only read value and children', () => {
    let reads = 0;
    const input = {
      get value() {
        reads++;
        return 1;
      },
      extra: 'ignored',
    };
    const tree = Tree.fromNested(input);
    assertEquals(reads, 1);
    assertEquals(tree.toNested(), { value: 1 });
  });
});

Deno.test('Tree - depth safety (deep linear chain)', () => {
  const N = 200_000;
  const start = performance.now();
  const tree = new Tree<number>();
  let leaf = tree.setRoot(0);
  for (let i = 1; i < N; i++) leaf = tree.addChild(leaf, i);

  assertEquals(tree.size, N);
  assertEquals(tree.height, N - 1);
  assertEquals(tree.depth(leaf), N - 1);
  assertEquals(tree.path(leaf).length, N);

  let count = 0;
  for (const _ of tree.preOrder()) count++;
  assertEquals(count, N);
  count = 0;
  for (const _ of tree.postOrder()) count++;
  assertEquals(count, N);
  count = 0;
  for (const _ of tree.levelOrder()) count++;
  assertEquals(count, N);
  assertEquals(tree.toArray().length, N);

  assertEquals(
    tree.fold<number>((_v, kids) => 1 + (kids.length ? kids[0] : 0)),
    N,
  );
  assertStrictEquals(tree.find((v) => v === N - 1), leaf);
  assertEquals(tree.findAll((v) => v % 2 === 0).length, N / 2);

  const nested = tree.toNested()!;
  const copy = Tree.fromNested(nested);
  assertEquals(copy.size, N);
  assertEquals(copy.height, N - 1);

  const mapped = tree.map((v) => v * 2);
  assertEquals(mapped.size, N);
  assertEquals(tree.filter((v) => v < N / 2).size, N / 2);

  // Move the chain's second half under the root (exercises cycle check).
  const mid = tree.find((v) => v === N / 2)!;
  tree.move(mid, tree.root!);
  assertEquals(tree.height, N / 2);

  tree.remove(tree.root!);
  assertEquals(tree.size, 0);
  assertEquals(tree.contains(leaf), false);

  const elapsed = performance.now() - start;
  assert(elapsed < 2000, `deep-chain test took ${elapsed.toFixed(0)}ms`);
});

Deno.test('Tree - width safety (many children)', () => {
  const N = 100_000;
  const tree = new Tree<number>();
  const root = tree.setRoot(-1);
  for (let i = 0; i < N; i++) tree.addChild(root, i);
  assertEquals(tree.size, N + 1);
  assertEquals(tree.height, 1);
  assertEquals([...tree.preOrder()].length, N + 1);
  assertEquals([...tree.postOrder()].length, N + 1);
  assertEquals([...tree.levelOrder()].length, N + 1);
  assertEquals(tree.fold<number>((_v, kids) => kids.length), N);
  assertEquals(root.children.length, N);
  assertEquals(Tree.fromNested(tree.toNested()!).size, N + 1);
});

Deno.test('Tree - generic types', async (t) => {
  await t.step('should store strings', () => {
    const tree = new Tree<string>();
    const r = tree.setRoot('root');
    tree.addChild(r, 'child');
    assertEquals(tree.toArray(), ['root', 'child']);
  });

  await t.step('should store objects by reference', () => {
    const tree = new Tree<{ id: number }>();
    const obj = { id: 1 };
    const r = tree.setRoot(obj);
    tree.addChild(r, { id: 2 });
    assertStrictEquals(tree.root!.value, obj);
    assertEquals(tree.find((v) => v.id === 2)?.value, { id: 2 });
  });

  await t.step('should accept null and undefined as values', () => {
    const tree = new Tree<number | null>();
    const r = tree.setRoot(null);
    const c = tree.addChild(r, null);
    tree.addChild(r, 0);
    assertEquals(tree.size, 3);
    assertEquals(tree.toArray(), [null, null, 0]);
    assertStrictEquals(tree.find((v) => v === null), r);
    assertEquals(tree.findAll((v) => v === null), [r, c]);
    assertEquals(tree.toNested(), {
      value: null,
      children: [{ value: null }, { value: 0 }],
    });
    const fromNull = Tree.fromNested<number | null>({ value: null });
    assertEquals(fromNull.size, 1);
    const fromUndef = Tree.fromNested<undefined>({ value: undefined });
    assertEquals(fromUndef.size, 1);
  });
});
