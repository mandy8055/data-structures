# data-structures

A comprehensive collection of type-safe, zero-dependency data structure implementations for TypeScript/JavaScript.

[![JSR](https://jsr.io/badges/@dstoolkit/data-structures)](https://jsr.io/@dstoolkit/data-structures) [![JSR Score](https://jsr.io/badges/@dstoolkit/data-structures/score)](https://jsr.io/@dstoolkit/data-structures) [![npm version](https://badge.fury.io/js/@dstoolkit%2Fdata-structures.svg)](https://www.npmjs.com/package/@dstoolkit/data-structures) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@dstoolkit/data-structures)](https://bundlephobia.com/package/@dstoolkit/data-structures) [![codecov](https://codecov.io/gh/mandy8055/data-structures/branch/main/graph/badge.svg)](https://codecov.io/gh/mandy8055/data-structures) [![CI](https://github.com/mandy8055/data-structures/actions/workflows/release-please.yml/badge.svg)](https://github.com/mandy8055/data-structures/actions/workflows/release-please.yml)

## 📚 [Full Documentation](https://data-structures-docs.vercel.app)

Visit our comprehensive documentation site for detailed guides, API references, and examples.

## Quick Start

### Installation

**npm:**

```bash
npm install @dstoolkit/data-structures
```

**Deno (JSR):**

```typescript
import { Queue, LRUCache } from 'jsr:@dstoolkit/data-structures';
```

### Example

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

## Data Structures

- **Queues**: Queue, Deque, PriorityQueue
- **Lists**: LinkedList, DoublyLinkedList
- **Heaps**: BinaryHeap (MinHeap, MaxHeap)
- **Trees**: Trie, RedBlackTree
- **Maps & Caches**: SortedMap, BiDirectionalMap, LRUCache

## Features

- 🎯 **Type Safety** - Full TypeScript support with generics
- 📦 **Zero Dependencies** - Lightweight and secure
- ⚡ **Performance** - Optimized implementations with documented time complexities
- 🧪 **Well Tested** - Comprehensive test coverage (>85%)
- 🌲 **Tree Shakeable** - Import only what you need
- 🔄 **Dual Published** - Available on both JSR and npm

## Links

- 📚 **[Documentation](https://data-structures-docs.vercel.app)** - Complete guides and API reference
- 🐛 **[Issues](https://github.com/mandy8055/data-structures/issues)** - Report bugs or request features
- 💬 **[Discussions](https://github.com/mandy8055/data-structures/discussions)** - Join the community

## License

MIT License - feel free to use this in your own projects!
