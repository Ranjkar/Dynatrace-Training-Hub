---
title: "Migrate Metric Events → Anomaly Detectors"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 4: Migrate Alerting & SLOs"
moduleNumber: 18
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__12-anomaly-detectors" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Anomaly Detectors (Replacing Metric Events)

Gen2 used metric events with threshold-based alerting. Gen3 uses **Davis anomaly detectors** — DQL-powered, with three analysis models.

## Three Analyzer Models

```
Model                   How It Works                    Best For
──────────────────────  ──────────────────────────────  ──────────────────────
Static Threshold        Fixed number (e.g., CPU > 90%)  Known limits
Auto-Adaptive           Learns baseline, alerts on       Dynamic workloads
                        deviation from normal
Seasonal Baseline       Learns daily/weekly patterns,    Traffic with patterns
                        alerts on anomalies              (business hours, weekends)
```

:::note
🛠 **Try it:** Ctrl+K → "Anomaly Detection" → "+ Anomaly detector" → paste: `timeseries failures=avg(dt.service.request.failure_rate), by:{dt.entity.service}, interval:1m` → Static threshold → 5% → ABOVE. This alerts when any service's error rate exceeds 5% — a real production alert you'd actually use.
:::

## 🔧 Migration Step: Use the Built-in Transpiler

:::tip
💡 **Dynatrace has a built-in metric event transpiler.** The Anomaly Detection app can auto-convert your classic metric events to DQL-based anomaly detectors.
:::

```
Step  Action                                  Where
────  ──────────────────────────────────────  ──────────────────────────────────
1     Open Anomaly Detection app               Ctrl+K → "Anomaly Detection"
2     Enable authorization settings             ⚙ → Authorization settings → enable
3     Click "Improve metric events with DQL"    Custom alert → Improve metric events
4     Select metric events to transform         Check the ones you want to convert
5     Click "Transform"                         Auto-converts metric selector → DQL
6     Verify the converted query                ⋮ → Open with → View and execute query
7     Check the original is disabled            Transformation page → State: Disabled
```

:::danger
⚠️ The transpiler only works with **metric selector** events, not metric key events. Metric key events must be manually rewritten as DQL timeseries queries. After transformation, the classic metric event is automatically disabled and the new anomaly detector is activated.
:::

### Manual Conversion (for metric key events)

For metric key events that the transpiler can't handle, convert manually:

```
Classic Metric Event                    Gen3 Anomaly Detector
──────────────────────────────────────  ──────────────────────────────────────
Metric key: builtin:host.cpu.usage      Query: timeseries avg(dt.host.cpu.usage), interval:1m
Threshold: 90                           Threshold: 90
Condition: ABOVE                        Alert condition: ABOVE
Alert delay: 3 of 5 samples            Violating: 3, Sliding window: 5
```

## Creating an Anomaly Detector (UI)

1. Open the **Anomaly detectors** app
2. Click **+ Anomaly detector**
3. Write a DQL timeseries query: `timeseries avg(dt.host.cpu.usage), interval:1m`
4. Choose analyzer model (Static threshold is simplest)
5. Set threshold, condition (ABOVE/BELOW), and sensitivity
6. Configure event template (name, type, severity)
7. Save and enable

:::danger
⚠️ Anomaly detector queries MUST use `interval:1m`. Other intervals will fail.
:::

## Naming Convention

```
[P1] Service Name — What's Wrong (Critical)
[P3] Service Name — What's Wrong (Warning)

Examples:
  [P1] Control Center — CPU Usage Critical
  [P3] Checkout Service — Response Time Warning
  [P1] All Services — Error Rate Spike
```

## API Deep Dive

For automation, anomaly detectors use the Settings API with schema `builtin:davis.anomaly-detectors`:

```json
{
  "schemaId": "builtin:davis.anomaly-detectors",
  "value": {
    "enabled": true,
    "title": "[P1] High CPU",
    "analyzer": {
      "name": "...StaticThresholdAnomalyDetectionAnalyzer",
      "input": [
        {"key": "query", "value": "timeseries avg(dt.host.cpu.usage), interval:1m"},
        {"key": "threshold", "value": "90"},
        {"key": "alertCondition", "value": "ABOVE"}
      ]
    }
  }
}
```

## Record-Based Alerting (New)

Since SaaS 1.337, Anomaly Detection also supports **record-based alerting** — you can trigger alerts on records (logs, events, spans), not just timeseries metrics. This means you can alert on specific log patterns, event counts, or span attributes directly.

:::note
💡 Timeseries-based alerting (shown above) remains the primary pattern for infrastructure and service metrics. Record-based alerting is best for log-driven alerts, security events, or business event thresholds where you need to match specific record conditions.
:::

## ACE Best Practice: P1/P3 Pairing

:::tip
💡 Every P1 (critical) alert MUST have a matching P3 (warning) alert. The P3 fires first, giving teams time to investigate before the P1 escalates.
:::

```
Alert                                     P3 Warning    P1 Critical
────────────────────────────────────────  ────────────  ────────────
CPU Usage                                 > 70%         > 90%
Memory Usage                              > 80%         > 95%
Disk Usage                                > 80%         > 90%
Service Response Time                     > 2000ms      > 5000ms
Service Error Rate                        > 1%          > 5%
```

## Sliding Window Parameters

```
Parameter            What It Does                              Recommended
───────────────────  ────────────────────────────────────────  ────────────
slidingWindow        Number of samples in the evaluation window  5
violatingSamples     How many must breach threshold to alert      3
dealertingSamples    How many must be OK to close the alert       5
alertOnMissingData   Alert when no data arrives                   false
```

:::danger
⚠️ Always set `alertOnMissingData: false`. Otherwise, maintenance windows and agent restarts trigger false alerts.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"76%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🔔"," ","Phase 4: Migrate Alerting & SLOs"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",18]}],["$","span",null,{"className":"ml-auto text-xs text-gray-600","children":[3," min read · ",19,"/",25]}]]}],
