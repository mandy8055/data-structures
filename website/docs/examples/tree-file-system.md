---
id: tree-file-system
title: File System Explorer
sidebar_label: File System Explorer
description: Model folders and files with Tree, render breadcrumbs with path() and compute folder sizes with fold()
keywords: [tree, n-ary-tree, file-system, breadcrumbs, example]
---

# File System Explorer with Tree

Model a folder hierarchy with `Tree`, then build breadcrumbs, search for files and move folders around safely.

## Implementation

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

## Breadcrumbs with `path()`

```typescript
function breadcrumb(node: TreeNode<Entry>): string {
  return '/' + fs.path(node).slice(1).map((e) => e.name).join('/');
}

const css = fs.find((e) => e.name === 'styles.css')!;
console.log(breadcrumb(css)); // "/projects/website/styles.css"
console.log(breadcrumb(report)); // "/projects/report.pdf"
```

## Folder Sizes with `fold()`

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

## Searching

```typescript
// All files larger than 10 KB
const large = fs
  .findAll((e) => e.kind === 'file' && e.bytes > 10_000)
  .map(breadcrumb);
console.log(large); // ["/projects/report.pdf", "/photos/beach.jpg"]

// Directory listing, folders first
function ls(folder: TreeNode<Entry>): string[] {
  return [...folder.children]
    .sort((a, b) => b.value.kind.localeCompare(a.value.kind))
    .map((n) => n.value.name);
}
console.log(ls(projects)); // ["website", "report.pdf"]
```

## Moving Folders Safely

```typescript
// Move the website folder under photos
fs.move(site, photos);
console.log(breadcrumb(css)); // "/photos/website/styles.css"

// Moving a folder into its own subfolder is rejected
try {
  fs.move(photos, site);
} catch (error) {
  console.log((error as Error).message);
  // "Cannot move a node under itself or one of its descendants"
}
```

## Loading from JSON

```typescript
// Data from an API or file is validated while it is loaded
const data = JSON.parse(await Deno.readTextFile('./tree.json'));
const loaded = Tree.fromNested<Entry>(data, { maxSize: 100_000, maxDepth: 64 });

// ...and can be saved back in the same shape
const json = JSON.stringify(loaded.toNested());
```

:::tip
Always pass `maxSize` / `maxDepth` when loading untrusted data. Oversized or malformed input is rejected with an `InvalidOperationError` before the whole structure is built.
:::

## See Also

- [Tree API Reference](../api/tree.md)
- [Budget Rollup](./tree-budget-rollup.md)
