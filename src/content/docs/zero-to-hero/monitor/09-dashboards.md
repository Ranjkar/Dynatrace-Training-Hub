---
title: "Dashboards"
course: "From Zero to Hero"
track: "Track 3: Monitor & Alert"
moduleNumber: 10
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__09-dashboards" data-course-slug="zero-to-hero">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Dashboards

Dashboards are how teams consume observability data daily. Each tile is a DQL query with a visualization.

## Creating a Dashboard

1. Ctrl+K → "Dashboards" → Create new
2. Click **+ Tile** → Select "Data explorer"
3. Write a DQL query → choose visualization → position the tile
4. Repeat for each metric you want to track

## Common Tile Patterns

```
Tile Type           DQL Query                                               Visualization
──────────────────  ────────────────────────────────────────────────────    ──────────────
Host CPU            timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}  Line chart
Service RT          timeseries avg(dt.service.request.response_time)         Line chart
Error count         fetch logs | filter loglevel == "ERROR" | summarize cnt=count()  Single value
Log errors/time     fetch logs | filter loglevel == "ERROR" | makeTimeseries count=count()  Line chart
Active problems     fetch events | filter event.kind == "DAVIS_PROBLEM" | filter event.status == "ACTIVE" | summarize cnt=count()  Single value
Host table          fetch dt.entity.host | fields entity.name, state        Table
```

## Variables

Variables make dashboards interactive — users can filter by host, service, or time range:

```dql
// In the variable definition:
fetch dt.entity.host | fields entity.name, id

// In tile queries, reference with $variable_name:
timeseries avg(dt.host.cpu.usage),
  filter:{dt.entity.host == $host}
```

## Segments

Segments are reusable data filters — like saved search criteria. Apply a segment to a dashboard to filter all tiles at once (e.g., "show only production hosts").

:::tip
💡 Start with 3-5 tiles covering the basics: CPU, memory, error rate, response time, active problems. Add more as you learn what your team needs.
:::

## Sharing

- **Share link** — anyone with environment access can view
- **Document API** — deploy dashboards programmatically
- **Terraform** — manage dashboards as code (`dynatrace_document` resource)

:::note
🛠 **Try it:** Open Dashboards → filter by "Ready-made" → pick any dashboard (try "Getting started"). Click "Duplicate" to make your own copy, then edit a tile's DQL query. This is the fastest way to learn dashboard building.
:::

## Dashboard Gotchas

- **Always set `davis.enabled: false`** on data tiles — otherwise tiles may render incorrectly
- **24-column grid** — full width = 24, half = 12, third = 8, quarter = 6
- **Quote "y" in YAML** — bare `y` is parsed as boolean `true` by YAML parsers
- **Use makeTimeseries for logs/spans** — `timeseries` is only for metrics
- **Visualization selection**: single number → singleValue, time series → lineChart, categories → pieChart or table, entity grid → honeycomb
- **barChart expects numeric x-axis** — string categories (service names, namespaces) render poorly. Use pieChart or table instead
- **Ready-made dashboards** — 100+ out-of-the-box dashboards available (AWS, K8s, AI, security, experience). No setup needed
- **Threshold colors**: green `#2f6862`, yellow `#eea53c`, red `#c62239` (Dynatrace theme)

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","co
