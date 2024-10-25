# Priority Queue

A generic priority queue implementation backed by a binary heap, where elements are dequeued based on their priority.

## Usage

```typescript
import { PriorityQueue } from 'jsr:@msk/data-structures';

const queue = new PriorityQueue<number>();
```

## API Reference

### Properties

- `size: number` - Number of elements in the queue
- `isEmpty(): boolean` - Whether the queue is empty

### Methods

#### Queue Operations

```typescript
// Add element - O(log n)
queue.enqueue(value);

// Remove highest priority element - O(log n)
const next = queue.dequeue();

// Peek at highest priority element - O(1)
const top = queue.peek();
```

#### Utility Operations

```typescript
// Check if element exists - O(n)
const exists = queue.contains(value);

// Remove all elements - O(1)
queue.clear();

// Convert to array (heap order) - O(n)
const array = queue.toArray();

// Convert to sorted array (priority order) - O(n log n)
const sorted = queue.toSortedArray();
```

#### Iteration

```typescript
// Iterate in heap order (not necessarily priority order)
for (const value of queue) {
  console.log(value);
}
```

## Examples

### Basic Number Priority Queue

```typescript
const queue = new PriorityQueue<number>();

// By default, smaller numbers have higher priority
queue.enqueue(5);
queue.enqueue(3);
queue.enqueue(7);

console.log(queue.dequeue()); // 3
console.log(queue.dequeue()); // 5
console.log(queue.dequeue()); // 7
```

### Custom Priority with Objects

```typescript
interface Task {
  name: string;
  priority: number;
}

// Higher priority number means higher priority
const taskQueue = new PriorityQueue<Task>({
  comparator: (a, b) => b.priority - a.priority,
});

taskQueue.enqueue({ name: 'Low Priority', priority: 1 });
taskQueue.enqueue({ name: 'High Priority', priority: 3 });
taskQueue.enqueue({ name: 'Medium Priority', priority: 2 });

console.log(taskQueue.dequeue()); // { name: "High Priority", priority: 3 }
```

### Initial Values

```typescript
const queue = new PriorityQueue<number>({
  initial: [5, 3, 7, 1, 4],
});

console.log(queue.dequeue()); // 1
console.log(queue.peek()); // 3
```

### Custom Date Priority

```typescript
const appointments = new PriorityQueue<Date>({
  comparator: (a, b) => a.getTime() - b.getTime(),
});

appointments.enqueue(new Date('2024-12-25'));
appointments.enqueue(new Date('2024-10-31'));
appointments.enqueue(new Date('2024-11-24'));

// Will dequeue in chronological order
const next = appointments.dequeue(); // 2024-10-31
```

### With Custom Class

```typescript
class Task {
  constructor(
    public name: string,
    public priority: number,
    public deadline: Date,
  ) {}
}

const taskQueue = new PriorityQueue<Task>({
  comparator: (a, b) => {
    // First compare by priority
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    // Then by deadline
    return a.deadline.getTime() - b.deadline.getTime();
  },
});
```

## Error Handling

```typescript
try {
  const empty = new PriorityQueue<number>();
  empty.dequeue(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Queue is empty!');
  }
}
```

## Performance Characteristics

- Enqueue: O(log n)
- Dequeue: O(log n)
- Peek: O(1)
- Contains: O(n)
- toArray: O(n)
- toSortedArray: O(n log n)
- Space complexity: O(n)

## Implementation Details

The priority queue is implemented using a binary min-heap where:

1. The heap property determines element priority
2. Custom comparators allow flexible priority definition
3. The default implementation prioritizes smaller values
4. The internal structure maintains elements in heap order

### Key Features

1. Generic type support
2. Customizable priority ordering through comparator function
3. Optional initialization with existing values
4. Both heap-ordered and priority-ordered array conversions
5. Efficient priority-based operations
6. Iterator implementation for collection processing
