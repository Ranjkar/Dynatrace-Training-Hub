---
title: "Daily Health Report"
course: "SRE & FinOps"
track: "SRE & FinOps"
moduleNumber: 0
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="sre-finops__00-daily-health-report" data-course-slug="sre-finops">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Daily Health Report Workflow

A workflow that runs every morning, queries key metrics, formats a report, and emails it to the team.

## Architecture

```
Schedule (08:00 daily)
  → DQL: Host health
  → DQL: Service errors
  → DQL: Active problems
  → DQL: SLO status
  → JavaScript: Format report
  → Email: Send to team
```

## DQL Queries for the Report

### Host Health Summary

```dql
timeseries cpu = avg(dt.host.cpu.usage, scalar:true), by:{dt.entity.host}
| fieldsAdd current = arrayAvg(cpu)
| fields dt.entity.host, current
```

### Service Error Summary (24h)

```dql
timeseries {
  total = sum(dt.service.request.count),
  failures = sum(dt.service.request.failure_count)
}, by:{dt.entity.service}, from:now()-24h
| fieldsAdd total_sum = arraySum(total), fail_sum = arraySum(failures)
| fieldsAdd error_pct = 100.0 * fail_sum / total_sum
| fields dt.entity.service, total_sum, fail_sum, error_pct
```

### Active Problems

```dql
fetch events, from:now()-24h
| filter event.kind == "DAVIS_PROBLEM"
| filter event.status == "ACTIVE"
| fields display_id, event.name
```

## Workflow Setup

1. Create workflow with **Schedule trigger** (08:00 daily)
2. Add DQL tasks for each query above
3. Add JavaScript task to format results into a readable report
4. Add Email task: `{{ result("format_report").output }}`
5. Set a **service user as actor**

:::tip
💡 We have a production-tested 11-task executive daily report workflow template with sparklines, health scores, and trend arrows. See the dt-automation skill for the full JSON template.
:::

:::note
🛠 **Try it:** Open Workflows → "+ Workflow" → add a Schedule trigger (daily 09:00) → add a "Execute DQL query" task with `fetch dt.entity.host | summarize total=count(), healthy=countIf(state == "RUNNING")` → add a "Send email" task. You just automated your morning health check.
:::

## SLO Error Budget & Burn Rate

SLOs track error budget — the amount of "allowed" downtime before breaching your target:

- **Burn rate 1.0** = consuming budget exactly at target pace
- **Burn rate > 1.0** = will breach SLO before evaluation period ends
- **Auto-alerting**: the SLO app raises burn-rate events via Anomaly Detection

Official SLI DQL pattern (service availability):

```dql
timeseries {
    total = sum(dt.service.request.count),
    failures = sum(dt.service.request.failure_count)
  }, by: { dt.smartscape.service }
| fieldsAdd sli = (((total[] - failures[]) / total[]) * 100)
```

Key: the `sli` field must return an array of double values. Use `timeseries` for metrics, `makeTimeseries` for logs/spans.

b:["$","div",null,{"classNam
