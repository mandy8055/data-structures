---
id: choosing-data-structure
title: 选择合适的数据结构
sidebar_label: 选择数据结构
description: 选择最优数据结构的决策指南
keywords: [data-structures, comparison, guide, performance, selection]
---

# 选择合适的数据结构

这是一个全面的指南，帮助您为您的使用场景选择最优的数据结构。

## 快速决策树

```
需要键值映射？
├─ 是 → 需要排序？
│  ├─ 是 → SortedMap
│  └─ 否 → 需要双向查找？
│     ├─ 是 → BiDirectionalMap
│     └─ 否 → JavaScript Map (原生)
│
└─ 否 → 需要有序集合？
   ├─ 基于优先级 → PriorityQueue / BinaryHeap
   ├─ FIFO (队列) → Queue
   ├─ LIFO (栈) → Array 或 Deque
   ├─ 两端操作 → Deque
   ├─ 已排序的唯一值 → RedBlackTree
   ├─ 字符串前缀搜索 → Trie
   ├─ 顺序访问 → LinkedList / DoublyLinkedList
   └─ LRU 缓存 → LRUCache
```

## 按使用场景

### 缓存

| 需求         | 最佳选择                     | 原因                   |
| ------------ | ---------------------------- | ---------------------- |
| 固定大小缓存 | **LRUCache**                 | 自动淘汰最少使用的项   |
| 简单缓存     | JavaScript Map               | 原生、快速、无大小限制 |
| 带 TTL       | **LRUCache** (使用 ttl 选项) | 内置过期机制           |
| 多级缓存     | **LRUCache** + Map           | 分层快速和慢速存储     |

**示例：**

```typescript
const cache = new LRUCache<string, Data>({
  capacity: 100,
  ttl: 300000, // 5 分钟
});
```

### 集合

#### 线性集合

| 需求            | 最佳选择                          | 时间复杂度 |
| --------------- | --------------------------------- | ---------- |
| 在前端添加/删除 | LinkedList                        | O(1)       |
| 在末尾添加/删除 | LinkedList, Array                 | O(1)       |
| 在两端添加/删除 | **DoublyLinkedList** 或 **Deque** | O(1)       |
| 按索引随机访问  | Array                             | O(1)       |
| 顺序迭代        | LinkedList, DoublyLinkedList      | O(n)       |
| 反向迭代        | **DoublyLinkedList**              | O(n)       |

**何时使用 LinkedList vs Array：**

```typescript
// ✅ 使用 LinkedList 当：
// - 频繁在两端插入/删除
// - 大小频繁变化
// - 不需要随机访问
const taskQueue = new LinkedList<Task>();

// ✅ 使用 Array 当：
// - 需要随机访问 (arr[i])
// - 大小相对稳定
// - 频繁的基于索引的操作
const items = [1, 2, 3];
```

#### 队列操作

| 模式            | 最佳选择          | 操作                                               |
| --------------- | ----------------- | -------------------------------------------------- |
| FIFO (先进先出) | **Queue**         | enqueue(), dequeue()                               |
| LIFO (后进先出) | Array (作为栈)    | push(), pop()                                      |
| 基于优先级      | **PriorityQueue** | 按优先级 enqueue(), dequeue()                      |
| 两端操作        | **Deque**         | addFirst(), addLast(), removeFirst(), removeLast() |

**示例场景：**

```typescript
// 任务处理 (FIFO)
const tasks = new Queue<Task>();

// 撤销/重做 (LIFO)
const undoStack: Action[] = [];

// 按优先级处理事件
const events = new PriorityQueue<Event>({
  comparator: (a, b) => a.priority - b.priority,
});

// 滑动窗口
const window = new Deque<number>();
```

### Maps 和查找

| 需求                 | 最佳选择             | 查找时间       |
| -------------------- | -------------------- | -------------- |
| 键 → 值 查找         | JavaScript Map       | O(1) 平均      |
| 键 → 值 和 值 → 键   | **BiDirectionalMap** | O(1)           |
| 按键排序             | **SortedMap**        | O(log n)       |
| 最小/最大键访问      | **SortedMap**        | O(log n)       |
| 基于前缀的字符串查找 | **Trie**             | O(m)，m=键长度 |

**比较：**

