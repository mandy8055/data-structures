---
id: sorted-map
title: SortedMap
sidebar_label: SortedMap
description: Schlüssel-Wert-Map mit O(log n) Operationen und sortierter Schlüssel-Iteration
keywords:
  [
    sorted-map,
    red-black-tree,
    ordered-map,
    data-structure,
    typescript,
    javascript,
  ]
---

import InstallTabs from '@site/src/components/InstallTabs';

# SortedMap

Generische Schlüssel-Wert-Sammlung, die Einträge nach Schlüsseln unter Verwendung eines Rot-Schwarz-Baums sortiert hält und O(log n) Leistung für die meisten Operationen sowie geordnete Iteration gewährleistet.

## Installation

<InstallTabs packageName='@msnkr/data-structures' importName='SortedMap' />

## Verwendung

```typescript
import { SortedMap } from '@msnkr/data-structures';

const map = new SortedMap<number, string>();
```

## API-Referenz

### Eigenschaften

- `size: number` - Anzahl der Schlüssel-Wert-Paare in der Map
- `isEmpty(): boolean` - Ob die Map leer ist

### Methoden

#### Map-Operationen

```typescript
// Schlüssel-Wert-Paar setzen - O(log n)
map.set(key, value);

// Wert nach Schlüssel abrufen - O(log n)
const value = map.get(key);

// Prüfen ob Schlüssel existiert - O(log n)
const exists = map.has(key);

// Eintrag nach Schlüssel löschen - O(log n)
const deleted = map.delete(key);
```

:::tip Leistung
Alle grundlegenden Operationen erfolgen in O(log n), wodurch SortedMap auch für große Datensätze effizient ist und dabei die sortierte Reihenfolge beibehält.
:::

#### Min/Max-Operationen

```typescript
// Minimalen Schlüssel abrufen - O(log n)
const first = map.firstKey();

// Maximalen Schlüssel abrufen - O(log n)
const last = map.lastKey();

// Eintrag des minimalen Schlüssels abrufen - O(log n)
const [firstKey, firstValue] = map.firstEntry();

// Eintrag des maximalen Schlüssels abrufen - O(log n)
const [lastKey, lastValue] = map.lastEntry();
```

#### Sammlungsoperationen

```typescript
// Alle Schlüssel in sortierter Reihenfolge abrufen - O(n)
const keys = map.keys();

// Alle Werte in Schlüssel-Sortierreihenfolge abrufen - O(n)
const values = map.values();

// Alle Einträge in Schlüssel-Sortierreihenfolge abrufen - O(n)
const entries = map.entries();

// Alle Einträge löschen - O(1)
map.clear();
```

#### Iteration

```typescript
// Über Einträge in Schlüssel-Sortierreihenfolge iterieren
for (const [key, value] of map) {
  console.log(key, value);
}

// forEach-Iteration
map.forEach((value, key, map) => {
  console.log(key, value);
});
```

:::info Sortierte Iteration
Im Gegensatz zu regulären Maps garantiert SortedMap die Iteration in Schlüssel-Sortierreihenfolge.
:::

## Beispiele

### Grundlegende Zahlen-String-Map

```typescript
const map = new SortedMap<number, string>();

map.set(5, 'five');
map.set(3, 'three');
map.set(7, 'seven');
map.set(1, 'one');

console.log(map.get(3)); // "three"
console.log(map.firstKey()); // 1
console.log(map.lastKey()); // 7

// In sortierter Schlüssel-Reihenfolge iterieren
for (const [key, value] of map) {
  console.log(key, value);
}
// Ausgabe:
// 1 "one"
// 3 "three"
// 5 "five"
// 7 "seven"
```

### Bestenlisten-System

```typescript
interface PlayerScore {
  username: string;
  timestamp: Date;
}

// Nach Punktzahl sortieren (höher ist besser)
const leaderboard = new SortedMap<number, PlayerScore>({
  comparator: (a, b) => b - a, // Absteigend
});

leaderboard.set(100, { username: 'alice', timestamp: new Date() });
leaderboard.set(250, { username: 'bob', timestamp: new Date() });
leaderboard.set(180, { username: 'charlie', timestamp: new Date() });

// Top-Spieler abrufen
const [topScore, topPlayer] = leaderboard.firstEntry();
console.log(`${topPlayer.username} führt mit ${topScore} Punkten!`);

// Von hoher zu niedriger Punktzahl iterieren
for (const [score, player] of leaderboard) {
  console.log(`${player.username}: ${score}`);
}
// Ausgabe:
// bob: 250
// charlie: 180
// alice: 100
```

### Zeitreihendaten-Speicher

