---
id: lru-cache
title: LRUCache
sidebar_label: LRUCache
description: 最近最少使用缓存，具有 O(1) 操作和自动驱逐功能
keywords:
  [
    lru-cache,
    cache,
    least-recently-used,
    data-structure,
    typescript,
    javascript,
  ]
---

import InstallTabs from '@site/src/components/InstallTabs';

# LRUCache

最近最少使用（LRU）缓存实现，为访问和存储元素提供 O(1) 操作，并在达到容量时自动驱逐最近最少使用的项。

## 安装

<InstallTabs packageName='@msnkr/data-structures' importName='LRUCache' />

## 使用方法

```typescript
import { LRUCache } from '@msnkr/data-structures';

const cache = new LRUCache<string, number>({ capacity: 3 });
```

## API 参考

### 构造函数选项

```typescript
interface LRUCacheOptions {
  capacity: number; // 必需：最大项数
  ttl?: number; // 可选：生存时间（毫秒）
}
```

### 属性

- `size: number` - 缓存中当前元素的数量

### 方法

#### 访问元素

```typescript
// 通过键获取值 - O(1)
const value = cache.get('key');

// 检查键是否存在 - O(1)
const exists = cache.has('key');
```

:::tip LRU 行为
使用 `get()` 访问元素会将其标记为最近使用，将其移到缓存的前面。
:::

#### 添加/更新元素

```typescript
// 添加或更新项 - O(1)
cache.put('key', value);
```

:::info 容量管理
当向已满的缓存添加项时，最近最少使用的项会自动被驱逐。
:::

#### 删除元素

```typescript
// 删除特定项 - O(1)
const removed = cache.delete('key');

// 删除所有项 - O(1)
cache.clear();
```

#### 迭代

```typescript
// 获取所有条目（从最近到最少使用）
const entries = cache.entries();

// 迭代缓存条目
for (const [key, value] of cache) {
  console.log(key, value);
}
```

## 示例

### 基本使用

```typescript
const cache = new LRUCache<string, number>({ capacity: 3 });

// 添加一些项
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);

console.log(cache.get('a')); // 1
console.log(cache.size); // 3

// 达到容量时添加新项
cache.put('d', 4); // 驱逐 "b"（最近最少使用）

console.log(cache.has('b')); // false
console.log([...cache]); // [["d", 4], ["c", 3], ["a", 1]]
```

### API 响应缓存

```typescript
interface APIResponse {
  data: unknown;
  timestamp: number;
}

const apiCache = new LRUCache<string, APIResponse>({ capacity: 100 });

async function fetchWithCache(url: string): Promise<unknown> {
  // 首先检查缓存
  const cached = apiCache.get(url);
  if (cached) {
    console.log('缓存命中！');
    return cached.data;
  }

  // 从 API 获取
  const response = await fetch(url);
  const data = await response.json();

  // 存储到缓存
  apiCache.put(url, {
    data,
    timestamp: Date.now(),
  });

  return data;
}

// 使用
await fetchWithCache('/api/users'); // API 调用
await fetchWithCache('/api/users'); // 缓存命中！
```

### 数据库查询缓存

```typescript
interface QueryResult {
  rows: unknown[];
  count: number;
}

const queryCache = new LRUCache<string, QueryResult>({ capacity: 50 });

function executeQuery(sql: string): QueryResult {
  // 检查缓存
  const cached = queryCache.get(sql);
  if (cached) {
    return cached;
  }

  // 执行查询（昂贵的操作）
  const result = database.execute(sql);

  // 缓存结果
  queryCache.put(sql, result);

  return result;
}
```

### 基于时间的过期

```typescript
const sessionCache = new LRUCache<string, object>({
  capacity: 1000,
  ttl: 3600000, // 1 小时（毫秒）
});

// 存储用户会话
sessionCache.put('session-123', {
  userId: 'user-456',
  loginTime: Date.now(),
});

// 1 小时后，会话自动过期
setTimeout(() => {
  console.log(sessionCache.get('session-123')); // undefined（已过期）
}, 3600001);
```

### 图片缩略图缓存

