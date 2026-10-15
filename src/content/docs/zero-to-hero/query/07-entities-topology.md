---
title: "Entities, Topology & Traces"
course: "From Zero to Hero"
track: "Track 2: Query & Explore"
moduleNumber: 8
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__07-entities-topology" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Entities, Topology & Traces

Dynatrace auto-discovers every entity (host, service, process) and maps their relationships in Smartscape. Distributed traces show how requests flow across services.

## Entity Queries

```dql
// Hosts with details
fetch dt.entity.host
| fields entity.name, monitoringMode, state, tags

// Services
fetch dt.entity.service
| fields entity.name, serviceType

// Discover available fields
describe dt.entity.host
```

## Entity Types

```
Entity Type                     What It Represents
──────────────────────────────  ──────────────────────────────
dt.entity.host                  Servers, VMs, EC2 instances
dt.entity.service               Auto-detected services
dt.entity.process_group         Groups of identical processes
dt.entity.application           RUM web applications
dt.entity.http_check            HTTP synthetic monitors
dt.entity.browser_monitor       Browser clickpath monitors
dt.entity.kubernetes_cluster    K8s clusters
```

## Smartscape: Topology Queries

Smartscape commands let you traverse relationships between entities:

```dql
// Load all hosts as topology nodes
smartscapeNodes HOST

// Find what processes run on a host
smartscapeNodes PROCESS
| traverse runs_on, HOST, direction: forward, fieldsKeep:name
| fields process_name = dt.traverse.history[0][name], host_name = name
```

:::danger
Use Smartscape commands for topology stored in Smartscape on Grail. Classic `fetch dt.entity.*` examples depend on the entity views available in your environment; do not assume both models expose identical fields or relationships. See the [Smartscape DQL reference](https://docs.dynatrace.com/docs/platform/grail/dynatrace-query-language/commands/smartscape-commands).
:::

## Distributed Traces (PurePath)

A distributed trace shows a request's journey across services. Dynatrace calls this a **PurePath** — it captures every service call, database query, and external request.

```dql
// Recent traces with duration
fetch spans
| fields trace.id, span.name, duration, service.name
| sort duration desc
| limit 10

// Slow requests (> 5 seconds)
fetch spans
| filter span.kind == "server"
| filter duration > 5000000000
| fields trace.id, service.name, duration
| sort duration desc
```

:::tip
💡 Use the **Distributed Tracing** app (Ctrl+K → "Distributed Tracing") for visual trace analysis with facets, filtering, and waterfall views. DQL is for programmatic access.
:::

## Relationships via expand

Entity relationships are stored as nested records. Use `expand` to flatten them:

```dql
fetch dt.entity.service
| expand belongs_to
| fields entity.name, belongs_to
| limit 10
```

:::note
🛠 **Try it:** Open the Smartscape app → click any host → follow the connections to processes → services → applications. This is the topology graph that powers Davis root cause analysis. Try: `smartscapeNodes HOST` in a Notebook to see it as data.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to
