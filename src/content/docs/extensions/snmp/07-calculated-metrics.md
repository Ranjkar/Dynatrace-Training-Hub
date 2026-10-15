---
title: "Calculated Metrics (func:)"
course: "Dynatrace Extensions"
track: "SNMP Extensions"
moduleNumber: 7
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__07-calculated-metrics" data-course-slug="extensions">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## What Are func: Metrics?

Extension metrics — including calculated func: metrics

Calculated metrics let you compute values server-side without writing code. Prefix the key with `func:`:

```yaml
- key: func:my_ext.uptime_hours
  value: metric:my_ext.uptime_ticks
  operand: 100
  operator: DIVIDE
  type: gauge
```

## Available Operators

```
Operator   What It Does                Example
─────────  ──────────────────────────  ──────────────────────────
DIVIDE     metric / operand            Ticks → hours (÷ 360000)
MULTIPLY   metric × operand            Bytes → bits (× 8)
ADD        metric + operand            Offset correction
SUBTRACT   metric - operand            Baseline subtraction
REMAINDER  metric % operand            Modulo
```

## Common Patterns

```yaml
# Convert SNMP ticks (1/100 sec) to hours
- key: func:my_ext.uptime_hours
  value: metric:my_ext.uptime_ticks
  operand: 360000
  operator: DIVIDE
  type: gauge

# Convert bytes to megabytes
- key: func:my_ext.memory_mb
  value: metric:my_ext.memory_bytes
  operand: 1048576
  operator: DIVIDE
  type: gauge

# Percentage from two counters
- key: func:my_ext.error_rate
  value: metric:my_ext.errors.count
  operand: metric:my_ext.total.count
  operator: DIVIDE
  type: gauge
```

:::danger
⚠️ `func:` metrics are NOT stored in Grail — they only work in entity screens and classic dashboards. For Gen3 DQL dashboards, do the math in DQL instead.
:::

:::tip
💡 Use `func:` metrics for unit conversions (ticks→hours, bytes→MB) and simple ratios. For complex calculations, use Python extensions instead.
:::

:::note
🛠 **Try it:** Open Ctrl+K → "Metrics" → search for "func:" to find calculated metrics from extensions. These are computed at query time from raw metrics — they don't cost extra storage but give you derived insights like utilization percentages.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extensions","title":"Dynatrace Extensions"