```typescript
interface DataPoint {
  value: number;
  source: string;
}

const timeSeries = new SortedMap<Date, DataPoint>({
  comparator: (a, b) => a.getTime() - b.getTime(),
});

timeSeries.set(new Date('2025-12-17T10:00'), { value: 42, source: 'sensor1' });
timeSeries.set(new Date('2025-12-17T09:00'), { value: 38, source: 'sensor1' });
timeSeries.set(new Date('2025-12-17T11:00'), { value: 45, source: 'sensor1' });

// Frühesten Datenpunkt abrufen
const [earliestTime, earliestData] = timeSeries.firstEntry();
console.log(`Erste Messung: ${earliestData.value} um ${earliestTime}`);

// In chronologischer Reihenfolge iterieren
for (const [timestamp, data] of timeSeries) {
  console.log(`${timestamp.toISOString()}: ${data.value}`);
}
```

### Benutzerdefinierte Objekt-Schlüssel mit Comparator

```typescript
interface User {
  id: number;
  name: string;
}

const userMap = new SortedMap<User, string>({
  comparator: (a, b) => a.id - b.id,
});

userMap.set({ id: 3, name: 'Charlie' }, 'admin');
userMap.set({ id: 1, name: 'Alice' }, 'user');
userMap.set({ id: 2, name: 'Bob' }, 'moderator');

// In Benutzer-ID-Reihenfolge iterieren
for (const [user, role] of userMap) {
  console.log(`${user.name} (ID: ${user.id}): ${role}`);
}
// Ausgabe:
// Alice (ID: 1): user
// Bob (ID: 2): moderator
// Charlie (ID: 3): admin
```

### Veranstaltungskalender

```typescript
interface Event {
  title: string;
  location: string;
  attendees: number;
}

const calendar = new SortedMap<Date, Event>({
  comparator: (a, b) => a.getTime() - b.getTime(),
});

calendar.set(new Date('2025-12-20T10:00'), {
  title: 'Team-Meeting',
  location: 'Raum A',
  attendees: 8,
});

calendar.set(new Date('2025-12-18T14:00'), {
  title: 'Kundenpräsentation',
  location: 'Online',
  attendees: 15,
});

calendar.set(new Date('2025-12-22T09:00'), {
  title: 'Sprint-Planung',
  location: 'Raum B',
  attendees: 6,
});

console.log('Bevorstehende Veranstaltungen:');
for (const [date, event] of calendar) {
  console.log(`${date.toLocaleDateString()}: ${event.title}`);
}
```

### Konfigurationsverwaltung

```typescript
interface Config {
  value: unknown;
  description: string;
}

const settings = new SortedMap<string, Config>();

settings.set('api.timeout', {
  value: 5000,
  description: 'API-Anfrage-Timeout in Millisekunden',
});

settings.set('api.retries', {
  value: 3,
  description: 'Maximale Wiederholungsversuche',
});

settings.set('cache.ttl', {
  value: 3600,
  description: 'Cache Time-to-Live in Sekunden',
});

// Alle Einstellungen alphabetisch auflisten
console.log('Anwendungseinstellungen:');
for (const [key, config] of settings) {
  console.log(`${key}: ${config.value} - ${config.description}`);
}
```

### Punktebereichs-Zuordnung

```typescript
const gradeMap = new SortedMap<number, string>();

gradeMap.set(90, 'A');
gradeMap.set(80, 'B');
gradeMap.set(70, 'C');
gradeMap.set(60, 'D');
gradeMap.set(0, 'F');

function getGrade(score: number): string {
  let grade = 'F';

  for (const [threshold, letter] of gradeMap) {
    if (score >= threshold) {
      grade = letter;
    } else {
      break;
    }
  }

  return grade;
}

console.log(getGrade(95)); // "A"
console.log(getGrade(82)); // "B"
console.log(getGrade(71)); // "C"
console.log(getGrade(55)); // "F"
```

### Versionsverlaufs-Tracking

```typescript
interface Version {
  author: string;
  changes: string[];
  timestamp: Date;
}

const versionHistory = new SortedMap<string, Version>({
  comparator: (a, b) => {
    // Nach semantischer Version sortieren (vereinfacht)
    const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
    const [bMajor, bMinor, bPatch] = b.split('.').map(Number);

    if (aMajor !== bMajor) return aMajor - bMajor;
    if (aMinor !== bMinor) return aMinor - bMinor;
    return aPatch - bPatch;
  },
});

versionHistory.set('1.0.0', {
  author: 'Alice',
  changes: ['Erste Veröffentlichung'],
  timestamp: new Date('2025-01-01'),
});

versionHistory.set('1.2.0', {
  author: 'Charlie',
  changes: ['Neue Funktionen hinzugefügt'],
  timestamp: new Date('2025-03-01'),
});

versionHistory.set('1.1.0', {
  author: 'Bob',
  changes: ['Fehlerbehebungen', 'Leistungsverbesserungen'],
  timestamp: new Date('2025-02-01'),
});

// Verlauf in Versionsreihenfolge anzeigen
console.log('Versionsverlauf:');
for (const [version, info] of versionHistory) {
  console.log(`v${version} von ${info.author}`);
}
// Ausgabe:
// v1.0.0 von Alice
// v1.1.0 von Bob
// v1.2.0 von Charlie
```

