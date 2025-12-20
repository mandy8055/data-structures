---
id: case-insensitive-sorting
title: Case-Insensitive Sorting
sidebar_label: Case-Insensitive Sorting
description: Sort strings case-insensitively with RedBlackTree
keywords: [red-black-tree, sorting, case-insensitive, strings, example]
---

# Case-Insensitive String Sorting

Sort strings in case-insensitive alphabetical order.

## Implementation

```typescript
import { RedBlackTree } from '@msnkr/data-structures';

// Case-insensitive comparator
const names = new RedBlackTree<string>({
  comparator: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
});

// Add names with mixed case
names.insert('Charlie');
names.insert('alice');
names.insert('BOB');
names.insert('David');

// Iterate in case-insensitive alphabetical order
for (const name of names) {
  console.log(name);
}
```

## Output

```
alice
BOB
Charlie
David
```

## With Original Case Preserved

```typescript
interface CaseInsensitiveString {
  original: string;
  lowercase: string;
}

const sortedNames = new RedBlackTree<CaseInsensitiveString>({
  comparator: (a, b) => a.lowercase.localeCompare(b.lowercase),
});

function addName(name: string): void {
  sortedNames.insert({
    original: name,
    lowercase: name.toLowerCase(),
  });
}

addName('Charlie');
addName('alice');
addName('BOB');

for (const item of sortedNames) {
  console.log(item.original);
}
// Output: alice, BOB, Charlie
```

## Search Case-Insensitively

```typescript
function searchName(name: string): boolean {
  const searchTerm = {
    original: name,
    lowercase: name.toLowerCase(),
  };
  return sortedNames.contains(searchTerm);
}

console.log(searchName('bob')); // true
console.log(searchName('BOB')); // true
console.log(searchName('Bob')); // true
console.log(searchName('bobby')); // false
```

## See Also

- [RedBlackTree API Reference](../api/red-black-tree.md)
- [Trie](../api/trie.md) - For case-insensitive prefix matching