```typescript
// 标准 map
const map = new Map<string, number>();
map.set('a', 1);
map.get('a'); // O(1)

// 双向 map
const biMap = new BiDirectionalMap<string, number>();
biMap.set('a', 1);
biMap.get('a'); // O(1) - 通过键获取值
biMap.getKey(1); // O(1) - 通过值获取键

// 已排序 map
const sorted = new SortedMap<number, string>();
sorted.set(3, 'three');
sorted.set(1, 'one');
sorted.firstKey(); // 1 - O(log n)
for (const [k, v] of sorted) {
  // 按排序顺序迭代
}

// Trie 用于字符串
const trie = new Trie<number>();
trie.insert('apple', 1);
trie.getAllWithPrefix('app'); // ['apple'] - O(p+n)
```

### Set 和唯一值

| 需求           | 最佳选择            | 注释             |
| -------------- | ------------------- | ---------------- |
| 唯一值，未排序 | JavaScript Set      | 原生、快速       |
| 唯一值，已排序 | **RedBlackTree**    | O(log n) 操作    |
| 最小/最大访问  | **RedBlackTree**    | O(log n)         |
| 重复检查       | Set 或 RedBlackTree | O(1) 或 O(log n) |

```typescript
// 未排序的唯一值
const uniqueIds = new Set<string>();

// 已排序的唯一值
const sortedScores = new RedBlackTree<number>();
sortedScores.insert(85);
sortedScores.insert(92);
sortedScores.min(); // 85
sortedScores.max(); // 92
```

### 树操作

| 需求       | 最佳选择                           | 操作                                         |
| ---------- | ---------------------------------- | -------------------------------------------- |
| 已排序集合 | **RedBlackTree**                   | insert(), remove(), contains() 都是 O(log n) |
| 优先队列   | **PriorityQueue** / **BinaryHeap** | 高效的最小/最大访问                          |
| 字符串搜索 | **Trie**                           | 前缀匹配、自动补全                           |

### 优先级和堆操作

| 使用场景      | 最佳选择                         | 原因                   |
| ------------- | -------------------------------- | ---------------------- |
| 任务调度      | **PriorityQueue**                | 具有优先级的类队列 API |
| K 个最大/最小 | **BinaryHeap** (MinHeap/MaxHeap) | 高效的 top-k 算法      |
| 中位数追踪    | MinHeap + MaxHeap                | 双堆方法               |
| Dijkstra 算法 | **PriorityQueue**                | 需要最小优先级提取     |

```typescript
// 任务调度
const scheduler = new PriorityQueue<Task>({
  comparator: (a, b) => b.priority - a.priority,
});

// K 个最大元素
const minHeap = new MinHeap<number>();
for (const num of numbers) {
  minHeap.insert(num);
  if (minHeap.size > k) minHeap.remove();
}
```

## 性能比较

### 时间复杂度

| 数据结构             | 插入       | 删除       | 搜索       | 访问     | 最小/最大 |
| -------------------- | ---------- | ---------- | ---------- | -------- | --------- |
| **Array**            | O(n)       | O(n)       | O(n)       | O(1)     | O(n)      |
| **LinkedList**       | O(1)\*     | O(n)       | O(n)       | O(n)     | O(n)      |
| **DoublyLinkedList** | O(1)\*     | O(n)       | O(n)       | O(n)     | O(n)      |
| **Queue**            | O(1)       | O(1)       | O(n)       | -        | -         |
| **Deque**            | O(1)       | O(1)       | O(n)       | O(1)     | -         |
| **PriorityQueue**    | O(log n)   | O(log n)   | O(n)       | O(1)\*\* | O(1)\*\*  |
| **BinaryHeap**       | O(log n)   | O(log n)   | O(n)       | O(1)\*\* | O(1)\*\*  |
| **RedBlackTree**     | O(log n)   | O(log n)   | O(log n)   | -        | O(log n)  |
| **SortedMap**        | O(log n)   | O(log n)   | O(log n)   | -        | O(log n)  |
| **Trie**             | O(m)\*\*\* | O(m)\*\*\* | O(m)\*\*\* | -        | -         |
| **BiMap**            | O(1)       | O(1)       | O(1)       | O(1)     | -         |
| **LRUCache**         | O(1)       | O(1)       | -          | O(1)     | -         |

\* 仅在两端
\*\* Peek 操作
\*\*\* m = 字符串长度

### 空间复杂度

