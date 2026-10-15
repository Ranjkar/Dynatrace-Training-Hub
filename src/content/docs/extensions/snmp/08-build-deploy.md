---
title: "Build, Sign & Deploy"
course: "Dynatrace Extensions"
track: "SNMP Extensions"
moduleNumber: 8
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__08-build-deploy" data-course-slug="extensions">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Build Pipeline

Three steps to get your extension into Dynatrace:

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:700px;" viewbox="0 0 700 80" xmlns="http://www.w3.org/2000/svg">
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="2" width="180" x="10" y="20"></rect>
<text fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle" x="100" y="45">1. Build ZIP</text>
<text fill="#475569" font-size="16" x="200" y="45">→</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#a78bfa" stroke-width="2" width="180" x="210" y="20"></rect>
<text fill="#c4b5fd" font-size="12" font-weight="bold" text-anchor="middle" x="300" y="45">2. Sign</text>
<text fill="#475569" font-size="16" x="400" y="45">→</text>
<rect fill="#14532d" height="40" rx="8" stroke="#22c55e" stroke-width="2" width="180" x="410" y="20"></rect>
<text fill="#86efac" font-size="12" font-weight="bold" text-anchor="middle" x="500" y="45">3. Upload</text>
</svg>
</div>

## Step 1: Build

```bash
# Using dt-extensions-sdk (recommended)
pip install dt-extensions-sdk
dt-sdk build

# Or using dt-cli
pip install dt-cli
dt ext assemble
```

## Step 2: Sign

Extension signing workflow from Dynatrace docs

Every extension must be signed with a certificate. Dynatrace verifies the signature on upload.

```bash
# Generate certificates (one-time setup)
dt-sdk gencerts

# Sign the extension
dt-sdk build --sign
```

:::danger
⚠️ The root certificate must be uploaded to BOTH:
  
1. Dynatrace credential vault (for JMX extensions)
  
2. ActiveGate filesystem: `/var/lib/dynatrace/remotepluginmodule/agent/conf/certificates/`
:::

## Step 3: Upload

```bash
# Upload via API
curl -X POST "https://{env-id}.live.dynatrace.com/api/v2/extensions" \
  -H "Authorization: Api-Token {token}" \
  -F "file=@bundle.zip"

# Or use the Extensions app in the UI
# Ctrl+K → "Extensions" → Upload
```

20+ SNMP extensions available in the Dynatrace Hub

## Activation Checklist

1. Upload extension → appears in Extensions app
2. Activate the version (only 1 active at a time, up to 10 stored)
3. Add monitoring configuration → select ActiveGate group → define devices
4. Select feature sets → set variables → activate
5. Wait 1-2 minutes → check for metrics in Data Explorer

:::note
🛠 **Try it:** Use the VS Code extension (`dynatrace-extensions`) — it has build, sign, upload, and activate all in one click.
:::

## Troubleshooting

```
Problem                              Fix
─────────────────────────────────── ──────────────────────────────────
No metrics after activation          Check ActiveGate group assignment
"Invalid signature" on upload        Re-sign, check cert on ActiveGate
Metrics appear but no entities       Check topology idPattern dimensions
Extension shows "Error" status       Check EEC logs on ActiveGate
```

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extensions","title":"Dynatrace Extensions","subtitle":"B
