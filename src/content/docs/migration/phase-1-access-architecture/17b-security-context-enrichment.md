---
title: "Security Context Enrichment: Tagging All Data"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 1: Set Up Access & Data Architecture"
moduleNumber: 7
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__17b-security-context-enrichment" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Security Context Enrichment: Making ABAC Work

You've designed your groups, policies, and boundaries. Now the hard part: **every piece of data must be tagged** with `dt.security_context` for ABAC to actually filter anything. This module covers how to enrich every data type — hosts, services, logs, metrics, traces, entities, and Kubernetes workloads.

:::danger
⚠️ This is the #1 reason ABAC implementations fail: the policies are correct, but the data isn't tagged. If a log record doesn't have `dt.security_context`, no policy can filter it — the user either sees everything or nothing.
:::

## The Enrichment Challenge

Dynatrace recommends setting up permissions along **organizational lines and deployment scopes**. The primary attributes you can use without any extra setup:

```
Attribute               Available On                     Use Case
──────────────────────  ───────────────────────────────  ──────────────────────────────
dt.host_group.id        All telemetry from OneAgent       Team isolation by host group
k8s.cluster.name        All K8s telemetry                 Cluster-level isolation
k8s.namespace.name      All K8s namespace telemetry       Namespace-level isolation
dt.security_context     Must be explicitly set            Fine-grained custom isolation
```

:::tip
💡 If your isolation needs align with host groups, K8s clusters, or K8s namespaces, you can use those attributes DIRECTLY in policy boundaries — no extra enrichment needed. Only use `dt.security_context` when you need custom isolation that doesn't map to these deployment concepts.
:::

## Three Levels of Permission Setup

```
Level           Complexity  Use When
──────────────  ──────────  ──────────────────────────────────────────────────
Bucket-level    Low         Route data to buckets, restrict by bucket name
Deployment      Medium      Use dt.host_group.id, k8s.cluster/namespace directly
Security ctx    High        Custom isolation (team codes, business units, etc.)
```

## Method 1: OneAgent Host Properties (VM/Bare Metal)

For hosts monitored by OneAgent, set the security context as a **host property**:

```bash
# Set security context on the host (Linux)
sudo /opt/dynatrace/oneagent/agent/tools/oneagentctl \
  --set-host-property=dt.security_context=SV-PAYMENTS.PRD

# Windows
.\oneagentctl.exe --set-host-property=dt.security_context=SV-PAYMENTS.PRD

# Verify
sudo /opt/dynatrace/oneagent/agent/tools/oneagentctl --get-host-properties
```

:::danger
⚠️ Use `--set-host-property` (NOT `--set-host-tag`). Host properties and host tags are different things in Dynatrace. The `dt.security_context` must be set as a host PROPERTY for it to propagate to all telemetry data (metrics, spans, events, logs) collected by OneAgent on that host.
:::

### What Propagates Automatically

```
Host property: dt.security_context=SV-PAYMENTS.PRD
    ↓ propagates to ALL telemetry from that host:
    ├── Metrics (dt.host.cpu.*, dt.host.memory.*, etc.)
    ├── Spans from services on that host
    ├── Events from that host
    ├── Logs collected from that host
    └── Entities (host, process groups, services)
```

### At Install Time (Recommended for New Deployments)

```bash
# Set during OneAgent installation
sudo /bin/sh Dynatrace-OneAgent-Linux.sh \
  --set-host-group=payments-prod \
  --set-host-property=dt.security_context=SV-PAYMENTS.PRD \
  --set-host-property=dt.cost.costcenter=CC-1234 \
  --set-host-property=dt.cost.product=payment-gateway
```

:::note
🛠 The `dt.security_context` value can be hierarchical: `department-A/department-AB/team-C`. Use `MATCH` in policies to match hierarchically (e.g., `MATCH ("department-A")` matches all sub-departments).
:::

## Method 2: Entity Security Context via Settings (MZ Bridge)

Dynatrace provides a built-in bridge from management zones to security context for **entities**. This is configured via:

