---
id: autocomplete-trie
title: 自动补全系统
sidebar_label: 自动补全系统
description: 使用 Trie 构建快速前缀匹配的自动补全功能
keywords: [trie, autocomplete, search, prefix, example]
---

# 使用 Trie 的自动补全系统

使用 Trie 数据结构实现快速的自动补全建议。

## 实现

```typescript
import { Trie } from '@msnkr/data-structures';

// 存储带有频率分数的单词
const autocomplete = new Trie<number>();

// 添加单词及其流行度分数
autocomplete.insert('apple', 100);
autocomplete.insert('application', 85);
autocomplete.insert('apply', 90);
autocomplete.insert('appetite', 75);
autocomplete.insert('banana', 80);

// 获取自动补全建议
function getSuggestions(prefix: string): string[] {
  if (!autocomplete.hasPrefix(prefix)) {
    return [];
  }
  return autocomplete.getAllWithPrefix(prefix);
}

// 使用示例
console.log(getSuggestions('app'));
// 输出：["apple", "application", "apply", "appetite"]

console.log(getSuggestions('ban'));
// 输出：["banana"]

console.log(getSuggestions('xyz'));
// 输出：[]
```

## 带排名的结果

```typescript
interface SearchResult {
  word: string;
  score: number;
}

function getRankedSuggestions(prefix: string, limit = 5): SearchResult[] {
  const words = autocomplete.getAllWithPrefix(prefix);

  return words
    .map((word) => ({
      word,
      score: autocomplete.search(word) || 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

console.log(getRankedSuggestions('app', 3));
// 输出：[
//   { word: "apple", score: 100 },
//   { word: "apply", score: 90 },
//   { word: "application", score: 85 }
// ]
```

## 不区分大小写模式

```typescript
// 面向用户的搜索
const searchTrie = new Trie<number>(false); // 不区分大小写

searchTrie.insert('JavaScript', 100);
console.log(searchTrie.search('javascript')); // 100
console.log(searchTrie.search('JAVASCRIPT')); // 100
```

## 另请参阅

- [Trie API 参考](../api/trie.md)
