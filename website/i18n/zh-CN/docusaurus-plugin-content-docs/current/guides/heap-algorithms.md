---
id: heap-algorithms
title: Heap 算法和模式
sidebar_label: Heap 算法
description: 使用 Binary Heap 的常见算法和模式
keywords: [binary-heap, heap, algorithms, k-largest, median, top-k]
---

# Heap 算法和模式

掌握使用 MinHeap 和 MaxHeap 的常见算法模式。

## 查找 K 个最大元素

从数据流或数组中高效查找 K 个最大元素。

### 使用 MinHeap

```typescript
import { MinHeap } from '@msnkr/data-structures';

function findKLargest(arr: number[], k: number): number[] {
  const minHeap = new MinHeap<number>();

  for (const num of arr) {
    minHeap.insert(num);

    // 只保留 k 个最大的元素
    if (minHeap.size > k) {
      minHeap.remove(); // 移除最小的
    }
  }

  // 按降序返回
  return minHeap.toArray().sort((a, b) => b - a);
}

const numbers = [3, 1, 5, 12, 2, 11, 9, 7, 4, 8];
console.log(findKLargest(numbers, 3)); // [12, 11, 9]
```

**时间复杂度：** O(n log k)，其中 n 是数组长度
**空间复杂度：** O(k)

**为什么使用 MinHeap？** 我们通过维护一个大小为 k 的 heap 来保留 k 个最大元素。最小的元素（MinHeap 的根节点）位于我们"前 k 大"范围的底部，这使得在找到更大元素时很容易将其剔除。

### 查找 K 个最小元素

```typescript
import { MaxHeap } from '@msnkr/data-structures';

function findKSmallest(arr: number[], k: number): number[] {
  const maxHeap = new MaxHeap<number>();

  for (const num of arr) {
    maxHeap.insert(num);

    if (maxHeap.size > k) {
      maxHeap.remove(); // 移除最大的
    }
  }

  return maxHeap.toArray().sort((a, b) => a - b);
}

console.log(findKSmallest(numbers, 3)); // [1, 2, 3]
```

## 数据流中位数查找器

实时查找数据流的中位数。

### 双 Heap 方法

```typescript
import { MinHeap, MaxHeap } from '@msnkr/data-structures';

class MedianFinder {
  private maxHeap = new MaxHeap<number>(); // 较小的一半
  private minHeap = new MinHeap<number>(); // 较大的一半

  /**
   * 向数据结构中添加一个数字
   * 时间复杂度：O(log n)
   */
  addNum(num: number): void {
    // 首先添加到 max heap（较小的一半）
    this.maxHeap.insert(num);

    // 平衡：确保较小一半的最大值 <= 较大一半的最小值
    if (!this.minHeap.isEmpty() && this.maxHeap.peek() > this.minHeap.peek()) {
      this.minHeap.insert(this.maxHeap.remove());
    }

    // 平衡大小：maxHeap 应该有相等或多 1 个元素
    if (this.minHeap.size > this.maxHeap.size) {
      this.maxHeap.insert(this.minHeap.remove());
    }
    if (this.maxHeap.size > this.minHeap.size + 1) {
      this.minHeap.insert(this.maxHeap.remove());
    }
  }

  /**
   * 查找中位数
   * 时间复杂度：O(1)
   */
  findMedian(): number {
    if (this.maxHeap.size === 0) {
      throw new Error('No elements');
    }

    if (this.maxHeap.size > this.minHeap.size) {
      return this.maxHeap.peek(); // 奇数个元素
    }

    // 偶数个元素
    return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
  }
}

// 使用方法
const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
console.log(mf.findMedian()); // 1.5

mf.addNum(3);
console.log(mf.findMedian()); // 2

mf.addNum(4);
console.log(mf.findMedian()); // 2.5
```

**为什么使用双 Heap？**

