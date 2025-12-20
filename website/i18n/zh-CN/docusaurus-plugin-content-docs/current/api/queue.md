---
id: queue
title: Queue
sidebar_label: Queue
description: 先进先出 (FIFO) 队列实现，支持 O(1) 入队和出队操作
keywords: [queue, fifo, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# Queue

先进先出 (FIFO) 队列实现，高效支持在队尾插入和在队首删除。

## 安装

<InstallTabs packageName='@msnkr/data-structures' importName='Queue' />

## 使用方法

```typescript
import { Queue } from '@msnkr/data-structures';

const queue = new Queue<number>();
```

## API 参考

### 属性

- `size: number` - 队列中的元素数量
- `isEmpty(): boolean` - 队列是否为空

### 方法

#### 添加元素

```typescript
// 添加到队尾（入队） - O(1)
queue.enqueue(1);
```

:::tip 性能
入队操作是 O(1) 常数时间 - 极快！
:::

#### 删除元素

```typescript
// 从队首删除（出队） - O(1)
const first = queue.dequeue();
```

#### 访问元素

```typescript
// 查看队首元素 - O(1)
const front = queue.peek();

// 检查元素是否存在 - O(n)
const exists = queue.contains(1);
```

#### 迭代

```typescript
// 正向迭代（队首到队尾） - 非破坏性
for (const value of queue) {
  console.log(value);
}

// 排空元素（迭代时删除） - O(n)
for (const value of queue.drain()) {
  console.log(value); // 处理并删除每个元素
}
```

#### 其他操作

```typescript
// 删除所有元素 - O(1)
queue.clear();

// 转换为数组 - O(n)
const array = queue.toArray();
```

## 示例

### 基本队列操作

```typescript
const queue = new Queue<number>();

// 入队元素
queue.enqueue(1); // [1]
queue.enqueue(2); // [1, 2]
queue.enqueue(3); // [1, 2, 3]

console.log([...queue]); // [1, 2, 3]

// 出队元素
const first = queue.dequeue(); // 1
const second = queue.dequeue(); // 2
```

### 按顺序处理任务

```typescript
interface Task {
  id: number;
  name: string;
}

const taskQueue = new Queue<Task>();

// 添加要处理的任务
taskQueue.enqueue({ id: 1, name: 'Task 1' });
taskQueue.enqueue({ id: 2, name: 'Task 2' });

// 按 FIFO 顺序处理任务
while (!taskQueue.isEmpty()) {
  const task = taskQueue.dequeue();
  console.log(`Processing ${task.name}`);
}
```

### 数据缓冲

```typescript
const buffer = new Queue<string>();

// 缓冲传入数据
function receiveData(data: string) {
  buffer.enqueue(data);
}

// 处理缓冲数据
function processBuffer() {
  while (!buffer.isEmpty()) {
    const data = buffer.dequeue();
    console.log(`Processing: ${data}`);
  }
}

receiveData('chunk1');
receiveData('chunk2');
processBuffer(); // 按顺序处理：chunk1, chunk2
```

### 排空队列元素

`drain()` 方法提供了一种更简洁的方式来处理和删除所有元素：

```typescript
const queue = new Queue<number>();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

// 同步处理 - 排空所有元素
for (const item of queue.drain()) {
  console.log(item); // 1, 2, 3
}
console.log(queue.size); // 0 - 队列现在为空

// 异步处理
const asyncQueue = new Queue<string>();
asyncQueue.enqueue('task1');
asyncQueue.enqueue('task2');

for (const task of asyncQueue.drain()) {
  await processTask(task);
}

// 提前终止 - 剩余项保留在队列中
const partialQueue = new Queue<number>();
partialQueue.enqueue(1);
partialQueue.enqueue(2);
partialQueue.enqueue(3);

for (const item of partialQueue.drain()) {
  if (item === 2) break;
}
console.log(partialQueue.size); // 1 - 项 3 仍然存在
```

## 错误处理

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new Queue<number>();
  empty.dequeue(); // 抛出 EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Queue is empty!');
  }
}
```

:::caution 空队列
在空队列上调用 `dequeue()` 或 `peek()` 会抛出 `EmptyStructureError`。
:::

## 性能特征

| 操作         | 时间复杂度 | 描述           |
| ------------ | ---------- | -------------- |
| `enqueue()`  | O(1)       | 添加元素到队尾 |
| `dequeue()`  | O(1)       | 从队首删除元素 |
| `peek()`     | O(1)       | 查看队首元素   |
| `contains()` | O(n)       | 搜索元素       |
| `clear()`    | O(1)       | 删除所有元素   |
| `toArray()`  | O(n)       | 转换为数组     |

:::tip 用例

- 任务调度
- 请求处理
- 缓冲管理
- 消息队列
- 广度优先搜索 (BFS)
  :::

## 另请参阅

- [Deque](./deque) - 双端队列，两端都支持 O(1) 操作
- [PriorityQueue](./priority-queue) - 具有基于优先级排序的队列
- [LinkedList](./linked-list) - 单向链表（替代队列实现）
