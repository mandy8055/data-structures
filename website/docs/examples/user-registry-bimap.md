---
id: user-registry-bimap
title: User Registry
sidebar_label: User Registry
description: Map between user IDs and usernames with BiMap
keywords: [bimap, user, registry, authentication, example]
---

# User Registry with BiMap

Maintain bidirectional mapping between user IDs and usernames.

## Implementation

```typescript
import { BiDirectionalMap } from '@msnkr/data-structures';

const userRegistry = new BiDirectionalMap<number, string>();

// Register users
userRegistry.set(1, 'alice');
userRegistry.set(2, 'bob');
userRegistry.set(3, 'charlie');

// Find username by ID
const username = userRegistry.get(2);
console.log(username); // "bob"

// Find ID by username (O(1) lookup!)
const userId = userRegistry.getKey('alice');
console.log(userId); // 1

// Check if username is taken
function isUsernameTaken(username: string): boolean {
  return userRegistry.hasValue(username);
}

console.log(isUsernameTaken('bob')); // true
console.log(isUsernameTaken('newuser')); // false
```

## User Management

```typescript
class UserManager {
  private users = new BiDirectionalMap<number, string>();
  private nextId = 1;

  register(username: string): number | null {
    // Check if username already exists
    if (this.users.hasValue(username)) {
      console.log(`Username '${username}' is already taken`);
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
      return false; // Username taken
    }
    this.users.deleteKey(userId);
    this.users.set(userId, newUsername);
    return true;
  }
}

const manager = new UserManager();
const id1 = manager.register('alice'); // 1
const id2 = manager.register('bob'); // 2
manager.register('alice'); // null (already exists)

console.log(manager.getUsername(1)); // "alice"
console.log(manager.getUserId('bob')); // 2
```

## See Also

- [BiMap API Reference](../api/bi-map.md)
- [Country Code Example](./country-code-bimap.md)