- **MaxHeap** 存储较小的一半（根节点 = 较小数字中的最大值）
- **MinHeap** 存储较大的一半（根节点 = 较大数字中的最小值）
- 中位数是较小一半的最大值或两个根节点的平均值

## 前 K 个高频元素

查找数组中 K 个最频繁出现的元素。

```typescript
import { MinHeap } from '@msnkr/data-structures';

interface FrequencyPair {
  element: number;
  frequency: number;
}

function topKFrequent(arr: number[], k: number): number[] {
  // 统计频率
  const freqMap = new Map<number, number>();
  for (const num of arr) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // 使用 min heap 保留 k 个最频繁的元素
  const minHeap = new MinHeap<FrequencyPair>({
    comparator: (a, b) => a.frequency - b.frequency,
  });

  for (const [element, frequency] of freqMap) {
    minHeap.insert({ element, frequency });

    if (minHeap.size > k) {
      minHeap.remove(); // 移除频率最低的
    }
  }

  return minHeap.toArray().map((pair) => pair.element);
}

const numbers = [1, 1, 1, 2, 2, 3, 4, 4, 4, 4];
console.log(topKFrequent(numbers, 2)); // [1, 4]
```

## 合并 K 个有序数组

使用 heap 高效合并多个有序数组。

```typescript
import { MinHeap } from '@msnkr/data-structures';

interface HeapNode {
  value: number;
  arrayIndex: number;
  elementIndex: number;
}

function mergeKSorted(arrays: number[][]): number[] {
  const minHeap = new MinHeap<HeapNode>({
    comparator: (a, b) => a.value - b.value,
  });

  // 用每个数组的第一个元素初始化 heap
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > 0) {
      minHeap.insert({
        value: arrays[i][0],
        arrayIndex: i,
        elementIndex: 0,
      });
    }
  }

  const result: number[] = [];

  while (!minHeap.isEmpty()) {
    const node = minHeap.remove();
    result.push(node.value);

    // 从同一个数组中添加下一个元素
    const nextIndex = node.elementIndex + 1;
    if (nextIndex < arrays[node.arrayIndex].length) {
      minHeap.insert({
        value: arrays[node.arrayIndex][nextIndex],
        arrayIndex: node.arrayIndex,
        elementIndex: nextIndex,
      });
    }
  }

  return result;
}

// 使用方法
const arrays = [
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
];
console.log(mergeKSorted(arrays)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

**时间复杂度：** O(N log k)，其中 N 是元素总数，k 是数组数量

## 滑动窗口最大值

使用 heap 查找每个滑动窗口中的最大值。

```typescript
import { MaxHeap } from '@msnkr/data-structures';

interface WindowElement {
  value: number;
  index: number;
}

function slidingWindowMaximum(arr: number[], k: number): number[] {
  const maxHeap = new MaxHeap<WindowElement>({
    comparator: (a, b) => a.value - b.value,
  });

  const result: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    // 添加当前元素
    maxHeap.insert({ value: arr[i], index: i });

    // 移除窗口外的元素
    while (!maxHeap.isEmpty() && maxHeap.peek().index <= i - k) {
      maxHeap.remove();
    }

    // 添加当前窗口的最大值
    if (i >= k - 1) {
      result.push(maxHeap.peek().value);
    }
  }

  return result;
}

const arr = [1, 3, -1, -3, 5, 3, 6, 7];
console.log(slidingWindowMaximum(arr, 3)); // [3, 3, 5, 5, 6, 7]
```

## 数据流中的第 K 大元素

随着新数字的到来，维护第 K 大元素。

```typescript
import { MinHeap } from '@msnkr/data-structures';

class KthLargest {
  private minHeap: MinHeap<number>;
  private k: number;

  constructor(k: number, nums: number[]) {
    this.k = k;
    this.minHeap = new MinHeap<number>();

    // 用给定数字初始化
    for (const num of nums) {
      this.add(num);
    }
  }

