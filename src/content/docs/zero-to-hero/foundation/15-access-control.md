---
title: "Tags & Access Control"
course: "From Zero to Hero"
track: "Track 1: Foundation"
moduleNumber: 3
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__15-access-control" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Access Control: Users, Tags & Data Isolation

When you set up Dynatrace for a team (or multiple teams), one of the first questions is: "Who can see what?" This module covers the practical setup — from tagging your data to creating groups and policies.

## The Access Model in 30 Seconds

```
1. TAG your data at the source (hosts, K8s namespaces)
2. CREATE groups for your teams
3. BIND policies to groups (what they can do)
4. ADD boundaries to policies (what data they can see)

That's it. Tags → Groups → Policies → Boundaries.
```

## Step 1: Understand the Tag Architecture

Dynatrace has THREE types of tags. This is the most confusing part — get this right and everything else follows:

```
Type                        Set Via                          Propagates To           Use For
──────────────────────────  ───────────────────────────────  ──────────────────────  ──────────────────────────
Primary Grail Fields        --set-host-property              ALL telemetry           IAM boundaries, cost allocation
  dt.security_context       K8s metadata enrichment          (logs, metrics, spans,  (access control)
  dt.cost.costcenter        OpenPipeline                     events, entities)
  dt.cost.product

Primary Grail Tags          --set-host-tag=primary_tags.*    ALL telemetry           Routing, segments, filtering
  primary_tags.team         K8s metadata enrichment          (logs, metrics, spans,  (NOT for IAM boundaries)
  primary_tags.environment  DT_TAGS env var                  events, entities)
  primary_tags.app

Classic Tags                --set-host-tag=key=value         Entity metadata ONLY    Legacy filtering, MZ rules
  env=production            Auto-tagging rules               (NOT on telemetry)
  team=payments
```

:::danger
⚠️ The critical rule: only **Primary Grail Fields** (dt.security_context, dt.host_group.id, k8s.namespace.name) can be used in IAM policy boundaries for access control. Primary Tags and Classic Tags CANNOT control who sees what data.
:::

## Step 2: Tag Your Infrastructure

### For VMs (OneAgent)

```bash
# At install time (recommended):
sudo /bin/sh Dynatrace-OneAgent-Linux.sh \
  --set-host-group=payments-prod \
  --set-host-property=dt.security_context=SV-PAYMENTS.PRD \
  --set-host-property=dt.cost.costcenter=CC-1234 \
  --set-host-tag=primary_tags.team=payments \
  --set-host-tag=primary_tags.environment=production

# For existing installations:
oneagentctl --set-host-property=dt.security_context=SV-PAYMENTS.PRD
oneagentctl --set-host-property=dt.cost.costcenter=CC-1234
oneagentctl --set-host-tag=primary_tags.team=payments
```

### For Kubernetes

```yaml
# Label your namespaces:
apiVersion: v1
kind: Namespace
metadata:
  name: payments
  labels:
    team: payments
    cost-center: CC-1234
  annotations:
    metadata.dynatrace.com/dt.security_context: SV-PAYMENTS.PRD
```

Then configure enrichment rules in Dynatrace (Settings → Kubernetes → Metadata enrichment) to map labels to primary tags.

### The Simplest Path (No Custom Tags Needed)

If your isolation maps to host groups or K8s namespaces, you can skip custom tags entirely:

```
// Boundary using host group directly:
storage:dt.host_group.id = "payments-prod";

// Boundary using K8s namespace directly:
storage:k8s.namespace.name = "payments";
```

:::tip
💡 Start simple. If host groups or K8s namespaces give you enough isolation, use them directly. Only add `dt.security_context` when you need custom isolation that doesn't map to deployment boundaries.
:::

## Step 3: Create Groups

Groups are collections of users. Create one per team (or per team per environment for strict isolation):

