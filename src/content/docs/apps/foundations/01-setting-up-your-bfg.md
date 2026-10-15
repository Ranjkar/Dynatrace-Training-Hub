---
title: "Setting Up Your BFG"
course: "Dynatrace Apps"
track: "Foundations"
moduleNumber: 1
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__01-setting-up-your-bfg" data-course-slug="apps">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## The App Toolkit

One CLI to scaffold, develop, and deploy apps:

```bash
node --version  # Need 24+
npx dt-app@latest create --environment-url https://YOUR-ENV.apps.dynatrace.com
```

## Templates

```
Template                What You Get
──────────────────────  ──────────────────────────────────────
default                 Full example with DQL, charts, tables
empty                   Blank app — just routing, no content
```

## Project Structure

```
my-app/
├── ui/
│   ├── app/
│   │   ├── App.tsx           ← Root component + routing
│   │   └── pages/            ← Your pages
│   └── main.tsx              ← Entry point (AppRoot + BrowserRouter)
├── api/                      ← App Functions (TypeScript files)
├── app.config.json           ← App metadata + permissions + CSP
├── package.json
└── tsconfig.json
```

## app.config.json

From the real DOOM app (deployed and running):

```json
{
  "environmentUrl": "https://YOUR-ENV.apps.dynatrace.com/",
  "app": {
    "name": "My App",
    "version": "0.0.1",
    "description": "A custom Dynatrace app",
    "id": "my.custom.app",
    "scopes": [
      { "name": "storage:metrics:read", "comment": "Host metrics" },
      { "name": "storage:entities:read", "comment": "Host/service entities" },
      { "name": "storage:logs:read", "comment": "Log analytics" },
      { "name": "storage:events:read", "comment": "Problems and events" }
    ]
  }
}
```

:::danger
⚠️ Scopes define what data the app can access. Missing scopes = silent empty results (no error). Always declare every data type the app queries.
:::

## Development Workflow

```bash
npx dt-app dev    # Local dev server with hot reload
npx dt-app build  # Build for deployment
npx dt-app deploy # Deploy to your Dynatrace environment
```

:::note
🛠 **Try it:** Run `npx dt-app@latest create --environment-url https://YOUR-ENV.apps.dynatrace.com` → name it "my-first-app" → `cd my-first-app && npx dt-app dev`. Your app opens in the browser, live-reloading as you edit code.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"apps","title":"Dynatrace Apps","subtitle":"DOOM to Dashboard","color":"violet","tracks":[{"id":"ap
