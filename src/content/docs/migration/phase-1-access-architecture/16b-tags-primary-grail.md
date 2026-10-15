---
title: "Tags in Gen3: Primary Fields, Primary Tags & Security Context"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 1: Set Up Access & Data Architecture"
moduleNumber: 5
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__16b-tags-primary-grail" data-course-slug="migration">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Tags in Gen3: Primary Grail Fields, Primary Tags & Security Context

In Gen2, tags were simple: key-value pairs on entities used for filtering and management zones. In Gen3, the tagging system has been completely redesigned into a layered architecture. This module untangles the confusion between classic tags, primary Grail fields, primary Grail tags, and the "magic three" (dt.security_context, dt.cost.costcenter, dt.cost.product).

## The Gen2 Tag Model (What You're Used To)

```
Gen2 Tags:
  - Live on ENTITIES (hosts, services, process groups)
  - Set via: auto-tagging rules, API, oneagentctl --set-host-tag
  - Used for: management zone rules, filtering, dashboards
  - Scope: entity metadata only (not on raw telemetry records)
  - Format: key:value or just key

Example:
  Host "web-01" has tags: [env:production, team:payments, app:checkout]
  → Management zone rule: "Include hosts where tag = env:production"
  → Dashboard filter: "Show only entities with tag team:payments"
```

## The Gen3 Tag Model (Three Layers)

Gen3 splits the concept of "tags" into three distinct mechanisms, each with different propagation, scope, and use cases:

```
Layer                    What It Is                          Propagates To
───────────────────────  ──────────────────────────────────  ──────────────────────────────
1. Primary Grail Fields  Built-in platform attributes         ALL telemetry (auto-detected)
2. Primary Grail Tags    Customer-defined enrichment tags     ALL telemetry (you set them)
3. Classic Entity Tags   Legacy key:value on entities         Entity metadata only
```

:::tip
💡 The key difference: in Gen2, tags lived on entities. In Gen3, **Primary Grail Fields and Tags live on the telemetry data itself** (every log line, every metric point, every span). This is what makes ABAC, routing, and segmentation possible.
:::

## Layer 1: Primary Grail Fields (Platform-Managed)

These are **automatically detected** by Dynatrace and present on all telemetry. You don't set most of them — they come from the deployment context:

```
Field                   Source                    Use In Policies?  Example
──────────────────────  ────────────────────────  ────────────────  ──────────────────
dt.host_group.id        OneAgent host group       YES (permission)  "payments-prod"
k8s.cluster.name        K8s Operator              YES (permission)  "prod-east"
k8s.namespace.name      K8s Operator              YES (permission)  "team-payments"
aws.account.id          Cloud integration         YES (permission)  "123456789012"
azure.subscription      Cloud integration         YES (permission)  "27e9b03f-..."
azure.resource.group    Cloud integration         YES (permission)  "demo-backend-rg"
gcp.project.id          Cloud integration         YES (permission)  "my-gcp-project"
aws.region              Cloud integration         No                "us-east-1"
azure.location          Cloud integration         No                "westeurope"
gcp.region              Cloud integration         No                "europe-west3"
```

The ones marked "permission" can be used directly in ABAC policy boundaries — **no extra enrichment needed**.

:::note
🛠 **This is the simplest path:** If your team isolation maps to host groups, K8s namespaces, or cloud accounts, just use these fields directly in boundaries. No tagging, no enrichment, no extra setup.
:::

### The "Magic Three" — User-Settable Primary Grail Fields

Three primary Grail fields are special because **you set them yourself**:

```
Field                   Purpose                   Set Via
──────────────────────  ────────────────────────  ──────────────────────────────────────
dt.security_context     Data access control        oneagentctl --set-host-property
                        (ABAC policy boundaries)   K8s metadata enrichment
                                                   OpenPipeline Security Context processor

dt.cost.costcenter      Cost allocation by         oneagentctl --set-host-property
                        cost center (DPS billing)  K8s metadata enrichment

dt.cost.product         Cost allocation by         oneagentctl --set-host-property
                        product/service            K8s metadata enrichment
```

:::danger
⚠️ These three are PRIMARY GRAIL FIELDS — they propagate to ALL telemetry (metrics, logs, spans, events, entities). They are NOT regular tags. They have special platform behavior: they drive IAM boundaries, cost allocation, and entity security context. No other field has this power.
:::

## Layer 2: Primary Grail Tags (Customer-Defined)

Primary Grail tags are **your custom metadata** that propagates to all telemetry. They use the reserved `primary_tags.` prefix:

