---
title: "Getting Started"
course: "From Zero to Hero"
track: "Track 1: Foundation"
moduleNumber: 2
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__02-getting-started" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Getting Started

Once OneAgent is installed and data is flowing, here's how to navigate the platform.

## The Universal Search: Ctrl+K

Press **Ctrl+K** (or Cmd+K on Mac) anywhere in Dynatrace. This is the fastest way to find anything:

```
Type This           What Opens
──────────────────  ──────────────────────────────────────
hosts               Host list with health status
services            Service list with response times
dashboards          Dashboard list (create or open)
notebooks           Notebook list (interactive analysis)
problems            Active problems with root cause
settings            All configuration settings
workflows           Automation workflows
logs                Log viewer
```

:::note
🛠 **Try it:** Press Ctrl+K → "Infrastructure & Operations" → click any host → scroll down to see every process running on it, every service it hosts, and every network connection it makes. Dynatrace discovered all of this automatically from a single agent install.
:::

## Key Apps

```
App                 What It Does                              When to Use
──────────────────  ──────────────────────────────────────    ──────────────────────────
Dashboards          Visual tiles with DQL queries              Daily monitoring, KPIs
Notebooks           Interactive DQL analysis (like Jupyter)    Investigation, exploration
Problems            Davis AI detected issues                   Incident response
Distributed Tracing Request-level trace analysis               Performance debugging
Logs                Log search and analysis                    Error investigation
Workflows           Automation (triggers → actions)            Alerts, reports, remediation
Settings            All platform configuration                 Setup, tuning
```

## Account Management

Dynatrace has two levels of management:

```
Level               URL                             What You Manage
──────────────────  ──────────────────────────────  ──────────────────────────
Environment         ENV-ID.apps.dynatrace.com       Monitoring, dashboards, alerts
Account             myaccount.dynatrace.com         Users, groups, policies, billing
```

## Authentication Methods

```
Method              Best For                        Scope
──────────────────  ──────────────────────────────  ──────────────────────────
API Token           Settings, extensions, classic    Environment-level
OAuth Client        Workflows, dashboards, IAM       Account-level (automation)
Platform Token      Scripts, integrations            User-scoped (long-lived)
```

:::tip
💡 For getting started, you don't need any tokens — just log in to the UI. Tokens are for automation and API access, which is covered in Track 4.
:::

## The Settings Hierarchy

All configuration in Dynatrace follows the Settings 2.0 pattern:

```
Settings → Schema ID → Scope → Value

Example:
  Schema: builtin:davis.anomaly-detectors
  Scope:  environment
  Value:  { title: "High CPU", query: "timeseries avg(dt.host.cpu.usage)..." }
```

Every setting you see in the UI is a Settings 2.0 schema. You can automate any setting via the API or Terraform.

## OneAgent Post-Install Configuration

After installing OneAgent, use `oneagentctl` to configure it:

```bash
# Location: /opt/dynatrace/oneagent/agent/tools/oneagentctl (needs root)

# Check status
oneagentctl --version                          # Show version
oneagentctl --get-host-group                   # Show host group

# Set host group (for organizing hosts)
oneagentctl --set-host-group=production

# Set Primary Grail Fields (for access control + cost allocation)
oneagentctl --set-host-property=dt.security_context=SV-PAYMENTS.PRD
oneagentctl --set-host-property=dt.cost.costcenter=CC-1234
oneagentctl --set-host-property=dt.cost.product=payment-gateway

# Set Primary Grail Tags (for routing, segments, filtering)
oneagentctl --set-host-tag=primary_tags.team=payments
oneagentctl --set-host-tag=primary_tags.environment=production

# Set classic tags (entity metadata only)
oneagentctl --set-host-tag=environment=prod

# Other useful commands
oneagentctl --get-auto-update-enabled          # Check auto-update
oneagentctl --set-auto-update-enabled=false    # Pin version
oneagentctl --create-support-archive           # Diagnostic bundle
```

:::danger
⚠️ `--set-host-property` is for Primary Grail Fields (dt.security_context, dt.cost.*) — these propagate to ALL telemetry and can be used in IAM boundaries. `--set-host-tag=primary_tags.*` is for Primary Grail Tags — these propagate to all telemetry but can't be used in IAM boundaries. Plain `--set-host-tag=key=value` (no prefix) is a classic tag — entity metadata only.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":[{"id":"hero-foundation","title":"Track 1: Foundation","description":"What is observability, how Dynatrace works, set up access, and get your first data","icon":"🏗️","modules":[{"number":0,"slug":"00-what-is-observability","title":"What is Observability","type":"Tutorial"},{"number":1,"slug":"01-dynatrace-platform","title":"The Dynatrace Platform","type":"Tutoria
