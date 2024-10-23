# data-structures

A comprehensive collection of generic data structure implementations for TypeScript/JavaScript, designed for use with Deno and published on JSR.

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
import { ... } from "jsr:@msk/data-structures";
```

## Available Data Structures

- **LinkedList**: Singly linked list implementation

## Quick Start

```typescript
import { LinkedList } from 'jsr:@msk/data-structures';

// Using LinkedList
const list = new LinkedList<number>();
list.append(1);
list.append(2);
list.prepend(0);
console.log([...list]); // [0, 1, 2]
```

## Detailed Documentation

Each data structure is fully documented with TypeScript types and JSDoc comments. Here's an overview of the main data structures:

### LinkedList<T>

A singly linked list implementation that stores elements of type `T`.

```typescript
const list = new LinkedList<number>();

// Basic operations
list.append(1); // Add to end
list.prepend(0); // Add to start
list.insertAt(2, 1); // Insert at index
list.removeFirst(); // Remove from start
list.removeAt(1); // Remove at index
list.get(0); // Get element at index
list.indexOf(1); // Find index of element
list.contains(1); // Check if element exists
list.size(); // Get number of elements
list.isEmpty(); // Check if empty
list.clear(); // Remove all elements

// Iteration
for (const value of list) {
  console.log(value);
}
```

## Error Handling

The library includes custom error types for proper error handling:

- `EmptyStructureError`: Thrown when attempting to access or remove elements from an empty structure
- `IndexOutOfBoundsError`: Thrown when attempting to access an invalid index

## Performance Considerations

Time complexities for common operations:

### LinkedList

- Append/Prepend: O(1)
- Insert/Remove at index: O(n)
- Search: O(n)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this in your own projects!