```
Settings → Topology model → Grail security context for monitored entities
Schema: builtin:monitoredentities.grail.security.context
```

By default, Dynatrace uses management zones to set `dt.security_context` on entities. This means during migration, your existing MZs automatically provide entity-level security context!

```hcl
# Terraform: override entity security context source
resource "dynatrace_grail_security_context" "host" {
  entity_type          = "HOST"
  destination_property = "hostGroupName"  # derive from host group
}

resource "dynatrace_grail_security_context" "service" {
  entity_type          = "SERVICE"
  destination_property = "managementZones"  # derive from MZ (default)
}
```

:::tip
💡 This is the migration bridge: your existing management zones automatically set `dt.security_context` on entities. You don't need to manually tag every entity — just ensure your MZs are correct, and entity-level ABAC works immediately.
:::

:::danger
⚠️ This only covers ENTITY access (`storage:entities:read`). It does NOT automatically tag logs, metrics, or spans. For telemetry data, you still need host properties, K8s enrichment, or OpenPipeline.
:::

## Method 3: Kubernetes Metadata Enrichment (Recommended for K8s)

For Kubernetes, the Dynatrace Operator enriches ALL telemetry with K8s metadata. Two approaches:

### Option A: Namespace Labels via Enrichment Rules (Recommended)

Map existing namespace labels to `dt.security_context`:

```yaml
# Your existing namespace already has labels:
apiVersion: v1
kind: Namespace
metadata:
  name: payments
  labels:
    team: payments
    cost-center: CC-1234
```

```hcl
# Terraform: map namespace label → dt.security_context
resource "dynatrace_kubernetes_enrichment" "security" {
  scope = "environment"
  rules {
    rule {
      type   = "LABEL"
      source = "team"
      target = "dt.security_context"
    }
    rule {
      type   = "LABEL"
      source = "cost-center"
      target = "dt.cost.costcenter"
    }
  }
}
```

This enriches ALL telemetry: metrics, events, logs, spans, AND entities from that namespace.

### Option B: Dedicated Pod Annotations (Fallback Only)

```yaml
# Pod annotation (only when namespace labels won't work)
apiVersion: v1
kind: Pod
metadata:
  annotations:
    metadata.dynatrace.com/dt.security_context: SV-PAYMENTS.PRD
    metadata.dynatrace.com/dt.cost.costcenter: CC-1234
    metadata.dynatrace.com/dt.cost.product: payment-gateway
```

:::danger
⚠️ Pod annotations do NOT provide full enrichment. They do NOT enrich: Kubernetes metrics, Kubernetes events, Kubernetes Smartscape entities, or Prometheus metrics. Use namespace labels via enrichment rules (Option A) whenever possible.
:::

### Enrichment Hierarchy (Operator 1.3.0+)

```
Priority  Source                          Enriches
────────  ──────────────────────────────  ──────────────────────────────────────
1 (high)  Pod annotation                  Pod + containers (NOT K8s metrics/events)
2         Namespace annotation/label      Namespace + workloads + services + pods
3 (low)   Node annotation                 Node only

Rule: Pod annotations override namespace annotations.
      Namespace annotations are copied down to pods if not already set.
```

## Method 4: OpenPipeline Security Context Processors

For data that doesn't come from OneAgent or K8s (external logs, API-ingested events, third-party spans), use OpenPipeline's dedicated **Set Security Context** processor:

```
OpenPipeline → [Data Type] → Pipeline → Permission tab → Set Security Context

1. Define matching condition: matchesValue(http.route, "/basket")
2. Set dt.security_context value: "TeamA" (literal or from another field)
3. Repeat for each data type (logs, metrics, spans)
```

:::note
🛠 The Security Context processor is on the **Permission tab** in OpenPipeline — not the Processing tab. It's a dedicated processor type specifically for setting `dt.security_context`.
:::

### Use Cases for OpenPipeline Enrichment

```
Scenario                                    Matching Condition
──────────────────────────────────────────  ──────────────────────────────────────
Logs from external syslog (no OneAgent)     Match on source IP or hostname
Business events from API ingest             Match on event.type or source
Spans from OpenTelemetry (no OneAgent)      Match on service.name
Metrics from cloud integrations (GCP/Azure) Match on cloud.account or project
```

