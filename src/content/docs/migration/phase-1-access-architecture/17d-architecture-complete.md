---
title: "Putting It All Together: Complete Architecture"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 1: Set Up Access & Data Architecture"
moduleNumber: 9
lessonType: "Reference"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__17d-architecture-complete" data-course-slug="migration">
<em>Format: Reference &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Putting It All Together: The Complete Access Architecture

You've learned the three concepts that replace management zones. Now let's see how they work together in a real enterprise deployment. This module walks through a complete architecture for a company with 5 teams across 4 environments.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DYNATRACE ACCOUNT                                    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  DATA PARTITIONING (Buckets)                                         │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │    │
│  │  │ hot_ops  │ │ standard │ │ analytics│ │compliance│ │  debug   │ │    │
│  │  │  7 days  │ │ 35 days  │ │ 90 days  │ │ 365 days │ │  3 days  │ │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  DATA ACCESS (IAM/ABAC)                                              │    │
│  │                                                                       │    │
│  │  Groups:     SV-PAY.PRD.Analyst  SV-PLAT.PRD.Admin  SV-SEC.PRD.Ops  │    │
│  │  Policies:   Read data           Full access         Security data    │    │
│  │  Boundaries: dt.security_context MATCH ("SV-PAY.PRD")                │    │
│  │              dt.security_context MATCH ("SV-PLAT.PRD")               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  DATA SEGMENTATION (Segments)                                        │    │
│  │                                                                       │    │
│  │  "Production"     → matchesValue(tags, "env:production")             │    │
│  │  "Team Payments"  → dt.security_context == "SV-PAY.PRD"             │    │
│  │  "Hot Logs"       → dt.system.bucket == "hot_ops"                    │    │
│  │  "K8s Cluster A"  → k8s.cluster.name == "prod-east"                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## How They Interact

```
Concept              Controls                    Enforced At
───────────────────  ──────────────────────────  ──────────────────────────
Buckets              WHERE data lives, HOW LONG  Ingest time (OpenPipeline)
IAM/ABAC             WHO can see WHAT data       Query time (Grail engine)
Segments             HOW users FILTER data       Query time (UI/dashboard)
```

Key insight: they're **independent but complementary**:

- A user might have ABAC access to all payment data (IAM)
- But only see production data in their dashboard (Segment filter)
- And that data lives in a 35-day bucket (Partitioning)

## Real-World Example: Banking Customer

### The Setup

```
Teams:        5 (Payments, Platform, Security, Mobile, Data)
Environments: 4 (DEV, TST, UAT, PRD)
Hosts:        200+ VMs + 3 K8s clusters
Services:     500+ auto-detected
```

### Bucket Design

```
Bucket                  Retention  Routing Rule                        Teams
──────────────────────  ─────────  ──────────────────────────────────  ──────────
prod_hot                7 days     env=PRD AND (ERROR OR WARN)         All (ops)
prod_standard           35 days    env=PRD AND INFO                    All
nonprod_standard        14 days    env=DEV|TST|UAT                     All
compliance_audit        365 days   matchesPhrase(content, "audit")     Security
debug_verbose           3 days     loglevel=DEBUG                      Developers
```

### IAM Design (V3.1 Model)

```
Per team (5 teams × 4 envs = 20 groups):
  SV-PAYMENTS.DEV.Analyst    → boundary: dt.security_context MATCH ("SV-PAYMENTS.DEV")
  SV-PAYMENTS.TST.Analyst    → boundary: dt.security_context MATCH ("SV-PAYMENTS.TST")
  SV-PAYMENTS.UAT.Analyst    → boundary: dt.security_context MATCH ("SV-PAYMENTS.UAT")
  SV-PAYMENTS.PRD.Analyst    → boundary: dt.security_context MATCH ("SV-PAYMENTS.PRD")

Cross-team roles:
  PLATFORM.ALL.Admin         → boundary: (none — platform team sees everything)
  SECURITY.ALL.Auditor       → boundary: bucket == "compliance_audit"
```

### Segment Design

```
Segment Name         Filter                                    Used By
───────────────────  ──────────────────────────────────────── ──────────────────
Production           matchesValue(tags, "env:production")       All dashboards
Non-Production       NOT matchesValue(tags, "env:production")   Dev dashboards
Team Payments        dt.security_context == "SV-PAYMENTS.PRD"   Team dashboards
K8s Cluster East     k8s.cluster.name == "prod-east"            Infra dashboards
Hot Issues           dt.system.bucket == "prod_hot"             Ops dashboards
```

### Enrichment Strategy

