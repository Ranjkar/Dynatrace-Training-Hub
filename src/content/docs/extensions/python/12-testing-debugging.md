---
title: "Testing & Debugging"
course: "Dynatrace Extensions"
track: "Python Extensions"
moduleNumber: 12
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__12-testing-debugging" data-course-slug="extensions">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Log Locations

Extension lifecycle — testing and debugging

Extension logs live on the ActiveGate:

```bash
# Extension datasource logs
/var/lib/dynatrace/remotepluginmodule/log/extensions/

# EEC logs
/var/lib/dynatrace/remotepluginmodule/log/extensions/eec.log

# Specific extension logs
/var/lib/dynatrace/remotepluginmodule/log/extensions/datasources/
  custom_com.dynatrace.extension.my-ext_*/
```

## Local Development

```bash
# Run extension locally (without ActiveGate)
dt-sdk run --target targets.json

# targets.json defines test endpoints
{
  "targets": [{
    "address": "192.168.1.1",
    "snmpVersion": "v2c",
    "communityString": "public"
  }]
}
```

:::note
🛠 **Try it:** Use `dt-sdk run` to test your extension locally before uploading. It simulates the EEC and shows metrics in the console.
:::

## Common Issues

```
Symptom                              Cause                          Fix
─────────────────────────────────── ────────────────────────────── ──────────────────────
No metrics after activation          Wrong ActiveGate group          Check AG group assignment
Metrics but no entities              idPattern doesn't match dims    Check dimension keys
"Extension error" in UI              Python exception in query()     Check EEC logs
Metrics intermittent                 Timeout too low                 Increase timeout
"Invalid signature"                  Cert not on ActiveGate          Copy root.pem to certs dir
Entities disappear                   Dimension values changed        Use stable identifiers
```

## Debugging Checklist

1. Check extension status in Extensions app (green = OK, red = error)
2. Check EEC logs on ActiveGate for Python exceptions
3. Verify metrics in Data Explorer: search for your metric key prefix
4. Verify entities in Entity List: filter by your entity type
5. Check monitoring configuration: correct AG group, correct device IPs

:::tip
💡 The VS Code extension shows real-time extension health and lets you view logs directly from the editor.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extensions","title":"Dynatrace Extensions","subtitle":"Build Extensions