## The Complete Enrichment Strategy

```
Infrastructure Type     Primary Method                    Terraform Resource
──────────────────────  ──────────────────────────────── ──────────────────────────────────
VMs (Linux/Windows)     oneagentctl --set-host-property   (manual or Ansible)
Kubernetes              K8s metadata enrichment rules     dynatrace_kubernetes_enrichment
Entities (MZ bridge)    Settings: Grail security context  dynatrace_grail_security_context
External/API data       OpenPipeline Security Context     dynatrace_openpipeline_*
```

## Verifying Enrichment

After setting up enrichment, verify that data is actually tagged:

```dql
// Check hosts have security context (as entity property)
fetch dt.entity.host
| fields entity.name, dt.security_context
| filter isNotNull(dt.security_context)

// Check logs have security context
fetch logs, from:now()-1h
| filter isNotNull(dt.security_context)
| summarize count(), by:{dt.security_context}

// Check spans have security context
fetch spans, from:now()-1h
| filter isNotNull(dt.security_context)
| summarize count(), by:{dt.security_context}

// CRITICAL: Find UNTAGGED data (gaps in your enrichment)
fetch logs, from:now()-1h
| filter isNull(dt.security_context)
| summarize cnt=count(), by:{dt.host_group.id}
| sort cnt desc

// Check which host groups have no security context
fetch logs, from:now()-1h
| filter isNull(dt.security_context) AND isNotNull(dt.host_group.id)
| summarize cnt=count(), by:{dt.host_group.id}
| sort cnt desc
```

:::danger
⚠️ The "find untagged data" query is critical. These are your ABAC blind spots — data that no boundary can filter. Run this BEFORE enabling restrictive policies.
:::

## Alternative: Use Host Group Directly (Simpler)

If your team isolation maps cleanly to host groups, you can skip `dt.security_context` entirely and use `dt.host_group.id` in your boundaries:

```
// Boundary using host group directly (no enrichment needed!)
storage:dt.host_group.id = "payments-prod";

// Or with MATCH for hierarchical host groups:
storage:dt.host_group.id MATCH ("payments-*");
```

This works because `dt.host_group.id` is automatically available on all telemetry from OneAgent — no extra configuration needed.

:::tip
💡 Dynatrace's official recommendation: start with deployment-level attributes (host group, K8s namespace, K8s cluster). Only add `dt.security_context` when these don't provide enough granularity. Simpler is better.
:::

## Entity vs Telemetry Permissions (Critical Distinction)

A common misconception: "If I restrict entity access, the user can't see that entity's data."

**WRONG.** Entity permissions and telemetry permissions are INDEPENDENT:

```
// This restricts which ENTITIES the user can query:
ALLOW storage:entities:read
WHERE storage:dt.security_context MATCH ("SV-PAYMENTS");

// But it does NOT restrict logs, metrics, or traces!
// You need SEPARATE permissions for each data type:
ALLOW storage:logs:read
WHERE storage:dt.security_context MATCH ("SV-PAYMENTS");

ALLOW storage:metrics:read
WHERE storage:dt.security_context MATCH ("SV-PAYMENTS");

ALLOW storage:spans:read
WHERE storage:dt.security_context MATCH ("SV-PAYMENTS");
```

:::danger
⚠️ This is explicitly stated in the official Dynatrace docs: "Unlike management zones, an IAM policy that is set up to filter entities will NOT filter related metrics, logs, or traces. These entity filters only control which entities can be queried via DQL." This is the most common ABAC mistake.
:::

## The Role Policy Pattern (Solve It Once)

Instead of writing separate policies per data type, write ONE comprehensive role policy that covers everything:

```
// Analyst role policy — covers ALL data types in one statement
ALLOW storage:logs:read,
      storage:metrics:read,
      storage:events:read,
      storage:spans:read,
      storage:entities:read,
      storage:bizevents:read,
      storage:security.events:read;
```

