---
id: bi-map
title: BiDirectionalMap
sidebar_label: BiMap
description: Bidirektionale Zuordnung mit O(1) Lookups in beide Richtungen
keywords:
  [
    bi-map,
    bidirectional-map,
    two-way-map,
    data-structure,
    typescript,
    javascript,
  ]
---

import InstallTabs from '@site/src/components/InstallTabs';

# BiDirectionalMap

Eine bidirektionale Map (BiMap) hält eine Eins-zu-Eins-Zuordnung zwischen Schlüsseln und Werten aufrecht und ermöglicht effiziente O(1) Lookups in beide Richtungen.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='BiDirectionalMap' />

## Verwendung

```typescript
import { BiDirectionalMap } from '@msnkr/data-structures';

const biMap = new BiDirectionalMap<string, number>();
```

## API-Referenz

### Eigenschaften

- `size: number` - Anzahl der Schlüssel-Wert-Paare in der Map

### Methoden

#### Setzen und Abrufen von Elementen

```typescript
// Schlüssel-Wert-Paar setzen - O(1)
biMap.set('one', 1);

// Wert nach Schlüssel abrufen - O(1)
const value = biMap.get('one');

// Schlüssel nach Wert abrufen - O(1)
const key = biMap.getKey(1);
```

:::tip Bidirektionale Lookups
Anders als bei normalen Maps ermöglicht BiMap effiziente Lookups nach Werten in O(1) Zeit, um Schlüssel zu finden.
:::

#### Existenz prüfen

```typescript
// Schlüssel prüfen - O(1)
const hasKey = biMap.hasKey('one');

// Wert prüfen - O(1)
const hasValue = biMap.hasValue(1);
```

#### Elemente löschen

```typescript
// Nach Schlüssel löschen - O(1)
const removedByKey = biMap.deleteKey('one');

// Nach Wert löschen - O(1)
const removedByValue = biMap.deleteValue(1);

// Alle Zuordnungen löschen - O(1)
biMap.clear();
```

#### Iteration

```typescript
// Über alle Schlüssel iterieren
for (const key of biMap.keys()) {
  console.log(key);
}

// Über alle Werte iterieren
for (const value of biMap.values()) {
  console.log(value);
}

// Über alle Einträge iterieren
for (const [key, value] of biMap.entries()) {
  console.log(`${key} => ${value}`);
}

// forEach verwenden
biMap.forEach((value, key, map) => {
  console.log(`${key} bildet ab auf ${value}`);
});
```

#### Hilfsmethoden

```typescript
// Aus Einträgen erstellen - O(n)
const entries: [string, number][] = [
  ['one', 1],
  ['two', 2],
];
const biMap = BiDirectionalMap.fromEntries(entries);

// In Objekt konvertieren - O(n)
const obj = biMap.toObject();
```

## Beispiele

### Grundlegende Verwendung

```typescript
const biMap = new BiDirectionalMap<string, number>();

// Zuordnungen setzen (unterstützt Verkettung)
biMap.set('one', 1).set('two', 2).set('three', 3);

// Bidirektionale Lookups
console.log(biMap.get('one')); // 1
console.log(biMap.getKey(2)); // "two"

console.log(biMap.hasKey('three')); // true
console.log(biMap.hasValue(1)); // true
```

### HTTP-Statuscode-Zuordnung

```typescript
const statusCodes = new BiDirectionalMap<number, string>();

statusCodes.set(200, 'OK');
statusCodes.set(404, 'Not Found');
statusCodes.set(500, 'Internal Server Error');

// Nach Code suchen
console.log(statusCodes.get(404)); // "Not Found"

// Nach Nachricht suchen
console.log(statusCodes.getKey('OK')); // 200
```

### Ländercode-Verzeichnis

```typescript
const countryCodes = new BiDirectionalMap<string, string>();

countryCodes.set('US', 'United States');
countryCodes.set('GB', 'United Kingdom');
countryCodes.set('FR', 'France');

// Name nach Code abrufen
console.log(countryCodes.get('US')); // "United States"

// Code nach Name abrufen
console.log(countryCodes.getKey('France')); // "FR"
```

