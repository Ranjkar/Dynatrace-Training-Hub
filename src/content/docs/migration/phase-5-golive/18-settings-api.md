---
title: "Migrate Settings v1 → Settings 2.0"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 5: Config-as-Code & Go Live"
moduleNumber: 22
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__18-settings-api" data-course-slug="migration">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Migrating Settings API Calls

Any automation using the Gen2 Settings API v1 or config API endpoints needs to be updated. Gen3 unifies everything into **Settings 2.0** — one endpoint, schema-based, consistent for all configuration.

## The Unified Pattern

```
Gen2: 50+ separate API endpoints          Gen3: ONE endpoint
  /api/config/v1/autoTags                   /api/v2/settings/objects
  /api/config/v1/alertingProfiles           → Replaced by Workflows (no schema)
  /api/config/v1/notifications              → Replaced by Workflows (no schema)
  /api/config/v1/managementZones            schemaId = builtin:management-zones
  ...                                       Every setting follows the same pattern
```

:::danger
⚠️ `builtin:alerting.profile` and `builtin:problem.notifications` do NOT exist on Gen3. Alerting profiles and problem notifications are replaced by **Workflows** with email/Slack/Jira actions.
:::

:::note
🛠 **Try it:** Ctrl+K → "Settings" → open "Anomaly detection" → click any detector → look at the URL: the schema ID is `builtin:davis.anomaly-detectors`. Now run in a Notebook: `fetch dt.settings | filter schema_id == "builtin:davis.anomaly-detectors" | limit 5` to see the same settings as queryable data.
:::

## How Settings 2.0 Works

```json
// Every setting follows this structure:
{
  "schemaId": "builtin:tags.auto-tagging",
  "scope": "environment",
  "value": {
    "name": "my-tag-rule",
    "rules": [...]
  }
}
```

## Common Schema IDs

```
Schema ID                                   What It Configures
──────────────────────────────────────────  ──────────────────────────────
builtin:davis.anomaly-detectors             Anomaly detectors (alerts)
builtin:tags.auto-tagging                   Auto-tagging rules
builtin:cloud.kubernetes                    K8s cluster connections
builtin:anomaly-detection.kubernetes.*      K8s anomaly detection
builtin:rum.web.injection                   RUM JavaScript injection
builtin:logmonitoring.log-storage-settings  Log storage configuration
```

## Discovering Schemas

```bash
# List all available schemas
curl -s "$DT_URL/api/v2/settings/schemas" -H "Authorization: Bearer $TOKEN" | jq '.items[].schemaId'

# Get schema details (see all fields and their types)
curl -s "$DT_URL/api/v2/settings/schemas/builtin:davis.anomaly-detectors" -H "Authorization: Bearer $TOKEN"
```

:::note
## Migration: Which Settings Moved?

```
Gen2 Config API                         Gen3 Settings 2.0 Schema
──────────────────────────────────────  ──────────────────────────────────────
/api/config/v1/autoTags                 builtin:tags.auto-tagging
/api/config/v1/managementZones          builtin:management-zones (+ Segments)
/api/config/v1/anomalyDetection/*       builtin:anomaly-detection.*
/api/config/v1/maintenanceWindows       builtin:alerting.maintenance-window
/api/config/v1/alertingProfiles         ❌ REMOVED — use Workflows instead
/api/config/v1/notifications            ❌ REMOVED — use Workflows instead
/api/config/v1/dashboards               ❌ REMOVED — use Document API instead
```

## Pagination Gotcha

:::danger
⚠️ Settings API pagination is different from other APIs. When using `nextPageKey`, you must send ONLY the key — no other parameters (pageSize, schemaIds, scopes). The API returns 400 if you include them.
:::

```
API Type        Page 2+ Rule
──────────────  ──────────────────────────────────────────────
Settings API    ONLY nextPageKey (rejects all other params)
Document API    Always resend pageSize (not embedded in token)
Most APIs       Resend filters (not embedded in token)
```

## Migration Step: Export → Identify → Convert

```bash
# 1. List all settings schemas in your environment
curl -s "$DT_URL/api/v2/settings/schemas" -H "Authorization: Bearer $TOKEN" \
  | jq '.items[] | .schemaId' | sort

# 2. Export all objects for a schema
curl -s "$DT_URL/api/v2/settings/objects?schemaIds=builtin:tags.auto-tagging" \
  -H "Authorization: Bearer $TOKEN"

# 3. Convert to Terraform or Monaco format
# Use Monaco: monaco download --environment myenv.yaml
```

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"92%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children
:::
