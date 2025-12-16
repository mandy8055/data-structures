# data-structures

A comprehensive collection of generic data structure implementations for TypeScript/JavaScript, available on both JSR and npm.

[![JSR](https://jsr.io/badges/@mskr/data-structures)](https://jsr.io/@mskr/data-structures) [![JSR Score](https://jsr.io/badges/@mskr/data-structures/score)](https://jsr.io/@mskr/data-structures) [![npm version](https://badge.fury.io/js/@msnkr%2Fdata-structures.svg)](https://www.npmjs.com/package/@msnkr/data-structures) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@msnkr/data-structures)](https://bundlephobia.com/package/@msnkr/data-structures) [![codecov](https://codecov.io/gh/mandy8055/data-structures/branch/main/graph/badge.svg)](https://codecov.io/gh/mandy8055/data-structures) [![CI](https://github.com/mandy8055/data-structures/actions/workflows/release-please.yml/badge.svg)](https://github.com/mandy8055/data-structures/actions/workflows/release-please.yml)

## Features

- 🎯 Type-safe implementations with TypeScript generics
- 📦 Zero dependencies
- 🧪 Comprehensive test coverage
- 📚 Well-documented API
- 🚀 Optimized performance
- 🛡️ Error handling built-in
- 🔄 Available on both JSR and npm
- 🌲 Tree-shakeable - Only bundle what you import

## Installation

### For Deno (JSR)

```typescript
import {
  LinkedList,
  DoublyLinkedList,
  Deque,
  Queue,
  MinHeap,
  MaxHeap,
  Trie,
  PriorityQueue,
  SortedMap,
  RedBlackTree,
  BiDirectionalMap,
  LRUCache,
} from 'jsr:@mskr/data-structures';
```

### For Node.js / npm

```bash
npm install @msnkr/data-structures
```

```typescript
import {
  LinkedList,
  DoublyLinkedList,
  Deque,
  Queue,
  MinHeap,
  MaxHeap,
  Trie,
  PriorityQueue,
  SortedMap,
  RedBlackTree,
  BiDirectionalMap,
  LRUCache,
} from '@msnkr/data-structures';
```

### Using directly via CDN (Browser)

#### Via esm.sh (JSR)

```typescript
import * as ds from 'https://esm.sh/jsr/@mskr/data-structures';
// or
import { LinkedList, Queue } from 'https://esm.sh/jsr/@mskr/data-structures';
```

#### Via unpkg (npm)

```html
<script type="module">
  import { LinkedList, Queue } from 'https://unpkg.com/@msnkr/data-structures';
</script>
```

[**_Demo_**](https://codepen.io/mandy8055/pen/ZYzBpjL)

## Available Data Structures

Comprehensive documentation for each data structure:

- [LinkedList](./docs/linked-list.md): Singly linked list implementation
- [DoublyLinkedList](./docs/doubly-linked-list.md): Doubly linked list with bidirectional traversal
- [Deque](./docs/deque.md): For efficient support of insertion and removal of elements from both ends
- [Queue](./docs/queue.md): A First-In-First-Out (FIFO) queue implementation that efficiently supports insertion at the back and removal from the front
- [Trie](./docs/trie.md): For efficient storage and retrieval of strings while supporting associated values
- [Binary Heap](./docs/binary-heap.md): Binary heap implementation that provides both Min Heap and Max Heap variants with efficient operations
- [PriorityQueue](./docs/priority-queue.md): Implementation backed by a binary heap, where elements are dequeued based on their priority
- [RedBlackTree](./docs/red-black-tree.md): Implementation providing self-balancing binary search tree operations
- [SortedMap](./docs/sorted-map.md): A generic key-value map that maintains its entries sorted by key using a Red-Black Tree
- [BiDirectional Map](./docs/bi-map.md): Maintains one-to-one mappings between two sets of elements. Each key maps to a unique value, and each value maps to a unique key
- [LRU Cache](./docs/lru-cache.md): Implementation that provides efficient O(1) operations for both accessing and storing elements, with automatic eviction of least recently used items when capacity is reached

## Error Handling

The library includes custom error types:

- `EmptyStructureError`: For operations on empty structures
- `IndexOutOfBoundsError`: For invalid index access
- `InvalidOperationsError`: For performing invalid operations

## Package Information

- **JSR Package**: [`@mskr/data-structures`](https://jsr.io/@mskr/data-structures)
- **npm Package**: [`@msnkr/data-structures`](https://www.npmjs.com/package/@msnkr/data-structures)
- **Repository**: [github.com/mandy8055/data-structures](https://github.com/mandy8055/data-structures)

Both packages are kept in sync and published simultaneously with each release.

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request after going through the [Contributing Guidelines](./docs/CONTRIBUTING.md).

## License

MIT License - feel free to use this in your own projects!
