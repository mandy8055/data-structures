---
id: lru-cache
title: LRUCache
sidebar_label: LRUCache
description: Least Recently Used Cache mit O(1) Operationen und automatischer Entfernung
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

Least Recently Used (LRU) Cache-Implementierung, die O(1) Operationen zum Zugreifen und Speichern von Elementen bietet und automatisch die am längsten nicht verwendeten Einträge entfernt, wenn die Kapazität erreicht wird.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='LRUCache' />

## Verwendung

```typescript
import { LRUCache } from '@msnkr/data-structures';

const cache = new LRUCache<string, number>({ capacity: 3 });
```

## API-Referenz

### Konstruktor-Optionen

```typescript
interface LRUCacheOptions {
  capacity: number; // Erforderlich: Maximale Anzahl von Einträgen
  ttl?: number; // Optional: Time-to-Live in Millisekunden
}
```

### Eigenschaften

- `size: number` - Aktuelle Anzahl der Elemente im Cache

### Methoden

#### Auf Elemente zugreifen

```typescript
// Wert nach Schlüssel abrufen - O(1)
const value = cache.get('key');

// Prüfen ob Schlüssel existiert - O(1)
const exists = cache.has('key');
```

:::tip LRU-Verhalten
Der Zugriff auf ein Element mit `get()` markiert es als zuletzt verwendet und verschiebt es an den Anfang des Caches.
:::

#### Elemente hinzufügen/aktualisieren

```typescript
// Eintrag hinzufügen oder aktualisieren - O(1)
cache.put('key', value);
```

:::info Kapazitätsverwaltung
Wenn ein Eintrag zu einem vollen Cache hinzugefügt wird, wird der am längsten nicht verwendete Eintrag automatisch entfernt.
:::

#### Elemente entfernen

```typescript
// Bestimmten Eintrag entfernen - O(1)
const removed = cache.delete('key');

// Alle Einträge entfernen - O(1)
cache.clear();
```

#### Iteration

```typescript
// Alle Einträge abrufen (vom zuletzt zum am längsten nicht verwendet)
const entries = cache.entries();

// Über Cache-Einträge iterieren
for (const [key, value] of cache) {
  console.log(key, value);
}
```

## Beispiele

### Grundlegende Verwendung

```typescript
const cache = new LRUCache<string, number>({ capacity: 3 });

// Einige Einträge hinzufügen
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);

console.log(cache.get('a')); // 1
console.log(cache.size); // 3

// Neuen Eintrag hinzufügen wenn Kapazität erreicht
cache.put('d', 4); // Entfernt "b" (am längsten nicht verwendet)

console.log(cache.has('b')); // false
console.log([...cache]); // [["d", 4], ["c", 3], ["a", 1]]
```

### API-Antwort-Caching

```typescript
interface APIResponse {
  data: unknown;
  timestamp: number;
}

const apiCache = new LRUCache<string, APIResponse>({ capacity: 100 });

async function fetchWithCache(url: string): Promise<unknown> {
  // Zuerst Cache prüfen
  const cached = apiCache.get(url);
  if (cached) {
    console.log('Cache-Treffer!');
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
await fetchWithCache('/api/users'); // Cache-Treffer!
```

### Datenbank-Abfrage-Caching

```typescript
interface QueryResult {
  rows: unknown[];
  count: number;
}

const queryCache = new LRUCache<string, QueryResult>({ capacity: 50 });

function executeQuery(sql: string): QueryResult {
  // Cache prüfen
  const cached = queryCache.get(sql);
  if (cached) {
    return cached;
  }

  // Abfrage ausführen (teure Operation)
  const result = database.execute(sql);

  // Ergebnis cachen
  queryCache.put(sql, result);

  return result;
}
```

### Zeitbasierte Ablaufzeit

```typescript
const sessionCache = new LRUCache<string, object>({
  capacity: 1000,
  ttl: 3600000, // 1 Stunde in Millisekunden
});

// Benutzersession speichern
sessionCache.put('session-123', {
  userId: 'user-456',
  loginTime: Date.now(),
});

// Nach 1 Stunde läuft die Session automatisch ab
setTimeout(() => {
  console.log(sessionCache.get('session-123')); // undefined (abgelaufen)
}, 3600001);
```

### Bild-Thumbnail-Cache

