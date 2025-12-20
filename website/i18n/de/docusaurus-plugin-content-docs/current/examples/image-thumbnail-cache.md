---
id: image-thumbnail-cache
title: Image Thumbnail Cache
sidebar_label: Image Thumbnail Cache
description: Bild-Thumbnails mit TTL mittels LRUCache zwischenspeichern
keywords: [lru-cache, image, thumbnail, ttl, caching, example]
---

# Image Thumbnail Cache mit TTL

Speichern Sie Bild-Thumbnails mit automatischem Ablauf zwischen.

## Implementierung

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
  ttl: 300000, // 5 Minuten in Millisekunden
});

async function getThumbnail(imageId: string): Promise<Thumbnail> {
  // Cache zuerst prüfen
  const cached = thumbnailCache.get(imageId);
  if (cached) {
    console.log('Cache hit for image:', imageId);
    return cached;
  }

  console.log('Cache miss, generating thumbnail:', imageId);

  // Thumbnail generieren (teure Operation)
  const thumbnail = await generateThumbnail(imageId);

  // Im Cache speichern
  thumbnailCache.put(imageId, thumbnail);

  return thumbnail;
}

async function generateThumbnail(imageId: string): Promise<Thumbnail> {
  // Thumbnail-Generierung simulieren
  const response = await fetch(`/api/images/${imageId}/thumbnail`);
  const blob = await response.blob();

  return {
    url: URL.createObjectURL(blob),
    width: 150,
    height: 150,
    blob,
  };
}

// Verwendung
const thumb1 = await getThumbnail('img-001'); // Cache miss
const thumb2 = await getThumbnail('img-001'); // Cache hit!

// Nach 5 Minuten läuft der Cache automatisch ab
setTimeout(async () => {
  const thumb3 = await getThumbnail('img-001'); // Cache miss (abgelaufen)
}, 300001);
```

## Thumbnails vorladen

```typescript
async function preloadThumbnails(imageIds: string[]): Promise<void> {
  console.log(`Preloading ${imageIds.length} thumbnails...`);

  const promises = imageIds.map((id) => getThumbnail(id));
  await Promise.all(promises);

  console.log('Preload complete');
}

// Thumbnails für eine Galerie vorladen
await preloadThumbnails(['img-001', 'img-002', 'img-003']);
```

## Cache-Statistiken

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

## Siehe auch

- [LRUCache API-Referenz](../api/lru-cache.md)
- [API Response Cache Beispiel](./api-response-cache.md)
- [Leitfaden zu Caching-Strategien](../guides/caching-strategies.md)
