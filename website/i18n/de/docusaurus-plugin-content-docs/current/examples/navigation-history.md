---
id: navigation-history
title: Navigation History
sidebar_label: Navigation History
description: Benutzernavigationsverlauf mit LinkedList verfolgen
keywords: [linked-list, history, navigation, example]
---

# Navigation History mit LinkedList

Verfolgen Sie den Navigationsverlauf für Zurück-/Vorwärts-Funktionalität.

## Implementierung

```typescript
import { LinkedList } from '@msnkr/data-structures';

const history = new LinkedList<string>();

// Benutzer navigiert durch Seiten
history.append('/home');
history.append('/products');
history.append('/cart');
history.append('/checkout');

// Aktuelle Seite abrufen (zuletzt besucht)
const currentPage = history.get(history.size - 1);
console.log('Current:', currentPage); // "/checkout"

// Prüfen, ob Benutzer eine bestimmte Seite besucht hat
const visitedProducts = history.contains('/products');
console.log('Visited products?', visitedProducts); // true

// Vollständigen Navigationspfad abrufen
console.log('Full path:', history.toArray());
// Ausgabe: ["/home", "/products", "/cart", "/checkout"]
```

## Mit Besuchszeitstempeln

```typescript
interface HistoryEntry {
  url: string;
  timestamp: Date;
}

const timestampedHistory = new LinkedList<HistoryEntry>();

function visit(url: string): void {
  timestampedHistory.append({
    url,
    timestamp: new Date(),
  });
}

visit('/home');
visit('/search?q=laptop');
visit('/products/123');

// Durch Verlauf iterieren
for (const entry of timestampedHistory) {
  console.log(`${entry.timestamp.toISOString()}: ${entry.url}`);
}
```

## Siehe auch

- [LinkedList API-Referenz](../api/linked-list.md)
- [DoublyLinkedList](../api/doubly-linked-list.md) - Für bidirektionale Navigation
- [Browser History Beispiel](./browser-history-doubly-linked.md)
