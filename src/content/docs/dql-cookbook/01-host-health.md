---
title: "Host Health Recipes"
course: "DQL Cookbook"
track: "DQL Recipes"
moduleNumber: 1
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dql-cookbook__01-host-health" data-course-slug="dql-cookbook">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Host Health Recipes

## CPU Usage by Host

```dql
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}
```

## Memory Usage by Host

```dql
timeseries avg(dt.host.memory.usage), by:{dt.entity.host}
```

## Disk Usage by Host

```dql
timeseries avg(dt.host.disk.used.percent), by:{dt.entity.host}
```

## Host Overview Table

```dql
fetch dt.entity.host
| fields entity.name, monitoringMode, state, tags, osType
```

## Top CPU Consumers (Current)

```dql
timeseries cpu = avg(dt.host.cpu.usage, scalar:true), by:{dt.entity.host}
| fieldsAdd current = arrayLast(cpu)
| sort current desc
| fields dt.entity.host, current
```

## Hosts with High CPU (> 80%)

```dql
timeseries cpu = avg(dt.host.cpu.usage, scalar:true), by:{dt.entity.host}
| fieldsAdd current = arrayLast(cpu)
| filter current > 80
| fields dt.entity.host, current
```

## Process Groups on a Host

```dql
fetch dt.entity.process_group
| expand runs_on
| fields entity.name, softwareTechnologies, runs_on
| limit 20
```

## Multi-Metric Host Dashboard

```dql
timeseries {
  cpu = avg(dt.host.cpu.usage),
  mem = avg(dt.host.memory.usage),
  disk = avg(dt.host.disk.used.percent)
}, by:{dt.entity.host}
```

:::tip
💡 Copy any of these into a Dashboard tile. `timeseries` queries auto-render as line charts, `fetch` queries as tables.
:::

:::note
🛠 **Try it:** Open a Notebook → paste each query from this page one by one. Change the time range to `from:now()-7d` to see weekly trends. Try adding `| filter entity.name == "YOUR-HOST"` to focus on a specific host.
:::

b:["$","
