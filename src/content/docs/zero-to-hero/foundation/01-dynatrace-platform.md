---
title: "The Dynatrace Platform"
course: "From Zero to Hero"
track: "Track 1: Foundation"
moduleNumber: 1
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__01-dynatrace-platform" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## The Dynatrace Platform

Dynatrace is a unified observability platform. Instead of separate tools for metrics, logs, traces, and security, everything lives in one place — connected by a real-time topology map and powered by AI.

## Architecture

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
<text fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle" x="400" y="20">Dynatrace Platform Architecture</text>
<rect fill="#0f172a" height="100" rx="8" stroke="#f87171" stroke-width="2" width="220" x="20" y="40"></rect>
<text fill="#f87171" font-size="12" font-weight="bold" text-anchor="middle" x="130" y="65">Your Infrastructure</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="130" y="85">Hosts, containers, K8s</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="130" y="100">Services, applications</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="130" y="115">Databases, cloud services</text>
<rect fill="#1e293b" height="25" rx="4" stroke="#fbbf24" stroke-width="1" width="180" x="40" y="120"></rect>
<text fill="#fbbf24" font-size="10" text-anchor="middle" x="130" y="137">OneAgent (auto-instruments)</text>
<text fill="#475569" font-size="18" x="260" y="90">→</text>
<rect fill="#0f172a" height="100" rx="8" stroke="#38bdf8" stroke-width="2" width="240" x="280" y="40"></rect>
<text fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle" x="400" y="65">Grail Data Lakehouse</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="400" y="85">Metrics · Logs · Traces · Events</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="400" y="100">Entities · Business Events</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="400" y="115">Schema-on-read · No indexes needed</text>
<text fill="#475569" font-size="18" x="540" y="90">→</text>
<rect fill="#0f172a" height="100" rx="8" stroke="#34d399" stroke-width="2" width="220" x="560" y="40"></rect>
<text fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle" x="670" y="65">Intelligence &amp; Apps</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="670" y="85">Davis AI (root cause)</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="670" y="100">Dashboards · Notebooks</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="670" y="115">Workflows · AppEngine</text>
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="1" width="500" x="150" y="170"></rect>
<text fill="#7dd3fc" font-size="13" font-weight="bold" text-anchor="middle" x="400" y="195">DQL — Dynatrace Query Language (one language for everything)</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#c084fc" stroke-width="1" width="500" x="150" y="220"></rect>
<text fill="#c084fc" font-size="13" font-weight="bold" text-anchor="middle" x="400" y="245">Smartscape — Real-time topology map of all entities</text>
</svg>
</div>

## Key Components

```
Component       What It Does                                    Key Fact
──────────────  ──────────────────────────────────────────────  ──────────────────────────
OneAgent        Installed on hosts, auto-discovers everything   One agent per host, zero config
Grail           Stores ALL data (metrics, logs, traces, etc.)   Data lakehouse, schema-on-read
Smartscape      Real-time topology map of all entities          Auto-discovers relationships
Davis AI        Detects anomalies, finds root causes            Correlates across full stack
DQL             Query language for all data in Grail            One language replaces 9 tools
Workflows       Automation engine (alerts → actions)            Replaces manual runbooks
AppEngine       Build custom apps on the platform               React + TypeScript + Strato
OpenPipeline    Processes data on ingestion (parse, route)      Masking, enrichment, routing
```

## OneAgent — The Foundation

OneAgent is a single binary installed on each host. It automatically:

- Discovers all processes, services, and dependencies
- Instruments application code (Java, .NET, Node.js, Go, Python, PHP)
- Captures distributed traces (PurePath) across service calls
- Collects host metrics (CPU, memory, disk, network)
- Injects RUM JavaScript for browser monitoring
- Feeds everything into Grail via the Smartscape topology

## Davis AI — The Brain

Davis AI continuously analyzes all data and automatically:

- **Detects anomalies** — baseline deviations, not just static thresholds
- **Correlates events** — groups related issues into a single problem
- **Finds root cause** — traces the impact chain from user to infrastructure
- **Davis CoPilot** — natural language to DQL ("show me slow services")

:::tip
💡 Davis AI is what makes Dynatrace different from log aggregators and metric tools. Instead of hundreds of unrelated alerts, Davis gives you ONE problem with the root cause already identified.
:::

## Smartscape — The Map

Smartscape is a real-time topology map showing every entity and relationship:

```
Application → Service → Process → Host → Data Center
     ↓            ↓          ↓        ↓
  User actions  Endpoints  Libraries  Containers
     ↓            ↓          ↓        ↓
  Sessions     Databases   Threads   Network
```

When Davis detects a problem, it uses Smartscape to trace the impact — from a slow database query all the way up to affected users.

:::note
🛠 **Try it:** Open Ctrl+K (the Dynatrace launcher) and just browse. Type "host", "logs", "dashboard", "workflow" — notice how every capability is one search away. Try the Smartscape app to see your full topology as an interactive dependency graph.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":
