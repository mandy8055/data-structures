---
id: trie
title: Trie
sidebar_label: Trie
description: 用于高效字符串操作和自动完成的前缀树
keywords:
  [trie, prefix-tree, autocomplete, data-structure, typescript, javascript]
---

import InstallTabs from '@site/src/components/InstallTabs';

# Trie

通用字典树（前缀树）实现，高效存储和检索具有关联值的字符串。非常适合自动完成、拼写检查和基于前缀的搜索。

## 安装

<InstallTabs packageName='@msnkr/data-structures' importName='Trie' />

## 使用方法

```typescript
import { Trie } from '@msnkr/data-structures';

const trie = new Trie<number>();
```

## API 参考

### 属性

- `size: number` - 字典树中存储的单词数量
- `isEmpty(): boolean` - 字典树是否为空

### 方法

#### 添加和删除单词

```typescript
// 插入单词及其关联值 - O(m)
trie.insert('hello', 1);

// 删除单词 - O(m)
const removed = trie.remove('hello');

// 清除所有单词 - O(1)
trie.clear();
```

其中 `m` 是单词的长度

#### 搜索和检索

```typescript
// 搜索精确单词 - O(m)
const value = trie.search('hello');

// 检查单词是否存在 - O(m)
const exists = trie.contains('hello');

// 检查前缀是否存在 - O(p)
const hasPrefix = trie.hasPrefix('hel');

// 获取具有前缀的所有单词 - O(p + n)
const words = trie.getAllWithPrefix('hel');

// 获取所有条目为 [单词, 值] 对 - O(n)
const entries = trie.entries();
```

其中 `p` 是前缀长度，`n` 是匹配单词的数量

## 示例

### 带值的基本使用

```typescript
const trie = new Trie<number>();

// 插入单词及其关联值
trie.insert('hello', 1);
trie.insert('help', 2);
trie.insert('world', 3);

// 搜索单词
console.log(trie.search('hello')); // 1
console.log(trie.contains('help')); // true
console.log(trie.search('hell')); // null（部分单词未存储）

console.log(trie.size); // 3
```

### 自动完成系统

```typescript
const autocomplete = new Trie<number>();

// 添加单词及其频率/分数
autocomplete.insert('apple', 100);
autocomplete.insert('application', 85);
autocomplete.insert('apply', 90);
autocomplete.insert('appetite', 75);
autocomplete.insert('banana', 80);

// 获取自动完成建议
const suggestions = autocomplete.getAllWithPrefix('app');
console.log(suggestions); // ["apple", "application", "apply", "appetite"]

// 检查前缀是否有效
console.log(autocomplete.hasPrefix('ban')); // true
console.log(autocomplete.hasPrefix('xyz')); // false
```

### 区分大小写选项

```typescript
// 区分大小写的字典树（默认）
const sensitiveTrie = new Trie<number>();
sensitiveTrie.insert('Hello', 1);
console.log(sensitiveTrie.search('Hello')); // 1
console.log(sensitiveTrie.search('hello')); // null

// 不区分大小写的字典树
const insensitiveTrie = new Trie<number>(false);
insensitiveTrie.insert('Hello', 1);
console.log(insensitiveTrie.search('hello')); // 1
console.log(insensitiveTrie.search('HELLO')); // 1
console.log(insensitiveTrie.search('HeLLo')); // 1
```

:::tip 区分大小写
对于搜索和自动完成等面向用户的功能，使用不区分大小写模式以提供更好的用户体验。
:::

### 带定义的词典

```typescript
interface Definition {
  meaning: string;
  partOfSpeech: string;
}

const dictionary = new Trie<Definition>();

dictionary.insert('trie', {
  meaning: '用于存储字符串的树形数据结构',
  partOfSpeech: '名词',
});

dictionary.insert('algorithm', {
  meaning: '解决问题的分步过程',
  partOfSpeech: '名词',
});

const def = dictionary.search('trie');
if (def) {
  console.log(`${def.partOfSpeech}: ${def.meaning}`);
}
```

### IP 地址路由表

```typescript
interface Route {
  gateway: string;
  metric: number;
}

const routingTable = new Trie<Route>();

// 添加带 IP 前缀的路由
routingTable.insert('192.168.1', { gateway: '192.168.1.1', metric: 10 });
routingTable.insert('192.168', { gateway: '192.168.0.1', metric: 20 });
routingTable.insert('10.0', { gateway: '10.0.0.1', metric: 5 });

// 查找最具体的路由
const route = routingTable.search('192.168.1');
console.log(route); // { gateway: '192.168.1.1', metric: 10 }
```

### 带前缀的搜索历史

```typescript
const searchHistory = new Trie<Date>();

// 跟踪搜索执行的时间
searchHistory.insert('javascript', new Date());
searchHistory.insert('java', new Date());
searchHistory.insert('typescript', new Date());
searchHistory.insert('python', new Date());

// 获取所有以 'java' 开头的搜索
const javaSearches = searchHistory.getAllWithPrefix('java');
console.log(javaSearches); // ["java", "javascript"]
```

### 使用条目

```typescript
const trie = new Trie<number>();

trie.insert('apple', 1);
trie.insert('banana', 2);
trie.insert('cherry', 3);

// 获取所有条目
const entries = trie.entries();
console.log(entries);
// [['apple', 1], ['banana', 2], ['cherry', 3]]

// 迭代条目
for (const [word, value] of entries) {
  console.log(`${word}: ${value}`);
}
```

### 拼写检查器

