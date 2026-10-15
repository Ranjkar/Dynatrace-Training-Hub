---
title: "Incident Response Workflow"
course: "SRE & FinOps"
track: "SRE & FinOps"
moduleNumber: 1
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="sre-finops__01-incident-response" data-course-slug="sre-finops">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Incident Response Workflow

A workflow that fires on Davis problems, gathers context, and notifies the right team with actionable information.

## Architecture

```
Davis Problem trigger
  → DQL: Get problem details
  → DQL: Get affected entity health
  → DQL: Get recent changes
  → JavaScript: Assess severity, decide action
  → Email/Slack: Notify with context
```

## Context Queries

### Problem Details

```dql
fetch events, from:now()-1h
| filter event.kind == "DAVIS_PROBLEM"
| filter display_id == "P-XXXXX"
| fields display_id, event.name, event.status, affected_entity_ids
```

### Entity Health (last hour)

```dql
timeseries {
  cpu = avg(dt.host.cpu.usage),
  mem = avg(dt.host.memory.usage)
}, by:{dt.entity.host}, from:now()-1h
```

### Recent Deployments

```dql
fetch events, from:now()-24h
| filter event.type == "CUSTOM_DEPLOYMENT"
| fields timestamp, event.name
| sort timestamp desc
| limit 5
```

## Decision Logic (JavaScript Task)

```
// In the JavaScript task:
const cpu = result("entity_health").records[0].cpu;
const hasDeployment = result("recent_changes").records.length > 0;

if (cpu > 90) return { action: "ESCALATE", reason: "CPU critical" };
if (hasDeployment) return { action: "INVESTIGATE", reason: "Recent deployment" };
return { action: "MONITOR", reason: "No obvious cause" };
```

## Notification Template (Jinja)

```
Subject: [{{ result("decide").action }}] {{ event()["event.name"] }}

Problem: {{ event()["display_id"] }}
Status: {{ event()["event.status"] }}
Action: {{ result("decide").action }}
Reason: {{ result("decide").reason }}
```

:::danger
⚠️ Set `actor` to a service user, NEVER `owner`. The service user needs: `storage:*:read`, `email:emails:send`, `app-engine:apps:run`, `automation:workflows:run`.
:::

:::note
🛠 **Try it:** Open Workflows → "+ Workflow" → add a "Davis problem" trigger → add a "Execute DQL query" task to gather context → add a "Send email" task with the results. Now every Davis problem automatically sends you a context-rich notification.
:::

b:["$","div",null,{"class
