---
title: "Why Migrate — Business Case & Vision"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 0: Understand the Shift"
moduleNumber: 0
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__00-whats-new" data-course-slug="migration">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Gen2 → Gen3 Migration Guide

This guide walks through migrating from Dynatrace Classic (Gen2) to the Latest Dynatrace (Gen3) — step by step, phase by phase. Each module explains what changed, how to convert existing settings, and what the new equivalent looks like.

## Migration Roadmap

Phase diagram

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
<rect fill="#0f172a" height="70" rx="8" stroke="#38bdf8" stroke-width="2" width="140" x="10" y="20"></rect>
<text fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" x="80" y="45">Phase 0</text>
<text fill="#64748b" font-size="9" text-anchor="middle" x="80" y="62">Understand</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="80" y="78">4 modules</text>
<text fill="#475569" font-size="18" x="162" y="60">→</text>
<rect fill="#0f172a" height="70" rx="8" stroke="#38bdf8" stroke-width="2" width="140" x="175" y="20"></rect>
<text fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" x="245" y="45">Phase 1</text>
<text fill="#64748b" font-size="9" text-anchor="middle" x="245" y="62">Learn DQL</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="245" y="78">5 modules</text>
<text fill="#475569" font-size="18" x="327" y="60">→</text>
<rect fill="#0f172a" height="70" rx="8" stroke="#38bdf8" stroke-width="2" width="140" x="340" y="20"></rect>
<text fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" x="410" y="45">Phase 2</text>
<text fill="#64748b" font-size="9" text-anchor="middle" x="410" y="62">Dashboards</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="410" y="78">3 modules</text>
<text fill="#475569" font-size="18" x="492" y="60">→</text>
<rect fill="#0f172a" height="70" rx="8" stroke="#38bdf8" stroke-width="2" width="140" x="505" y="20"></rect>
<text fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" x="575" y="45">Phase 3</text>
<text fill="#64748b" font-size="9" text-anchor="middle" x="575" y="62">Alerting &amp; SLOs</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="575" y="78">4 modules</text>
<text fill="#475569" font-size="18" x="657" y="60">→</text>
<rect fill="#0f172a" height="70" rx="8" stroke="#38bdf8" stroke-width="2" width="120" x="670" y="20"></rect>
<text fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" x="730" y="45">Phase 4</text>
<text fill="#64748b" font-size="9" text-anchor="middle" x="730" y="62">Access &amp; Go Live</text>
<text fill="#64748b" font-size="10" text-anchor="middle" x="730" y="78">9 modules</text>
<text fill="#475569" font-size="11" text-anchor="middle" x="400" y="140">25 modules · Hands-on exercises · Migration steps · Quizzes</text>
</svg>
</div>

## What Needs to Be Migrated

Here's every Gen2 setting that has a Gen3 replacement, and where in this guide it's covered:

```
What You Have (Gen2)                    What to Migrate To (Gen3)                   Guide Module
──────────────────────────────────────  ──────────────────────────────────────────  ─────────────
Metric expressions (d:, :splitBy)       DQL timeseries command                      Module 05
USQL queries                            DQL fetch user.events / user.sessions       Module 07
Entity selectors                        DQL fetch dt.entity.* / smartscapeNodes     Module 06
Classic dashboards                      Gen3 dashboards (built-in upgrade button)   Module 09
Data Explorer visualizations            Notebooks                                   Module 10
Metric events (threshold alerts)        Anomaly detectors (built-in transpiler)     Module 12
Alerting profiles + notifications       Workflows + connectors                      Module 13
Classic SLOs                            Platform SLOs                               Module 14
Management zones                        Segments + host tags                        Module 16
Environment-level users/roles           Account-level IAM + ABAC policies           Module 17
API tokens (for new features)           OAuth clients                               Module 17
Settings API v1                         Settings 2.0                                Module 18
Terraform/Monaco configs                Updated resources + OAuth auth              Module 19
```

## Built-in Migration Tools

Many migrations are automated — no need to manually rewrite everything:

```
Tool                                    What It Does                                    How
──────────────────────────────────────  ──────────────────────────────────────────────  ──────────────────────
Dashboard Upgrade Button                Auto-converts classic dashboard tiles to DQL     Dashboards Classic → ⋮ → Upgrade
Anomaly Detection Transpiler            Auto-converts metric events to DQL detectors     Anomaly Detection → Improve metric events
Problems App Email                      Personal email alerts without admin setup        Problems → bell icon → subscribe
SaaS Upgrade Assistant                  Auto-imports Managed configs to SaaS             Hub → install → upload export
Monaco CLI                              Exports ALL config as YAML                       monaco download --url ...
Terraform Provider                      Declarative config-as-code with state            terraform plan → apply
```