### Prioritäts-Aufgabenwarteschlange

```typescript
interface Task {
  title: string;
  description: string;
  createdAt: Date;
}

// Nach Priorität sortierte Aufgaben (1 = höchste)
const tasksByPriority = new SortedMap<number, Task[]>();

function addTask(priority: number, task: Task): void {
  const tasks = tasksByPriority.get(priority) || [];
  tasks.push(task);
  tasksByPriority.set(priority, tasks);
}

addTask(1, {
  title: 'Kritischen Fehler beheben',
  description: '...',
  createdAt: new Date(),
});
addTask(2, { title: 'Dokumentation aktualisieren', description: '...', createdAt: new Date() });
addTask(1, { title: 'Hotfix deployen', description: '...', createdAt: new Date() });
addTask(3, { title: 'Code refactoren', description: '...', createdAt: new Date() });

// Aufgaben nach Priorität verarbeiten
console.log('Aufgaben nach Priorität:');
for (const [priority, tasks] of tasksByPriority) {
  console.log(`\nPriorität ${priority}:`);
  tasks.forEach((task) => console.log(`  - ${task.title}`));
}
```

## Zeitkomplexität

| Operation  | Durchschnitt | Schlimmstenfalls |
| ---------- | ------------ | ---------------- |
| set        | O(log n)     | O(log n)         |
| get        | O(log n)     | O(log n)         |
| has        | O(log n)     | O(log n)         |
| delete     | O(log n)     | O(log n)         |
| firstKey   | O(log n)     | O(log n)         |
| lastKey    | O(log n)     | O(log n)         |
| firstEntry | O(log n)     | O(log n)         |
| lastEntry  | O(log n)     | O(log n)         |
| keys       | O(n)         | O(n)             |
| values     | O(n)         | O(n)             |
| entries    | O(n)         | O(n)             |
| clear      | O(1)         | O(1)             |

## Vergleich mit anderen Datenstrukturen

| Merkmal         | SortedMap    | Map                | Object                      |
| --------------- | ------------ | ------------------ | --------------------------- |
| Schlüsselreihenfolge | ✅ Sortiert | ❌ Einfügereihenfolge | ❌ Keine Garantie     |
| set/get         | O(log n)     | O(1) avg           | O(1) avg                    |
| Geordnete Iteration | ✅ Ja    | ❌ Nein            | ❌ Nein                     |
| Min/Max-Schlüssel | O(log n)   | O(n)               | O(n)                        |
| Beliebige Schlüsseltypen | ✅ Ja | ✅ Ja            | ❌ Nur String/Symbol        |

## Best Practices

### Wann SortedMap verwenden

- ✅ Schlüssel-Wert-Paare in Schlüssel-Sortierreihenfolge pflegen erforderlich
- ✅ Häufiger Zugriff auf Min/Max-Schlüssel
- ✅ Zeitreihendaten oder Event-Logs
- ✅ Bestenlisten oder Prioritätssysteme
- ✅ Konfigurationsverwaltung mit sortierten Schlüsseln erforderlich
- ✅ Bereichsabfragen (Schlüssel in einem Bereich finden)

### Wann SortedMap nicht verwenden

- ❌ Sortierung nicht erforderlich (verwenden Sie Map)
- ❌ O(1) Zugriff erforderlich (verwenden Sie Map oder Object)
- ❌ Schlüssel sind nicht vergleichbar
- ❌ Selten iteriert

### Comparator-Tipps

```typescript
// Zahlenschlüssel (aufsteigend, Standard)
const numbers = new SortedMap<number, string>();

// Zahlenschlüssel (absteigend)
const descending = new SortedMap<number, string>({
  comparator: (a, b) => b - a,
});

// Stringschlüssel (Groß-/Kleinschreibung-unabhängig)
const caseInsensitive = new SortedMap<string, unknown>({
  comparator: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
});

// Datumsschlüssel
const dates = new SortedMap<Date, unknown>({
  comparator: (a, b) => a.getTime() - b.getTime(),
});

// Benutzerdefinierte Objektschlüssel
const custom = new SortedMap<MyObject, unknown>({
  comparator: (a, b) => {
    // Benutzerdefinierte Vergleichslogik
    return a.id - b.id;
  },
});
```

## Verwandte Datenstrukturen

- **Map** - Ungeordnete Schlüssel-Wert-Map mit O(1) Operationen
- **RedBlackTree** - Zugrundeliegende Baumimplementierung
- **BiDirectionalMap** - Bidirektionale Map ohne Sortierung
- **LRUCache** - Cache mit Entfernungsstrategie
