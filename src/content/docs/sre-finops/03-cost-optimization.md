---
title: "Cost Optimization"
course: "SRE & FinOps"
track: "SRE & FinOps"
moduleNumber: 3
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="sre-finops__03-cost-optimization" data-course-slug="sre-finops">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Cost Optimization

Dynatrace costs scale with data volume. Here's how to monitor and optimize spending.

:::tip
💡 **Cost & Carbon Optimization app:** Dynatrace has a built-in app that calculates and monitors your IT cost (public list price) and carbon footprint. It tracks cloud infrastructure costs and carbon emissions from both cloud and on-premises electricity consumption. Open it via Ctrl+K → "Cost & Carbon Optimization".
:::

## DPS Cost Allocation

Use `dt.cost.costcenter` and `dt.cost.product` tags to allocate DPS usage to business units. The built-in Cost Allocation dashboard breaks down spending by cost center automatically.

## DPS Pricing Model

```
What You Pay For                    How to Optimize
──────────────────────────────────  ──────────────────────────────────
Host units (per host monitored)     Right-size: full-stack vs infra-only
Log ingestion (per GB)              Filter noisy sources in OpenPipeline
Metric ingestion (per metric)       Disable unused extension metrics
DEM units (per user session)        Sample RUM if volume is too high
Trace storage (per span)            Adjust Adaptive Traffic Management
```

## Find Your Biggest Cost Drivers

### Log Volume by Source

```dql
fetch logs
| summarize cnt=count(), by:{log.source}
| sort cnt desc
| limit 10
```

### Log Volume by Level

```dql
fetch logs
| summarize cnt=count(), by:{loglevel}
| sort cnt desc
```

If DEBUG or NONE logs dominate, filter them in OpenPipeline or reduce verbosity at the source.

### Host Monitoring Mode

```dql
fetch dt.entity.host
| summarize cnt=count(), by:{monitoringMode}
```

Full-stack costs more than infrastructure-only. Switch non-critical hosts to infra-only.

## Optimization Actions

```
Action                              Savings Impact   Effort
──────────────────────────────────  ───────────────  ──────
Filter DEBUG logs in OpenPipeline   High             Low
Switch dev hosts to infra-only      Medium           Low
Reduce log retention (custom bucket) Medium          Medium
Disable unused extension metrics    Low              Low
Tune Adaptive Traffic Management    Medium           Medium
Use Segments instead of MZ clones   Low              Medium
```

## Retention Optimization

```
Bucket               Default    Optimization
───────────────────  ─────────  ──────────────────────────────
default_logs         35 days    Create custom bucket: debug_logs → 7 days
default_spans        10 days    Sufficient for most use cases
default_metrics      15 months  Fixed — can't reduce
default_bizevents    35 days    Increase for compliance if needed
```

:::tip
💡 The #1 cost optimization: find your noisiest log source (`summarize count(), by:{log.source}`) and either filter it in OpenPipeline or reduce verbosity at the application. This alone can cut log costs by 30-50%.
:::

:::note
🛠 **Try it:** Open Ctrl+K → "Cost & Carbon Optimization" → explore your infrastructure costs by service and host. Then open "Logs" → check which log sources produce the most volume — those are your biggest cost optimization targets.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"sre-finops","title":"SRE & FinOps","subtitle":"SLOs, Cost Optimization & Capacity Planning","color":"lime","tracks":[{"id":"dql-sre","title":"SRE & FinOps","description":"Reliability engineering and cost optimization with Dynatrace","icon":"💰","modules":[{"number":0,"slug":
