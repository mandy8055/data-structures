---
id: api-response-cache
title: API Response Caching
sidebar_label: API Response Cache
description: Cache API responses with LRUCache to reduce network calls
keywords: [lru-cache, api, caching, example, http]
---

# API Response Caching with LRUCache

Use LRUCache to cache API responses and reduce network calls.

## Implementation

```typescript
import { LRUCache } from '@msnkr/data-structures';

interface APIResponse {
  data: unknown;
  timestamp: number;
}

const apiCache = new LRUCache<string, APIResponse>({ capacity: 100 });

async function fetchWithCache(url: string): Promise<unknown> {
  // Check cache first
  const cached = apiCache.get(url);
  if (cached) {
    console.log('Cache hit!');
    return cached.data;
  }

  // Fetch from API
  const response = await fetch(url);
  const data = await response.json();

  // Store in cache
  apiCache.put(url, {
    data,
    timestamp: Date.now(),
  });

  return data;
}

// Usage
await fetchWithCache('/api/users'); // API call
await fetchWithCache('/api/users'); // Cache hit!
```

## Benefits

- **Reduced latency** - Instant response for cached data
- **Lower server load** - Fewer API calls
- **Automatic eviction** - Least recently used items removed when full

## See Also

- [LRUCache API Reference](../api/lru-cache.md)
- [Caching Strategies Guide](../guides/caching-strategies.md)
