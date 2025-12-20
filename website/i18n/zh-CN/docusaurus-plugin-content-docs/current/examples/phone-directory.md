---
id: phone-directory
title: 电话目录
sidebar_label: 电话目录
description: 使用 Trie 实现不区分大小写的联系人搜索
keywords: [trie, phone, directory, contacts, search, example]
---

# 使用 Trie 的电话目录

构建一个支持快速前缀搜索的电话目录。

## 实现

```typescript
import { Trie } from '@msnkr/data-structures';

interface Contact {
  name: string;
  phone: string;
  email?: string;
}

// 不区分大小写以提供用户友好的搜索
const directory = new Trie<Contact>(false);

// 添加联系人
directory.insert('john', {
  name: 'John Doe',
  phone: '555-0100',
  email: 'john@example.com',
});
directory.insert('jane', {
  name: 'Jane Smith',
  phone: '555-0101',
  email: 'jane@example.com',
});
directory.insert('joe', {
  name: 'Joe Brown',
  phone: '555-0102',
});

// 按确切姓名搜索
const john = directory.search('john');
console.log(john?.phone); // "555-0100"

// 查找所有以 'jo' 开头的联系人
const joContacts = directory.getAllWithPrefix('jo');
console.log(joContacts); // ["john", "joe"]

// 获取联系人详情
joContacts.forEach((name) => {
  const contact = directory.search(name);
  if (contact) {
    console.log(`${contact.name}: ${contact.phone}`);
  }
});
```

## 输出

```
John Doe: 555-0100
Joe Brown: 555-0102
```

## 高级搜索

```typescript
function searchContacts(prefix: string): Contact[] {
  const names = directory.getAllWithPrefix(prefix.toLowerCase());
  return names
    .map((name) => directory.search(name))
    .filter((contact): contact is Contact => contact !== null);
}

function findByPhone(phone: string): Contact | null {
  for (const [name, contact] of directory.entries()) {
    if (contact.phone === phone) {
      return contact;
    }
  }
  return null;
}

// 使用示例
const results = searchContacts('ja');
console.log(results); // [{ name: "Jane Smith", phone: "555-0101", ... }]
```

## 另请参阅

- [Trie API 参考](../api/trie.md)
- [自动补全示例](./autocomplete-trie.md)
