---
title: "Grail Architecture Deep Dive"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 0: Understand the Shift"
moduleNumber: 2
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__02-grail-architecture" data-course-slug="migration">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Grail — Where All Data Lives After Migration

After migration, all observability data lives in Grail — Dynatrace's unified data lakehouse. In Gen2, metrics, logs, and traces were in separate stores. In Gen3, **everything goes into Grail** and is queryable with DQL. Understanding Grail is essential before migrating dashboards and alerts.

Grail architecture diagram

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
<!-- Title -->
<text fill="#e2e8f0" font-size="15" font-weight="bold" text-anchor="middle" x="400" y="25">Grail Data Flow</text>
<!-- Ingestion sources -->
<rect fill="#1e293b" height="32" rx="6" stroke="#22c55e" stroke-width="1" width="120" x="20" y="50"></rect>
<text fill="#86efac" font-size="11" text-anchor="middle" x="80" y="71">OneAgent</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#22c55e" stroke-width="1" width="120" x="20" y="92"></rect>
<text fill="#86efac" font-size="11" text-anchor="middle" x="80" y="113">OpenTelemetry</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#22c55e" stroke-width="1" width="120" x="20" y="134"></rect>
<text fill="#86efac" font-size="11" text-anchor="middle" x="80" y="155">APIs (Events, Logs)</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#22c55e" stroke-width="1" width="120" x="20" y="176"></rect>
<text fill="#86efac" font-size="11" text-anchor="middle" x="80" y="197">Cloud Integrations</text>
<!-- Arrows to OpenPipeline -->
<line stroke="#475569" stroke-width="1" x1="140" x2="200" y1="66" y2="140"></line>
<line stroke="#475569" stroke-width="1" x1="140" x2="200" y1="108" y2="140"></line>
<line stroke="#475569" stroke-width="1" x1="140" x2="200" y1="150" y2="140"></line>
<line stroke="#475569" stroke-width="1" x1="140" x2="200" y1="192" y2="140"></line>
<!-- OpenPipeline -->
<rect fill="#172554" height="80" rx="8" stroke="#f59e0b" stroke-width="2" width="160" x="200" y="100"></rect>
<text fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle" x="280" y="130">OpenPipeline</text>
<text fill="#94a3b8" font-size="10" text-anchor="middle" x="280" y="148">Parse · Filter · Route</text>
<text fill="#94a3b8" font-size="10" text-anchor="middle" x="280" y="163">Extract · Transform</text>
<!-- Arrow to Grail -->
<line stroke="#f59e0b" stroke-width="2" x1="360" x2="430" y1="140" y2="140"></line>
<polygon fill="#f59e0b" points="425,135 435,140 425,145"></polygon>
<!-- Grail -->
<rect fill="#0f172a" height="160" rx="12" stroke="#38bdf8" stroke-width="3" width="200" x="430" y="60"></rect>
<text fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle" x="530" y="88">Grail</text>
<!-- Buckets inside Grail -->
<rect fill="#1e3a5f" height="28" rx="4" stroke="#38bdf8" stroke-width="1" width="75" x="450" y="100"></rect>
<text fill="#7dd3fc" font-size="10" text-anchor="middle" x="487" y="119">Metrics</text>
<rect fill="#1e3a5f" height="28" rx="4" stroke="#38bdf8" stroke-width="1" width="75" x="535" y="100"></rect>
<text fill="#7dd3fc" font-size="10" text-anchor="middle" x="572" y="119">Logs</text>
<rect fill="#1e3a5f" height="28" rx="4" stroke="#38bdf8" stroke-width="1" width="75" x="450" y="136"></rect>
<text fill="#7dd3fc" font-size="10" text-anchor="middle" x="487" y="155">Traces</text>
<rect fill="#1e3a5f" height="28" rx="4" stroke="#38bdf8" stroke-width="1" width="75" x="535" y="136"></rect>
<text fill="#7dd3fc" font-size="10" text-anchor="middle" x="572" y="155">Events</text>
<rect fill="#1e3a5f" height="28" rx="4" stroke="#38bdf8" stroke-width="1" width="75" x="450" y="172"></rect>
<text fill="#7dd3fc" font-size="10" text-anchor="middle" x="487" y="191">Entities</text>
<rect fill="#1e3a5f" height="28" rx="4" stroke="#38bdf8" stroke-width="1" width="75" x="535" y="172"></rect>
<text fill="#7dd3fc" font-size="10" text-anchor="middle" x="572" y="191">BizEvents</text>
<!-- Arrow to consumers -->
<line stroke="#38bdf8" stroke-width="2" x1="630" x2="680" y1="140" y2="140"></line>
<polygon fill="#38bdf8" points="675,135 685,140 675,145"></polygon>
<!-- Consumers -->
<rect fill="#1e293b" height="32" rx="6" stroke="#a78bfa" stroke-width="1" width="100" x="685" y="50"></rect>
<text fill="#c4b5fd" font-size="11" text-anchor="middle" x="735" y="71">Dashboards</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#a78bfa" stroke-width="1" width="100" x="685" y="92"></rect>
<text fill="#c4b5fd" font-size="11" text-anchor="middle" x="735" y="113">Notebooks</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#a78bfa" stroke-width="1" width="100" x="685" y="134"></rect>
<text fill="#c4b5fd" font-size="11" text-anchor="middle" x="735" y="155">Workflows</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#a78bfa" stroke-width="1" width="100" x="685" y="176"></rect>
<text fill="#c4b5fd" font-size="11" text-anchor="middle" x="735" y="197">Alerting</text>
<!-- DQL bar at bottom -->
<rect fill="#172554" height="36" rx="6" stroke="#38bdf8" stroke-width="1.5" width="355" x="430" y="240"></rect>
<text fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle" x="607" y="263">DQL — query any data from any consumer</text>
<!-- Labels -->
<text fill="#475569" font-size="10" text-anchor="middle" x="80" y="230">Data Sources</text>
<text fill="#475569" font-size="10" text-anchor="middle" x="280" y="200">Processing</text>
<text fill="#475569" font-size="10" text-anchor="middle" x="530" y="235">Storage</text>
<text fill="#475569" font-size="10" text-anchor="middle" x="735" y="230">Consumers</text>
</svg>
</div>

