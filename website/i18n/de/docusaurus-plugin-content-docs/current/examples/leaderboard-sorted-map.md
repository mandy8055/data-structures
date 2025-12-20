---
id: leaderboard-sorted-map
title: Leaderboard System
sidebar_label: Leaderboard System
description: Eine Spiel-Bestenliste mit SortedMap für rangierte Spieler erstellen
keywords: [sorted-map, leaderboard, ranking, game, example]
---

# Leaderboard System mit SortedMap

Erstellen Sie eine Spiel-Bestenliste, die Spieler in Punktereihenfolge verwaltet.

## Implementierung

```typescript
import { SortedMap } from '@msnkr/data-structures';

interface PlayerScore {
  username: string;
  timestamp: Date;
}

// Sortiert nach Punktzahl (höher ist besser)
const leaderboard = new SortedMap<number, PlayerScore>({
  comparator: (a, b) => b - a, // Absteigende Reihenfolge
});

// Spielerpunktzahlen hinzufügen
leaderboard.set(100, { username: 'alice', timestamp: new Date() });
leaderboard.set(250, { username: 'bob', timestamp: new Date() });
leaderboard.set(180, { username: 'charlie', timestamp: new Date() });

// Top-Spieler abrufen
const [topScore, topPlayer] = leaderboard.firstEntry();
console.log(`${topPlayer.username} leads with ${topScore} points!`);
// Ausgabe: "bob leads with 250 points!"

// Top 3 anzeigen
let rank = 1;
for (const [score, player] of leaderboard) {
  console.log(`#${rank}: ${player.username} - ${score} points`);
  if (rank++ === 3) break;
}
```

## Ausgabe

```
#1: bob - 250 points
#2: charlie - 180 points
#3: alice - 100 points
```

## Spielerpunktzahl aktualisieren

```typescript
// Punktzahl aktualisieren (alte entfernen, neue hinzufügen)
leaderboard.delete(100); // Alices alte Punktzahl entfernen
leaderboard.set(300, { username: 'alice', timestamp: new Date() }); // Neue Top-Punktzahl!
```

## Siehe auch

- [SortedMap API-Referenz](../api/sorted-map.md)
