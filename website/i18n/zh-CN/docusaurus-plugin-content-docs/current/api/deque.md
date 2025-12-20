---
id: deque
title: Deque
sidebar_label: Deque
description: 双端队列，两端都支持 O(1) 操作
keywords: [deque, double-ended-queue, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# Deque

双端队列实现，高效支持在两端插入和删除元素。

## 安装

<InstallTabs packageName='@msnkr/data-structures' importName='Deque' />

## 使用方法

```typescript
import { Deque } from '@msnkr/data-structures';

const deque = new Deque<number>();
```

## API 参考

### 属性

- `size: number` - 双端队列中的元素数量
- `isEmpty(): boolean` - 双端队列是否为空

### 方法

#### 添加元素

```typescript
// 添加到队首 - O(1)
deque.addFirst(1);

// 添加到队尾 - O(1)
deque.addLast(2);
```

:::tip 性能
在任一端添加和删除操作都是 O(1) 常数时间。
:::

#### 删除元素

```typescript
// 从队首删除 - O(1)
const first = deque.removeFirst();

// 从队尾删除 - O(1)
const last = deque.removeLast();
```

#### 访问元素

```typescript
// 查看队首元素 - O(1)
const first = deque.peekFirst();

// 查看队尾元素 - O(1)
const last = deque.peekLast();

// 检查元素是否存在 - O(n)
const exists = deque.contains(1);
```

#### 迭代

```typescript
// 正向迭代（队首到队尾）
for (const value of deque) {
  console.log(value);
}

// 反向迭代（队尾到队首）
for (const value of deque.reverseIterator()) {
  console.log(value);
}
```

#### 其他操作

```typescript
// 删除所有元素 - O(1)
deque.clear();

// 转换为数组 - O(n)
const array = deque.toArray();
```

## 示例

### 两端的基本使用

```typescript
const deque = new Deque<number>();

// 在两端添加元素
deque.addFirst(1); // [1]
deque.addLast(2); // [1, 2]
deque.addFirst(0); // [0, 1, 2]

console.log([...deque]); // [0, 1, 2]
```

### 队列操作 (FIFO)

```typescript
const queue = new Deque<string>();

// 入队
queue.addLast('first');
queue.addLast('second');

// 出队
const first = queue.removeFirst(); // "first"
const second = queue.removeFirst(); // "second"
```

### 栈操作 (LIFO)

```typescript
const stack = new Deque<number>();

// 压栈
stack.addFirst(1);
stack.addFirst(2);

// 弹栈
const top = stack.removeFirst(); // 2
```

## 错误处理

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new Deque<number>();
  empty.removeFirst(); // 抛出 EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Deque is empty!');
  }
}
```

:::caution 空双端队列
在空双端队列上调用 `removeFirst()`、`removeLast()`、`peekFirst()` 或 `peekLast()` 会抛出 `EmptyStructureError`。
:::

## 性能特征

| 操作            | 时间复杂度 | 描述           |
| --------------- | ---------- | -------------- |
| `addFirst()`    | O(1)       | 添加元素到队首 |
| `addLast()`     | O(1)       | 添加元素到队尾 |
| `removeFirst()` | O(1)       | 从队首删除元素 |
| `removeLast()`  | O(1)       | 从队尾删除元素 |
| `peekFirst()`   | O(1)       | 查看队首元素   |
| `peekLast()`    | O(1)       | 查看队尾元素   |
| `contains()`    | O(n)       | 搜索元素       |
| `clear()`       | O(1)       | 删除所有元素   |
| `toArray()`     | O(n)       | 转换为数组     |

:::tip 用例
Deque 非常适合：

- 双端缓冲区
- 同时实现队列和栈
- 滑动窗口算法
- 撤销/重做栈
  :::

## 另请参阅

- [Queue](./queue) - 先进先出 (FIFO) 队列，支持 O(1) 入队/出队
- **[PriorityQueue](./priority-queue.md)** - 具有基于优先级排序的队列
