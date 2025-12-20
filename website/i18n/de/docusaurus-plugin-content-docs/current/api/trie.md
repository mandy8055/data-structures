---
id: trie
title: Trie
sidebar_label: Trie
description: Präfixbaum für effiziente String-Operationen und Autovervollständigung
keywords:
  [trie, prefix-tree, autocomplete, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# Trie

Generische Trie (Präfixbaum) Implementierung zum effizienten Speichern und Abrufen von Strings mit zugehörigen Werten. Ideal für Autovervollständigung, Rechtschreibprüfung und präfixbasierte Suche.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='Trie' />

## Verwendung

```typescript
import { Trie } from '@msnkr/data-structures';

const trie = new Trie<number>();
```

## API-Referenz

### Eigenschaften

- `size: number` - Anzahl der im Trie gespeicherten Wörter
- `isEmpty(): boolean` - Ob der Trie leer ist

### Methoden

#### Wörter hinzufügen und entfernen

```typescript
// Wort mit zugehörigem Wert einfügen - O(m)
trie.insert('hello', 1);

// Wort entfernen - O(m)
const removed = trie.remove('hello');

// Alle Wörter löschen - O(1)
trie.clear();
```

Wobei `m` die Länge des Wortes ist

#### Suchen und Abrufen

```typescript
// Nach exaktem Wort suchen - O(m)
const value = trie.search('hello');

// Prüfen ob Wort existiert - O(m)
const exists = trie.contains('hello');

// Prüfen ob Präfix existiert - O(p)
const hasPrefix = trie.hasPrefix('hel');

// Alle Wörter mit Präfix abrufen - O(p + n)
const words = trie.getAllWithPrefix('hel');

// Alle Einträge als [Wort, Wert] Paare abrufen - O(n)
const entries = trie.entries();
```

Wobei `p` die Präfixlänge und `n` die Anzahl der übereinstimmenden Wörter ist

## Beispiele

### Grundlegende Verwendung mit Werten

```typescript
const trie = new Trie<number>();

// Wörter mit zugehörigen Werten einfügen
trie.insert('hello', 1);
trie.insert('help', 2);
trie.insert('world', 3);

// Nach Wörtern suchen
console.log(trie.search('hello')); // 1
console.log(trie.contains('help')); // true
console.log(trie.search('hell')); // null (Teilwort nicht gespeichert)

console.log(trie.size); // 3
```

### Autovervollständigungs-System

```typescript
const autocomplete = new Trie<number>();

// Wörter mit Häufigkeit/Bewertung hinzufügen
autocomplete.insert('apple', 100);
autocomplete.insert('application', 85);
autocomplete.insert('apply', 90);
autocomplete.insert('appetite', 75);
autocomplete.insert('banana', 80);

// Autovervollständigungs-Vorschläge abrufen
const suggestions = autocomplete.getAllWithPrefix('app');
console.log(suggestions); // ["apple", "application", "apply", "appetite"]

// Prüfen ob Präfix gültig ist
console.log(autocomplete.hasPrefix('ban')); // true
console.log(autocomplete.hasPrefix('xyz')); // false
```

### Groß-/Kleinschreibung-Sensitivitäts-Option

```typescript
// Groß-/Kleinschreibung-sensitiver Trie (Standard)
const sensitiveTrie = new Trie<number>();
sensitiveTrie.insert('Hello', 1);
console.log(sensitiveTrie.search('Hello')); // 1
console.log(sensitiveTrie.search('hello')); // null

// Groß-/Kleinschreibung-insensitiver Trie
const insensitiveTrie = new Trie<number>(false);
insensitiveTrie.insert('Hello', 1);
console.log(insensitiveTrie.search('hello')); // 1
console.log(insensitiveTrie.search('HELLO')); // 1
console.log(insensitiveTrie.search('HeLLo')); // 1
```

:::tip Groß-/Kleinschreibung-Sensitivität
Für benutzerorientierte Funktionen wie Suche und Autovervollständigung verwenden Sie den Groß-/Kleinschreibung-insensitiven Modus für eine bessere Benutzererfahrung.
:::

### Wörterbuch mit Definitionen

```typescript
interface Definition {
  meaning: string;
  partOfSpeech: string;
}

const dictionary = new Trie<Definition>();

dictionary.insert('trie', {
  meaning: 'Baumartige Datenstruktur zum Speichern von Strings',
  partOfSpeech: 'Substantiv',
});

dictionary.insert('algorithm', {
  meaning: 'Schrittweiser Prozess zur Lösung eines Problems',
  partOfSpeech: 'Substantiv',
});

const def = dictionary.search('trie');
if (def) {
  console.log(`${def.partOfSpeech}: ${def.meaning}`);
}
```

### IP-Adressen-Routing-Tabelle

```typescript
interface Route {
  gateway: string;
  metric: number;
}

const routingTable = new Trie<Route>();

// Routen mit IP-Präfixen hinzufügen
routingTable.insert('192.168.1', { gateway: '192.168.1.1', metric: 10 });
routingTable.insert('192.168', { gateway: '192.168.0.1', metric: 20 });
routingTable.insert('10.0', { gateway: '10.0.0.1', metric: 5 });

// Spezifischste Route finden
const route = routingTable.search('192.168.1');
console.log(route); // { gateway: '192.168.1.1', metric: 10 }
```

### Suchverlauf mit Präfixen

```typescript
const searchHistory = new Trie<Date>();

// Verfolgen wann Suchen durchgeführt wurden
searchHistory.insert('javascript', new Date());
searchHistory.insert('java', new Date());
searchHistory.insert('typescript', new Date());
searchHistory.insert('python', new Date());

// Alle Suchen abrufen die mit 'java' beginnen
const javaSearches = searchHistory.getAllWithPrefix('java');
console.log(javaSearches); // ["java", "javascript"]
```

### Arbeiten mit Einträgen

```typescript
const trie = new Trie<number>();

trie.insert('apple', 1);
trie.insert('banana', 2);
trie.insert('cherry', 3);

// Alle Einträge abrufen
const entries = trie.entries();
console.log(entries);
// [['apple', 1], ['banana', 2], ['cherry', 3]]

// Über Einträge iterieren
for (const [word, value] of entries) {
  console.log(`${word}: ${value}`);
}
```

### Rechtschreibprüfer

```typescript
const spellChecker = new Trie<boolean>(false); // Groß-/Kleinschreibung-insensitiv

// Wörterbuch laden
const validWords = [
  'the',
  'quick',
  'brown',
  'fox',
  'jumps',
  'over',
  'lazy',
  'dog',
];
validWords.forEach((word) => spellChecker.insert(word, true));

function checkSpelling(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const misspelled: string[] = [];

  for (const word of words) {
    if (!spellChecker.contains(word)) {
      misspelled.push(word);
    }
  }

  return misspelled;
}

const text = 'The quik brown fox jumps over the lasy dog';
console.log('Rechtschreibfehler:', checkSpelling(text)); // ['quik', 'lasy']
```

### Telefonnummern-Präfix-Matching

```typescript
interface Contact {
  name: string;
  number: string;
}

const phonebook = new Trie<Contact>();

phonebook.insert('555-0100', { name: 'Alice', number: '555-0100' });
phonebook.insert('555-0101', { name: 'Bob', number: '555-0101' });
phonebook.insert('555-0200', { name: 'Charlie', number: '555-0200' });
phonebook.insert('556-0100', { name: 'David', number: '556-0100' });

// Kontakte nach Präfix finden
const matches = phonebook.getAllWithPrefix('555-01');
console.log(matches); // ['555-0100', '555-0101']
```

### Dateipfad-Indizierung

```typescript
interface FileInfo {
  size: number;
  lastModified: Date;
}

const fileIndex = new Trie<FileInfo>();

fileIndex.insert('/home/user/documents/report.pdf', {
  size: 1024,
  lastModified: new Date(),
});

fileIndex.insert('/home/user/documents/notes.txt', {
  size: 512,
  lastModified: new Date(),
});

fileIndex.insert('/home/user/pictures/photo.jpg', {
  size: 2048,
  lastModified: new Date(),
});

// Alle Dateien in einem Verzeichnis finden
const docFiles = fileIndex.getAllWithPrefix('/home/user/documents/');
console.log('Dokumentdateien:', docFiles);
// ['/home/user/documents/report.pdf', '/home/user/documents/notes.txt']
```

### URL-Router

```typescript
interface RouteHandler {
  handler: string;
  method: string;
}

const router = new Trie<RouteHandler>();

router.insert('/api/users', { handler: 'getUsers', method: 'GET' });
router.insert('/api/users/create', { handler: 'createUser', method: 'POST' });
router.insert('/api/posts', { handler: 'getPosts', method: 'GET' });

function matchRoute(path: string): RouteHandler | null {
  return router.search(path);
}

console.log(matchRoute('/api/users')); // { handler: 'getUsers', method: 'GET' }
console.log(matchRoute('/api/posts')); // { handler: 'getPosts', method: 'GET' }
```

### Befehls-Vervollständigungs-System

```typescript
interface Command {
  description: string;
  usage: string;
}

const cli = new Trie<Command>();

cli.insert('git commit', {
  description: 'Änderungen am Repository aufzeichnen',
  usage: 'git commit -m "message"',
});

cli.insert('git checkout', {
  description: 'Branches wechseln',
  usage: 'git checkout <branch>',
});

cli.insert('git clone', {
  description: 'Repository klonen',
  usage: 'git clone <url>',
});

cli.insert('git config', {
  description: 'Konfiguration setzen',
  usage: 'git config <key> <value>',
});

// Befehls-Vervollständigungen bereitstellen
function autocompleteCommand(partial: string): string[] {
  return cli.getAllWithPrefix(partial);
}

console.log(autocompleteCommand('git c'));
// ['git checkout', 'git clone', 'git commit', 'git config']
```

## Zeitkomplexität

| Operation        | Durchschnitt | Schlimmstenfalls |
| ---------------- | ------------ | ---------------- |
| insert           | O(m)         | O(m)             |
| remove           | O(m)         | O(m)             |
| search           | O(m)         | O(m)             |
| contains         | O(m)         | O(m)             |
| hasPrefix        | O(p)         | O(p)             |
| getAllWithPrefix | O(p + n)     | O(p + n)         |
| clear            | O(1)         | O(1)             |

Wobei:

- `m` = Wortlänge
- `p` = Präfixlänge
- `n` = Anzahl übereinstimmender Wörter

## Raumkomplexität

- **Schlimmster Fall**: O(ALPHABET_SIZE × N × M)
  - Wobei N = Anzahl Wörter, M = durchschnittliche Wortlänge
- **Bester Fall**: O(N × M) wenn Wörter gemeinsame Präfixe teilen

## Vergleich mit anderen Datenstrukturen

| Merkmal      | Trie    | Set       | Map       |
| ------------ | ------- | --------- | --------- |
| Exakte Suche | O(m)    | O(1) avg  | O(1) avg  |
| Präfixsuche  | O(p)    | O(n)      | O(n)      |
| Autovervollständigung | ✅ Effizient | ❌ Ineffizient | ❌ Ineffizient |
| Speichernutzung | Höher | Niedriger | Niedriger |
| Präfix-Sharing | ✅ Ja | ❌ Nein   | ❌ Nein   |

## Best Practices

### Wann Trie verwenden

- ✅ Autovervollständigungs-Funktionen
- ✅ Rechtschreibprüfung und -korrektur
- ✅ IP-Routing-Tabellen
- ✅ Telefonbuch-Präfix-Matching
- ✅ Suchvorschläge
- ✅ Wörterbuch-Implementierungen
- ✅ URL-Routing
- ✅ Wortspiele (z.B. Scrabble, Kreuzworträtsel)

### Wann Trie nicht verwenden

- ❌ Nur exakte Übereinstimmungen erforderlich (verwenden Sie Set oder Map)
- ❌ Speicherbeschränkt (verwenden Sie komprimierte Trie-Varianten)
- ❌ Selten oder nie Präfixsuchen
- ❌ Umgang mit Nicht-String-Daten

### Optimierungs-Tipps

```typescript
// Für große Datensätze Groß-/Kleinschreibung-insensitiv verwenden um Speicher zu sparen
const trie = new Trie<number>(false);

// Einfügungen stapeln für bessere Leistung
const words = ['word1', 'word2', 'word3'];
words.forEach((word) => trie.insert(word, 1));

// Alte Einträge entfernen wenn nicht mehr benötigt um Speicher freizugeben
trie.remove('obsolete-word');
```

## Verwandte Datenstrukturen

- **Set** - Sammlung eindeutiger Werte ohne Präfixsuche
- **Map** - Schlüssel-Wert-Speicher ohne Präfixsuche
- **RedBlackTree** - Sortierte eindeutige Werte ohne Präfixsuche
- **Compressed Trie/Radix Tree** - Speicheroptimierte Trie-Variante
