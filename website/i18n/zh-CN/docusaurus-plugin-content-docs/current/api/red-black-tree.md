---
id: red-black-tree
title: RedBlackTree
sidebar_label: RedBlackTree
description: 自平衡二叉搜索树，保证 O(log n) 操作
keywords:
  [
    red-black-tree,
    self-balancing-tree,
    bst,
    data-structure,
    typescript,
    javascript,
  ]
---

import InstallTabs from '@site/src/components/InstallTabs';

# RedBlackTree

自平衡二叉搜索树实现，使用红黑着色规则维护平衡，确保插入、删除和搜索操作的 O(log n) 性能。

## 安装

<InstallTabs packageName='@msnkr/data-structures' importName='RedBlackTree' />

## 使用方法

```typescript
import { RedBlackTree } from '@msnkr/data-structures';

const tree = new RedBlackTree<number>();
```

## API 参考

### 属性

- `size: number` - 树中元素的数量
- `isEmpty(): boolean` - 树是否为空

### 方法

#### 树操作

```typescript
// 插入元素 - O(log n)
tree.insert(value);

// 删除元素 - O(log n)
const removed = tree.remove(value);

// 检查元素是否存在 - O(log n)
const exists = tree.contains(value);
```

:::tip 自平衡
红黑树在插入和删除后自动重新平衡，即使在最坏情况下也保证 O(log n) 性能。
:::

#### 最小/最大操作

```typescript
// 获取最小元素 - O(log n)
const min = tree.min();

// 获取最大元素 - O(log n)
const max = tree.max();
```

#### 实用操作

```typescript
// 删除所有元素 - O(1)
tree.clear();

// 转换为排序数组 - O(n)
const array = tree.toArray();
```

#### 迭代

```typescript
// 按排序顺序迭代（中序遍历）
for (const value of tree) {
  console.log(value);
}
```

:::info 排序迭代
迭代始终通过中序遍历按排序顺序返回元素。
:::

## 示例

### 基本数字树

```typescript
const tree = new RedBlackTree<number>();

tree.insert(5);
tree.insert(3);
tree.insert(7);
tree.insert(1);
tree.insert(9);

console.log(tree.contains(3)); // true
console.log(tree.contains(4)); // false

console.log(tree.min()); // 1
console.log(tree.max()); // 9
console.log(tree.size); // 5

// 按排序顺序迭代
for (const value of tree) {
  console.log(value); // 1, 3, 5, 7, 9
}
```

### 唯一值的排序集合

```typescript
const uniqueNumbers = new RedBlackTree<number>();

// 插入重复值无效
uniqueNumbers.insert(5);
uniqueNumbers.insert(3);
uniqueNumbers.insert(5); // 重复，被忽略

console.log(uniqueNumbers.size); // 2（不是 3）
console.log(uniqueNumbers.toArray()); // [3, 5]
```

### 对象的自定义比较

```typescript
interface User {
  id: number;
  name: string;
}

const userTree = new RedBlackTree<User>({
  comparator: (a, b) => a.id - b.id,
});

userTree.insert({ id: 3, name: 'Charlie' });
userTree.insert({ id: 1, name: 'Alice' });
userTree.insert({ id: 2, name: 'Bob' });

// 检查用户是否存在
console.log(userTree.contains({ id: 2, name: 'Bob' })); // true

// 按 ID 顺序迭代
for (const user of userTree) {
  console.log(user.name); // Alice, Bob, Charlie
}
```

### 使用值初始化

```typescript
const tree = new RedBlackTree<number>({
  initial: [5, 3, 7, 1, 9, 4, 6],
});

console.log(tree.min()); // 1
console.log(tree.max()); // 9
console.log(tree.size); // 7
console.log(tree.toArray()); // [1, 3, 4, 5, 6, 7, 9]
```

### 不区分大小写的字符串排序

```typescript
const names = new RedBlackTree<string>({
  comparator: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
});

names.insert('Charlie');
names.insert('alice');
names.insert('BOB');

// 将按不区分大小写的字母顺序迭代
for (const name of names) {
  console.log(name); // alice, BOB, Charlie
}
```

### 任务优先级系统

```typescript
interface Task {
  id: number;
  priority: number;
  name: string;
}

// 更高的优先级数字 = 更高的优先级
const tasks = new RedBlackTree<Task>({
  comparator: (a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // 降序
    }
    return a.id - b.id; // 按 ID 决胜
  },
});

tasks.insert({ id: 1, priority: 2, name: '中等任务' });
tasks.insert({ id: 2, priority: 3, name: '高优先级任务' });
tasks.insert({ id: 3, priority: 1, name: '低优先级任务' });

// 按优先级顺序迭代
for (const task of tasks) {
  console.log(`${task.name}（优先级：${task.priority}）`);
}
// 输出：
// 高优先级任务（优先级：3）
// 中等任务（优先级：2）
// 低优先级任务（优先级：1）
```

### 排行榜系统

