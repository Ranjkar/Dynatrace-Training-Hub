---
title: "Automate with Terraform & Monaco"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 5: Config-as-Code & Go Live"
moduleNumber: 23
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__19-terraform-monaco" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Updating Config-as-Code for Gen3

Existing Terraform and Monaco configurations need updates for Gen3 — new resource types, OAuth authentication, and platform endpoints. Both tools fully support the latest Dynatrace.

## Terraform

```
Provider: dynatrace-oss/dynatrace (v1.94.0+)

# 3 authentication modes:
1. API Token     → environment-level config (Settings, Extensions)
2. OAuth         → platform resources (Dashboards, Workflows, SLOs)
3. OAuth pref.   → use OAuth for API-token-compatible endpoints too
```

:::danger
⚠️ Gen3 resources (dashboards, workflows, SLOs, anomaly detectors) require OAuth env vars at `terraform apply` time: `DT_CLIENT_ID`, `DT_CLIENT_SECRET`, `DT_ACCOUNT_ID`.
:::

## Monaco CLI

```
Monaco v2.28.5 — Dynatrace-native configuration as code

# Export all config from an environment
monaco download --url https://ENVID.live.dynatrace.com \
  --token DT_API_TOKEN

# Deploy config to an environment
monaco deploy manifest.yaml --environment prod
```

:::tip
💡 Use Monaco for **brownfield export** (capture existing config as YAML), Terraform provider export for **brownfield export as HCL** (ready-to-apply .tf files), Terraform for **greenfield deployment** (define desired state).
:::

## 🔧 Migration Step: Export → Convert → Deploy

```
Step  Action                                  Command
────  ──────────────────────────────────────  ──────────────────────────────────
1     Export all Gen2 config                    Option A: monaco download (→ YAML)
                                                Option B: terraform-provider-dynatrace -export (→ HCL)
2     Review exported files                     ls -R gen2-export/
3     Identify what needs Gen3 equivalents      Dashboards, alerts, MZs, notifications
4     Convert to Terraform resources            Map each config to TF resource (table below)
5     Plan authentication                       API Token for settings, OAuth for platform
6     Deploy to Gen3 with Terraform             terraform plan → terraform apply
7     Verify via API                            python3 tools/dt_api.py alerts list
```

### Terraform Provider Export (generates .tf files directly)

The Dynatrace Terraform provider binary doubles as an export utility. After `terraform init`, invoke it directly:

```bash
# After terraform init, find the provider binary
cd .terraform/providers/registry.terraform.io/dynatrace-oss/dynatrace/*/linux_amd64/

# Export ALL configuration (generates .tf files in .configuration/ folder)
./terraform-provider-dynatrace -export

# Export specific resources
./terraform-provider-dynatrace -export dynatrace_alerting dynatrace_dashboard

# Export with dependencies and data sources
./terraform-provider-dynatrace -export -ref dynatrace_platform_slo dynatrace_automation_workflow

# Export and import into Terraform state (makes resources managed — use carefully)
./terraform-provider-dynatrace -export -import-state dynatrace_platform_slo

# Export all EXCEPT certain resources
./terraform-provider-dynatrace -export -ref -exclude dynatrace_json_dashboard
```

Set `DYNATRACE_ENV_URL` + `DYNATRACE_API_TOKEN` (or OAuth env vars) before running. Output goes to `.configuration/` by default, or set `DYNATRACE_TARGET_FOLDER`.

:::danger
⚠️ `-import-state` makes resources managed by Terraform. On next `terraform apply`, anything in state but NOT in your .tf files WILL BE DELETED. Only use if your config is complete.
:::

:::note
💡 Dashboards (`dynatrace_json_dashboard`) are excluded from export by default. To include them, specify explicitly: `-export dynatrace_json_dashboard`. Run `-export -list-exclusions` to see all excluded resources.
:::

### Monaco for Latest Dynatrace

Monaco v2.28+ has native support for latest Dynatrace resources:

```bash
# Download from latest Dynatrace (includes platform resources)
monaco download \
  --url https://YOUR-ENV.apps.dynatrace.com \
  --oauth-client-id DT_CLIENT_ID \
  --oauth-client-secret DT_CLIENT_SECRET \
  --output-folder latest-export

# Deploy to another environment
monaco deploy manifest.yaml --environment prod

# Check local configuration structure; does not verify API acceptance
monaco deploy manifest.yaml --dry-run
```

:::tip
💡 Use Monaco for **brownfield export** (capture what exists), Terraform for **greenfield deployment** (define desired state). During migration, you'll typically Monaco-export from Gen2, then Terraform-deploy to Gen3.
:::

## When to Use What

```
Tool        Best For                            State Management
──────────  ──────────────────────────────────  ──────────────────
Terraform   New deployments, multi-env, IaC     Yes (terraform.tfstate)
Monaco      Export existing, migrate, sync      No (idempotent apply)
dtctl       Quick CLI operations, debugging     No (imperative)
dt_api.py   Scripted automation, AI agents      No (imperative)
```

:::note
For a manifest-based export, use `monaco download --manifest manifest.yaml --environment my-env`. The file must define an environment named `my-env`. Review the generated YAML files and identify which configurations need Gen3 equivalents.

Authentication flags such as `--token`, `--oauth-client-id`, and `--oauth-client-secret` take environment-variable names, not secret values. Do not expand these variables with `$` in the command arguments.
:::

## Key Terraform Resources for Gen3

```
Resource                                Auth     What It Manages
──────────────────────────────────────  ───────  ──────────────────────────
dynatrace_document                      OAuth    Dashboards (Document API)
dynatrace_automation_workflow           OAuth    Workflows
dynatrace_platform_slo                  OAuth    Platform SLOs
dynatrace_davis_anomaly_detectors       OAuth    Anomaly detectors (alerts)
dynatrace_iam_policy_bindings_v2        OAuth    IAM policies (use v2, not v1!)
dynatrace_business_events_oneagent      Token    Business event capture rules
dynatrace_http_monitor                  Token    HTTP synthetic monitors
dynatrace_browser_monitor               Token    Browser synthetic monitors
```

:::danger
⚠️ Always use `dynatrace_iam_policy_bindings_v2` — v1 has NO boundary support. And `dynatrace_iam_user` with `groups` does a PUT that replaces ALL groups.
:::

## Migration Strategy

1. **Export** — Use Monaco to download all Gen2 configs
2. **Identify** — Map each config to its Gen3 equivalent (Settings 2.0 schema)
3. **Convert** — Rewrite as Terraform resources or Monaco v2 configs
4. **Test** — Apply to a non-production environment first
5. **Deploy** — Roll out to production with `terraform plan` review

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"96%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","
