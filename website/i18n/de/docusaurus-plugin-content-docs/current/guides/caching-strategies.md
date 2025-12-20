---
id: caching-strategies
title: Caching-Strategien mit LRUCache
sidebar_label: Caching-Strategien
description: Umfassender Leitfaden zu Caching-Mustern mit LRUCache
keywords: [lru-cache, caching, strategies, patterns, ttl, eviction]
---

# Caching-Strategien mit LRUCache

Lernen Sie effektive Caching-Muster kennen, um die Anwendungsleistung mit LRUCache zu verbessern.

## Warum LRUCache verwenden?

LRUCache entfernt automatisch die **Least Recently Used** (am wenigsten kürzlich verwendeten) Elemente, wenn die Kapazität erreicht ist, was es ideal macht für:

- API Response Caching
- Datenbank-Abfrageergebnisse
- Berechnete Werte
- Session-Daten
- Statische Assets

## Grundlegendes LRU-Muster

```typescript
import { LRUCache } from '@msnkr/data-structures';

const cache = new LRUCache<string, any>({ capacity: 100 });

function getCachedData(key: string): any {
  // Zuerst Cache prüfen
  let data = cache.get(key);
  if (data) {
    return data; // Cache-Treffer
  }

  // Cache-Fehltreffer - Daten abrufen
  data = fetchExpensiveData(key);
  cache.put(key, data);
  return data;
}
```

## Time-To-Live (TTL) Caching

Cache-Einträge automatisch nach einer Zeitperiode ablaufen lassen.

### Session-Caching

```typescript
interface Session {
  userId: string;
  loginTime: number;
  data: Record<string, unknown>;
}

const sessionCache = new LRUCache<string, Session>({
  capacity: 1000,
  ttl: 3600000, // 1 Stunde in Millisekunden
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
  return sessionCache.get(sessionId); // Gibt undefined zurück, wenn abgelaufen
}

// Nach 1 Stunde läuft die Session automatisch ab
```

### API-Rate-Limiting mit TTL

```typescript
const rateLimiter = new LRUCache<string, number>({
  capacity: 10000,
  ttl: 60000, // 1 Minute
});

function checkRateLimit(userId: string, maxRequests: number): boolean {
  const count = rateLimiter.get(userId) || 0;

  if (count >= maxRequests) {
    return false; // Rate Limit überschritten
  }

  rateLimiter.put(userId, count + 1);
  return true;
}

// Verwendung
if (checkRateLimit('user-123', 100)) {
  // Anfrage verarbeiten
} else {
  // 429 Too Many Requests zurückgeben
}
```

## Multi-Layer Caching

Mehrere Cache-Ebenen für optimale Leistung kombinieren.

```typescript
class MultiLayerCache<K, V> {
  private l1Cache: LRUCache<K, V>; // Klein, schnell
  private l2Cache: LRUCache<K, V>; // Größer, langsamer

  constructor(l1Size: number, l2Size: number) {
    this.l1Cache = new LRUCache({ capacity: l1Size });
    this.l2Cache = new LRUCache({ capacity: l2Size });
  }

  get(key: K): V | undefined {
    // Zuerst L1 prüfen
    let value = this.l1Cache.get(key);
    if (value !== undefined) {
      return value; // L1-Treffer
    }

    // L2 prüfen
    value = this.l2Cache.get(key);
    if (value !== undefined) {
      // Zu L1 befördern
      this.l1Cache.put(key, value);
      return value; // L2-Treffer
    }

    return undefined; // Cache-Fehltreffer
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

// Verwendung: Schneller Cache für heiße Daten, langsamer für warme Daten
const cache = new MultiLayerCache<string, object>(50, 500);
```

## Cache-Invalidierungs-Muster

### Manuelle Invalidierung

```typescript
const userCache = new LRUCache<number, User>({ capacity: 100 });

function updateUser(id: number, updates: Partial<User>): void {
  // Datenbank aktualisieren
  database.update('users', id, updates);

  // Cache invalidieren
  userCache.delete(id);

  // Oder Cache direkt aktualisieren
  const user = userCache.get(id);
  if (user) {
    Object.assign(user, updates);
    userCache.put(id, user);
  }
}
```

### Musterbasierte Invalidierung

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

// Alle Cache-Einträge für Benutzer 1 invalidieren
cache.invalidateByPrefix('user:1:');
```

### Zeitbasierte Invalidierung

```typescript
interface CachedValue<T> {
  data: T;
  timestamp: number;
  ttl: number; // Benutzerdefinierte TTL pro Eintrag
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