```typescript
interface Player {
  username: string;
  score: number;
}

const leaderboard = new RedBlackTree<Player>({
  comparator: (a, b) => {
    // 按分数降序排序
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    // 分数相同时按用户名字母顺序
    return a.username.localeCompare(b.username);
  },
});

leaderboard.insert({ username: 'alice', score: 100 });
leaderboard.insert({ username: 'bob', score: 250 });
leaderboard.insert({ username: 'charlie', score: 180 });

console.log('排行榜：');
for (const player of leaderboard) {
  console.log(`${player.username}: ${player.score}`);
}
// 输出：
// bob: 250
// charlie: 180
// alice: 100
```

### 时间间隔调度

```typescript
interface TimeSlot {
  start: Date;
  end: Date;
  event: string;
}

const schedule = new RedBlackTree<TimeSlot>({
  comparator: (a, b) => a.start.getTime() - b.start.getTime(),
});

schedule.insert({
  start: new Date('2025-12-17T10:00'),
  end: new Date('2025-12-17T11:00'),
  event: '团队会议',
});

schedule.insert({
  start: new Date('2025-12-17T09:00'),
  end: new Date('2025-12-17T09:30'),
  event: '晨会',
});

schedule.insert({
  start: new Date('2025-12-17T14:00'),
  end: new Date('2025-12-17T15:00'),
  event: '客户演示',
});

// 按时间顺序显示日程
console.log('今日日程：');
for (const slot of schedule) {
  console.log(`${slot.start.toLocaleTimeString()}: ${slot.event}`);
}
```

### 去重并排序

```typescript
function uniqueSorted<T>(items: T[], comparator?: (a: T, b: T) => number): T[] {
  const tree = new RedBlackTree<T>({ comparator });

  for (const item of items) {
    tree.insert(item);
  }

  return tree.toArray();
}

const numbers = [5, 2, 8, 2, 1, 9, 5, 3];
console.log(uniqueSorted(numbers)); // [1, 2, 3, 5, 8, 9]

const words = ['apple', 'banana', 'apple', 'cherry', 'banana'];
console.log(uniqueSorted(words)); // ['apple', 'banana', 'cherry']
```

### 范围查询（查找范围内的值）

```typescript
function findInRange(
  tree: RedBlackTree<number>,
  min: number,
  max: number,
): number[] {
  const result: number[] = [];

  for (const value of tree) {
    if (value >= min && value <= max) {
      result.push(value);
    } else if (value > max) {
      break; // 已排序，可以提前停止
    }
  }

  return result;
}

const tree = new RedBlackTree<number>();
[5, 3, 8, 1, 9, 4, 7].forEach((n) => tree.insert(n));

console.log(findInRange(tree, 3, 7)); // [3, 4, 5, 7]
```

## 时间复杂度

| 操作     | 平均     | 最坏     |
| -------- | -------- | -------- |
| insert   | O(log n) | O(log n) |
| remove   | O(log n) | O(log n) |
| contains | O(log n) | O(log n) |
| min      | O(log n) | O(log n) |
| max      | O(log n) | O(log n) |
| clear    | O(1)     | O(1)     |
| toArray  | O(n)     | O(n)     |

## 与其他数据结构的比较

| 特性      | RedBlackTree | Set       | Array（已排序） |
| --------- | ------------ | --------- | --------------- |
| 插入      | O(log n)     | O(1) 平均 | O(n)            |
| 删除      | O(log n)     | O(1) 平均 | O(n)            |
| 搜索      | O(log n)     | O(1) 平均 | O(log n)        |
| 排序迭代  | ✅ 总是      | ❌ 无序   | ✅ 是           |
| 最小/最大 | O(log n)     | O(n)      | O(1)            |
| 保证平衡  | ✅ 是        | N/A       | N/A             |

## 红黑树属性

红黑树维护以下属性以确保平衡：

1. 每个节点要么是红色要么是黑色
2. 根节点是黑色
3. 所有叶节点（NIL）是黑色
4. 红色节点不能有红色子节点
5. 从任何节点到其叶节点的所有路径包含相同数量的黑色节点

这些属性确保树保持大致平衡，保证 O(log n) 操作。

## 最佳实践

### 何时使用 RedBlackTree

- ✅ 需要维护唯一值的排序集合
- ✅ 频繁的插入和删除以及排序访问
- ✅ 需要最小/最大操作
- ✅ 需要保证 O(log n) 性能
- ✅ 需要范围查询

### 何时不使用 RedBlackTree

- ❌ 只需要插入和查找（使用 Set）
- ❌ 不需要排序（使用 Set 或 Array）
- ❌ 频繁的随机访问（使用 Array）
- ❌ 允许重复值（使用 Array 或自定义结构）

## 相关数据结构

- **SortedMap** - 基于红黑树的键值映射
- **Set** - 无序唯一值集合
- **BinaryHeap** - 更快的最小/最大操作，但无排序迭代
- **Trie** - 专门用于字符串的前缀树
