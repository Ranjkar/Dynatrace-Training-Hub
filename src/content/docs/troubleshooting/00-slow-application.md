---
title: "Slow Application"
course: "Troubleshooting Playbook"
track: "Playbooks"
moduleNumber: 0
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="troubleshooting__00-slow-application" data-course-slug="troubleshooting">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Playbook: Slow Application

User reports: "The app is slow." Here's the step-by-step investigation.

:::tip
💡 **Start with the Problems app.** Open Ctrl+K → "Problems" — Davis may have already detected the root cause. If your team has created troubleshooting guides (notebooks/dashboards prefixed with [TSG]), Dynatrace Intelligence will auto-suggest relevant ones for the active problem.
:::

## Step 1: Check if Davis Already Found It

```dql
fetch events, from:now()-24h
| filter event.kind == "DAVIS_PROBLEM"
| filter event.status == "ACTIVE"
| fields display_id, event.name, affected_entity_ids
```

## Step 2: Service Response Time

```dql
timeseries avg(dt.service.request.response_time), by:{dt.entity.service}
```

Look for spikes. Which service is slow? Note the entity ID.

## Step 3: Is It Throughput or Latency?

```dql
timeseries {
  rt = avg(dt.service.request.response_time),
  count = sum(dt.service.request.count)
}, by:{dt.entity.service}
```

If throughput dropped AND latency spiked → likely a backend issue. If throughput is normal but latency spiked → slow dependency.

## Step 4: Check the Host

```dql
timeseries {
  cpu = avg(dt.host.cpu.usage),
  mem = avg(dt.host.memory.usage),
  disk = avg(dt.host.disk.used.percent)
}, by:{dt.entity.host}
```

CPU > 90%? Memory exhausted? Disk full? These cause application slowness.

## Step 5: Find Slow Traces

```dql
fetch spans
| filter span.kind == "SERVER"
| filter duration > 5000000000
| fields trace.id, service.name, span.name, duration
| sort duration desc
| limit 10
```

## Step 6: Check Logs for Errors

```dql
fetch logs, from:now()-1h
| filter loglevel == "ERROR"
| fields timestamp, content, dt.entity.service
| sort timestamp desc
| limit 20
```

## Decision Tree

```
Davis found a problem?     → Follow Davis root cause
  ↓ No
Service RT spiked?         → Check host resources (Step 4)
  ↓ Host OK
Slow traces found?         → Drill into trace waterfall
  ↓ No traces
Error logs present?        → Fix the errors first
  ↓ No errors
Check external dependencies → DNS, network, third-party APIs
```

:::note
🛠 **Try it:** Open the Problems app (Ctrl+K → "Problems") and check for active problems. Click any problem to see Davis's root cause analysis — it automatically correlates across hosts, services, and traces.
:::

## Official Regression Thresholds

From Dynatrace's own troubleshooting playbooks — a regression is confirmed when:

```
Signal              Regression Threshold
──────────────────  ──────────────────────────────────────────────
P95 response time   Increased >20% OR absolute >2s (>2,000,000,000 ns)
Error rate          Increased >1 percentage point
Throughput          Dropped >20% (without corresponding traffic drop)
```

## Key Rules

:::danger
⚠️ **ALWAYS start with Davis problems** — never do broad log searches. Use the Problems app first, then scope all queries to the problem's timeframe and affected entities.
:::

- **Never query logs without context** — broad log searches hit scan limits and return 0 results
- **Scope queries**: `from: problemStart - 5min, to: problemEnd + 5min`
- **Look for trace_id in logs** — correlate logs → traces for root cause
- **HTTP error rate**: use `countIf(http.response.status_code >= 500)` — span `status == "ERROR"` is unreliable for HTTP services

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"troubleshoot","title":"Troubleshooting Playbook","subtitle":"Step-by-
