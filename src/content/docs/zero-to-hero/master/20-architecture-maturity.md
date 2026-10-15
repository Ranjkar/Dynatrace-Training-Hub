---
title: "Architecture & Maturity"
course: "From Zero to Hero"
track: "Track 5: Master"
moduleNumber: 20
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__20-architecture-maturity" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Architecture & Maturity

Designing Dynatrace for enterprise scale — environment strategy, cost allocation, and measuring platform maturity.

## Environment Strategy

```
Pattern                 When to Use                           Environments
──────────────────────  ──────────────────────────────────    ──────────────
Single environment      Small teams, one product               1 env
Multi-environment       Separate prod/staging/dev              2-4 envs
Multi-account           Enterprise with compliance needs       Multiple accounts
```

## Data Architecture

```
Layer               What It Controls                    Tool
──────────────────  ──────────────────────────────────  ──────────────────
Data Partitioning   Where data is stored (buckets)      Grail buckets + retention
Data Access         Who can see what data                IAM + ABAC policies
Data Segmentation   How data is filtered in the UI       Segments
```

## Cost Allocation

Use host tags to allocate costs to teams and products:

```
Tag Key                  Purpose
───────────────────────  ──────────────────────────────
dt.cost.costcenter       Map hosts to cost centers
dt.cost.product          Map hosts to products
dt.security_context      Map hosts to teams (for ABAC)
```

## Maturity Assessment

Measure your Dynatrace deployment maturity across 4 stages:

```
Stage  Score   Name            What It Means
─────  ──────  ──────────────  ──────────────────────────────────────────────
  1    0-25    Foundational    OneAgent installed, basic dashboards, siloed tools
  2    26-50   Intermediate    Alerting, SLOs, log analytics, some automation
  3    51-75   Advanced        Correlation, anomaly detection, workflows, security
  4    76-100  Proactive       AI-driven, auto-remediation, full platform adoption
```

## 8 Maturity Criteria

```
Criteria                  What to Check
────────────────────────  ──────────────────────────────────────────────
Infrastructure            Hosts monitored, full-stack mode, host tags
Service & Application     Services detected, RUM configured, user sessions
Dashboards & Analytics    Custom dashboards, notebooks
Alerting & SLOs           P1+P3 alert pairs, SLO targets, burn rate
Automation                Workflows, Davis triggers, service user actors
Synthetic Monitoring      HTTP monitors, browser clickpaths
Security                  Attack protection, vulnerability alerting
Platform Adoption         Extensions, logs, business events, IAM groups
```

:::tip
💡 Run a maturity assessment every 3 months. The goal is not to reach 100% — it's to identify the highest-impact improvements for your specific environment.
:::

## What You've Learned

Congratulations — you've completed the Zero to Hero course. You now know how to:

- Navigate the Dynatrace platform and understand its architecture
- Write DQL queries for metrics, logs, entities, and traces
- Build dashboards, set up alerts, and define SLOs
- Create workflows for automation and notifications
- Manage configuration as code with Terraform and Monaco
- Configure access control with IAM and ABAC
- Extend monitoring with extensions and custom apps
- Assess and improve platform maturity

Next steps: explore the **Extensions 2.0** course for custom monitoring, the **Apps** course for custom app development, or the **Gen3 Migration** guide if you're upgrading from classic Dynatrace.

:::note
🛠 **Try it:** Open Ctrl+K → "Cost & Carbon Optimization" to see your infrastructure costs and carbon footprint. Then open "Account Management" → review your environment count, user count, and license consumption. This is your architecture baseline.
:::

## Host Unit Sizing

Dynatrace licenses hosts by RAM size:

```
RAM         Full-Stack HU   Infra-Only HU
─────────   ─────────────   ─────────────
≤ 1.6 GiB   0.10            0.03
≤ 8 GiB     0.50            0.15
≤ 16 GiB    1.0             0.3
≤ 32 GiB    2.0             0.6
≤ 64 GiB    4.0             1.0 (capped)
```

Infra-only mode is capped at 1.0 HU per host regardless of RAM. Hosts running less than 5 minutes don't count.

## DPS Capabilities

Each capability you use consumes DPS credits: Full-Stack Monitoring, Infrastructure Monitoring, Code Monitoring, Runtime Vulnerability Analytics, Runtime Application Protection, RUM, Session Replay, Synthetic (browser + HTTP), Log Ingest/Retain/Query, Events, Automation Workflows, AppEngine Functions.

Track consumption: `fetch dt.system.events | filter event.kind == "BILLING_EVENT"`

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":[{"id":"hero-foundation","title":"Track 1: Foundation","description":"What is observability, how Dynatrace works, set up access, and get your first data","icon":"🏗️","modules":[{"number":0,"slug":"00-what-is-observability","title":"What is Observability","type":"Tutorial"},{"number":1,"slug":"01-dynatrace-platform","title":"The Dynatrace Platform","type":"Tutorial"},{"number":2,"slug":"02-getting-started","title":"Getting Started","type":"Tutorial"},{"number":3,"slug":"15-access-control","title":"Tags & Access Control",
