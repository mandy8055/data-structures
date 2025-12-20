---
id: case-insensitive-sorting
title: 不区分大小写排序
sidebar_label: 不区分大小写排序
description: 使用 RedBlackTree 对字符串进行不区分大小写的排序
keywords: [red-black-tree, sorting, case-insensitive, strings, example]
---

# 不区分大小写的字符串排序

按不区分大小写的字母顺序对字符串进行排序。

## 实现

```typescript
import { RedBlackTree } from '@msnkr/data-structures';

// 不区分大小写的比较器
const names = new RedBlackTree<string>({
  comparator: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
});

// 添加混合大小写的名称
names.insert('Charlie');
names.insert('alice');
names.insert('BOB');
names.insert('David');

// 按不区分大小写的字母顺序迭代
for (const name of names) {
  console.log(name);
}
```

## 输出

```
alice
BOB
Charlie
David
```

## 保留原始大小写

```typescript
interface CaseInsensitiveString {
  original: string;
  lowercase: string;
}

const sortedNames = new RedBlackTree<CaseInsensitiveString>({
  comparator: (a, b) => a.lowercase.localeCompare(b.lowercase),
});

function addName(name: string): void {
  sortedNames.insert({
    original: name,
    lowercase: name.toLowerCase(),
  });
}

addName('Charlie');
addName('alice');
addName('BOB');

for (const item of sortedNames) {
  console.log(item.original);
}
// 输出：alice, BOB, Charlie
```

## 不区分大小写搜索

```typescript
function searchName(name: string): boolean {
  const searchTerm = {
    original: name,
    lowercase: name.toLowerCase(),
  };
  return sortedNames.contains(searchTerm);
}

console.log(searchName('bob')); // true
console.log(searchName('BOB')); // true
console.log(searchName('Bob')); // true
console.log(searchName('bobby')); // false
```

## 另请参阅

- [RedBlackTree API 参考](../api/red-black-tree.md)
- [Trie](../api/trie.md) - 用于不区分大小写的前缀匹配
