---
title: "SLO Management"
course: "SRE & FinOps"
track: "SRE & FinOps"
moduleNumber: 4
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="sre-finops__04-slo-management" data-course-slug="sre-finops">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## SLO Management

Service-Level Objectives track reliability targets. This module covers SLI patterns, burn rate alerting, and the official SLO templates.

## SLI DQL Patterns

Custom SLIs must produce an `sli` field returning an array of double values.

### Service Availability

```dql
timeseries {
    total = sum(dt.service.request.count),
    failures = sum(dt.service.request.failure_count)
  }, by: { dt.smartscape.service }
| fieldsAdd entityName = getNodeName(dt.smartscape.service)
| fieldsAdd sli = (((total[] - failures[]) / total[]) * 100)
| fieldsRemove total, failures
```

### Service Error Rate by K8s Cluster

```dql
timeseries {
    total = sum(dt.service.request.count),
    errors = sum(dt.service.request.failure_count)
  }, by: { dt.smartscape.service, k8s.cluster.name }
| filter k8s.cluster.name == "production-cluster"
| fieldsAdd errorRate = (errors[] / total[]) * 100
| fieldsAdd sli = 100 - errorRate[]
```

### Response Time Performance

```dql
timeseries total = avg(dt.service.request.response_time),
  default: 0, by: { dt.smartscape.service }
| fieldsAdd high = iCollectArray(if(total[] > (1000 * 500), total[]))
| fieldsAdd low = iCollectArray(if(total[] <= (1000 * 500), total[]))
| fieldsAdd highRespTimes = iCollectArray(if(isNull(high[]), 0, else: 1))
| fieldsAdd lowRespTimes = iCollectArray(if(isNull(low[]), 0, else: 1))
| fieldsAdd sli = 100 * (lowRespTimes[] / (lowRespTimes[] + highRespTimes[]))
```

## Error Budget & Burn Rate

```
Concept          What It Means
───────────────  ──────────────────────────────────────────────
Error budget     Amount of "allowed" downtime before breaching target
Burn rate 1.0    Consuming budget exactly at target pace
Burn rate > 1.0  Will breach SLO before evaluation period ends
Burn rate < 1.0  Under budget — room to spare
```

Dynatrace auto-calculates burn rate and raises events via Anomaly Detection. You can also create custom burn-rate alerts.

## Official SLO Templates (7)

```
Template                              What It Measures
────────────────────────────────────  ──────────────────────────
Host CPU utilization                  CPU idle percentage
Service availability                  Request success rate
Service performance                   Response time threshold
K8s cluster CPU efficiency            Cluster CPU utilization
K8s cluster memory efficiency         Cluster memory utilization
K8s namespace CPU efficiency          Namespace CPU utilization
K8s namespace memory efficiency       Namespace memory utilization
```

## Key Rules

- Use `timeseries` for metric-based SLOs (pre-aggregated, faster, cheaper)
- Use `makeTimeseries` for event/log/span-based SLOs
- `getNodeName()` extracts entity display name from entity ID
- SLO names must be unique (duplicate → 400 error)

QUIZ:12

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: What does a burn rate of 2.0 mean?</strong></p>
<ul>
<li>❌ You have 2x the error budget remaining</li>
<li>✅ You're consuming error budget at 2x the target pace — will breach before period ends</li>
<li>❌ Your SLO target is 2%</li>
</ul>
</details>

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"sre-finops","title":"SRE & FinOps","subtitle":"SLOs, Cost Optimization & Capacity Planning","color":"lime","tracks":[{"id":"dql-sre","title":"SRE & F
