# data-structures

A comprehensive collection of generic data structure implementations which are not supported natively by the for TypeScript/JavaScript, and published on JSR.

[![codecov](https://codecov.io/gh/mandy8055/data-structures/branch/main/graph/badge.svg)](https://codecov.io/gh/mandy8055/data-structures)

## Features

- 🎯 Type-safe implementations with TypeScript generics
- 📦 Zero dependencies
- 🧪 Comprehensive test coverage
- 📚 Well-documented API
- 🚀 Optimized performance
- 🛡️ Error handling built-in

## Installation

```typescript
import {
  LinkedList,
  DoublyLinkedList,
  Deque,
  MinHeap,
  MaxHeap,
  Trie,
  PriorityQueue,
  SortedMap,
  RedBlackTree,
} from 'jsr:@msk/data-structures';
```

## Available Data Structures and their detailed documentations

- [LinkedList](./docs/linked-list.md): Singly linked list implementation
- [DoublyLinkedList](./docs/doubly-linked-list.md): Doubly linked list with bidirectional traversal
- [Deque](./docs/deque.md): For efficient support of insertion and removal of elements from both ends.
- [Trie](./docs/trie.md): For efficient storage and retrieval of strings while supporting associated values.
- [Binary Heap](./docs/binary-heap.md): Binary heap implementation that provides both Min Heap and Max Heap variants with efficient operations.
- [PriorityQueue](./docs/priority-queue.md): Implementation backed by a binary heap, where elements are dequeued based on their priority.
- [RedBlackTree](./docs/red-black-tree.md): Implementation providing self-balancing binary search tree operations
- [SortedMap](./docs/sorted-map.md): A generic key-value map that maintains its entries sorted by key using a Red-Black Tree.

## Error Handling

The library includes custom error types:

- `EmptyStructureError`: For operations on empty structures
- `IndexOutOfBoundsError`: For invalid index access
- `InvalidOperationsError`: For performing invalid operations

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request after going through the [Contributing Guidelines](./docs/CONTRIBUTING.md).

## License

MIT License - feel free to use this in your own projects!
