---
title: "Alert Creation"
course: "Dynatrace Extensions"
track: "Production Skills"
moduleNumber: 13
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__13-alert-creation" data-course-slug="extensions">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Alert Structure

Anomaly detection — create alerts for your extension metrics

Dynatrace has two alert systems. Classic **metric events** (Gen2) and Gen3 **Davis anomaly detectors**. Both work with extensions, but anomaly detectors are more powerful.

## Gen3: Davis Anomaly Detectors (Recommended)

```
Model                   Best For                    Extension Example
──────────────────────  ──────────────────────────  ──────────────────────────
Static Threshold        Known limits                CPU > 90%, temp > 80°C
Auto-Adaptive           Dynamic baselines           Traffic patterns
Seasonal Baseline       Daily/weekly patterns       Business-hour traffic
```

:::note
🛠 **Try it:** Ctrl+K → "Anomaly detectors" → Create new → Use your extension metric: `timeseries avg(com.dynatrace.extension.my-ext.cpu), interval:1m`
:::

## Alert Naming Convention

```
[P1] Device Type — What's Wrong (Critical)
[P3] Device Type — What's Wrong (Warning)

Examples:
  [P1] Cisco Catalyst — CPU Critical (>90%)
  [P3] Cisco Catalyst — CPU Warning (>75%)
  [P1] FortiSwitch — Interface Down
  [P1] F5 BIG-IP — Pool Member Unavailable
```

## Building an Alert Package

For a production extension, create alerts in pairs (P1 critical + P3 warning):

```
Metric                              P3 Warning    P1 Critical
──────────────────────────────────  ────────────  ────────────
CPU usage                           > 75%         > 90%
Memory usage                        > 80%         > 95%
Temperature                         > 70°C        > 80°C
Interface error rate                > 1%          > 5%
Interface utilization               > 80%         > 95%
Disk usage                          > 80%         > 90%
```

:::danger
⚠️ Always set `alertOnMissingData: false` for extension alerts. Devices go offline for maintenance — you don't want false alerts.
:::

## Bundled Alerts

Include alert definitions in your extension package:

```yaml
# extension.yaml
alerts:
  - path: alerts/high-cpu.json
  - path: alerts/high-memory.json
```

```json
// alerts/high-cpu.json
{
  "name": "[P1] {device.name} — CPU Critical",
  "metricId": "com.dynatrace.extension.my-ext.cpu",
  "threshold": 90,
  "alertCondition": "ABOVE",
  "samples": 5,
  "violatingSamples": 3,
  "dealertingSamples": 5
}
```

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extensions","title":"Dynatrace Extensions","subtitle":"Build Extensions 2.0 From Scratch","color":"emerald","tracks":[{"id":"snmp","title":"SNMP Extensions","description":"Build a complet
