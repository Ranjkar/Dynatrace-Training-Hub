---
title: "Alerting"
course: "From Zero to Hero"
track: "Track 3: Monitor & Alert"
moduleNumber: 11
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__10-alerting" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Alerting

Alerting is the bridge between monitoring and action. Dynatrace uses **anomaly detectors** — DQL-based rules that trigger events when conditions are met.

## Three Analyzer Models

```
Model                   How It Works                              Best For
──────────────────────  ──────────────────────────────────────    ──────────────────
Static threshold        Fixed value (e.g., CPU > 90%)             Known limits
Auto-adaptive           Learns baseline, adapts over time         Growing workloads
Seasonal baseline       Detects patterns (daily/weekly cycles)    Traffic with patterns
```

## Creating an Anomaly Detector

1. Ctrl+K → "Anomaly detectors" → Create new
2. Choose analyzer: Static threshold (simplest to start)
3. Write a DQL timeseries query: `timeseries avg(dt.host.cpu.usage), interval:1m`
4. Set threshold (e.g., 90%) and condition (ABOVE)
5. Configure sliding window (default: 3 of 5 samples)
6. Save and enable

:::danger
⚠️ Anomaly detector queries MUST use `interval:1m`. Other intervals will fail.
:::

## Priority Pattern: P1 + P3

Best practice: create TWO alerts for every key metric — a warning (P3) and a critical (P1):

```
Alert                                   Priority  Threshold
──────────────────────────────────────  ────────  ─────────
[P3] CPU Usage Warning                  P3        > 70%
[P1] CPU Usage Critical                 P1        > 90%

[P3] Response Time Warning              P3        > 500ms
[P1] Response Time Critical             P1        > 2000ms

[P3] Error Rate Warning                 P3        > 1%
[P1] Error Rate Spike                   P1        > 5%
```

:::tip
💡 P3 warnings give early notice before outages. P1 critical means immediate action. Without P3, every alert is critical → teams ignore them (alert fatigue).
:::

## Sliding Window

```
Parameter              Default   What It Means
─────────────────────  ────────  ──────────────────────────────────
Violating samples      3         How many 1-min samples must breach
Sliding window         5         Over how many minutes
De-alerting samples    5         How many normal samples to close
```

Default: 3 out of 5 one-minute samples must violate the threshold to trigger. 5 normal samples to close.

## Settings API

Anomaly detectors use schema `builtin:davis.anomaly-detectors`. They can be managed via Settings API, Terraform (`dynatrace_davis_anomaly_detectors`), or Monaco.

:::note
🛠 **Try it:** Open Ctrl+K → "Anomaly Detection" → click "+ Anomaly detector" → paste `timeseries avg(dt.host.cpu.usage), interval:1m` → choose Static threshold → set 90% → preview. You just built a production-grade CPU alert.
:::

## Log Alerting (3 strategies)

```
Method                    Speed     Best For
────────────────────────  ────────  ──────────────────────────────
Log-based events          Fastest   Sparse patterns (1/week), instant response
Log-based metrics (rec.)  1 min     Threshold alerting, anomaly detection
DQL queries in alerts     1 min     Fallback when metrics/events won't work
```

Recommended: extract metrics from logs via OpenPipeline, then alert on the metric with an anomaly detector.

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":[{"id":"hero-foundation","title":"Track 1: Foundation","description":"What is observability, how Dynatrace works, set up access, and get your first data","icon":"🏗️","modules":[{"number":0,"slug":"00-what-is-observability","title":"What is Observability","type":"Tutorial"},{"number":1,"slug":"01-dynatrace-pl
