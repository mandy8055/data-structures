---
id: task-priority-tree
title: 任务优先级系统
sidebar_label: 任务优先级系统
description: 使用 RedBlackTree 实现任务优先级系统
keywords: [red-black-tree, priority, task, sorting, example]
---

# 使用 RedBlackTree 的任务优先级系统

使用 RedBlackTree 按优先级顺序维护任务，并提供高效查找。

## 实现

```typescript
import { RedBlackTree } from '@msnkr/data-structures';

interface Task {
  id: number;
  priority: number;
  name: string;
}

// 优先级数字越大 = 优先级越高
const tasks = new RedBlackTree<Task>({
  comparator: (a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // 按优先级降序
    }
    return a.id - b.id; // ID 作为平局决胜
  },
});

// 添加任务
tasks.insert({ id: 1, priority: 2, name: '中等优先级任务' });
tasks.insert({ id: 2, priority: 3, name: '高优先级任务' });
tasks.insert({ id: 3, priority: 1, name: '低优先级任务' });

// 获取最高优先级任务
const highestPriority = tasks.max();
console.log(highestPriority); // { id: 2, priority: 3, name: '高优先级任务' }

// 按优先级顺序处理任务
for (const task of tasks) {
  console.log(`处理中：${task.name}（优先级：${task.priority}）`);
}
```

## 输出

```
处理中：高优先级任务（优先级：3）
处理中：中等优先级任务（优先级：2）
处理中：低优先级任务（优先级：1）
```

## 为什么选择 RedBlackTree？

- **有序排列** - 始终保持优先级排序
- **O(log n) 操作** - 高效的插入和删除
- **无重复** - 按任务自动去重

## 另请参阅

- [RedBlackTree API 参考](../api/red-black-tree.md)
- [PriorityQueue API 参考](../api/priority-queue.md)