| 数据结构             | 空间                     | 注释                 |
| -------------------- | ------------------------ | -------------------- |
| 全部                 | O(n)                     | 元素数量的线性关系   |
| **LinkedList**       | O(n)                     | 每个节点额外一个指针 |
| **DoublyLinkedList** | O(n)                     | 每个节点两个指针     |
| **Trie**             | O(ALPHABET_SIZE × N × M) | 对于长字符串可能很大 |
| **BiMap**            | O(2n)                    | 两个内部 map         |

## 常见场景

### 1. 网页浏览器历史

**需求：** 在访问过的页面之间前进/后退导航

**最佳选择：** DoublyLinkedList

```typescript
const history = new DoublyLinkedList<string>();
history.append('/home');
history.append('/products');
// 使用前向/反向迭代进行导航
```

**替代方案：** 带索引指针的 Array（更简单但修改效率较低）

### 2. 自动补全/搜索建议

**需求：** 查找所有以某个前缀开头的单词

**最佳选择：** Trie

```typescript
const trie = new Trie<number>(false); // 不区分大小写
trie.insert('apple', 100);
trie.insert('application', 85);
trie.getAllWithPrefix('app'); // ['apple', 'application']
```

**替代方案：** 带 filter 的 Array（更简单但每次搜索 O(n)）

### 3. 排行榜

**需求：** 按排名顺序维护玩家分数

**最佳选择：** SortedMap

```typescript
const leaderboard = new SortedMap<number, Player>({
  comparator: (a, b) => b - a, // 降序
});
```

**替代方案：** Array + sort（更简单但每次更新 O(n log n)）

### 4. 速率限制

**需求：** 跟踪每个用户的请求次数并支持过期

**最佳选择：** 带 TTL 的 LRUCache

```typescript
const rateLimiter = new LRUCache<string, number>({
  capacity: 10000,
  ttl: 60000, // 1 分钟
});
```

### 5. 事件处理

**需求：** 按优先级顺序处理事件

**最佳选择：** PriorityQueue

```typescript
const events = new PriorityQueue<Event>({
  comparator: (a, b) => a.priority - b.priority,
});
```

### 6. 用户 ID ↔ 用户名映射

**需求：** 双向查找

**最佳选择：** BiDirectionalMap

```typescript
const users = new BiDirectionalMap<number, string>();
users.set(1, 'alice');
users.get(1); // 'alice'
users.getKey('alice'); // 1
```

## 决策因素

### 1. 访问模式

- **随机访问：** Array、Map
- **顺序访问：** LinkedList、Queue
- **已排序：** RedBlackTree、SortedMap
- **优先级：** PriorityQueue、BinaryHeap

### 2. 修改频率

- **频繁插入/删除：** LinkedList、Heap
- **主要是读取：** Array、Map
- **平衡：** 树结构

### 3. 大小约束

- **固定大小：** LRUCache
- **动态大小：** 大多数结构
- **大型数据集：** 考虑空间开销

### 4. 性能要求

- **常数时间关键：** Map、BiMap、LRUCache
- **对数时间可接受：** Trees、Heaps
- **线性时间可接受：** LinkedList 搜索

## 反模式

### ❌ 使用 Array 进行频繁插入/删除

```typescript
// 不好：每次 shift 都是 O(n)
const arr = [1, 2, 3];
arr.unshift(0); // 移动所有元素

// 好：O(1)
const list = new LinkedList<number>();
list.prepend(0);
```

### ❌ 使用 LinkedList 进行随机访问

```typescript
// 不好：O(n) 查找索引
list.get(1000);

// 好：O(1)
arr[1000];
```

### ❌ 不使用 LRUCache 进行缓存

```typescript
// 不好：没有自动淘汰
const cache = new Map<string, Data>();
if (cache.size > 100) {
  // 需要手动淘汰逻辑
}

// 好：自动 LRU 淘汰
const cache = new LRUCache<string, Data>({ capacity: 100 });
```

## 总结

根据您的主要操作选择：

- **缓存：** LRUCache
- **FIFO/LIFO：** Queue / Stack (Array)
- **优先级：** PriorityQueue
- **已排序：** RedBlackTree、SortedMap
- **双向查找：** BiDirectionalMap
- **字符串前缀：** Trie
- **顺序访问：** LinkedList
- **两端操作：** Deque / DoublyLinkedList

如果不确定，从简单的开始（Array、Map），然后根据性能分析进行优化！

## 相关主题

- [缓存策略指南](./caching-strategies.md)
- [堆算法指南](./heap-algorithms.md)
- [API 参考](../api/bi-map.md)
