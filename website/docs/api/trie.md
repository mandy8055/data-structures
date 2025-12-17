---
id: trie
title: Trie
sidebar_label: Trie
description: Prefix tree for efficient string operations and autocomplete
keywords: [trie, prefix-tree, autocomplete, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# Trie

A generic trie (prefix tree) implementation that efficiently stores and retrieves strings with associated values. Perfect for autocomplete, spell checking, and prefix-based searches.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='Trie' />

## Usage

```typescript
import { Trie } from '@msnkr/data-structures';

const trie = new Trie<number>();
```

## API Reference

### Properties

- `size: number` - Number of words stored in the trie
- `isEmpty(): boolean` - Whether the trie is empty

### Methods

#### Adding and Removing Words

```typescript
// Insert word with associated value - O(m)
trie.insert('hello', 1);

// Remove word - O(m)
const removed = trie.remove('hello');

// Clear all words - O(1)
trie.clear();
```

where `m` is the length of the word

#### Searching and Retrieval

```typescript
// Search for exact word - O(m)
const value = trie.search('hello');

// Check if word exists - O(m)
const exists = trie.contains('hello');

// Check if prefix exists - O(p)
const hasPrefix = trie.hasPrefix('hel');

// Get all words with prefix - O(p + n)
const words = trie.getAllWithPrefix('hel');

// Get all entries as [word, value] pairs - O(n)
const entries = trie.entries();
```

where `p` is prefix length, `n` is number of matching words

## Examples

### Basic Usage with Values

```typescript
const trie = new Trie<number>();

// Insert words with associated values
trie.insert('hello', 1);
trie.insert('help', 2);
trie.insert('world', 3);

// Search for words
console.log(trie.search('hello')); // 1
console.log(trie.contains('help')); // true
console.log(trie.search('hell')); // null (partial word not stored)

console.log(trie.size); // 3
```

### Autocomplete System

```typescript
const autocomplete = new Trie<number>();

// Add words with frequency/score
autocomplete.insert('apple', 100);
autocomplete.insert('application', 85);
autocomplete.insert('apply', 90);
autocomplete.insert('appetite', 75);
autocomplete.insert('banana', 80);

// Get autocomplete suggestions
const suggestions = autocomplete.getAllWithPrefix('app');
console.log(suggestions); // ["apple", "application", "apply", "appetite"]

// Check if prefix is valid
console.log(autocomplete.hasPrefix('ban')); // true
console.log(autocomplete.hasPrefix('xyz')); // false
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
console.log(insensitiveTrie.search('HeLLo')); // 1
```

:::tip Case Sensitivity
Use case-insensitive mode for user-facing features like search and autocomplete to provide better UX.
:::

### Dictionary with Definitions

```typescript
interface Definition {
  meaning: string;
  partOfSpeech: string;
}

const dictionary = new Trie<Definition>();

dictionary.insert('trie', {
  meaning: 'A tree data structure for storing strings',
  partOfSpeech: 'noun',
});

dictionary.insert('algorithm', {
  meaning: 'A step-by-step procedure for solving a problem',
  partOfSpeech: 'noun',
});

const def = dictionary.search('trie');
if (def) {
  console.log(`${def.partOfSpeech}: ${def.meaning}`);
}
```

### IP Address Routing Table

```typescript
interface Route {
  gateway: string;
  metric: number;
}

const routingTable = new Trie<Route>();

// Add routes with IP prefixes
routingTable.insert('192.168.1', { gateway: '192.168.1.1', metric: 10 });
routingTable.insert('192.168', { gateway: '192.168.0.1', metric: 20 });
routingTable.insert('10.0', { gateway: '10.0.0.1', metric: 5 });

// Find most specific route
const route = routingTable.search('192.168.1');
console.log(route); // { gateway: '192.168.1.1', metric: 10 }
```

### Search History with Prefixes

```typescript
const searchHistory = new Trie<Date>();

// Track when searches were performed
searchHistory.insert('javascript', new Date());
searchHistory.insert('java', new Date());
searchHistory.insert('typescript', new Date());
searchHistory.insert('python', new Date());

// Get all searches starting with 'java'
const javaSearches = searchHistory.getAllWithPrefix('java');
console.log(javaSearches); // ["java", "javascript"]
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
// Output:
// one: 1
// two: 2
// three: 3
```

### Phone Directory

```typescript
interface Contact {
  name: string;
  phone: string;
}

const directory = new Trie<Contact>(false); // Case-insensitive

directory.insert('john', { name: 'John Doe', phone: '555-0100' });
directory.insert('jane', { name: 'Jane Smith', phone: '555-0101' });
directory.insert('joe', { name: 'Joe Brown', phone: '555-0102' });

// Search by prefix
const jContacts = directory.getAllWithPrefix('jo');
console.log(jContacts); // ["john", "joe"]
```

## Error Handling

```typescript
const trie = new Trie<number>();

// Empty strings are handled gracefully
trie.insert('', 1); // No effect
console.log(trie.search('')); // null

// Non-existent operations return null/false
console.log(trie.search('nonexistent')); // null
console.log(trie.remove('nonexistent')); // false
console.log(trie.contains('nothere')); // false

// Prefix operations with non-existent prefixes
console.log(trie.hasPrefix('xyz')); // false
console.log(trie.getAllWithPrefix('abc')); // []
```

:::info No Exceptions
Trie methods don't throw exceptions. Search operations return `null` or `false` for non-existent keys.
:::

## Performance Characteristics

| Operation            | Time Complexity | Description                    |
| -------------------- | --------------- | ------------------------------ |
| `insert()`           | O(m)            | Add word with value            |
| `search()`           | O(m)            | Find value for word            |
| `remove()`           | O(m)            | Remove word                    |
| `contains()`         | O(m)            | Check if word exists           |
| `hasPrefix()`        | O(p)            | Check if prefix exists         |
| `getAllWithPrefix()` | O(p + n)        | Get all words with prefix      |
| `entries()`          | O(n * k)        | Get all entries                |
| `clear()`            | O(1)            | Remove all words               |

where:
- `m` = length of word
- `p` = length of prefix
- `n` = number of matching words
- `k` = average word length

**Space Complexity:** O(ALPHABET_SIZE × m × n) where n is number of words

## Implementation Details

### Prefix Sharing

Tries are space-efficient for strings with common prefixes:

```
Words: "car", "cart", "carpet"

Tree structure:
    c
    |
    a
    |
    r (word: "car")
    |
    t (word: "cart")
    |
    p
    |
    e
    |
    t (word: "carpet")
```

The prefix "car" is stored only once and shared by all three words.

### Memory Management

- Nodes are automatically cleaned up when words are removed
- No circular references
- Efficient memory usage with prefix sharing

:::info When to Use Trie
Perfect for:
- **Autocomplete** - Get all words with a prefix
- **Spell checking** - Find similar words
- **IP routing** - Longest prefix matching
- **Dictionary** - Fast word lookups
- **Search suggestions** - Real-time filtering
- **Phone directories** - Prefix-based contact search
:::

:::warning When to Avoid
Consider alternatives when:
- **Few common prefixes** → Use HashMap/Map for better space efficiency
- **Exact matches only** → HashMap is simpler and faster O(1) vs O(m)
- **Need range queries** → Use [SortedMap](./sorted-map)
- **Memory constrained** → HashMap uses less memory without prefix sharing benefits
:::

## Comparison with HashMap

| Feature             | Trie              | HashMap           |
| ------------------- | ----------------- | ----------------- |
| **Exact lookup**    | O(m)              | O(1) average      |
| **Prefix search**   | O(p + n)          | O(n × m) (scan all) |
| **Space (similar words)** | Efficient  | Duplicate storage |
| **Space (unique words)** | Higher overhead | More efficient |
| **Autocomplete**    | Native support    | Requires full scan |

## See Also

- [SortedMap](./sorted-map) - Key-value store with ordered keys
- [BiMap](./bi-map) - Bidirectional map
- [LRUCache](./lru-cache) - Least recently used cache
