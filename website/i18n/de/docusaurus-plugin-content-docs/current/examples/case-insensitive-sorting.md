---
id: case-insensitive-sorting
title: Case-Insensitive Sorting
sidebar_label: Case-Insensitive Sorting
description: Zeichenketten unabhängig von Groß-/Kleinschreibung mit RedBlackTree sortieren
keywords: [red-black-tree, sorting, case-insensitive, strings, example]
---

# Case-Insensitive String Sorting

Sortieren Sie Zeichenketten in unabhängig von Groß-/Kleinschreibung alphabetischer Reihenfolge.

## Implementierung

```typescript
import { RedBlackTree } from '@msnkr/data-structures';

// Case-insensitive Comparator
const names = new RedBlackTree<string>({
  comparator: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
});

// Namen mit gemischter Groß-/Kleinschreibung hinzufügen
names.insert('Charlie');
names.insert('alice');
names.insert('BOB');
names.insert('David');

// In unabhängig von Groß-/Kleinschreibung alphabetischer Reihenfolge iterieren
for (const name of names) {
  console.log(name);
}
```

## Ausgabe

```
alice
BOB
Charlie
David
```

## Mit erhaltener Original-Groß-/Kleinschreibung

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
// Ausgabe: alice, BOB, Charlie
```

## Suche unabhängig von Groß-/Kleinschreibung

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

## Siehe auch

- [RedBlackTree API-Referenz](../api/red-black-tree.md)
- [Trie](../api/trie.md) - Für Präfix-Matching unabhängig von Groß-/Kleinschreibung
