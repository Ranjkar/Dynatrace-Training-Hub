---
title: "Configuration as Code"
course: "From Zero to Hero"
track: "Track 4: Automate & Govern"
moduleNumber: 15
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__14-config-as-code" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Configuration as Code

Manage Dynatrace configuration with Terraform and Monaco CLI — version-controlled, repeatable, auditable.

## Two Tools

```
Tool                What It Does                              Best For
──────────────────  ──────────────────────────────────────    ──────────────────────────
Terraform           Declarative state management (HCL)        Greenfield deployment
Monaco CLI          Dynatrace-native config as code (YAML)    Brownfield export, CI/CD
```

## Terraform Provider (v1.94.0)

```bash
# Setup
terraform {
  required_providers {
    dynatrace = {
      source  = "dynatrace-oss/dynatrace"
      version = "~> 1.94"
    }
  }
}

# Configure via environment variables
export DYNATRACE_ENV_URL="https://ENV-ID.live.dynatrace.com"
export DYNATRACE_API_TOKEN="dt0c01.XXXX.YYYY"

# For workflows, dashboards, SLOs (require OAuth):
export DT_CLIENT_ID="dt0s02.XXXX"
export DT_CLIENT_SECRET="dt0s02.XXXX.YYYY"
export DT_ACCOUNT_ID="urn:dtaccount:UUID"
```

## Export Existing Configuration

```bash
# After terraform init, the provider binary can export ALL config:
cd .terraform/providers/registry.terraform.io/dynatrace-oss/dynatrace/*/linux_amd64/

# Export everything (generates .tf files)
./terraform-provider-dynatrace -export

# Export specific resources with dependencies
./terraform-provider-dynatrace -export -ref dynatrace_alerting dynatrace_dashboard

# Export and import into Terraform state
./terraform-provider-dynatrace -export -import-state dynatrace_platform_slo
```

:::danger
⚠️ `-import-state` makes resources managed. On next `terraform apply`, anything in state but NOT in .tf files gets deleted.
:::

## Monaco CLI (v2.28.5)

```bash
# Export all config as YAML
monaco download --url https://ENV-ID.live.dynatrace.com \
  --token-name DT_API_TOKEN --output-folder export/

# Deploy config
monaco deploy manifest.yaml --environment prod

# Dry run (preview changes)
monaco deploy manifest.yaml --environment prod --dry-run
```

:::tip
💡 Use Monaco for brownfield export (capture existing config), Terraform for greenfield deployment (define desired state). Many teams use both.
:::

:::note
🛠 **Try it:** Open Ctrl+K → "Settings" → browse any setting (try "Anomaly detection"). Notice the schema ID in the URL — that's the same ID you'd use in Terraform's `dynatrace_setting` resource. Every UI setting has an API equivalent.
:::

## Terraform Export Utility

The Dynatrace TF provider binary can export existing config:

```
# Export all configs
./terraform-provider-dynatrace -export

# Export with dependencies + state import (brownfield adoption)
./terraform-provider-dynatrace -export -ref -import-state

# Export specific resource
./terraform-provider-dynatrace -export dynatrace_alerting
```

Flags: `-ref` (data sources), `-import-state` (init + import), `-flat` (no modules).

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Master
