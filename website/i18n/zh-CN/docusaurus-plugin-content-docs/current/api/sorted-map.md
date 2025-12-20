---
id: sorted-map
title: SortedMap
sidebar_label: SortedMap
description: 键值映射，具有 O(log n) 操作和排序键迭代
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

通用键值集合，使用红黑树按键维护条目排序，确保大多数操作的 O(log n) 性能和有序迭代。

## 安装

<InstallTabs packageName='@msnkr/data-structures' importName='SortedMap' />

## 使用方法

```typescript
import { SortedMap } from '@msnkr/data-structures';

const map = new SortedMap<number, string>();
```

## API 参考

### 属性

- `size: number` - 映射中键值对的数量
- `isEmpty(): boolean` - 映射是否为空

### 方法

#### 映射操作

```typescript
// 设置键值对 - O(log n)
map.set(key, value);

// 通过键获取值 - O(log n)
const value = map.get(key);

// 检查键是否存在 - O(log n)
const exists = map.has(key);

// 通过键删除条目 - O(log n)
const deleted = map.delete(key);
```

:::tip 性能
所有基本操作都是 O(log n)，使得 SortedMap 即使对于大型数据集也很高效，同时保持排序顺序。
:::

#### 最小/最大操作

```typescript
// 获取最小键 - O(log n)
const first = map.firstKey();

// 获取最大键 - O(log n)
const last = map.lastKey();

// 获取最小键的条目 - O(log n)
const [firstKey, firstValue] = map.firstEntry();

// 获取最大键的条目 - O(log n)
const [lastKey, lastValue] = map.lastEntry();
```

#### 集合操作

```typescript
// 按排序顺序获取所有键 - O(n)
const keys = map.keys();

// 按键排序顺序获取所有值 - O(n)
const values = map.values();

// 按键排序顺序获取所有条目 - O(n)
const entries = map.entries();

// 删除所有条目 - O(1)
map.clear();
```

#### 迭代

```typescript
// 按键排序顺序迭代条目
for (const [key, value] of map) {
  console.log(key, value);
}

// forEach 迭代
map.forEach((value, key, map) => {
  console.log(key, value);
});
```

:::info 排序迭代
与常规 Map 不同，SortedMap 保证按键排序顺序迭代。
:::

## 示例

### 基本数字-字符串映射

```typescript
const map = new SortedMap<number, string>();

map.set(5, 'five');
map.set(3, 'three');
map.set(7, 'seven');
map.set(1, 'one');

console.log(map.get(3)); // "three"
console.log(map.firstKey()); // 1
console.log(map.lastKey()); // 7

// 按排序键顺序迭代
for (const [key, value] of map) {
  console.log(key, value);
}
// 输出：
// 1 "one"
// 3 "three"
// 5 "five"
// 7 "seven"
```

### 排行榜系统

```typescript
interface PlayerScore {
  username: string;
  timestamp: Date;
}

// 按分数排序（更高更好）
const leaderboard = new SortedMap<number, PlayerScore>({
  comparator: (a, b) => b - a, // 降序
});

leaderboard.set(100, { username: 'alice', timestamp: new Date() });
leaderboard.set(250, { username: 'bob', timestamp: new Date() });
leaderboard.set(180, { username: 'charlie', timestamp: new Date() });

// 获取顶级玩家
const [topScore, topPlayer] = leaderboard.firstEntry();
console.log(`${topPlayer.username} 以 ${topScore} 分领先！`);

// 从高到低迭代分数
for (const [score, player] of leaderboard) {
  console.log(`${player.username}: ${score}`);
}
// 输出：
// bob: 250
// charlie: 180
// alice: 100
```

### 时间序列数据存储

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

// 获取最早的数据点
const [earliestTime, earliestData] = timeSeries.firstEntry();
console.log(`首次读数：${earliestData.value} 于 ${earliestTime}`);

// 按时间顺序迭代
for (const [timestamp, data] of timeSeries) {
  console.log(`${timestamp.toISOString()}: ${data.value}`);
}
```

### 使用比较器的自定义对象键

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

// 按用户 ID 顺序迭代
for (const [user, role] of userMap) {
  console.log(`${user.name} (ID: ${user.id}): ${role}`);
}
// 输出：
// Alice (ID: 1): user
// Bob (ID: 2): moderator
// Charlie (ID: 3): admin
```

### 事件日历

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
  title: '团队会议',
  location: '会议室 A',
  attendees: 8,
});

calendar.set(new Date('2025-12-18T14:00'), {
  title: '客户演示',
  location: '在线',
  attendees: 15,
});

calendar.set(new Date('2025-12-22T09:00'), {
  title: '冲刺规划',
  location: '会议室 B',
  attendees: 6,
});

console.log('即将到来的事件：');
for (const [date, event] of calendar) {
  console.log(`${date.toLocaleDateString()}: ${event.title}`);
}
```

### 配置管理

```typescript
interface Config {
  value: unknown;
  description: string;
}

const settings = new SortedMap<string, Config>();

settings.set('api.timeout', {
  value: 5000,
  description: 'API 请求超时（毫秒）',
});

settings.set('api.retries', {
  value: 3,
  description: '最大重试次数',
});

