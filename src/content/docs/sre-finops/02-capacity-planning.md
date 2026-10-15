---
title: "Capacity Planning"
course: "SRE & FinOps"
track: "SRE & FinOps"
moduleNumber: 2
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="sre-finops__02-capacity-planning" data-course-slug="sre-finops">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Capacity Planning

Use historical trends to predict when you'll run out of resources — before it becomes an incident.

## CPU Trend (7-day)

```dql
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}, from:now()-7d
```

Is the average increasing day over day? If yes, you're approaching capacity.

## Memory Trend (7-day)

```dql
timeseries avg(dt.host.memory.usage), by:{dt.entity.host}, from:now()-7d
```

## Disk Growth Rate

```dql
timeseries avg(dt.host.disk.used.percent), by:{dt.entity.host}, from:now()-7d
```

If disk grows 1% per day and you're at 80%, you have ~20 days before it's full.

## Service Throughput Growth

```dql
timeseries sum(dt.service.request.count), by:{dt.entity.service}, from:now()-7d
```

Growing throughput with flat infrastructure = future performance degradation.

## Week-over-Week Comparison

```dql
// This week's average CPU
timeseries this_week = avg(dt.host.cpu.usage, scalar:true), from:now()-7d, to:now()

// Compare with previous week manually by running:
timeseries last_week = avg(dt.host.cpu.usage, scalar:true), from:now()-14d, to:now()-7d
```

## Capacity Planning Checklist

```
Metric                  Warning Zone    Action
──────────────────────  ──────────────  ──────────────────────────
CPU avg > 70%           Approaching     Plan scaling or optimization
Memory avg > 80%        Approaching     Check for leaks, plan upgrade
Disk > 80%              Critical        Clean up or expand storage
Throughput growing 10%+ Weekly          Plan horizontal scaling
Error rate trending up  Degrading       Investigate before it breaks
```

:::tip
💡 Set up a weekly trend report workflow that compares this week vs last week. If any metric is consistently growing, it's a capacity signal — act before it becomes an incident.
:::

:::note
🛠 **Try it:** Open a Notebook → run `timeseries cpu=avg(dt.host.cpu.usage), by:{dt.entity.host}, from:now()-30d` → switch to "Line chart" visualization. Look for upward trends — those hosts need capacity attention before they alert.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"sre-finops","title":"SRE & Fi
