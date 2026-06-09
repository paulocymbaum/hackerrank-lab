# Meta JSON schemas

Each entity in the course hierarchy carries a `*.meta.json` file linking disk content to the graph.

## course.meta.json

Location: `course/<course-slug>/course.meta.json`

```json
{
  "id": "javascript",
  "graphRootLabel": "JavaScript",
  "title": "JavaScript"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Kebab-case course slug (folder name) |
| `graphRootLabel` | yes | Label of the graph root node |
| `title` | yes | Human-readable course title |

## module.meta.json

Location: `course/<course>/modules/<NN-module-slug>/module.meta.json`

```json
{
  "id": "01-javascript-fundamentals",
  "graphIndex": "01",
  "graphNodeId": "n_abc123def0",
  "title": "JavaScript Fundamentals"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Module folder name |
| `graphIndex` | yes | Top-level section index (`01`–`07`) |
| `graphNodeId` | yes | Stable node id from graph JSON |
| `title` | yes | Human-readable module title |

## lesson.meta.json

Location: `course/<course>/modules/<module>/lessons/<lesson-id>/lesson.meta.json`

```json
{
  "id": "01.8.1-truthy-vs-falsy",
  "graphIndex": "01.8.1",
  "graphNodeId": "n_def456abc1",
  "title": "Truthy vs Falsy",
  "prerequisites": [],
  "status": "draft"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Lesson folder name (`<graphIndex>-<slug>`) |
| `graphIndex` | yes | Leaf node index from graph |
| `graphNodeId` | yes | Stable node id from graph JSON |
| `title` | yes | Human-readable lesson title |
| `prerequisites` | no | Array of graphIndex strings |
| `status` | no | `draft` \| `published` \| `composite` |
