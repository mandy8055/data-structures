---
id: tree-budget-rollup
title: Budget Rollup
sidebar_label: Budget Rollup
description: Kosten durch eine Hierarchie von Abteilungen mit Tree.fold() aggregieren
keywords: [tree, n-ary-tree, fold, rollup, hierarchy, org-chart, example]
---

# Budget-Rollup mit Tree

Summieren Sie ein numerisches Feld von den Blättern einer Hierarchie bis zur Wurzel mit `fold()`, einer Bottom-up-Reduktion.

## Implementierung

```typescript
import { Tree } from '@dstoolkit/data-structures';

interface Unit {
  name: string;
  spend: number; // direkte Ausgaben dieser Einheit
}

const org = Tree.fromNested<Unit>({
  value: { name: 'Company', spend: 10_000 },
  children: [
    {
      value: { name: 'Engineering', spend: 5_000 },
      children: [
        { value: { name: 'Platform', spend: 40_000 } },
        { value: { name: 'Mobile', spend: 25_000 } },
      ],
    },
    {
      value: { name: 'Operations', spend: 2_000 },
      children: [{ value: { name: 'Support', spend: 15_000 } }],
    },
  ],
});

// Gesamtausgaben: die eigenen Ausgaben jeder Einheit plus alles darunter
const total = org.fold<number>(
  (unit, children) => unit.spend + children.reduce((a, b) => a + b, 0),
);
console.log(total); // 97000
```

## Aggregierter Bericht

Erstellen Sie einen neuen Baum, in dem jede Einheit ihre aggregierte Gesamtsumme trägt.

```typescript
interface Rollup {
  name: string;
  total: number;
  children: Rollup[];
}

const report = org.fold<Rollup>((unit, children) => ({
  name: unit.name,
  total: unit.spend + children.reduce((sum, c) => sum + c.total, 0),
  children,
}));

console.log(report.children.map((c) => `${c.name}: ${c.total}`));
// ["Engineering: 70000", "Operations: 17000"]
```

## Rollup für einen einzelnen Zweig

Übergeben Sie einen Knoten als zweites Argument, um nur diesen Teilbaum zu aggregieren.

```typescript
const engineering = org.find((u) => u.name === 'Engineering')!;

const engTotal = org.fold<number>(
  (unit, children) => unit.spend + children.reduce((a, b) => a + b, 0),
  engineering,
);
console.log(engTotal); // 70000
```

## Weitere Aggregate

```typescript
// Anzahl der Einheiten (Anzahl der Knoten)
const units = org.fold<number>((_u, c) => 1 + c.reduce((a, b) => a + b, 0));
console.log(units); // 6

// Größte einzelne direkte Ausgabe
const maxSpend = org.fold<number>((u, c) => Math.max(u.spend, ...c));
console.log(maxSpend); // 40000

// Einheiten ohne Untereinheiten
console.log(org.findAll((_u, node) => node.isLeaf).map((n) => n.value.name));
// ["Platform", "Mobile", "Support"]
```

## Umorganisieren

```typescript
const support = org.find((u) => u.name === 'Support')!;

// Support unter Engineering verschieben und das Rollup neu ausführen
org.move(support, engineering);
console.log(
  org.fold<number>(
    (u, c) => u.spend + c.reduce((a, b) => a + b, 0),
    engineering,
  ),
); // 85000
```

:::info Warum fold?
`fold` besucht jeden Knoten genau einmal, nachdem alle seine Kinder besucht wurden, sodass jeder Knoten die Ergebnisse seiner Kinder sieht. Es ist iterativ implementiert und funktioniert daher bei Hierarchien beliebiger Tiefe.
:::

## Siehe auch

- [Tree API-Referenz](../api/tree.md)
- [Datei-System-Explorer](./tree-file-system.md)
