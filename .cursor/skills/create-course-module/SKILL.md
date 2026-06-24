---
name: create-course-module
description: >-
  Scaffolds a course module and its graph leaf lessons under course/<course>/modules/.
  Uses scaffold-from-graph.mjs driven by graph/course.graph.txt. Use when creating
  a new module or populating all lessons for a graph section (01–07).
disable-model-invocation: true
---

# Create Course Module

## Quick start

1. **Find the module in the graph**:

```bash
node .cursor/tools/graph/find-node-by-index.js "01"
```

2. **Scaffold module + all leaf lessons** (dry-run first):

```bash
node scripts/graph/scaffold-from-graph.mjs --module "01" --dry-run
node scripts/graph/scaffold-from-graph.mjs --module "01"
```

3. **Fill module README** at `course/javascript/modules/01-javascript-fundamentals/README.md`

4. **Validate**:

```bash
node scripts/validate-module.mjs --module 01-javascript-fundamentals
node scripts/graph/generate-content-map.mjs
cd frontend && npm run catalog:generate
```

## Workflow checklist

```
- [ ] Graph index confirmed via find-topics-graph
- [ ] scaffold-from-graph.mjs --module run
- [ ] module.meta.json has correct graphIndex and graphNodeId
- [ ] Module README has lesson map
- [ ] validate-module.mjs passes
- [ ] content-map regenerated
```

## Tools

| Task | Command |
|------|---------|
| Scaffold module + leaves | `scaffold-from-graph.mjs --module "NN"` |
| Manual module folder | `create-module-folder.js javascript NN "Title"` |
| Check completeness | `check-lessons.js` |
