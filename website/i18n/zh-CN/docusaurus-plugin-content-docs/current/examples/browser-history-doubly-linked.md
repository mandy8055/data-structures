---
id: browser-history-doubly-linked
title: 浏览器历史
sidebar_label: 浏览器历史
description: 使用 DoublyLinkedList 实现浏览器后退/前进导航
keywords: [doubly-linked-list, browser, history, navigation, example]
---

# 使用 DoublyLinkedList 的浏览器历史

实现类似浏览器的后退/前进导航。

## 实现

```typescript
import { DoublyLinkedList } from '@msnkr/data-structures';

class BrowserHistory {
  private history = new DoublyLinkedList<string>();
  private currentIndex = -1;

  visit(url: string): void {
    // 删除所有前进历史
    while (this.currentIndex < this.history.size - 1) {
      this.history.removeLast();
    }

    // 添加新 URL
    this.history.append(url);
    this.currentIndex++;
    console.log(`已访问：${url}`);
  }

  back(): string | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const url = this.history.get(this.currentIndex);
      console.log(`后退到：${url}`);
      return url;
    }
    console.log('没有上一页');
    return null;
  }

  forward(): string | null {
    if (this.currentIndex < this.history.size - 1) {
      this.currentIndex++;
      const url = this.history.get(this.currentIndex);
      console.log(`前进到：${url}`);
      return url;
    }
    console.log('没有下一页');
    return null;
  }

  current(): string | null {
    if (this.currentIndex >= 0) {
      return this.history.get(this.currentIndex);
    }
    return null;
  }

  canGoBack(): boolean {
    return this.currentIndex > 0;
  }

  canGoForward(): boolean {
    return this.currentIndex < this.history.size - 1;
  }
}

// 使用示例
const browser = new BrowserHistory();
browser.visit('google.com');
browser.visit('github.com');
browser.visit('stackoverflow.com');

console.log('当前：', browser.current()); // "stackoverflow.com"

browser.back(); // "github.com"
browser.back(); // "google.com"
browser.forward(); // "github.com"

console.log('可以后退？', browser.canGoBack()); // true
console.log('可以前进？', browser.canGoForward()); // true
```

## 输出

```
已访问：google.com
已访问：github.com
已访问：stackoverflow.com
当前：stackoverflow.com
后退到：github.com
后退到：google.com
前进到：github.com
可以后退？true
可以前进？true
```

## 带访问限制

```typescript
class LimitedBrowserHistory extends BrowserHistory {
  constructor(private maxHistory: number = 50) {
    super();
  }

  visit(url: string): void {
    super.visit(url);

    // 如果超过限制则删除最旧的条目
    while (this.history.size > this.maxHistory) {
      this.history.removeFirst();
      this.currentIndex--;
    }
  }
}
```

## 另请参阅

- [DoublyLinkedList API 参考](../api/doubly-linked-list.md)
- [LinkedList API 参考](../api/linked-list.md)
- [导航历史示例](./navigation-history.md)
