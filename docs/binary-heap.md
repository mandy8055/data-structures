# Binary Heap

A generic binary heap implementation that provides both Min Heap and Max Heap variants with efficient operations.

## Usage

```typescript
import { MinHeap, MaxHeap } from 'jsr:@mskr/data-structures';

const minHeap = new MinHeap<number>();
const maxHeap = new MaxHeap<number>();
```

## API Reference

### Properties

- `size: number` - Number of elements in the heap
- `isEmpty(): boolean` - Whether the heap is empty

### Methods

#### Basic Operations

```typescript
// Insert element - O(log n)
heap.insert(value);

// Remove root element - O(log n)
const root = heap.remove();

// Peek at root element - O(1)
const top = heap.peek();
```

#### Searching and Utility

```typescript
// Check if element exists - O(n)
const exists = heap.contains(value);

// Remove all elements - O(1)
heap.clear();

// Convert to array (level-order) - O(n)
const array = heap.toArray();
```

#### Iteration

```typescript
// Level-order traversal
for (const value of heap) {
  console.log(value);
}
```

## Examples

### MinHeap Usage

```typescript
const minHeap = new MinHeap<number>();

// Insert elements
minHeap.insert(5);
minHeap.insert(3);
minHeap.insert(7);

console.log(minHeap.peek()); // 3 (minimum element)
console.log(minHeap.remove()); // 3
console.log(minHeap.peek()); // 5 (new minimum)
```

### MaxHeap Usage

```typescript
const maxHeap = new MaxHeap<number>();

// Insert elements
maxHeap.insert(5);
maxHeap.insert(3);
maxHeap.insert(7);

console.log(maxHeap.peek()); // 7 (maximum element)
console.log(maxHeap.remove()); // 7
console.log(maxHeap.peek()); // 5 (new maximum)
```

### Custom Comparator

```typescript
interface Person {
  name: string;
  age: number;
}

const byAge = (a: Person, b: Person) => a.age - b.age;
const minHeap = new MinHeap<Person>(byAge);

minHeap.insert({ name: 'Alice', age: 25 });
minHeap.insert({ name: 'Bob', age: 20 });
minHeap.insert({ name: 'Charlie', age: 30 });

console.log(minHeap.peek()); // { name: "Bob", age: 20 }
```

### Type-Safe Comparable Objects

```typescript
class ComparablePerson implements Comparable<ComparablePerson> {
  constructor(public name: string, public age: number) {}

  compareTo(other: ComparablePerson): number {
    return this.age - other.age;
  }
}

const heap = new MinHeap<ComparablePerson>();
heap.insert(new ComparablePerson('Alice', 25));
```

## Error Handling

```typescript
try {
  const empty = new MinHeap<number>();
  empty.remove(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Heap is empty!');
  }
}
```

## Performance Characteristics

- Insert: O(log n)
- Remove root: O(log n)
- Peek: O(1)
- Contains: O(n)
- Space complexity: O(n)

## Implementation Details

The heap is implemented as a complete binary tree stored in an array, where for any given node at index i:

- Left child is at index: 2i + 1
- Right child is at index: 2i + 2
- Parent is at index: floor((i-1)/2)

### Key Features

1. Generic type support with type safety
2. Custom comparator support
3. Built-in support for numbers, strings, and Comparable objects
4. Efficient heap property maintenance
5. Iterator implementation for level-order traversal
