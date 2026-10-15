---
title: "Go-Live Checklist & Optimization"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 5: Config-as-Code & Go Live"
moduleNumber: 24
lessonType: "Reference"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__20-migration-checklist" data-course-slug="migration">
<em>Format: Reference &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Migration Checklist

A structured approach to migrating from Gen2 to Gen3. Follow these 5 phases.

## SaaS Upgrade Assistant

If you're migrating from **Dynatrace Managed** to SaaS, use the **SaaS Upgrade Assistant** — a Dynatrace app that automates most of the configuration migration:

```
Step  Action                                  Where
────  ──────────────────────────────────────  ──────────────────────────────────
1     Install SaaS Upgrade Assistant            Hub → search "SaaS Upgrade Assistant"
2     Export config from Managed environment    Managed cluster → Export configuration
3     Upload to SaaS Upgrade Assistant          Open app → Upload data → select export
4     Create or provide API token               App generates one, or use your own
5     Review imported configurations            App shows what was imported + warnings
6     Fix any warnings                          Manual adjustments for incompatible configs
7     Migrate OneAgents                         Remote Configuration Management wizard
```

:::tip
💡 The SaaS Upgrade Assistant handles: settings, dashboards, alerting profiles, management zones, auto-tagging rules, and more. It also migrates OneAgent communication settings so agents reconnect to the new SaaS environment automatically.
:::

:::danger
⚠️ The SaaS Upgrade Assistant is for **Managed → SaaS** migration. If you're already on SaaS and upgrading from classic to latest Dynatrace, use the individual upgrade tools (Dashboard upgrade button, Anomaly Detection transpiler, etc.).
:::

## Official Dynatrace Upgrade Guides

```
Guide                                   URL
──────────────────────────────────────  ──────────────────────────────────────
Master guide (data access, retention)   docs.dynatrace.com → Upgrade to latest
Segments (MZ replacement)               docs.dynatrace.com → Upgrade guide Segments
Dashboards (built-in upgrade)           docs.dynatrace.com → Upgrade guide Dashboards
Metric Alerting (transpiler)            docs.dynatrace.com → Upgrade guide Metric Alerting
Alert Notifications (→ Workflows)       docs.dynatrace.com → Upgrade guide Alert Notification
Restrict to latest apps                 docs.dynatrace.com → Upgrade guide Restrict
```

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 80" xmlns="http://www.w3.org/2000/svg">
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="2" width="180" x="10" y="20"></rect>
<text fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle" x="100" y="45">1. Prepare</text>
<text fill="#475569" font-size="16" x="200" y="45">→</text>
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="2" width="180" x="210" y="20"></rect>
<text fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle" x="300" y="45">2. Build</text>
<text fill="#475569" font-size="16" x="400" y="45">→</text>
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="2" width="180" x="410" y="20"></rect>
<text fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle" x="500" y="45">3. Test</text>
<text fill="#475569" font-size="16" x="600" y="45">→</text>
<rect fill="#14532d" height="40" rx="8" stroke="#22c55e" stroke-width="2" width="180" x="610" y="20"></rect>
<text fill="#86efac" font-size="12" font-weight="bold" text-anchor="middle" x="700" y="45">4. Go Live</text>
</svg>
</div>

## Phase 1: Prepare (1-2 weeks)

- ☐ Inventory all Gen2 dashboards, alerts, management zones
- ☐ Export Gen2 configs with Monaco (`monaco download`) or Terraform provider export (`./terraform-provider-dynatrace -export`)
- ☐ Identify which configs have Gen3 equivalents
- ☐ Set up OAuth client in Account Management portal
- ☐ Create Segments to replace management zones

## Phase 2: Build (2-4 weeks)

- ☐ Recreate dashboards with DQL tiles
- ☐ Replace metric events with anomaly detectors
- ☐ Replace alerting profiles with Workflows
- ☐ Migrate SLOs to platform SLO API
- ☐ Set up IAM policies (ABAC) to replace management zones
- ☐ Convert USQL queries to DQL

## Phase 3: Test (1 week)

- ☐ Run Gen2 and Gen3 alerting side-by-side
- ☐ Compare dashboard data between old and new
- ☐ Verify SLO values match
- ☐ Test workflow notifications (email, Slack, Jira)
- ☐ Validate IAM policies with test users

## Phase 4: Go Live

