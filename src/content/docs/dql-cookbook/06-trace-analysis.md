---
title: "Trace Analysis"
course: "DQL Cookbook"
track: "DQL Recipes"
moduleNumber: 6
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dql-cookbook__06-trace-analysis" data-course-slug="dql-cookbook">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Trace Analysis

Distributed traces are stored in the `spans` table. Each span represents one operation in a request's journey through your system.

## Find Slow Requests

```dql
// Top 10 slowest server-side spans
fetch spans, from:now()-1h
| filter span.kind == "SERVER"
| fields trace_id, service.name, span.name, duration
| sort duration desc
| limit 10
```

## Response Time Percentiles by Endpoint

```dql
fetch spans, from:now()-2h
| filter span.kind == "SERVER" AND http.request.method IS NOT NULL
| summarize p50=percentile(duration, 50), p95=percentile(duration, 95),
    p99=percentile(duration, 99), count=count(),
    by:{http.route}
| sort p95 desc
```

## Error Rate by Service

```dql
// IMPORTANT: use http.response.status_code for HTTP services
// span status == "ERROR" is unreliable for HTTP services
fetch spans, from:now()-1h
| filter span.kind == "SERVER"
| summarize total=count(),
    errors=countIf(http.response.status_code >= 500 or otel.status_code == "ERROR"),
    by:{service.name}
| fieldsAdd error_rate = 100.0 * toDouble(errors) / toDouble(total)
| sort error_rate desc
```

:::danger
⚠️ `status == "ERROR"` can return 0 errors even with thousands of 5xx responses on HTTP services. Always use `http.response.status_code >= 500` for HTTP error rates.
:::

## Exception Analysis

```dql
// Extract exceptions from span events
fetch spans, from:now()-2h
| expand span.events
| filter span.events[`event.name`] == "exception"
| fields trace_id, span.name,
    span.events[`exception.type`],
    span.events[`exception.message`]
| summarize count=count(), by:{span.events[`exception.type`]}
| sort count desc
```

:::tip
💡 After `expand`, access fields with brackets: `span.events[field]` NOT `span.events.field`.
:::

## Database Query Analysis

```dql
// Top slow database queries
fetch spans, from:now()-1h
| filter db.system IS NOT NULL
| summarize avg_dur=avg(duration), count=count(), by:{db.statement}
| sort avg_dur desc
| limit 20
```

## Trace-to-Log Correlation

```dql
// Find logs for a specific trace
fetch logs, from:now()-1h
| filter trace_id == "abc123..."
| fields timestamp, content, loglevel
| sort timestamp asc
```

## Throughput Timeseries

```dql
fetch spans, from:now()-2h
| filter span.kind == "SERVER"
| makeTimeseries count=count(), avg_dur=avg(duration), interval:5m
```

QUIZ:2

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: After <code>expand span.events</code>, how do you access the exception type?</strong></p>
<ul>
<li>❌ span.events.exception.type</li>
<li>✅ span.events[`exception.type`]</li>
<li>❌ span.events-&gt;exception.type</li>
</ul>
<p><strong>Q: Why is <code>status == "ERROR"</code> unreliable for HTTP error rates?</strong></p>
<ul>
<li>✅ It can return 0 errors even with thousands of 5xx responses</li>
<li>❌ It only works for gRPC services</li>
<li>❌ It requires a special OAuth scope</li>
</ul>
</details>

b:["$","div",null,{"c