:::tip
💡 Start with the automated tools. Use the Dashboard upgrade button and the Anomaly Detection transpiler first — they handle the bulk of the work. Then manually convert what they couldn't handle, using the DQL patterns in this guide.
:::

## What Changes vs What Stays

Architecture diagram

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 280" xmlns="http://www.w3.org/2000/svg">
<rect fill="#1f2937" height="30" rx="6" width="360" x="20" y="10"></rect>
<text fill="#f87171" font-size="14" font-weight="bold" text-anchor="middle" x="200" y="30">Gen2 (Classic)</text>
<rect fill="#1e293b" height="36" rx="6" stroke="#475569" stroke-width="1" width="100" x="30" y="50"></rect>
<text fill="#94a3b8" font-size="11" text-anchor="middle" x="80" y="73">Metric Explorer</text>
<rect fill="#1e293b" height="36" rx="6" stroke="#475569" stroke-width="1" width="100" x="140" y="50"></rect>
<text fill="#94a3b8" font-size="11" text-anchor="middle" x="190" y="73">USQL</text>
<rect fill="#1e293b" height="36" rx="6" stroke="#475569" stroke-width="1" width="120" x="250" y="50"></rect>
<text fill="#94a3b8" font-size="11" text-anchor="middle" x="310" y="73">Entity Selectors</text>
<rect fill="#1e293b" height="36" rx="6" stroke="#475569" stroke-width="1" width="100" x="30" y="96"></rect>
<text fill="#94a3b8" font-size="11" text-anchor="middle" x="80" y="119">Classic Dash</text>
<rect fill="#1e293b" height="36" rx="6" stroke="#475569" stroke-width="1" width="100" x="140" y="96"></rect>
<text fill="#94a3b8" font-size="11" text-anchor="middle" x="190" y="119">Metric Events</text>
<rect fill="#1e293b" height="36" rx="6" stroke="#475569" stroke-width="1" width="120" x="250" y="96"></rect>
<text fill="#94a3b8" font-size="11" text-anchor="middle" x="310" y="119">Alert Profiles</text>
<rect fill="#1e293b" height="36" rx="6" stroke="#475569" stroke-width="1" width="100" x="30" y="142"></rect>
<text fill="#94a3b8" font-size="11" text-anchor="middle" x="80" y="165">Mgmt Zones</text>
<rect fill="#1e293b" height="36" rx="6" stroke="#475569" stroke-width="1" width="100" x="140" y="142"></rect>
<text fill="#94a3b8" font-size="11" text-anchor="middle" x="190" y="165">API Tokens</text>
<rect fill="#1e293b" height="36" rx="6" stroke="#475569" stroke-width="1" width="120" x="250" y="142"></rect>
<text fill="#94a3b8" font-size="11" text-anchor="middle" x="310" y="165">Settings v1</text>
<text fill="#38bdf8" font-size="28" text-anchor="middle" x="400" y="120">→</text>
<rect fill="#0c4a6e" height="30" rx="6" width="360" x="420" y="10"></rect>
<text fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="middle" x="600" y="30">Gen3 (Latest Dynatrace)</text>
<rect fill="#0f172a" height="60" rx="8" stroke="#38bdf8" stroke-width="2" width="320" x="440" y="50"></rect>
<text fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle" x="600" y="75">Grail Data Lakehouse</text>
<text fill="#64748b" font-size="11" text-anchor="middle" x="600" y="95">Metrics · Logs · Traces · Events · Entities — all in one</text>
<rect fill="#172554" height="36" rx="6" stroke="#38bdf8" stroke-width="1" width="320" x="440" y="120"></rect>
<text fill="#7dd3fc" font-size="13" font-weight="bold" text-anchor="middle" x="600" y="143">DQL — One Query Language for Everything</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#38bdf8" stroke-width="1" width="100" x="440" y="168"></rect>
<text fill="#7dd3fc" font-size="11" text-anchor="middle" x="490" y="189">Dashboards</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#38bdf8" stroke-width="1" width="100" x="550" y="168"></rect>
<text fill="#7dd3fc" font-size="11" text-anchor="middle" x="600" y="189">Workflows</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#38bdf8" stroke-width="1" width="100" x="660" y="168"></rect>
<text fill="#7dd3fc" font-size="11" text-anchor="middle" x="710" y="189">Notebooks</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#38bdf8" stroke-width="1" width="100" x="440" y="210"></rect>
<text fill="#7dd3fc" font-size="11" text-anchor="middle" x="490" y="231">Segments</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#38bdf8" stroke-width="1" width="100" x="550" y="210"></rect>
<text fill="#7dd3fc" font-size="11" text-anchor="middle" x="600" y="231">IAM / ABAC</text>
<rect fill="#1e293b" height="32" rx="6" stroke="#38bdf8" stroke-width="1" width="100" x="660" y="210"></rect>
<text fill="#7dd3fc" font-size="11" text-anchor="middle" x="710" y="231">Settings 2.0</text>
<text fill="#64748b" font-size="11" text-anchor="middle" x="400" y="265">9 separate tools → 1 unified platform powered by Grail + DQL</text>
</svg>
</div>

