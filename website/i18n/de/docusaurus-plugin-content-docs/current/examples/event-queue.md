---
id: event-queue
title: Event Queue with Timestamps
sidebar_label: Event Queue
description: Ereignisse in chronologischer Reihenfolge mit PriorityQueue verarbeiten
keywords: [priority-queue, event, timestamp, chronological, example]
---

# Event Queue mit Zeitstempeln

Verarbeiten Sie Ereignisse in chronologischer Reihenfolge mit PriorityQueue.

## Implementierung

```typescript
import { PriorityQueue } from '@msnkr/data-structures';

interface Event {
  type: string;
  timestamp: Date;
  data?: unknown;
}

// Ereignisse sortiert nach Zeitstempel (früheste zuerst)
const events = new PriorityQueue<Event>({
  comparator: (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
});

// Ereignisse hinzufügen (können in beliebiger Reihenfolge eintreffen)
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

// Ereignisse in chronologischer Reihenfolge verarbeiten
while (!events.isEmpty()) {
  const event = events.dequeue();
  console.log(`${event.timestamp.toISOString()}: ${event.type}`);
}
```

## Ausgabe

```
2025-12-17T09:30:00.000Z: click
2025-12-17T10:00:00.000Z: login
2025-12-17T11:00:00.000Z: logout
```

## Echtzeit-Ereignisverarbeitung

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
    // Ihre Ereignisbehandlungslogik
  }
}

const processor = new EventProcessor();
processor.addEvent('user-clicked-button', { buttonId: 'submit' });
processor.addEvent('page-loaded', { url: '/home' });
processor.processAll();
```

## Siehe auch

- [PriorityQueue API-Referenz](../api/priority-queue.md)
- [Queue API-Referenz](../api/queue.md)
