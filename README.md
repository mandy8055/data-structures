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
} from 'jsr:@msk/data-structures';
```

## Available Data Structures and their detailed documentations

- [LinkedList](./docs/linked-list.md): Singly linked list implementation
- [DoublyLinkedList](./docs/doubly-linked-list.md): Doubly linked list with bidirectional traversal
- [Deque](./docs/deque.md): For efficient support of insertion and removal of elements from both ends.
- [Trie](./docs/trie.md): For efficient storage and retrieval of strings while supporting associated values.

## Error Handling

The library includes custom error types:

- `EmptyStructureError`: For operations on empty structures
- `IndexOutOfBoundsError`: For invalid index access
- `InvalidOperationsError`: For performing invalid operations

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request after going through the [Contributing Guidelines](./docs/CONTRIBUTING.md).

## License

MIT License - feel free to use this in your own projects!
