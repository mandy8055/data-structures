---
id: heap-algorithms
title: Heap Algorithms and Patterns
sidebar_label: Heap Algorithms
description: Common algorithms and patterns using Binary Heaps
keywords: [binary-heap, heap, algorithms, k-largest, median, top-k]
---

# Heap Algorithms and Patterns

Master common algorithmic patterns using MinHeap and MaxHeap.

## Finding K Largest Elements

Find the K largest elements from a stream or array efficiently.

### Using MinHeap

```typescript
import { MinHeap } from '@msnkr/data-structures';

function findKLargest(arr: number[], k: number): number[] {
  const minHeap = new MinHeap<number>();

  for (const num of arr) {
    minHeap.insert(num);

    // Keep only k largest elements
    if (minHeap.size > k) {
      minHeap.remove(); // Remove smallest
    }
  }

  // Return in descending order
  return minHeap.toArray().sort((a, b) => b - a);
}

const numbers = [3, 1, 5, 12, 2, 11, 9, 7, 4, 8];
console.log(findKLargest(numbers, 3)); // [12, 11, 9]
```

**Time Complexity:** O(n log k) where n is array length
**Space Complexity:** O(k)

**Why MinHeap?** We keep the k largest elements by maintaining a heap of size k. The smallest element (root of MinHeap) is at the bottom of our "top k" range, making it easy to evict when we find a larger element.

### For K Smallest Elements

```typescript
import { MaxHeap } from '@msnkr/data-structures';

function findKSmallest(arr: number[], k: number): number[] {
  const maxHeap = new MaxHeap<number>();

  for (const num of arr) {
    maxHeap.insert(num);

    if (maxHeap.size > k) {
      maxHeap.remove(); // Remove largest
    }
  }

  return maxHeap.toArray().sort((a, b) => a - b);
}

console.log(findKSmallest(numbers, 3)); // [1, 2, 3]
```

## Stream Median Finder

Find the median of a stream of numbers in real-time.

### Two-Heap Approach

```typescript
import { MinHeap, MaxHeap } from '@msnkr/data-structures';

class MedianFinder {
  private maxHeap = new MaxHeap<number>(); // Lower half
  private minHeap = new MinHeap<number>(); // Upper half

  /**
   * Add a number to the data structure
   * Time Complexity: O(log n)
   */
  addNum(num: number): void {
    // Add to max heap (lower half) first
    this.maxHeap.insert(num);

    // Balance: ensure max of lower <= min of upper
    if (!this.minHeap.isEmpty() && this.maxHeap.peek() > this.minHeap.peek()) {
      this.minHeap.insert(this.maxHeap.remove());
    }

    // Balance sizes: maxHeap should have equal or 1 more element
    if (this.minHeap.size > this.maxHeap.size) {
      this.maxHeap.insert(this.minHeap.remove());
    }
    if (this.maxHeap.size > this.minHeap.size + 1) {
      this.minHeap.insert(this.maxHeap.remove());
    }
  }

  /**
   * Find the median
   * Time Complexity: O(1)
   */
  findMedian(): number {
    if (this.maxHeap.size === 0) {
      throw new Error('No elements');
    }

    if (this.maxHeap.size > this.minHeap.size) {
      return this.maxHeap.peek(); // Odd number of elements
    }

    // Even number of elements
    return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
  }
}

// Usage
const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
console.log(mf.findMedian()); // 1.5

mf.addNum(3);
console.log(mf.findMedian()); // 2

mf.addNum(4);
console.log(mf.findMedian()); // 2.5
```

**Why Two Heaps?**

- **MaxHeap** stores the smaller half (root = largest of small numbers)
- **MinHeap** stores the larger half (root = smallest of large numbers)
- Median is either the max of lower half or average of both roots

## Top K Frequent Elements

Find the K most frequent elements in an array.

```typescript
import { MinHeap } from '@msnkr/data-structures';

interface FrequencyPair {
  element: number;
  frequency: number;
}

function topKFrequent(arr: number[], k: number): number[] {
  // Count frequencies
  const freqMap = new Map<number, number>();
  for (const num of arr) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Use min heap to keep k most frequent
  const minHeap = new MinHeap<FrequencyPair>({
    comparator: (a, b) => a.frequency - b.frequency,
  });

  for (const [element, frequency] of freqMap) {
    minHeap.insert({ element, frequency });

    if (minHeap.size > k) {
      minHeap.remove(); // Remove least frequent
    }
  }

  return minHeap.toArray().map((pair) => pair.element);
}

const numbers = [1, 1, 1, 2, 2, 3, 4, 4, 4, 4];
console.log(topKFrequent(numbers, 2)); // [1, 4]
```