```bash
# Set primary Grail tags via oneagentctl (OneAgent 1.333+)
oneagentctl --set-host-tag=primary_tags.team=payments
oneagentctl --set-host-tag=primary_tags.environment=production
oneagentctl --set-host-tag=primary_tags.application=checkout
oneagentctl --set-host-tag=primary_tags.business_unit=ecommerce
oneagentctl --set-host-tag=primary_tags.region=EMEA
oneagentctl --set-host-tag=primary_tags.cmdbid=CI0001234

# Or at install time:
sudo /bin/sh Dynatrace-OneAgent-Linux.sh \
  --set-host-tag=primary_tags.team=payments \
  --set-host-tag=primary_tags.environment=production \
  --set-host-tag=primary_tags.application=checkout

# Or at process level via environment variable:
export DT_TAGS="primary_tags.team=payments,primary_tags.environment=production"
```

### What Primary Tags Give You

```
Capability              How Primary Tags Help
──────────────────────  ──────────────────────────────────────────────────────
OpenPipeline routing    Route logs to buckets: primary_tags.team == "payments" → payments_bucket
Bucket assignment       Assign retention based on primary_tags.environment
Segments                Filter dashboards: primary_tags.application == "checkout"
Alerting                Scope alerts: primary_tags.team == "payments"
Cost tracking           Group costs by primary_tags.business_unit
Filtering               Query: fetch logs | filter primary_tags.team == "payments"
```

### Primary Tags vs Primary Fields — The Key Difference

```
Aspect                  Primary Grail Fields              Primary Grail Tags
──────────────────────  ──────────────────────────────── ──────────────────────────────────
Prefix                  None (dt.security_context, etc.)  primary_tags.* (required prefix)
Who defines them        Dynatrace (semantic dictionary)   You (any key you want)
Use in IAM policies     YES (permission-tagged ones)      NOT directly in policies (yet)
Use in boundaries       YES                               NOT directly in boundaries (yet)
Use in segments         YES                               YES
Use in routing          YES                               YES
Use in alerting         YES                               YES
Propagation             ALL telemetry                     ALL telemetry
Set via                 --set-host-property               --set-host-tag=primary_tags.*
Limit                   Fixed set (3 user-settable)       Up to 20 per host/process
```

:::danger
⚠️ **Critical distinction:** Primary Grail TAGS (primary_tags.*) cannot currently be used in IAM policy boundaries. Only Primary Grail FIELDS (dt.security_context, dt.host_group.id, k8s.namespace.name, etc.) can be used for access control. Use primary tags for routing, segmentation, and filtering — use primary fields for security.
:::

## Layer 3: Classic Entity Tags (Legacy)

Classic tags still exist but they're entity metadata only — they do NOT propagate to telemetry records in Grail:

```bash
# Classic tags (entity metadata only — NOT on telemetry)
oneagentctl --set-host-tag=env=production        # ← classic tag
oneagentctl --set-host-tag=team=payments          # ← classic tag

# vs Primary tags (ON all telemetry)
oneagentctl --set-host-tag=primary_tags.env=production    # ← primary tag
oneagentctl --set-host-tag=primary_tags.team=payments     # ← primary tag
```

```
Classic Tags                            Primary Tags
──────────────────────────────────────  ──────────────────────────────────────
Live on entity metadata only            Live on every telemetry record
Queryable via: dt.entity.host.tags      Queryable via: primary_tags.team
Used for: entity filtering, MZ rules    Used for: routing, segments, filtering
NOT on logs, metrics, spans             ON logs, metrics, spans, events
Set via: --set-host-tag=key=value       Set via: --set-host-tag=primary_tags.key=value
No prefix required                      MUST have primary_tags. prefix
```

:::tip
💡 If you're migrating from Gen2 and used tags heavily for filtering, you want **Primary Grail Tags**. They give you the same filtering capability but across ALL data, not just entities. Add the `primary_tags.` prefix to your existing tag keys.
:::

## The Complete Picture: How to Set Everything

```bash
# FULL OneAgent setup with all three layers:

# 1. Primary Grail Fields (for IAM/ABAC and cost allocation)
oneagentctl --set-host-property=dt.security_context=SV-PAYMENTS.PRD
oneagentctl --set-host-property=dt.cost.costcenter=CC-1234
oneagentctl --set-host-property=dt.cost.product=payment-gateway

# 2. Primary Grail Tags (for routing, segments, filtering)
oneagentctl --set-host-tag=primary_tags.team=payments
oneagentctl --set-host-tag=primary_tags.environment=production
oneagentctl --set-host-tag=primary_tags.application=checkout
oneagentctl --set-host-tag=primary_tags.business_unit=ecommerce

# 3. Classic tags (for legacy compatibility, entity filtering)
oneagentctl --set-host-tag=env=production
oneagentctl --set-host-tag=team=payments
```

