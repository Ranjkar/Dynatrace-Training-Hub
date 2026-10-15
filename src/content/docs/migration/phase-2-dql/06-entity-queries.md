---
title: "Migrate Entity Selectors → Smartscape"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 2: Learn DQL"
moduleNumber: 12
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__06-entity-queries" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Entity Selectors → Smartscape DQL

Gen2 entity selectors were a mini-language for filtering entities. Gen3 replaces them with standard DQL queries on Smartscape nodes.

```
Gen2: type(HOST),tag("env:production"),healthState("UNHEALTHY")
Gen3: fetch dt.entity.host
      | filter matchesValue(tags, "env:production")
      | filter state != "RUNNING"
```

## Common Conversions

```
Gen2 Entity Selector                    Gen3 DQL
──────────────────────────────────────  ──────────────────────────────────────
type(HOST)                              fetch dt.entity.host
type(SERVICE),tag("team:payments")      fetch dt.entity.service
                                        | filter matchesValue(tags, "team:payments")
type(HOST),entityName("prod-*")         fetch dt.entity.host
                                        | filter contains(entity.name, "prod-")
type(SERVICE),relatesTo(HOST-ABC)       fetch dt.entity.service
                                        | filter ... (use traverse for complex)
```

:::note
🛠 **Try it:** Open a Notebook and run:  

`fetch dt.entity.service | fields entity.name, serviceType, tags | limit 20`  

Compare the results with what you see in the Services app.
:::

## Relationship Traversal

In Gen2, you used `relatesTo()` in entity selectors. In Gen3, you have two options:

### Option 1: fetch + filter (simple cases)

```dql
fetch dt.entity.service
| fields entity.name, serviceType
| limit 20
```

### Option 2: smartscapeNodes + traverse (complex topology)

```dql
smartscapeNodes HOST
| filter name == "my-server"
| traverse runs_on, SERVICE, direction: backward
| fields name, id
```

:::tip
💡 For most use cases, `fetch dt.entity.*` is simpler and sufficient. Use `smartscapeNodes` + `traverse` only when you need to walk complex relationship chains.
:::

:::danger
⚠️ **Classic vs New Smartscape types:** The new Smartscape uses simplified type names. `PROCESS_GROUP_INSTANCE` → `PROCESS`, `CONTAINER_GROUP_INSTANCE` → `CONTAINER`, `CLOUD_APPLICATION_INSTANCE` → `K8S_POD`. The `fetch dt.entity.*` views still use classic names, but `smartscapeNodes` uses the new names.
:::

### getNodeField: Access Fields from Related Nodes

```dql
// Get host name from an edge query without traversing
smartscapeEdges runs_on
| filter source_type == "PROCESS"
| fieldsAdd host_name = getNodeField(target_id, "name")
| fields source_id, host_name
| limit 10
```

## Migration Task: Convert Your Entity Selectors

Before migrating dashboards and alerts, inventory all entity selectors in your Gen2 config. Here's how to convert each pattern:

```
Gen2 Pattern                            Gen3 Conversion
──────────────────────────────────────  ──────────────────────────────────────
type(HOST)                              fetch dt.entity.host
tag("env:prod")                         | filter matchesValue(tags, "env:prod")
entityName("web-*")                     | filter startsWith(entity.name, "web-")
healthState("UNHEALTHY")                | filter state != "RUNNING"
relatesTo(HOST-ABC)                     smartscapeNodes + traverse
mzName("Production")                    Use Segments instead (Phase 4)
```

### Full-Stack Traversal: Host → Process → Service

```dql
// Find all services running on a specific host
smartscapeNodes HOST
| filter name == "my-server"
| traverse runs_on, PROCESS, direction: backward
| traverse runs_on, SERVICE, direction: backward
| fields name, id
```

### Impact Analysis: Which hosts run a service?

```dql
// Reverse: find all hosts for a service
smartscapeNodes SERVICE
| filter name == "payment-api"
| traverse runs_on, PROCESS
| traverse runs_on, HOST
| fields name, id
```

:::note
🛠 **Migration step:** Export your Gen2 management zone rules. Each rule contains entity selectors. Convert them to DQL using the table above, then use these queries in your Gen3 dashboards and anomaly detectors.
:::

## Discovery: What Entity Types Exist?

```dql
// List all entity types in your environment
smartscapeNodes *
| summarize count = count(), by:{type}
| sort count desc
```

```dql
// Discover fields for any entity type
describe dt.entity.service
```

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"52%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center
