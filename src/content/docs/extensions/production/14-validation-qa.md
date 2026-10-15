---
title: "Validation & QA"
course: "Dynatrace Extensions"
track: "Production Skills"
moduleNumber: 14
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__14-validation-qa" data-course-slug="extensions">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Validation Workflow

Extension lifecycle — validation and QA

Every extension delivery needs validation against requirements. Four phases:

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 80" xmlns="http://www.w3.org/2000/svg">
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="2" width="180" x="10" y="20"></rect>
<text fill="#7dd3fc" font-size="11" font-weight="bold" text-anchor="middle" x="100" y="45">1. YAML Lint</text>
<text fill="#475569" font-size="16" x="200" y="45">→</text>
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="2" width="180" x="210" y="20"></rect>
<text fill="#7dd3fc" font-size="11" font-weight="bold" text-anchor="middle" x="300" y="45">2. Metric Check</text>
<text fill="#475569" font-size="16" x="400" y="45">→</text>
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="2" width="180" x="410" y="20"></rect>
<text fill="#7dd3fc" font-size="11" font-weight="bold" text-anchor="middle" x="500" y="45">3. Entity Check</text>
<text fill="#475569" font-size="16" x="600" y="45">→</text>
<rect fill="#14532d" height="40" rx="8" stroke="#22c55e" stroke-width="2" width="180" x="610" y="20"></rect>
<text fill="#86efac" font-size="11" font-weight="bold" text-anchor="middle" x="700" y="45">4. Alert Test</text>
</svg>
</div>

## Phase 1: YAML Lint (DED Codes)

Check for common YAML errors using diagnostic codes:

```
Code     What It Checks                          Severity
───────  ──────────────────────────────────────  ────────
DED001   Missing required fields                 Error
DED003   Invalid metric type                     Error
DED005   Metric key doesn't match extension name Warning
DED010   Scalar OID missing .0 suffix            Error
DED011   Table OID has .0 suffix                 Error
DED018   Cross-table OIDs in same subgroup       Error
DED021   Dimension key conflicts                 Warning
```

:::danger
⚠️ **DED018** is the #1 bug in production extensions. It means you mixed OIDs from different SNMP tables in one subgroup. Each subgroup = one table.
:::

## Phase 2: Metric Verification

After deployment, verify every metric has data:

```dql
// Check which metrics are reporting
fetch dt.metrics
| filter matchesPhrase(metric.key, "com.dynatrace.extension.my-ext")
| fields metric.key, metric.unit, metric.description
```

## Phase 3: Entity Verification

```dql
// Check entities were created
fetch dt.entity.my-ext:device
| fields entity.name, device_address, entity.detected_name
```

## Phase 4: Alert Testing

Trigger each alert to verify it fires correctly:

1. Lower thresholds temporarily (e.g., CPU > 1%)
2. Wait for alert to fire
3. Verify alert name, severity, and entity association
4. Restore original thresholds

:::note
🛠 **Try it:** Use the validation script: `python3 validate_extension.py extension.yaml` — it checks DED001-DED021 automatically.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extensions",
