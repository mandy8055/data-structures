---
id: music-playlist
title: 音乐播放列表
sidebar_label: 音乐播放列表
description: 使用 DoublyLinkedList 实现支持前进/后退播放的音乐播放列表
keywords: [doubly-linked-list, music, playlist, example]
---

# 使用 DoublyLinkedList 的音乐播放列表

创建一个支持前进和后退导航的音乐播放列表。

## 实现

```typescript
import { DoublyLinkedList } from '@msnkr/data-structures';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number; // 秒
}

const playlist = new DoublyLinkedList<Song>();

// 添加歌曲
playlist.append({
  id: 1,
  title: '歌曲一',
  artist: '歌手 A',
  duration: 180,
});
playlist.append({
  id: 2,
  title: '歌曲二',
  artist: '歌手 B',
  duration: 200,
});
playlist.append({
  id: 3,
  title: '歌曲三',
  artist: '歌手 C',
  duration: 195,
});
playlist.append({
  id: 4,
  title: '歌曲四',
  artist: '歌手 A',
  duration: 210,
});

// 正向播放
console.log('正向播放：');
for (const song of playlist) {
  console.log(`♪ ${song.title} - ${song.artist}`);
}

// 反向播放
console.log('\n反向播放：');
for (const song of playlist.reverseIterator()) {
  console.log(`♪ ${song.title} - ${song.artist}`);
}
```

## 输出

```
正向播放：
♪ 歌曲一 - 歌手 A
♪ 歌曲二 - 歌手 B
♪ 歌曲三 - 歌手 C
♪ 歌曲四 - 歌手 A

反向播放：
♪ 歌曲四 - 歌手 A
♪ 歌曲三 - 歌手 C
♪ 歌曲二 - 歌手 B
♪ 歌曲一 - 歌手 A
```

## 播放列表管理器

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
    return null; // 播放列表结束
  }

  previous(): Song | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.current();
    }
    return null; // 播放列表开始
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
  title: '歌曲一',
  artist: '歌手 A',
  duration: 180,
});
manager.addSong({
  id: 2,
  title: '歌曲二',
  artist: '歌手 B',
  duration: 200,
});

console.log('正在播放：', manager.current()?.title);
console.log('下一首：', manager.next()?.title);
console.log('总时长：', manager.getTotalDuration(), '秒');
```

## 另请参阅

- [DoublyLinkedList API 参考](../api/doubly-linked-list.md)
- [Deque API 参考](../api/deque.md)
