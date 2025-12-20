---
id: task-queue-linked-list
title: 任务队列
sidebar_label: 任务队列
description: 使用 LinkedList 按顺序处理任务
keywords: [linked-list, queue, task, example]
---

# 使用 LinkedList 的任务队列

按先进先出（FIFO）顺序处理任务。

## 实现

```typescript
import { LinkedList } from '@msnkr/data-structures';

interface Task {
  id: number;
  name: string;
  priority?: string;
}

const taskQueue = new LinkedList<Task>();

// 添加任务到队列
taskQueue.append({ id: 1, name: '处理付款' });
taskQueue.append({ id: 2, name: '发送确认邮件' });
taskQueue.append({ id: 3, name: '更新库存' });

// 在前面添加高优先级任务
taskQueue.prepend({ id: 0, name: '紧急备份', priority: 'HIGH' });

// 按顺序处理任务
while (!taskQueue.isEmpty()) {
  const task = taskQueue.removeFirst();
  console.log(`处理任务 #${task.id}：${task.name}`);
}
```

## 输出

```
处理任务 #0：紧急备份
处理任务 #1：处理付款
处理任务 #2：发送确认邮件
处理任务 #3：更新库存
```

## 实际使用

```typescript
class TaskProcessor {
  private queue = new LinkedList<Task>();

  addTask(task: Task): void {
    this.queue.append(task);
    console.log(`已添加任务：${task.name}（队列大小：${this.queue.size}）`);
  }

  processNext(): Task | null {
    if (this.queue.isEmpty()) {
      return null;
    }
    return this.queue.removeFirst();
  }

  peek(): Task | null {
    return this.queue.get(0);
  }

  clear(): void {
    this.queue.clear();
  }
}

const processor = new TaskProcessor();
processor.addTask({ id: 1, name: '任务 1' });
processor.addTask({ id: 2, name: '任务 2' });
console.log('下一个任务：', processor.peek());
```

## 另请参阅

- [LinkedList API 参考](../api/linked-list.md)
- [Queue API 参考](../api/queue.md) - 专用的 FIFO 队列
- [PriorityQueue](../api/priority-queue.md) - 用于基于优先级的处理
