# Sorted Map

A generic key-value collection that maintains entries sorted by key using a Red-Black Tree as its underlying data structure, ensuring O(log n) performance for most operations.

## Usage

```typescript
import { SortedMap } from 'jsr:@msk/data-structures';

const map = new SortedMap<number, string>();
```

## API Reference

### Properties

- `size: number` - Number of key-value pairs in the map
- `isEmpty(): boolean` - Whether the map contains any entries

### Methods

#### Map Operations

```typescript
// Set a key-value pair - O(log n)
map.set(key, value);

// Get value by key - O(log n)
const value = map.get(key);

// Check if key exists - O(log n)
const exists = map.has(key);

// Delete entry by key - O(log n)
const deleted = map.delete(key);
```

#### Min/Max Operations

```typescript
// Get smallest key - O(log n)
const first = map.firstKey();

// Get largest key - O(log n)
const last = map.lastKey();

// Get entry with smallest key - O(log n)
const [firstKey, firstValue] = map.firstEntry();

// Get entry with largest key - O(log n)
const [lastKey, lastValue] = map.lastEntry();
```

#### Collection Operations

```typescript
// Get all keys in sorted order - O(n)
const keys = map.keys();

// Get all values in key-sorted order - O(n)
const values = map.values();

// Get all entries in key-sorted order - O(n)
const entries = map.entries();

// Remove all entries - O(1)
map.clear();
```

#### Iteration

```typescript
// Iterate entries in key-sorted order
for (const [key, value] of map) {
  console.log(key, value);
}

// forEach iteration
map.forEach((value, key, map) => {
  console.log(key, value);
});
```

## Examples

### Basic Number-String Map

```typescript
const map = new SortedMap<number, string>();

map.set(5, 'five');
map.set(3, 'three');
map.set(7, 'seven');

console.log(map.get(3)); // "three"
console.log(map.firstKey()); // 3
console.log(map.lastKey()); // 7

// Iterate in sorted key order
for (const [key, value] of map) {
  console.log(key, value); // [3, "three"], [5, "five"], [7, "seven"]
}
```

### Custom Key Comparison with Objects

```typescript
interface User {
  id: number;
  name: string;
}

const userMap = new SortedMap<User, string>({
  comparator: (a, b) => a.id - b.id,
});

userMap.set({ id: 1, name: 'Alice' }, 'admin');
userMap.set({ id: 2, name: 'Bob' }, 'user');
userMap.set({ id: 3, name: 'Charlie' }, 'user');

console.log(userMap.get({ id: 2, name: 'Bob' })); // "user"
```

### Initial Values

```typescript
const map = new SortedMap<number, string>({
  entries: [
    [5, 'five'],
    [3, 'three'],
    [7, 'seven'],
  ],
});

console.log(map.firstEntry()); // [3, "three"]
console.log(map.lastEntry()); // [7, "seven"]
```

### Custom String Ordering

```typescript
const nameAges = new SortedMap<string, number>({
  comparator: (a, b) => a.localeCompare(b),
});

nameAges.set('Charlie', 30);
nameAges.set('Alice', 25);
nameAges.set('Bob', 35);

// Will iterate in alphabetical order of names
for (const [name, age] of nameAges) {
  console.log(name, age); // Alice 25, Bob 35, Charlie 30
}
```

### With Custom Class

```typescript
class Product {
  constructor(public id: number, public name: string) {}
}

const inventory = new SortedMap<Product, number>({
  comparator: (a, b) => {
    // First compare by id
    if (a.id !== b.id) {
      return a.id - b.id;
    }
    // Then by name
    return a.name.localeCompare(b.name);
  },
});

// Track product quantities
inventory.set(new Product(1, 'Apple'), 100);
inventory.set(new Product(2, 'Banana'), 150);
```

## Error Handling

```typescript
try {
  const empty = new SortedMap<number, string>();
  empty.firstKey(); // Throws EmptyStructureError
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Map is empty!');
  }
}
```

## Performance Characteristics

- Set: O(log n)
- Get: O(log n)
- Delete: O(log n)
- Has: O(log n)
- First/Last Key/Entry: O(log n)
- Keys/Values/Entries: O(n)
- Space complexity: O(n)

## Implementation Details

The SortedMap uses a Red-Black Tree as its underlying data structure to maintain sorted order and ensure balanced operations.

### Key Features

1. Generic type support for both keys and values
2. Customizable key ordering through comparator function
3. Optional initialization with existing entries
4. In-order traversal for sorted iteration of entries
5. Self-balancing through Red-Black Tree implementation
6. Type-safe implementation with full TypeScript support

### Comparison Handling

The map supports flexible key comparison through:

1. Default comparison using < and > operators
2. Custom comparator function for complex keys
3. Consistent handling of key equality for updates

### Use Cases

SortedMap is particularly useful when you need:

1. Key-value storage with sorted key access
2. Efficient range-based operations
3. Iteration of entries in a consistent order
4. Complex key types with custom ordering
5. Type-safe map implementation with guaranteed performance
