---
id: intro
title: Einführung
sidebar_position: 1
---

# data-structures

Eine umfassende Sammlung typsicherer, abhängigkeitsfreier Datenstruktur-Implementierungen für TypeScript/JavaScript.

## Warum diese Bibliothek verwenden?

- **🎯 Typsicherheit**: Vollständige TypeScript-Unterstützung mit Generics für vollständige Typsicherheit
- **📦 Null Abhängigkeiten**: Keine externen Abhängigkeiten - leichtgewichtig und sicher
- **⚡ Performance**: Optimierte Implementierungen mit dokumentierten Zeitkomplexitäten
- **🧪 Gut getestet**: Umfassende Testabdeckung (>85%)
- **🌲 Tree Shakeable**: Importieren Sie nur, was Sie brauchen - minimale Bundle-Auswirkung
- **📚 Gut dokumentiert**: Umfangreiche Dokumentation mit Beispielen
- **🔄 Dual veröffentlicht**: Verfügbar auf JSR und npm für maximale Kompatibilität

## Schnellstart

In Sekunden loslegen:

```bash
npm install @dstoolkit/data-structures
```

```typescript
import { Queue, LRUCache } from '@dstoolkit/data-structures';

// FIFO Queue
const queue = new Queue<number>();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue()); // 1

// LRU Cache
const cache = new LRUCache<string, number>({ capacity: 100 });
cache.put('key', 42);
console.log(cache.get('key')); // 42
```

## Verfügbare Datenstrukturen

### Warteschlangen

- **[Queue](./api/queue)** - FIFO-Warteschlange mit O(1) Enqueue/Dequeue-Operationen
- **[Deque](./api/deque)** - Doppelendige Warteschlange mit O(1) Operationen an beiden Enden
- **[PriorityQueue](./api/priority-queue)** - Prioritätsbasierte Warteschlange, unterstützt durch Binary Heap

### Listen

- **[LinkedList](./api/linked-list)** - Einfach verkettete Liste mit O(1) Einfügungen an den Enden
- **[DoublyLinkedList](./api/doubly-linked-list)** - Bidirektionale verkettete Liste mit umgekehrter Iteration

### Heaps

- **[BinaryHeap](./api/binary-heap)** - MinHeap- und MaxHeap-Implementierungen mit O(log n) Operationen

### Bäume

- **[Trie](./api/trie)** - Präfixbaum für effiziente String-Operationen und Autovervollständigung
- **[RedBlackTree](./api/red-black-tree)** - Selbstbalancierender binärer Suchbaum mit garantiertem O(log n)

### Maps & Caches

- **[SortedMap](./api/sorted-map)** - Schlüssel-Wert-Map mit sortierten Schlüsseln (Red-Black-Tree-basiert)
- **[BiDirectionalMap](./api/bi-map)** - Eins-zu-eins bidirektionales Mapping mit O(1) Lookups
- **[LRUCache](./api/lru-cache)** - Least Recently Used Cache mit automatischer Verdrängung

## Nächste Schritte

<div className="row">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>📖 Grundlagen lernen</h3>
      </div>
      <div className="card__body">
        <p>Machen Sie sich mit Installation und grundlegender Verwendung vertraut.</p>
      </div>
    </div>
  </div>

  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>📚 API-Referenz</h3>
      </div>
      <div className="card__body">
        <p>Erkunden Sie die vollständige API-Dokumentation für alle 11 Datenstrukturen oben!</p>
      </div>
    </div>
  </div>
</div>

## Community & Support

- **GitHub**: [mandy8055/data-structures](https://github.com/mandy8055/data-structures)
- **Issues**: [Fehler melden oder Features anfordern](https://github.com/mandy8055/data-structures/issues)
- **Discussions**: [Treten Sie der Community bei](https://github.com/mandy8055/data-structures/discussions)

## Lizenz

MIT-Lizenz - verwenden Sie dies gerne in Ihren eigenen Projekten!
