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

### Lists
- **LinkedList** - Singly linked list with O(1) insertions at ends
- **DoublyLinkedList** - Bidirectional linked list

### Queues & Deques
- **[Queue](./api/queue)** - FIFO queue with O(1) operations ✅
- **Deque** - Double-ended queue
- **PriorityQueue** - Priority-based queue

### Heaps
- **BinaryHeap** - MinHeap and MaxHeap implementations

### Trees
- **Trie** - Prefix tree for string operations
- **RedBlackTree** - Self-balancing binary search tree

### Maps & Caches
- **SortedMap** - Key-value map with sorted keys
- **BiDirectionalMap** - One-to-one bidirectional mapping
- **LRUCache** - Least Recently Used cache

_More API documentation coming soon!_

## Next Steps

<div className="row">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>📖 Learn the Basics</h3>
      </div>
      <div className="card__body">
        <p>Get familiar with installation and basic usage.</p>
      </div>
      <div className="card__body">
        <p>Get familiar with installation and basic usage. _(Coming soon)_</p>
      </div>
    </div>
  </div>

  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>📚 API Reference</h3>
      </div>
      <div className="card__body">
        <p>Explore complete API documentation. _(More docs coming soon)_</p>
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
