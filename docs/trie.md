# Trie

A generic trie (prefix tree) implementation that efficiently stores and retrieves strings while supporting associated values of type `T`.

## Usage

```typescript
import { Trie } from 'jsr:@mskr/data-structures';

const trie = new Trie<number>();
```

## API Reference

### Properties

- `size: number` - Number of words in the trie
- `isEmpty(): boolean` - Whether the trie is empty

### Methods

#### Adding and Removing Words

```typescript
// Insert word with value - O(m)
trie.insert('hello', 1);

// Remove word - O(m)
const removed = trie.remove('hello');

// Clear all words - O(1)
trie.clear();
```

#### Searching and Retrieval

```typescript
// Search for exact word - O(m)
const value = trie.search('hello');

// Check if word exists - O(m)
const exists = trie.contains('hello');

// Check if prefix exists - O(p)
const hasPrefix = trie.hasPrefix('hel');

// Get all words with prefix - O(n)
const words = trie.getAllWithPrefix('hel');

// Get all entries - O(n)
const entries = trie.entries();
```

## Examples

### Basic Usage with Values

```typescript
const trie = new Trie<number>();

// Insert some words with associated values
trie.insert('hello', 1);
trie.insert('help', 2);
trie.insert('world', 3);

// Search for words
console.log(trie.search('hello')); // 1
console.log(trie.contains('help')); // true
console.log(trie.search('hell')); // null
```

### Case Sensitivity Options

```typescript
// Case-sensitive trie (default)
const sensitiveTrie = new Trie<number>();
sensitiveTrie.insert('Hello', 1);
console.log(sensitiveTrie.search('Hello')); // 1
console.log(sensitiveTrie.search('hello')); // null

// Case-insensitive trie
const insensitiveTrie = new Trie<number>(false);
insensitiveTrie.insert('Hello', 1);
console.log(insensitiveTrie.search('hello')); // 1
console.log(insensitiveTrie.search('HELLO')); // 1
```

### Prefix Operations

```typescript
const trie = new Trie<number>();

// Add some related words
trie.insert('car', 1);
trie.insert('cart', 2);
trie.insert('carpet', 3);

// Check prefix existence
console.log(trie.hasPrefix('car')); // true

// Get all words with prefix
console.log(trie.getAllWithPrefix('car'));
// ["car", "cart", "carpet"]
```

### Custom Value Types

```typescript
interface UserData {
  id: number;
  lastLogin: Date;
}

const userTrie = new Trie<UserData>();

// Store user data by username
userTrie.insert('john_doe', {
  id: 1,
  lastLogin: new Date(),
});

// Retrieve user data
const userData = userTrie.search('john_doe');
if (userData) {
  console.log(userData.id, userData.lastLogin);
}
```

### Working with Entries

```typescript
const trie = new Trie<number>();

// Add some entries
trie.insert('one', 1);
trie.insert('two', 2);
trie.insert('three', 3);

// Get all entries as [word, value] pairs
const entries = trie.entries();
for (const [word, value] of entries) {
  console.log(`${word}: ${value}`);
}
```

## Error Handling

```typescript
const trie = new Trie<number>();

try {
  // Handle empty strings gracefully
  trie.insert('', 1); // No effect
  console.log(trie.search('')); // null

  // Invalid operations return null/false
  console.log(trie.search('nonexistent')); // null
  console.log(trie.remove('nonexistent')); // false
} catch (error) {
  console.error(error);
}
```

## Performance Characteristics

The trie data structure offers several performance advantages:

1. Space Efficiency

   - Shared prefixes use shared storage
   - O(ASUM(m)) space where:
     - A is alphabet size
     - m is length of each word
     - SUM is over all words

2. Time Complexity

   - Word operations: O(m) where m is word length
     - insert
     - search
     - remove
     - contains
   - Prefix operations: O(p + n) where:
     - p is prefix length
     - n is number of matching words
     - getAllWithPrefix
     - entries

3. Key Advantages
   - Fast prefix-based operations
   - Memory-efficient for similar strings
   - Quick exact-match lookups
   - Natural alphabetical ordering
   - No hash collisions

## Implementation Notes

1. Case Sensitivity

   - Optional case-insensitive mode
   - Consistent behavior across operations
   - Configurable at construction time

2. Memory Management

   - Automatic node cleanup on word removal
   - Efficient prefix sharing
   - No circular references

3. Generic Values
   - Supports any value type T
   - Null values handled gracefully
   - Type-safe operations
