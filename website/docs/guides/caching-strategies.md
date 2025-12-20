---
id: caching-strategies
title: Caching Strategies with LRUCache
sidebar_label: Caching Strategies
description: Comprehensive guide to caching patterns using LRUCache
keywords: [lru-cache, caching, strategies, patterns, ttl, eviction]
---

# Caching Strategies with LRUCache

Learn effective caching patterns to improve application performance using LRUCache.

## Why Use LRUCache?

LRUCache automatically evicts the **Least Recently Used** items when capacity is reached, making it ideal for:

- API response caching
- Database query results
- Computed values
- Session data
- Static assets

## Basic LRU Pattern

```typescript
import { LRUCache } from '@msnkr/data-structures';

const cache = new LRUCache<string, any>({ capacity: 100 });

function getCachedData(key: string): any {
  // Check cache first
  let data = cache.get(key);
  if (data) {
    return data; // Cache hit
  }

  // Cache miss - fetch data
  data = fetchExpensiveData(key);
  cache.put(key, data);
  return data;
}
```

## Time-To-Live (TTL) Caching

Automatically expire cache entries after a time period.

### Session Caching

```typescript
interface Session {
  userId: string;
  loginTime: number;
  data: Record<string, unknown>;
}

const sessionCache = new LRUCache<string, Session>({
  capacity: 1000,
  ttl: 3600000, // 1 hour in milliseconds
});

function createSession(sessionId: string, userId: string): Session {
  const session: Session = {
    userId,
    loginTime: Date.now(),
    data: {},
  };

  sessionCache.put(sessionId, session);
  return session;
}

function getSession(sessionId: string): Session | undefined {
  return sessionCache.get(sessionId); // Returns undefined if expired
}

// After 1 hour, session automatically expires
```

### API Rate Limiting with TTL

```typescript
const rateLimiter = new LRUCache<string, number>({
  capacity: 10000,
  ttl: 60000, // 1 minute
});

function checkRateLimit(userId: string, maxRequests: number): boolean {
  const count = rateLimiter.get(userId) || 0;

  if (count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  rateLimiter.put(userId, count + 1);
  return true;
}

// Usage
if (checkRateLimit('user-123', 100)) {
  // Process request
} else {
  // Return 429 Too Many Requests
}
```

## Multi-Layer Caching

Combine multiple cache layers for optimal performance.

```typescript
class MultiLayerCache<K, V> {
  private l1Cache: LRUCache<K, V>; // Small, fast
  private l2Cache: LRUCache<K, V>; // Larger, slower

  constructor(l1Size: number, l2Size: number) {
    this.l1Cache = new LRUCache({ capacity: l1Size });
    this.l2Cache = new LRUCache({ capacity: l2Size });
  }

  get(key: K): V | undefined {
    // Check L1 first
    let value = this.l1Cache.get(key);
    if (value !== undefined) {
      return value; // L1 hit
    }

    // Check L2
    value = this.l2Cache.get(key);
    if (value !== undefined) {
      // Promote to L1
      this.l1Cache.put(key, value);
      return value; // L2 hit
    }

    return undefined; // Cache miss
  }

  put(key: K, value: V): void {
    this.l1Cache.put(key, value);
    this.l2Cache.put(key, value);
  }

  delete(key: K): void {
    this.l1Cache.delete(key);
    this.l2Cache.delete(key);
  }
}

// Usage: Fast cache for hot data, slower for warm data
const cache = new MultiLayerCache<string, object>(50, 500);
```

## Cache Invalidation Patterns

### Manual Invalidation

```typescript
const userCache = new LRUCache<number, User>({ capacity: 100 });

function updateUser(id: number, updates: Partial<User>): void {
  // Update database
  database.update('users', id, updates);

  // Invalidate cache
  userCache.delete(id);

  // Or update cache directly
  const user = userCache.get(id);
  if (user) {
    Object.assign(user, updates);
    userCache.put(id, user);
  }
}
```

### Pattern-Based Invalidation

```typescript
class PrefixCache {
  private cache = new LRUCache<string, any>({ capacity: 200 });

  get(key: string): any {
    return this.cache.get(key);
  }

  put(key: string, value: any): void {
    this.cache.put(key, value);
  }

  invalidateByPrefix(prefix: string): void {
    for (const [key] of this.cache) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new PrefixCache();
cache.put('user:1:profile', userData);
cache.put('user:1:posts', posts);
cache.put('user:2:profile', otherUser);

// Invalidate all cache entries for user 1
cache.invalidateByPrefix('user:1:');
```

### Time-Based Invalidation