  add(val: number): number {
    this.minHeap.insert(val);

    // 只保留 k 个最大元素
    if (this.minHeap.size > this.k) {
      this.minHeap.remove();
    }

    return this.minHeap.peek(); // 第 K 大
  }
}

// 使用方法
const kthLargest = new KthLargest(3, [4, 5, 8, 2]);
console.log(kthLargest.add(3)); // 4 (第3大：[8,5,4])
console.log(kthLargest.add(5)); // 5 (第3大：[8,5,5])
console.log(kthLargest.add(10)); // 5 (第3大：[10,8,5])
```

## Heap 排序

使用 heap 数据结构对数组排序。

```typescript
import { MaxHeap } from '@msnkr/data-structures';

function heapSort(arr: number[]): number[] {
  // 从数组构建 heap - O(n)
  const maxHeap = new MaxHeap<number>(null, arr);

  const sorted: number[] = [];

  // 重复提取最大值 - O(n log n)
  while (!maxHeap.isEmpty()) {
    sorted.unshift(maxHeap.remove()); // 添加到前面
  }

  return sorted;
}

const arr = [3, 1, 4, 1, 5, 9, 2, 6];
console.log(heapSort(arr)); // [1, 1, 2, 3, 4, 5, 6, 9]
```

**时间复杂度：** O(n log n)
**空间复杂度：** O(n)

## 带冷却时间的任务调度

使用 heap 调度带有冷却期的任务。

```typescript
import { MaxHeap } from '@msnkr/data-structures';

interface Task {
  name: string;
  frequency: number;
  nextAvailable: number;
}

function scheduleTasksWithCooldown(
  tasks: string[],
  cooldown: number,
): string[] {
  // 统计任务频率
  const freqMap = new Map<string, number>();
  for (const task of tasks) {
    freqMap.set(task, (freqMap.get(task) || 0) + 1);
  }

  // 按频率创建 max heap
  const maxHeap = new MaxHeap<Task>({
    comparator: (a, b) => a.frequency - b.frequency,
  });

  for (const [name, frequency] of freqMap) {
    maxHeap.insert({ name, frequency, nextAvailable: 0 });
  }

  const result: string[] = [];
  let time = 0;

  while (!maxHeap.isEmpty()) {
    const available: Task[] = [];

    // 执行一个周期
    for (let i = 0; i <= cooldown && !maxHeap.isEmpty(); i++) {
      const task = maxHeap.remove();

      result.push(task.name);
      task.frequency--;

      if (task.frequency > 0) {
        task.nextAvailable = time + cooldown + 1;
        available.push(task);
      }

      time++;
    }

    // 将需要更多执行的任务添加回去
    for (const task of available) {
      maxHeap.insert(task);
    }
  }

  return result;
}

const tasks = ['A', 'A', 'A', 'B', 'B', 'C'];
console.log(scheduleTasksWithCooldown(tasks, 2));
// 可能的输出：['A', 'B', 'C', 'A', 'B', 'idle', 'A']
```

## 性能特性

| 操作           | MinHeap/MaxHeap | 说明       |
| -------------- | --------------- | ---------- |
| Insert         | O(log n)        | 添加元素   |
| Remove/Extract | O(log n)        | 移除根节点 |
| Peek/Top       | O(1)            | 查看根节点 |
| Heapify        | O(n)            | 从数组构建 |
| Find           | O(n)            | 搜索元素   |

## 何时使用 Heap

✅ **适用于：**

- 查找 K 个最大/最小元素
- 基于优先级的处理
- 维护中位数
- 合并 K 个有序序列
- 带优先级的调度

❌ **不适用于：**

- 搜索任意元素
- 维护有序排列（使用 RedBlackTree）
- FIFO/LIFO 操作（使用 Queue/Stack）

## 相关主题

- [BinaryHeap API 参考](../api/binary-heap.md)
- [PriorityQueue API 参考](../api/priority-queue.md)
- [事件队列示例](../examples/event-queue.md)
