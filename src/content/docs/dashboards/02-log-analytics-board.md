---
title: "Log Analytics Board"
course: "Dashboard Gallery"
track: "Dashboard Patterns"
moduleNumber: 2
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dashboards__02-log-analytics-board" data-course-slug="dashboards">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Log Analytics Board

Log volume, error trends, top errors, and source breakdown — all in one dashboard.

## Tile 1: Total Log Volume (Single Value)

```dql
fetch logs | summarize cnt=count()
```

## Tile 2: Error Count (Single Value)

```dql
fetch logs | filter loglevel == "ERROR" | summarize cnt=count()
```

## Tile 3: Log Volume by Level (Stacked Area Chart)

```dql
fetch logs
| makeTimeseries count=count(), by:{loglevel}
```

## Tile 4: Error Trend (Line Chart)

```dql
fetch logs
| filter loglevel == "ERROR"
| makeTimeseries errors=count()
```

## Tile 5: Top Error Messages (Table)

```dql
fetch logs
| filter loglevel == "ERROR"
| summarize cnt=count(), by:{content}
| sort cnt desc
| limit 10
```

## Tile 6: Volume by Source (Bar Chart)

```dql
fetch logs
| summarize cnt=count(), by:{log.source}
| sort cnt desc
| limit 10
```

## Tile 7: Errors by Host (Table)

```dql
fetch logs
| filter loglevel == "ERROR"
| summarize cnt=count(), by:{dt.entity.host}
| sort cnt desc
```

:::tip
💡 The error trend tile is the most important — it shows whether errors are increasing, stable, or decreasing. Pair it with the top error messages table to know what's failing.
:::

:::note
🛠 **Try it:** Open a Notebook → run `fetch logs | makeTimeseries count=count(), by:{loglevel}` → click "Open with → Dashboards" to instantly add this as a dashboard tile. Repeat for each query on this page to build a complete log dashboard.
:::

b:["$","div",nul
