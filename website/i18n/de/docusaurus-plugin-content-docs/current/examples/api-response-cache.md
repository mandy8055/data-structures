---
id: api-response-cache
title: API Response Caching
sidebar_label: API Response Cache
description: API-Antworten mit LRUCache zwischenspeichern, um Netzwerkaufrufe zu reduzieren
keywords: [lru-cache, api, caching, example, http]
---

# API Response Caching mit LRUCache

Verwenden Sie LRUCache, um API-Antworten zwischenzuspeichern und Netzwerkaufrufe zu reduzieren.

## Implementierung

```typescript
import { LRUCache } from '@msnkr/data-structures';

interface APIResponse {
  data: unknown;
  timestamp: number;
}

const apiCache = new LRUCache<string, APIResponse>({ capacity: 100 });

async function fetchWithCache(url: string): Promise<unknown> {
  // Cache zuerst prüfen
  const cached = apiCache.get(url);
  if (cached) {
    console.log('Cache hit!');
    return cached.data;
  }

  // Von API abrufen
  const response = await fetch(url);
  const data = await response.json();

  // Im Cache speichern
  apiCache.put(url, {
    data,
    timestamp: Date.now(),
  });

  return data;
}

// Verwendung
await fetchWithCache('/api/users'); // API-Aufruf
await fetchWithCache('/api/users'); // Cache hit!
```

## Vorteile

- **Reduzierte Latenz** - Sofortige Antwort für zwischengespeicherte Daten
- **Geringere Serverlast** - Weniger API-Aufrufe
- **Automatische Entfernung** - Am wenigsten verwendete Elemente werden bei Überfüllung entfernt

## Siehe auch

- [LRUCache API-Referenz](../api/lru-cache.md)
- [Leitfaden zu Caching-Strategien](../guides/caching-strategies.md)
