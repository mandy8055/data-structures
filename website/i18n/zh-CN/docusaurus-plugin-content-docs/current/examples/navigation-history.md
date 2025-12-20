---
id: navigation-history
title: 导航历史
sidebar_label: 导航历史
description: 使用 LinkedList 跟踪用户导航历史
keywords: [linked-list, history, navigation, example]
---

# 使用 LinkedList 的导航历史

跟踪导航历史以实现后退/前进功能。

## 实现

```typescript
import { LinkedList } from '@msnkr/data-structures';

const history = new LinkedList<string>();

// 用户浏览页面
history.append('/home');
history.append('/products');
history.append('/cart');
history.append('/checkout');

// 获取当前页面（最后访问的）
const currentPage = history.get(history.size - 1);
console.log('当前：', currentPage); // "/checkout"

// 检查用户是否访问过特定页面
const visitedProducts = history.contains('/products');
console.log('访问过产品页？', visitedProducts); // true

// 获取完整导航路径
console.log('完整路径：', history.toArray());
// 输出：["/home", "/products", "/cart", "/checkout"]
```

## 带访问时间戳

```typescript
interface HistoryEntry {
  url: string;
  timestamp: Date;
}

const timestampedHistory = new LinkedList<HistoryEntry>();

function visit(url: string): void {
  timestampedHistory.append({
    url,
    timestamp: new Date(),
  });
}

visit('/home');
visit('/search?q=laptop');
visit('/products/123');

// 遍历历史记录
for (const entry of timestampedHistory) {
  console.log(`${entry.timestamp.toISOString()}: ${entry.url}`);
}
```

## 另请参阅

- [LinkedList API 参考](../api/linked-list.md)
- [DoublyLinkedList](../api/doubly-linked-list.md) - 用于双向导航
- [浏览器历史示例](./browser-history-doubly-linked.md)