### At Install Time (Recommended)

```bash
sudo /bin/sh Dynatrace-OneAgent-Linux.sh \
  --set-host-group=payments-prod \
  --set-host-property=dt.security_context=SV-PAYMENTS.PRD \
  --set-host-property=dt.cost.costcenter=CC-1234 \
  --set-host-property=dt.cost.product=payment-gateway \
  --set-host-tag=primary_tags.team=payments \
  --set-host-tag=primary_tags.environment=production \
  --set-host-tag=primary_tags.application=checkout
```

## Querying Each Layer in DQL

```dql
// Query Primary Grail Fields
fetch logs, from:now()-1h
| filter dt.security_context == "SV-PAYMENTS.PRD"
| fields timestamp, content, dt.security_context, dt.cost.costcenter

// Query Primary Grail Tags
fetch logs, from:now()-1h
| filter primary_tags.team == "payments"
| fields timestamp, content, primary_tags.team, primary_tags.environment

// Query auto-detected Primary Fields
fetch logs, from:now()-1h
| filter dt.host_group.id == "payments-prod"
| fields timestamp, content, dt.host_group.id, k8s.namespace.name

// Query Classic Entity Tags (entity metadata only)
fetch dt.entity.host
| filter matchesValue(tags, "env:production")
| fields entity.name, tags
```

## Migration Guide: Gen2 Tags → Gen3

```
Gen2 Tag Usage                          Gen3 Equivalent
──────────────────────────────────────  ──────────────────────────────────────────────
Tags for MZ rules (access control)      dt.security_context (Primary Grail Field)
Tags for dashboard filtering            primary_tags.* (Primary Grail Tags) + Segments
Tags for cost allocation                dt.cost.costcenter / dt.cost.product (Fields)
Tags for alerting scope                 primary_tags.* in alert queries
Tags for entity identification          Classic tags (still work for entities)
Auto-tagging rules                      No direct equivalent — set tags at the source
                                        (oneagentctl, K8s labels, or OpenPipeline)
```

### Step-by-Step Migration

```
Step  Action                                  Example
────  ──────────────────────────────────────  ──────────────────────────────────────
1     Identify tags used for access control    env:production, team:payments
      → Convert to dt.security_context         --set-host-property=dt.security_context=SV-PAY.PRD

2     Identify tags used for filtering         app:checkout, region:EMEA
      → Convert to primary_tags.*              --set-host-tag=primary_tags.app=checkout

3     Identify tags used for cost              costcenter:CC-1234
      → Convert to dt.cost.*                   --set-host-property=dt.cost.costcenter=CC-1234

4     Keep classic tags for compatibility      --set-host-tag=env=production (optional)

5     Create Segments using primary_tags       Segment: primary_tags.team == "payments"

6     Create ABAC boundaries using fields      Boundary: storage:dt.security_context MATCH ("SV-PAY")
```

## Kubernetes: Labels → Primary Tags

For K8s, the enrichment rules map namespace labels to either primary fields OR primary tags:

```hcl
# Terraform: map K8s labels to Dynatrace attributes
resource "dynatrace_kubernetes_enrichment" "enrichment" {
  scope = "environment"
  rules {
    # Map to Primary Grail Field (for IAM/ABAC)
    rule {
      type   = "ANNOTATION"
      source = "security-context"
      target = "dt.security_context"
    }
    # Map to Primary Grail Field (for cost)
    rule {
      type   = "LABEL"
      source = "cost-center"
      target = "dt.cost.costcenter"
    }
    # Map to Primary Grail Tag (for routing/filtering)
    rule {
      type             = "LABEL"
      source           = "team"
      primary_grail_tag = true   # ← becomes primary_tags.team
    }
    # Map to Primary Grail Tag (custom target)
    rule {
      type             = "LABEL"
      source           = "app-name"
      primary_grail_tag = true   # ← becomes primary_tags.app-name
    }
  }
}
```

:::note
🛠 When `primary_grail_tag = true`, the label key becomes the tag name: label `team=payments` → `primary_tags.team=payments` on all telemetry from that namespace.
:::

## Limits

```
Limit                                   Value
──────────────────────────────────────  ──────
Primary tags per host/process           20 (excess silently dropped)
Primary fields (user-settable)          3 (dt.security_context, dt.cost.costcenter, dt.cost.product)
K8s enrichment rules                    5 per configuration scope (max 20 total)
Process-level DT_TAGS                   Overrides host-level for same key
Enrichment propagation delay (K8s)      Up to 45 minutes after rule change
```

