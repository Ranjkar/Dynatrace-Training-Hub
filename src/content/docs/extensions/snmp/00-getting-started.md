---
title: "Getting Started"
course: "Dynatrace Extensions"
track: "SNMP Extensions"
moduleNumber: 0
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__00-getting-started" data-course-slug="extensions">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## What Are Extensions?

Dynatrace Extensions 2.0 let you monitor anything Dynatrace doesn't cover out of the box — network switches, firewalls, UPS devices, custom APIs. There are **216 extensions** in the Hub across 7 data sources:

```
Data Source   Count  How It Works                              Coding?
──────────── ─────  ──────────────────────────────────────────  ──────────
SNMP          19    Declarative YAML, OID polling               No
Python        33+   Python SDK, REST API calls                  Yes
JMX           12    Declarative YAML, MBean attributes          No
SQL           14    Declarative YAML, SQL queries                No
Prometheus    12    Declarative YAML, scrape /metrics            No
WMI            1    Declarative YAML, WMI queries (Windows)     No
StatsD         1    Declarative YAML, StatsD receiver            No
```

This course covers **SNMP** (modules 0-8) and **Python** (modules 9-12). Both share the same extension.yaml structure for metrics, topology, and screens — only the data source section differs.

## How It Works

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 120" xmlns="http://www.w3.org/2000/svg">
<rect fill="#172554" height="45" rx="8" stroke="#38bdf8" stroke-width="1.5" width="120" x="10" y="40"></rect>
<text fill="#7dd3fc" font-size="10" font-weight="bold" text-anchor="middle" x="70" y="57">extension.yaml</text>
<text fill="#475569" font-size="9" text-anchor="middle" x="70" y="72">Your code</text>
<text fill="#475569" font-size="14" x="140" y="67">→</text>
<rect fill="#1e293b" height="45" rx="8" stroke="#a78bfa" stroke-width="1.5" width="120" x="155" y="40"></rect>
<text fill="#c4b5fd" font-size="10" font-weight="bold" text-anchor="middle" x="215" y="57">Upload + Sign</text>
<text fill="#475569" font-size="9" text-anchor="middle" x="215" y="72">ZIP package</text>
<text fill="#475569" font-size="14" x="285" y="67">→</text>
<rect fill="#14532d" height="45" rx="8" stroke="#22c55e" stroke-width="1.5" width="120" x="300" y="40"></rect>
<text fill="#86efac" font-size="10" font-weight="bold" text-anchor="middle" x="360" y="57">EEC</text>
<text fill="#475569" font-size="9" text-anchor="middle" x="360" y="72">On ActiveGate</text>
<text fill="#475569" font-size="14" x="430" y="67">→</text>
<rect fill="#7f1d1d" height="45" rx="8" stroke="#f87171" stroke-width="1.5" width="120" x="445" y="40"></rect>
<text fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle" x="505" y="57">SNMP Device</text>
<text fill="#475569" font-size="9" text-anchor="middle" x="505" y="72">OID polling</text>
<text fill="#475569" font-size="14" x="575" y="67">→</text>
<rect fill="#172554" height="45" rx="8" stroke="#38bdf8" stroke-width="1.5" width="120" x="590" y="40"></rect>
<text fill="#7dd3fc" font-size="10" font-weight="bold" text-anchor="middle" x="650" y="57">Dynatrace</text>
<text fill="#475569" font-size="9" text-anchor="middle" x="650" y="72">Metrics + Entities</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="360" y="105">The EEC (Extension Execution Controller) runs on ActiveGate, reads your YAML, polls devices on schedule</text>
</svg>
</div>

## The Extension File

Every extension starts with `extension.yaml`. Here's the minimum:

```yaml
name: custom:com.dynatrace.extension.my-device
version: 0.0.1
minDynatraceVersion: "1.318.0"
author:
  name: Your Name
```

:::danger
⚠️ Custom extension names MUST start with `custom:`. Official Dynatrace extensions don't have this prefix.
:::

## What's in the Package?

```
bundle.zip (what you upload)
├── extension.zip
│   ├── extension.yaml    ← your code
│   ├── snmp/             ← MIB files (if needed)
│   └── dashboards/       ← dashboard JSON (up to 10)
└── extension.zip.sig     ← digital signature (required!)
```

:::note
🛠 **Try it:** Open Dynatrace Hub → search "SNMP" → browse the 20+ SNMP extensions available. Click one to see its metrics, topology, and dashboards.
:::

## Adding SNMP Polling

To actually collect data, add an `snmp:` section:

```yaml
snmp:
  - group: Device Default
    interval:
      minutes: 1
    dimensions:
      - key: device.address
        value: this:device.address
```

This polls every 1 minute and captures the device IP. No metrics yet — we'll add those next.

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extensions","title":"Dynatrace Extensions","subtitle":"Build Extensions 2.0 From Scratch","color