```
Simple setup (small org):
  SRE-Team          → all SRE engineers
  Dev-Team          → all developers
  Platform-Team     → platform admins

Enterprise setup (per team per env):
  SV-PAYMENTS.PRD.Analyst   → payments team, production
  SV-PAYMENTS.DEV.Analyst   → payments team, development
  SV-PLATFORM.PRD.Admin     → platform team, production
```

Create via: Account Management → IAM → Groups → Create group

## Step 4: Bind Policies with Boundaries

Policies define WHAT users can do. Boundaries restrict WHICH data they can see:

```
// Use Dynatrace's default policies (recommended — they auto-update):
"Standard User"     → access environment + run apps
"Read Logs"         → query log records
"Read Metrics"      → query metric data
"All Grail data"    → read everything

// Then ADD a boundary to restrict scope:
Boundary: storage:dt.security_context MATCH ("SV-PAYMENTS")
  → user can only see data tagged with SV-PAYMENTS.*
```

:::note
🛠 **Try it:** Account Management → IAM → Groups → select your group → Permissions → Add policy → select "Read Logs" → Add boundary → enter: `storage:dt.host_group.id = "your-host-group"` → Save. Now users in that group can only see logs from that host group.
:::

## Quick Setup: Single Team (5 Minutes)

If you just need basic access for one team:

```
Step  Action                                  Where
────  ──────────────────────────────────────  ──────────────────────────────────
1     Create a group "My-Team"                 Account Management → IAM → Groups
2     Add users to the group                   Group → Members → Add
3     Bind "Standard User" policy (no bound.)  Group → Permissions → Add policy
4     Bind "All Grail data" + boundary         Group → Permissions → Add policy
      Boundary: storage:dt.host_group.id       → select boundary → Save
      = "my-host-group"
```

## Quick Setup: Multi-Team (30 Minutes)

```
Step  Action                                  Result
────  ──────────────────────────────────────  ──────────────────────────────────
1     Tag hosts with dt.security_context       Data gets labeled at source
2     Create group per team                    SV-PAYMENTS, SV-PLATFORM, etc.
3     Create boundary per team                 storage:dt.security_context MATCH ("SV-PAY")
4     Bind default policies + boundary         Each team sees only their data
5     Create segments for dashboard filtering  Teams get familiar filter UX
```

## Authentication Methods

```
Method              Scope           Lifetime        Use Case
──────────────────  ──────────────  ──────────────  ──────────────────────────────────
API Token           Environment     No expiry       Settings API, extensions, USQL
OAuth Client        Account         300s bearer     Terraform, CI/CD, workflows
Platform Token      User-scoped     Configurable    Scripts, integrations (simplest)
```

:::tip
💡 For your first automation script, use a **Platform Token** — create one at myaccount.dynatrace.com → Platform tokens. It's long-lived, scoped to your permissions, and just needs `Authorization: Bearer <token>`. No OAuth dance required.
:::

## Service Users (for Automation)

When workflows or CI/CD need to run with specific permissions, create a service user:

```
1. Account Management → Service users → Create
2. Bind policies to the auto-created group
3. Set as workflow "actor" (NOT "owner"!)
4. The workflow runs with the service user's permissions
```

:::danger
⚠️ Never set a workflow's `owner` to a service user — you'll permanently lose access. Only set the `actor` field.
:::

## Default Policies (Use These First)

```
Access Tier      What It Grants
───────────────  ──────────────────────────────────────────────────
Admin User       Administrative access across all Platform Services
Pro User         Build, deploy, run Apps + Workflows + key services
Standard User    Access environment + run Dynatrace Apps
```

Data policies (bind with boundaries for scoped access):

```
Read Logs, Read Metrics, Read Spans, Read Events, Read Entities,
Read BizEvents, Read Security Events, All Grail data read access
```

:::tip
💡 Best practice: use default policies + boundaries instead of writing custom policies. Default policies auto-update when Dynatrace adds new features. Custom policies might miss new permissions.
:::

