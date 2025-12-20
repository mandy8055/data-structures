---
id: priority-queue
title: PriorityQueue
sidebar_label: PriorityQueue
description: 基于二叉堆的优先队列，O(log n) 入队/出队操作
keywords:
  [priority-queue, heap, data-structure, typescript, javascript, min-heap]
---

import InstallTabs from '@site/src/components/InstallTabs';

# PriorityQueue

通用优先队列实现，由二叉最小堆支持，元素根据优先级而非插入顺序出队。

## 安装

<InstallTabs packageName='@msnkr/data-structures' importName='PriorityQueue' />

## 使用方法

```typescript
import { PriorityQueue } from '@msnkr/data-structures';

const queue = new PriorityQueue<number>();
```

## API 参考

### 属性

- `size: number` - 队列中元素的数量
- `isEmpty(): boolean` - 队列是否为空

### 方法

#### 队列操作

```typescript
// 添加元素 - O(log n)
queue.enqueue(5);

// 移除最高优先级元素 - O(log n)
const next = queue.dequeue();

// 查看最高优先级元素 - O(1)
const top = queue.peek();
```

:::tip 性能
入队和出队操作都是 O(log n)，使得优先队列即使有数千个元素也很高效。
:::

#### 实用操作

```typescript
// 检查元素是否存在 - O(n)
const exists = queue.contains(42);

// 删除所有元素 - O(1)
queue.clear();

// 转换为数组（堆顺序）- O(n)
const array = queue.toArray();

// 转换为排序数组（优先级顺序）- O(n log n)
const sorted = queue.toSortedArray();
```

#### 迭代

```typescript
// 以堆顺序迭代（不一定是优先级顺序）
for (const value of queue) {
  console.log(value);
}
```

:::info 迭代顺序
迭代器以堆顺序返回元素，可能不是优先级顺序。要获得排序输出，请使用 `toSortedArray()`。
:::

## 示例

### 基本数字优先队列

```typescript
const queue = new PriorityQueue<number>();

// 默认情况下，较小的数字具有更高的优先级（最小堆）
queue.enqueue(5);
queue.enqueue(3);
queue.enqueue(7);
queue.enqueue(1);

console.log(queue.dequeue()); // 1（最高优先级）
console.log(queue.dequeue()); // 3
console.log(queue.peek()); // 5（查看但不删除）
```

### 对象的自定义优先级

```typescript
interface Task {
  name: string;
  priority: number;
}

// 更高的优先级数字表示更高的优先级
const taskQueue = new PriorityQueue<Task>({
  comparator: (a, b) => b.priority - a.priority,
});

taskQueue.enqueue({ name: '低优先级', priority: 1 });
taskQueue.enqueue({ name: '高优先级', priority: 3 });
taskQueue.enqueue({ name: '中优先级', priority: 2 });

console.log(taskQueue.dequeue()); // { name: "高优先级", priority: 3 }
console.log(taskQueue.dequeue()); // { name: "中优先级", priority: 2 }
console.log(taskQueue.dequeue()); // { name: "低优先级", priority: 1 }
```

### 使用值初始化

```typescript
const queue = new PriorityQueue<number>({
  initial: [5, 3, 7, 1, 4],
});

console.log(queue.size); // 5
console.log(queue.dequeue()); // 1
console.log(queue.peek()); // 3
```

:::tip 高效初始化
使用数组初始化会使用 O(n) 堆化算法，比逐个入队元素（O(n log n)）更高效。
:::

### 任务调度系统

```typescript
interface ScheduledTask {
  name: string;
  priority: number;
  deadline: Date;
}

const scheduler = new PriorityQueue<ScheduledTask>({
  comparator: (a, b) => {
    // 首先按优先级比较（更高更紧急）
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // 然后按截止日期比较（更早更紧急）
    return a.deadline.getTime() - b.deadline.getTime();
  },
});

scheduler.enqueue({
  name: '审查 PR',
  priority: 2,
  deadline: new Date('2025-12-20'),
});

scheduler.enqueue({
  name: '修复严重错误',
  priority: 3,
  deadline: new Date('2025-12-18'),
});

scheduler.enqueue({
  name: '更新文档',
  priority: 1,
  deadline: new Date('2025-12-19'),
});

// 按优先级顺序处理任务
while (!scheduler.isEmpty()) {
  const task = scheduler.dequeue();
  console.log(`处理中：${task.name}（优先级：${task.priority}）`);
}
```

### 带时间戳的事件队列

```typescript
interface Event {
  type: string;
  timestamp: Date;
}

const events = new PriorityQueue<Event>({
  comparator: (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
});

events.enqueue({ type: 'login', timestamp: new Date('2025-12-17T10:00:00') });
events.enqueue({ type: 'click', timestamp: new Date('2025-12-17T09:30:00') });
events.enqueue({ type: 'logout', timestamp: new Date('2025-12-17T11:00:00') });

// 按时间顺序处理事件
console.log(events.dequeue()); // { type: "click", timestamp: ... }
console.log(events.dequeue()); // { type: "login", timestamp: ... }
console.log(events.dequeue()); // { type: "logout", timestamp: ... }
```

