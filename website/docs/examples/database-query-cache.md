---
id: database-query-cache
title: Database Query Caching
sidebar_label: Database Query Cache
description: Cache expensive database queries with LRUCache
keywords: [lru-cache, database, sql, query, caching, example]
---

# Database Query Caching

Cache expensive database queries to improve application performance.

## Implementation

```typescript
import { LRUCache } from '@msnkr/data-structures';

interface QueryResult {
  rows: unknown[];
  count: number;
}

const queryCache = new LRUCache<string, QueryResult>({ capacity: 50 });

function executeQuery(sql: string): QueryResult {
  // Check cache
  const cached = queryCache.get(sql);
  if (cached) {
    console.log('Returning cached query result');
    return cached;
  }

  // Execute query (expensive operation)
  const result = database.execute(sql);

  // Cache result
  queryCache.put(sql, result);

  return result;
}

// Usage
const users = executeQuery('SELECT * FROM users WHERE active = true');
const sameUsers = executeQuery('SELECT * FROM users WHERE active = true'); // Cached!
```

## Cache Invalidation

```typescript
// Invalidate cache after data modification
function updateUser(id: number, data: object): void {
  database.update('users', id, data);

  // Clear related cache entries
  queryCache.clear(); // Or selectively delete specific queries
}
```

## See Also

- [LRUCache API Reference](../api/lru-cache.md)
- [Caching Strategies Guide](../guides/caching-strategies.md)
