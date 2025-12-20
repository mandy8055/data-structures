---
id: country-code-bimap
title: Country Code Registry
sidebar_label: Country Code Registry
description: Bidirectional country name to code mapping with BiMap
keywords: [bimap, country, code, mapping, example]
---

# Country Code Registry with BiMap

Map between country codes and names bidirectionally.

## Implementation

```typescript
import { BiDirectionalMap } from '@msnkr/data-structures';

const countryCodes = new BiDirectionalMap<string, string>();

// Register countries
countryCodes.set('US', 'United States');
countryCodes.set('GB', 'United Kingdom');
countryCodes.set('FR', 'France');
countryCodes.set('DE', 'Germany');
countryCodes.set('JP', 'Japan');

// Look up by code
console.log(countryCodes.get('US')); // "United States"

// Look up by name (reverse lookup in O(1)!)
console.log(countryCodes.getKey('France')); // "FR"

// Check existence
console.log(countryCodes.hasKey('JP')); // true
console.log(countryCodes.hasValue('Canada')); // false
```

## Validation

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

## Iterate Over All Countries

```typescript
console.log('All countries:');
for (const [code, name] of countryCodes.entries()) {
  console.log(`${code}: ${name}`);
}

// Output:
// US: United States
// GB: United Kingdom
// FR: France
// DE: Germany
// JP: Japan
```

## See Also

- [BiMap API Reference](../api/bi-map.md)
- [User Registry Example](./user-registry-bimap.md)
