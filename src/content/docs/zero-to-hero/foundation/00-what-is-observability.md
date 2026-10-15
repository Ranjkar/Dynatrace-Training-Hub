---
title: "What is Observability"
course: "From Zero to Hero"
track: "Track 1: Foundation"
moduleNumber: 0
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__00-what-is-observability" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## What is Observability?

Observability is the ability to understand what's happening inside a system by looking at what it produces — metrics, logs, traces, and events. It's the difference between knowing *that* something is broken and knowing *why*.

## The Four Pillars

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 160" xmlns="http://www.w3.org/2000/svg">
<rect fill="#0f172a" height="80" rx="8" stroke="#38bdf8" stroke-width="2" width="180" x="10" y="20"></rect>
<text fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle" x="100" y="50">Metrics</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="100" y="70">CPU 85%, Memory 4GB</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="100" y="85">Numbers over time</text>
<rect fill="#0f172a" height="80" rx="8" stroke="#34d399" stroke-width="2" width="180" x="205" y="20"></rect>
<text fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle" x="295" y="50">Logs</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="295" y="70">ERROR: Connection refused</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="295" y="85">Text records with context</text>
<rect fill="#0f172a" height="80" rx="8" stroke="#c084fc" stroke-width="2" width="180" x="400" y="20"></rect>
<text fill="#c084fc" font-size="13" font-weight="bold" text-anchor="middle" x="490" y="50">Traces</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="490" y="70">Request → Service A → DB</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="490" y="85">Request journey across services</text>
<rect fill="#0f172a" height="80" rx="8" stroke="#fbbf24" stroke-width="2" width="180" x="595" y="20"></rect>
<text fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle" x="685" y="50">Events</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="685" y="70">Deployment, alert, problem</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="685" y="85">Things that happened</text>
<text fill="#475569" font-size="11" text-anchor="middle" x="400" y="140">Together, these four signals give you complete visibility into any system</text>
</svg>
</div>

## Monitoring vs Observability

```
Monitoring                              Observability
──────────────────────────────────────  ──────────────────────────────────────
"Is the server up?"                     "Why is the checkout page slow?"
Predefined checks                      Explore any question
Dashboards you built in advance         Query any data on the fly
Alerts on known thresholds              AI detects unknown anomalies
Separate tools for metrics/logs/traces  One platform, one query language
```

## Why Dynatrace?

Most observability tools require you to instrument code, build dashboards, and manually correlate data. Dynatrace is different:

- **Automatic discovery** — OneAgent finds every host, process, service, and dependency without configuration
- **Smartscape** — a real-time topology map showing how everything connects
- **Davis AI** — automatically detects anomalies and finds root causes across the full stack
- **Grail** — one data lakehouse for metrics, logs, traces, events, and entities
- **DQL** — one query language for everything (no more switching between 9 tools)

## What You'll Learn in This Course

```
Track       What You'll Master                              Modules
──────────  ──────────────────────────────────────────────  ────────
Foundation  Platform architecture, navigation, first data   00-03
Query       DQL for metrics, logs, entities, notebooks      04-08
Monitor     Dashboards, alerting, SLOs, synthetic           09-12
Automate    Workflows, Terraform, IAM, extensions           13-16
Master      Security, business analytics, apps, maturity    17-20
```

:::tip
💡 No prior Dynatrace knowledge required. By the end, you'll be able to monitor any application, write DQL queries, build dashboards, set up alerts, automate workflows, and assess platform maturity — skills that align with the Dynatrace Associate Certification.
:::

:::note
🛠 **Try it:** Open your Dynatrace environment → Ctrl+K → type "Services" → explore the auto-detected services. Click any service to see its response time, failure rate, and throughput — that's observability in action.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":[{"id":"hero-foundation","title":"Track 1: Foundation","description":"Wha