Then bind with a boundary that restricts ALL of them at once:

```
// Boundary: storage:dt.security_context MATCH ("SV-PAYMENTS.PRD")
// This single boundary restricts ALL permissions in the policy
```

:::tip
💡 This is exactly what the V3.1 model does: one "role policy" with all data permissions, bound with a boundary. The boundary is the single point of control for data isolation.
:::

## Timeline for Enrichment Rollout

```
Week  Action                                  Coverage
────  ──────────────────────────────────────  ──────────────────────────
1     Verify MZ→entity bridge is active        Entities (automatic)
2     Set host properties on all VMs           Host telemetry (metrics, logs, spans)
3     Configure K8s metadata enrichment        All K8s workload telemetry
4     Add OpenPipeline rules for gaps          External logs, API events
5     Verify with DQL queries                  Find remaining gaps
6     Enable ABAC policies (pilot team)        Test with one team first
7     Roll out to all teams                    Full access control
```

:::danger
⚠️ Don't enable restrictive ABAC policies until enrichment is verified. If you restrict access before data is tagged, users will lose visibility. Tag first, verify, then restrict.
:::

<details>
<summary>📝 Knowledge Check</summary>
<div class="quiz">
<p><strong>Q: What's the difference between <code>--set-host-tag</code> and <code>--set-host-property</code> for security context?</strong></p>
<p>A: <code>--set-host-property</code> is the correct command for <code>dt.security_context</code>. Host properties propagate to ALL telemetry data (metrics, spans, events, logs). Host tags are metadata on the entity only — they don't propagate to telemetry records in Grail. The official Dynatrace docs explicitly use <code>--set-host-property</code>.</p>
<p><strong>Q: A team reports they can't see any logs after ABAC was enabled. What's the most likely cause?</strong></p>
<p>A: The logs aren't tagged with <code>dt.security_context</code>. The ABAC policy filters on this attribute, but if the logs don't have it, the filter matches nothing. Check with: <code>fetch logs | filter isNull(dt.security_context) | limit 10</code>. Then check if the host has the property set: <code>oneagentctl --get-host-properties</code>.</p>
<p><strong>Q: You restrict entity access for a team. Can they still query metrics from those entities?</strong></p>
<p>A: YES. Entity permissions and telemetry permissions are independent. The official docs state: "an IAM policy that filters entities will NOT filter related metrics, logs, or traces." You need separate permissions for each data type, or use one combined role policy with a boundary.</p>
<p><strong>Q: For Kubernetes, should you use pod annotations or namespace labels for security context?</strong></p>
<p>A: Namespace labels via enrichment rules (recommended). Pod annotations do NOT enrich K8s metrics, K8s events, K8s Smartscape entities, or Prometheus metrics. Namespace labels provide full enrichment across all telemetry types.</p>
<p><strong>Q: Can you skip dt.security_context entirely and just use host groups in boundaries?</strong></p>
<p>A: Yes! If your isolation maps to host groups, use <code>storage:dt.host_group.id = "my-group"</code> directly in boundaries. No extra enrichment needed — host group is automatically available on all OneAgent telemetry. Only add dt.security_context when host groups don't provide enough granularity.</p>
<p><strong>Q: During migration, how do entities get their security context without manual tagging?</strong></p>
<p>A: Dynatrace automatically maps management zones to <code>dt.security_context</code> on entities via the <code>builtin:monitoredentities.grail.security.context</code> setting. Your existing MZs provide entity-level ABAC out of the box. But this only covers entities — telemetry data still needs explicit enrichment.</p>
</div>
</details>

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"32%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🔐"," ","Phase 1: Set Up Access & Data Architecture"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",7]}],["$","span",null,{"className":"ml-auto text-xs text-gray-600","children":[9," min read · ",8,"/",25]}]]}],["$","h1",null,{"className":"text-3xl font-bold tracking-tight","children":"Security Context Enrichment: Tagging All Data"}],["$","div",null,{"className":"flex items-center gap-2 mt-2","children":[["$","span",null,{"className":"inline-block text-xs bg-
