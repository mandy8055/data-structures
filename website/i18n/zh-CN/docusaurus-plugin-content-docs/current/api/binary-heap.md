---
id: binary-heap
title: BinaryHeap (MinHeap, MaxHeap)
sidebar_label: BinaryHeap
description: 最小堆和最大堆实现，插入/删除操作为 O(log n)
keywords: [binary-heap, min-heap, max-heap, heap, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# BinaryHeap

通用二叉堆实现，提供 MinHeap 和 MaxHeap 变体，具有高效的基于优先级的操作。

## 安装

<InstallTabs packageName='@msnkr/data-structures' importName='MinHeap, MaxHeap' />

## 使用方法

```typescript
import { MinHeap, MaxHeap } from '@msnkr/data-structures';

const minHeap = new MinHeap<number>();
const maxHeap = new MaxHeap<number>();
```

## API 参考

### 属性

- `size: number` - 堆中的元素数量
- `isEmpty(): boolean` - 堆是否为空

### 方法

#### 基本操作

```typescript
// 插入元素 - O(log n)
heap.insert(5);

// 删除根元素 - O(log n)
const root = heap.remove();

// 查看根元素 - O(1)
const top = heap.peek();
```

:::tip 性能
插入和删除操作是 O(log n)，对最小（MinHeap）或最大（MaxHeap）元素的访问是 O(1)。
:::

#### 搜索和实用工具

```typescript
// 检查元素是否存在 - O(n)
const exists = heap.contains(42);

// 删除所有元素 - O(1)
heap.clear();

// 转换为数组（层序） - O(n)
const array = heap.toArray();
```

#### 迭代

```typescript
// 层序遍历
for (const value of heap) {
  console.log(value);
}
```

## 示例

### MinHeap 使用

```typescript
const minHeap = new MinHeap<number>();

// 插入元素
minHeap.insert(5);
minHeap.insert(3);
minHeap.insert(7);
minHeap.insert(1);

console.log(minHeap.peek()); // 1 (最小元素)
console.log(minHeap.remove()); // 1
console.log(minHeap.peek()); // 3 (新的最小值)
console.log(minHeap.size); // 3
```

### MaxHeap 使用

```typescript
const maxHeap = new MaxHeap<number>();

// 插入元素
maxHeap.insert(5);
maxHeap.insert(3);
maxHeap.insert(7);
maxHeap.insert(10);

console.log(maxHeap.peek()); // 10 (最大元素)
console.log(maxHeap.remove()); // 10
console.log(maxHeap.peek()); // 7 (新的最大值)
```

### 高效的堆构建

```typescript
// 从数组创建堆 - O(n)
const minHeap = new MinHeap<number>(null, [5, 3, 8, 1, 7, 4]);
console.log(minHeap.peek()); // 1 (最小元素)
console.log(minHeap.size); // 6

// MaxHeap 同样适用
const maxHeap = new MaxHeap<number>(null, [5, 3, 8, 1, 7]);
console.log(maxHeap.peek()); // 8 (最大元素)
console.log(maxHeap.size); // 5
```

:::tip 高效初始化
从数组构建堆使用 O(n) 堆化算法，比逐个插入元素（O(n log n)）快得多。
:::

### 对象的自定义比较器

```typescript
interface Person {
  name: string;
  age: number;
}

// 按年龄的最小堆
const byAge = (a: Person, b: Person) => a.age - b.age;
const minHeap = new MinHeap<Person>(byAge);

minHeap.insert({ name: 'Alice', age: 25 });
minHeap.insert({ name: 'Bob', age: 20 });
minHeap.insert({ name: 'Charlie', age: 30 });

console.log(minHeap.peek()); // { name: "Bob", age: 20 }
```

### 查找 K 个最大元素

```typescript
function findKLargest(arr: number[], k: number): number[] {
  const minHeap = new MinHeap<number>();

  for (const num of arr) {
    minHeap.insert(num);
    if (minHeap.size > k) {
      minHeap.remove(); // 删除最小的
    }
  }

  return minHeap.toArray().sort((a, b) => b - a);
}

const numbers = [3, 1, 5, 12, 2, 11, 9, 7];
console.log(findKLargest(numbers, 3)); // [12, 11, 9]
```

### 中位数查找器

```typescript
class MedianFinder {
  private maxHeap = new MaxHeap<number>(); // 下半部分
  private minHeap = new MinHeap<number>(); // 上半部分

  addNum(num: number): void {
    // 首先添加到最大堆（下半部分）
    this.maxHeap.insert(num);

    // 平衡：将下半部分的最大值移至上半部分
    this.minHeap.insert(this.maxHeap.remove());

    // 平衡大小：maxHeap 应该有相等或多 1 个元素
    if (this.maxHeap.size < this.minHeap.size) {
      this.maxHeap.insert(this.minHeap.remove());
    }
  }

  findMedian(): number {
    if (this.maxHeap.size > this.minHeap.size) {
      return this.maxHeap.peek();
    }
    return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
  }
}

const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
console.log(mf.findMedian()); // 1.5
mf.addNum(3);
console.log(mf.findMedian()); // 2
```

### 类型安全的可比较对象

```typescript
class ComparablePerson implements Comparable<ComparablePerson> {
  constructor(public name: string, public age: number) {}

  compareTo(other: ComparablePerson): number {
    return this.age - other.age;
  }
}

const heap = new MinHeap<ComparablePerson>();
heap.insert(new ComparablePerson('Alice', 25));
heap.insert(new ComparablePerson('Bob', 20));

console.log(heap.peek()); // ComparablePerson { name: "Bob", age: 20 }
```

## 错误处理

```typescript
import { EmptyStructureError } from '@msnkr/data-structures';

try {
  const empty = new MinHeap<number>();
  empty.remove(); // 抛出 EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Heap is empty!');
  }
}

try {
  const empty = new MaxHeap<number>();
  empty.peek(); // 抛出 EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Cannot peek at empty heap!');
  }
}
```

:::caution 空堆
在空堆上调用 `remove()` 和 `peek()` 会抛出 `EmptyStructureError`。
:::

## 性能特征

| 操作             | 时间复杂度 | 描述         |
| ---------------- | ---------- | ------------ |
| `insert()`       | O(log n)   | 添加元素到堆 |
| `remove()`       | O(log n)   | 删除根元素   |
| `peek()`         | O(1)       | 查看根元素   |
| `contains()`     | O(n)       | 搜索元素     |
| `toArray()`      | O(n)       | 转换为数组   |
| `clear()`        | O(1)       | 删除所有元素 |
| **构建**         | O(n)       | 从数组构建堆 |

**空间复杂度：** O(n)，其中 n 是元素数量

## 实现细节

### 基于数组的存储

堆实现为存储在数组中的完全二叉树。对于索引 `i` 处的任何节点：

- **左子节点**：`2i + 1`
- **右子节点**：`2i + 2`
- **父节点**：`⌊(i - 1) / 2⌋`

```
       1
      / \
     3   2
    / \
   5   4

数组：[1, 3, 2, 5, 4]
索引：0  1  2  3  4
```

### 堆属性

**MinHeap**：父节点 ≤ 子节点（根是最小值）
**MaxHeap**：父节点 ≥ 子节点（根是最大值）

### 堆化算法

使用数组初始化时，堆使用 Floyd 的堆化算法：
- 从最后一个非叶子节点开始
- 向后工作，"下沉"每个节点
- 时间复杂度：O(n) - 比 n 次插入（O(n log n)）更高效

:::info 何时使用 BinaryHeap
非常适合：
- 高效查找最小/最大元素
- 优先队列实现
- K 个最大/最小元素问题
- 堆排序算法
- 中位数查找（双堆方法）
- 具有 top-k 查询的流数据
:::

:::warning MinHeap vs MaxHeap
根据您的需求选择：
- **MinHeap**：快速访问最小元素
- **MaxHeap**：快速访问最大元素
- 无法同时高效访问最小值和最大值
:::

## 与 PriorityQueue 比较

| 特性                 | BinaryHeap                | PriorityQueue                |
| -------------------- | ------------------------- | ---------------------------- |
| **API**              | `insert()`, `remove()`    | `enqueue()`, `dequeue()`     |
| **用例**             | 低级堆操作                | 类似队列的优先级处理         |
| **抽象**             | 直接堆操作                | 更高级的队列接口             |

:::tip 使用哪个？
- 对于任务调度、事件队列（队列语义）使用 **PriorityQueue**
- 对于需要直接堆操作的算法（堆排序等）使用 **BinaryHeap**
:::

## 另请参阅

- [PriorityQueue](./priority-queue) - 基于堆构建的更高级优先队列
- [Queue](./queue) - 先进先出 (FIFO) 队列
