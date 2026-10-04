---
id: tree
title: Tree
sidebar_label: Tree
description: Generischer n-ärer Baum mit sicherer, iterativer Traversierung und validiertem Aufbau
keywords:
  [tree, n-ary-tree, hierarchy, traversal, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# Tree

Ein generischer n-ärer (verwurzelter, geordneter) Baum, bei dem jeder Knoten eine beliebige Anzahl von Kindern haben kann. Ideal für Hierarchien wie Dateisysteme, Kategoriebäume, Organigramme, Menüs und geparste Dokumente. Jeder Algorithmus ist iterativ, sodass der Baum auch bei sehr tiefen oder nicht vertrauenswürdigen Daten sicher verwendet werden kann.

## Installation

<InstallTabs packageName='@dstoolkit/data-structures' importName='Tree' />

## Verwendung

```typescript
import { Tree } from '@dstoolkit/data-structures';

const tree = new Tree<string>();
const root = tree.setRoot('root');
```

## API-Referenz

### Konstruktion

```typescript
// Unbeschränkter Baum
const tree = new Tree<string>();

// Mit optionalen Grenzwerten (positive Ganzzahlen)
const bounded = new Tree<string>({ maxSize: 10_000, maxDepth: 64 });
```

- `maxSize` - Maximale Anzahl von Knoten im Baum
- `maxDepth` - Maximale Tiefe eines Knotens (die Wurzel hat Tiefe `0`)

### Eigenschaften

- `root: TreeNode<T> | null` - Der Wurzelknoten, oder `null` wenn leer
- `size: number` - Anzahl der Knoten im Baum
- `height: number` - Kanten auf dem längsten Pfad von Wurzel zu Blatt (`-1` wenn leer, `0` für einen einzelnen Knoten)
- `isEmpty(): boolean` - Ob der Baum leer ist

### TreeNode

Knoten werden nur vom Baum erstellt und sind von außen nur lesbar, mit Ausnahme ihres Werts.

- `value: T` - Der gespeicherte Wert (kann neu zugewiesen werden)
- `parent: TreeNode<T> | null` - Elternknoten (`null` für die Wurzel)
- `children: ReadonlyArray<TreeNode<T>>` - Eine eingefrorene Momentaufnahme der Kinder
- `isLeaf: boolean` - Ob der Knoten keine Kinder hat
- `isRoot: boolean` - Ob der Knoten die Wurzel seines Baums ist

### Methoden

#### Aufbauen und Verändern

```typescript
// Wurzel erstellen (wirft Fehler, wenn bereits eine Wurzel existiert) - O(1)
const root = tree.setRoot('root');

// Ein Kind anhängen - O(1)
const child = tree.addChild(root, 'child');

// Ein Kind an einer Position einfügen - O(k)
tree.insertChildAt(root, 0, 'first');

// Einen Knoten (mit seinem Teilbaum) unter einen neuen Elternknoten verschieben - O(depth + k)
tree.move(child, otherNode); // anhängen
tree.move(child, otherNode, 0); // an einem Index

// Einen Knoten und seinen gesamten Teilbaum entfernen - O(s + k)
tree.remove(child);

// Alles entfernen - O(n)
tree.clear();
```

wobei `k` die Anzahl der Geschwister und `s` die Größe des entfernten Teilbaums ist

#### Abfragen

```typescript
// Besitzprüfung - O(1)
tree.contains(node); // true / false

// Erste Übereinstimmung in Pre-Order - O(n)
const node = tree.find((value) => value === 'docs');

// Alle Übereinstimmungen in Pre-Order - O(n)
const leaves = tree.findAll((_value, node) => node.isLeaf);

// Tiefe eines Knotens (Wurzel ist 0) - O(depth)
tree.depth(node);

// Werte von der Wurzel bis zum Knoten - O(depth)
tree.path(node); // ['root', 'docs', 'api']
```

#### Traversierung

Alle Traversierungen sind Generatoren und akzeptieren einen optionalen `from`-Knoten, um nur diesen Teilbaum zu durchlaufen.

```typescript
// Pre-Order: Knoten, dann Kinder von links nach rechts - O(n)
[...tree.preOrder()];

// Post-Order: Kinder von links nach rechts, dann Knoten - O(n)
[...tree.postOrder()];

// Level-Order (Breitensuche) - O(n)
[...tree.levelOrder()];

// Teilbaum-Traversierung
[...tree.preOrder(someNode)];

// Standard-Iteration ist Pre-Order
for (const value of tree) {
  console.log(value);
}
const values = tree.toArray();
```

#### Transformieren

```typescript
// Bottom-up-Reduktion (von den Blättern zur Wurzel) - O(n)
const total = tree.fold<number>(
  (value, childResults) => value + childResults.reduce((a, b) => a + b, 0),
);

// Neuer Baum mit derselben Struktur und abgebildeten Werten - O(n)
const upper = tree.map((value) => value.toUpperCase());

// Neuer Baum, der Knoten behält, deren Wert UND alle Vorfahren bestehen - O(n)
const visible = tree.filter((value) => !value.startsWith('.'));
```

`filter` verwirft einen fehlschlagenden Knoten zusammen mit seinem gesamten Teilbaum (Nachkommen eines fehlschlagenden Knotens werden nicht getestet). Wenn die Wurzel fehlschlägt, ist das Ergebnis leer.

#### Verschachtelte Objekte

```typescript
// Aus einem einfachen { value, children? }-Objekt aufbauen - O(n)
const fromData = Tree.fromNested({
  value: 'root',
  children: [{ value: 'a', children: [{ value: 'a1' }] }, { value: 'b' }],
});

// Zurückkonvertieren (Blätter haben keinen `children`-Schlüssel) - O(n)
const nested = fromData.toNested();
```

## Beispiele

### Dateisystempfade

```typescript
const fs = new Tree<string>();
const root = fs.setRoot('/');
const home = fs.addChild(root, 'home');
const user = fs.addChild(home, 'alice');
const docs = fs.addChild(user, 'docs');
fs.addChild(root, 'etc');

console.log(fs.path(docs).join('/').replace('//', '/')); // "/home/alice/docs"
console.log(fs.depth(docs)); // 3
console.log([...fs.levelOrder()]); // ['/', 'home', 'etc', 'alice', 'docs']
```

### Werte in einer Hierarchie aufsummieren

```typescript
interface Item {
  name: string;
  cost: number;
}

const budget = new Tree<Item>();
const total = budget.setRoot({ name: 'Total', cost: 0 });
const travel = budget.addChild(total, { name: 'Travel', cost: 0 });
budget.addChild(travel, { name: 'Flights', cost: 1200 });
budget.addChild(travel, { name: 'Hotels', cost: 800 });
budget.addChild(total, { name: 'Equipment', cost: 500 });

const sum = budget.fold<number>(
  (item, children) => item.cost + children.reduce((a, b) => a + b, 0),
);
console.log(sum); // 2500

const travelOnly = budget.fold<number>(
  (item, children) => item.cost + children.reduce((a, b) => a + b, 0),
  travel,
);
console.log(travelOnly); // 2000
```

### Eine eingerückte Gliederung rendern

```typescript
const outline = Tree.fromNested({
  value: 'Guide',
  children: [
    { value: 'Install', children: [{ value: 'npm' }, { value: 'Deno' }] },
    { value: 'Usage' },
  ],
});

for (const node of outline.findAll(() => true)) {
  console.log('  '.repeat(outline.depth(node)) + node.value);
}
// Guide
//   Install
//     npm
//     Deno
//   Usage
```

## Fehlerbehandlung

```typescript
import {
  EmptyStructureError,
  IndexOutOfBoundsError,
  InvalidOperationError,
  Tree,
} from '@dstoolkit/data-structures';

const tree = new Tree<number>();

try {
  tree.fold(() => 0); // Leerer Baum
} catch (error) {
  if (error instanceof EmptyStructureError) {
    console.log('Baum ist leer');
  }
}

const root = tree.setRoot(1);
try {
  tree.insertChildAt(root, 5, 2); // Nur Index 0 ist gültig
} catch (error) {
  if (error instanceof IndexOutOfBoundsError) {
    console.log('Ungültiger Index');
  }
}

const other = new Tree<number>();
other.setRoot(0);
try {
  other.addChild(root, 2); // root gehört zu `tree`, nicht zu `other`
} catch (error) {
  if (error instanceof InvalidOperationError) {
    console.log('Knoten gehört nicht zu diesem Baum');
  }
}

// Abfragen, die fehlschlagen können, werfen nie einen Fehler
console.log(tree.find((v) => v === 42)); // null
console.log(tree.findAll((v) => v === 42)); // []
```

| Fehler                  | Wird ausgelöst, wenn                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `EmptyStructureError`   | `fold()` auf einem leeren Baum ohne `from`-Knoten aufgerufen wird                              |
| `IndexOutOfBoundsError` | `insertChildAt()` oder `move()` einen Index außerhalb des gültigen Bereichs erhält             |
| `InvalidOperationError` | Falscher Besitzer, abgetrennter Knoten, Wurzel bereits gesetzt, Zyklus in `move`, ungültige Eingabe/Optionen, Grenzwerte |
| `InvalidOperationError` | Eine Traversierung wird fortgesetzt, nachdem der Baum strukturell verändert wurde (siehe Sicherheitsgarantien unten) |

## Sicherheitsgarantien

`Tree` ist darauf ausgelegt, beliebige und nicht vertrauenswürdige Daten sicher zu speichern.

- **Keine Rekursion.** Jede Traversierung, `fold`, `height`, `map`, `filter`, `find`, `fromNested` und `toNested` verwendet einen expliziten Stack oder eine Queue. Ein Baum mit hunderttausenden Ebenen führt nicht zu einem Stack-Überlauf.
- **Besitzvalidierung.** Jeder Knoten merkt sich, welcher Baum ihn besitzt. Die Übergabe eines Knotens aus einem anderen Baum wirft `InvalidOperationError`. Entfernte Knoten (und ihre Nachkommen) werden _abgetrennt_ und von jedem Baum zurückgewiesen. `contains(node)` ist eine Besitzprüfung mit konstanter Laufzeit.
- **Nur lesbare Struktur.** `node.children` gibt eine eingefrorene Momentaufnahme zurück, niemals das interne Array. Die Struktur kann nur über `Tree`-Methoden verändert werden.
- **Zyklusvermeidung.** `move(node, newParent)` wirft einen Fehler, wenn `newParent` der Knoten `node` selbst oder einer seiner Nachkommen ist.
- **Nicht vertrauenswürdige Eingabe in `fromNested`.** Jeder Eingabeknoten muss ein nicht-null Objekt mit einer eigenen `value`-Eigenschaft sein, und `children` (falls vorhanden) muss ein Array sein. Es werden nur `value` und `children` gelesen, sodass Schlüssel wie `__proto__` oder `constructor` keine Prototypen verschmutzen können. Zyklen und gemeinsame Referenzen (dasselbe Objekt tritt zweimal auf) werden erkannt und zurückgewiesen, anstatt in eine Endlosschleife zu laufen.
- **Optionale Grenzwerte.** `maxSize` und `maxDepth` werden von `addChild`, `insertChildAt`, `move` und `fromNested` erzwungen. `fromNested` prüft sie während des Aufbaus, sodass übergroße Eingaben sofort fehlschlagen.
- **Fail-Fast-Iteratoren.** Strukturelle Änderungen (`setRoot`, `addChild`, `insertChildAt`, `remove`, `move`, `clear`) machen laufende Traversierungen ungültig; der nächste Schritt wirft `InvalidOperationError`. Callbacks, die an `find`, `findAll`, `fold`, `map` und `filter` übergeben werden und den Baum verändern, werfen auf die gleiche Weise einen Fehler. Die Zuweisung von `node.value` ist keine strukturelle Änderung.

:::tip
Verwenden Sie `maxSize` und `maxDepth`, wann immer ein Baum aus benutzerdefinierten Daten aufgebaut wird, um eine feste Obergrenze für den Speicherverbrauch festzulegen.
:::

## Leistungsmerkmale

| Operation                                  | Zeitkomplexität | Zusätzlicher Speicher | Beschreibung                         |
| ------------------------------------------ | ---------------- | ---------------------- | ------------------------------------- |
| `setRoot()`                                | O(1)             | O(1)                   | Wurzel erstellen                      |
| `addChild()`                               | O(1)\*           | O(1)                   | Ein Kind anhängen                     |
| `insertChildAt()`                          | O(k)             | O(1)                   | Ein Kind an einem Index einfügen      |
| `remove()`                                 | O(s + k)         | O(s)                   | Knoten und Teilbaum entfernen         |
| `move()`                                   | O(depth + k)\*   | O(1)                   | Teilbaum verschieben (mit Zyklusprüfung) |
| `contains()`                               | O(1)             | O(1)                   | Besitzprüfung                         |
| `depth()` / `path()`                       | O(depth)         | O(1) / O(d)             | Tiefe / Werte von der Wurzel          |
| `find()` / `findAll()`                     | O(n)             | O(n)                   | Pre-Order-Suche                       |
| `preOrder()`                               | O(n)             | O(n)                   | Expliziter Stack (O(h) bei schmalen Bäumen) |
| `postOrder()`                              | O(n)             | O(h)                   | Expliziter Stack                      |
| `levelOrder()`                             | O(n)             | O(w)                   | Queue                                 |
| `fold()`                                   | O(n)             | O(h + k)                | Bottom-up-Reduktion                   |
| `height`                                   | O(n)             | O(n)                   | Längster Pfad von Wurzel zu Blatt     |
| `map()` / `filter()`                       | O(n)             | O(n)                   | Einen neuen Baum aufbauen             |
| `fromNested()` / `toNested()`              | O(n)             | O(n)                   | Umwandlung von/zu verschachtelten Objekten |
| `clear()`                                  | O(n)             | O(n)                   | Alle Knoten abtrennen                 |

wobei:

- `n` = Anzahl der Knoten
- `h` = Höhe des Baums
- `w` = maximale Breite (Knoten auf einer Ebene)
- `k` = Anzahl der Geschwister
- `s` = Größe des entfernten Teilbaums

\* Wenn `maxDepth` gesetzt ist, zahlen `addChild`/`insertChildAt` zusätzlich O(depth), und `move` zahlt zusätzlich O(Größe des verschobenen Teilbaums), um den Grenzwert zu prüfen.

:::info Wann Tree verwenden
Perfekt für:

- **Dateisysteme und Ordner** - Pfade und Breadcrumbs mit `path()`
- **Kategorie- und Menühierarchien** - Geordnete Kinder und Teilbaum-Verschiebungen
- **Organigramme und Budgets** - Werte mit `fold()` aggregieren
- **Geparste Dokumente** - Gliederungen, ASTs und verschachtelte JSON-Strukturen
:::

:::warning Wann vermeiden
Alternativen in Betracht ziehen, wenn:

- **Sie sortierte Werte benötigen** → Verwenden Sie [RedBlackTree](./red-black-tree)
- **Sie Präfix-Lookups auf Strings benötigen** → Verwenden Sie [Trie](./trie)
- **Sie Schlüssel-Wert-Lookups benötigen** → Verwenden Sie [SortedMap](./sorted-map) oder `Map`
:::

## Siehe auch

### Verwandte Beispiele

- [Datei-System-Explorer](../examples/tree-file-system.md)
- [Budget-Rollup](../examples/tree-budget-rollup.md)

### Andere Datenstrukturen

- [Trie](./trie.md) - Präfixbaum für String-Schlüssel
- [RedBlackTree](./red-black-tree.md) - Sortierte eindeutige Werte
- [Queue](./queue.md) - Wird intern für die Level-Order-Traversierung verwendet
