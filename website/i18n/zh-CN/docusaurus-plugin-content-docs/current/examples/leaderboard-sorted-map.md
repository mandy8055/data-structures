---
id: leaderboard-sorted-map
title: 排行榜系统
sidebar_label: 排行榜系统
description: 使用 SortedMap 构建游戏排行榜，对玩家进行排名
keywords: [sorted-map, leaderboard, ranking, game, example]
---

# 使用 SortedMap 的排行榜系统

创建一个游戏排行榜，按分数顺序维护玩家。

## 实现

```typescript
import { SortedMap } from '@msnkr/data-structures';

interface PlayerScore {
  username: string;
  timestamp: Date;
}

// 按分数排序（越高越好）
const leaderboard = new SortedMap<number, PlayerScore>({
  comparator: (a, b) => b - a, // 降序
});

// 添加玩家分数
leaderboard.set(100, { username: 'alice', timestamp: new Date() });
leaderboard.set(250, { username: 'bob', timestamp: new Date() });
leaderboard.set(180, { username: 'charlie', timestamp: new Date() });

// 获取排名第一的玩家
const [topScore, topPlayer] = leaderboard.firstEntry();
console.log(`${topPlayer.username} 以 ${topScore} 分领先！`);
// 输出："bob 以 250 分领先！"

// 显示前 3 名
let rank = 1;
for (const [score, player] of leaderboard) {
  console.log(`#${rank}：${player.username} - ${score} 分`);
  if (rank++ === 3) break;
}
```

## 输出

```
#1：bob - 250 分
#2：charlie - 180 分
#3：alice - 100 分
```

## 更新玩家分数

```typescript
// 更新分数（删除旧的，添加新的）
leaderboard.delete(100); // 删除 alice 的旧分数
leaderboard.set(300, { username: 'alice', timestamp: new Date() }); // 新的最高分！
```

## 另请参阅

- [SortedMap API 参考](../api/sorted-map.md)
