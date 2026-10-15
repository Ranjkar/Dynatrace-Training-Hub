---
title: "Service Performance Recipes"
course: "DQL Cookbook"
track: "DQL Recipes"
moduleNumber: 2
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dql-cookbook__02-service-performance" data-course-slug="dql-cookbook">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Service Performance Recipes

## Response Time by Service

```dql
timeseries avg(dt.service.request.response_time), by:{dt.entity.service}
```

:::danger
⚠️ Response time is in **microseconds**. Divide by 1000 for ms.
:::

## Request Throughput

```dql
timeseries sum(dt.service.request.count), by:{dt.entity.service}
```

## Failure Rate

```dql
timeseries avg(dt.service.request.failure_rate), by:{dt.entity.service}
```

## P95 Response Time

```dql
timeseries percentile(dt.service.request.response_time, 95), by:{dt.entity.service}
```

## Golden Signals (all 4 in one query)

```dql
timeseries {
  latency = avg(dt.service.request.response_time),
  throughput = sum(dt.service.request.count),
  errors = sum(dt.service.request.failure_count),
  error_rate = avg(dt.service.request.failure_rate)
}, by:{dt.entity.service}
```

## Service List with Type

```dql
fetch dt.entity.service
| fields entity.name, serviceType, tags
```

## Slowest Endpoints (via Spans)

```dql
fetch spans
| filter span.kind == "SERVER"
| summarize avg_duration = avg(duration), cnt = count(), by:{service.name, span.name}
| sort avg_duration desc
| limit 10
```

## Service Errors in Logs

```dql
fetch logs
| filter loglevel == "ERROR"
| summarize cnt=count(), by:{dt.entity.service}
| sort cnt desc
```

:::tip
💡 The "Golden Signals" query gives you latency, throughput, errors, and error rate in one chart — the four signals every SRE monitors.
:::

:::note
🛠 **Try it:** Open a Notebook → run `timeseries {rt=avg(dt.service.request.response_time), err=avg(dt.service.request.failure_rate)}, by:{dt.entity.service}`. Click any service name in the results to jump to its detail page.
:::

b:["$","div",n
