---
id: country-code-bimap
title: 国家代码注册表
sidebar_label: 国家代码注册表
description: 使用 BiMap 实现国家名称与代码的双向映射
keywords: [bimap, country, code, mapping, example]
---

# 使用 BiMap 的国家代码注册表

在国家代码和名称之间进行双向映射。

## 实现

```typescript
import { BiDirectionalMap } from '@msnkr/data-structures';

const countryCodes = new BiDirectionalMap<string, string>();

// 注册国家
countryCodes.set('US', 'United States');
countryCodes.set('GB', 'United Kingdom');
countryCodes.set('FR', 'France');
countryCodes.set('DE', 'Germany');
countryCodes.set('JP', 'Japan');

// 按代码查找
console.log(countryCodes.get('US')); // "United States"

// 按名称查找（O(1) 反向查找！）
console.log(countryCodes.getKey('France')); // "FR"

// 检查存在性
console.log(countryCodes.hasKey('JP')); // true
console.log(countryCodes.hasValue('Canada')); // false
```

## 验证

```typescript
function validateCountryCode(code: string): boolean {
  return countryCodes.hasKey(code);
}

function getCountryName(code: string): string | undefined {
  return countryCodes.get(code);
}

function findCountryCode(name: string): string | undefined {
  return countryCodes.getKey(name);
}

console.log(validateCountryCode('US')); // true
console.log(getCountryName('FR')); // "France"
console.log(findCountryCode('Japan')); // "JP"
```

## 遍历所有国家

```typescript
console.log('所有国家：');
for (const [code, name] of countryCodes.entries()) {
  console.log(`${code}: ${name}`);
}

// 输出：
// US: United States
// GB: United Kingdom
// FR: France
// DE: Germany
// JP: Japan
```

## 另请参阅

- [BiMap API 参考](../api/bi-map.md)
- [用户注册表示例](./user-registry-bimap.md)
