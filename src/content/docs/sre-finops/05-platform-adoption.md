---
title: "Platform Adoption & Maturity"
course: "SRE & FinOps"
track: "SRE & FinOps"
moduleNumber: 5
lessonType: "Reference"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="sre-finops__05-platform-adoption" data-course-slug="sre-finops">
<em>Format: Reference &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Platform Adoption & Maturity

Track how well your organization uses Dynatrace — from basic monitoring to full platform adoption.

## DPS Capabilities

Each capability you use consumes DPS credits. Track which capabilities are active:

```
Capability                    What It Measures
────────────────────────────  ──────────────────────────────────────
Full-Stack Monitoring         Hosts with full-stack OneAgent
Infrastructure Monitoring     Hosts with infra-only OneAgent
Code Monitoring               Deep code-level visibility (PurePaths)
Runtime Vulnerability (RVA)   AppSec vulnerability scanning
Runtime App Protection (RAP)  AppSec attack blocking
Real User Monitoring (RUM)    Browser/mobile user sessions
RUM with Session Replay       Visual session recordings
Browser monitor/clickpath     Synthetic browser tests
HTTP monitor                  Synthetic HTTP checks
Log Ingest/Retain/Query       Log management pipeline
Events Ingest/Retain/Query    Event management pipeline
Automation Workflow           Workflow executions
AppEngine Functions           Serverless function executions
```

## Consumption Tracking

```dql
// Billing events — per-capability usage
fetch dt.system.events, from:now()-7d
| filter event.kind == "BILLING_EVENT"
| summarize total=count(), by:{event.type}
| sort total desc
```

## Host Unit Sizing

```
RAM         Full-Stack HU   Infra-Only HU
─────────   ─────────────   ─────────────
≤ 1.6 GiB   0.10            0.03
≤ 8 GiB     0.50            0.15
≤ 16 GiB    1.0             0.3
≤ 32 GiB    2.0             0.6
≤ 64 GiB    4.0             1.0 (capped)
```

## Maturity Stages

```
Stage  Score   Name            Key Signals
─────  ──────  ──────────────  ──────────────────────────────────────────────
  1    0-25    Foundational    OneAgent installed, basic dashboards
  2    26-50   Intermediate    Alerting, SLOs, log analytics
  3    51-75   Advanced        Correlation, anomaly detection, workflows, security
  4    76-100  Proactive       AI-driven, auto-remediation, full platform adoption
```

## Quick Maturity Assessment

```dql
// How many hosts are monitored?
fetch dt.entity.host | summarize count()

// How many custom dashboards exist?
fetch dt.system.data_objects | filter type == "dashboard" | summarize count()

// How many anomaly detectors are configured?
// (check via Settings API: builtin:davis.anomaly-detectors)

// How many workflows exist?
// (check via Automation API)

// Are SLOs defined?
// (check via SLO API)
```

## Adoption Checklist

```
Stage 1→2: Unified platform, alerting strategy, SLOs, custom dashboards
Stage 2→3: Topology knowledge, signal correlation, Davis triggers, security
Stage 3→4: Auto-remediation, scheduled reports, business events, ABAC
```

:::tip
💡 The [Dynatrace Tenant Review](https://github.com/dynatrace-oss/CustomerSuccess) dashboard (open source) performs a comprehensive adoption analysis — import it into your environment for an instant maturity snapshot.
:::

QUIZ:13

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: A 16 GiB RAM host in full-stack mode consumes how many host units?</strong></p>
<ul>
<li>❌ 0.5</li>
<li>✅ 1.0</li>
<li>❌ 2.0</li>
</ul>
<p><strong>Q: What distinguishes Stage 3 (Advanced) from Stage 4 (Proactive)?</strong></p>
<ul>
<li>❌ More hosts monitored</li>
<li>✅ Auto-remediation, scheduled reports, full platform adoption</li>
<li>❌ More dashboards created</li>
</ul>
</details>

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"sre-finops","title":"SRE & FinOps","subtitle":"SLOs, Cost Optimization & Capacity Planning","color":"lime","tracks":[{"id":"dql-sre","title":"SRE & FinOps","description":"Reliability engineering and cost optimization with Dynatrace","icon":"💰","modules":[{"number":0,"slug