```typescript
interface Thumbnail {
  url: string;
  width: number;
  height: number;
  data: ArrayBuffer;
}

const thumbnailCache = new LRUCache<string, Thumbnail>({ capacity: 50 });

async function getThumbnail(imageUrl: string): Promise<Thumbnail> {
  // 检查缓存
  const cached = thumbnailCache.get(imageUrl);
  if (cached) {
    console.log('返回缓存的缩略图');
    return cached;
  }

  // 生成缩略图（昂贵的操作）
  const thumbnail = await generateThumbnail(imageUrl);

  // 缓存结果
  thumbnailCache.put(imageUrl, thumbnail);

  return thumbnail;
}
```

### 用户配置文件缓存

```typescript
interface UserProfile {
  id: number;
  name: string;
  email: string;
  preferences: object;
}

const profileCache = new LRUCache<number, UserProfile>({
  capacity: 200,
  ttl: 1800000, // 30 分钟
});

async function getUserProfile(userId: number): Promise<UserProfile> {
  // 尝试从缓存获取
  const cached = profileCache.get(userId);
  if (cached) {
    return cached;
  }

  // 从数据库加载
  const profile = await db.users.findById(userId);

  // 缓存用户配置文件
  profileCache.put(userId, profile);

  return profile;
}

// 使用
const profile = await getUserProfile(123);
console.log(profile.name);

// 后续调用将命中缓存
const cachedProfile = await getUserProfile(123); // 快速！
```

### DNS 查询缓存

```typescript
interface DNSRecord {
  domain: string;
  ip: string;
  ttl: number;
}

const dnsCache = new LRUCache<string, DNSRecord>({
  capacity: 1000,
  ttl: 300000, // 5 分钟
});

async function resolveDomain(domain: string): Promise<string> {
  const cached = dnsCache.get(domain);
  if (cached) {
    return cached.ip;
  }

  const record = await performDNSLookup(domain);
  dnsCache.put(domain, record);

  return record.ip;
}
```

### 计算结果缓存（记忆化）

```typescript
// 昂贵的斐波那契计算
const fiboCache = new LRUCache<number, number>({ capacity: 100 });

function fibonacci(n: number): number {
  if (n <= 1) return n;

  const cached = fiboCache.get(n);
  if (cached !== undefined) {
    return cached;
  }

  const result = fibonacci(n - 1) + fibonacci(n - 2);
  fiboCache.put(n, result);

  return result;
}

console.log(fibonacci(40)); // 首次：慢
console.log(fibonacci(40)); // 第二次：快（缓存）
```

## 时间复杂度

| 操作   | 平均 | 最坏 |
| ------ | ---- | ---- |
| get    | O(1) | O(1) |
| put    | O(1) | O(1) |
| has    | O(1) | O(1) |
| delete | O(1) | O(1) |
| clear  | O(1) | O(1) |

## 最佳实践

### 何时使用 LRUCache

- ✅ 需要限制内存使用的缓存
- ✅ 最近访问的数据更有可能再次被访问
- ✅ API 响应、数据库查询或计算结果缓存
- ✅ 需要自动驱逐最旧/最少使用的项

### 容量规划

```typescript
// 考虑内存使用
const smallCache = new LRUCache({ capacity: 10 }); // 小型应用
const mediumCache = new LRUCache({ capacity: 100 }); // 中型应用
const largeCache = new LRUCache({ capacity: 1000 }); // 大型应用

// 根据数据大小调整
const imageCache = new LRUCache({ capacity: 20 }); // 大型对象
const stringCache = new LRUCache({ capacity: 1000 }); // 小型对象
```

### TTL 最佳实践

```typescript
// API 响应：短 TTL
const apiCache = new LRUCache({
  capacity: 100,
  ttl: 60000, // 1 分钟
});

// 用户会话：中等 TTL
const sessionCache = new LRUCache({
  capacity: 1000,
  ttl: 3600000, // 1 小时
});

// 配置数据：长 TTL
const configCache = new LRUCache({
  capacity: 50,
  ttl: 86400000, // 24 小时
});
```

## 实现细节

LRUCache 内部使用 **哈希映射** 和 **双向链表** 的组合：

- 哈希映射提供 O(1) 键查找
- 双向链表维护访问顺序
- 最近使用的项在前面
- 最少使用的项在后面

## 相关数据结构

- **Map** - 基本键值存储，无容量限制
- **BiDirectionalMap** - 双向映射，无 LRU 行为
- **SortedMap** - 按键排序的映射，无 LRU 行为
