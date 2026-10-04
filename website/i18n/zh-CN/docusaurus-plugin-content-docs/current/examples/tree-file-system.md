---
id: tree-file-system
title: File System Explorer
sidebar_label: File System Explorer
description: 使用 Tree 建模文件夹和文件，使用 path() 渲染面包屑导航，并使用 fold() 计算文件夹大小
keywords: [tree, n-ary-tree, file-system, breadcrumbs, example]
---

# 使用 Tree 构建文件系统浏览器

使用 `Tree` 建模一个文件夹层级结构，然后构建面包屑导航、搜索文件并安全地移动文件夹。

## 实现

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

## 使用 `path()` 生成面包屑导航

```typescript
function breadcrumb(node: TreeNode<Entry>): string {
  return '/' + fs.path(node).slice(1).map((e) => e.name).join('/');
}

const css = fs.find((e) => e.name === 'styles.css')!;
console.log(breadcrumb(css)); // "/projects/website/styles.css"
console.log(breadcrumb(report)); // "/projects/report.pdf"
```

## 使用 `fold()` 计算文件夹大小

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

## 搜索

```typescript
// 所有大于 10 KB 的文件
const large = fs
  .findAll((e) => e.kind === 'file' && e.bytes > 10_000)
  .map(breadcrumb);
console.log(large); // ["/projects/report.pdf", "/photos/beach.jpg"]

// 目录列表，文件夹优先
function ls(folder: TreeNode<Entry>): string[] {
  return [...folder.children]
    .sort((a, b) => b.value.kind.localeCompare(a.value.kind))
    .map((n) => n.value.name);
}
console.log(ls(projects)); // ["website", "report.pdf"]
```

## 安全地移动文件夹

```typescript
// 将 website 文件夹移动到 photos 下
fs.move(site, photos);
console.log(breadcrumb(css)); // "/photos/website/styles.css"

// 将一个文件夹移动到它自己的子文件夹中会被拒绝
try {
  fs.move(photos, site);
} catch (error) {
  console.log((error as Error).message);
  // "Cannot move a node under itself or one of its descendants"
}
```

## 从 JSON 加载

```typescript
// 来自 API 或文件的数据在加载时会被验证
const data = JSON.parse(await Deno.readTextFile('./tree.json'));
const loaded = Tree.fromNested<Entry>(data, { maxSize: 100_000, maxDepth: 64 });

// ……也可以以相同的结构保存回去
const json = JSON.stringify(loaded.toNested());
```

:::tip
加载不可信数据时，请始终传入 `maxSize` / `maxDepth`。在构建整个结构之前，超大或格式错误的输入会被以 `InvalidOperationError` 拒绝。
:::

## 另请参阅

- [Tree API 参考](../api/tree.md)
- [预算汇总](./tree-budget-rollup.md)
