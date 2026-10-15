---
title: "Grail Tables & Buckets"
course: "DQL Cookbook"
track: "DQL Recipes"
moduleNumber: 9
lessonType: "Reference"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dql-cookbook__09-grail-tables" data-course-slug="dql-cookbook">
<em>Format: Reference &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Grail Tables & Buckets

Grail organizes data in buckets (storage), tables (query targets), and views (filtered perspectives). Understanding this structure is key to writing efficient queries.

## All Grail Tables

```
Table                    DQL Command              What It Contains
───────────────────────  ───────────────────────   ──────────────────────────
logs                     fetch logs                All log records
events                   fetch events              Davis events, custom, synthetic
metrics                  timeseries ...            All metric data points
spans                    fetch spans               Distributed trace spans
bizevents                fetch bizevents           Business events
security.events          fetch security.events     Vulnerability + attack findings
user.events              fetch user.events         RUM user events (New RUM)
user.sessions            fetch user.sessions       RUM sessions (New RUM)
user.replays             fetch user.replays        Session replay data
dt.system.events         fetch dt.system.events    System/self-monitoring events
dt.system.buckets        fetch dt.system.buckets   Bucket metadata
dt.entity.*              fetch dt.entity.host      Entity views (host, service, etc.)
dt.davis.problems        fetch dt.davis.problems   Davis-detected problems
```

## Built-in Buckets

```
Bucket                              Table                  Retention
────────────────────────────────    ─────────────────────  ─────────
default_logs                        logs                   35 days
default_events                      events                 35 days
default_davis_events                events                 462 days
default_security_events             events                 1102 days (3 yr)
default_metrics                     metrics                462 days (15 mo)
default_spans                       spans                  10 days
default_bizevents                   bizevents              35 days
default_securityevents              security.events        372 days (1 yr)
default_securityevents_builtin      security.events        1102 days (3 yr)
default_user_events                 user.events            35 days
default_user_sessions               user.sessions          35 days
```

## Discover Buckets

```dql
// List all buckets with retention
fetch dt.system.buckets
| fields name, dt.system.table, retention_days, records, estimated_uncompressed_bytes
| sort dt.system.table asc
```

## Discover Fields (Schema)

```dql
// Show all fields for a table
describe logs
describe spans
describe dt.entity.host

// Semantic Dictionary — standardized field definitions
fetch dt.semantic_dictionary.models | filter data_object == "logs"
fetch dt.semantic_dictionary.models | filter data_object == "spans"
```

## Custom Buckets

Create custom buckets for different retention periods or access control:

1. Settings → Storage management → + Bucket
2. Set name, table type (logs/events/spans), retention (10 days to 10 years)
3. Route data via OpenPipeline → Storage stage → Bucket assignment
4. Set permissions via IAM policy boundaries on bucket name

## Query Cost Control

```dql
// Default: 1,000 records per query (append | limit N to change)
// Scan limit: controlled by scanLimitGBytes parameter (-1 = unlimited)
// Billing: DQL queries on logs/events consume DDUs based on data scanned

// Filter by bucket to reduce scan cost
fetch logs, from:now()-1h
| filter dt.system.bucket == "default_logs"
| limit 100
```

:::tip
💡 `describe` is your best friend for schema discovery. Run it on any table to see every available field. The Semantic Dictionary (Ctrl+K → "Semantic Dictionary") shows standardized field definitions across all tables.
:::

QUIZ:5

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: What's the default retention for spans?</strong></p>
<ul>
<li>❌ 35 days</li>
<li>✅ 10 days</li>
<li>❌ 462 days</li>
</ul>
<p><strong>Q: How do you discover all available fields for the logs table?</strong></p>
<ul>
<li>❌ fetch logs | fields *</li>
<li>✅ describe logs</li>
<li>❌ show schema logs</li>
</ul>
</details>

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"dql-cookbook","title":"DQL Cookbook","subtitle":"Copy-Paste Recipes for Real-World Scenarios","color":"teal","tracks":[{"id":"dql-recipes","title":"DQL Recipes","description":"Ready-to-u
