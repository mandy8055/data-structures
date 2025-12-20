---
id: user-registry-bimap
title: User Registry
sidebar_label: User Registry
description: Zuordnung zwischen Benutzer-IDs und Benutzernamen mit BiMap
keywords: [bimap, user, registry, authentication, example]
---

# User Registry mit BiMap

Bidirektionale Zuordnung zwischen Benutzer-IDs und Benutzernamen verwalten.

## Implementierung

```typescript
import { BiDirectionalMap } from '@msnkr/data-structures';

const userRegistry = new BiDirectionalMap<number, string>();

// Benutzer registrieren
userRegistry.set(1, 'alice');
userRegistry.set(2, 'bob');
userRegistry.set(3, 'charlie');

// Benutzername nach ID finden
const username = userRegistry.get(2);
console.log(username); // "bob"

// ID nach Benutzername finden (O(1) Lookup!)
const userId = userRegistry.getKey('alice');
console.log(userId); // 1

// Prüfen, ob Benutzername vergeben ist
function isUsernameTaken(username: string): boolean {
  return userRegistry.hasValue(username);
}

console.log(isUsernameTaken('bob')); // true
console.log(isUsernameTaken('newuser')); // false
```

## Benutzerverwaltung

```typescript
class UserManager {
  private users = new BiDirectionalMap<number, string>();
  private nextId = 1;

  register(username: string): number | null {
    // Prüfen, ob Benutzername bereits existiert
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
      return false; // Benutzername vergeben
    }
    this.users.deleteKey(userId);
    this.users.set(userId, newUsername);
    return true;
  }
}

const manager = new UserManager();
const id1 = manager.register('alice'); // 1
const id2 = manager.register('bob'); // 2
manager.register('alice'); // null (existiert bereits)

console.log(manager.getUsername(1)); // "alice"
console.log(manager.getUserId('bob')); // 2
```

## Siehe auch

- [BiMap API-Referenz](../api/bi-map.md)
- [Country Code Beispiel](./country-code-bimap.md)
