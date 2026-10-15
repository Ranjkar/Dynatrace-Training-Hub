---
title: "The New UI & Settings"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 0: Understand the Shift"
moduleNumber: 1
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__01-navigation-ui" data-course-slug="migration">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Navigating the New Platform

The first thing that changes after migration is the UI. Gen3 replaces the left sidebar with a unified **app launcher**. Instead of fixed menu items, every feature is an app — searchable, pinnable, and customizable.

:::note
🛠 **Try it:** Press **Ctrl+K** → type "Smartscape" → open it. You'll see your entire infrastructure as an interactive dependency graph: hosts → processes → services → applications. Click any node to drill into its health, then follow the connections to see what depends on it.
:::

Navigation comparison diagram

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
<!-- Gen2 -->
<rect fill="#1f2937" height="28" rx="6" width="340" x="20" y="10"></rect>
<text fill="#f87171" font-size="12" font-weight="bold" text-anchor="middle" x="190" y="29">Gen2: Fixed Left Sidebar</text>
<rect fill="#0f172a" height="140" rx="8" stroke="#475569" stroke-width="1" width="340" x="20" y="45"></rect>
<text fill="#94a3b8" font-size="11" x="40" y="68">▸ Infrastructure</text>
<text fill="#94a3b8" font-size="11" x="40" y="88">▸ Applications &amp; Microservices</text>
<text fill="#94a3b8" font-size="11" x="40" y="108">▸ Digital Experience</text>
<text fill="#94a3b8" font-size="11" x="40" y="128">▸ Cloud Automation</text>
<text fill="#94a3b8" font-size="11" x="40" y="148">▸ Manage → Settings</text>
<text fill="#94a3b8" font-size="11" x="40" y="168">▸ Manage → Access tokens</text>
<text fill="#38bdf8" font-size="28" text-anchor="middle" x="400" y="115">→</text>
<!-- Gen3 -->
<rect fill="#0c4a6e" height="28" rx="6" width="340" x="440" y="10"></rect>
<text fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle" x="610" y="29">Gen3: App Launcher + Search</text>
<rect fill="#0f172a" height="140" rx="8" stroke="#38bdf8" stroke-width="1" width="340" x="440" y="45"></rect>
<text fill="#7dd3fc" font-size="11" x="460" y="68">🔍 Ctrl+K → search anything</text>
<text fill="#7dd3fc" font-size="11" x="460" y="92">📱 Infrastructure &amp; Ops</text>
<text fill="#7dd3fc" font-size="11" x="460" y="112">📱 Application Observability</text>
<text fill="#7dd3fc" font-size="11" x="460" y="132">📱 Automations (Workflows)</text>
<text fill="#7dd3fc" font-size="11" x="460" y="152">📱 Settings (search or browse)</text>
<text fill="#64748b" font-size="10" x="460" y="172">Pin your favorites · Rearrange · Custom apps</text>
</svg>
</div>

## Key UI Changes

### Notebooks Replace Data Explorer

The classic Data Explorer still exists but is a legacy feature tied to classic dashboards. Use **Notebooks** instead — interactive documents combining DQL queries, markdown notes, and shareable analysis.

:::note
🛠 **Try it:** Ctrl+K → "Notebooks" → Create new → Add a DQL section → type `fetch dt.entity.host | limit 5`
:::

### Dashboards Are DQL-Powered

Classic dashboards used pre-built tiles. Gen3 dashboards use DQL queries for every tile — more flexible, but requires DQL knowledge.

### Problems View

The Problems screen looks similar but now shows data from `dt.davis.problems` in Grail. You can query problems with DQL directly.

## Where Did My Settings Go?

```
GEN2 Location                           GEN3 Location
──────────────────────────────────────  ──────────────────────────────────────
Settings → Monitoring → OneAgent        Settings app → OneAgent
Settings → Anomaly detection            Anomaly detectors app (or Settings)
Settings → Alerting → Alerting profiles Workflows app (no more alerting profiles)
Settings → Integration → Problem notif. Workflows app → email/Slack actions
Settings → Tags → Auto-tagging          Settings app → Tags → Auto-tagging
Settings → Web and mobile → Apps        RUM app → Application settings
Manage → Access tokens                  Access tokens still exist + OAuth clients
Manage → Deploy Dynatrace               Deploy app (or Deployment API)
```

## Account Management Portal

Gen3 introduces a separate **Account Management** portal for:

- User and group management (moved from environment level)
- OAuth client creation (for workflows, automation, and API access)
- Policy and permission management (ABAC)
- Environment provisioning and license management

:::tip
💡 URL: **myaccount.dynatrace.com** (production) or your SSO portal. API tokens still work for many use cases — OAuth is required for workflows, dashboards, and account-level operations.
:::

## 🔧 Migration Step: Restrict Users to Latest Apps

Once you're ready to migrate, you can restrict users to the latest Dynatrace apps so they stop using classic features:

1. Go to **Settings → General → Latest Dynatrace**
2. Enable **"Restrict to latest apps"** — this hides classic dashboards, classic alerting profiles, and other Gen2 UI elements
3. Users will only see Gen3 apps (Dashboards, Notebooks, Workflows, Anomaly Detection)

:::danger
⚠️ Only enable this AFTER you've migrated dashboards, alerts, and notifications. Otherwise users lose access to their tools before replacements are ready.
:::

## 🔧 Migration Step: Export Your Gen2 Inventory

Before changing anything, export everything from your Gen2 environment:

```bash
# Option A: Export ALL configuration with Monaco (→ YAML)
monaco download \
  --url https://YOUR-ENV.live.dynatrace.com \
  --token-name DT_API_TOKEN \
  --output-folder gen2-export

# Option B: Export with Terraform provider (→ .tf files)
# After terraform init, invoke the provider binary directly:
cd .terraform/providers/registry.terraform.io/dynatrace-oss/dynatrace/*/linux_amd64/
./terraform-provider-dynatrace -export -ref

# Both create files for every setting, dashboard, alert, MZ, etc.
# Use this as your migration reference and rollback safety net
```

:::tip
💡 The Monaco or Terraform export is your insurance policy. Even if you use the built-in upgrade tools, having a full export means you can always recreate anything that goes wrong. Monaco exports YAML, Terraform manages state — use whichever fits your workflow.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"8%"}}]}],["$","div",null,{"className":"mb-8","children":[["$"
