# DoublyLinkedList

A doubly linked list implementation that stores elements of type `T` and supports bidirectional traversal.

## Usage

```typescript
import { DoublyLinkedList } from 'jsr:@mskr/data-structures';

const list = new DoublyLinkedList<number>();
```

## API Reference

### Properties

- `size: number` - Number of elements in the list
- `isEmpty(): boolean` - Whether the list is empty

### Methods

#### Adding Elements

```typescript
// Add to end - O(1)
list.append(1);

// Add to start - O(1)
list.prepend(0);

// Insert at index - O(n)
list.insertAt(2, 1);
```

#### Removing Elements

```typescript
// Remove from start - O(1)
const first = list.removeFirst();

// Remove from end - O(1)
const last = list.removeLast();

// Remove at index - O(n)
const element = list.removeAt(1);

// Remove by value - O(n)
const removed = list.remove(1);
```

#### Accessing Elements

```typescript
// Get element at index - O(min(n/2, k))
const element = list.get(0);

// Find index of element - O(n)
const index = list.indexOf(1);

// Check if element exists - O(n)
const exists = list.contains(1);
```

#### Iteration

```typescript
// Forward iteration
for (const value of list) {
  console.log(value);
}

// Reverse iteration
for (const value of list.reverseIterator()) {
  console.log(value);
}
```

#### Other Operations

```typescript
// Remove all elements - O(1)
list.clear();

// Convert to array - O(n)
const array = list.toArray();
```

## Examples

### Basic Usage with Bidirectional Traversal

```typescript
const list = new DoublyLinkedList<number>();

// Add elements
list.append(1);
list.append(2);
list.append(3);

// Forward traversal
console.log('Forward:', [...list]); // [1, 2, 3]

// Reverse traversal
console.log('Reverse:', [...list.reverseIterator()]); // [3, 2, 1]
```

### Efficient Operations at Both Ends

```typescript
const list = new DoublyLinkedList<string>();

// Add at both ends
list.append('end');
list.prepend('start');

// Remove from both ends
const first = list.removeFirst();
const last = list.removeLast();
```

## Error Handling

```typescript
try {
  const empty = new DoublyLinkedList<number>();
  empty.removeLast(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('List is empty!');
  }
}
```

## Performance Advantages

Key advantages over LinkedList:

1. O(1) removals from both ends
2. More efficient element access for indices closer to the tail
3. Bidirectional traversal support
4. Simplified removal of arbitrary nodes
