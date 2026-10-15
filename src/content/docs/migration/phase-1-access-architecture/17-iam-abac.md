---
title: "IAM & ABAC: The Complete Access Architecture"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 1: Set Up Access & Data Architecture"
moduleNumber: 6
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__17-iam-abac" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## IAM & ABAC: The Complete Access Architecture

This is the most important module in the migration guide. In Gen2, access control was simple: assign a role, optionally restrict with a management zone. In Gen3, you're designing a **full access architecture** that controls who sees what data across ALL telemetry types.

## The Fundamental Shift

```
Gen2 (Environment-level)                Gen3 (Account-level)
──────────────────────────────────────  ──────────────────────────────────────
Users managed per environment           Users managed at account level
3 roles (Admin, User, Viewer)           Policy-based (unlimited granularity)
Management zones for data filtering     ABAC policies with conditions
API tokens per environment              OAuth clients + Platform tokens
Access = role + optional MZ             Access = policy + boundary + security context
One environment = one access domain     One account = unified access across all envs
```

:::danger
⚠️ This is NOT just "move users to account level." You're redesigning how data isolation works. In Gen2, a management zone hid entities. In Gen3, you need to tag ALL data at the source, then write policies that filter on those tags.
:::

## The Building Blocks

```
Building Block      What It Is                              Gen2 Equivalent
──────────────────  ──────────────────────────────────────  ──────────────────────
Group               Collection of users                      (same concept)
Policy              ALLOW/DENY statements with conditions    Role + MZ combined
Boundary            Reusable condition that CAPS a policy    (no equivalent)
Security Context    Tag on data that policies filter on      Management zone membership
Service User        Non-human identity for automation        API token
Platform Token      Long-lived auth for scripts              API token
```

## How ABAC Works (Attribute-Based Access Control)

ABAC = policies that filter data based on **attributes on the data itself**. The key attribute is `dt.security_context`.

```
// Gen2: "User X can see Management Zone 'Payments'"
//   → Dynatrace pre-computes which entities are in the zone
//   → User sees those entities and their data

// Gen3: "User X can see data where dt.security_context = 'SV-PAYMENTS.PRD'"
//   → Every record (log, metric, span, entity) is tagged with security_context
//   → At query time, Grail filters records based on the user's policy
//   → User only sees records matching their policy condition
```

:::tip
💡 The critical difference: in Gen2, the *entity* was in a zone. In Gen3, the *data record* has an attribute. This means you need to ensure ALL data gets tagged — not just entities.
:::

## Policy Syntax

```
// Basic: allow reading all logs
ALLOW storage:logs:read;

// With condition: only logs tagged with this security context
ALLOW storage:logs:read
WHERE storage:dt.security_context MATCH ("SV-PAYMENTS.PRD");

// Multiple permissions in one statement
ALLOW storage:logs:read, storage:metrics:read, storage:events:read, storage:spans:read
WHERE storage:dt.security_context MATCH ("SV-PAYMENTS.PRD");

// MATCH vs equals:
//   MATCH ("SV-PAYMENTS") — matches SV-PAYMENTS.DEV, SV-PAYMENTS.PRD, etc.
//   == "SV-PAYMENTS.PRD"  — exact match only
```

:::danger
⚠️ Use `MATCH` for hierarchical matching (team sees all environments). Use `==` for exact isolation (team only sees production). The naming convention you choose for security context values determines your flexibility.
:::

## Policy Boundaries: The Innovation

Boundaries are the Gen3 concept with no Gen2 equivalent. They **cap what a policy can grant** — even if the policy says ALLOW ALL, the boundary restricts it.

```
Without boundary:
  Policy: ALLOW storage:logs:read → user sees ALL logs

With boundary:
  Policy: ALLOW storage:logs:read
  Boundary: storage:dt.security_context MATCH ("SV-PAYMENTS")
  → user sees ONLY logs tagged with SV-PAYMENTS.*
```

Why boundaries matter:

- **Reusable policies** — write "Read all data" once, apply different boundaries per team
- **Hard isolation** — even if someone misconfigures a policy, the boundary prevents data leakage
- **Delegation** — team admins can create policies within their boundary, but can never exceed it

### Boundary Rules & Limitations (from official docs)

```
Rule                                    Implication
──────────────────────────────────────  ──────────────────────────────────────────────
Max 10 restrictions per boundary        Create multiple boundaries if you need more
No AND operator between lines           Each line is one independent condition
Boundaries don't apply to DENY          DENY statements are always unconditional
Boundaries only work with policies      Not compatible with role-based permissions
Conditions only apply where they fit    A storage:host.name condition won't apply to
                                        storage:entities:read (entities don't have host.name)
```

