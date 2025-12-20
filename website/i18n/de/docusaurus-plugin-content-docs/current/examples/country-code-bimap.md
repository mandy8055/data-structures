---
id: country-code-bimap
title: Country Code Registry
sidebar_label: Country Code Registry
description: Bidirektionale Zuordnung von Ländernamen zu Codes mit BiMap
keywords: [bimap, country, code, mapping, example]
---

# Country Code Registry mit BiMap

Bidirektionale Zuordnung zwischen Ländercodes und Namen.

## Implementierung

```typescript
import { BiDirectionalMap } from '@msnkr/data-structures';

const countryCodes = new BiDirectionalMap<string, string>();

// Länder registrieren
countryCodes.set('US', 'United States');
countryCodes.set('GB', 'United Kingdom');
countryCodes.set('FR', 'France');
countryCodes.set('DE', 'Germany');
countryCodes.set('JP', 'Japan');

// Nach Code suchen
console.log(countryCodes.get('US')); // "United States"

// Nach Namen suchen (Rückwärtssuche in O(1)!)
console.log(countryCodes.getKey('France')); // "FR"

// Existenz prüfen
console.log(countryCodes.hasKey('JP')); // true
console.log(countryCodes.hasValue('Canada')); // false
```

## Validierung

```typescript
function validateCountryCode(code: string): boolean {
  return countryCodes.hasKey(code);
}

function getCountryName(code: string): string | undefined {
  return countryCodes.get(code);
}

function findCountryCode(name: string): string | undefined {
  return countryCodes.getKey(name);
}

console.log(validateCountryCode('US')); // true
console.log(getCountryName('FR')); // "France"
console.log(findCountryCode('Japan')); // "JP"
```

## Über alle Länder iterieren

```typescript
console.log('All countries:');
for (const [code, name] of countryCodes.entries()) {
  console.log(`${code}: ${name}`);
}

// Ausgabe:
// US: United States
// GB: United Kingdom
// FR: France
// DE: Germany
// JP: Japan
```

## Siehe auch

- [BiMap API-Referenz](../api/bi-map.md)
- [User Registry Beispiel](./user-registry-bimap.md)
