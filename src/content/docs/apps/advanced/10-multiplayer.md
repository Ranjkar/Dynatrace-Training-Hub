---
title: "Multiplayer (Workflows)"
course: "Dynatrace Apps"
track: "Advanced"
moduleNumber: 10
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__10-multiplayer" data-course-slug="apps">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Workflows from Apps

Workflows are automated sequences: trigger → tasks → actions. Apps can trigger and interact with workflows.

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:700px;" viewbox="0 0 700 80" xmlns="http://www.w3.org/2000/svg">
<rect fill="#7f1d1d" height="40" rx="8" stroke="#f87171" stroke-width="1.5" width="130" x="10" y="20"></rect>
<text fill="#fca5a5" font-size="10" font-weight="bold" text-anchor="middle" x="75" y="45">Trigger</text>
<text fill="#475569" font-size="14" x="150" y="45">→</text>
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="1.5" width="130" x="165" y="20"></rect>
<text fill="#7dd3fc" font-size="10" font-weight="bold" text-anchor="middle" x="230" y="45">DQL Query</text>
<text fill="#475569" font-size="14" x="305" y="45">→</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#a78bfa" stroke-width="1.5" width="130" x="320" y="20"></rect>
<text fill="#c4b5fd" font-size="10" font-weight="bold" text-anchor="middle" x="385" y="45">JavaScript</text>
<text fill="#475569" font-size="14" x="460" y="45">→</text>
<rect fill="#14532d" height="40" rx="8" stroke="#22c55e" stroke-width="1.5" width="130" x="475" y="20"></rect>
<text fill="#86efac" font-size="10" font-weight="bold" text-anchor="middle" x="540" y="45">Send Email</text>
</svg>
</div>

```
Trigger              When It Fires                    Use Case
───────────────────  ──────────────────────────────  ──────────────────────
On demand            Manual or API call               Testing, ad-hoc
Schedule             Cron, time, or interval           Daily reports
Davis problem        New problem detected              Alert notification
Davis event          Custom event received             Event-driven automation
```

```
Task Type            What It Does
───────────────────  ──────────────────────────────────────
Run DQL query        Query Grail data
Run JavaScript       Custom logic, formatting, decisions
HTTP request         Call external APIs
Send email           Notify via dynatrace.email connector
Jira / Slack / Teams Create tickets, send messages
```

:::tip
💡 Workflows need a **service user** as the actor — this controls whose permissions the tasks execute under. Never set the workflow `owner` to a service user (you'll lose access permanently).
:::

:::note
🛠 **Try it:** Open Workflows → create a workflow with a "Run JavaScript" task → use `fetch` to call your app function's API endpoint. Now your app logic can be triggered by Davis problems, schedules, or any workflow event.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"apps","title":"Dynatrace Apps","subtitle":"DOOM to Dashboard","color":"violet","tracks":[{"id":"apps-foundations","title":"Foundations","description":"Get DOOM running