:::danger
⚠️ **Critical trap with multiple boundaries:** When TWO boundaries are assigned to one policy, and one boundary's condition doesn't apply to a permission, that permission becomes UNCONDITIONAL. Example from official docs:

```
Policy: ALLOW storage:logs:read, storage:entities:read;
Boundary 1: storage:host.name = "myHost"
Boundary 2: storage:dt.security_context = "mySC"

Result:
  ALLOW storage:entities:read;                    ← UNCONDITIONAL! (boundary 1 doesn't apply)
  ALLOW storage:entities:read WHERE dt.security_context = "mySC";
  ALLOW storage:logs:read WHERE host.name = "myHost";
  ALLOW storage:logs:read WHERE dt.security_context = "mySC";
```

The user gets unconditional entity access because `storage:host.name` doesn't apply to entities. **Solution:** Use `dt.security_context` in boundaries — it applies to ALL data types.
:::

## Real-World Architecture: The V3.1 Model

This is the architecture we built for a banking customer with 50+ service teams across 4 environments (DEV, TST, UAT, PRD). Each team needs isolated access to their own data, with different permissions per environment.

### Naming Convention

```
Pattern: {SERVICE_CODE}.{PURPOSE}.{ROLE}

Examples:
  SV-PAYMENTS.DEV.Analyst    — Payments team, dev environment, analyst role
  SV-PAYMENTS.PRD.Analyst    — Payments team, production, analyst role
  SV-PLATFORM.PRD.Admin      — Platform team, production, admin role
```

### Per-Team Resource Map (16 resources per service)

```
Resource Type    Count  Naming Pattern                    Purpose
───────────────  ─────  ────────────────────────────────  ──────────────────────────────
Groups           4      SV-XYZ.DEV.Analyst, .TST, .UAT,  One group per environment
                        .PRD
Gen3 Boundary    4      SV-XYZ.DEV, .TST, .UAT, .PRD     Caps Grail data access
Classic Boundary 4      SV-XYZ.DEV Classic, .TST Classic  Caps classic app access (MZ-based)
Bindings         4      One per group (account-scoped)    Connects policies to groups
```

:::tip
💡 Why TWO boundaries per environment? Because Gen3 and classic apps use different access models. Gen3 uses `dt.security_context`, classic uses management zones. During migration, you need BOTH. After full migration, you can drop the classic boundaries.
:::

### The Dual-Boundary Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  Group: SV-PAYMENTS.PRD.Analyst                                      │
│                                                                       │
│  Policies bound to this group:                                        │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │ 1. Access Gen3 apps              → NO boundary                │   │
│  │ 2. Limit classic apps            → NO boundary                │   │
│  │ 3. Settings Gen3 (no boundary)   → NO boundary                │   │
│  │ 4. Settings Gen3 (with boundary) → Gen3 boundary only         │   │
│  │ 5. Access classic apps           → Classic boundary only      │   │
│  │ 6. Settings classic              → Classic boundary only      │   │
│  │ 7. Role policy (Analyst)         → BOTH boundaries            │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Gen3 Boundary: storage:dt.security_context MATCH ("SV-PAYMENTS.PRD")│
│  Classic Boundary: environment:management-zone startsWith            │
│                    "SV-PAYMENTS.PRD"                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 7 Policies Per Group (Explained)

```
#  Policy Name                    Boundary        What It Does
─  ──────────────────────────────  ──────────────  ──────────────────────────────────────
1  Access Gen3                     None            Lets user log into Gen3 apps (no data)
2  Limit classic apps              None            Restricts which classic apps are visible
3  Settings Gen3 (no boundary)     None            Read settings that don't need scoping
4  Settings Gen3 (with boundary)   Gen3            Read settings scoped to their data
5  Access classic                  Classic         Access classic UI scoped to their MZ
6  Settings classic                Classic         Read classic settings in their MZ
7  Role policy (Analyst/Admin)     Gen3 + Classic  The actual data permissions (read/write)
```

