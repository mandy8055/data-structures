---
id: tree
title: Tree
sidebar_label: Tree
description: 通用 n 叉树，具有安全的迭代遍历和经过验证的构建方式
keywords:
  [tree, n-ary-tree, hierarchy, traversal, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# Tree

一种通用的 n 叉（有根、有序）树，每个节点可以有任意数量的子节点。非常适合文件系统、分类树、组织架构图、菜单和已解析文档等层级结构。所有算法都是迭代实现的，因此即使树非常深或数据不可信，也能安全使用。

## 安装

<InstallTabs packageName='@dstoolkit/data-structures' importName='Tree' />

## 使用方法

```typescript
import { Tree } from '@dstoolkit/data-structures';

const tree = new Tree<string>();
const root = tree.setRoot('root');
```

## API 参考

### 构造

```typescript
// 无限制的树
const tree = new Tree<string>();

// 带可选的限制（正整数）
const bounded = new Tree<string>({ maxSize: 10_000, maxDepth: 64 });
```

- `maxSize` - 树中节点的最大数量
- `maxDepth` - 任意节点的最大深度（根节点的深度为 `0`）

### 属性

- `root: TreeNode<T> | null` - 根节点，如果为空则为 `null`
- `size: number` - 树中的节点数量
- `height: number` - 从根到叶的最长路径上的边数（为空时为 `-1`，单个节点时为 `0`）
- `isEmpty(): boolean` - 树是否为空

### TreeNode

节点只能由树创建，从外部来看是只读的，除了它的值。

- `value: T` - 存储的值（可以重新赋值）
- `parent: TreeNode<T> | null` - 父节点（根节点为 `null`）
- `children: ReadonlyArray<TreeNode<T>>` - 子节点的冻结快照
- `isLeaf: boolean` - 该节点是否没有子节点
- `isRoot: boolean` - 该节点是否是其树的根节点

### 方法

#### 构建与修改

```typescript
// 创建根节点（如果已存在根节点则抛出错误） - O(1)
const root = tree.setRoot('root');

// 追加一个子节点 - O(1)
const child = tree.addChild(root, 'child');

// 在指定位置插入一个子节点 - O(k)
tree.insertChildAt(root, 0, 'first');

// 将一个节点（及其子树）移动到新的父节点下 - O(depth + k)
tree.move(child, otherNode); // 追加
tree.move(child, otherNode, 0); // 指定索引

// 移除一个节点及其整个子树 - O(s + k)
tree.remove(child);

// 移除所有内容 - O(n)
tree.clear();
```

其中 `k` 是兄弟节点的数量，`s` 是被移除子树的大小

#### 查询

```typescript
// 所有权检查 - O(1)
tree.contains(node); // true / false

// 前序遍历中的第一个匹配项 - O(n)
const node = tree.find((value) => value === 'docs');

// 前序遍历中的所有匹配项 - O(n)
const leaves = tree.findAll((_value, node) => node.isLeaf);

// 节点的深度（根节点为 0） - O(depth)
tree.depth(node);

// 从根节点到该节点的值 - O(depth)
tree.path(node); // ['root', 'docs', 'api']
```

#### 遍历

所有遍历都是生成器，并接受一个可选的 `from` 节点，以仅遍历该子树。

```typescript
// 前序遍历：节点，然后从左到右遍历子节点 - O(n)
[...tree.preOrder()];

// 后序遍历：从左到右遍历子节点，然后是节点 - O(n)
[...tree.postOrder()];

// 层序遍历（广度优先） - O(n)
[...tree.levelOrder()];

// 子树遍历
[...tree.preOrder(someNode)];

// 默认迭代为前序遍历
for (const value of tree) {
  console.log(value);
}
const values = tree.toArray();
```

#### 转换

```typescript
// 自底向上的归约（从叶节点到根节点） - O(n)
const total = tree.fold<number>(
  (value, childResults) => value + childResults.reduce((a, b) => a + b, 0),
);

// 具有相同结构和映射值的新树 - O(n)
const upper = tree.map((value) => value.toUpperCase());

// 保留其值及所有祖先都通过检验的节点的新树 - O(n)
const visible = tree.filter((value) => !value.startsWith('.'));
```

`filter` 会连同其整个子树一起丢弃未通过检验的节点（未通过检验节点的后代不会被测试）。如果根节点未通过检验，结果将为空。

#### 嵌套对象

```typescript
// 从一个简单的 { value, children? } 对象构建 - O(n)
const fromData = Tree.fromNested({
  value: 'root',
  children: [{ value: 'a', children: [{ value: 'a1' }] }, { value: 'b' }],
});

// 转换回去（叶节点没有 `children` 键） - O(n)
const nested = fromData.toNested();
```

## 示例

### 文件系统路径

```typescript
const fs = new Tree<string>();
const root = fs.setRoot('/');
const home = fs.addChild(root, 'home');
const user = fs.addChild(home, 'alice');
const docs = fs.addChild(user, 'docs');
fs.addChild(root, 'etc');

console.log(fs.path(docs).join('/').replace('//', '/')); // "/home/alice/docs"
console.log(fs.depth(docs)); // 3
console.log([...fs.levelOrder()]); // ['/', 'home', 'etc', 'alice', 'docs']
```

### 在层级结构中汇总数值

```typescript
interface Item {
  name: string;
  cost: number;
}

const budget = new Tree<Item>();
const total = budget.setRoot({ name: 'Total', cost: 0 });
const travel = budget.addChild(total, { name: 'Travel', cost: 0 });
budget.addChild(travel, { name: 'Flights', cost: 1200 });
budget.addChild(travel, { name: 'Hotels', cost: 800 });
budget.addChild(total, { name: 'Equipment', cost: 500 });

const sum = budget.fold<number>(
  (item, children) => item.cost + children.reduce((a, b) => a + b, 0),
);
console.log(sum); // 2500

const travelOnly = budget.fold<number>(
  (item, children) => item.cost + children.reduce((a, b) => a + b, 0),
  travel,
);
console.log(travelOnly); // 2000
```

### 渲染带缩进的大纲

```typescript
const outline = Tree.fromNested({
  value: 'Guide',
  children: [
    { value: 'Install', children: [{ value: 'npm' }, { value: 'Deno' }] },
    { value: 'Usage' },
  ],
});

for (const node of outline.findAll(() => true)) {
  console.log('  '.repeat(outline.depth(node)) + node.value);
}
// Guide
//   Install
//     npm
//     Deno
//   Usage
```

## 错误处理

```typescript
import {
  EmptyStructureError,
  IndexOutOfBoundsError,
  InvalidOperationError,
  Tree,
} from '@dstoolkit/data-structures';

const tree = new Tree<number>();

try {
  tree.fold(() => 0); // 空树
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('树为空');
  }
}

const root = tree.setRoot(1);
try {
  tree.insertChildAt(root, 5, 2); // 只有索引 0 是有效的
} catch (error) {
  if (error instanceof IndexOutOfBoundsError) {
    console.log('无效的索引');
  }
}

const other = new Tree<number>();
other.setRoot(0);
try {
  other.addChild(root, 2); // root 属于 `tree`，不属于 `other`
} catch (error) {
  if (error instanceof InvalidOperationError) {
    console.log('节点不属于该树');
  }
}

// 可能找不到结果的查询永远不会抛出错误
console.log(tree.find((v) => v === 42)); // null
console.log(tree.findAll((v) => v === 42)); // []
```

| 错误                    | 抛出时机                                                                    |
| ----------------------- | ---------------------------------------------------------------------------- |
| `EmptyStructureError`   | 在没有 `from` 节点的空树上调用 `fold()`                                      |
| `IndexOutOfBoundsError` | `insertChildAt()` 或 `move()` 收到超出有效范围的索引                         |
| `InvalidOperationError` | 所有者错误、节点已分离、根节点已存在、`move` 中存在循环、输入/选项无效、超出限制 |
| `InvalidOperationError` | 树结构发生变化后遍历仍在继续（参见下方的安全保证）                           |

## 安全保证

`Tree` 旨在安全地存储任意和不可信的数据。

- **无递归。** 每个遍历、`fold`、`height`、`map`、`filter`、`find`、`fromNested` 和 `toNested` 都使用显式的栈或队列。即使树有数十万层深，也不会导致调用栈溢出。
- **所有权验证。** 每个节点都记住拥有它的树。传入另一棵树的节点会抛出 `InvalidOperationError`。被移除的节点（及其后代）会变为**已分离**状态，并被所有树拒绝。`contains(node)` 是常数时间的所有权检查。
- **只读结构。** `node.children` 返回一个冻结快照，而不是内部数组本身。结构只能通过 `Tree` 的方法进行更改。
- **循环预防。** 如果 `newParent` 是节点 `node` 本身或其后代之一，`move(node, newParent)` 会抛出错误。
- **`fromNested` 中的不可信输入。** 每个输入节点必须是具有自己的 `value` 属性的非 null 对象，并且 `children`（如果存在）必须是数组。只会读取 `value` 和 `children`，因此像 `__proto__` 或 `constructor` 这样的键不会污染原型。会检测并拒绝循环和共享引用（同一对象出现两次），而不是陷入无限循环。
- **可选的限制。** `maxSize` 和 `maxDepth` 会由 `addChild`、`insertChildAt`、`move` 和 `fromNested` 强制执行。`fromNested` 在构建过程中进行检查，因此超大输入会快速失败。
- **快速失败的迭代器。** 结构性更改（`setRoot`、`addChild`、`insertChildAt`、`remove`、`move`、`clear`）会使正在进行的遍历失效；下一步会抛出 `InvalidOperationError`。传递给 `find`、`findAll`、`fold`、`map` 和 `filter` 且修改了树的回调函数也会以同样的方式抛出错误。赋值 `node.value` 不算结构性更改。

:::tip
每当从用户提供的数据构建树时，请使用 `maxSize` 和 `maxDepth`，以对内存使用设置硬性上限。
:::

## 性能特征

| 操作                                        | 时间复杂度       | 额外空间       | 说明                               |
| -------------------------------------------- | ---------------- | -------------- | ---------------------------------- |
| `setRoot()`                                  | O(1)             | O(1)           | 创建根节点                         |
| `addChild()`                                 | O(1)\*           | O(1)           | 追加一个子节点                     |
| `insertChildAt()`                            | O(k)             | O(1)           | 在指定索引处插入子节点             |
| `remove()`                                   | O(s + k)         | O(s)           | 移除节点及其子树                   |
| `move()`                                     | O(depth + k)\*   | O(1)           | 移动子树（带循环检查）             |
| `contains()`                                 | O(1)             | O(1)           | 所有权检查                         |
| `depth()` / `path()`                         | O(depth)         | O(1) / O(d)    | 深度 / 从根节点开始的值            |
| `find()` / `findAll()`                       | O(n)             | O(n)           | 前序搜索                           |
| `preOrder()`                                 | O(n)             | O(n)           | 显式栈（窄树为 O(h)）              |
| `postOrder()`                                | O(n)             | O(h)           | 显式栈                             |
| `levelOrder()`                               | O(n)             | O(w)           | 队列                                |
| `fold()`                                     | O(n)             | O(h + k)       | 自底向上归约                       |
| `height`                                     | O(n)             | O(n)           | 从根到叶的最长路径                 |
| `map()` / `filter()`                         | O(n)             | O(n)           | 构建一棵新树                       |
| `fromNested()` / `toNested()`                | O(n)             | O(n)           | 与嵌套对象之间的转换               |
| `clear()`                                    | O(n)             | O(n)           | 分离所有节点                       |

其中：

- `n` = 节点数量
- `h` = 树的高度
- `w` = 最大宽度（某一层上的节点数）
- `k` = 兄弟节点数量
- `s` = 被移除子树的大小

\* 设置 `maxDepth` 时，`addChild`/`insertChildAt` 还会额外花费 O(depth)，`move` 还会额外花费 O(被移动子树的大小) 来检查限制。

:::info 何时使用 Tree
非常适合：

- **文件系统和文件夹** - 使用 `path()` 生成路径和面包屑导航
- **分类和菜单层级结构** - 有序的子节点和子树移动
- **组织架构图和预算** - 使用 `fold()` 汇总数值
- **已解析的文档** - 大纲、AST 和嵌套 JSON 结构
:::

:::warning 何时避免使用
在以下情况下请考虑其他方案：

- **需要排序的值** → 使用 [RedBlackTree](./red-black-tree)
- **需要对字符串进行前缀查找** → 使用 [Trie](./trie)
- **需要键值查找** → 使用 [SortedMap](./sorted-map) 或 `Map`
:::

## 另请参阅

### 相关示例

- [文件系统浏览器](../examples/tree-file-system.md)
- [预算汇总](../examples/tree-budget-rollup.md)

### 其他数据结构

- [Trie](./trie.md) - 用于字符串键的前缀树
- [RedBlackTree](./red-black-tree.md) - 排序的唯一值
- [Queue](./queue.md) - 内部用于层序遍历
