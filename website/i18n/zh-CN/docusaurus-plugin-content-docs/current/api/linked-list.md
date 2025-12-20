---
id: linked-list
title: LinkedList
sidebar_label: LinkedList
description: 单向链表，两端插入操作时间复杂度为 O(1)
keywords:
  [linked-list, singly-linked-list, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# LinkedList

单向链表实现，为添加和删除元素提供高效操作，特别是在链表的开头和结尾。

## 安装

<InstallTabs packageName='@msnkr/data-structures' importName='LinkedList' />

## 使用方法

```typescript
import { LinkedList } from '@msnkr/data-structures';

const list = new LinkedList<number>();
```

## API 参考

### 属性

- `size: number` - 链表中的元素数量
- `isEmpty(): boolean` - 链表是否为空

### 方法

#### 添加元素

```typescript
// 添加到末尾 - O(1)
list.append(1);

// 添加到开头 - O(1)
list.prepend(0);

// 在指定位置插入 - O(n)
list.insertAt(2, 1);
```

:::tip 性能
在开头和结尾插入都是 O(1) 常数时间。
:::

#### 删除元素

```typescript
// 从开头删除 - O(1)
const first = list.removeFirst();

// 在指定位置删除 - O(n)
const element = list.removeAt(1);

// 删除首次出现的值 - O(n)
const removed = list.remove(42);
```

#### 访问元素

```typescript
// 获取指定位置的元素 - O(n)
const element = list.get(0);

// 查找元素的位置 - O(n)
const index = list.indexOf(42);

// 检查元素是否存在 - O(n)
const exists = list.contains(42);
```

#### 实用方法

```typescript
// 转换为数组 - O(n)
const array = list.toArray();

// 删除所有元素 - O(1)
list.clear();
```

#### 迭代

```typescript
const list = new LinkedList<string>();
list.append('a');
list.append('b');

// 正向迭代
for (const value of list) {
  console.log(value);
}
```

## 示例

### 基本用法

```typescript
const list = new LinkedList<number>();

// 添加元素
list.append(1); // [1]
list.append(2); // [1, 2]
list.prepend(0); // [0, 1, 2]

console.log(list.toArray()); // [0, 1, 2]
console.log(list.size); // 3
```

### 构建任务列表

```typescript
const tasks = new LinkedList<string>();

// 添加任务
tasks.append('审查 PR');
tasks.append('编写测试');
tasks.prepend('早会'); // 高优先级

// 按顺序处理任务
while (!tasks.isEmpty()) {
  const task = tasks.removeFirst();
  console.log(`正在处理: ${task}`);
}
```

### 管理导航历史

```typescript
const history = new LinkedList<string>();

// 用户导航
history.append('/home');
history.append('/products');
history.append('/cart');

// 获取当前页面
const current = history.get(history.size - 1);
console.log(current); // "/cart"

// 检查是否访问过
const visited = history.contains('/products'); // true
```

## 错误处理

```typescript
import {
  EmptyStructureError,
  IndexOutOfBoundsError,
} from '@msnkr/data-structures';

try {
  const empty = new LinkedList<number>();
  empty.removeFirst(); // 抛出 EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('链表为空！');
  }
}

try {
  const list = new LinkedList<number>();
  list.append(1);
  list.get(10); // 抛出 IndexOutOfBoundsError
} catch (error) {
  if (error instanceof IndexOutOfBoundsError) {
    console.log('索引超出范围！');
  }
}
```

:::caution 错误条件

- `removeFirst()` 在空链表上抛出 `EmptyStructureError`
- `get()`, `insertAt()`, `removeAt()` 对于无效索引抛出 `IndexOutOfBoundsError`
  :::

## 性能特征

| 操作            | 时间复杂度 | 描述               |
| --------------- | ---------- | ------------------ |
| `append()`      | O(1)       | 添加元素到末尾     |
| `prepend()`     | O(1)       | 添加元素到开头     |
| `insertAt()`    | O(n)       | 在指定位置插入     |
| `removeFirst()` | O(1)       | 从开头删除元素     |
| `removeAt()`    | O(n)       | 在指定位置删除     |
| `remove()`      | O(n)       | 删除首次出现的元素 |
| `get()`         | O(n)       | 访问指定位置的元素 |
| `indexOf()`     | O(n)       | 查找元素的位置     |
| `contains()`    | O(n)       | 搜索元素           |
| `clear()`       | O(1)       | 删除所有元素       |
| `toArray()`     | O(n)       | 转换为数组         |

**空间复杂度：** O(n)，其中 n 是元素数量

## 实现细节

### 内部结构

- 使用单向链接节点结构
- 同时维护头指针和尾指针以实现 O(1) 的 append 操作
- 每个节点包含一个值和下一个节点的指针

:::info 何时使用 LinkedList
适用于：

- 在开头频繁插入/删除
- 仅需正向遍历
- 不需要双向链表的内存开销
- 构建队列、栈或简单列表
  :::

:::warning 何时避免使用
在以下情况考虑替代方案：

- **频繁随机访问** → 使用 Array
- **需要双向遍历** → 使用 [DoublyLinkedList](./doubly-linked-list)
- **内存极度受限** → 使用 Array
  :::

## 另请参阅

- [DoublyLinkedList](./doubly-linked-list) - 支持反向迭代的双向链表
- [Queue](./queue) - 先进先出 (FIFO) 队列
- [Deque](./deque) - 双端队列
