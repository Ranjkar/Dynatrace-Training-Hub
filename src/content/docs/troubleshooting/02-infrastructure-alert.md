---
title: "Infrastructure Alert"
course: "Troubleshooting Playbook"
track: "Playbooks"
moduleNumber: 2
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="troubleshooting__02-infrastructure-alert" data-course-slug="troubleshooting">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Playbook: Infrastructure Alert

Alert fires: "[P1] CPU Usage Critical" or "[P1] Disk Usage Critical." Here's the investigation.

## Step 1: Which Host?

```dql
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}
```

## Step 2: What's Consuming Resources?

```dql
// Top process groups by CPU (check in Dynatrace UI: Host → Processes)
fetch dt.entity.process_group
| expand runs_on
| fields entity.name, softwareTechnologies
| limit 20
```

## Step 3: Is It a Spike or Trend?

```dql
// Look at 24h to see if it's a spike or gradual increase
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}, from:now()-24h
```

Spike = process gone wild. Trend = capacity issue.

## Step 4: Memory Leak Check

```dql
timeseries avg(dt.host.memory.usage), by:{dt.entity.host}, from:now()-7d
```

Steadily increasing memory over days = memory leak in an application.

## Step 5: Disk Full

```dql
timeseries avg(dt.host.disk.used.percent), by:{dt.entity.host}
```

Common causes: log files not rotated, temp files, database growth.

## Step 6: Impact on Services

```dql
// Are services on this host affected?
timeseries avg(dt.service.request.response_time), by:{dt.entity.service}
```

## Quick Fixes

```
Problem              Quick Fix                           Long-term Fix
───────────────────  ──────────────────────────────────  ──────────────────────────
CPU spike            Restart runaway process              Profile and optimize code
Memory leak          Restart application                  Fix the leak, add limits
Disk full            Clean logs/temp files                Log rotation, retention policy
Network saturation   Identify top talker                  Load balancing, CDN
```

:::note
🛠 **Try it:** Open Ctrl+K → "Infrastructure & Operations" → click your host → check the CPU, memory, and disk charts. Hover over any spike to see the exact timestamp, then correlate with `fetch events | filter dt.entity.host == "HOST-ID" | sort timestamp desc`.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"troubleshoot","title":"Troubleshooting Playbook","subtitle
