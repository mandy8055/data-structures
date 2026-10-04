---
id: tree-budget-rollup
title: Budget Rollup
sidebar_label: Budget Rollup
description: 使用 Tree.fold() 在部门层级结构中汇总成本
keywords: [tree, n-ary-tree, fold, rollup, hierarchy, org-chart, example]
---

# 使用 Tree 进行预算汇总

使用 `fold()`（一种自底向上的归约操作），将数值字段从层级结构的叶节点汇总到根节点。

## 实现

```typescript
import { Tree } from '@dstoolkit/data-structures';

interface Unit {
  name: string;
  spend: number; // 该单位的直接支出
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

// 总支出：每个单位自身的支出加上其下所有单位的支出
const total = org.fold<number>(
  (unit, children) => unit.spend + children.reduce((a, b) => a + b, 0),
);
console.log(total); // 97000
```

## 汇总报告

构建一棵新树，其中每个单位都带有其汇总后的总计。

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

## 单个分支的汇总

将节点作为第二个参数传入，以只汇总该子树。

```typescript
const engineering = org.find((u) => u.name === 'Engineering')!;

const engTotal = org.fold<number>(
  (unit, children) => unit.spend + children.reduce((a, b) => a + b, 0),
  engineering,
);
console.log(engTotal); // 70000
```

## 其他汇总方式

```typescript
// 单位数量（节点数量）
const units = org.fold<number>((_u, c) => 1 + c.reduce((a, b) => a + b, 0));
console.log(units); // 6

// 最大的单笔直接支出
const maxSpend = org.fold<number>((u, c) => Math.max(u.spend, ...c));
console.log(maxSpend); // 40000

// 没有下属单位的单位
console.log(org.findAll((_u, node) => node.isLeaf).map((n) => n.value.name));
// ["Platform", "Mobile", "Support"]
```

## 重组

```typescript
const support = org.find((u) => u.name === 'Support')!;

// 将 Support 移动到 Engineering 下，并重新运行汇总
org.move(support, engineering);
console.log(
  org.fold<number>(
    (u, c) => u.spend + c.reduce((a, b) => a + b, 0),
    engineering,
  ),
); // 85000
```

:::info 为什么使用 fold？
`fold` 会在所有子节点都被访问之后，正好访问每个节点一次，因此每个节点都能看到其子节点的结果。它是迭代实现的，因此适用于任意深度的层级结构。
:::

## 另请参阅

- [Tree API 参考](../api/tree.md)
- [文件系统浏览器](./tree-file-system.md)
