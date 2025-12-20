---
id: api-response-cache
title: API 响应缓存
sidebar_label: API 响应缓存
description: 使用 LRUCache 缓存 API 响应以减少网络调用
keywords: [lru-cache, api, caching, example, http]
---

# 使用 LRUCache 进行 API 响应缓存

使用 LRUCache 缓存 API 响应并减少网络调用。

## 实现

```typescript
import { LRUCache } from '@msnkr/data-structures';

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

// 使用示例
await fetchWithCache('/api/users'); // API 调用
await fetchWithCache('/api/users'); // 缓存命中！
```

## 优势

- **降低延迟** - 缓存数据即时响应
- **减少服务器负载** - 更少的 API 调用
- **自动淘汰** - 容量满时自动删除最近最少使用的项

## 另请参阅

- [LRUCache API 参考](../api/lru-cache.md)
- [缓存策略指南](../guides/caching-strategies.md)
