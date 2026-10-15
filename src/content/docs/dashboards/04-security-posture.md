---
title: "Security Posture"
course: "Dashboard Gallery"
track: "Dashboard Patterns"
moduleNumber: 4
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dashboards__04-security-posture" data-course-slug="dashboards">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Security Posture Dashboard

A dashboard for tracking vulnerabilities, attack attempts, and security coverage across your environment.

## Tile 1: Open Vulnerabilities (Single Value)

```dql
fetch security.events, from:now()-30d
| filter event.type == "VULNERABILITY_STATE_REPORT_EVENT" AND event.level == "ENTITY"
| dedup {vulnerability.display_id, affected_entity.id}, sort:{timestamp desc}
| filter vulnerability.resolution.status == "OPEN"
| summarize total_open = count()
```

## Tile 2: Vulnerabilities by Risk Level (Pie Chart)

```dql
fetch security.events, from:now()-30d
| filter event.type == "VULNERABILITY_STATE_REPORT_EVENT" AND event.level == "ENTITY"
| dedup {vulnerability.display_id, affected_entity.id}, sort:{timestamp desc}
| filter vulnerability.resolution.status == "OPEN"
| summarize count=count(), by:{vulnerability.risk.level}
```

## Tile 3: Most Vulnerable Entities (Table)

```dql
fetch security.events, from:now()-30d
| filter event.type == "VULNERABILITY_STATE_REPORT_EVENT" AND event.level == "ENTITY"
| dedup {vulnerability.display_id, affected_entity.id}, sort:{timestamp desc}
| filter vulnerability.resolution.status == "OPEN"
| summarize high=countIf(vulnerability.risk.level == "HIGH"),
    critical=countIf(vulnerability.risk.level == "CRITICAL"),
    total=count(), by:{affected_entity.name}
| sort total desc | limit 10
```

## Tile 4: Attack Attempts Timeline (Area Chart)

```dql
fetch security.events, from:now()-7d
| filter event.type == "ATTACK_EVENT"
| makeTimeseries attacks=count(), interval:1h
```

## Tile 5: Attack Types (Bar Chart)

```dql
fetch security.events, from:now()-7d
| filter event.type == "ATTACK_EVENT"
| summarize count=count(), by:{attack.type}
| sort count desc
```

:::tip
💡 Set thresholds on the "Open Vulnerabilities" single value: green ≤5, yellow ≤20, red >20. Use colors: `#2f6862` (green), `#eea53c` (yellow), `#c62239` (red).
:::

QUIZ:9

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: Which bucket stores vulnerability state reports with 3-year retention?</strong></p>
<ul>
<li>❌ default_events</li>
<li>✅ default_securityevents_builtin</li>
<li>❌ default_security_events</li>
</ul>
</details>

b:["$","div",nu
