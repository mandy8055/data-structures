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
import { LinkedList, DoublyLinkedList } from 'jsr:@msk/data-structures';
```

## Quick Start

```typescript
// Using LinkedList
const list = new LinkedList<number>();
list.append(1);
list.append(2);
list.prepend(0);
console.log([...list]); // [0, 1, 2]

// Using DoublyLinkedList with reverse iteration
const dList = new DoublyLinkedList<number>();
dList.append(1);
dList.append(2);
dList.prepend(0);
console.log([...dList.reverseIterator()]); // [2, 1, 0]
```

## Available Data Structures

- [LinkedList](./docs/LinkedList.md): Singly linked list implementation
- [DoublyLinkedList](./docs/DoublyLinkedList.md): Doubly linked list with bidirectional traversal

## Error Handling

The library includes custom error types:

- `EmptyStructureError`: For operations on empty structures
- `IndexOutOfBoundsError`: For invalid index access
- `InvalidOperationsError`: For performing invalid operations

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

- [Contributing Guide](./docs/CONTRIBUTING.md)

## License

MIT License - feel free to use this in your own projects!
