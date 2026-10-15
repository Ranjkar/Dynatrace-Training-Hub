---
title: "Extensions"
course: "From Zero to Hero"
track: "Track 4: Automate & Govern"
moduleNumber: 16
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__16-extensions" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Extensions

Extensions expand Dynatrace monitoring to technologies not natively supported — network devices, databases, cloud services, and custom APIs.

## Extension Types

```
Data Source    How It Works                              Example
────────────  ──────────────────────────────────────    ──────────────────────────
SNMP          Polls network devices via SNMP protocol    Switches, routers, firewalls
Python        Custom code calling any API                REST APIs, Redfish, WSMAN
SQL           Queries databases directly                 PostgreSQL, MSSQL, Oracle
JMX           Java Management Extensions                 Java application servers
Prometheus    Scrapes Prometheus exporters                Any Prometheus endpoint
WMI           Windows Management Instrumentation         Windows servers
```

## Hub Extensions

200+ pre-built extensions available in the Dynatrace Hub:

```bash
# Browse extensions: Ctrl+K → "Hub" → Extensions
# Install: click Install on any extension
# Configure: Settings → Extensions → select extension → add endpoint
```

## Extension Architecture

```
extension.yaml          Defines metrics, topology, screens, alerts
  ↓
Extension Execution     Runs on ActiveGate or OneAgent
Controller (EEC)
  ↓
Grail                   Stores collected metrics and entities
  ↓
Dashboards/Alerts       Bundled dashboards and alert templates
```

## Custom Extensions

Build your own when no Hub extension exists:

```bash
# SNMP (declarative YAML — no coding)
pip install dt-extensions-sdk
dt-sdk create --type snmp my-snmp-extension

# Python (coded — for REST APIs, complex logic)
dt-sdk create --type python my-python-extension

# Build and sign
dt-sdk build --sign

# Upload to Dynatrace
dt-sdk upload
```

:::tip
💡 Use SNMP when the device supports standard MIBs (no coding needed). Use Python when you need REST API calls, multi-step authentication, or complex data transformation.
:::

Extension development is covered in depth in the **Extensions 2.0** course (16 modules).

:::note
🛠 **Try it:** Open Ctrl+K → "Hub" → filter by "Extensions" → browse the 200+ available extensions. Click any SNMP extension to see its metrics, topology entities, and bundled dashboards. Try installing one in a test environment.
:::

## Extension Signing

Every extension must be signed before upload. Best practices:

- **Dev**: unique leaf certificate per developer (traceability)
- **Prod**: unique leaf certificate per extension (authenticity)
- Root cert must be on every host running the extension
- Tools: `dt-extensions-sdk` CLI (recommended) or VSCode Extension

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery —
