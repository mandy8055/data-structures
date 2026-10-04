---
id: tree-file-system
title: File System Explorer
sidebar_label: File System Explorer
description: Ordner und Dateien mit Tree modellieren, Breadcrumbs mit path() rendern und Ordnergrößen mit fold() berechnen
keywords: [tree, n-ary-tree, file-system, breadcrumbs, example]
---

# Datei-System-Explorer mit Tree

Modellieren Sie eine Ordnerhierarchie mit `Tree`, erstellen Sie dann Breadcrumbs, suchen Sie nach Dateien und verschieben Sie Ordner sicher.

## Implementierung

```typescript
import { Tree, TreeNode } from '@dstoolkit/data-structures';

interface Entry {
  name: string;
  kind: 'folder' | 'file';
  bytes: number;
}

const fs = new Tree<Entry>();
const root = fs.setRoot({ name: '', kind: 'folder', bytes: 0 });

function mkdir(parent: TreeNode<Entry>, name: string): TreeNode<Entry> {
  return fs.addChild(parent, { name, kind: 'folder', bytes: 0 });
}

function touch(parent: TreeNode<Entry>, name: string, bytes: number) {
  return fs.addChild(parent, { name, kind: 'file', bytes });
}

const projects = mkdir(root, 'projects');
const site = mkdir(projects, 'website');
touch(site, 'index.html', 2_048);
touch(site, 'styles.css', 1_024);
const photos = mkdir(root, 'photos');
const report = touch(projects, 'report.pdf', 50_000);
touch(photos, 'beach.jpg', 300_000);
```

## Breadcrumbs mit `path()`

```typescript
function breadcrumb(node: TreeNode<Entry>): string {
  return '/' + fs.path(node).slice(1).map((e) => e.name).join('/');
}

const css = fs.find((e) => e.name === 'styles.css')!;
console.log(breadcrumb(css)); // "/projects/website/styles.css"
console.log(breadcrumb(report)); // "/projects/report.pdf"
```

## Ordnergrößen mit `fold()`

```typescript
function sizeOf(node: TreeNode<Entry>): number {
  return fs.fold<number>(
    (entry, children) => entry.bytes + children.reduce((a, b) => a + b, 0),
    node,
  );
}

console.log(sizeOf(site)); // 3072
console.log(sizeOf(projects)); // 53072
console.log(sizeOf(root)); // 353072
```

## Suche

```typescript
// Alle Dateien größer als 10 KB
const large = fs
  .findAll((e) => e.kind === 'file' && e.bytes > 10_000)
  .map(breadcrumb);
console.log(large); // ["/projects/report.pdf", "/photos/beach.jpg"]

// Verzeichnisauflistung, Ordner zuerst
function ls(folder: TreeNode<Entry>): string[] {
  return [...folder.children]
    .sort((a, b) => b.value.kind.localeCompare(a.value.kind))
    .map((n) => n.value.name);
}
console.log(ls(projects)); // ["website", "report.pdf"]
```

## Ordner sicher verschieben

```typescript
// Den website-Ordner unter photos verschieben
fs.move(site, photos);
console.log(breadcrumb(css)); // "/photos/website/styles.css"

// Einen Ordner in seinen eigenen Unterordner zu verschieben wird abgelehnt
try {
  fs.move(photos, site);
} catch (error) {
  console.log((error as Error).message);
  // "Cannot move a node under itself or one of its descendants"
}
```

## Laden aus JSON

```typescript
// Daten von einer API oder Datei werden beim Laden validiert
const data = JSON.parse(await Deno.readTextFile('./tree.json'));
const loaded = Tree.fromNested<Entry>(data, { maxSize: 100_000, maxDepth: 64 });

// ...und können in derselben Struktur zurückgespeichert werden
const json = JSON.stringify(loaded.toNested());
```

:::tip
Übergeben Sie beim Laden nicht vertrauenswürdiger Daten immer `maxSize` / `maxDepth`. Übergroße oder fehlerhafte Eingaben werden mit einem `InvalidOperationError` zurückgewiesen, bevor die gesamte Struktur aufgebaut wird.
:::

## Siehe auch

- [Tree API-Referenz](../api/tree.md)
- [Budget-Rollup](./tree-budget-rollup.md)
