---
id: tree-budget-rollup
title: Budget Rollup
sidebar_label: Budget Rollup
description: Roll up costs through a hierarchy of departments with Tree.fold()
keywords: [tree, n-ary-tree, fold, rollup, hierarchy, org-chart, example]
---

# Budget Rollup with Tree

Sum a numeric field from the leaves of a hierarchy up to the root using `fold()`, a bottom-up reduction.

## Implementation

```typescript
import { Tree } from '@dstoolkit/data-structures';

interface Unit {
  name: string;
  spend: number; // direct spend of this unit
}

const org = Tree.fromNested<Unit>({
  value: { name: 'Company', spend: 10_000 },
  children: [
    {
      value: { name: 'Engineering', spend: 5_000 },
      children: [
        { value: { name: 'Platform', spend: 40_000 } },
        { value: { name: 'Mobile', spend: 25_000 } },
      ],
    },
    {
      value: { name: 'Operations', spend: 2_000 },
      children: [{ value: { name: 'Support', spend: 15_000 } }],
    },
  ],
});

// Total spend: each unit's own spend plus everything below it
const total = org.fold<number>(
  (unit, children) => unit.spend + children.reduce((a, b) => a + b, 0),
);
console.log(total); // 97000
```

## Rolled-up Report

Build a new tree in which every unit carries its rolled-up total.

```typescript
interface Rollup {
  name: string;
  total: number;
  children: Rollup[];
}

const report = org.fold<Rollup>((unit, children) => ({
  name: unit.name,
  total: unit.spend + children.reduce((sum, c) => sum + c.total, 0),
  children,
}));

console.log(report.children.map((c) => `${c.name}: ${c.total}`));
// ["Engineering: 70000", "Operations: 17000"]
```

## Rollup for One Branch

Pass a node as the second argument to fold only that subtree.

```typescript
const engineering = org.find((u) => u.name === 'Engineering')!;

const engTotal = org.fold<number>(
  (unit, children) => unit.spend + children.reduce((a, b) => a + b, 0),
  engineering,
);
console.log(engTotal); // 70000
```

## Other Aggregates

```typescript
// Headcount of units (number of nodes)
const units = org.fold<number>((_u, c) => 1 + c.reduce((a, b) => a + b, 0));
console.log(units); // 6

// Largest single direct spend
const maxSpend = org.fold<number>((u, c) => Math.max(u.spend, ...c));
console.log(maxSpend); // 40000

// Units with no sub-units
console.log(org.findAll((_u, node) => node.isLeaf).map((n) => n.value.name));
// ["Platform", "Mobile", "Support"]
```

## Reorganizing

```typescript
const support = org.find((u) => u.name === 'Support')!;

// Move Support under Engineering and re-run the rollup
org.move(support, engineering);
console.log(
  org.fold<number>(
    (u, c) => u.spend + c.reduce((a, b) => a + b, 0),
    engineering,
  ),
); // 85000
```

:::info Why fold?
`fold` visits every node exactly once, after all of its children, so each node sees its children's results. It is iterative, so it works on hierarchies of any depth.
:::

## See Also

- [Tree API Reference](../api/tree.md)
- [File System Explorer](./tree-file-system.md)