```typescript
interface Thumbnail {
  url: string;
  width: number;
  height: number;
  data: ArrayBuffer;
}

const thumbnailCache = new LRUCache<string, Thumbnail>({ capacity: 50 });

async function getThumbnail(imageUrl: string): Promise<Thumbnail> {
  // Cache prüfen
  const cached = thumbnailCache.get(imageUrl);
  if (cached) {
    console.log('Gecachtes Thumbnail zurückgeben');
    return cached;
  }

  // Thumbnail generieren (teure Operation)
  const thumbnail = await generateThumbnail(imageUrl);

  // Ergebnis cachen
  thumbnailCache.put(imageUrl, thumbnail);

  return thumbnail;
}
```

### Benutzerprofil-Cache

```typescript
interface UserProfile {
  id: number;
  name: string;
  email: string;
  preferences: object;
}

const profileCache = new LRUCache<number, UserProfile>({
  capacity: 200,
  ttl: 1800000, // 30 Minuten
});

async function getUserProfile(userId: number): Promise<UserProfile> {
  // Versuchen aus Cache abzurufen
  const cached = profileCache.get(userId);
  if (cached) {
    return cached;
  }

  // Aus Datenbank laden
  const profile = await db.users.findById(userId);

  // Benutzerprofil cachen
  profileCache.put(userId, profile);

  return profile;
}

// Verwendung
const profile = await getUserProfile(123);
console.log(profile.name);

// Nachfolgende Aufrufe treffen den Cache
const cachedProfile = await getUserProfile(123); // Schnell!
```

### DNS-Abfrage-Cache

```typescript
interface DNSRecord {
  domain: string;
  ip: string;
  ttl: number;
}

const dnsCache = new LRUCache<string, DNSRecord>({
  capacity: 1000,
  ttl: 300000, // 5 Minuten
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

### Berechnungsergebnis-Caching (Memoization)

```typescript
// Teure Fibonacci-Berechnung
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

console.log(fibonacci(40)); // Erster Durchlauf: langsam
console.log(fibonacci(40)); // Zweiter Durchlauf: schnell (gecacht)
```

## Zeitkomplexität

| Operation | Durchschnitt | Schlimmstenfalls |
| --------- | ------------ | ---------------- |
| get       | O(1)         | O(1)             |
| put       | O(1)         | O(1)             |
| has       | O(1)         | O(1)             |
| delete    | O(1)         | O(1)             |
| clear     | O(1)         | O(1)             |

## Best Practices

### Wann LRUCache verwenden

- ✅ Caching mit begrenztem Speicherverbrauch erforderlich
- ✅ Kürzlich zugegriffene Daten werden wahrscheinlich erneut benötigt
- ✅ Caching von API-Antworten, Datenbankabfragen oder Berechnungsergebnissen
- ✅ Automatisches Entfernen der ältesten/am wenigsten genutzten Einträge erforderlich

### Kapazitätsplanung

```typescript
// Speicherverbrauch berücksichtigen
const smallCache = new LRUCache({ capacity: 10 }); // Kleine Anwendung
const mediumCache = new LRUCache({ capacity: 100 }); // Mittlere Anwendung
const largeCache = new LRUCache({ capacity: 1000 }); // Große Anwendung

// Nach Datengröße anpassen
const imageCache = new LRUCache({ capacity: 20 }); // Große Objekte
const stringCache = new LRUCache({ capacity: 1000 }); // Kleine Objekte
```

### TTL Best Practices

```typescript
// API-Antworten: Kurze TTL
const apiCache = new LRUCache({
  capacity: 100,
  ttl: 60000, // 1 Minute
});

// Benutzersessions: Mittlere TTL
const sessionCache = new LRUCache({
  capacity: 1000,
  ttl: 3600000, // 1 Stunde
});

// Konfigurationsdaten: Lange TTL
const configCache = new LRUCache({
  capacity: 50,
  ttl: 86400000, // 24 Stunden
});
```

## Implementierungsdetails

LRUCache verwendet intern eine Kombination aus **Hash Map** und **Doubly Linked List**:

- Hash Map bietet O(1) Schlüsselsuche
- Doubly Linked List verwaltet Zugriffssortierung
- Zuletzt verwendete Einträge sind vorne
- Am längsten nicht verwendete Einträge sind hinten

## Verwandte Datenstrukturen

- **Map** - Grundlegende Schlüssel-Wert-Speicherung ohne Kapazitätsbegrenzung
- **BiDirectionalMap** - Bidirektionale Map ohne LRU-Verhalten
- **SortedMap** - Nach Schlüsseln sortierte Map ohne LRU-Verhalten
