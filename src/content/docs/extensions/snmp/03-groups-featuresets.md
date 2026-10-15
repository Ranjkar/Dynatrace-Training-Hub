---
title: "Groups & Feature Sets"
course: "Dynatrace Extensions"
track: "SNMP Extensions"
moduleNumber: 3
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__03-groups-featuresets" data-course-slug="extensions">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Groups and Subgroups

Extension lifecycle — from development to production

An SNMP extension organizes polling into **groups** and **subgroups**:

```yaml
snmp:
  - group: Device Health          # Top-level group
    interval:
      minutes: 1
    dimensions:
      - key: device.address
        value: this:device.address
    metrics:                      # Scalar metrics (device-level)
      - key: my-ext.cpu
        value: oid:1.3.6.1.4.1.9.9.109.1.1.1.1.8.1
        type: gauge
    subgroups:
      - subgroup: Interfaces      # Table metrics (per-interface)
        table: true
        dimensions:
          - key: if.name
            value: oid:1.3.6.1.2.1.31.1.1.1.1
        metrics:
          - key: my-ext.if.in.octets.count
            value: oid:1.3.6.1.2.1.2.2.1.10
            type: count
```

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:600px;" viewbox="0 0 600 140" xmlns="http://www.w3.org/2000/svg">
<text fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" x="300" y="15">Extension Structure</text>
<rect fill="#172554" height="30" rx="6" stroke="#38bdf8" stroke-width="1.5" width="200" x="200" y="25"></rect>
<text fill="#7dd3fc" font-size="10" font-weight="bold" text-anchor="middle" x="300" y="45">Group: Device Health</text>
<line stroke="#475569" x1="250" x2="250" y1="55" y2="75"></line>
<line stroke="#475569" x1="350" x2="350" y1="55" y2="75"></line>
<rect fill="#14532d" height="25" rx="6" stroke="#22c55e" stroke-width="1" width="200" x="150" y="75"></rect>
<text fill="#86efac" font-size="9" text-anchor="middle" x="250" y="92">Scalar metrics (device-level)</text>
<rect fill="#1e293b" height="25" rx="6" stroke="#a78bfa" stroke-width="1" width="200" x="360" y="75"></rect>
<text fill="#c4b5fd" font-size="9" text-anchor="middle" x="460" y="92">Subgroup: Interfaces (table)</text>
<text fill="#64748b" font-size="9" text-anchor="middle" x="250" y="118">cpu, memory, uptime</text>
<text fill="#64748b" font-size="9" text-anchor="middle" x="460" y="118">traffic, errors per interface</text>
</svg>
</div>

:::danger
⚠️ **DED018 — the #1 extension bug:** Never mix table OIDs from different SNMP tables in the same subgroup. Each subgroup = one SNMP table.
:::

## Feature Sets

Feature sets let users choose which metrics to enable. Group your metrics logically:

```yaml
snmp:
  - group: Device Health
    featureSet: health          # Users can enable/disable this
    ...
  - group: Interface Traffic
    featureSet: interfaces      # Separate toggle for interfaces
    ...
```

:::note
🛠 **Try it:** When activating an extension in the Hub, look for the "Feature sets" section — you'll see checkboxes for each feature set you defined.
:::

## Limits

```
Resource                    Limit
──────────────────────────  ─────
Groups per extension        10
Subgroups per group         10
Monitoring configs          100
Extension versions stored   10 (1 active)
```

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children"