### Dijkstra 最短路径算法

```typescript
interface Node {
  id: string;
  distance: number;
}

function dijkstra(graph: Map<string, [string, number][]>, start: string) {
  const distances = new Map<string, number>();
  const pq = new PriorityQueue<Node>({
    comparator: (a, b) => a.distance - b.distance,
  });

  pq.enqueue({ id: start, distance: 0 });
  distances.set(start, 0);

  while (!pq.isEmpty()) {
    const current = pq.dequeue()!;

    const neighbors = graph.get(current.id) || [];
    for (const [neighborId, weight] of neighbors) {
      const newDistance = current.distance + weight;
      const oldDistance = distances.get(neighborId) ?? Infinity;

      if (newDistance < oldDistance) {
        distances.set(neighborId, newDistance);
        pq.enqueue({ id: neighborId, distance: newDistance });
      }
    }
  }

  return distances;
}
```

### 医院急诊室分诊

```typescript
interface Patient {
  name: string;
  severity: number; // 1-5，5 最严重
  arrivalTime: Date;
}

const emergencyRoom = new PriorityQueue<Patient>({
  comparator: (a, b) => {
    // 首先按严重程度
    if (a.severity !== b.severity) {
      return b.severity - a.severity;
    }
    // 相同严重程度时按到达时间
    return a.arrivalTime.getTime() - b.arrivalTime.getTime();
  },
});

emergencyRoom.enqueue({
  name: '张三',
  severity: 2,
  arrivalTime: new Date('2025-12-17T10:00'),
});

emergencyRoom.enqueue({
  name: '李四',
  severity: 5,
  arrivalTime: new Date('2025-12-17T10:05'),
});

emergencyRoom.enqueue({
  name: '王五',
  severity: 3,
  arrivalTime: new Date('2025-12-17T10:02'),
});

// 按严重程度和到达时间治疗患者
while (!emergencyRoom.isEmpty()) {
  const patient = emergencyRoom.dequeue()!;
  console.log(`治疗：${patient.name}（严重程度：${patient.severity}）`);
}
// 输出：
// 治疗：李四（严重程度：5）
// 治疗：王五（严重程度：3）
// 治疗：张三（严重程度：2）
```

### 带优先级的作业调度

```typescript
interface Job {
  id: number;
  priority: number;
  estimatedTime: number; // 分钟
}

const jobQueue = new PriorityQueue<Job>({
  comparator: (a, b) => {
    // 更高优先级先执行
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // 相同优先级，较短的作业先执行
    return a.estimatedTime - b.estimatedTime;
  },
});

jobQueue.enqueue({ id: 1, priority: 2, estimatedTime: 30 });
jobQueue.enqueue({ id: 2, priority: 3, estimatedTime: 15 });
jobQueue.enqueue({ id: 3, priority: 2, estimatedTime: 10 });

console.log(jobQueue.dequeue()); // Job 2（优先级 3）
console.log(jobQueue.dequeue()); // Job 3（优先级 2，时间 10）
console.log(jobQueue.dequeue()); // Job 1（优先级 2，时间 30）
```

## 时间复杂度

| 操作          | 平均       | 最坏       |
| ------------- | ---------- | ---------- |
| enqueue       | O(log n)   | O(log n)   |
| dequeue       | O(log n)   | O(log n)   |
| peek          | O(1)       | O(1)       |
| contains      | O(n)       | O(n)       |
| clear         | O(1)       | O(1)       |
| toArray       | O(n)       | O(n)       |
| toSortedArray | O(n log n) | O(n log n) |

## 最佳实践

### 何时使用 PriorityQueue

- ✅ 元素需要按优先级处理而非 FIFO
- ✅ 实现 Dijkstra 最短路径、A\* 搜索等算法
- ✅ 任务调度系统
- ✅ 事件模拟和离散事件系统
- ✅ 合并 k 个排序列表

### 何时不使用 PriorityQueue

- ❌ 需要 FIFO 顺序（使用 Queue）
- ❌ 需要 LIFO 顺序（使用栈/数组）
- ❌ 需要随机访问（使用数组）
- ❌ 所有元素优先级相同（使用 Queue）

### 比较器提示

```typescript
// 最小堆（默认）- 较小的值先出
const minHeap = new PriorityQueue<number>();

// 最大堆 - 较大的值先出
const maxHeap = new PriorityQueue<number>({
  comparator: (a, b) => b - a,
});

// 对象的自定义比较
const taskQueue = new PriorityQueue<Task>({
  comparator: (a, b) => {
    // 多个条件
    if (a.priority !== b.priority) return b.priority - a.priority;
    return a.deadline.getTime() - b.deadline.getTime();
  },
});
```

## 相关数据结构

- **BinaryHeap** - 底层堆实现
- **Queue** - FIFO 队列，无优先级
- **Deque** - 双端队列，无优先级
- **SortedMap** - 已排序的键值映射
