---
id: autocomplete-trie
title: Autocomplete System
sidebar_label: Autocomplete System
description: Eine Autocomplete-Funktion mit Trie für schnelles Präfix-Matching erstellen
keywords: [trie, autocomplete, search, prefix, example]
---

# Autocomplete System mit Trie

Implementieren Sie schnelle Autocomplete-Vorschläge mit einer Trie-Datenstruktur.

## Implementierung

```typescript
import { Trie } from '@msnkr/data-structures';

// Wörter mit Häufigkeitsbewertungen speichern
const autocomplete = new Trie<number>();

// Wörter mit ihren Beliebtheitsbewertungen hinzufügen
autocomplete.insert('apple', 100);
autocomplete.insert('application', 85);
autocomplete.insert('apply', 90);
autocomplete.insert('appetite', 75);
autocomplete.insert('banana', 80);

// Autocomplete-Vorschläge abrufen
function getSuggestions(prefix: string): string[] {
  if (!autocomplete.hasPrefix(prefix)) {
    return [];
  }
  return autocomplete.getAllWithPrefix(prefix);
}

// Verwendung
console.log(getSuggestions('app'));
// Ausgabe: ["apple", "application", "apply", "appetite"]

console.log(getSuggestions('ban'));
// Ausgabe: ["banana"]

console.log(getSuggestions('xyz'));
// Ausgabe: []
```

## Mit rangordneten Ergebnissen

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
// Ausgabe: [
//   { word: "apple", score: 100 },
//   { word: "apply", score: 90 },
//   { word: "application", score: 85 }
// ]
```

## Case-Insensitive Modus

```typescript
// Für benutzerorientierte Suche
const searchTrie = new Trie<number>(false); // case-insensitive

searchTrie.insert('JavaScript', 100);
console.log(searchTrie.search('javascript')); // 100
console.log(searchTrie.search('JAVASCRIPT')); // 100
```

## Siehe auch

- [Trie API-Referenz](../api/trie.md)
