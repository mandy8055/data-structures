---
id: navigation-history
title: Navigation History
sidebar_label: Navigation History
description: Track user navigation history with LinkedList
keywords: [linked-list, history, navigation, example]
---

# Navigation History with LinkedList

Track navigation history for back/forward functionality.

## Implementation

```typescript
import { LinkedList } from '@msnkr/data-structures';

const history = new LinkedList<string>();

// User navigates through pages
history.append('/home');
history.append('/products');
history.append('/cart');
history.append('/checkout');

// Get current page (last visited)
const currentPage = history.get(history.size - 1);
console.log('Current:', currentPage); // "/checkout"

// Check if user visited a specific page
const visitedProducts = history.contains('/products');
console.log('Visited products?', visitedProducts); // true

// Get full navigation path
console.log('Full path:', history.toArray());
// Output: ["/home", "/products", "/cart", "/checkout"]
```

## With Visit Timestamps

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

// Iterate through history
for (const entry of timestampedHistory) {
  console.log(`${entry.timestamp.toISOString()}: ${entry.url}`);
}
```

## See Also

- [LinkedList API Reference](../api/linked-list.md)
- [DoublyLinkedList](../api/doubly-linked-list.md) - For bidirectional navigation
- [Browser History Example](./browser-history-doubly-linked.md)
