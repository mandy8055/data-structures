---
id: phone-directory
title: Phone Directory
sidebar_label: Phone Directory
description: Kontaktsuche unabhängig von Groß-/Kleinschreibung mit Trie
keywords: [trie, phone, directory, contacts, search, example]
---

# Phone Directory mit Trie

Erstellen Sie ein Telefonverzeichnis mit schneller präfixbasierter Kontaktsuche.

## Implementierung

```typescript
import { Trie } from '@msnkr/data-structures';

interface Contact {
  name: string;
  phone: string;
  email?: string;
}

// Case-insensitive für benutzerfreundliche Suche
const directory = new Trie<Contact>(false);

// Kontakte hinzufügen
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

// Suche nach exaktem Namen
const john = directory.search('john');
console.log(john?.phone); // "555-0100"

// Alle Kontakte finden, die mit 'jo' beginnen
const joContacts = directory.getAllWithPrefix('jo');
console.log(joContacts); // ["john", "joe"]

// Kontaktdetails abrufen
joContacts.forEach((name) => {
  const contact = directory.search(name);
  if (contact) {
    console.log(`${contact.name}: ${contact.phone}`);
  }
});
```

## Ausgabe

```
John Doe: 555-0100
Joe Brown: 555-0102
```

## Erweiterte Suche

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

// Verwendung
const results = searchContacts('ja');
console.log(results); // [{ name: "Jane Smith", phone: "555-0101", ... }]
```

## Siehe auch

- [Trie API-Referenz](../api/trie.md)
- [Autocomplete Beispiel](./autocomplete-trie.md)