```
Infrastructure       Method                          Tag Value
───────────────────  ──────────────────────────────  ──────────────────────────
200 VMs              oneagentctl --set-host-tag      dt.security_context=SV-XXX.ENV
K8s cluster 1        Namespace label enrichment      dt.security_context from label
K8s cluster 2        Namespace label enrichment      dt.security_context from label
K8s cluster 3        Namespace label enrichment      dt.security_context from label
SNMP devices         Extension topology dimension    dt.security_context in config
External syslog      OpenPipeline enrichment         Match source IP → add context
```

## The Onboarding Workflow (New Team)

When a new team joins, here's what gets created:

```
Step  Action                                  Terraform Resource
────  ──────────────────────────────────────  ──────────────────────────────────
1     Create 4 groups (DEV/TST/UAT/PRD)       dynatrace_iam_group × 4
2     Create Gen3 boundaries (4)              dynatrace_iam_policy_boundary × 4
3     Create Classic boundaries (4)           dynatrace_iam_policy_boundary × 4
4     Bind policies with boundaries (4)       dynatrace_iam_policy_bindings_v2 × 4
5     Set host properties (security context)  oneagentctl --set-host-property (Ansible)
6     Add K8s namespace labels                kubectl label namespace
7     Configure K8s enrichment rules          dynatrace_kubernetes_enrichment
8     Verify entity security context          dynatrace_grail_security_context (if override needed)
9     Create team segment                     Segments API / Monaco
```

Total: **16 Terraform resources + host property setup + K8s labels + enrichment rule + segment**

### Complete Terraform Resource List

```
Resource                              Auth     Purpose
────────────────────────────────────  ───────  ──────────────────────────────────────
dynatrace_iam_group                   OAuth    Create team groups
dynatrace_iam_policy_boundary         OAuth    Create Gen3 + Classic boundaries
dynatrace_iam_policy_bindings_v2      OAuth    Bind policies with per-policy boundaries
dynatrace_iam_policy                  OAuth    Custom policies (if defaults insufficient)
dynatrace_kubernetes_enrichment       Token    Map K8s labels → dt.security_context
dynatrace_grail_security_context      Token    Override entity security context source
dynatrace_openpipeline_v2_*           OAuth    Security context processors for external data
```

:::tip
💡 This is fully automatable. The V3.1 Terraform template takes a service code and creates all 16 resources. Host tagging can be scripted via Ansible. K8s labels are in your namespace YAML. One `terraform apply` + one Ansible playbook = team onboarded.
:::

## The Offboarding Workflow (Team Leaves)

```
Step  Action                                  Risk
────  ──────────────────────────────────────  ──────────────────────────────────
1     Remove users from groups                 Immediate access revocation
2     (Optional) Delete groups                 Clean up IAM
3     Keep boundaries (data still exists)      Data remains queryable by admins
4     Keep bucket routing (data still flows)   No data loss
5     Update segments if team-specific         Remove from shared dashboards
```

:::danger
⚠️ Never delete boundaries before confirming no other groups reference them. Boundaries are reusable — another team might share the same boundary for cross-team access.
:::

## Common Architecture Mistakes

```
Mistake                                 Consequence                          Fix
──────────────────────────────────────  ───────────────────────────────────  ──────────────────────────
Skip enrichment, enable ABAC            Users see zero data                  Tag first, restrict second
One boundary per team (no env split)    Dev team sees prod data              Use SV-XXX.ENV pattern
Custom policies instead of defaults     Policies break on platform updates   Use defaults + boundaries
Forget classic boundary                 Users can't access classic apps      Dual boundaries during migration
Route before enrich in OpenPipeline     Can't route on enriched fields       Route on ingest-time fields
Conditional DENY on Grail tables        Executes as UNCONDITIONAL DENY       Never use conditional DENY
Multiple boundaries with mixed scopes   Unintended unconditional access      Use dt.security_context (applies to all)
Use --set-host-tag for security ctx     Data not tagged (wrong command)      Use --set-host-property
Pod annotations for K8s enrichment      Missing K8s metrics/events/entities  Use namespace labels + enrichment rules
More than 10 conditions in boundary     API rejects it                       Split into multiple boundaries
```

## Architecture Decision Record

Document these decisions for your customer:

```
Decision                    Options                          Recommendation
──────────────────────────  ───────────────────────────────  ──────────────────────────
Naming convention           Flat vs hierarchical             Hierarchical: SV-CODE.ENV
Boundary granularity        Per-team vs per-team-per-env     Per-team-per-env (V3.1)
Policy approach             Custom vs default + boundary     Default + boundary
Bucket strategy             Per-team vs per-retention-tier   Per-retention-tier (simpler)
Enrichment method           Host tags vs auto-tagging        Host tags (explicit, reliable)
Segment ownership           Central vs team-managed          Central (governance)
Classic boundary lifetime   Keep forever vs deprecate        Deprecate after full migration
```

