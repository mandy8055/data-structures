---
id: music-playlist
title: Music Playlist
sidebar_label: Music Playlist
description: Musik-Playlist mit Vorwärts-/Rückwärts-Wiedergabe mittels DoublyLinkedList
keywords: [doubly-linked-list, music, playlist, example]
---

# Music Playlist mit DoublyLinkedList

Erstellen Sie eine Musik-Playlist mit Vorwärts- und Rückwärtsnavigation.

## Implementierung

```typescript
import { DoublyLinkedList } from '@msnkr/data-structures';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number; // Sekunden
}

const playlist = new DoublyLinkedList<Song>();

// Songs hinzufügen
playlist.append({
  id: 1,
  title: 'Song One',
  artist: 'Artist A',
  duration: 180,
});
playlist.append({
  id: 2,
  title: 'Song Two',
  artist: 'Artist B',
  duration: 200,
});
playlist.append({
  id: 3,
  title: 'Song Three',
  artist: 'Artist C',
  duration: 195,
});
playlist.append({
  id: 4,
  title: 'Song Four',
  artist: 'Artist A',
  duration: 210,
});

// Vorwärts abspielen
console.log('Playing forward:');
for (const song of playlist) {
  console.log(`♪ ${song.title} by ${song.artist}`);
}

// Rückwärts abspielen
console.log('\nPlaying backward:');
for (const song of playlist.reverseIterator()) {
  console.log(`♪ ${song.title} by ${song.artist}`);
}
```

## Ausgabe

```
Playing forward:
♪ Song One by Artist A
♪ Song Two by Artist B
♪ Song Three by Artist C
♪ Song Four by Artist A

Playing backward:
♪ Song Four by Artist A
♪ Song Three by Artist C
♪ Song Two by Artist B
♪ Song One by Artist A
```

## Playlist Manager

```typescript
class PlaylistManager {
  private songs = new DoublyLinkedList<Song>();
  private currentIndex = 0;

  addSong(song: Song): void {
    this.songs.append(song);
  }

  current(): Song | null {
    if (this.songs.isEmpty()) return null;
    return this.songs.get(this.currentIndex);
  }

  next(): Song | null {
    if (this.currentIndex < this.songs.size - 1) {
      this.currentIndex++;
      return this.current();
    }
    return null; // Ende der Playlist
  }

  previous(): Song | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.current();
    }
    return null; // Anfang der Playlist
  }

  shuffle(): void {
    const array = this.songs.toArray();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    this.songs.clear();
    array.forEach((song) => this.songs.append(song));
    this.currentIndex = 0;
  }

  getTotalDuration(): number {
    let total = 0;
    for (const song of this.songs) {
      total += song.duration;
    }
    return total;
  }
}

const manager = new PlaylistManager();
manager.addSong({
  id: 1,
  title: 'Song One',
  artist: 'Artist A',
  duration: 180,
});
manager.addSong({
  id: 2,
  title: 'Song Two',
  artist: 'Artist B',
  duration: 200,
});

console.log('Now playing:', manager.current()?.title);
console.log('Next:', manager.next()?.title);
console.log('Total duration:', manager.getTotalDuration(), 'seconds');
```

## Siehe auch

- [DoublyLinkedList API-Referenz](../api/doubly-linked-list.md)
- [Deque API-Referenz](../api/deque.md)