### Umgang mit doppelten Werten (Eins-zu-Eins-Beschränkung)

```typescript
const biMap = new BiDirectionalMap<string, number>();

biMap.set('one', 1);
biMap.set('another', 1); // Überschreibt vorherige Zuordnung

console.log(biMap.get('one')); // undefined (Zuordnung entfernt)
console.log(biMap.get('another')); // 1
console.log(biMap.getKey(1)); // "another"

console.log(biMap.size); // 1 (nur eine Zuordnung existiert)
```

:::caution Eins-zu-Eins-Beschränkung
BiMap erzwingt Eins-zu-Eins-Zuordnungen. Das Setzen eines Schlüssels mit einem bereits existierenden Wert entfernt das vorherige Schlüssel-Wert-Paar.
:::

### Benutzer-ID zu Benutzername-Zuordnung

```typescript
const userRegistry = new BiDirectionalMap<number, string>();

// Benutzer registrieren
userRegistry.set(1, 'alice');
userRegistry.set(2, 'bob');
userRegistry.set(3, 'charlie');

// Benutzername nach ID suchen
const username = userRegistry.get(2); // "bob"

// ID nach Benutzername suchen
const userId = userRegistry.getKey('alice'); // 1

// Prüfen ob Benutzername vergeben ist
if (userRegistry.hasValue('newuser')) {
  console.log('Benutzername bereits vergeben!');
}
```

### Sprachübersetzung

```typescript
const translations = new BiDirectionalMap<string, string>();

translations.set('hello', 'hallo');
translations.set('goodbye', 'auf wiedersehen');
translations.set('thank you', 'danke');

// Englisch zu Deutsch
console.log(translations.get('hello')); // "hallo"

// Deutsch zu Englisch
console.log(translations.getKey('auf wiedersehen')); // "goodbye"
```

## Zeitkomplexität

| Operation   | Durchschnitt | Schlimmstenfalls |
| ----------- | ------------ | ---------------- |
| set         | O(1)         | O(1)             |
| get         | O(1)         | O(1)             |
| getKey      | O(1)         | O(1)             |
| hasKey      | O(1)         | O(1)             |
| hasValue    | O(1)         | O(1)             |
| deleteKey   | O(1)         | O(1)             |
| deleteValue | O(1)         | O(1)             |
| clear       | O(1)         | O(1)             |

## Best Practices

### Wann BiMap verwenden

- ✅ Bidirektionale Lookups erforderlich (Schlüssel zu Wert und Wert zu Schlüssel)
- ✅ Eins-zu-Eins-Beziehung zwischen Schlüsseln und Werten
- ✅ Häufige Reverse-Lookup-Operationen
- ✅ Pflege eindeutiger Identifier-Zuordnungen

### Wann BiMap nicht verwenden

- ❌ Ein Schlüssel kann mehrere Werte haben
- ❌ Nur Einweg-Lookups erforderlich
- ❌ Werte müssen nicht eindeutig sein

## Verwandte Datenstrukturen

- **Map** - Einweg-Schlüssel-Wert-Zuordnung, erlaubt doppelte Werte
- **Set** - Sammlung eindeutiger Werte ohne Schlüssel-Wert-Paare
- **SortedMap** - Nach Schlüsseln sortierte Map

## TypeScript-Tipps

```typescript
// Generics für Typsicherheit verwenden
const stringToNumber = new BiDirectionalMap<string, number>();
stringToNumber.set('one', 1);

// Typprüfung
const value: number | undefined = stringToNumber.get('one');
const key: string | undefined = stringToNumber.getKey(1);

// Interface-Unterstützung
interface User {
  id: number;
  username: string;
}

const userMap = new BiDirectionalMap<number, User>();
userMap.set(1, { id: 1, username: 'alice' });
```