settings.set('cache.ttl', {
  value: 3600,
  description: '缓存生存时间（秒）',
});

// 按字母顺序列出所有设置
console.log('应用程序设置：');
for (const [key, config] of settings) {
  console.log(`${key}: ${config.value} - ${config.description}`);
}
```

### 分数区间映射

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

### 版本历史跟踪

```typescript
interface Version {
  author: string;
  changes: string[];
  timestamp: Date;
}

const versionHistory = new SortedMap<string, Version>({
  comparator: (a, b) => {
    // 按语义版本排序（简化）
    const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
    const [bMajor, bMinor, bPatch] = b.split('.').map(Number);

    if (aMajor !== bMajor) return aMajor - bMajor;
    if (aMinor !== bMinor) return aMinor - bMinor;
    return aPatch - bPatch;
  },
});

versionHistory.set('1.0.0', {
  author: 'Alice',
  changes: ['初始发布'],
  timestamp: new Date('2025-01-01'),
});

versionHistory.set('1.2.0', {
  author: 'Charlie',
  changes: ['添加新功能'],
  timestamp: new Date('2025-03-01'),
});

versionHistory.set('1.1.0', {
  author: 'Bob',
  changes: ['错误修复', '性能改进'],
  timestamp: new Date('2025-02-01'),
});

// 按版本顺序显示历史
console.log('版本历史：');
for (const [version, info] of versionHistory) {
  console.log(`v${version} by ${info.author}`);
}
// 输出：
// v1.0.0 by Alice
// v1.1.0 by Bob
// v1.2.0 by Charlie
```

### 优先级任务队列

```typescript
interface Task {
  title: string;
  description: string;
  createdAt: Date;
}

// 按优先级排序的任务（1 = 最高）
const tasksByPriority = new SortedMap<number, Task[]>();

function addTask(priority: number, task: Task): void {
  const tasks = tasksByPriority.get(priority) || [];
  tasks.push(task);
  tasksByPriority.set(priority, tasks);
}

addTask(1, {
  title: '修复严重错误',
  description: '...',
  createdAt: new Date(),
});
addTask(2, { title: '更新文档', description: '...', createdAt: new Date() });
addTask(1, { title: '部署热修复', description: '...', createdAt: new Date() });
addTask(3, { title: '重构代码', description: '...', createdAt: new Date() });

// 按优先级处理任务
console.log('按优先级排序的任务：');
for (const [priority, tasks] of tasksByPriority) {
  console.log(`\n优先级 ${priority}：`);
  tasks.forEach((task) => console.log(`  - ${task.title}`));
}
```

## 时间复杂度

| 操作       | 平均     | 最坏     |
| ---------- | -------- | -------- |
| set        | O(log n) | O(log n) |
| get        | O(log n) | O(log n) |
| has        | O(log n) | O(log n) |
| delete     | O(log n) | O(log n) |
| firstKey   | O(log n) | O(log n) |
| lastKey    | O(log n) | O(log n) |
| firstEntry | O(log n) | O(log n) |
| lastEntry  | O(log n) | O(log n) |
| keys       | O(n)     | O(n)     |
| values     | O(n)     | O(n)     |
| entries    | O(n)     | O(n)     |
| clear      | O(1)     | O(1)     |

## 与其他数据结构的比较

| 特性        | SortedMap | Map         | Object           |
| ----------- | --------- | ----------- | ---------------- |
| 键顺序      | ✅ 排序   | ❌ 插入顺序 | ❌ 无保证        |
| set/get     | O(log n)  | O(1) 平均   | O(1) 平均        |
| 有序迭代    | ✅ 是     | ❌ 否       | ❌ 否            |
| 最小/最大键 | O(log n)  | O(n)        | O(n)             |
| 任何键类型  | ✅ 是     | ✅ 是       | ❌ 仅字符串/符号 |

## 最佳实践

### 何时使用 SortedMap

- ✅ 需要按键排序顺序维护键值对
- ✅ 频繁访问最小/最大键
- ✅ 时间序列数据或事件日志
- ✅ 排行榜或优先级系统
- ✅ 配置管理需要排序键
- ✅ 范围查询（在范围内查找键）

### 何时不使用 SortedMap

- ❌ 不需要排序（使用 Map）
- ❌ 需要 O(1) 访问（使用 Map 或 Object）
- ❌ 键不可比较
- ❌ 很少迭代

### 比较器提示

```typescript
// 数字键（升序，默认）
const numbers = new SortedMap<number, string>();

// 数字键（降序）
const descending = new SortedMap<number, string>({
  comparator: (a, b) => b - a,
});

// 字符串键（不区分大小写）
const caseInsensitive = new SortedMap<string, unknown>({
  comparator: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
});

// 日期键
const dates = new SortedMap<Date, unknown>({
  comparator: (a, b) => a.getTime() - b.getTime(),
});

// 自定义对象键
const custom = new SortedMap<MyObject, unknown>({
  comparator: (a, b) => {
    // 自定义比较逻辑
    return a.id - b.id;
  },
});
```

## 相关数据结构

- **Map** - 无序键值映射，O(1) 操作
- **RedBlackTree** - 底层树实现
- **BiDirectionalMap** - 双向映射，无排序
- **LRUCache** - 缓存，具有驱逐策略