## Merge K Sorted Arrays

Efficiently merge multiple sorted arrays using a heap.

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

  // Initialize heap with first element from each array
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

    // Add next element from the same array
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

// Usage
const arrays = [
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
];
console.log(mergeKSorted(arrays)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

**Time Complexity:** O(N log k) where N is total elements, k is number of arrays

## Sliding Window Maximum

Find the maximum in each sliding window using a heap.

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
    // Add current element
    maxHeap.insert({ value: arr[i], index: i });

    // Remove elements outside window
    while (!maxHeap.isEmpty() && maxHeap.peek().index <= i - k) {
      maxHeap.remove();
    }

    // Add maximum of current window
    if (i >= k - 1) {
      result.push(maxHeap.peek().value);
    }
  }

  return result;
}

const arr = [1, 3, -1, -3, 5, 3, 6, 7];
console.log(slidingWindowMaximum(arr, 3)); // [3, 3, 5, 5, 6, 7]
```

## Kth Largest Element in Stream

Maintain the Kth largest element as new numbers arrive.

```typescript
import { MinHeap } from '@msnkr/data-structures';

class KthLargest {
  private minHeap: MinHeap<number>;
  private k: number;

  constructor(k: number, nums: number[]) {
    this.k = k;
    this.minHeap = new MinHeap<number>();

    // Initialize with given numbers
    for (const num of nums) {
      this.add(num);
    }
  }

  add(val: number): number {
    this.minHeap.insert(val);

    // Keep only k largest elements
    if (this.minHeap.size > this.k) {
      this.minHeap.remove();
    }

    return this.minHeap.peek(); // Kth largest
  }
}

// Usage
const kthLargest = new KthLargest(3, [4, 5, 8, 2]);
console.log(kthLargest.add(3)); // 4 (3rd largest: [8,5,4])
console.log(kthLargest.add(5)); // 5 (3rd largest: [8,5,5])
console.log(kthLargest.add(10)); // 5 (3rd largest: [10,8,5])
```

## Heap Sort

Sort an array using heap data structure.

```typescript
import { MaxHeap } from '@msnkr/data-structures';

function heapSort(arr: number[]): number[] {
  // Build heap from array - O(n)
  const maxHeap = new MaxHeap<number>(null, arr);

  const sorted: number[] = [];

  // Extract maximum repeatedly - O(n log n)
  while (!maxHeap.isEmpty()) {
    sorted.unshift(maxHeap.remove()); // Add to front
  }

  return sorted;
}

const arr = [3, 1, 4, 1, 5, 9, 2, 6];
console.log(heapSort(arr)); // [1, 1, 2, 3, 4, 5, 6, 9]
```

**Time Complexity:** O(n log n)
**Space Complexity:** O(n)

## Task Scheduling with Cooldown

Schedule tasks with cooldown periods using a heap.

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
  // Count task frequencies
  const freqMap = new Map<string, number>();
  for (const task of tasks) {
    freqMap.set(task, (freqMap.get(task) || 0) + 1);
  }

  // Create max heap by frequency
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

    // Execute one cycle
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

    // Add back tasks that need more executions
    for (const task of available) {
      maxHeap.insert(task);
    }
  }

  return result;
}

const tasks = ['A', 'A', 'A', 'B', 'B', 'C'];
console.log(scheduleTasksWithCooldown(tasks, 2));
// Possible output: ['A', 'B', 'C', 'A', 'B', 'idle', 'A']
```

## Performance Characteristics

| Operation      | MinHeap/MaxHeap | Description      |
| -------------- | --------------- | ---------------- |
| Insert         | O(log n)        | Add element      |
| Remove/Extract | O(log n)        | Remove root      |
| Peek/Top       | O(1)            | View root        |
| Heapify        | O(n)            | Build from array |
| Find           | O(n)            | Search element   |

## When to Use Heaps

✅ **Good for:**

- Finding K largest/smallest elements
- Priority-based processing
- Median maintenance
- Merge K sorted sequences
- Scheduling with priorities

❌ **Not ideal for:**

- Searching for arbitrary elements
- Maintaining sorted order (use RedBlackTree)
- FIFO/LIFO operations (use Queue/Stack)

## Related Topics

- [BinaryHeap API Reference](../api/binary-heap.md)
- [PriorityQueue API Reference](../api/priority-queue.md)
- [Event Queue Example](../examples/event-queue.md)
