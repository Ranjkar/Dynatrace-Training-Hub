---
title: "Grail Buckets & Data Partitioning"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 1: Set Up Access & Data Architecture"
moduleNumber: 8
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__17c-grail-buckets" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Grail Buckets & Data Partitioning

In Gen2, all data had the same retention. In Gen3, **Grail buckets** let you store different data for different durations, route data to different storage locations, and control query costs. This is the "data partitioning" leg of the MZ replacement triangle.

## What Are Buckets?

```
Gen2                                    Gen3
──────────────────────────────────────  ──────────────────────────────────────
All logs: same retention (35 days)      Each bucket: independent retention
All data in one "pool"                  Route data to specific buckets
No cost control per team                Query costs trackable per bucket
No compliance separation                Compliance data in dedicated bucket
```

A bucket is a logical storage unit with:

- **Independent retention** — 1 day to 10 years
- **Independent access** — ABAC policies can scope to specific buckets
- **Independent routing** — OpenPipeline routes data to buckets based on conditions
- **Query cost tracking** — know which bucket costs how much to query

## Default Buckets

```
Bucket               Table    Default Retention  Notes
───────────────────  ───────  ─────────────────  ──────────────────────────
default_logs         logs     35 days            All logs go here by default
default_events       events   35 days            Davis events, custom events
default_bizevents    bizevents 35 days           Business events
default_spans        spans    10 days            Distributed traces
dt_system_events     system   1 year             Audit, billing (fixed)
```

## Designing Your Bucket Strategy

```
Bucket Name              Retention  Purpose                     Who Queries It
───────────────────────  ─────────  ──────────────────────────  ──────────────────
hot_troubleshooting      7 days     Active incident response     Ops teams (high frequency)
standard_operations      35 days    Day-to-day monitoring        All teams
analytics_reporting      90 days    Monthly/quarterly reports    Managers, BI
security_compliance      365 days   Audit trail, compliance      Security team, auditors
debug_verbose            3 days     Debug logs (high volume)     Developers (rarely)
```

### Design Rules

- Keep frequently-queried buckets around 2-3 TB daily retained volume
- Use `default_logs` as playground — don't put production workloads there
- Route high-volume debug logs to short-retention or "no storage" (drop)
- Compliance data in dedicated bucket with long retention + restricted access
- Max ~80 buckets per environment (supports ~5 TB/day per table)

## Routing Data to Buckets (OpenPipeline)

OpenPipeline routing rules decide which bucket receives each record:

```
// Route by severity
Route 1: loglevel == "ERROR" OR loglevel == "WARN" → hot_troubleshooting (7d)
Route 2: loglevel == "INFO" → standard_operations (35d)
Route 3: loglevel == "DEBUG" → debug_verbose (3d) OR no_storage (drop)

// Route by team (using K8s namespace)
Route 1: k8s.namespace.name == "payments" → payments_bucket (35d)
Route 2: k8s.namespace.name == "platform" → platform_bucket (35d)
Default: → default_logs (35d)

// Route by compliance requirement
Route 1: matchesPhrase(content, "audit") → security_compliance (365d)
Route 2: matchesPhrase(content, "transaction") → compliance_bucket (365d)
Default: → standard_operations (35d)
```

:::danger
⚠️ Routing is evaluated BEFORE processing. Fields added during processing (like enriched attributes) CANNOT be used in routing conditions. Plan your routing based on fields that exist at ingest time.
:::

## Terraform: Create Buckets

```hcl
# Note: bucket creation is via Settings API or UI
# Terraform resource for OpenPipeline routing:
resource "dynatrace_openpipeline_v2_logs_pipelines" "routing" {
  name    = "Team-Based Log Routing"
  enabled = true

  routing {
    match_condition = "k8s.namespace.name == \"payments\""
    pipeline_id     = "payments_pipeline"
  }

  pipeline {
    id      = "payments_pipeline"
    enabled = true
    storage_stage {
      bucket_assignment = "payments_logs"
    }
  }
}
```

## Querying Specific Buckets

```dql
// Query all logs (across all buckets)
fetch logs, from:now()-1h

// Query specific bucket only (faster, cheaper)
fetch logs, from:now()-1h
| filter dt.system.bucket == "hot_troubleshooting"

// See which buckets have data
fetch dt.system.buckets
| filter table == "logs"
| fields bucket_name, record_count, size_bytes
```

## Bucket Access Control

Combine buckets with ABAC for team-level data isolation:

```
// Policy: team can only query their bucket
ALLOW storage:logs:read
WHERE storage:bucket == "payments_logs"

// Or combine with security context:
ALLOW storage:logs:read
WHERE storage:dt.security_context MATCH ("SV-PAYMENTS")
  AND storage:bucket == "payments_logs"
```

## Cost Optimization with Buckets

```
Strategy                              Savings
──────────────────────────────────── ──────────────────────────────────────
Route debug logs to 3-day bucket      ~80% less retention cost for debug data
Drop verbose health checks            100% savings (no_storage)
Short retention for hot troubleshoot  ~80% less than 35-day default
Dedicated compliance bucket           Only pay for long retention where needed
```

### "Retain with Included Queries" Model

Buckets have two retention tiers:

- **Included Queries retention** (10-35 days): included query volume = retained_GiB × 15/day
- **Overall retention** (up to 10 years): usage-based query billing beyond included

Architect predictable dashboard costs for recent data; push older retention to usage-based.

## Migration: From "One Pool" to Buckets

```
Step  Action                                  Result
────  ──────────────────────────────────────  ──────────────────────────────────
1     Analyze current log volume by source     Know what you're routing
2     Identify retention requirements           Compliance vs operational vs debug
3     Create buckets (UI or API)                Storage containers ready
4     Configure OpenPipeline routing rules      Data flows to correct buckets
5     Verify with DQL                           Check dt.system.bucket field
6     Update ABAC policies if needed            Scope access to specific buckets
7     Monitor costs per bucket                  Validate savings
```

<details>
<summary>📝 Knowledge Check</summary>
<div class="quiz">
<p><strong>Q: Can you change a bucket's retention after creation?</strong></p>
<p>A: Yes, but shortening retention triggers deletion of data beyond the new period — this can take DAYS to complete. Lengthening retention is instant.</p>
<p><strong>Q: If you query <code>fetch logs</code> without a bucket filter, what happens?</strong></p>
<p>A: It queries ALL log buckets. This is by design — tables abstract across buckets. Add <code>| filter dt.system.bucket == "my_bucket"</code> to scope to a specific bucket (faster and cheaper).</p>
<p><strong>Q: A customer wants 365-day retention for audit logs but 7-day for debug logs. How?</strong></p>
<p>A: Create two buckets: <code>security_compliance</code> (365d) and <code>debug_verbose</code> (7d). Configure OpenPipeline routing: match audit-related logs → compliance bucket, match debug logs → debug bucket. Default → standard 35-day bucket.</p>
</div>
</details>

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"36%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🔐"," ","Phase 1: Set Up Access & Data Architecture"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",8]}],["$","span",null,{"className":"ml-auto text-xs text-gray-600","children":[4," min read ·
