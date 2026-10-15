---
title: "Smartscape & Entity Model"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 0: Understand the Shift"
moduleNumber: 3
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__03-smartscape-entities" data-course-slug="migration">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Smartscape — Entity Model After Migration

Dynatrace still auto-discovers infrastructure, services, and relationships after migration, but Smartscape on Grail uses a new node-and-edge model. Use **Smartscape DQL commands** for new topology queries; verify existing Classic queries against your environment's migration stage.

## Entity Type Mapping

Use this mapping to start migrating Classic entity queries. Available node types and fields depend on the entities monitored in your environment:

```
Classic Query                          Smartscape Command
─────────────────────────────────────── ──────────────────────────────────────
fetch dt.entity.host                    smartscapeNodes HOST
fetch dt.entity.service                 smartscapeNodes SERVICE
fetch dt.entity.process_group_instance  smartscapeNodes PROCESS
fetch dt.entity.application             smartscapeNodes FRONTEND
fetch dt.entity.kubernetes_cluster      smartscapeNodes K8S_CLUSTER
fetch dt.entity.kubernetes_node         smartscapeNodes K8S_NODE
```

:::note
💡 `smartscapeNodes` returns node properties, and `traverse` follows their relationships. Discover the node's `id` and fields instead of assuming Classic IDs and properties translate unchanged.
:::

:::danger
⚠️ Classic query availability depends on the environment and migration stage. Dynatrace's migration guidance describes transitional Classic support, not indefinite compatibility. Verify existing Classic queries in your own environment before relying on them.
:::

## Navigating Relationships

Classic entity selectors use relationship filters. In Smartscape, use `traverse`. A service's `runs_on` edge points toward its host, so discovering services from a host uses `direction:backward`; see the scoped example below.

:::note
🛠 **Try it:** Open a Notebook and run:  

`smartscapeNodes HOST, from:now()-15m | fields id, name | sort name asc | limit 20`  

Copy a returned Smartscape `id` into the services-on-a-host example below. A host with no matching service relationships can legitimately return no services.
:::

## Function Migration

```
Gen2 Function                    Gen3 Replacement
───────────────────────────────  ──────────────────────────────────────
entityName(id)                   name field, or getNodeName(id)
entityAttr(id, "field")          direct node field, or getNodeField(id, "field")
classicEntitySelector(...)       node filters + traverse
```

## Common Entity Queries

### Classic host properties (requires a Classic entity store)

```dql
fetch dt.entity.host
| fields entity.name, osType, cpuCores, tags
| sort entity.name asc
```

### List services on a host

Replace `HOST-<16_HEX_DIGITS>` with a discovered Smartscape host ID. This placeholder is not executable as written; converting a string with `toSmartscapeId` does not map a historical Classic ID to a new node.

```dql
smartscapeNodes HOST, from:now()-15m
| filter id == toSmartscapeId("HOST-<16_HEX_DIGITS>")
| traverse runs_on, SERVICE, direction:backward
| fields id, name
| dedup id
| sort name asc
| limit 20
```

:::tip
💡 **Classic discovery tip:** Where the Classic entity store is available, `describe dt.entity.service` lists its known service fields. For Smartscape, inspect returned node fields and consult the Semantic Dictionary.
:::

## Smartscape Views & In-Context Views

Gen3 Smartscape is now an interactive map powered by Grail:

- **Smartscape views** — ready-made perspectives for different topology questions
- **In-context views** — View topology and Visual Resolution Path, opened through supported app actions without leaving the current context
- **Cloud topology** — AWS and Azure overview views provide cloud-specific perspectives; the Smartscape on Grail view also includes supported GCP resources
- **Kubernetes** — full-stack visibility of clusters, namespaces, workloads

:::note
🛠 **Try it:** Ctrl+K → "Smartscape" → Explore the topology → Click any entity → See relationships, metrics, and problems in context.
:::

### Interpreting the graph

The graph is not necessarily a complete inventory. Views can aggregate or enrich underlying topology, so displayed nodes and edges do not always map one-to-one to Grail records.

- The selected timeframe includes nodes whose lifetime overlaps it.
- Filtering a parent with a segment can hide its children in nested views.
- The documented display limit is 4,000 nodes and 10,000 edges. This is a visualization limit, not a Grail storage or DQL result limit.

See the [Smartscape concepts](https://docs.dynatrace.com/docs/analyze-explore-automate/smartscape/smartscape-concepts) and [views documentation](https://docs.dynatrace.com/docs/analyze-explore-automate/smartscape/smartscape-views) for current behaviour and available perspectives.

## Smartscape App Prerequisites

The following are documented [Smartscape app permissions](https://docs.dynatrace.com/docs/analyze-explore-automate/smartscape), not the minimum permissions for every individual DQL query.

```
Permission                          Purpose
──────────────────────────────────  ──────────────────────────────
storage:smartscape:read             Read Smartscape topology data
storage:entities:read               Read segment-variable data
storage:metrics:read                Display entity metrics
storage:events:read                 Query problems on entities
storage:filter-segments:read        Apply segment filters
storage:buckets:read                Required for reading problems
storage:spans:read                  Read segment-variable data
storage:logs:read                   Read segment-variable data
storage:security.events:read        Read segment-variable data
storage:bizevents:read              Read segment-variable data
```

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"16%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","chi
