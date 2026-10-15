---
title: "Logs & Events"
course: "From Zero to Hero"
track: "Track 2: Query & Explore"
moduleNumber: 7
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__06-logs-events" data-course-slug="zero-to-hero">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Logs & Events

Logs and events are stored in Grail alongside metrics. Query them with `fetch`.

## Log Queries

```dql
// All errors in the last hour
fetch logs, from:now()-1h
| filter loglevel == "ERROR"
| fields timestamp, content, loglevel, log.source
| sort timestamp desc
| limit 20
```

:::danger
⚠️ The field is `loglevel` (one word), NOT `log.level`. This is the #1 DQL mistake.
:::

## Log Levels

```dql
fetch logs
| summarize cnt=count(), by:{loglevel}
| sort cnt desc
```

Common levels: `ERROR`, `WARN`, `INFO`, `DEBUG`, `NONE` (unclassified).

## Log-Based Charts with makeTimeseries

```dql
// Error rate over time (renders as chart in Notebooks)
fetch logs
| makeTimeseries count=count(), by:{loglevel}
```

:::tip
💡 `makeTimeseries` creates time series from fetched data (logs, events, spans). `timeseries` is for metrics. Don't confuse them.
:::

## Parsing Structured Logs

```dql
// JSON logs — extract fields with bracket notation
fetch logs, from:now()-1h
| filter contains(content, "{")
| parse content, "JSON:log"
| fields timestamp, log[level], log[message]

// Key-value logs
fetch logs
| parse content, "KVP{KeyValuePair:kvp}"
| fields timestamp, kvp[status], kvp[duration]
```

## Events

Davis events and problems are also in Grail:

```dql
// Davis problems in the last 7 days
fetch events, from:now()-7d
| filter event.kind == "DAVIS_PROBLEM"
| fields display_id, event.name, event.status
| sort timestamp desc

// All event types
fetch events, from:now()-7d
| summarize cnt=count(), by:{event.kind}
| sort cnt desc
```

```
Event Kind          What It Contains
──────────────────  ──────────────────────────────────
DAVIS_EVENT         Individual incidents (threshold breaches, crashes)
DAVIS_PROBLEM       Correlated problems (groups related events)
SYNTHETIC_EVENT     Synthetic monitor results
FLEET_EVENT         OneAgent fleet events
```

:::note
🛠 **Try it:** Run `fetch events, from:now()-7d | summarize cnt=count(), by:{event.kind} | sort cnt desc` to see what's happening in your environment.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero"
