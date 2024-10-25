import { assertEquals } from '@std/assert';
import { Trie } from '../core/trie.ts';

Deno.test('Trie - basic operations', async (t) => {
  await t.step('should create an empty trie', () => {
    const trie = new Trie<number>();
    assertEquals(trie.size, 0);
    assertEquals(trie.isEmpty(), true);
  });

  await t.step('should insert and search words', () => {
    const trie = new Trie<number>();
    trie.insert('hello', 1);
    trie.insert('help', 2);
    assertEquals(trie.search('hello'), 1);
    assertEquals(trie.search('help'), 2);
    assertEquals(trie.search('hell'), null);
  });

  await t.step('should handle case sensitivity', () => {
    const sensitiveTrie = new Trie<number>(true);
    const insensitiveTrie = new Trie<number>(false);

    sensitiveTrie.insert('Hello', 1);
    insensitiveTrie.insert('Hello', 1);

    assertEquals(sensitiveTrie.search('hello'), null);
    assertEquals(sensitiveTrie.search('Hello'), 1);
    assertEquals(insensitiveTrie.search('hello'), 1);
    assertEquals(insensitiveTrie.search('Hello'), 1);
  });

  await t.step('should check prefix existence', () => {
    const trie = new Trie<number>();
    trie.insert('hello', 1);
    trie.insert('help', 2);
    assertEquals(trie.hasPrefix('hel'), true);
    assertEquals(trie.hasPrefix('her'), false);
  });

  await t.step('should get all words with prefix', () => {
    const trie = new Trie<number>();
    trie.insert('hello', 1);
    trie.insert('help', 2);
    trie.insert('world', 3);
    assertEquals(trie.getAllWithPrefix('hel'), ['hello', 'help']);
    assertEquals(trie.getAllWithPrefix('wo'), ['world']);
    assertEquals(trie.getAllWithPrefix('xyz'), []);
  });

  await t.step('should remove words', () => {
    const trie = new Trie<number>();
    trie.insert('hello', 1);
    trie.insert('help', 2);
    assertEquals(trie.remove('hello'), true);
    assertEquals(trie.search('hello'), null);
    assertEquals(trie.search('help'), 2);
    assertEquals(trie.remove('hello'), false);
  });

  // Tests for contains method
  await t.step('should verify word existence with contains', () => {
    const trie = new Trie<number>();
    trie.insert('hello', 1);
    trie.insert('help', 2);

    assertEquals(trie.contains('hello'), true);
    assertEquals(trie.contains('help'), true);
    assertEquals(trie.contains('hell'), false);
    assertEquals(trie.contains(''), false);
  });

  await t.step('should handle case sensitivity in contains', () => {
    const sensitiveTrie = new Trie<number>(true);
    const insensitiveTrie = new Trie<number>(false);

    sensitiveTrie.insert('Hello', 1);
    insensitiveTrie.insert('Hello', 1);

    assertEquals(sensitiveTrie.contains('hello'), false);
    assertEquals(sensitiveTrie.contains('Hello'), true);
    assertEquals(insensitiveTrie.contains('hello'), true);
    assertEquals(insensitiveTrie.contains('Hello'), true);
  });

  // Tests for remove edge cases
  await t.step('should handle empty string in remove', () => {
    const trie = new Trie<number>();
    trie.insert('hello', 1);

    assertEquals(trie.remove(''), false);
    assertEquals(trie.size, 1);
  });

  await t.step('should handle non-existent word endings in remove', () => {
    const trie = new Trie<number>();
    trie.insert('hello', 1);
    trie.insert('help', 2);

    // This will traverse to 'hel' but won't find it as a complete word
    assertEquals(trie.remove('hel'), false);
    assertEquals(trie.size, 2);
    assertEquals(trie.contains('hello'), true);
    assertEquals(trie.contains('help'), true);
  });

  await t.step('should handle word removal with shared prefixes', () => {
    const trie = new Trie<number>();
    trie.insert('test', 1);
    trie.insert('testing', 2);

    // Remove the shorter word, keeping the longer one
    assertEquals(trie.remove('test'), true);
    assertEquals(trie.contains('test'), false);
    assertEquals(trie.contains('testing'), true);
    assertEquals(trie.size, 1);

    // Remove the longer word
    assertEquals(trie.remove('testing'), true);
    assertEquals(trie.contains('testing'), false);
    assertEquals(trie.size, 0);
  });

  await t.step('should handle removal of non-existent words', () => {
    const trie = new Trie<number>();
    trie.insert('hello', 1);

    assertEquals(trie.remove('world'), false);
    assertEquals(trie.size, 1);
    assertEquals(trie.contains('hello'), true);
  });

  await t.step('should get all entries', () => {
    const trie = new Trie<number>();
    trie.insert('hello', 1);
    trie.insert('help', 2);
    const entries = trie.entries();
    assertEquals(entries.length, 2);
    assertEquals(
      entries.sort(),
      [
        ['hello', 1],
        ['help', 2],
      ].sort(),
    );
  });

  await t.step('should clear the trie', () => {
    const trie = new Trie<number>();
    trie.insert('hello', 1);
    trie.insert('help', 2);
    trie.clear();
    assertEquals(trie.size, 0);
    assertEquals(trie.isEmpty(), true);
    assertEquals(trie.search('hello'), null);
  });
});
