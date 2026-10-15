---
title: "Metrics & Timeseries"
course: "From Zero to Hero"
track: "Track 2: Query & Explore"
moduleNumber: 6
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__05-metrics-timeseries" data-course-slug="zero-to-hero">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Metrics & Timeseries

Metrics are numbers over time — CPU usage, response times, request counts. In Dynatrace, the `timeseries` command is how you query them.

## The timeseries Command

```dql
// Basic: average CPU across all hosts
timeseries avg(dt.host.cpu.usage)

// Split by host
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}

// Multiple metrics at once
timeseries {
  cpu = avg(dt.host.cpu.usage),
  mem = avg(dt.host.memory.usage)
}, by:{dt.entity.host}

// Custom time range
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}, from:now()-2h
```

## Common Metrics

```
Metric                                What It Measures              Unit
────────────────────────────────────  ──────────────────────────    ──────────
dt.host.cpu.usage                     Host CPU utilization          Percent
dt.host.memory.usage                  Host memory utilization       Percent
dt.host.disk.used.percent             Disk usage                    Percent
dt.service.request.response_time      Service response time         Microseconds
dt.service.request.count              Request throughput             Count
dt.service.request.failure_count      Failed requests               Count
dt.service.request.failure_rate       Failure percentage             Percent
```

:::danger
⚠️ `dt.service.request.response_time` is in **microseconds**, not milliseconds. Divide by 1000 for ms.
:::

## Aggregations

```dql
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}       // Average
timeseries max(dt.host.cpu.usage), by:{dt.entity.host}       // Peak
timeseries percentile(dt.service.request.response_time, 95)  // P95
timeseries sum(dt.service.request.count)                      // Total
```

## Filtering Inside timeseries

```dql
// filter:{} is MORE PERFORMANT than | filter (filters at data source level)
timeseries avg(dt.host.cpu.usage),
  by:{dt.entity.host},
  filter:{dt.entity.host == "HOST-ABC123"}
```

:::note
🛠 **Try it:** In a Notebook, type `timeseries avg(dt.host.` — autocomplete shows all available host metrics. This is the fastest way to discover metrics.
:::

:::tip
💡 `timeseries` queries automatically render as line charts in Notebooks. `fetch` queries render as tables.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"D
