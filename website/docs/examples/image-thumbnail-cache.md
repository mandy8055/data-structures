---
id: image-thumbnail-cache
title: Image Thumbnail Cache
sidebar_label: Image Thumbnail Cache
description: Cache image thumbnails with TTL using LRUCache
keywords: [lru-cache, image, thumbnail, ttl, caching, example]
---

# Image Thumbnail Cache with TTL

Cache image thumbnails with automatic expiration.

## Implementation

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
  ttl: 300000, // 5 minutes in milliseconds
});

async function getThumbnail(imageId: string): Promise<Thumbnail> {
  // Check cache first
  const cached = thumbnailCache.get(imageId);
  if (cached) {
    console.log('Cache hit for image:', imageId);
    return cached;
  }

  console.log('Cache miss, generating thumbnail:', imageId);

  // Generate thumbnail (expensive operation)
  const thumbnail = await generateThumbnail(imageId);

  // Store in cache
  thumbnailCache.put(imageId, thumbnail);

  return thumbnail;
}

async function generateThumbnail(imageId: string): Promise<Thumbnail> {
  // Simulate thumbnail generation
  const response = await fetch(`/api/images/${imageId}/thumbnail`);
  const blob = await response.blob();

  return {
    url: URL.createObjectURL(blob),
    width: 150,
    height: 150,
    blob,
  };
}

// Usage
const thumb1 = await getThumbnail('img-001'); // Cache miss
const thumb2 = await getThumbnail('img-001'); // Cache hit!

// After 5 minutes, cache expires automatically
setTimeout(async () => {
  const thumb3 = await getThumbnail('img-001'); // Cache miss (expired)
}, 300001);
```

## Preloading Thumbnails

```typescript
async function preloadThumbnails(imageIds: string[]): Promise<void> {
  console.log(`Preloading ${imageIds.length} thumbnails...`);

  const promises = imageIds.map((id) => getThumbnail(id));
  await Promise.all(promises);

  console.log('Preload complete');
}

// Preload thumbnails for a gallery
await preloadThumbnails(['img-001', 'img-002', 'img-003']);
```

## Cache Statistics

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

## See Also

- [LRUCache API Reference](../api/lru-cache.md)
- [API Response Cache Example](./api-response-cache.md)
- [Caching Strategies Guide](../guides/caching-strategies.md)
