---
title: "Migrate Classic → Platform SLOs"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 4: Migrate Alerting & SLOs"
moduleNumber: 20
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__14-slo-migration" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## SLO Migration

Gen2 SLOs used metric-based SLIs. Gen3 SLOs use **DQL-based SLIs** — more flexible, queryable, and integrated with Grail.

## 🔧 Migration Step: Convert Classic SLOs

```
Step  Action                                  Where
────  ──────────────────────────────────────  ──────────────────────────────────
1     List classic SLOs                         Service-Level Objectives Classic app
2     Note each SLO's metric, target, window    Export or screenshot for reference
3     Create platform SLO from template          Service-Level Objectives app → + SLO
4     Select matching template                   Service availability, response time, etc.
5     Choose entity and set target               Match your Gen2 values
6     Verify SLO value matches Gen2              Compare for one full evaluation period
7     Set up burn rate alerting                  Create anomaly detector on SLO metric
8     Disable classic SLO after validation       Don't delete — disable first
```

:::danger
Follow the [published SLO upgrade guide](https://docs.dynatrace.com/docs/deliver/service-level-objectives-classic/service-level-objective-upgrade-classic). Preserve the intended indicator, scope, target and evaluation period, then compare Classic and new SLO results over a full evaluation period before retiring the old definition.
:::

## Creating an SLO (UI)

:::note
🛠 **Try it:** Ctrl+K → "Service-Level Objectives" → Create new → Choose a template (Service availability, Host CPU, etc.) → Select entities → Set target (e.g., 99.5%) → Save.
:::

## Built-in Templates

```
Template                              What It Measures
────────────────────────────────────  ──────────────────────────────────
Host CPU usage utilization            CPU usage across selected hosts
Service availability                  Successful request ratio
Service performance                   Time slots whose average latency meets the threshold
K8s cluster CPU usage efficiency      Requested CPU / allocatable CPU × 100
K8s cluster memory usage efficiency   Working-set memory / requested memory × 100
K8s namespace CPU usage efficiency    Used CPU / requested CPU × 100
K8s namespace memory usage efficiency Working-set memory / requested memory × 100
```

**Check the formula, not just the label.** The memory-template descriptions can mention allocatable memory even though their formulas divide working-set memory by requested memory. The ratios above describe the formulas. Inspect generated DQL, entity scope, missing data and denominators before using a template. Here, 100% means equal operands—not automatically healthy or reliable.

**Time slots are not requests.** The published service-performance formula classifies each interval's average latency against the threshold. It does not count individual fast requests or calculate their P95, so it should not be described as a request-weighted success percentage. The template's `default:0` can also classify missing latency as a good slot; choose missing-data behavior deliberately. See the [published template formulas](https://docs.dynatrace.com/docs/deliver/service-level-objectives/service-level-objective-templates).

## Custom SLO with DQL

A custom SLI query must return an `sli` array of double values representing percentage-good, where 100 is good. Use `timeseries` for metrics or `makeTimeseries` for events, logs or spans. For metric ratios, aggregate the inputs first and calculate the SLI afterward:

```dql
// Inspect successful-request percentage per service over 15 minutes
timeseries total=sum(dt.service.request.count), failures=sum(dt.service.request.failure_count),
  by:{dt.smartscape.service}, from:now()-15m, to:now(), interval:1m
| fieldsAdd sli=if(total[] > 0, (total[]-failures[])/total[]*100.0)
```

:::danger
⚠️ **Syntax versus meaning:** Arithmetic directly in a `timeseries` aggregation position is invalid; arithmetic on its output arrays with `fieldsAdd` is supported. Raw request counts or failure rates are not availability SLIs. Zero traffic and missing operands remain null in this example rather than becoming an invented success or failure.
:::

This is a diagnostic 15-minute query. Select the intended service scope and adapt its time window to the SLO evaluation period, then check SLO Preview before saving. Query execution alone does not prove that an SLO definition is accepted or evaluates correctly. See [creating custom SLOs](https://docs.dynatrace.com/docs/deliver/service-level-objectives/create-slo).

:::danger
⚠️ **API gotcha:** The `criteria` field must be an **array** (not object). This causes 400 errors if wrong.
:::

## Out-of-the-Box SLO Templates

Gen3 includes pre-built SLO templates — no need to write DQL from scratch:

1. Ctrl+K → "Service-Level Objectives" → Create new
2. Choose a template (service availability, response time, synthetic, etc.)
3. Select your entity and target
4. The DQL SLI is auto-generated

:::tip
💡 After creating from a template, click "Edit SLI" to see the generated DQL — great way to learn SLO query patterns.
:::

## ACE Best Practice: SLO Tiers

The Dynatrace ACE team recommends three SLO tiers based on business criticality:

```
Tier      Target   Warning   Burn Rate Threshold   Use Case
────────  ───────  ────────  ────────────────────   ──────────────────────
High      99.0%    99.5%     4                      Revenue-critical services
Medium    98.0%    99.0%     10                     Internal business apps
Low       95.0%    98.0%     20                     Dev/staging environments
```

## Burn Rate Alerting

Burn rate measures how fast you're consuming your error budget. A burn rate of 1 means you'll exactly exhaust the budget by the end of the window. Higher = faster burn = more urgent.

```
Burn Rate    Meaning                              Action
───────────  ──────────────────────────────────   ──────────────────
< 1          Under budget — healthy                None
1-4          Slow burn — will miss SLO eventually  Investigate
4-10         Fast burn — urgent                    Page on-call
> 10         Critical — SLO will fail soon         Immediate action
```

:::tip
💡 Create an anomaly detector that monitors SLO burn rate. When burn rate exceeds the tier threshold, trigger a workflow to notify the team. This is proactive SLO management — issues get fixed before they impact users.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"84%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🔔"," ","Phase 4: Migrate Alerting & SLOs"]}],["$","span",null,{"children":
