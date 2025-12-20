---
id: leaderboard-sorted-map
title: Leaderboard System
sidebar_label: Leaderboard System
description: Build a game leaderboard with SortedMap for ranked players
keywords: [sorted-map, leaderboard, ranking, game, example]
---

# Leaderboard System with SortedMap

Create a game leaderboard that maintains players in score order.

## Implementation

```typescript
import { SortedMap } from '@msnkr/data-structures';

interface PlayerScore {
  username: string;
  timestamp: Date;
}

// Sorted by score (higher is better)
const leaderboard = new SortedMap<number, PlayerScore>({
  comparator: (a, b) => b - a, // Descending order
});

// Add player scores
leaderboard.set(100, { username: 'alice', timestamp: new Date() });
leaderboard.set(250, { username: 'bob', timestamp: new Date() });
leaderboard.set(180, { username: 'charlie', timestamp: new Date() });

// Get top player
const [topScore, topPlayer] = leaderboard.firstEntry();
console.log(`${topPlayer.username} leads with ${topScore} points!`);
// Output: "bob leads with 250 points!"

// Display top 3
let rank = 1;
for (const [score, player] of leaderboard) {
  console.log(`#${rank}: ${player.username} - ${score} points`);
  if (rank++ === 3) break;
}
```

## Output

```
#1: bob - 250 points
#2: charlie - 180 points
#3: alice - 100 points
```

## Update Player Score

```typescript
// Update score (remove old, add new)
leaderboard.delete(100); // Remove alice's old score
leaderboard.set(300, { username: 'alice', timestamp: new Date() }); // New top score!
```

## See Also

- [SortedMap API Reference](../api/sorted-map.md)