## Decision Framework: Which Mechanism to Use

```
Need                                    Use This
──────────────────────────────────────  ──────────────────────────────────────────────
Control who sees what data (ABAC)       dt.security_context (Primary Grail Field)
Track costs per team                    dt.cost.costcenter (Primary Grail Field)
Track costs per product                 dt.cost.product (Primary Grail Field)
Route logs to different buckets         primary_tags.* OR dt.host_group.id
Filter dashboards by team               primary_tags.team + Segment
Filter dashboards by environment        primary_tags.environment + Segment
Scope alerts to a team                  primary_tags.team in DQL query
Entity-level filtering (legacy)         Classic tags (matchesValue in DQL)
Simple isolation by deployment          dt.host_group.id or k8s.namespace.name (auto)
```

<details>
<summary>📝 Knowledge Check</summary>
<div class="quiz">
<p><strong>Q: A customer sets <code>--set-host-tag=team=payments</code> (without primary_tags prefix). Can they use this in an ABAC boundary?</strong></p>
<p>A: No. Classic tags (without <code>primary_tags.</code> prefix) live on entity metadata only — they don't appear on telemetry records in Grail. They can't be used in ABAC boundaries. The customer needs either <code>dt.security_context</code> (for access control) or <code>primary_tags.team</code> (for filtering/routing).</p>
<p><strong>Q: What's the difference between <code>dt.security_context</code> and <code>primary_tags.team</code> if both propagate to all telemetry?</strong></p>
<p>A: <code>dt.security_context</code> is a Primary Grail FIELD — it can be used in IAM policy boundaries for access control. <code>primary_tags.team</code> is a Primary Grail TAG — it can be used for routing, segments, and filtering, but NOT in IAM boundaries. Use security_context for "who can see what", use primary_tags for "how to organize and filter."</p>
<p><strong>Q: Can you use <code>primary_tags.team</code> in a policy boundary instead of <code>dt.security_context</code>?</strong></p>
<p>A: No. Only attributes listed in the IAM permission model (Primary Grail Fields tagged with "permission") can be used in boundaries. Primary tags are not in that list. You must use dt.security_context, dt.host_group.id, k8s.namespace.name, or cloud account fields.</p>
<p><strong>Q: A customer has 50 auto-tagging rules in Gen2. What's the Gen3 equivalent?</strong></p>
<p>A: It depends on what the rules do. If they tag for access control → set <code>dt.security_context</code> via host properties or K8s enrichment. If they tag for filtering → set <code>primary_tags.*</code> via host tags or K8s enrichment. If they tag for entity identification → keep classic tags (they still work). Most customers need a combination of all three.</p>
<p><strong>Q: How many primary tags can you set per host?</strong></p>
<p>A: 20 maximum. If you exceed 20, OneAgent silently drops the excess (no warning). Process-level tags (DT_TAGS) override host-level tags for the same key and count toward the same limit.</p>
<p><strong>Q: Do primary tags work on K8s metrics and K8s events?</strong></p>
<p>A: Only if set via the settings-based enrichment rules (namespace labels → primary_tags). Manually added pod annotations (anything other than dt.security_context, dt.cost.costcenter, dt.cost.product) do NOT enrich K8s metrics or K8s events.</p>
</div>
</details>

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"24%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🔐"," ","Phase 1: Set Up Access & Data Architecture"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",5]}],["$","span",null,{"className":"ml-auto text-xs text-gray-600","children":[9," min read · ",6,"/",25]}]]}],["$","h1",null,{"className":"text-3xl font-bold tracking-tight","children":"Tags in Gen3: Primary Fields, Primary Tags & Security Context"}],["$","div",null,{"className":"flex items-center gap-2 mt-2","children":[["$","span",null,{"className":"inline-block text-xs bg-[#161b22] text-gray-400 px-2.5 py-0.5 rounded-full border border-[#30363d]","children":"Tutorial"}],false]}]]}],["$","$L16",null,{"content":"$17","exercises":[],"quizzes":[],"accent":"text-emerald-400"}],"$L18"]}]
19:I[43329,["/_next/static/chunks/3fntmmi971322.js","/_next/static/chunks/33nddabf2qflw.js","/_next/static/chunks/35cya3l8df-be.js"],"CompletionButton"]
18:["$","div",null,{"className":"mt-16 pt-6 border-t border-[#30363d]","children":["$","div",null,{"className":"flex justify-between items-center","children":[["$","$L15",null,{"href":"/modules/gen3-iam/16-manag
