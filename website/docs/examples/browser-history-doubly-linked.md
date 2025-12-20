---
id: browser-history-doubly-linked
title: Browser History
sidebar_label: Browser History
description: Browser back/forward navigation with DoublyLinkedList
keywords: [doubly-linked-list, browser, history, navigation, example]
---

# Browser History with DoublyLinkedList

Implement browser-like back/forward navigation.

## Implementation

```typescript
import { DoublyLinkedList } from '@msnkr/data-structures';

class BrowserHistory {
  private history = new DoublyLinkedList<string>();
  private currentIndex = -1;

  visit(url: string): void {
    // Remove any forward history
    while (this.currentIndex < this.history.size - 1) {
      this.history.removeLast();
    }

    // Add new URL
    this.history.append(url);
    this.currentIndex++;
    console.log(`Visited: ${url}`);
  }

  back(): string | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const url = this.history.get(this.currentIndex);
      console.log(`Back to: ${url}`);
      return url;
    }
    console.log('No previous page');
    return null;
  }

  forward(): string | null {
    if (this.currentIndex < this.history.size - 1) {
      this.currentIndex++;
      const url = this.history.get(this.currentIndex);
      console.log(`Forward to: ${url}`);
      return url;
    }
    console.log('No next page');
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

// Usage
const browser = new BrowserHistory();
browser.visit('google.com');
browser.visit('github.com');
browser.visit('stackoverflow.com');

console.log('Current:', browser.current()); // "stackoverflow.com"

browser.back(); // "github.com"
browser.back(); // "google.com"
browser.forward(); // "github.com"

console.log('Can go back?', browser.canGoBack()); // true
console.log('Can go forward?', browser.canGoForward()); // true
```

## Output

```
Visited: google.com
Visited: github.com
Visited: stackoverflow.com
Current: stackoverflow.com
Back to: github.com
Back to: google.com
Forward to: github.com
Can go back? true
Can go forward? true
```

## With Visit Limits

```typescript
class LimitedBrowserHistory extends BrowserHistory {
  constructor(private maxHistory: number = 50) {
    super();
  }

  visit(url: string): void {
    super.visit(url);

    // Remove oldest entries if limit exceeded
    while (this.history.size > this.maxHistory) {
      this.history.removeFirst();
      this.currentIndex--;
    }
  }
}
```

## See Also

- [DoublyLinkedList API Reference](../api/doubly-linked-list.md)
- [LinkedList API Reference](../api/linked-list.md)
- [Navigation History Example](./navigation-history.md)
