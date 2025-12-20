---
id: doubly-linked-list
title: DoublyLinkedList
sidebar_label: DoublyLinkedList
description: 支持两端 O(1) 操作和双向遍历的双向链表
keywords:
  [
    doubly-linked-list,
    linked-list,
    data-structure,
    typescript,
    javascript,
    bidirectional,
  ]
---

import InstallTabs from '@site/src/components/InstallTabs';

# DoublyLinkedList

双向链表实现，支持两端的高效操作和双向遍历。每个节点都维护对前一个和后一个节点的引用。

## 安装

<InstallTabs packageName='@msnkr/data-structures' importName='DoublyLinkedList' />

## 使用方法

```typescript
import { DoublyLinkedList } from '@msnkr/data-structures';

const list = new DoublyLinkedList<number>();
```

## API 参考

### 属性

- `size: number` - 链表中元素的数量
- `isEmpty(): boolean` - 链表是否为空

### 方法

#### 添加元素

```typescript
// 添加到末尾 - O(1)
list.append(1);

// 添加到开头 - O(1)
list.prepend(0);

// 在指定位置插入 - O(n)
list.insertAt(2, 1);
```

:::tip 性能
在开头和末尾的插入操作都是 O(1) 常数时间。
:::

#### 删除元素

```typescript
// 从开头删除 - O(1)
const first = list.removeFirst();

// 从末尾删除 - O(1)
const last = list.removeLast();

// 删除指定位置的元素 - O(n)
const element = list.removeAt(1);

// 删除首次出现的值 - O(n)
const removed = list.remove(42);
```

:::tip 两端 O(1) 删除
与单向链表不同，DoublyLinkedList 由于有前向指针，支持从末尾进行 O(1) 删除。
:::

#### 访问元素

```typescript
// 获取指定位置的元素 - O(min(n/2, k))
const element = list.get(0);

// 查找元素的位置 - O(n)
const index = list.indexOf(42);

// 检查元素是否存在 - O(n)
const exists = list.contains(42);
```

:::info 优化的访问
`get()` 方法经过优化，从最近的一端（头部或尾部）开始搜索，使得访问靠近末尾的索引比单向链表快 2 倍。
:::

#### 迭代

```typescript
const list = new DoublyLinkedList<string>();
list.append('a');
list.append('b');
list.append('c');

// 正向迭代（头到尾）
for (const value of list) {
  console.log(value); // "a", "b", "c"
}

// 反向迭代（尾到头）
for (const value of list.reverseIterator()) {
  console.log(value); // "c", "b", "a"
}
```

#### 实用方法

```typescript
// 转换为数组 - O(n)
const array = list.toArray();

// 删除所有元素 - O(1)
list.clear();
```

## 示例

### 双向遍历的基本使用

```typescript
const list = new DoublyLinkedList<number>();

// 添加元素
list.append(1); // [1]
list.append(2); // [1, 2]
list.append(3); // [1, 2, 3]

// 正向遍历
console.log('正向:', [...list]); // [1, 2, 3]

// 反向遍历
console.log('反向:', [...list.reverseIterator()]); // [3, 2, 1]
```

### 浏览器历史记录实现

```typescript
class BrowserHistory {
  private history = new DoublyLinkedList<string>();
  private currentIndex = -1;

  visit(url: string): void {
    // 删除前进历史
    while (this.currentIndex < this.history.size - 1) {
      this.history.removeLast();
    }

    this.history.append(url);
    this.currentIndex++;
  }

  back(): string | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history.get(this.currentIndex);
    }
    return null;
  }

  forward(): string | null {
    if (this.currentIndex < this.history.size - 1) {
      this.currentIndex++;
      return this.history.get(this.currentIndex);
    }
    return null;
  }
}

const browser = new BrowserHistory();
browser.visit('google.com');
browser.visit('github.com');
browser.visit('stackoverflow.com');

console.log(browser.back()); // "github.com"
console.log(browser.back()); // "google.com"
console.log(browser.forward()); // "github.com"
```

