---
title: "Service Level Objectives"
course: "From Zero to Hero"
track: "Track 3: Monitor & Alert"
moduleNumber: 12
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__11-slos" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Service Level Objectives

SLOs define measurable reliability targets. Instead of vague "99.9% availability" goals, SLOs track actual performance against a target using DQL-based indicators.

## Key Concepts

```
Term            What It Means                              Example
──────────────  ──────────────────────────────────────    ──────────────────────────
SLO             The target you commit to                   99.5% availability over 7 days
SLI             The metric that measures it                 Successful requests / total requests
Error budget    How much failure is allowed                 0.5% = ~50 min downtime per week
Burn rate       How fast you're consuming the budget        2x = will exhaust in half the time
```

## Creating an SLO

1. Ctrl+K → "Service-Level Objectives" → Create new
2. Choose a **template** (recommended) or write custom DQL
3. Select entity (host, service) and set target
4. Save — the SLO starts tracking immediately

## Built-in Templates

```
Template                              SLI (auto-generated DQL)
────────────────────────────────────  ──────────────────────────────────
Host CPU utilization                  timeseries sli=avg(dt.host.cpu.usage)
Service availability                  timeseries {total=sum(dt.service.request.count), failures=sum(dt.service.request.failure_count)}
Service performance                   timeseries total=avg(dt.service.request.response_time)
K8s cluster CPU/memory efficiency     timeseries sli=avg(dt.kubernetes.cluster.cpu_usage_percent)
```

:::tip
💡 After creating from a template, click "Edit SLI" to see the generated DQL — great way to learn SLO query patterns.
:::

## SLO Tiers (ACE Best Practice)

```
Tier      Target   Warning   Use Case
────────  ───────  ────────  ──────────────────────
High      99.0%    99.5%     Revenue-critical services
Medium    98.0%    99.0%     Internal business apps
Low       95.0%    98.0%     Dev/staging environments
```

## Burn Rate Alerting

Burn rate measures how fast you're consuming your error budget. Create an anomaly detector on the SLO burn rate metric to get alerted *before* the SLO target is breached.

```
Burn Rate    Meaning                              Action
───────────  ──────────────────────────────────   ──────────────────
< 1          Under budget — healthy                None
1-4          Slow burn — will miss SLO eventually  Investigate
4-10         Fast burn — urgent                    Page on-call
> 10         Critical — SLO will fail soon         Immediate action
```

:::note
🛠 **Try it:** Create an SLO from the "Service availability" template for your main service. Set target to 99.5%. Watch it track over the next few hours.
:::

## Error Budget & Burn Rate

- **Burn rate 1.0** = consuming budget at target pace
- **Burn rate > 1.0** = will breach SLO before period ends
- Dynatrace auto-calculates burn rate and raises events via Anomaly Detection

Custom SLI DQL must produce an `sli` field returning array of doubles. Use `timeseries` for metrics, `makeTimeseries` for logs/spans.

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":[{"id":"hero-foundation","title":"Track 1: Foundation","description":"What is observability, how Dynatrace works, set up access, and get your first data","icon":"🏗️","modules":[{"number":0,"slug":"00-what-is-observability","title":"What is Observability","type":"Tutorial"},{"number":1,"slug":"0