## Boundary Gotchas

```
Rule                                    What It Means
──────────────────────────────────────  ──────────────────────────────────────────────
Max 10 restrictions per boundary        Split into multiple boundaries if needed
No AND operator between lines           Each line is one independent condition
Entity access ≠ data access             Restricting entities does NOT restrict their logs/metrics
Use dt.security_context in boundaries   It applies to ALL data types (safest choice)
Boundaries don't apply to DENY          DENY statements are always unconditional
```

## Decision Framework

```
Question                                Answer
──────────────────────────────────────  ──────────────────────────────────────────────
"Just me, no teams"                     → Standard User policy, no boundary needed
"One team, one environment"             → Standard User + All Grail data (no boundary)
"Multiple teams, same environment"      → Tag with dt.security_context + boundaries
"Multiple teams, multiple environments" → V3.1 model (see Gen3 Migration course Phase 4)
"Need cost allocation"                  → Add dt.cost.costcenter + dt.cost.product
"Need dashboard filtering"              → Add primary_tags.* + create Segments
```

:::note
🛠 For the full architect-level deep dive (V3.1 model, dual boundaries, Terraform automation, banking case study), see the **Gen2 → Gen3 Migration Guide, Phase 4** — 9 modules covering the complete access architecture.
:::

<details>
<summary>📝 Knowledge Check</summary>
<div class="quiz">
<p><strong>Q: What's the minimum setup for a single team to access Dynatrace?</strong></p>
<p>A: Create a group, add users, bind "Standard User" + "All Grail data read access" policies. No boundaries needed if there's only one team.</p>
<p><strong>Q: You want team A to only see their logs. What do you need?</strong></p>
<p>A: (1) Tag their hosts with <code>dt.security_context=TeamA</code> via <code>--set-host-property</code>, (2) Create a boundary: <code>storage:dt.security_context = "TeamA"</code>, (3) Bind "Read Logs" policy with that boundary to their group.</p>
<p><strong>Q: Can you use <code>primary_tags.team</code> in a policy boundary?</strong></p>
<p>A: No. Only Primary Grail Fields (dt.security_context, dt.host_group.id, k8s.namespace.name, cloud account fields) can be used in boundaries. Primary tags are for routing, segments, and filtering — not access control.</p>
<p><strong>Q: What's the difference between <code>--set-host-tag</code> and <code>--set-host-property</code>?</strong></p>
<p>A: <code>--set-host-property</code> sets Primary Grail Fields (dt.security_context, dt.cost.*) that propagate to ALL telemetry. <code>--set-host-tag</code> sets either Primary Grail Tags (with <code>primary_tags.</code> prefix) or Classic Tags (without prefix). For access control, always use <code>--set-host-property</code>.</p>
</div>
</details>

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":[{"id":"hero-foundation","title":"Track 1: Foundation","description":"What is observability, how Dynatrace works, set up access, and get your first data","icon":"🏗️","modules":[{"number":0,"slug":"00-what-is-observability","title":"What is Observability","type":"Tutorial"},{"number":1,"slug":"01-dynatrace-platform","title":"The Dynatrace Platform","type":"Tutorial"},{"number":2,"slug":"02-getting-started","title":"Getting Started","type":"Tutorial"},{"number":3,"slug":"15-access-control","title":"Tags & Access Control","type":"Tutorial"},{"number":4,"slug":"03-your-first-data","title":"Your First Data","type":"Hands-on"}]},{"id":"hero-query","title":"Track 2: Query & Explore","description":"Master DQL — the one language for all your observability data","icon":"🔍","modules":[{"number":5,"slug":"04-dql-fundamentals","title":"DQL Fundamentals","type":"Hands-on"},{"number":6,"slug":"05-metrics-timeseries","title":"Metrics & Timeseries","type":"Hands-on"},{"number":7,"slug":"06-logs-events","title":"Logs & Events","type":"Hands-
