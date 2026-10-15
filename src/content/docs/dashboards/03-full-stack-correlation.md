---
title: "Full-Stack Correlation"
course: "Dashboard Gallery"
track: "Dashboard Patterns"
moduleNumber: 3
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dashboards__03-full-stack-correlation" data-course-slug="dashboards">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Full-Stack Correlation Board

The "war room" dashboard — host health, service performance, log errors, and Davis problems correlated in one view.

## Row 1: Infrastructure

### Tile: CPU by Host (Line Chart)

```dql
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}
```

### Tile: Memory by Host (Line Chart)

```dql
timeseries avg(dt.host.memory.usage), by:{dt.entity.host}
```

## Row 2: Services

### Tile: Response Time (Line Chart)

```dql
timeseries avg(dt.service.request.response_time), by:{dt.entity.service}
```

### Tile: Error Rate (Line Chart)

```dql
timeseries avg(dt.service.request.failure_rate), by:{dt.entity.service}
```

## Row 3: Logs & Problems

### Tile: Log Errors Over Time (Line Chart)

```dql
fetch logs
| filter loglevel == "ERROR"
| makeTimeseries errors=count(), by:{log.source}
```

### Tile: Active Problems (Table)

```dql
fetch events, from:now()-24h
| filter event.kind == "DAVIS_PROBLEM"
| fields display_id, event.name, event.status, timestamp
| sort timestamp desc
| limit 5
```

## The Correlation Pattern

```
When you see this...              Check this...
──────────────────────────────    ──────────────────────────────
CPU spike on host                 → Service RT on same host
Service RT spike                  → Log errors from that service
Log errors spike                  → Davis problems (auto-correlated)
Davis problem opened              → Affected entities in Smartscape
```

:::tip
💡 Set all tiles to the same time range. When you see a spike in one tile, check the same timestamp in other tiles — that's full-stack correlation.
:::

:::note
🛠 **Try it:** Build this dashboard tile by tile. Start with host health, add service performance, then logs, then Davis problems. The power is in seeing all four signal types on one screen — when a problem fires, you can instantly see which layer caused it.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"dashboards","title":"Dashboar