- ☐ Disable Gen2 alerting profiles (don't delete yet)
- ☐ Switch teams to Gen3 dashboards
- ☐ Monitor for 1 week — compare alert volumes
- ☐ After validation, decommission Gen2 configs
- ☐ Document the new setup

:::tip
💡 **Key rule:** Disable Gen2 configs at go-live but don't delete. After 1 week of validation, decommission them. This gives you a rollback path.
:::

## Phase 5: Optimize (Ongoing)

- □ Set up **OpenPipeline** for log routing, enrichment, and cost optimization
- □ Create custom Grail buckets for different retention needs
- □ Build Smartscape views for your key services
- □ Configure SLO burn-rate alerts via Anomaly Detection
- □ Set up auto-remediation workflows for common problems

:::tip
💡 Migration is not a one-time event. Plan for 2-4 weeks of build, then ongoing optimization as you discover Gen3 capabilities that didn't exist in Gen2.
:::

## Timeline Estimates

```
Phase       Duration    Team Size    Key Deliverables
──────────  ──────────  ───────────  ──────────────────────────────────────
Prepare     1-2 weeks   1-2 people   Inventory, OAuth setup, segment design
Build       2-4 weeks   2-3 people   Dashboards, alerts, workflows, IAM
Test        1 week      1-2 people   Side-by-side validation
Go Live     1 day       1 person     Switch over, disable Gen2
Optimize    Ongoing     1 person     OpenPipeline, custom buckets, auto-remediation
```

## Risk Mitigation

```
Risk                                    Mitigation
──────────────────────────────────────  ──────────────────────────────────────
Alert gaps during migration             Run Gen2 + Gen3 in parallel for 1 week
DQL learning curve for team             Davis CoPilot generates DQL from English
OAuth token expiry (300s)               Use service users for automation
Management zone removal breaks access   Map MZs to Segments + ABAC BEFORE removing
Workflow misconfiguration               Test with manual trigger before enabling
```

## Business Case for the Migration

```
Metric                    Before (Gen2)              After (Gen3)
────────────────────────  ─────────────────────────  ─────────────────────────
Mean Time to Detect       Minutes (static thresholds) Seconds (adaptive + seasonal)
Mean Time to Resolve      Hours (manual)              Minutes (auto-remediation)
Query languages to learn  9 (USQL, metric expr, ...)  1 (DQL)
Alert noise               High (no adaptive)          Low (3 analyzer models)
Data access granularity   Entity-level (MZ)           Field-level (ABAC)
Cost visibility           Manual calculation           Built-in (dt.cost.* tags)
Compliance readiness      Manual log management        Custom buckets + retention
```

:::tip
💡 The strongest argument for migration: Gen3 reduces operational toil. One language, one platform, one access model. Less time switching tools, more time solving problems.
:::

## Congratulations! 🎉

You've completed the Gen2 → Gen3 Migration Guide. You now have everything you need to:

- Build the business case for migration (Phase 0)
- Write DQL queries for any data type (Phase 1)
- Migrate dashboards, notebooks, and variables (Phase 2)
- Replace metric events, alerting profiles, and SLOs (Phase 3)
- Set up Segments, ABAC, and config-as-code (Phase 4)

## Post-Migration Maturity Assessment

After go-live, assess your Gen3 maturity across 8 criteria. This is the framework used by Dynatrace ACE Services:

```
Criteria                  Stage 1 (Basic)         Stage 3 (Advanced)        Stage 4 (Proactive)
────────────────────────  ──────────────────────  ────────────────────────  ────────────────────────
Infrastructure            OneAgent installed       Tags + host groups        Full-stack with K8s
Services & Apps           Services detected        RUM + synthetic           Business events captured
Dashboards                1-2 basic dashboards     DQL dashboards + vars     Executive reports + cost
Alerting & SLOs           Static thresholds        P1/P3 pairs + SLO tiers  Burn rate + adaptive
Automation                Manual notifications     Workflows + email         Auto-remediation
Synthetic                 None                     HTTP checks               Browser monitors + SLA
Security                  Default settings          Vuln alerting            Attack protection ON
Platform Adoption         API tokens only           OAuth + Segments         ABAC + Terraform + CI/CD
```

:::tip
💡 Target Stage 3 (Advanced) within 4 weeks of go-live. Stage 4 (Proactive) is the ongoing optimization goal — auto-remediation, burn rate alerting, and full config-as-code.
:::

## Migration Summary Presentation

```
Slide  Content                                  Data Source
─────  ────────────────────────────────────────  ──────────────────────────
1      Migration timeline + completion status     This checklist
2      Before/after: tools consolidated           9 tools → 1 (DQL)
3      Alert quality improvement                  P1/P3 count, false positive rate
4      MTTR reduction                             Davis problems → resolution time
5      Cost optimization                          Grail retention savings
6      Maturity score                             8-criteria assessment (above)
7      Next steps: Phase 5 optimization           OpenPipeline, auto-remediation
```

:::note
🛠 **Try it:** Open Account Management → IAM → review your current groups, policies, and bindings. Run `fetch dt.entity.host | summarize count(), by:{tags}` to check your host tagging — tags drive ABAC boundaries and cost allocation.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"100%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🚀"," ","Phase 5: Config-as-Code & Go Live"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",24]}],["$","span",null,{"className":"ml-auto text-xs text-gray-600","children":[5," min read · ",25,"/",25]}]]}],["$","h1",null,{"className":"text-3xl font-bold tracking-tight","children":"Go-Live Checklist & Optimization"}],["$","div",null,{"className":"flex items-center gap-2 mt-2","children":[["$","span",null,{"className":"inline-block text-xs bg-[#161b22] text-gray-400 px-2.5 py-0.5 rounded-full border border-[#30363d]","children":"Reference"}],false]}]]}],["$","$L16",null,{"content":"$17","exercises":
