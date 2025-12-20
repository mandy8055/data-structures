---
id: phone-directory
title: Phone Directory
sidebar_label: Phone Directory
description: Case-insensitive contact search with Trie
keywords: [trie, phone, directory, contacts, search, example]
---

# Phone Directory with Trie

Build a phone directory with fast prefix-based contact search.

## Implementation

```typescript
import { Trie } from '@msnkr/data-structures';

interface Contact {
  name: string;
  phone: string;
  email?: string;
}

// Case-insensitive for user-friendly search
const directory = new Trie<Contact>(false);

// Add contacts
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

// Search by exact name
const john = directory.search('john');
console.log(john?.phone); // "555-0100"

// Find all contacts starting with 'jo'
const joContacts = directory.getAllWithPrefix('jo');
console.log(joContacts); // ["john", "joe"]

// Get contact details
joContacts.forEach((name) => {
  const contact = directory.search(name);
  if (contact) {
    console.log(`${contact.name}: ${contact.phone}`);
  }
});
```

## Output

```
John Doe: 555-0100
Joe Brown: 555-0102
```

## Advanced Search

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

// Usage
const results = searchContacts('ja');
console.log(results); // [{ name: "Jane Smith", phone: "555-0101", ... }]
```

## See Also

- [Trie API Reference](../api/trie.md)
- [Autocomplete Example](./autocomplete-trie.md)
