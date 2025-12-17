---
id: bi-map
title: BiDirectionalMap
sidebar_label: BiMap
description: Bidirectional map with O(1) lookups in both directions
keywords: [bi-map, bidirectional-map, two-way-map, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# BiDirectionalMap

A bidirectional map (BiMap) that maintains one-to-one mappings between keys and values, allowing efficient O(1) lookups in both directions.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='BiDirectionalMap' />

## Usage

```typescript
import { BiDirectionalMap } from '@msnkr/data-structures';

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

:::tip Bidirectional Lookups
Unlike regular maps, BiMap allows you to look up keys by values efficiently in O(1) time.
:::

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
const removedByKey = biMap.deleteKey('one');

// Remove by value - O(1)
const removedByValue = biMap.deleteValue(1);

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
const entries: [string, number][] = [
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

// Set mappings (chainable)
biMap.set('one', 1).set('two', 2).set('three', 3);

// Bidirectional lookups
console.log(biMap.get('one')); // 1
console.log(biMap.getKey(2)); // "two"

console.log(biMap.hasKey('three')); // true
console.log(biMap.hasValue(1)); // true
```

### HTTP Status Code Mapping

```typescript
const statusCodes = new BiDirectionalMap<number, string>();

statusCodes.set(200, 'OK');
statusCodes.set(404, 'Not Found');
statusCodes.set(500, 'Internal Server Error');

// Look up by code
console.log(statusCodes.get(404)); // "Not Found"

// Look up by message
console.log(statusCodes.getKey('OK')); // 200
```

### Country Code Registry

```typescript
const countryCodes = new BiDirectionalMap<string, string>();

countryCodes.set('US', 'United States');
countryCodes.set('GB', 'United Kingdom');
countryCodes.set('FR', 'France');

// Get country name by code
console.log(countryCodes.get('US')); // "United States"

// Get country code by name
console.log(countryCodes.getKey('France')); // "FR"
```

### Handling Duplicate Values (One-to-One Constraint)

```typescript
const biMap = new BiDirectionalMap<string, number>();

biMap.set('one', 1);
biMap.set('another', 1); // Overwrites previous mapping

console.log(biMap.get('one')); // undefined (mapping removed)
console.log(biMap.get('another')); // 1
console.log(biMap.getKey(1)); // "another"

console.log(biMap.size); // 1 (only one mapping exists)
```

:::caution One-to-One Constraint
BiMap enforces one-to-one mappings. Setting a key with an existing value removes the previous key-value pair.
:::

### User ID to Username Mapping

```typescript
const userRegistry = new BiDirectionalMap<number, string>();

// Register users
userRegistry.set(1, 'alice');
userRegistry.set(2, 'bob');
userRegistry.set(3, 'charlie');

// Find username by ID
const username = userRegistry.get(2); // "bob"

// Find ID by username
const userId = userRegistry.getKey('alice'); // 1

// Check if username is taken
if (userRegistry.hasValue('newuser')) {
  console.log('Username already taken!');
}
```

### Enum-Like Bidirectional Mapping

```typescript
const permissions = new BiDirectionalMap<string, number>();

permissions.set('READ', 1);
permissions.set('WRITE', 2);
permissions.set('DELETE', 4);
permissions.set('ADMIN', 8);

// Permission name to value
const writePermission = permissions.get('WRITE'); // 2

// Permission value to name
const permissionName = permissions.getKey(4); // "DELETE"
```

### Type-Safe Object Registry

```typescript
interface Handler {
  handle: (data: unknown) => void;
}

const handlerRegistry = new BiDirectionalMap<string, Handler>();

const saveHandler: Handler = { handle: (d) => console.log('Saving', d) };
const loadHandler: Handler = { handle: (d) => console.log('Loading', d) };

// Register handlers
handlerRegistry.set('save', saveHandler);
handlerRegistry.set('load', loadHandler);

// Look up handler by name
const handler = handlerRegistry.get('save');
if (handler) handler.handle({ id: 1 });

// Look up name by handler reference
const handlerName = handlerRegistry.getKey(saveHandler); // "save"
```

### Database ID to Entity Mapping

```typescript
interface Entity {
  id: number;
  name: string;
}

const entityCache = new BiDirectionalMap<number, Entity>();

const entity1: Entity = { id: 101, name: 'Product A' };
const entity2: Entity = { id: 102, name: 'Product B' };

entityCache.set(101, entity1);
entityCache.set(102, entity2);

// Find entity by ID
const product = entityCache.get(101); // Entity { id: 101, name: 'Product A' }

// Find ID by entity reference
const productId = entityCache.getKey(entity2); // 102
```

### Create from Entries

```typescript
const colorMap = BiDirectionalMap.fromEntries<string, string>([
  ['red', '#FF0000'],
  ['green', '#00FF00'],
  ['blue', '#0000FF'],
]);

console.log(colorMap.get('red')); // "#FF0000"
console.log(colorMap.getKey('#00FF00')); // "green"
```

## Error Handling

```typescript
const biMap = new BiDirectionalMap<string, number>();

// Non-existent lookups return undefined
console.log(biMap.get('missing')); // undefined
console.log(biMap.getKey(999)); // undefined

// Check operations return false
console.log(biMap.hasKey('missing')); // false
console.log(biMap.hasValue(999)); // false

// Delete operations return false for non-existent entries
console.log(biMap.deleteKey('missing')); // false
console.log(biMap.deleteValue(999)); // false
```

:::info No Exceptions
BiMap methods don't throw exceptions. Lookups return `undefined` and deletions return `false` for non-existent entries.
:::

## Performance Characteristics

| Operation      | Time Complexity | Description                        |
| -------------- | --------------- | ---------------------------------- |
| `set()`        | O(1)            | Add/update key-value pair          |
| `get()`        | O(1)            | Get value by key                   |
| `getKey()`     | O(1)            | Get key by value                   |
| `hasKey()`     | O(1)            | Check if key exists                |
| `hasValue()`   | O(1)            | Check if value exists              |
| `deleteKey()`  | O(1)            | Remove by key                      |
| `deleteValue()` | O(1)           | Remove by value                    |
| `clear()`      | O(1)            | Remove all mappings                |
| `keys()`       | O(n)            | Get all keys                       |
| `values()`     | O(n)            | Get all values                     |
| `entries()`    | O(n)            | Get all entries                    |

**Space Complexity:** O(2n) - maintains two internal maps (key→value and value→key)

## Implementation Details

### Internal Structure

- Maintains **two HashMap instances**:
  - `keyToValue`: Maps keys to values
  - `valueToKey`: Maps values to keys
- All operations update both maps to maintain consistency
- Enforces one-to-one constraint automatically

### One-to-One Enforcement

When setting a key-value pair:
1. If the key already exists with a different value, the old value mapping is removed
2. If the value already exists with a different key, the old key mapping is removed
3. Both internal maps are updated consistently

:::info When to Use BiDirectionalMap
Perfect for:
- **HTTP status codes** - Code ↔ Message mappings
- **Country codes** - Code ↔ Country name
- **User registries** - ID ↔ Username
- **Enum-like mappings** - Name ↔ Value
- **Object registries** - Name ↔ Handler/Entity
- **Language translations** - Key ↔ Translation
:::

:::warning When to Avoid
Consider alternatives when:
- **Don't need reverse lookups** → Use regular Map (less memory)
- **Need one-to-many** → Use `Map<K, Set<V>>`
- **Need many-to-many** → Use custom structure or graph
- **Values aren't unique** → BiMap requires unique values
:::

## Comparison with Regular Map

| Feature             | BiDirectionalMap           | Map                     |
| ------------------- | -------------------------- | ----------------------- |
| **Key → Value**     | O(1)                       | O(1)                    |
| **Value → Key**     | O(1)                       | O(n) (must scan)        |
| **Memory**          | 2× (two maps)              | 1× (one map)            |
| **Uniqueness**      | Keys AND values unique     | Only keys unique        |
| **Use case**        | Bidirectional lookups      | One-way lookups         |

## See Also

- [SortedMap](./sorted-map) - Key-value store with ordered keys
- [LRUCache](./lru-cache) - Cache with automatic eviction
- [Trie](./trie) - Prefix tree for string keys
