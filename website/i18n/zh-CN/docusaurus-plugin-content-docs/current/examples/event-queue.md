---
id: event-queue
title: 带时间戳的事件队列
sidebar_label: 事件队列
description: 使用 PriorityQueue 按时间顺序处理事件
keywords: [priority-queue, event, timestamp, chronological, example]
---

# 带时间戳的事件队列

使用 PriorityQueue 按时间顺序处理事件。

## 实现

```typescript
import { PriorityQueue } from '@msnkr/data-structures';

interface Event {
  type: string;
  timestamp: Date;
  data?: unknown;
}

// 按时间戳排序的事件（最早的优先）
const events = new PriorityQueue<Event>({
  comparator: (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
});

// 添加事件（可能乱序到达）
events.enqueue({
  type: 'login',
  timestamp: new Date('2025-12-17T10:00:00'),
});
events.enqueue({
  type: 'click',
  timestamp: new Date('2025-12-17T09:30:00'),
});
events.enqueue({
  type: 'logout',
  timestamp: new Date('2025-12-17T11:00:00'),
});

// 按时间顺序处理事件
while (!events.isEmpty()) {
  const event = events.dequeue();
  console.log(`${event.timestamp.toISOString()}: ${event.type}`);
}
```

## 输出

```
2025-12-17T09:30:00.000Z: click
2025-12-17T10:00:00.000Z: login
2025-12-17T11:00:00.000Z: logout
```

## 实时事件处理

```typescript
class EventProcessor {
  private queue = new PriorityQueue<Event>({
    comparator: (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  });

  addEvent(type: string, data?: unknown): void {
    this.queue.enqueue({
      type,
      timestamp: new Date(),
      data,
    });
  }

  processNext(): Event | null {
    if (this.queue.isEmpty()) {
      return null;
    }
    return this.queue.dequeue();
  }

  processAll(): void {
    while (!this.queue.isEmpty()) {
      const event = this.queue.dequeue();
      this.handleEvent(event);
    }
  }

  private handleEvent(event: Event): void {
    console.log(`处理 ${event.type}，时间 ${event.timestamp}`);
    // 您的事件处理逻辑
  }
}

const processor = new EventProcessor();
processor.addEvent('user-clicked-button', { buttonId: 'submit' });
processor.addEvent('page-loaded', { url: '/home' });
processor.processAll();
```

## 另请参阅

- [PriorityQueue API 参考](../api/priority-queue.md)
- [Queue API 参考](../api/queue.md)
