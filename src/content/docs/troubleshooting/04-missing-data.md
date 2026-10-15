---
title: "Missing Data"
course: "Troubleshooting Playbook"
track: "Playbooks"
moduleNumber: 4
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="troubleshooting__04-missing-data" data-course-slug="troubleshooting">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Playbook: Missing Data

Metrics stopped, logs disappeared, or entities vanished. Here's how to diagnose.

## Step 1: Is OneAgent Running?

```dql
fetch dt.entity.host
| fields entity.name, state, monitoringMode
```

`state: RUNNING` = agent is alive. `SHUTDOWN` = agent stopped or host is down.

## Step 2: Agent Events

```dql
fetch events, from:now()-24h
| filter event.kind == "FLEET_EVENT"
| fields timestamp, event.name, event.type
| sort timestamp desc
| limit 10
```

## Step 3: Log Ingestion Check

```dql
// Is log volume normal?
fetch logs
| makeTimeseries volume=count()
```

Sudden drop to zero = ingestion stopped. Gradual decline = source changed.

## Step 4: Metric Gaps

```dql
// Check for gaps in a specific metric
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}, from:now()-24h
```

Null values in the array = data gaps during those intervals.

## Step 5: Process Group Changes

```dql
// Did processes restart or disappear?
fetch dt.entity.process_group
| fields entity.name, lifetime
| limit 20
```

## Step 6: Extension Health

```dql
// If extension metrics are missing
fetch dt.entity.custom_device | summarize cnt=count()
```

## Common Causes

```
Symptom                     Likely Cause                        Fix
──────────────────────────  ──────────────────────────────────  ──────────────────────────
Host shows SHUTDOWN         OneAgent crashed or host rebooted    Check host, restart agent
Metrics have gaps           Network issue or AG overload         Check ActiveGate logs
Logs stopped                Log source changed or rotated        Check log.source paths
Entities disappeared        Process stopped or K8s pod deleted   Check deployment status
Extension data missing      EEC not running or config error      Check extension status in Hub
```

:::tip
💡 First check: is the host RUNNING? 90% of "missing data" issues are OneAgent not running — either the host is down, the agent crashed, or it was uninstalled.
:::

:::note
🛠 **Try it:** Open Ctrl+K → "Deployment Status" to check OneAgent health across all hosts. Look for hosts showing "Monitoring unavailable" — click them to see the agent log and connection status.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"troubleshoot","title":"Troubleshooting Playbook","subtitle":"Step-by-Step
