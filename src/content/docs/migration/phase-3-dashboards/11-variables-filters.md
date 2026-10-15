---
title: "Migrate MZ Filters → Variables & Segments"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 3: Migrate Dashboards"
moduleNumber: 17
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__11-variables-filters" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Migrating Dashboard Filters

Management zone filters on dashboards need to be replaced with **Segments** and **DQL variables**. This is one of the most impactful changes — a single variable-driven dashboard can replace dozens of MZ-filtered copies.

## Segments (Replacing Management Zones)

```
Gen2: Management Zones                  Gen3: Segments
──────────────────────────────────────  ──────────────────────────────────────
Entity-based filtering (rule-based)     DQL filter expressions (query-time)
Pre-computed (performance overhead)     Query-time (no pre-computation)
Environment-level config                Account-level, reusable across environments
Applied globally or per dashboard       Applied per app, dashboard, notebook
```

:::note
🛠 **Try it:** Ctrl+K → "Segments" → Create a segment → Define a DQL filter like `matchesValue(tags, "env:production")` → Apply it to a dashboard.
:::

## Dashboard Variables

Variables create dropdown filters on dashboards. Users can select values to filter all tiles.

```dql
// Variable query: list all host names for a dropdown
fetch dt.entity.host
| fields entity.name
| sort entity.name asc
```

### Using Variables in Tile Queries

```dql
// Single-select variable — must have by:{} for | filter to work
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}
| filter dt.entity.host == $HostVariable

// Multi-select variable
fetch logs, from:now() - 1h
| filter in(dt.process.name, array($ProcessVariable))
```

:::danger
⚠️ `| filter dt.entity.host == ...` only works if `by:{dt.entity.host}` is in the timeseries command — otherwise the field doesn't exist in the output. Alternative: use `filter:{dt.entity.host == $Var}` inside the timeseries command (more performant).
:::

## Variable Types

```
Type      How It Works                              Use Case
────────  ────────────────────────────────────────  ──────────────────────────────
Query     DQL query populates dropdown values        Host picker, service picker
Code      JavaScript generates values                Dynamic calculations
Static    Fixed list of values                       Environment names, team names
```

### Query Variable Example

```dql
// Populate a host dropdown
fetch dt.entity.host
| fields entity.name
| sort entity.name asc
```

### Multi-Select with array()

```dql
// Filter by multiple selected values
fetch logs, from:now() - 1h
| filter in(dt.process.name, array($ProcessVariable))
| summarize count(), by:{loglevel}
```

## Migration: MZ Filters → Variables + Segments

In Gen2, management zones filtered all dashboard tiles globally. In Gen3, you have two options:

```
Gen2 Pattern                            Gen3 Replacement
──────────────────────────────────────  ──────────────────────────────────────
MZ filter on dashboard                  Segment applied to dashboard
MZ filter per tile                      DQL variable in tile query
MZ for team isolation                   ABAC policy (Phase 4, Module 17)
MZ for cost center                      dt.cost.costcenter tag + variable
```

:::note
🛠 **Migration step:** For each Gen2 dashboard with MZ filters: (1) Create a Segment with equivalent DQL filter, (2) Apply the Segment to the Gen3 dashboard, (3) Add DQL variables for any per-tile filtering that MZs handled.
:::

## Variable JSON Format (for API deployment)

```json
{
  "key": "HostVariable",
  "type": "query",
  "visible": true,
  "version": 2,
  "input": "fetch dt.entity.host | fields entity.name | sort entity.name asc"
}
```

:::danger
⚠️ Variables use `key` (not `id`), `input` (not `value`), and each needs `"version": 2`. The root dashboard JSON needs `"importedWithCode": true` for variables to work via API.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"72%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"c