Not everything changes. These stay the same:

- **OneAgent** — same installation, same auto-instrumentation
- **ActiveGate** — same role for extensions and routing
- **Davis AI** — same root cause analysis, now with **Davis CoPilot** (natural language → DQL)
- **Extensions 2.0** — same YAML format, same lifecycle
- **Kubernetes Operator** — same DynaKube CRD (v1beta6 in Operator 1.8.0+)

## Timeline

```
Phase       Duration    What Happens
──────────  ──────────  ──────────────────────────────────────────────────
Phase 0     1 week      Understand Grail, DQL, new UI — read Modules 00-03
Phase 1     1-2 weeks   Learn DQL by converting existing queries — Modules 04-08
Phase 2     1-2 weeks   Migrate dashboards (upgrade button + manual) — Modules 09-11
Phase 3     1-2 weeks   Migrate alerts, notifications, SLOs — Modules 12-15
Phase 4     1-2 weeks   Migrate access control, go live — Modules 16-20
──────────  ──────────  ──────────────────────────────────────────────────
Total       5-9 weeks   Full migration with parallel Gen2/Gen3 validation
```

## Why Migrate

```
Area                         Gen2 Pain                          Gen3 Solution
───────────────────────────  ──────────────────────────────────  ──────────────────────────────
Cost                         Separate stores, index overhead     Grail unifies, Datawarping eliminates indexes
Efficiency                   9 query tools, manual alerting      1 language (DQL), automated workflows
Scale                        Management zones don't scale        Segments: query-time, no pre-compute
AI                           Static thresholds, humans fix       3 analyzer models, auto-remediation, CoPilot
```

## Before Starting

```
Prerequisite                            How to Check
──────────────────────────────────────  ──────────────────────────────────────
Dynatrace SaaS with DPS license         Account Management → Subscription
Access to Account Management portal     myaccount.dynatrace.com
Admin permissions on the environment    Settings → check you can edit
Monaco CLI installed (optional)         monaco --version
Terraform installed (optional)          terraform --version
```

## 🔧 First Step: Export Everything

Before changing anything, create a full backup of the current configuration:

```bash
# Option A: Export with Monaco (→ YAML files)
monaco download --url https://ENV-ID.live.dynatrace.com \
  --token-name DT_API_TOKEN --output-folder gen2-backup

# Option B: Export with Terraform provider (→ .tf files, ready to apply)
# After terraform init:
cd .terraform/providers/registry.terraform.io/dynatrace-oss/dynatrace/*/linux_amd64/
./terraform-provider-dynatrace -export -ref
```

:::tip
💡 This export is the safety net. Even if the built-in upgrade tools handle most of the work, having a full backup means anything can be recreated if needed. Monaco exports YAML, Terraform exports HCL — use whichever fits your workflow.
:::

## Official Upgrade Resources

```
Resource                                    What It Covers
──────────────────────────────────────────  ──────────────────────────────────────
docs.dynatrace.com → Upgrade to latest DT   Master guide: data access, retention, segments
Upgrade Guide — Segments                    MZ → Segments with host tag propagation
Upgrade Guide — Dashboards                  Built-in upgrade button + top-50 strategy
Upgrade Guide — Metric Alerting             Transpiler: auto-converts metric events to DQL
Upgrade Guide — Alert Notifications         Alerting profiles → Workflows connector mapping
SaaS Upgrade Assistant (Hub app)            Auto-imports Managed configs to SaaS
```

:::note
🛠 **Try it:** Open Ctrl+K and explore the launcher. Type "Smartscape" to see the new dependency graph. Type "Notebooks" to try the collaborative investigation tool. Type "Workflows" to see the automation engine. These are the three biggest additions in latest Dynatrace.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"4%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🎯"," ","Phase 0: Understand the Shift"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",0]}],["$","span",null,{"className":"ml-auto text-xs text-gray-600","children":[4," min read · ",1,"/",25]}]]}],["$","h1",null,{"className":"text-3xl font-bold tracking-tight","children":"Why Migrate — Business Case & Vision"}],["$","div",null,{"className":"flex items-center gap-2 mt-2","children":[["$","span",null,{"className":"inline-block text-xs bg-[#161b22] text-gray-400 px-2.5 py-0.5 rounded-full border border-[#30363d]","children":"Tutorial"}],false]}]]}],["$","$L16",null,{"content":"$17","exercises":[],"quizzes":[],"accent":"text-emerald-400"}],"$L18"]}]
19:I[43329,["/_next/static/chun
