---
id: autocomplete-trie
title: Autocomplete System
sidebar_label: Autocomplete System
description: Build an autocomplete feature using Trie for fast prefix matching
keywords: [trie, autocomplete, search, prefix, example]
---

# Autocomplete System with Trie

Implement fast autocomplete suggestions using a Trie data structure.

## Implementation

```typescript
import { Trie } from '@msnkr/data-structures';

// Store words with frequency scores
const autocomplete = new Trie<number>();

// Add words with their popularity scores
autocomplete.insert('apple', 100);
autocomplete.insert('application', 85);
autocomplete.insert('apply', 90);
autocomplete.insert('appetite', 75);
autocomplete.insert('banana', 80);

// Get autocomplete suggestions
function getSuggestions(prefix: string): string[] {
  if (!autocomplete.hasPrefix(prefix)) {
    return [];
  }
  return autocomplete.getAllWithPrefix(prefix);
}

// Usage
console.log(getSuggestions('app'));
// Output: ["apple", "application", "apply", "appetite"]

console.log(getSuggestions('ban'));
// Output: ["banana"]

console.log(getSuggestions('xyz'));
// Output: []
```

## With Ranked Results

```typescript
interface SearchResult {
  word: string;
  score: number;
}

function getRankedSuggestions(prefix: string, limit = 5): SearchResult[] {
  const words = autocomplete.getAllWithPrefix(prefix);

  return words
    .map((word) => ({
      word,
      score: autocomplete.search(word) || 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

console.log(getRankedSuggestions('app', 3));
// Output: [
//   { word: "apple", score: 100 },
//   { word: "apply", score: 90 },
//   { word: "application", score: 85 }
// ]
```

## Case-Insensitive Mode

```typescript
// For user-facing search
const searchTrie = new Trie<number>(false); // case-insensitive

searchTrie.insert('JavaScript', 100);
console.log(searchTrie.search('javascript')); // 100
console.log(searchTrie.search('JAVASCRIPT')); // 100
```

## See Also

- [Trie API Reference](../api/trie.md)