### 带随机播放的音乐播放列表

```typescript
const playlist = new DoublyLinkedList<string>();

playlist.append('歌曲 1');
playlist.append('歌曲 2');
playlist.append('歌曲 3');
playlist.append('歌曲 4');

// 正向播放
console.log('正向播放：');
for (const song of playlist) {
  console.log(`♪ ${song}`);
}

// 反向播放
console.log('\n反向播放：');
for (const song of playlist.reverseIterator()) {
  console.log(`♪ ${song}`);
}
```

### 文本编辑器撤销/重做

```typescript
class TextEditor {
  private states = new DoublyLinkedList<string>();
  private currentIndex = -1;

  constructor() {
    this.states.append(''); // 初始空状态
    this.currentIndex = 0;
  }

  type(text: string): void {
    const currentState = this.states.get(this.currentIndex) || '';
    const newState = currentState + text;

    // 删除所有重做历史
    while (this.currentIndex < this.states.size - 1) {
      this.states.removeLast();
    }

    this.states.append(newState);
    this.currentIndex++;
  }

  undo(): string {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    return this.states.get(this.currentIndex) || '';
  }

  redo(): string {
    if (this.currentIndex < this.states.size - 1) {
      this.currentIndex++;
    }
    return this.states.get(this.currentIndex) || '';
  }

  getText(): string {
    return this.states.get(this.currentIndex) || '';
  }
}

const editor = new TextEditor();
editor.type('Hello');
editor.type(' World');
console.log(editor.getText()); // "Hello World"
console.log(editor.undo()); // "Hello"
console.log(editor.undo()); // ""
console.log(editor.redo()); // "Hello"
```

### LRU 缓存实现

```typescript
class LRUCache<K, V> {
  private capacity: number;
  private cache = new Map<K, V>();
  private order = new DoublyLinkedList<K>();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // 移动到最近使用
    this.order.remove(key);
    this.order.append(key);

    return this.cache.get(key);
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.order.remove(key);
    } else if (this.cache.size >= this.capacity) {
      // 驱逐最少使用的
      const lru = this.order.removeFirst();
      if (lru !== undefined) {
        this.cache.delete(lru);
      }
    }

    this.cache.set(key, value);
    this.order.append(key);
  }
}

const cache = new LRUCache<string, number>(3);
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);
console.log(cache.get('a')); // 1
cache.put('d', 4); // 驱逐 'b'
```

## 时间复杂度

| 操作        | 平均 | 最坏 |
| ----------- | ---- | ---- |
| append      | O(1) | O(1) |
| prepend     | O(1) | O(1) |
| insertAt    | O(n) | O(n) |
| removeFirst | O(1) | O(1) |
| removeLast  | O(1) | O(1) |
| removeAt    | O(n) | O(n) |
| remove      | O(n) | O(n) |
| get         | O(n) | O(n) |
| indexOf     | O(n) | O(n) |
| contains    | O(n) | O(n) |

## 与单向链表的比较

| 特性               | DoublyLinkedList   | LinkedList           |
| ------------------ | ------------------ | -------------------- |
| 末尾删除           | O(1)               | O(n)                 |
| 反向遍历           | 支持               | 不支持               |
| 内存使用           | 每节点 2 个指针    | 每节点 1 个指针      |
| 访问靠近末尾的元素 | 更快（从尾部搜索） | 较慢（只能从头搜索） |

## 最佳实践

### 何时使用 DoublyLinkedList

- ✅ 需要双向遍历
- ✅ 需要频繁从两端删除元素
- ✅ 实现 LRU 缓存或撤销/重做功能
- ✅ 需要访问靠近末尾的元素

### 何时使用 LinkedList（单向）

- ✅ 只需要单向遍历
- ✅ 内存受限
- ✅ 很少或从不从末尾删除

## 相关数据结构

- **LinkedList** - 单向链表，内存使用更少
- **Deque** - 基于数组的双端队列，访问速度更快
- **Queue** - FIFO 队列，仅支持一端操作
