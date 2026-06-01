---
name: find-topics-graph
description: Finds topics inside the Hackerrank Study course graph by rendering `graph/course.graph.txt` into JSON and traversing it with BFS/DFS. Use when the user asks to locate a topic, list prerequisites/children, or search the mindmap for a label (e.g. "Closures", "Promises", "Dynamic Programming").
disable-model-invocation: true
---

# Find Topics in the Graph

## What this skill is for

Use this skill to **find topics (node labels)** in the course graph stored in `graph/course.graph.txt` (Mermaid `mindmap`) by:

- Rendering it to JSON with the project script.
- Traversing the graph with BFS and/or DFS to locate nodes and report paths/children.

## Tools and paths (in this workspace)

### Render the TXT mindmap into JSON

- **Renderer script**: `scripts/graph/renderTxtToJson.js`
- **Input graph**: `graph/course.graph.txt`
- **Typical output**: `graph/course.graph.json`

Run:

```bash
node scripts/graph/renderTxtToJson.js graph/course.graph.txt graph/course.graph.json
```

### Topic-finding tools (runnable scenarios)

These are pre-made commands for common “find topic” workflows:

- **Find a topic (BFS)**: `.cursor/tools/graph/find-topic-bfs.js`
- **Find a topic (DFS)**: `.cursor/tools/graph/find-topic-dfs.js`
- **BFS → DFS (find section then list subtree)**: `.cursor/tools/graph/bfs-then-dfs-list-subtree.js`
- **DFS → BFS (find topic then list nearby)**: `.cursor/tools/graph/dfs-then-bfs-nearby.js`

### Traverse the JSON graph

- **BFS utility**: `scripts/graph/utils/bfs.js` (export: `bfs(graph, startId, options)`)
- **DFS utility**: `scripts/graph/utils/dfs.js` (export: `dfs(graph, startId, options)`)
- **Convenience export**: `scripts/graph/utils/index.js` (exports both `bfs` and `dfs`)

Graph JSON shape:

```js
{
  rootId: "n_...",
  nodes: [{ id: "n_...", label: "Closures" }],
  edges: [{ from: "n_parent", to: "n_child" }]
}
```

## Finding topics (use the tools)

- **BFS find** (prefer higher-level matches first):

```bash
node .cursor/tools/graph/find-topic-bfs.js "Closures"
```

- **DFS find** (good when you’re already exploring a branch):

```bash
node .cursor/tools/graph/find-topic-dfs.js "Promises"
```

## When to use BFS vs DFS (topic-finding scenarios)

### Use BFS when…

- You want the **closest match by hierarchy level** (find the first occurrence in “top-down” order).
- You’re looking for a topic and want to prefer **higher-level sections** first.
- You want a “broad overview” before diving deeper.

**Scenario**: “Find where `BFS and DFS` is in the course and show its parent section.”  
BFS will quickly scan main sections and reach “Data Structures and Algorithms” and its children in level order.

### Use DFS when…

- You want to **fully explore a branch** as soon as you enter it.
- You’re listing all subtopics under a section (deep enumeration).
- You’re searching inside a **specific subtree** and don’t care about other branches.

**Scenario**: “Under `Asynchronous JavaScript`, list everything down to leaves.”  
DFS will walk the whole Async branch without bouncing across unrelated sections.

## When both are needed (and in what order)

### Use BFS → then DFS when…

- You need to **quickly find the correct section** (high-level node), then **fully explore** only that section’s subtree.

**Scenario**: “Find `Asynchronous JavaScript`, then list all of its subtopics.”  
Do BFS to locate the node ID for “Asynchronous JavaScript”, then DFS starting at that ID to enumerate the branch.

### Use DFS → then BFS when…

- You’re already exploring a deep branch (or you found a candidate topic), and then you want to **fan out locally** to find a nearby sibling/neighbor topic without re-scanning the whole graph.

**Scenario**: “You found `Promises` while walking Async; now find what else is near it at the same depth (siblings under `Async Patterns`).”  
Do DFS to enter the Async branch and reach the general area, then BFS from the parent (or from the found node with `maxDepth: 1..2`) to collect nearby nodes.

## Combined cases (use the tools)

- **BFS → DFS**:

```bash
node .cursor/tools/graph/bfs-then-dfs-list-subtree.js "Asynchronous JavaScript"
```

- **DFS → BFS**:

```bash
node .cursor/tools/graph/dfs-then-bfs-nearby.js "Promises" 1
```

