---
id: bi-map
title: BiDirectionalMap
sidebar_label: BiMap
description: 双向映射，支持两个方向的 O(1) 查找
keywords:
  [
    bi-map,
    bidirectional-map,
    two-way-map,
    data-structure,
    typescript,
    javascript,
  ]
---

import InstallTabs from '@site/src/components/InstallTabs';

# BiDirectionalMap

双向映射（BiMap）维护键和值之间的一对一映射关系，允许在两个方向上进行高效的 O(1) 查找。

## 安装

<InstallTabs packageName='@msnkr/data-structures' importName='BiDirectionalMap' />

## 使用方法

```typescript
import { BiDirectionalMap } from '@msnkr/data-structures';

const biMap = new BiDirectionalMap<string, number>();
```

## API 参考

### 属性

- `size: number` - 映射中键值对的数量

### 方法

#### 设置和获取元素

```typescript
// 设置键值对 - O(1)
biMap.set('one', 1);

// 通过键获取值 - O(1)
const value = biMap.get('one');

// 通过值获取键 - O(1)
const key = biMap.getKey(1);
```

:::tip 双向查找
与普通映射不同，BiMap 允许通过值高效地查找键，时间复杂度为 O(1)。
:::

#### 检查存在性

```typescript
// 检查键是否存在 - O(1)
const hasKey = biMap.hasKey('one');

// 检查值是否存在 - O(1)
const hasValue = biMap.hasValue(1);
```

#### 删除元素

```typescript
// 通过键删除 - O(1)
const removedByKey = biMap.deleteKey('one');

// 通过值删除 - O(1)
const removedByValue = biMap.deleteValue(1);

// 删除所有映射 - O(1)
biMap.clear();
```

#### 迭代

```typescript
// 迭代所有键
for (const key of biMap.keys()) {
  console.log(key);
}

// 迭代所有值
for (const value of biMap.values()) {
  console.log(value);
}

// 迭代所有条目
for (const [key, value] of biMap.entries()) {
  console.log(`${key} => ${value}`);
}

// 使用 forEach
biMap.forEach((value, key, map) => {
  console.log(`${key} 映射到 ${value}`);
});
```

#### 实用方法

```typescript
// 从条目创建 - O(n)
const entries: [string, number][] = [
  ['one', 1],
  ['two', 2],
];
const biMap = BiDirectionalMap.fromEntries(entries);

// 转换为对象 - O(n)
const obj = biMap.toObject();
```

## 示例

### 基本使用

```typescript
const biMap = new BiDirectionalMap<string, number>();

// 设置映射（支持链式调用）
biMap.set('one', 1).set('two', 2).set('three', 3);

// 双向查找
console.log(biMap.get('one')); // 1
console.log(biMap.getKey(2)); // "two"

console.log(biMap.hasKey('three')); // true
console.log(biMap.hasValue(1)); // true
```

### HTTP 状态码映射

```typescript
const statusCodes = new BiDirectionalMap<number, string>();

statusCodes.set(200, 'OK');
statusCodes.set(404, 'Not Found');
statusCodes.set(500, 'Internal Server Error');

// 通过代码查找
console.log(statusCodes.get(404)); // "Not Found"

// 通过消息查找
console.log(statusCodes.getKey('OK')); // 200
```

### 国家代码注册表

```typescript
const countryCodes = new BiDirectionalMap<string, string>();

countryCodes.set('US', 'United States');
countryCodes.set('GB', 'United Kingdom');
countryCodes.set('FR', 'France');

// 通过代码获取国家名称
console.log(countryCodes.get('US')); // "United States"

// 通过名称获取国家代码
console.log(countryCodes.getKey('France')); // "FR"
```

### 处理重复值（一对一约束）

```typescript
const biMap = new BiDirectionalMap<string, number>();

biMap.set('one', 1);
biMap.set('another', 1); // 覆盖之前的映射

console.log(biMap.get('one')); // undefined（映射已删除）
console.log(biMap.get('another')); // 1
console.log(biMap.getKey(1)); // "another"

console.log(biMap.size); // 1（只存在一个映射）
```

:::caution 一对一约束
BiMap 强制执行一对一映射。使用已存在的值设置键会删除之前的键值对。
:::

### 用户 ID 到用户名映射

```typescript
const userRegistry = new BiDirectionalMap<number, string>();

// 注册用户
userRegistry.set(1, 'alice');
userRegistry.set(2, 'bob');
userRegistry.set(3, 'charlie');

// 通过 ID 查找用户名
const username = userRegistry.get(2); // "bob"

// 通过用户名查找 ID
const userId = userRegistry.getKey('alice'); // 1

// 检查用户名是否已被占用
if (userRegistry.hasValue('newuser')) {
  console.log('用户名已被占用！');
}
```

### 语言翻译

```typescript
const translations = new BiDirectionalMap<string, string>();

translations.set('hello', '你好');
translations.set('goodbye', '再见');
translations.set('thank you', '谢谢');

// 英译中
console.log(translations.get('hello')); // "你好"

// 中译英
console.log(translations.getKey('再见')); // "goodbye"
```

## 时间复杂度

| 操作        | 平均 | 最坏 |
| ----------- | ---- | ---- |
| set         | O(1) | O(1) |
| get         | O(1) | O(1) |
| getKey      | O(1) | O(1) |
| hasKey      | O(1) | O(1) |
| hasValue    | O(1) | O(1) |
| deleteKey   | O(1) | O(1) |
| deleteValue | O(1) | O(1) |
| clear       | O(1) | O(1) |

## 最佳实践

### 何时使用 BiMap

- ✅ 需要双向查找（键到值和值到键）
- ✅ 键和值之间是一对一关系
- ✅ 需要频繁的反向查找操作
- ✅ 维护唯一标识符映射

### 何时不使用 BiMap

- ❌ 一个键可能对应多个值
- ❌ 只需要单向查找
- ❌ 值不需要是唯一的

## 相关数据结构

- **Map** - 单向键值映射，支持重复值
- **Set** - 唯一值集合，不支持键值对
- **SortedMap** - 按键排序的映射

## TypeScript 提示

```typescript
// 使用泛型确保类型安全
const stringToNumber = new BiDirectionalMap<string, number>();
stringToNumber.set('one', 1);

// 类型检查
const value: number | undefined = stringToNumber.get('one');
const key: string | undefined = stringToNumber.getKey(1);

// 接口支持
interface User {
  id: number;
  username: string;
}

const userMap = new BiDirectionalMap<number, User>();
userMap.set(1, { id: 1, username: 'alice' });
```
