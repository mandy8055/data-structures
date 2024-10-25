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
import { LinkedList, DoublyLinkedList, Deque } from 'jsr:@msk/data-structures';
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

// Using Deque
const deque = new Deque<number>();

// Add elements at both ends
deque.addFirst(1); // [1]
deque.addLast(2); // [1, 2]
deque.addFirst(0); // [0, 1, 2]

console.log([...deque]); // [0, 1, 2]

// Using Trie
const trie = new Trie<number>();
trie.insert('hello', 1);
trie.insert('help', 2);
console.log(trie.search('hello')); // 1
console.log(trie.getAllWithPrefix('hel')); // ["hello", "help"]
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
