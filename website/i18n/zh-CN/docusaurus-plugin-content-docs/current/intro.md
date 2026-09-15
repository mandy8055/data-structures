---
id: intro
title: 简介
sidebar_position: 1
---

# data-structures

为 TypeScript/JavaScript 提供的全面的、类型安全的、零依赖的数据结构实现集合。

## 为什么使用这个库？

- **🎯 类型安全**：完整的 TypeScript 支持，带有泛型，提供完全的类型安全
- **📦 零依赖**：无外部依赖 - 轻量且安全
- **⚡ 高性能**：经过优化的实现，并附有时间复杂度文档
- **🧪 经过充分测试**：全面的测试覆盖率 (>85%)
- **🌲 可 Tree Shake**：只导入您需要的部分 - 最小化打包影响
- **📚 文档齐全**：提供大量示例的详细文档
- **🔄 双重发布**：在 JSR 和 npm 上均可用，实现最大兼容性

## 快速开始

几秒钟即可开始：

```bash
npm install @dstoolkit/data-structures
```

```typescript
import { Queue, LRUCache } from '@dstoolkit/data-structures';

// FIFO Queue
const queue = new Queue<number>();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue()); // 1

// LRU Cache
const cache = new LRUCache<string, number>({ capacity: 100 });
cache.put('key', 42);
console.log(cache.get('key')); // 42
```

## 可用的数据结构

### 队列

- **[Queue](./api/queue)** - 具有 O(1) 入队/出队操作的 FIFO 队列
- **[Deque](./api/deque)** - 双端队列，两端都支持 O(1) 操作
- **[PriorityQueue](./api/priority-queue)** - 基于二叉堆的优先队列

### 链表

- **[LinkedList](./api/linked-list)** - 单向链表，两端插入为 O(1)
- **[DoublyLinkedList](./api/doubly-linked-list)** - 双向链表，支持反向迭代

### 堆

- **[BinaryHeap](./api/binary-heap)** - MinHeap 和 MaxHeap 实现，操作时间复杂度为 O(log n)

### 树

- **[Trie](./api/trie)** - 用于高效字符串操作和自动补全的前缀树
- **[RedBlackTree](./api/red-black-tree)** - 自平衡二叉搜索树，保证 O(log n) 性能

### 映射与缓存

- **[SortedMap](./api/sorted-map)** - 键值映射，键已排序（基于红黑树）
- **[BiDirectionalMap](./api/bi-map)** - 一对一双向映射，支持 O(1) 查找
- **[LRUCache](./api/lru-cache)** - 最近最少使用缓存，自动淘汰

## 下一步

<div className="row">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>📖 学习基础知识</h3>
      </div>
      <div className="card__body">
        <p>熟悉安装和基本用法。</p>
      </div>
    </div>
  </div>

  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>📚 API 参考</h3>
      </div>
      <div className="card__body">
        <p>探索上述所有 11 种数据结构的完整 API 文档！</p>
      </div>
    </div>
  </div>
</div>

## 社区与支持

- **GitHub**: [mandy8055/data-structures](https://github.com/mandy8055/data-structures)
- **问题反馈**: [报告错误或请求功能](https://github.com/mandy8055/data-structures/issues)
- **讨论**: [加入社区](https://github.com/mandy8055/data-structures/discussions)

## 许可证

MIT 许可证 - 欢迎在您自己的项目中使用！
