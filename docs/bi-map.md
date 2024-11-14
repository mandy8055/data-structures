# BiDirectionalMap

A bidirectional map (BiMap) implementation that maintains one-to-one mappings between keys and values, allowing efficient lookups in both directions.

## Usage

```typescript
import { BiDirectionalMap } from 'jsr:@mskr/data-structures';

const biMap = new BiDirectionalMap<string, number>();
```

## API Reference

### Properties

- `size: number` - Number of key-value pairs in the map

### Methods

#### Setting and Getting Elements

```typescript
// Set key-value pair - O(1)
biMap.set('one', 1);

// Get value by key - O(1)
const value = biMap.get('one');

// Get key by value - O(1)
const key = biMap.getKey(1);
```

#### Checking Existence

```typescript
// Check if key exists - O(1)
const hasKey = biMap.hasKey('one');

// Check if value exists - O(1)
const hasValue = biMap.hasValue(1);
```

#### Removing Elements

```typescript
// Remove by key - O(1)
const removedKey = biMap.deleteKey('one');

// Remove by value - O(1)
const removedValue = biMap.deleteValue(1);

// Remove all mappings - O(1)
biMap.clear();
```

#### Iteration

```typescript
// Iterate over keys
for (const key of biMap.keys()) {
  console.log(key);
}

// Iterate over values
for (const value of biMap.values()) {
  console.log(value);
}

// Iterate over entries
for (const [key, value] of biMap.entries()) {
  console.log(`${key} => ${value}`);
}

// Using forEach
biMap.forEach((value, key, map) => {
  console.log(`${key} maps to ${value}`);
});
```

#### Utility Methods

```typescript
// Create from entries - O(n)
const entries = [
  ['one', 1],
  ['two', 2],
];
const biMap = BiDirectionalMap.fromEntries(entries);

// Convert to object - O(n)
const obj = biMap.toObject();
```

## Examples

### Basic Usage

```typescript
const biMap = new BiDirectionalMap<string, number>();

// Set mappings
biMap.set('one', 1).set('two', 2).set('three', 3);

// Bidirectional lookups
console.log(biMap.get('one')); // 1
console.log(biMap.getKey(2)); // "two"
```

### Handling Duplicate Values

```typescript
const biMap = new BiDirectionalMap<string, number>();

biMap.set('one', 1);
biMap.set('another', 1); // Overwrites previous mapping

console.log(biMap.get('one')); // undefined
console.log(biMap.get('another')); // 1
console.log(biMap.getKey(1)); // "another"
```

### Type-Safe Mappings

```typescript
interface User {
  id: string;
  name: string;
}

const userMap = new BiDirectionalMap<number, User>();

const user: User = { id: '123', name: 'John' };
userMap.set(1, user);

const foundUser = userMap.get(1); // Type: User | undefined
const userId = userMap.getKey(user); // Type: number | undefined
```

### Using as a Registry

```typescript
const registry = new BiDirectionalMap<string, Function>();

// Register handlers
registry.set('save', () => console.log('Saving...'));
registry.set('load', () => console.log('Loading...'));

// Look up by name
const saveHandler = registry.get('save');
if (saveHandler) saveHandler();

// Look up by function
const handlerName = registry.getKey(() => console.log('Loading...'));
```

## Common Use Cases

1. **Identity Mapping**: When you need to maintain two-way relationships between identifiers.
2. **Object Registry**: For systems where you need to look up objects by different identifiers.
3. **State Management**: Managing relationships between states and their string representations.
4. **Cache Systems**: Where bidirectional lookup capabilities are needed.

## Performance Characteristics

All basic operations (set, get, getKey, hasKey, hasValue, deleteKey, deleteValue) have O(1) time complexity. The space complexity is O(n) where n is the number of mappings.

### Core Operation Complexities

- Set: O(1)
- Get/GetKey: O(1)
- HasKey/HasValue: O(1)
- DeleteKey/DeleteValue: O(1)
- Clear: O(1)
- Size: O(1)
- Iteration: O(n)

## Error Cases

The BiDirectionalMap is designed to handle edge cases gracefully:

```typescript
const biMap = new BiDirectionalMap<string, number>();

// Non-existent lookups return undefined
console.log(biMap.get('missing')); // undefined
console.log(biMap.getKey(999)); // undefined

// Delete operations return false for non-existent entries
console.log(biMap.deleteKey('missing')); // false
console.log(biMap.deleteValue(999)); // false
```
