---
id: event-queue
title: Event Queue with Timestamps
sidebar_label: Event Queue
description: Process events in chronological order with PriorityQueue
keywords: [priority-queue, event, timestamp, chronological, example]
---

# Event Queue with Timestamps

Process events in chronological order using PriorityQueue.

## Implementation

```typescript
import { PriorityQueue } from '@msnkr/data-structures';

interface Event {
  type: string;
  timestamp: Date;
  data?: unknown;
}

// Events ordered by timestamp (earliest first)
const events = new PriorityQueue<Event>({
  comparator: (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
});

// Add events (may arrive out of order)
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

// Process events in chronological order
while (!events.isEmpty()) {
  const event = events.dequeue();
  console.log(`${event.timestamp.toISOString()}: ${event.type}`);
}
```

## Output

```
2025-12-17T09:30:00.000Z: click
2025-12-17T10:00:00.000Z: login
2025-12-17T11:00:00.000Z: logout
```

## Real-time Event Processing

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
    console.log(`Processing ${event.type} at ${event.timestamp}`);
    // Your event handling logic
  }
}

const processor = new EventProcessor();
processor.addEvent('user-clicked-button', { buttonId: 'submit' });
processor.addEvent('page-loaded', { url: '/home' });
processor.processAll();
```

## See Also

- [PriorityQueue API Reference](../api/priority-queue.md)
- [Queue API Reference](../api/queue.md)