## Buckets: How Data is Organized

Grail organizes data into **buckets**. Each bucket has its own retention policy and access controls.

```
Bucket                    What's In It              Default Retention
────────────────────────  ────────────────────────  ─────────────────
default_logs              Application & system logs  35 days (configurable 1d–10y)
default_metrics           All metric data            15 months (1-min granularity)
default_events            Davis events, problems     35 days
default_bizevents         Business events            35 days
default_spans             Distributed traces         10 days (configurable 10d–10y)
```

:::tip
💡 You can create **custom buckets** with different retention. Example: a `compliance_logs` bucket with 5-year retention for audit logs, while regular logs keep 35 days.
:::

## OpenPipeline: The Processing Layer

Before data reaches Grail, it passes through **OpenPipeline**. This is where you:

- **Parse** — extract structured fields from raw log lines
- **Filter** — drop noisy or irrelevant data before storage
- **Route** — send data to different buckets based on rules
- **Extract metrics** — create metrics from log patterns
- **Transform** — enrich data with additional fields

:::note
🛠 **Try it:** In your Dynatrace environment, go to **Settings → Log Monitoring → Log processing** (or search "OpenPipeline" in the app launcher). You'll see the default pipeline with its processing stages.
:::

## Retention: Configurable Per Bucket

```
Data Type          Default Retention  Configurable Range
─────────────────  ─────────────────  ──────────────────────────
Logs               35 days            1 day – 10 years (+1 week)
Spans (traces)     10 days            10 days – 10 years (+1 week)
Metrics            15 months          Fixed (1-min granularity)
Events             35 days            Configurable
Business events    35 days            Configurable
Security (builtin) 3 years            Fixed
Security (3rd pty) 1 year             Fixed
```