## Validation Queries

After deploying the architecture, validate with these DQL queries:

```dql
// 1. Check all hosts are tagged
fetch dt.entity.host
| fields entity.name, tags
| filter NOT matchesValue(tags, "dt.security_context:*")
// Result should be EMPTY (all hosts tagged)

// 2. Check data isolation works
// Run as SV-PAYMENTS.PRD.Analyst user:
fetch logs, from:now()-1h
| summarize count(), by:{dt.security_context}
// Should ONLY show SV-PAYMENTS.PRD records

// 3. Check bucket routing is working
fetch logs, from:now()-1h
| summarize count(), by:{dt.system.bucket}
// Should show distribution across your buckets

// 4. Check for untagged data (ABAC gaps)
fetch logs, from:now()-1h
| filter isNull(dt.security_context)
| summarize cnt=count(), by:{log.source}
| sort cnt desc
// These sources need enrichment rules
```

<details>
<summary>📝 Knowledge Check</summary>
<div class="quiz">
<p><strong>Q: A customer asks: "Can we use one bucket per team instead of one bucket per retention tier?" What's your advice?</strong></p>
<p>A: Per-retention-tier is usually better. Reasons: (1) fewer buckets to manage (5 vs 50), (2) ABAC already handles team isolation via security context, (3) bucket-per-team creates operational overhead when teams merge/split. Use buckets for retention strategy, ABAC for access control.</p>
<p><strong>Q: The platform team needs to see ALL data across all teams. How do you set this up?</strong></p>
<p>A: Create a group with NO boundary on the data read policy. Or use a boundary with a broad MATCH pattern like <code>MATCH ("SV-")</code> that matches all service codes. The platform team's role policy grants full read access without restriction.</p>
<p><strong>Q: After migration, when can you remove the classic boundaries?</strong></p>
<p>A: When ALL users have migrated to Gen3 apps and no one uses classic UI screens that rely on management zones. In practice, this is 3-6 months after go-live. Keep classic boundaries during the transition period — they cost nothing.</p>
<p><strong>Q: A new microservice is deployed but its data isn't showing up for the team. What's wrong?</strong></p>
<p>A: Most likely the K8s namespace doesn't have the security context label, or the host doesn't have the tag set. Check: <code>fetch logs | filter dt.source_entity == "SERVICE-XXXXX" | fields dt.security_context | limit 1</code>. If null, the enrichment is missing.</p>
</div>
</details>

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"40%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🔐"," ","Phase 1: Set Up Access & Data Architecture"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",9]}],["$","span",null,{"className":"ml-auto text-xs text-gray-600","children":[7," min read · ",10,"/",25]}]]}],["$","h1",null,{"className":"text-3xl font-bold tracking-tight","children":"Putting It All Together: Complete Architecture"}],["$","div",null,{"className":"flex items-center gap-2 mt-2","children":[["$","span",null,{"className":"inline-block text-xs bg-[#161b22] text-gray-400 px-2.5 py-0.5 rounded-full border border-[#30363d]","children":"Reference"}],false]}]]}],["$","$L16",null,{"content":"$17","exercises":[],"quizzes":[],"accent":"text-emerald-400"}],"$L18"]}]
19:I[43329,["/_next/static/chunks/3fntmmi971322.js","/_next/static/chunks/33nddabf2qflw.js","/_next/static/chunks/35cya3l8df-be.js"],"CompletionButton"]
18:["$","div",null,{"className":"mt-16 pt-6 border-t border-[#30363d]","children":["$","div",null,{"className":"flex justify-between items-center","children":[["$","$L15",null,{"href":"/modules/gen3-iam/17c-grail-buckets","className":"group flex flex-col","children":[["$","span",null,{"className":"text-xs text-gray-600 mb-0.5","children":"← Previous"}],["$","span",null,{"className":"text-sm text-gray-400 group-hover:text-white transition","children":"Grail Buckets & Data Partitioning"}]]}],["$","$L19",null,{"trackId":"gen3-iam","moduleSlug":"17d-architecture-complete"}],["$","$L15",null,{"href":"/modules/gen3-dql/04-dql-fundamentals","className":"group flex flex-col text-right","children":[["$","span",null,{"className":"text-xs text-gray-600 mb-0.5","children":"Next →"}],["$","span",null,{"className":"text-sm text-gray-400 group-hover:text-white transition","children":"DQL Crash Course"}]]}]]}]}]