:::note
🛠 **Why so many policies?** Because different permissions need different boundary scoping. "Access Gen3 apps" doesn't need a boundary (it's just login access). But "Read logs" MUST have a boundary (otherwise they see everyone's logs). The 7-policy model gives you precise control over which permissions are bounded and which aren't.
:::

## Terraform Implementation

```hcl
variable "service_code" { default = "SV-PAYMENTS" }
variable "purposes"     { default = ["DEV", "TST", "UAT", "PRD"] }

# Groups: one per environment
resource "dynatrace_iam_group" "svc" {
  for_each    = toset(var.purposes)
  name        = "${var.service_code}.${each.value}.Analyst"
  description = "Auto-created for ${var.service_code} ${each.value}"
}

# Gen3 Boundary: filters on dt.security_context
resource "dynatrace_iam_policy_boundary" "gen3" {
  for_each = toset(var.purposes)
  name     = "${var.service_code}.${each.value}"
  query    = "storage:dt.security_context MATCH (\"${var.service_code}.${each.value}\");"
}

# Classic Boundary: filters on management zone name
resource "dynatrace_iam_policy_boundary" "classic" {
  for_each = toset(var.purposes)
  name     = "${var.service_code}.${each.value} Classic"
  query    = "environment:management-zone startsWith \"${var.service_code}.${each.value}\";"
}

# Bindings: per-policy boundary assignment
resource "dynatrace_iam_policy_bindings_v2" "svc" {
  for_each = toset(var.purposes)
  group    = dynatrace_iam_group.svc[each.value].id
  account  = var.account_id

  # Policies with NO boundary (login access, global settings)
  dynamic "policy" {
    for_each = var.policy_ids_no_boundary
    content { id = policy.value }
  }

  # Policies with Gen3 boundary only (Grail data access)
  dynamic "policy" {
    for_each = var.policy_ids_gen3_boundary
    content {
      id         = policy.value
      boundaries = [dynatrace_iam_policy_boundary.gen3[each.value].id]
    }
  }

  # Policies with Classic boundary only (MZ-scoped classic access)
  dynamic "policy" {
    for_each = var.policy_ids_classic_boundary
    content {
      id         = policy.value
      boundaries = [dynatrace_iam_policy_boundary.classic[each.value].id]
    }
  }

  # Role policy with BOTH boundaries (full data access, scoped)
  policy {
    id = var.role_policy_id
    boundaries = [
      dynatrace_iam_policy_boundary.gen3[each.value].id,
      dynatrace_iam_policy_boundary.classic[each.value].id,
    ]
  }
}
```

:::danger
⚠️ ALWAYS use `dynatrace_iam_policy_bindings_v2` — v1 has NO boundary support. And `dynatrace_iam_user` with `groups` does a PUT that replaces ALL groups (dangerous in production).
:::

## Default Policies (Use These First)

Dynatrace provides pre-built policies that auto-update with platform changes. Use them with boundaries instead of writing custom policies:

```
Access Tier      What It Grants
───────────────  ──────────────────────────────────────────────────
Admin User       Administrative access across all Platform Services
Pro User         Build, deploy, run Apps + Workflows + key services
Standard User    Access environment + run Dynatrace Apps
```

Data policies (bind with boundaries for scoped access):

```
Policy                        Permission
────────────────────────────  ──────────────────────────────
All Grail data read access    All storage:*:read
Read Logs                     storage:logs:read
Read Metrics                  storage:metrics:read
Read Spans                    storage:spans:read
Read Events                   storage:events:read
Read Entities                 storage:entities:read
Read BizEvents                storage:bizevents:read
Read Security Events          storage:security.events:read
```

:::tip
💡 Best practice: use default policies + boundaries instead of custom policies. Default policies auto-update when Dynatrace adds new features. Custom policies might miss new permissions.
:::

## Account Management Portal

URL: **myaccount.dynatrace.com** (separate from your environment)

```
Section              What You Manage
───────────────────  ──────────────────────────────────────────
Users & Groups       Who has access (invite, assign to groups)
Policies             What they can do (ALLOW/DENY statements)
Boundaries           Reusable conditions that cap policies
OAuth Clients        API credentials for automation
Service Users        Non-human identities for workflows
Environments         Provision and manage environments
Subscription         Licensing, cost overview, DPS consumption
```

## Service Users (for Automation)

Service users are non-human identities — use them for workflows, CI/CD, and scheduled automation:

```
// Create via API:
POST /iam/v1/accounts/{accountId}/service-users
Body: {"name": "workflow-actor-payments", "description": "Runs payment team workflows"}

// Response:
{
  "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "email": "workflow-actor-payments@service.sso.dynatrace.com",
  "groupUuid": "auto-created-group-uuid"  // ← bind policies to THIS group
}
```

Key facts:

- Service users auto-get a group at creation — bind policies to that group
- Service user permissions are independent of the OAuth client that created them
- Use as workflow `actor` (NOT `owner`) — setting owner locks you out forever
- Scope: `iam:service-users:use` required to assign as workflow actor

## Migration Steps (Detailed)

```
Step  Action                                  Validates
────  ──────────────────────────────────────  ──────────────────────────────────
1     Inventory Gen2 users, roles, MZs         Who has access to what today?
2     Design naming convention                  SV-CODE.ENV.ROLE pattern
3     Design group structure                    1 group per team per environment
4     Choose policies (default vs custom)       Default + boundaries preferred
5     Create boundaries (Gen3 + Classic)        Dual boundaries for migration period
6     Tag all data with security context        See next module (CRITICAL)
7     Bind policies to groups with boundaries   Use dynatrace_iam_policy_bindings_v2
8     Test with a pilot team                    Verify data isolation works
9     Migrate remaining teams                   Roll out group by group
10    Deprecate classic boundaries              After full Gen3 migration
```

:::danger
⚠️ Step 6 is the hardest part. If your data isn't tagged with `dt.security_context`, your ABAC policies have nothing to filter on. The next module covers exactly how to enrich every data type.
:::

<details>
<summary>📝 Knowledge Check</summary>
<div class="quiz">
<p><strong>Q: Why do you need BOTH a Gen3 boundary AND a Classic boundary during migration?</strong></p>
<p>A: Because Gen3 apps (dashboards, notebooks, workflows) use <code>dt.security_context</code> for access control, while classic apps (Settings, some legacy screens) still use management zones. During migration, users need access to both. The Gen3 boundary filters Grail data, the Classic boundary filters classic UI access.</p>
<p><strong>Q: What happens if you create an ABAC policy but don't tag your data with dt.security_context?</strong></p>
<p>A: The policy condition <code>WHERE storage:dt.security_context MATCH ("SV-PAYMENTS")</code> will match NOTHING — because no records have that attribute. The user sees zero data. This is why enrichment (next module) is critical.</p>
<p><strong>Q: Can a team admin create a policy that bypasses their boundary?</strong></p>
<p>A: No. Boundaries cap what a policy can grant. Even if a team admin writes <code>ALLOW storage:logs:read</code> (no WHERE clause), the boundary restricts it to only records matching their security context. This is the key security property of boundaries.</p>
<p><strong>Q: Why use <code>MATCH</code> instead of <code>==</code> in boundary queries?</strong></p>
<p>A: <code>MATCH ("SV-PAYMENTS")</code> matches hierarchically: SV-PAYMENTS.DEV, SV-PAYMENTS.PRD, etc. This lets you create a "team-wide" boundary that covers all environments. Use <code>==</code> only when you need exact environment isolation.</p>
<p><strong>Q: What's the difference between a policy and a boundary?</strong></p>
<p>A: A policy GRANTS permissions (ALLOW statements). A boundary CAPS what any policy can grant. Think of it as: policy = "what you're allowed to do", boundary = "the maximum scope you can ever have". Boundaries prevent privilege escalation.</p>
</div>
</details>

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"28%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🔐"," ","Phase 1: Set Up Access & Data Architecture"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",6]}],["$","span",null,{"className":"ml-auto text-xs text-gray-600","children":[10," min read · ",7,"/",25]}]]}],["$","h1",null,{"className":"text-3xl font-bold tracking-tight","children":"IAM & ABAC: The Complete Access Architecture"}],["$","div",null,{"className":"flex items-center gap-2 mt-2","children":[["$","span",null,{"className":"inline-block text-xs bg-[#161b22] text-gray-400 px-2.5 py-0.5 rounded-full border border-[#30363d]","children":"Hands-on"}],false]}]]}],["$","$L16",null,{"content":"$17","exercises":[],"quizzes":[],"accent":"text-emerald-400"}],"$L18"]}]
19:I[43329,["/_next/static/chunks/3fntmmi971322.js","/_next/static/chunks/33nddabf2qflw.js","/_next/static/chunks/35cya3l8df-be.js"],"CompletionButton"]
18:["$","div",null,{"className":"mt-16 pt-6 border-t border-[#30363d]","children":["$","div",null,{"className":"flex justify-between items-center","children":[["$","$L15",null,{"href":"/modules/gen3-iam/16b-tags-primary-grail","className":"group flex flex-col","children":[["$","span",null,{"className":"text-xs text-gray-600 mb-0.5","children":"← Previous"}],["$","span",null,{"className":"text-sm text-gray-400 group-hover:text-white transition","children":"Tags in Gen3: Primary Fields, Primary Tags & Security Context"}]]}],["$","$L19",null,{"trackId":"gen3-iam","moduleSlug":"17-iam-abac"}],["$","$L15",null,{"href":"/modules/gen3-i
