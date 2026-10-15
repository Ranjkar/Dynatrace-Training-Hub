---
title: "Security Incident"
course: "Troubleshooting Playbook"
track: "Playbooks"
moduleNumber: 5
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="troubleshooting__05-security-incident" data-course-slug="troubleshooting">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Security Incident Investigation

When Dynatrace detects a vulnerability or attack, follow this structured investigation pattern.

## Step 1: Assess the Situation

```dql
// What's open right now? Summary by risk level
fetch security.events, from:now()-30d
| filter event.type == "VULNERABILITY_STATE_REPORT_EVENT" AND event.level == "ENTITY"
| dedup {vulnerability.display_id, affected_entity.id}, sort:{timestamp desc}
| filter vulnerability.resolution.status == "OPEN"
| summarize count=count(), by:{vulnerability.risk.level}
| sort count desc
```

## Step 2: Identify Affected Entities

```dql
// Which processes are vulnerable?
fetch security.events, from:now()-30d
| filter event.type == "VULNERABILITY_STATE_REPORT_EVENT" AND event.level == "ENTITY"
| dedup {vulnerability.display_id, affected_entity.id}, sort:{timestamp desc}
| filter vulnerability.resolution.status == "OPEN" AND vulnerability.risk.level == "HIGH"
| summarize vulns=count(), by:{affected_entity.name}
| sort vulns desc
```

## Step 3: Check for Active Attacks

```dql
// Any attack attempts in the last 24h?
fetch security.events, from:now()-24h
| filter event.type == "ATTACK_EVENT"
| fields timestamp, attack.type, attack.source.ip, affected_entity.name
| sort timestamp desc
```

## Step 4: Determine Exposure

Dynatrace automatically assesses exposure using Smartscape topology:

- **Public exposure**: incoming requests from public IPs
- **Reachable data assets**: traces service dependencies to find databases
- **Affected services**: which services run the vulnerable library

## Step 5: Remediate

```
Vulnerability Type          Remediation
──────────────────────────  ──────────────────────────────────────
Third-party library (TPV)   Upgrade the dependency (npm/pip/maven)
Runtime component           Upgrade Node.js/Java/.NET runtime
Code-level (CLV)            Fix the code pattern
```

After patching, vulnerabilities auto-close when the vulnerable library is no longer loaded for 2+ hours. State reports refresh every 30-60 minutes.

## Attack Protection Modes

```
Mode      What It Does
────────  ──────────────────────────────────────
MONITOR   Detect + alert, don't block (safe to start)
BLOCK     Detect + block + alert (production protection)
OFF       Disabled
```

Attack types detected: SQL injection, JNDI injection (Log4Shell), command injection, SSRF.

QUIZ:6

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: How long after patching do vulnerabilities auto-close?</strong></p>
<ul>
<li>❌ Immediately</li>
<li>❌ After 30 minutes</li>
<li>✅ After 2+ hours (when library is no longer loaded)</li>
</ul>
</details>

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"troubleshoot","title":"Troubleshooting Playbook","subtitle":"Step-by-Step Incident Response with Dynatrace","color":"
