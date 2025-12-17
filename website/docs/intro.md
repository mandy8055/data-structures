---
id: intro
title: Introduction
sidebar_position: 1
---

# data-structures

A comprehensive collection of type-safe, zero-dependency data structure implementations for TypeScript/JavaScript.

## Why Use This Library?

- **🎯 Type Safety**: Full TypeScript support with generics for complete type safety
- **📦 Zero Dependencies**: No external dependencies - lightweight and secure
- **⚡ Performance**: Optimized implementations with documented time complexities
- **🧪 Well Tested**: Comprehensive test coverage (>85%)
- **🌲 Tree Shakeable**: Import only what you need - minimal bundle impact
- **📚 Well Documented**: Extensive documentation with examples
- **🔄 Dual Published**: Available on both JSR and npm for maximum compatibility

## Quick Start

Get started in seconds:

```bash
npm install @msnkr/data-structures
```

```typescript
import { Queue, LRUCache } from '@msnkr/data-structures';

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

## Available Data Structures

### Queues

- **[Queue](./api/queue)** - FIFO queue with O(1) enqueue/dequeue operations
- **[Deque](./api/deque)** - Double-ended queue with O(1) operations at both ends
- **[PriorityQueue](./api/priority-queue)** - Priority-based queue backed by binary heap

### Lists

- **[LinkedList](./api/linked-list)** - Singly linked list with O(1) insertions at ends
- **[DoublyLinkedList](./api/doubly-linked-list)** - Bidirectional linked list with reverse iteration

### Heaps

- **[BinaryHeap](./api/binary-heap)** - MinHeap and MaxHeap implementations with O(log n) operations

### Trees

- **[Trie](./api/trie)** - Prefix tree for efficient string operations and autocomplete
- **[RedBlackTree](./api/red-black-tree)** - Self-balancing binary search tree with guaranteed O(log n)

### Maps & Caches

- **[SortedMap](./api/sorted-map)** - Key-value map with sorted keys (Red-Black Tree backed)
- **[BiDirectionalMap](./api/bi-map)** - One-to-one bidirectional mapping with O(1) lookups
- **[LRUCache](./api/lru-cache)** - Least Recently Used cache with automatic eviction

## Next Steps

<div className="row">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>📖 Learn the Basics</h3>
      </div>
      <div className="card__body">
        <p>Get familiar with installation and basic usage. <em>(Coming in Checkpoint 3)</em></p>
      </div>
    </div>
  </div>

  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>📚 API Reference</h3>
      </div>
      <div className="card__body">
        <p>Explore complete API documentation for all 11 data structures above!</p>
      </div>
    </div>
  </div>
</div>

## Community & Support

- **GitHub**: [mandy8055/data-structures](https://github.com/mandy8055/data-structures)
- **Issues**: [Report bugs or request features](https://github.com/mandy8055/data-structures/issues)
- **Discussions**: [Join the community](https://github.com/mandy8055/data-structures/discussions)

## License

MIT License - feel free to use this in your own projects!
