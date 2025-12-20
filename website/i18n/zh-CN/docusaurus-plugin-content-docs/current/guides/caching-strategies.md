---
id: caching-strategies
title: LRUCache 缓存策略
sidebar_label: 缓存策略
description: 使用 LRUCache 的缓存模式综合指南
keywords: [lru-cache, caching, strategies, patterns, ttl, eviction]
---

# LRUCache 缓存策略

学习使用 LRUCache 的有效缓存模式来提高应用程序性能。

## 为什么使用 LRUCache？

LRUCache 在达到容量时会自动驱逐**最近最少使用**的项，非常适合：

- API 响应缓存
- 数据库查询结果
- 计算值
- 会话数据
- 静态资源

## 基本 LRU 模式

```typescript
import { LRUCache } from '@msnkr/data-structures';

const cache = new LRUCache<string, any>({ capacity: 100 });

function getCachedData(key: string): any {
  // 首先检查缓存
  let data = cache.get(key);
  if (data) {
    return data; // 缓存命中
  }

  // 缓存未命中 - 获取数据
  data = fetchExpensiveData(key);
  cache.put(key, data);
  return data;
}
```

## 生存时间（TTL）缓存

自动使缓存条目在一段时间后过期。

### 会话缓存

```typescript
interface Session {
  userId: string;
  loginTime: number;
  data: Record<string, unknown>;
}

const sessionCache = new LRUCache<string, Session>({
  capacity: 1000,
  ttl: 3600000, // 1 小时，以毫秒为单位
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
  return sessionCache.get(sessionId); // 如果过期则返回 undefined
}

// 1 小时后，会话自动过期
```

### 使用 TTL 的 API 速率限制

```typescript
const rateLimiter = new LRUCache<string, number>({
  capacity: 10000,
  ttl: 60000, // 1 分钟
});

function checkRateLimit(userId: string, maxRequests: number): boolean {
  const count = rateLimiter.get(userId) || 0;

  if (count >= maxRequests) {
    return false; // 超出速率限制
  }

  rateLimiter.put(userId, count + 1);
  return true;
}

// 使用方式
if (checkRateLimit('user-123', 100)) {
  // 处理请求
} else {
  // 返回 429 请求过多
}
```

## 多层缓存

组合多个缓存层以获得最佳性能。

```typescript
class MultiLayerCache<K, V> {
  private l1Cache: LRUCache<K, V>; // 小容量，快速
  private l2Cache: LRUCache<K, V>; // 大容量，较慢

  constructor(l1Size: number, l2Size: number) {
    this.l1Cache = new LRUCache({ capacity: l1Size });
    this.l2Cache = new LRUCache({ capacity: l2Size });
  }

  get(key: K): V | undefined {
    // 首先检查 L1
    let value = this.l1Cache.get(key);
    if (value !== undefined) {
      return value; // L1 命中
    }

    // 检查 L2
    value = this.l2Cache.get(key);
    if (value !== undefined) {
      // 提升到 L1
      this.l1Cache.put(key, value);
      return value; // L2 命中
    }

    return undefined; // 缓存未命中
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

// 使用方式：热数据使用快速缓存，温数据使用较慢缓存
const cache = new MultiLayerCache<string, object>(50, 500);
```

## 缓存失效模式

### 手动失效

```typescript
const userCache = new LRUCache<number, User>({ capacity: 100 });

function updateUser(id: number, updates: Partial<User>): void {
  // 更新数据库
  database.update('users', id, updates);

  // 使缓存失效
  userCache.delete(id);

  // 或直接更新缓存
  const user = userCache.get(id);
  if (user) {
    Object.assign(user, updates);
    userCache.put(id, user);
  }
}
```

### 基于模式的失效

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

// 使用户 1 的所有缓存条目失效
cache.invalidateByPrefix('user:1:');
```

### 基于时间的失效

```typescript
interface CachedValue<T> {
  data: T;
  timestamp: number;
  ttl: number; // 每个条目的自定义 TTL
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

    // 检查是否过期
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return cached.data;
  }
}

