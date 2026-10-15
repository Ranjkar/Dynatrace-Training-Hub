---
title: "Platform Engineering"
course: "From Zero to Hero"
track: "Track 5: Master"
moduleNumber: 19
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__19-platform-engineering" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Platform Engineering

Dynatrace AppEngine lets you build custom apps on top of the platform — React + TypeScript + DQL, running inside the Dynatrace environment.

## AppEngine Architecture

```
Your App (React + TypeScript)
  ├── UI: Strato design system components
  ├── Data: DQL queries via SDK hooks
  ├── Backend: App functions (serverless TypeScript)
  └── Integration: Intents for app-to-app communication
```

## Building an App

```bash
npx dt-app create my-app          # Scaffold (Node 24 required)
npx dt-app dev                    # Local dev server
npx dt-app build                  # Build for deployment
npx dt-app deploy                 # Deploy to environment
```

## Key SDK Packages

```
Package                                     What It Provides
──────────────────────────────────────────  ──────────────────────────────
@dynatrace/strato-components/core           AppRoot (entry point)
@dynatrace/strato-components/charts              TimeseriesChart, conversion utils
@dynatrace/strato-components/tables              DataTable
@dynatrace-sdk/react-hooks                   useDqlQuery, useAppFunction
@dynatrace-sdk/client-query                  queryExecutionClient (imperative)
@dynatrace-sdk/navigation                    sendIntent, IntentPayload
```

## Querying DQL from Apps

```typescript
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";

const result = useDqlQuery({
  body: { query: `fetch dt.entity.host | fields entity.name | limit 10` }
});
// result.data, result.isLoading, result.error
```

## Intents: App-to-App Communication

```typescript
import { IntentButton } from "@dynatrace/strato-components/buttons";

// Open a DQL query in Notebooks
<IntentButton payload={{ "dt.query": "fetch logs | filter loglevel == \"ERROR\"" }}>
  Open in Notebooks
</IntentButton>
```

:::tip
💡 AppEngine apps are ideal for custom dashboards, self-service portals, and team-specific tools that go beyond what standard dashboards can do.
:::

App development is covered in depth in the **Apps "DOOM to Dashboard"** course (15 modules).

:::note
🛠 **Try it:** Run `npx dt-app@latest create --environment-url https://YOUR-ENV.apps.dynatrace.com` in your terminal. In 30 seconds you'll have a working Dynatrace app with React, DQL hooks, and Strato components — ready to customize.
:::

## AppEngine Functions

Two types: **app functions** (backend of a custom app, deployed together) and **ad-hoc functions** (standalone code invoked from Notebooks, Dashboards, Workflows, or API). Both run in Dynatrace JavaScript runtime (TypeScript).

## EdgeConnect

Enables apps and workflows to securely call on-premises systems. Runs as a Docker container in your network, initiates outbound connection to AppEngine (no inbound firewall rules needed). Use for: internal APIs, on-prem ITSM, corporate databases.

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Ma
