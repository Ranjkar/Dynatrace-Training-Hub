---
title: "Executive Overview"
course: "Dashboard Gallery"
track: "Dashboard Patterns"
moduleNumber: 0
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dashboards__00-executive-overview" data-course-slug="dashboards">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Executive Overview Dashboard

A single-screen dashboard for management — health score, active problems, SLO status, and key metrics.

## Tile 1: Active Problems (Single Value)

```dql
fetch events, from:now()-24h
| filter event.kind == "DAVIS_PROBLEM"
| filter event.status == "ACTIVE"
| summarize cnt=count()
```

## Tile 2: Host Health (Single Value)

```dql
fetch dt.entity.host
| summarize total=count(), healthy=countIf(state == "RUNNING")
| fieldsAdd pct = 100.0 * healthy / total
```

## Tile 3: Service Error Rate (Line Chart)

```dql
timeseries avg(dt.service.request.failure_rate), by:{dt.entity.service}
```

## Tile 4: CPU Usage (Line Chart)

```dql
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}
```

## Tile 5: Log Errors (Single Value)

```dql
fetch logs, from:now()-24h
| filter loglevel == "ERROR"
| summarize cnt=count()
```

## Tile 6: Recent Problems (Table)

```dql
fetch events, from:now()-7d
| filter event.kind == "DAVIS_PROBLEM"
| fields display_id, event.name, event.status, timestamp
| sort timestamp desc
| limit 5
```

## Layout

```
┌──────────────┬──────────────┬──────────────┐
│  Active       │  Host Health  │  Log Errors   │
│  Problems     │  100%         │  24h          │
│  (single val) │  (single val) │  (single val) │
├──────────────┴──────────────┴──────────────┤
│  Service Error Rate (line chart, full width) │
├──────────────┬──────────────────────────────┤
│  CPU Usage    │  Recent Problems (table)      │
│  (line chart) │                               │
└──────────────┴──────────────────────────────┘
```

:::tip
💡 Keep executive dashboards to 6-8 tiles max. If they need more detail, link to a dedicated service or infrastructure dashboard.
:::

:::note
🛠 **Try it:** Open Dashboards → "+ Dashboard" → add a tile → select "Query Grail" → paste `fetch dt.entity.host | summarize total=count(), healthy=countIf(state == "RUNNING")` → choose "Single value" visualization. You just built your first executive KPI tile.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"dashboards","title":"Dashboard Gallery","subtitle":"Production-Ready Dashboard Patterns with DQL","color":"orange","tracks":[{"id":"dql-dashboards","title":"Dashboard Patterns","description":"Real production dashboards you can build in minutes","icon":"📊","modules":[{"number":0,"slug":"00-executive-overview","title":"
