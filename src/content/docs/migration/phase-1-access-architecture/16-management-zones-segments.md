---
title: "Management Zones → Three New Concepts"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 1: Set Up Access & Data Architecture"
moduleNumber: 4
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__16-management-zones-segments" data-course-slug="migration">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Management Zones → Three New Concepts

Management zones served multiple purposes in Gen2. Gen3 splits them into **three specialized concepts**, each handling one responsibility:

```
MZ Responsibility              Gen3 Replacement         What It Does
─────────────────────────────  ───────────────────────  ──────────────────────────────
Organize data by retention     Data Partitioning        Grail buckets with per-bucket retention
Control who sees what data     Data Access (IAM/ABAC)   Policies with dt.security_context
Filter data in dashboards/UI   Data Segmentation        Segments — DQL filter expressions
```

:::tip
💡 This is the key insight: management zones tried to do all three at once. Gen3 separates them so each can scale independently. A management zone was a Swiss Army knife — now you get a dedicated tool for each job.
:::

## Why This Matters for Your Migration

In Gen2, when you created a management zone, you simultaneously:

- Decided what data users could see (access control)
- Decided how dashboards were filtered (segmentation)
- Implicitly set retention (same for everything in the zone)

In Gen3, these are **independent decisions**:

```
Decision                    Gen2 Answer              Gen3 Answer
──────────────────────────  ───────────────────────  ──────────────────────────────
"Who can see this data?"    Management Zone + Role   IAM Policy + Boundary (ABAC)
"How long do we keep it?"   Same for everything      Grail Bucket (per-bucket retention)
"How do users filter?"      MZ dropdown              Segments (DQL filter expressions)
```

## Segments: Query-Time Filtering

```
Management Zones (Gen2)                 Segments (Gen3)
──────────────────────────────────────  ──────────────────────────────────────
Entity-based rules                      DQL filter expressions
Pre-computed (performance overhead)     Query-time (no pre-computation)
Environment-level                       Account-level, reusable
Applied globally                        Applied per app/dashboard/notebook
Limited to entity attributes            Filter on ANY data attribute
Max ~500 per environment                Unlimited
```

:::note
🛠 **Try it:** Ctrl+K → "Segments" → Create new → Name it "Production" → Add filter: `matchesValue(tags, "env:production")` → Save. Now apply it to any dashboard.
:::

## Segments as Code

Segments are deployable via API and Monaco — they're not UI-only:

```
Endpoint: /platform/storage/filter-segments/v1/filter-segments
OAuth scopes: storage:filter-segments:read/write/delete/admin
```

Treat segments like any deployable artifact — version in Git, deploy via CI/CD.

## Creating Segments

```dql
// Segment filter examples:

// By tag
matchesValue(tags, "env:production")

// By host group
matchesValue(dt.entity.host.hostGroup, "web-servers")

// By entity name pattern
matchesPhrase(entity.name, "payment")

// By Kubernetes namespace
k8s.namespace.name == "team-payments"

// By security context (same field used for ABAC!)
dt.security_context == "SV-PAYMENTS.PRD"

// Combine multiple conditions
matchesValue(tags, "env:production") AND matchesPhrase(entity.name, "api")
```

## OAuth Replaces API Tokens (for many use cases)

```
API Tokens (Gen2)                       OAuth Clients (Gen3)
──────────────────────────────────────  ──────────────────────────────────────
Environment-level                       Account-level
Never expire (unless set)               Bearer tokens expire in 300 seconds
Broad scopes                            Fine-grained scopes per request
Stored in environment                   Managed in Account Management portal
One token = one set of permissions      Client credentials + scopes per request
```

:::tip
💡 OAuth is required for Gen3 resources: dashboards (Document API), workflows, platform SLOs, and anomaly detectors. API tokens still work for classic Settings API and Extensions.
:::

## The Three Authentication Methods

```
Auth Type         Scope           Lifetime       Use Case
────────────────  ──────────────  ─────────────  ──────────────────────────────────────
API Token         Env-scoped      No expiry      Classic APIs (settings, extensions, USQL)
OAuth Client      Client-scoped   300s bearer    Automation, Terraform, CI/CD, platform APIs
Platform Token    User-scoped     Configurable   Scripts, ETL, integrations (simpler than OAuth)
```

:::danger
⚠️ Platform tokens are a newer alternative to OAuth clients — they're long-lived, scoped to the creating user's permissions, and don't require the client_credentials flow. Great for scheduled scripts and integrations.
:::

## Host Tag Propagation (Key Migration Step)

For segments AND ABAC to work, your data needs tags. Three special tag keys propagate to ALL derived data:

```
// Set host tags via OneAgent CLI
oneagentctl --set-host-tag=dt.security_context=SV-PAYMENTS.PRD
oneagentctl --set-host-tag=dt.cost.costcenter=CC-1234
oneagentctl --set-host-tag=dt.cost.product=checkout-api

// Regular tags (only propagate to raw signals)
oneagentctl --set-host-tag=env=production
oneagentctl --set-host-tag=team=payments
```

:::danger
⚠️ Only three special keys propagate to derived data (service metrics, Davis problems): `dt.security_context`, `dt.cost.costcenter`, and `dt.cost.product`. Regular tags only propagate to raw signals (logs, spans, events from that host).
:::

## Migration Path: MZ → Segments + ABAC

```
Step  Action                                  Result
────  ──────────────────────────────────────  ──────────────────────────────────
1     Export all MZ rules (Monaco download)    Know what you have
2     Map each MZ to a segment filter          Segments replace MZ filtering
3     Map each MZ to a security context value  ABAC replaces MZ access control
4     Set dt.security_context on hosts/K8s     Data gets tagged at source
5     Create IAM policies with boundaries      Access control via ABAC
6     Create segments for dashboard filtering  Users get familiar filter UX
7     Test with pilot team                     Verify isolation works
8     Deprecate management zones               Remove after validation
```

<details>
<summary>📝 Knowledge Check</summary>
<div class="quiz">
<p><strong>Q: A customer has 50 management zones. In Gen3, how many segments do they need?</strong></p>
<p>A: It depends. Segments replace the <em>filtering</em> function of MZs. But access control is now handled by IAM/ABAC policies, and retention by buckets. They might need 50 segments for filtering, but the access control and retention are separate designs.</p>
<p><strong>Q: Can you use management zones AND segments at the same time during migration?</strong></p>
<p>A: Yes. Management zones still exist in Gen3. The recommended approach is to run both in parallel during migration, then deprecate MZs once segments + ABAC cover all use cases.</p>
<p><strong>Q: What's the performance difference between MZs and Segments?</strong></p>
<p>A: Management zones are pre-computed (entity membership calculated continuously). Segments are query-time filters (evaluated when you run a query). Segments have no pre-computation overhead and no entity limit, but add a small query-time cost. At scale, segments perform better because there's no background computation.</p>
</div>
</details>

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"20%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🔐"," ","Phase 1: Set Up Access & Data Architecture"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",4]}],["$","span",null,{"className":"ml-auto text-xs text-gray-600","children":[4," min read · ",5,"/",25]}]]}],["$","h1",null,{"className":"text-3xl font-bold tracking-tight","children":"Management Zones → Three New Concepts"}],["$","div",null,{"className":"flex items-center gap-2 mt-2","c
