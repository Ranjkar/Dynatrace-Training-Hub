---
title: "Power-Ups (App Functions)"
course: "Dynatrace Apps"
track: "Advanced"
moduleNumber: 8
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__08-power-ups" data-course-slug="apps">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## App Functions

Serverless TypeScript functions that run on AppEngine. Every TypeScript file in the `/api` directory is automatically deployed as an API endpoint.

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:600px;" viewbox="0 0 600 80" xmlns="http://www.w3.org/2000/svg">
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="1.5" width="140" x="10" y="20"></rect>
<text fill="#7dd3fc" font-size="10" font-weight="bold" text-anchor="middle" x="80" y="45">React UI (browser)</text>
<text fill="#475569" font-size="14" x="160" y="45">→</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#a78bfa" stroke-width="1.5" width="140" x="175" y="20"></rect>
<text fill="#c4b5fd" font-size="10" font-weight="bold" text-anchor="middle" x="245" y="45">App Function</text>
<text fill="#475569" font-size="14" x="325" y="45">→</text>
<rect fill="#14532d" height="40" rx="8" stroke="#22c55e" stroke-width="1.5" width="140" x="340" y="20"></rect>
<text fill="#86efac" font-size="10" font-weight="bold" text-anchor="middle" x="410" y="45">External API</text>
</svg>
</div>

## Creating a Function

```typescript
// api/health-check.ts
export default async function (payload: { url: string }) {
  const start = Date.now();
  const response = await fetch(payload.url);
  return { status: response.status, latency: Date.now() - start, ok: response.ok };
}
```

## Calling from UI

Two ways — imperative or hook:

```typescript
// Option 1: Imperative (from our DOOM app)
import { functions } from "@dynatrace-sdk/app-utils";
const result = await functions.call("health-check", { url: "https://api.example.com" });

// Option 2: Hook (from official Dynatrace tutorial)
import { useAppFunction } from "@dynatrace-sdk/react-hooks";
const result = useAppFunction({ name: "health-check", data: { url: "https://api.example.com" } });
// result.data, result.isLoading, result.error
```

```
Use Case                        Use App Function?
──────────────────────────────  ─────────────────
DQL query                       No — use useDqlQuery directly
External API call               Yes — credentials stay server-side
Heavy data processing           Yes — don't block the browser
Data that needs secrets         Yes — secrets never reach the UI
```

:::tip
💡 App Functions run server-side on AppEngine. Logs go to Grail (queryable with DQL). HTTP errors return specific codes: 540 = JavaScript error, 541 = timeout/memory exceeded.
:::

:::note
🛠 **Try it:** Create an app function: add a `.ts` file in the `api/` directory → export a default async function → call it from your UI with `useAppFunction`. App functions run server-side with their own permissions — perfect for data processing.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"apps","ti
