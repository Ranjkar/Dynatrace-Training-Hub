---
title: "Service Performance Board"
course: "Dashboard Gallery"
track: "Dashboard Patterns"
moduleNumber: 1
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dashboards__01-service-board" data-course-slug="dashboards">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Service Performance Board

Golden signals for every service — latency, throughput, errors, saturation.

## Tile 1: Response Time P95 (Line Chart)

```dql
timeseries percentile(dt.service.request.response_time, 95), by:{dt.entity.service}
```

## Tile 2: Throughput (Line Chart)

```dql
timeseries sum(dt.service.request.count), by:{dt.entity.service}
```

## Tile 3: Failure Rate (Line Chart)

```dql
timeseries avg(dt.service.request.failure_rate), by:{dt.entity.service}
```

## Tile 4: Slowest Endpoints (Table)

```dql
fetch spans, from:now()-1h
| filter span.kind == "SERVER"
| summarize avg_rt=avg(duration), cnt=count(), by:{service.name, span.name}
| sort avg_rt desc
| limit 10
```

## Tile 5: Top Errors (Table)

```dql
fetch logs, from:now()-1h
| filter loglevel == "ERROR"
| summarize cnt=count(), by:{content}
| sort cnt desc
| limit 5
```

## Tile 6: Service List (Table)

```dql
fetch dt.entity.service
| fields entity.name, serviceType
```

## Variable: Service Filter

```dql
// Variable definition (type: query)
fetch dt.entity.service | fields entity.name, id

// Use in tiles:
timeseries avg(dt.service.request.response_time),
  filter:{dt.entity.service == $service}
```

:::tip
💡 Add a service variable so users can filter all tiles to one service. This turns a generic board into a per-service deep dive.
:::

:::note
🛠 **Try it:** Open Dashboards → browse Ready-made dashboards → find one related to services or applications. Duplicate it, then open each tile to study the DQL queries — this is the fastest way to learn dashboard patterns.
:::

b:["$","div",n