You configure retention per bucket. This means you can keep security logs for years while keeping debug logs for only a few days — optimizing cost without losing compliance data.

## Access Control at the Data Level

Grail supports fine-grained access control:

```
Level          What It Controls                    Example
─────────────  ──────────────────────────────────  ──────────────────────────
Bucket         Who can query which bucket           Team A → only compliance_logs
Table          Who can query which data type        Devs → logs + traces, not billing
Record         Filter rows by attribute             Only see data where team == "yours"
Field          Mask or hide specific columns        Hide PII fields from non-admins
```

:::danger
⚠️ This is a major upgrade from Gen2 management zones, which could only filter by entity. Grail permissions filter by **data attributes** — much more powerful.
:::

## Key Takeaways

- Grail = one store for all observability data (metrics, logs, traces, events, entities)
- OpenPipeline = processing layer between ingestion and storage
- Buckets = data containers with per-bucket retention and access control
- DQL = the single query language that works across all data in Grail

## Under the Hood: Why Grail is Different

### Schema-on-Read (No Upfront Schema)

Traditional data warehouses require you to define schemas before storing data. Grail uses **schema-on-read** — data is stored as-is, and you define the structure when you query it. This means:

- No schema migrations when data formats change
- No data loss from schema mismatches
- Full flexibility to explore any data at any time

### Datawarping (Patented Technology)

Datawarping is Dynatrace's patented storage and retrieval technology. Instead of building indexes to find data (which consume 90-99% overhead), Datawarping inverts the problem — it identifies where data is **not** stored, which is 250x faster than traditional indexing. This eliminates:

- Manual index management
- Hot/cold storage tiers and rehydration
- The trade-off between query speed and storage cost

### Massively Parallel Processing (MPP)

Every DQL query is automatically split across thousands of parallel nodes. Each node processes its data segment independently, then results are merged. This means:

- Query performance scales linearly with data volume
- No single point of failure (fault-tolerant by design)
- Data never leaves the environment scope (security isolation)

:::tip
💡 Grail combines the cost efficiency of a data lake with the query performance of a data warehouse — without indexes, without manual tiering, without schema management. That's why it's called a "data lakehouse".
:::

## Built-in Security Buckets

```
Bucket                              What's In It                  Retention
──────────────────────────────────  ────────────────────────────  ─────────
default_securityevents_builtin      Dynatrace-generated security  3 years
default_securityevents              Third-party security events   1 year
```

:::tip
💡 Discover all buckets: `fetch dt.system.buckets | fields name, table, retentionDays`
:::

## Custom Buckets

Create custom buckets for different retention or compliance needs:

- **Compliance bucket** — 7 years retention for audit logs
- **Short-term bucket** — 7 days for debug logs (save cost)
- **Team bucket** — separate storage per team with Grail permissions

Route data to custom buckets using **OpenPipeline** — Dynatrace's data processing engine that handles ingestion, transformation, and routing at scale.

## 🔧 Migration Step: Plan Your Data Retention

Before migrating, map your current retention to Grail buckets:

```
Step  Action                                  Command / UI
────  ──────────────────────────────────────  ──────────────────────────────────
1     Check current retention settings         Settings → Data privacy → Retention
2     Identify compliance requirements         Which data needs 1yr+ retention?
3     Plan custom buckets                      compliance_logs (5yr), debug_logs (7d)
4     Create buckets in Grail                  Settings → Grail → Buckets → + Bucket
5     Set up OpenPipeline routing              Settings → Log Monitoring → OpenPipeline
6     Verify data flows to correct buckets     fetch dt.system.buckets | fields name, retentionDays
```

:::tip
💡 **Cost optimization:** In Gen2, all logs had the same retention. In Gen3, you can route debug logs to a 7-day bucket and audit logs to a 5-year bucket. This alone can reduce storage costs by 30-50%.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"12%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🎯"," ","Phase 0: Understand the Shift"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",2]}],["$","span",null,{"className":"ml-auto text-xs text-gray-600","children":[5," min read · ",3,
