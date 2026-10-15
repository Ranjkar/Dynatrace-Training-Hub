---
title: "Boss Fight: Build a Real App"
course: "Dynatrace Apps"
track: "Boss Level"
moduleNumber: 12
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__12-boss-fight" data-course-slug="apps">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Build a Real App: Host Health Monitor

Combine everything into a multi-tab Host Health Monitor with views for infrastructure, services, processes, logs, and security:

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:700px;" viewbox="0 0 700 120" xmlns="http://www.w3.org/2000/svg">
<text fill="#a78bfa" font-size="12" font-weight="bold" text-anchor="middle" x="350" y="15">Host Health Monitor: 5 Tabs</text>
<rect fill="#172554" height="70" rx="8" stroke="#38bdf8" stroke-width="1.5" width="130" x="10" y="30"></rect>
<text fill="#7dd3fc" font-size="11" font-weight="bold" text-anchor="middle" x="75" y="55">Overview</text>
<text fill="#475569" font-size="9" text-anchor="middle" x="75" y="72">KPIs + charts + SLOs</text>
<rect fill="#1e293b" height="70" rx="8" stroke="#a78bfa" stroke-width="1.5" width="130" x="150" y="30"></rect>
<text fill="#c4b5fd" font-size="11" font-weight="bold" text-anchor="middle" x="215" y="55">Services</text>
<text fill="#475569" font-size="9" text-anchor="middle" x="215" y="72">DataTable + metrics</text>
<rect fill="#1e293b" height="70" rx="8" stroke="#a78bfa" stroke-width="1.5" width="130" x="290" y="30"></rect>
<text fill="#c4b5fd" font-size="11" font-weight="bold" text-anchor="middle" x="355" y="55">Processes</text>
<text fill="#475569" font-size="9" text-anchor="middle" x="355" y="72">Process groups</text>
<rect fill="#14532d" height="70" rx="8" stroke="#22c55e" stroke-width="1.5" width="130" x="430" y="30"></rect>
<text fill="#86efac" font-size="11" font-weight="bold" text-anchor="middle" x="495" y="55">Logs</text>
<text fill="#475569" font-size="9" text-anchor="middle" x="495" y="72">Log query + filter</text>
<rect fill="#7f1d1d" height="70" rx="8" stroke="#f87171" stroke-width="1.5" width="120" x="570" y="30"></rect>
<text fill="#fca5a5" font-size="11" font-weight="bold" text-anchor="middle" x="630" y="55">Security</text>
<text fill="#475569" font-size="9" text-anchor="middle" x="630" y="72">Vulnerabilities</text>
</svg>
</div>

## App.tsx — Tab Navigation

```typescript
import React from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Tabs, Tab } from "@dynatrace/strato-components/navigation";

export const App = () => (
  <Flex flexDirection="column" padding={16} style={{ height: "100%" }}>
    <Tabs defaultIndex={0}>
      <Tab title="Overview"><OverviewPage /></Tab>
      <Tab title="Services"><ServicesPage /></Tab>
      <Tab title="Processes"><ProcessesPage /></Tab>
      <Tab title="Logs"><LogsPage /></Tab>
      <Tab title="Security"><SecurityPage /></Tab>
    </Tabs>
  </Flex>
);
```

## Required Scopes

```json
{
  "scopes": [
    { "name": "storage:metrics:read", "comment": "Host CPU/memory/disk metrics" },
    { "name": "storage:entities:read", "comment": "Host, service, process entities" },
    { "name": "storage:events:read", "comment": "Problems and Davis events" },
    { "name": "storage:logs:read", "comment": "Log analytics" },
    { "name": "storage:buckets:read", "comment": "Data buckets" },
    { "name": "storage:system:read", "comment": "System data" }
  ]
}
```

:::tip
💡 This is a real app running at `https://ENV.apps.dynatrace.com/ui/apps/my.dtall.host.health.monitor`. Every code snippet in this module is from the deployed source.
:::

:::note
🛠 **Try it:** Challenge: Build a complete monitoring app with 3 tabs (Hosts, Services, Logs), each with a DQL query, a chart or table, and a filter variable. Deploy it and share with your team. That's a production Dynatrace app.
:::

b:["$","
