---
title: "Your First Data"
course: "From Zero to Hero"
track: "Track 1: Foundation"
moduleNumber: 4
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__03-your-first-data" data-course-slug="zero-to-hero">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Your First Data

With OneAgent installed, Dynatrace automatically discovers your infrastructure. Let's explore what it found.

## Hosts

Every machine with OneAgent appears as a host entity. Query it with DQL:

```dql
fetch dt.entity.host
| fields entity.name, monitoringMode, state, tags
```

:::note
🛠 **Try it:** Open a Notebook (Ctrl+K → "Notebooks" → Create new) → Add a DQL section → Paste the query above → Run it. You'll see your hosts with their monitoring mode and state.
:::

## Processes

OneAgent discovers every process running on your hosts:

```dql
fetch dt.entity.process_group
| fields entity.name, softwareTechnologies
| limit 10
```

Each process group shows the detected technology (Java, Node.js, Go, nginx, etc.).

## Services

Services are auto-detected from process communication patterns:

```dql
fetch dt.entity.service
| fields entity.name, serviceType
| limit 10
```

## Your First Metric

Metrics are time-series data. The `timeseries` command queries them:

```dql
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}
```

This returns CPU usage over time for each host. In a Notebook, it automatically renders as a line chart.

## Your First Log Query

```dql
fetch logs
| filter loglevel == "ERROR"
| fields timestamp, content, loglevel
| sort timestamp desc
| limit 10
```

:::danger
⚠️ The field is `loglevel` (one word), NOT `log.level`. This is the most common DQL mistake for beginners.
:::

## Exploring the Schema

Don't know what fields are available? Use `describe`:

```dql
describe dt.entity.host
```

This lists every field and its data type. Works for any data object: `logs`, `events`, `spans`, `bizevents`, `dt.entity.service`, etc.

## Data Objects Reference

```
Data Object              What's In It                    Example Query
───────────────────────  ──────────────────────────────  ──────────────────────────
dt.entity.host           Hosts (servers, VMs)            fetch dt.entity.host
dt.entity.service        Auto-detected services          fetch dt.entity.service
dt.entity.process_group  Process groups                  fetch dt.entity.process_group
dt.entity.application    RUM web applications            fetch dt.entity.application
logs                     Log records                     fetch logs
events                   Davis events and problems       fetch events
spans                    Distributed trace spans         fetch spans
bizevents                Business events                 fetch bizevents
```

:::tip
💡 Everything in Dynatrace is queryable with DQL. Metrics use `timeseries`, everything else uses `fetch`. You'll master both in Track 2.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Ma
