# Deque

A double-ended queue (deque) implementation that efficiently supports insertion and removal of elements at both ends.

## Usage

```typescript
import { Deque } from 'jsr:@msk/data-structures';

const deque = new Deque<number>();
```

## API Reference

### Properties

- `size: number` - Number of elements in the deque
- `isEmpty(): boolean` - Whether the deque is empty

### Methods

#### Adding Elements

```typescript
// Add to front - O(1)
deque.addFirst(1);

// Add to back - O(1)
deque.addLast(2);
```

#### Removing Elements

```typescript
// Remove from front - O(1)
const first = deque.removeFirst();

// Remove from back - O(1)
const last = deque.removeLast();
```

#### Accessing Elements

```typescript
// Peek at front element - O(1)
const first = deque.peekFirst();

// Peek at back element - O(1)
const last = deque.peekLast();

// Check if element exists - O(n)
const exists = deque.contains(1);
```

#### Iteration

```typescript
// Forward iteration (front to back)
for (const value of deque) {
  console.log(value);
}

// Reverse iteration (back to front)
for (const value of deque.reverseIterator()) {
  console.log(value);
}
```

#### Other Operations

```typescript
// Remove all elements - O(1)
deque.clear();

// Convert to array - O(n)
const array = deque.toArray();
```

## Examples

### Basic Usage with Both Ends

```typescript
const deque = new Deque<number>();

// Add elements at both ends
deque.addFirst(1); // [1]
deque.addLast(2); // [1, 2]
deque.addFirst(0); // [0, 1, 2]

console.log([...deque]); // [0, 1, 2]
```

### Queue Operations (FIFO)

```typescript
const queue = new Deque<string>();

// Enqueue
queue.addLast('first');
queue.addLast('second');

// Dequeue
const first = queue.removeFirst(); // "first"
const second = queue.removeFirst(); // "second"
```

### Stack Operations (LIFO)

```typescript
const stack = new Deque<number>();

// Push
stack.addFirst(1);
stack.addFirst(2);

// Pop
const top = stack.removeFirst(); // 2
```

## Error Handling

```typescript
try {
  const empty = new Deque<number>();
  empty.removeFirst(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Deque is empty!');
  }
}
```

## Performance Advantages

Key advantages of Deque:

1. O(1) operations at both ends
2. Can be used as both a queue and a stack
3. Bidirectional iteration support
4. Memory-efficient implementation
