---
title: "Application Security"
course: "From Zero to Hero"
track: "Track 5: Master"
moduleNumber: 17
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__17-security" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Application Security

Dynatrace Application Security detects vulnerabilities and blocks attacks in running applications — not just in code scans, but at runtime.

## Three Pillars

```
Pillar                          What It Does
──────────────────────────────  ──────────────────────────────────────
Runtime Vulnerability Analytics  Detects CVEs in loaded libraries at runtime
Runtime Application Protection   Blocks attacks (SQL injection, SSRF, etc.)
Security Posture Management      Overall security health view
```

## How It Works

OneAgent monitors loaded libraries and runtime components. When a vulnerable library is detected in a running process, Dynatrace:

1. Matches it against vulnerability feeds (NVD, Dynatrace feed)
2. Assesses risk based on data access paths and production execution
3. Opens a security problem with severity (CRITICAL, HIGH, MEDIUM, LOW)
4. Auto-closes when the vulnerable library is removed or updated

## Attack Protection

Runtime Application Protection monitors and blocks common attack patterns:

```
Attack Type              What It Blocks
───────────────────────  ──────────────────────────────────
SQL Injection            Malicious SQL in user input
Command Injection        OS command execution via input
SSRF                     Server-side request forgery
Path Traversal           Accessing files outside web root
```

Modes: **MONITOR** (detect and log) or **BLOCK** (actively prevent).

## Supported Technologies

```
Technology    Vulnerability Detection    Attack Protection
────────────  ────────────────────────  ──────────────────
Java          ✓ (since OneAgent 1.221)  ✓
.NET          ✓ (since 1.233)           ✓
Node.js       ✓ (since 1.231)           —
Go            ✓ (since 1.245)           ✓
Python        ✓ (since 1.309)           —
PHP           ✓ (since 1.231)           —
```

## Security DQL

```dql
// Security events in the last 7 days
fetch events, from:now()-7d
| filter event.kind == "SECURITY_EVENT"
| summarize cnt=count(), by:{event.type}
| sort cnt desc
```

:::tip
💡 Enable attack protection in MONITOR mode first. Review detected attacks for false positives before switching to BLOCK mode.
:::

:::note
🛠 **Try it:** Open Ctrl+K → "Application Security" → explore the vulnerability overview. Then try: `fetch events | filter event.kind == "SECURITY_EVENT" | limit 10` in a Notebook to see security events as queryable data.
:::

## Security Notifications (Two Parts Required!)

A common mistake: creating an alerting profile but no notification integration. The alerting profile alone does NOTHING — you need BOTH:

1. **Alerting profile** (`builtin:appsec.notification-alerting-profile`) — defines WHICH vulnerabilities trigger alerts (risk level, event type)
2. **Notification integration** (`builtin:appsec.notification-integration`) — defines WHERE to send alerts (email, webhook, Jira) and links to the alerting profile

Without the notification integration, alerts fire into the void — no email, no ticket, no notification.

## Vulnerability Detection

- **Third-party (TPV)**: OneAgent reports loaded libraries → matched against vulnerability feeds every 5 min → new vulns checked every minute
- **Code-level (CLV)**: static analysis of first-party code for security patterns
- **Risk assessment**: uses Smartscape topology to check exposure (public IPs) and reachable data assets (databases)
- **Auto-resolution**: vulns close automatically when vulnerable library is no longer loaded for 2+ hours
- **State reports**: `VULNERABILITY_STATE_REPORT_EVENT` refreshes every 30-60 min — vulns stay "OPEN" until next cycle after patching

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":[{"id":"hero-foundation","title":"Track 1: Foundation","description":"What is observability, how Dynatrace works, set up access, and get your first data","icon":"🏗️","mo