```typescript
interface CachedValue<T> {
  data: T;
  timestamp: number;
  ttl: number; // Custom TTL per entry
}

class SmartCache<K, V> {
  private cache = new LRUCache<K, CachedValue<V>>({ capacity: 100 });

  put(key: K, value: V, ttl: number = 300000): void {
    this.cache.put(key, {
      data: value,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: K): V | undefined {
    const cached = this.cache.get(key);
    if (!cached) return undefined;

    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return cached.data;
  }
}

const cache = new SmartCache<string, object>();
cache.put('short-lived', data1, 60000); // 1 minute
cache.put('long-lived', data2, 3600000); // 1 hour
```

## Cache Warming

Preload frequently accessed data into cache.

```typescript
async function warmCache(): Promise<void> {
  console.log('Warming cache...');

  // Load popular items
  const popularIds = await database.query(
    'SELECT id FROM products ORDER BY views DESC LIMIT 100',
  );

  for (const { id } of popularIds) {
    const product = await database.get('products', id);
    cache.put(id, product);
  }

  console.log(`Cache warmed with ${popularIds.length} items`);
}

// Warm cache on application startup
await warmCache();
```

## Cache Monitoring

Track cache performance metrics.

```typescript
class MonitoredCache<K, V> {
  private cache: LRUCache<K, V>;
  private hits = 0;
  private misses = 0;

  constructor(capacity: number) {
    this.cache = new LRUCache({ capacity });
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.hits++;
    } else {
      this.misses++;
    }
    return value;
  }

  put(key: K, value: V): void {
    this.cache.put(key, value);
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total) * 100 : 0,
      size: this.cache.size,
    };
  }

  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
  }
}

const cache = new MonitoredCache<string, object>(100);

// Monitor cache performance
setInterval(() => {
  const stats = cache.getStats();
  console.log(`Cache stats: ${stats.hitRate.toFixed(2)}% hit rate`);
  console.log(`Hits: ${stats.hits}, Misses: ${stats.misses}`);
}, 60000); // Every minute
```

## Best Practices

### 1. Choose Appropriate Capacity

```typescript
// Too small: frequent evictions
const tooSmall = new LRUCache({ capacity: 10 });

// Too large: memory issues
const tooLarge = new LRUCache({ capacity: 1000000 });

// Just right: based on working set size
const optimal = new LRUCache({ capacity: 1000 });
```

### 2. Use TTL for Time-Sensitive Data

```typescript
// Sessions expire
const sessions = new LRUCache({ capacity: 5000, ttl: 3600000 });

// Static data can live longer
const staticData = new LRUCache({ capacity: 100, ttl: 86400000 }); // 24h
```

### 3. Cache Expensive Operations Only

```typescript
// ✅ Good: Cache expensive operations
async function getAggregatedReport(userId: string) {
  const cached = reportCache.get(userId);
  if (cached) return cached;

  // Expensive: multiple DB queries + computation
  const report = await generateComplexReport(userId);
  reportCache.put(userId, report);
  return report;
}

// ❌ Bad: Don't cache trivial operations
function addNumbers(a: number, b: number) {
  // Don't cache this!
  return a + b;
}
```

### 4. Handle Cache Failures Gracefully

```typescript
async function fetchWithCache(key: string): Promise<Data> {
  try {
    const cached = cache.get(key);
    if (cached) return cached;
  } catch (error) {
    console.error('Cache read error:', error);
    // Continue without cache
  }

  const data = await fetchFromSource(key);

  try {
    cache.put(key, data);
  } catch (error) {
    console.error('Cache write error:', error);
    // Continue without caching
  }

  return data;
}
```

## Common Pitfalls

### 1. Cache Stampede

**Problem:** Multiple requests for the same uncached data hit the backend simultaneously.

**Solution:** Use promise caching

```typescript
const promiseCache = new Map<string, Promise<any>>();

async function fetchWithPromiseCache(key: string): Promise<any> {
  // Check result cache
  const cached = cache.get(key);
  if (cached) return cached;

  // Check if already fetching
  let promise = promiseCache.get(key);
  if (promise) return promise;

  // Start fetching
  promise = fetchExpensiveData(key).then((data) => {
    cache.put(key, data);
    promiseCache.delete(key);
    return data;
  });

  promiseCache.set(key, promise);
  return promise;
}
```

### 2. Stale Data

**Problem:** Cache holds outdated data after updates.

**Solution:** Invalidate on write

```typescript
function updateData(id: string, data: any): void {
  database.update(id, data);
  cache.delete(id); // Invalidate immediately
}
```

## Related Topics

- [API Response Cache Example](../examples/api-response-cache.md)
- [Database Query Cache Example](../examples/database-query-cache.md)
- [Image Thumbnail Cache Example](../examples/image-thumbnail-cache.md)
- [LRUCache API Reference](../api/lru-cache.md)
