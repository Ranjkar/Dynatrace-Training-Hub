---
title: "Migrate Log Viewer → DQL + OpenPipeline"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 2: Learn DQL"
moduleNumber: 14
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__08-log-queries" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Migrating Log Analysis to DQL

Log analysis moves from the classic Log Viewer to DQL queries on Grail. All existing log data is available — the difference is how to query and process it.

:::note
🛠 **Try it:** Ctrl+K → "Logs" → open the Logs app. Every filter you apply generates DQL in the query bar at the top.
:::

## Basic Log Queries

```dql
// All error logs in the last hour
fetch logs, from:now() - 1h
| filter loglevel == "ERROR"
| sort timestamp desc
| limit 50

// Search for specific text
fetch logs, from:now() - 1h
| filter contains(content, "connection refused")
| fields timestamp, content, dt.process.name
```

## Log Aggregation

```dql
// Error rate over time (renders as line chart in Notebooks)
fetch logs, from:now() - 2h
| summarize total = count(), errors = countIf(loglevel == "ERROR"),
    by:{time_bucket = bin(timestamp, 15m)}
| fieldsAdd error_rate = (errors * 100.0) / total
| sort time_bucket asc
```

:::note
🛠 **Try it:** Run the error rate query in a Notebook. Change visualization to "Line chart" — you'll see error rate trending over time.
:::

## Parsing Structured Logs

When log content contains JSON, use `parse` to extract fields. The parsed fields use bracket notation (`log[level]`):

```dql
fetch logs, from:now() - 1h
| filter contains(content, "{")
| parse content, "JSON:log"
| fields timestamp, log[level], log[message], log[service]
```

:::danger
⚠️ The **native** log level field is `loglevel` (one word) — NOT `log.level`. Use `loglevel` for filtering without parsing:

```dql
fetch logs | filter loglevel == "ERROR"
```

The `log[level]` bracket syntax above is only for JSON-parsed output (after `parse content, "JSON:log"`).
:::

## Parse Patterns

DQL supports multiple parse patterns for extracting structured data from log content:

```dql
// JSON parsing — extract fields from JSON logs
fetch logs, from:now() - 1h
| filter contains(content, "{")
| parse content, "JSON:log"
| fields timestamp, log[level], log[message], log[service]

// Key-value parsing — extract key=value pairs
fetch logs, from:now() - 1h
| parse content, "KVP{KeyValuePair:kvp}"
| fields timestamp, kvp[status], kvp[duration]

// Regex parsing — custom patterns
fetch logs, from:now() - 1h
| parse content, "LD 'status=' INT:status LD 'duration=' INT:duration 'ms'"
| fields timestamp, status, duration
```

## Log-Based Alerting with makeTimeseries

```dql
// Create a metric from logs — use this in an anomaly detector
fetch logs, from:now() - 1h
| summarize errors = countIf(loglevel == "ERROR"), total = count(),
    by:{time_bucket = bin(timestamp, 1m)}
| fieldsAdd error_pct = (toDouble(errors) / toDouble(total)) * 100
```

:::tip
💡 You can create anomaly detectors on log-derived metrics. Use `makeTimeseries` in the detector query to alert on log error rates, specific patterns, or volume spikes.
:::

## OpenPipeline: Parse at Ingest vs Query Time

```
When to Parse                Where                   Why
───────────────────────────  ────────────────────────  ──────────────────────────────
High-volume, known format    OpenPipeline (ingest)     Parse once, query fast forever
Ad-hoc investigation         DQL parse (query time)    Flexible, no config needed
Metric extraction            OpenPipeline              Create metrics from log patterns
Routing to buckets           OpenPipeline              Different retention per log type
```

:::note
🛠 **Try it:** Ctrl+K → "OpenPipeline" → Logs → See the default pipeline. Add a processing rule to extract a field from your logs. Compare query performance before and after.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-5