    // Prüfen, ob abgelaufen
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return cached.data;
  }
}

const cache = new SmartCache<string, object>();
cache.put('short-lived', data1, 60000); // 1 Minute
cache.put('long-lived', data2, 3600000); // 1 Stunde
```

## Cache-Vorwärmung

Häufig abgerufene Daten in den Cache vorladen.

```typescript
async function warmCache(): Promise<void> {
  console.log('Cache wird vorgewärmt...');

  // Beliebte Artikel laden
  const popularIds = await database.query(
    'SELECT id FROM products ORDER BY views DESC LIMIT 100',
  );

  for (const { id } of popularIds) {
    const product = await database.get('products', id);
    cache.put(id, product);
  }

  console.log(`Cache mit ${popularIds.length} Artikeln vorgewärmt`);
}

// Cache beim Anwendungsstart vorwärmen
await warmCache();
```

## Cache-Überwachung

Cache-Leistungsmetriken verfolgen.

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

// Cache-Leistung überwachen
setInterval(() => {
  const stats = cache.getStats();
  console.log(`Cache-Statistiken: ${stats.hitRate.toFixed(2)}% Trefferquote`);
  console.log(`Treffer: ${stats.hits}, Fehltreffer: ${stats.misses}`);
}, 60000); // Jede Minute
```

## Best Practices

### 1. Angemessene Kapazität wählen

```typescript
// Zu klein: häufige Entfernungen
const tooSmall = new LRUCache({ capacity: 10 });

// Zu groß: Speicherprobleme
const tooLarge = new LRUCache({ capacity: 1000000 });

// Genau richtig: basierend auf Working Set Size
const optimal = new LRUCache({ capacity: 1000 });
```

### 2. TTL für zeitkritische Daten verwenden

```typescript
// Sessions laufen ab
const sessions = new LRUCache({ capacity: 5000, ttl: 3600000 });

// Statische Daten können länger leben
const staticData = new LRUCache({ capacity: 100, ttl: 86400000 }); // 24h
```

### 3. Nur teure Operationen cachen

```typescript
// ✅ Gut: Teure Operationen cachen
async function getAggregatedReport(userId: string) {
  const cached = reportCache.get(userId);
  if (cached) return cached;

  // Teuer: mehrere DB-Abfragen + Berechnung
  const report = await generateComplexReport(userId);
  reportCache.put(userId, report);
  return report;
}

// ❌ Schlecht: Triviale Operationen nicht cachen
function addNumbers(a: number, b: number) {
  // Dies nicht cachen!
  return a + b;
}
```

### 4. Cache-Fehler elegant behandeln

```typescript
async function fetchWithCache(key: string): Promise<Data> {
  try {
    const cached = cache.get(key);
    if (cached) return cached;
  } catch (error) {
    console.error('Cache-Lesefehler:', error);
    // Ohne Cache fortfahren
  }

  const data = await fetchFromSource(key);

  try {
    cache.put(key, data);
  } catch (error) {
    console.error('Cache-Schreibfehler:', error);
    // Ohne Caching fortfahren
  }

  return data;
}
```

## Häufige Fallstricke

### 1. Cache Stampede

**Problem:** Mehrere Anfragen für dieselben nicht gecachten Daten treffen gleichzeitig auf das Backend.

**Lösung:** Promise-Caching verwenden

```typescript
const promiseCache = new Map<string, Promise<any>>();

async function fetchWithPromiseCache(key: string): Promise<any> {
  // Ergebnis-Cache prüfen
  const cached = cache.get(key);
  if (cached) return cached;

  // Prüfen, ob bereits abgerufen wird
  let promise = promiseCache.get(key);
  if (promise) return promise;

  // Abruf starten
  promise = fetchExpensiveData(key).then((data) => {
    cache.put(key, data);
    promiseCache.delete(key);
    return data;
  });

  promiseCache.set(key, promise);
  return promise;
}
```

### 2. Veraltete Daten

**Problem:** Cache enthält veraltete Daten nach Aktualisierungen.

**Lösung:** Bei Schreibvorgang invalidieren

```typescript
function updateData(id: string, data: any): void {
  database.update(id, data);
  cache.delete(id); // Sofort invalidieren
}
```

## Verwandte Themen

- [API Response Cache Beispiel](../examples/api-response-cache.md)
- [Database Query Cache Beispiel](../examples/database-query-cache.md)
- [Image Thumbnail Cache Beispiel](../examples/image-thumbnail-cache.md)
- [LRUCache API-Referenz](../api/lru-cache.md)
