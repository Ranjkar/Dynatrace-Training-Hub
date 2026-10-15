---
title: "Welcome to the Arena"
course: "Dynatrace Apps"
track: "Foundations"
moduleNumber: 0
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__00-welcome-to-the-arena" data-course-slug="apps">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Welcome to the Arena

This course builds custom applications that run *inside* Dynatrace. Full React apps with their own UI, backend logic, and access to every byte of platform data.

To prove the platform can handle anything — we start by running DOOM inside it.

## Apps vs Extensions

```
Feature              Extensions 2.0              Dynatrace Apps
───────────────────  ──────────────────────────  ──────────────────────────
Language             YAML (SNMP) / Python        React + TypeScript
Runs on              ActiveGate / OneAgent        AppEngine (cloud)
Purpose              Data collection              Custom UI + logic
Data access          Metrics only                 Full Grail (DQL)
UI                   Entity screens (YAML)        Full React SPA
Backend              N/A                          App Functions (TypeScript)
```

## What Gets Built

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:700px;" viewbox="0 0 700 80" xmlns="http://www.w3.org/2000/svg">
<rect fill="#7f1d1d" height="40" rx="8" stroke="#f87171" stroke-width="2" width="150" x="10" y="20"></rect>
<text fill="#fca5a5" font-size="11" font-weight="bold" text-anchor="middle" x="85" y="45">🎮 DOOM</text>
<text fill="#475569" font-size="16" x="170" y="45">→</text>
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="2" width="150" x="185" y="20"></rect>
<text fill="#7dd3fc" font-size="11" font-weight="bold" text-anchor="middle" x="260" y="45">📊 DQL Tables</text>
<text fill="#475569" font-size="16" x="345" y="45">→</text>
<rect fill="#14532d" height="40" rx="8" stroke="#22c55e" stroke-width="2" width="150" x="360" y="20"></rect>
<text fill="#86efac" font-size="11" font-weight="bold" text-anchor="middle" x="435" y="45">📈 Charts</text>
<text fill="#475569" font-size="16" x="520" y="45">→</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#a78bfa" stroke-width="2" width="150" x="535" y="20"></rect>
<text fill="#c4b5fd" font-size="11" font-weight="bold" text-anchor="middle" x="610" y="45">🖥️ Full Dashboard</text>
</svg>
</div>

## Real Apps Built on This Platform

```
App                         What It Does                                Status
──────────────────────────  ──────────────────────────────────────────  ────────
DOOM                        Classic 1993 FPS via js-dos emulator        Deployed
Host Health Monitor          5-tab health dashboard with live DQL        Example
Fluid Simulation            WebGL Navier-Stokes physics                 Deployed
```

:::tip
💡 All four apps above are real, deployed, and running on a Dynatrace environment. The code from these apps is used throughout this course as working examples.
:::

:::note
🛠 **Try it:** Open Ctrl+K → "Apps" → browse the installed apps in your environment. Click any app to see it running. Then check the Dynatrace Hub for community apps you can install with one click.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"apps","title":"Dynatrace Apps","subtitle":"DOOM to Dashboard","color":"violet","tracks":[{"id":"apps-foundations","title":"Foundations","description":"Get DOOM running inside Dynatrace and understand the platform","