```typescript
const spellChecker = new Trie<boolean>(false); // 不区分大小写

// 加载词典
const validWords = [
  'the',
  'quick',
  'brown',
  'fox',
  'jumps',
  'over',
  'lazy',
  'dog',
];
validWords.forEach((word) => spellChecker.insert(word, true));

function checkSpelling(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const misspelled: string[] = [];

  for (const word of words) {
    if (!spellChecker.contains(word)) {
      misspelled.push(word);
    }
  }

  return misspelled;
}

const text = 'The quik brown fox jumps over the lasy dog';
console.log('拼写错误:', checkSpelling(text)); // ['quik', 'lasy']
```

### 电话号码前缀匹配

```typescript
interface Contact {
  name: string;
  number: string;
}

const phonebook = new Trie<Contact>();

phonebook.insert('555-0100', { name: 'Alice', number: '555-0100' });
phonebook.insert('555-0101', { name: 'Bob', number: '555-0101' });
phonebook.insert('555-0200', { name: 'Charlie', number: '555-0200' });
phonebook.insert('556-0100', { name: 'David', number: '556-0100' });

// 按前缀查找联系人
const matches = phonebook.getAllWithPrefix('555-01');
console.log(matches); // ['555-0100', '555-0101']
```

### 文件路径索引

```typescript
interface FileInfo {
  size: number;
  lastModified: Date;
}

const fileIndex = new Trie<FileInfo>();

fileIndex.insert('/home/user/documents/report.pdf', {
  size: 1024,
  lastModified: new Date(),
});

fileIndex.insert('/home/user/documents/notes.txt', {
  size: 512,
  lastModified: new Date(),
});

fileIndex.insert('/home/user/pictures/photo.jpg', {
  size: 2048,
  lastModified: new Date(),
});

// 查找目录中的所有文件
const docFiles = fileIndex.getAllWithPrefix('/home/user/documents/');
console.log('文档文件:', docFiles);
// ['/home/user/documents/report.pdf', '/home/user/documents/notes.txt']
```

### URL 路由器

```typescript
interface RouteHandler {
  handler: string;
  method: string;
}

const router = new Trie<RouteHandler>();

router.insert('/api/users', { handler: 'getUsers', method: 'GET' });
router.insert('/api/users/create', { handler: 'createUser', method: 'POST' });
router.insert('/api/posts', { handler: 'getPosts', method: 'GET' });

function matchRoute(path: string): RouteHandler | null {
  return router.search(path);
}

console.log(matchRoute('/api/users')); // { handler: 'getUsers', method: 'GET' }
console.log(matchRoute('/api/posts')); // { handler: 'getPosts', method: 'GET' }
```

### 命令补全系统

```typescript
interface Command {
  description: string;
  usage: string;
}

const cli = new Trie<Command>();

cli.insert('git commit', {
  description: '记录对仓库的更改',
  usage: 'git commit -m "message"',
});

cli.insert('git checkout', {
  description: '切换分支',
  usage: 'git checkout <branch>',
});

cli.insert('git clone', {
  description: '克隆仓库',
  usage: 'git clone <url>',
});

cli.insert('git config', {
  description: '设置配置',
  usage: 'git config <key> <value>',
});

// 提供命令补全
function autocompleteCommand(partial: string): string[] {
  return cli.getAllWithPrefix(partial);
}

console.log(autocompleteCommand('git c'));
// ['git checkout', 'git clone', 'git commit', 'git config']
```

## 时间复杂度

| 操作             | 平均     | 最坏     |
| ---------------- | -------- | -------- |
| insert           | O(m)     | O(m)     |
| remove           | O(m)     | O(m)     |
| search           | O(m)     | O(m)     |
| contains         | O(m)     | O(m)     |
| hasPrefix        | O(p)     | O(p)     |
| getAllWithPrefix | O(p + n) | O(p + n) |
| clear            | O(1)     | O(1)     |

其中：

- `m` = 单词长度
- `p` = 前缀长度
- `n` = 匹配单词数量

## 空间复杂度

- **最坏情况**: O(ALPHABET_SIZE × N × M)
  - 其中 N = 单词数，M = 平均单词长度
- **最佳情况**: O(N × M) 当单词共享公共前缀时

## 与其他数据结构的比较

| 特性     | Trie    | Set       | Map       |
| -------- | ------- | --------- | --------- |
| 精确搜索 | O(m)    | O(1) 平均 | O(1) 平均 |
| 前缀搜索 | O(p)    | O(n)      | O(n)      |
| 自动完成 | ✅ 高效 | ❌ 低效   | ❌ 低效   |
| 空间使用 | 较高    | 较低      | 较低      |
| 前缀共享 | ✅ 是   | ❌ 否     | ❌ 否     |

## 最佳实践

### 何时使用 Trie

- ✅ 自动完成功能
- ✅ 拼写检查和更正
- ✅ IP 路由表
- ✅ 电话簿前缀匹配
- ✅ 搜索建议
- ✅ 词典实现
- ✅ URL 路由
- ✅ 单词游戏（例如 Scrabble、填字游戏）

### 何时不使用 Trie

- ❌ 只需要精确匹配（使用 Set 或 Map）
- ❌ 内存受限（使用压缩的 trie 变体）
- ❌ 很少或从不进行前缀搜索
- ❌ 处理非字符串数据

### 优化提示

```typescript
// 对于大型数据集，使用不区分大小写以节省空间
const trie = new Trie<number>(false);

// 分批插入以获得更好的性能
const words = ['word1', 'word2', 'word3'];
words.forEach((word) => trie.insert(word, 1));

// 如果不再需要，删除旧条目以释放内存
trie.remove('obsolete-word');
```

## 相关数据结构

- **Set** - 唯一值集合，无前缀搜索
- **Map** - 键值存储，无前缀搜索
- **RedBlackTree** - 已排序的唯一值，无前缀搜索
- **压缩 Trie/基数树** - 空间优化的 trie 变体
