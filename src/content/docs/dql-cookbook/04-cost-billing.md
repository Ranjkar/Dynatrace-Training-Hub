---
title: "Cost & Billing Recipes"
course: "DQL Cookbook"
track: "DQL Recipes"
moduleNumber: 4
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dql-cookbook__04-cost-billing" data-course-slug="dql-cookbook">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Cost & Billing Recipes

## DPS Consumption Overview

Start with Account Management → Subscription → Overview → Cost and usage details. For DQL analysis, billing usage events are stored in `dt.system.events` and require system-event and bucket permissions. Select the documented capability-specific fields and units before aggregating; an arbitrary `events` query is not a billing report. See [DPS access and usage sources](https://docs.dynatrace.com/docs/license/dps-permissions).

## Log Volume (Ingestion Cost Driver)

```dql
// Log volume by source — find what's generating the most logs
fetch logs, from:-1h, scanLimitGBytes:1
| summarize cnt=count(), by:{log.source}
| sort cnt desc
| limit 10
```

## Log Volume Over Time

```dql
fetch logs, from:-1h, scanLimitGBytes:1
| makeTimeseries volume=count(), by:{loglevel}
```

## Query Cost Controls

Use a narrow timeframe and a finite scan allowance where supported. The log examples above cap scans at 1 GB; inspect execution warnings before treating their counts as complete. A final `limit` limits returned rows, not necessarily scanned data. Do not add `scanLimitGBytes` to `timeseries`: it is not a timeseries parameter. Query diagnostics, record counts and invoice consumption are different measurements.

## Inventory Is Not License Consumption

Host counts help describe scope, but do not by themselves calculate billed consumption. Check the customer's subscription model, enabled capabilities, measurement units and rate card. Classic host-unit assumptions do not apply universally to DPS.

## Extension Data Volume

Counting custom-device entities does not count metric series, samples or billed metric usage. Inspect the extension's emitted metric keys and dimensions, then use the applicable metric-consumption reporting.

## Retention Impact

Inspect the actual bucket retention settings and applicable capability pricing. Retention periods, metric resolution and included-query options are not interchangeable across signals. Do not estimate a bill from a copied table of defaults.

:::tip
💡 The #1 cost optimization: reduce noisy log sources. Find the top log.source by volume and either filter at OpenPipeline or reduce log verbosity at the application level.
:::

:::note
🛠 **Try it:** Choose one capability in your account's usage report. Identify its billed unit and reporting period, then compare these with a narrowly scoped operational query. Explain why log record counts alone cannot establish ingested bytes or monetary cost.
:::

b:["$","div",n
