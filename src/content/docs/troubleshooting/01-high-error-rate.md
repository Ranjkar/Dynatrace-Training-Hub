---
title: "High Error Rate"
course: "Troubleshooting Playbook"
track: "Playbooks"
moduleNumber: 1
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="troubleshooting__01-high-error-rate" data-course-slug="troubleshooting">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Playbook: High Error Rate

Alert fires: "[P1] Error Rate Spike." Here's how to investigate.

## Step 1: Which Service?

```dql
timeseries avg(dt.service.request.failure_rate), by:{dt.entity.service}
```

## Step 2: Error Count Over Time

```dql
timeseries sum(dt.service.request.failure_count), by:{dt.entity.service}
```

When did it start? Sudden spike = deployment or dependency. Gradual increase = resource exhaustion.

## Step 3: What Errors?

```dql
fetch logs, from:now()-1h
| filter loglevel == "ERROR"
| summarize cnt=count(), by:{content}
| sort cnt desc
| limit 10
```

## Step 4: Error Traces

```dql
fetch spans, from:now()-1h
| filter span.kind == "SERVER"
| filter status_code >= 400
| summarize cnt=count(), by:{service.name, status_code}
| sort cnt desc
```

## Step 5: Recent Deployments?

```dql
fetch events, from:now()-24h
| filter event.type == "CUSTOM_DEPLOYMENT"
| fields timestamp, event.name
| sort timestamp desc
```

## Step 6: Dependency Health

```dql
// Check if a database or external service is failing
fetch spans, from:now()-1h
| filter span.kind == "CLIENT"
| filter status_code >= 400
| summarize cnt=count(), by:{service.name, span.name}
| sort cnt desc
```

## Decision Tree

```
Recent deployment?         → Rollback or fix the deployment
  ↓ No
Database errors?           → Check DB health, connection pool, queries
  ↓ No
External API failing?      → Check third-party status, timeouts
  ↓ No
Resource exhaustion?       → Check CPU, memory, disk, connections
  ↓ No
Code-level exception?      → Check stack traces in error logs
```

:::note
🛠 **Try it:** Open a Notebook → run `timeseries err=avg(dt.service.request.failure_rate), by:{dt.entity.service}` → look for any service above 1%. Click through to the service detail page → "Failure rate" tab to see individual failed requests.
:::

:::danger
⚠️ **HTTP error rate gotcha**: `status == "ERROR"` on spans is unreliable for HTTP services — it can return 0 errors even with thousands of 5xx responses. Always use:

```dql
fetch spans
| summarize errors = countIf(http.response.status_code >= 500), total = count()
| fieldsAdd error_rate = 100.0 * errors / total
```
:::

b:["$","div",null,{"className":"f
