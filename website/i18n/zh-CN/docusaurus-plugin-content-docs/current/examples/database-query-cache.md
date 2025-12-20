---
id: database-query-cache
title: 数据库查询缓存
sidebar_label: 数据库查询缓存
description: 使用 LRUCache 缓存昂贵的数据库查询
keywords: [lru-cache, database, sql, query, caching, example]
---

# 数据库查询缓存

缓存昂贵的数据库查询以提高应用程序性能。

## 实现

```typescript
import { LRUCache } from '@msnkr/data-structures';

interface QueryResult {
  rows: unknown[];
  count: number;
}

const queryCache = new LRUCache<string, QueryResult>({ capacity: 50 });

function executeQuery(sql: string): QueryResult {
  // 检查缓存
  const cached = queryCache.get(sql);
  if (cached) {
    console.log('返回缓存的查询结果');
    return cached;
  }

  // 执行查询（昂贵的操作）
  const result = database.execute(sql);

  // 缓存结果
  queryCache.put(sql, result);

  return result;
}

// 使用示例
const users = executeQuery('SELECT * FROM users WHERE active = true');
const sameUsers = executeQuery('SELECT * FROM users WHERE active = true'); // 已缓存！
```

## 缓存失效

```typescript
// 数据修改后使缓存失效
function updateUser(id: number, data: object): void {
  database.update('users', id, data);

  // 清除相关缓存条目
  queryCache.clear(); // 或有选择地删除特定查询
}
```

## 另请参阅

- [LRUCache API 参考](../api/lru-cache.md)
- [缓存策略指南](../guides/caching-strategies.md)
