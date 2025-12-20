---
id: image-thumbnail-cache
title: 图片缩略图缓存
sidebar_label: 图片缩略图缓存
description: 使用 LRUCache 和 TTL 缓存图片缩略图
keywords: [lru-cache, image, thumbnail, ttl, caching, example]
---

# 带 TTL 的图片缩略图缓存

缓存图片缩略图并自动过期。

## 实现

```typescript
import { LRUCache } from '@msnkr/data-structures';

interface Thumbnail {
  url: string;
  width: number;
  height: number;
  blob: Blob;
}

const thumbnailCache = new LRUCache<string, Thumbnail>({
  capacity: 50,
  ttl: 300000, // 5 分钟（毫秒）
});

async function getThumbnail(imageId: string): Promise<Thumbnail> {
  // 首先检查缓存
  const cached = thumbnailCache.get(imageId);
  if (cached) {
    console.log('图片缓存命中：', imageId);
    return cached;
  }

  console.log('缓存未命中，生成缩略图：', imageId);

  // 生成缩略图（昂贵的操作）
  const thumbnail = await generateThumbnail(imageId);

  // 存储到缓存
  thumbnailCache.put(imageId, thumbnail);

  return thumbnail;
}

async function generateThumbnail(imageId: string): Promise<Thumbnail> {
  // 模拟缩略图生成
  const response = await fetch(`/api/images/${imageId}/thumbnail`);
  const blob = await response.blob();

  return {
    url: URL.createObjectURL(blob),
    width: 150,
    height: 150,
    blob,
  };
}

// 使用示例
const thumb1 = await getThumbnail('img-001'); // 缓存未命中
const thumb2 = await getThumbnail('img-001'); // 缓存命中！

// 5 分钟后，缓存自动过期
setTimeout(async () => {
  const thumb3 = await getThumbnail('img-001'); // 缓存未命中（已过期）
}, 300001);
```

## 预加载缩略图

```typescript
async function preloadThumbnails(imageIds: string[]): Promise<void> {
  console.log(`正在预加载 ${imageIds.length} 个缩略图...`);

  const promises = imageIds.map((id) => getThumbnail(id));
  await Promise.all(promises);

  console.log('预加载完成');
}

// 为图库预加载缩略图
await preloadThumbnails(['img-001', 'img-002', 'img-003']);
```

## 缓存统计

```typescript
function getCacheStats() {
  return {
    size: thumbnailCache.size,
    capacity: 50,
    utilization: (thumbnailCache.size / 50) * 100,
  };
}

console.log(getCacheStats());
// { size: 15, capacity: 50, utilization: 30 }
```

## 另请参阅

- [LRUCache API 参考](../api/lru-cache.md)
- [API 响应缓存示例](./api-response-cache.md)
- [缓存策略指南](../guides/caching-strategies.md)
