# LinkedList<T>

## Overview

A generic singly linked list implementation that provides a standard linked list data structure with efficient operations for adding, removing, and accessing elements.

## Features

- O(1) insertions at the beginning and end
- O(n) access to arbitrary elements
- Iterator support for use in for...of loops
- Type-safe implementation using TypeScript generics
- Zero dependencies

### Constructor

```typescript
const list = new LinkedList<T>();
```

### Properties

- `size: number` - Returns the number of elements in the list

### Methods

#### Basic Operations

- `append(value: T): void` - Adds an element to the end (O(1))
- `prepend(value: T): void` - Adds an element to the start (O(1))
- `insertAt(value: T, index: number): void` - Inserts at specific position (O(n))
- `get(index: number): T` - Returns element at position (O(n))

#### Removal Operations

- `removeFirst(): T` - Removes and returns first element (O(1))
- `removeAt(index: number): T` - Removes element at position (O(n))
- `remove(value: T): boolean` - Removes first occurrence of value (O(n))

#### Utility Methods

- `isEmpty(): boolean` - Checks if list is empty (O(1))
- `indexOf(value: T): number` - Finds position of element (O(n))
- `contains(value: T): boolean` - Checks if element exists (O(n))
- `toArray(): T[]` - Converts list to array (O(n))
- `clear(): void` - Removes all elements (O(1))

## Usage Examples

### Basic Usage

```typescript
const list = new LinkedList<number>();
list.append(1);
list.append(2);
list.prepend(0);
console.log(list.toArray()); // [0, 1, 2]
```

### Iteration

```typescript
const list = new LinkedList<string>();
list.append('a');
list.append('b');

for (const value of list) {
  console.log(value); // "a", "b"
}
```

### Error Handling

```typescript
const list = new LinkedList<number>();

try {
  list.removeFirst(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('List is empty');
  }
}
```

## Implementation Details

### Internal Structure

- Uses a singly linked node structure
- Maintains both head and tail pointers
- Each node contains a value and next pointer

### Time Complexities

- Insertions at ends: O(1)
- Insertions at position: O(n)
- Removals from start: O(1)
- Removals from position: O(n)
- Search operations: O(n)

### Memory Usage

- Space complexity: O(n)
- Additional space per node: 1 reference

## Best Practices

### When to Use

- When frequent insertions/deletions at the beginning are needed
- When memory overhead of doubly linked list isn't justified
- When forward-only traversal is sufficient

### When to Avoid

- When random access is frequent (use Array instead)
- When bidirectional traversal is needed (use DoublyLinkedList)
- When memory is extremely constrained

## Related

- [DoublyLinkedList](./doubly-linked-list.md) - When bidirectional traversal is needed
