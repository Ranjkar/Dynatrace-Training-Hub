---
title: "Security Queries"
course: "DQL Cookbook"
track: "DQL Recipes"
moduleNumber: 5
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dql-cookbook__05-security-queries" data-course-slug="dql-cookbook">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Security Queries

Dynatrace stores security data in two tables: `security.events` (vulnerabilities + attacks) and `events` (security-related Davis events). This module covers the DQL patterns for both.

## Vulnerability Queries

Vulnerabilities are tracked via `VULNERABILITY_STATE_REPORT_EVENT` snapshots that refresh every 30-60 minutes:

```dql
// Open vulnerabilities — latest snapshot per entity
fetch security.events, from:now()-30d
| filter dt.system.bucket == "default_securityevents_builtin"
    AND event.provider == "Dynatrace"
    AND event.type == "VULNERABILITY_STATE_REPORT_EVENT"
    AND event.level == "ENTITY"
| dedup {vulnerability.display_id, affected_entity.id}, sort:{timestamp desc}
| filter vulnerability.resolution.status == "OPEN"
| sort vulnerability.risk.score desc
| fields vulnerability.display_id, vulnerability.title, vulnerability.risk.level,
        vulnerability.risk.score, affected_entity.name, vulnerability.references.cve
```

:::danger
⚠️ OAuth scope `storage:security.events:read` is REQUIRED — without it you get 403. This is separate from `storage:events:read`.
:::

## Vulnerability Summary

```dql
// Count by risk level
fetch security.events, from:now()-30d
| filter event.type == "VULNERABILITY_STATE_REPORT_EVENT" AND event.level == "ENTITY"
| dedup {vulnerability.display_id, affected_entity.id}, sort:{timestamp desc}
| filter vulnerability.resolution.status == "OPEN"
| summarize count=count(), by:{vulnerability.risk.level}
| sort count desc
```

## Attack Events

```dql
// Recent attack attempts
fetch security.events, from:now()-7d
| filter event.type == "ATTACK_EVENT"
| fields timestamp, attack.type, attack.source.ip, affected_entity.name, attack.action
| sort timestamp desc
| limit 20
```

## Vulnerability by Technology

```dql
// Which technologies have the most vulnerabilities?
fetch security.events, from:now()-30d
| filter event.type == "VULNERABILITY_STATE_REPORT_EVENT" AND event.level == "ENTITY"
| dedup {vulnerability.display_id, affected_entity.id}, sort:{timestamp desc}
| filter vulnerability.resolution.status == "OPEN"
| summarize count=count(), by:{affected_entity.name}
| sort count desc
| limit 10
```

## Security Notification Architecture

Security alerting requires TWO parts — an alerting profile alone does nothing:

1. **Alerting profile** (`builtin:appsec.notification-alerting-profile`) — filters WHICH vulnerabilities trigger alerts (risk level, event type)
2. **Notification integration** (`builtin:appsec.notification-integration`) — defines WHERE to send (email, webhook, Jira) and links to the alerting profile

:::tip
💡 After patching, vulnerabilities stay "OPEN" until the next state report cycle (30-60 min). Don't panic if vulns don't close immediately after upgrading.
:::

QUIZ:1

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: What OAuth scope is required to query security.events?</strong></p>
<ul>
<li>❌ storage:events:read</li>
<li>✅ storage:security.events:read</li>
<li>❌ storage:logs:read</li>
</ul>
<p><strong>Q: How often do vulnerability state reports refresh?</strong></p>
<ul>
<li>❌ Every minute</li>
<li>❌ Every 5 minutes</li>
<li>✅ Every 30-60 minutes</li>
</ul>
</details>

b:["$","div",null,{"className":