const cache = new SmartCache<string, object>();
cache.put('short-lived', data1, 60000); // 1 分钟
cache.put('long-lived', data2, 3600000); // 1 小时
```

## 缓存预热

将频繁访问的数据预加载到缓存中。

```typescript
async function warmCache(): Promise<void> {
  console.log('预热缓存中...');

  // 加载热门项
  const popularIds = await database.query(
    'SELECT id FROM products ORDER BY views DESC LIMIT 100',
  );

  for (const { id } of popularIds) {
    const product = await database.get('products', id);
    cache.put(id, product);
  }

  console.log(`缓存已预热 ${popularIds.length} 个项`);
}

// 在应用程序启动时预热缓存
await warmCache();
```

## 缓存监控

跟踪缓存性能指标。

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

// 监控缓存性能
setInterval(() => {
  const stats = cache.getStats();
  console.log(`缓存统计：${stats.hitRate.toFixed(2)}% 命中率`);
  console.log(`命中：${stats.hits}，未命中：${stats.misses}`);
}, 60000); // 每分钟
```

## 最佳实践

### 1. 选择适当的容量

```typescript
// 太小：频繁驱逐
const tooSmall = new LRUCache({ capacity: 10 });

// 太大：内存问题
const tooLarge = new LRUCache({ capacity: 1000000 });

// 恰到好处：基于工作集大小
const optimal = new LRUCache({ capacity: 1000 });
```

### 2. 为时间敏感的数据使用 TTL

```typescript
// 会话过期
const sessions = new LRUCache({ capacity: 5000, ttl: 3600000 });

// 静态数据可以存活更长时间
const staticData = new LRUCache({ capacity: 100, ttl: 86400000 }); // 24 小时
```

### 3. 仅缓存昂贵的操作

```typescript
// ✅ 好：缓存昂贵的操作
async function getAggregatedReport(userId: string) {
  const cached = reportCache.get(userId);
  if (cached) return cached;

  // 昂贵：多次数据库查询 + 计算
  const report = await generateComplexReport(userId);
  reportCache.put(userId, report);
  return report;
}

// ❌ 坏：不要缓存琐碎的操作
function addNumbers(a: number, b: number) {
  // 不要缓存这个！
  return a + b;
}
```

### 4. 优雅地处理缓存失败

```typescript
async function fetchWithCache(key: string): Promise<Data> {
  try {
    const cached = cache.get(key);
    if (cached) return cached;
  } catch (error) {
    console.error('缓存读取错误：', error);
    // 不使用缓存继续
  }

  const data = await fetchFromSource(key);

  try {
    cache.put(key, data);
  } catch (error) {
    console.error('缓存写入错误：', error);
    // 不进行缓存继续
  }

  return data;
}
```

## 常见陷阱

### 1. 缓存雪崩

**问题：** 对同一未缓存数据的多个请求同时命中后端。

**解决方案：** 使用 Promise 缓存

```typescript
const promiseCache = new Map<string, Promise<any>>();

async function fetchWithPromiseCache(key: string): Promise<any> {
  // 检查结果缓存
  const cached = cache.get(key);
  if (cached) return cached;

  // 检查是否已在获取中
  let promise = promiseCache.get(key);
  if (promise) return promise;

  // 开始获取
  promise = fetchExpensiveData(key).then((data) => {
    cache.put(key, data);
    promiseCache.delete(key);
    return data;
  });

  promiseCache.set(key, promise);
  return promise;
}
```

### 2. 过期数据

**问题：** 更新后缓存保存过时数据。

**解决方案：** 写入时失效

```typescript
function updateData(id: string, data: any): void {
  database.update(id, data);
  cache.delete(id); // 立即失效
}
```

## 相关主题

- [API 响应缓存示例](../examples/api-response-cache.md)
- [数据库查询缓存示例](../examples/database-query-cache.md)
- [图像缩略图缓存示例](../examples/image-thumbnail-cache.md)
- [LRUCache API 参考](../api/lru-cache.md)
