---
id: database-query-cache
title: Database Query Caching
sidebar_label: Database Query Cache
description: Teure Datenbankabfragen mit LRUCache zwischenspeichern
keywords: [lru-cache, database, sql, query, caching, example]
---

# Database Query Caching

Speichern Sie teure Datenbankabfragen zwischen, um die Anwendungsleistung zu verbessern.

## Implementierung

```typescript
import { LRUCache } from '@msnkr/data-structures';

interface QueryResult {
  rows: unknown[];
  count: number;
}

const queryCache = new LRUCache<string, QueryResult>({ capacity: 50 });

function executeQuery(sql: string): QueryResult {
  // Cache prüfen
  const cached = queryCache.get(sql);
  if (cached) {
    console.log('Returning cached query result');
    return cached;
  }

  // Abfrage ausführen (teure Operation)
  const result = database.execute(sql);

  // Ergebnis zwischenspeichern
  queryCache.put(sql, result);

  return result;
}

// Verwendung
const users = executeQuery('SELECT * FROM users WHERE active = true');
const sameUsers = executeQuery('SELECT * FROM users WHERE active = true'); // Cached!
```

## Cache-Invalidierung

```typescript
// Cache nach Datenänderung invalidieren
function updateUser(id: number, data: object): void {
  database.update('users', id, data);

  // Zugehörige Cache-Einträge löschen
  queryCache.clear(); // Oder selektiv bestimmte Abfragen löschen
}
```

## Siehe auch

- [LRUCache API-Referenz](../api/lru-cache.md)
- [Leitfaden zu Caching-Strategien](../guides/caching-strategies.md)
