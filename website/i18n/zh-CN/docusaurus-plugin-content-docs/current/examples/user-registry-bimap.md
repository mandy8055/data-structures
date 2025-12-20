---
id: user-registry-bimap
title: 用户注册表
sidebar_label: 用户注册表
description: 使用 BiMap 在用户 ID 和用户名之间进行映射
keywords: [bimap, user, registry, authentication, example]
---

# 使用 BiMap 的用户注册表

维护用户 ID 和用户名之间的双向映射。

## 实现

```typescript
import { BiDirectionalMap } from '@msnkr/data-structures';

const userRegistry = new BiDirectionalMap<number, string>();

// 注册用户
userRegistry.set(1, 'alice');
userRegistry.set(2, 'bob');
userRegistry.set(3, 'charlie');

// 通过 ID 查找用户名
const username = userRegistry.get(2);
console.log(username); // "bob"

// 通过用户名查找 ID（O(1) 查找！）
const userId = userRegistry.getKey('alice');
console.log(userId); // 1

// 检查用户名是否已被占用
function isUsernameTaken(username: string): boolean {
  return userRegistry.hasValue(username);
}

console.log(isUsernameTaken('bob')); // true
console.log(isUsernameTaken('newuser')); // false
```

## 用户管理

```typescript
class UserManager {
  private users = new BiDirectionalMap<number, string>();
  private nextId = 1;

  register(username: string): number | null {
    // 检查用户名是否已存在
    if (this.users.hasValue(username)) {
      console.log(`用户名 '${username}' 已被占用`);
      return null;
    }

    const userId = this.nextId++;
    this.users.set(userId, username);
    return userId;
  }

  getUsername(userId: number): string | undefined {
    return this.users.get(userId);
  }

  getUserId(username: string): number | undefined {
    return this.users.getKey(username);
  }

  deleteUser(userId: number): boolean {
    return this.users.deleteKey(userId);
  }

  renameUser(userId: number, newUsername: string): boolean {
    if (this.users.hasValue(newUsername)) {
      return false; // 用户名已被占用
    }
    this.users.deleteKey(userId);
    this.users.set(userId, newUsername);
    return true;
  }
}

const manager = new UserManager();
const id1 = manager.register('alice'); // 1
const id2 = manager.register('bob'); // 2
manager.register('alice'); // null（已存在）

console.log(manager.getUsername(1)); // "alice"
console.log(manager.getUserId('bob')); // 2
```

## 另请参阅

- [BiMap API 参考](../api/bi-map.md)
- [国家代码示例](./country-code-bimap.md)
