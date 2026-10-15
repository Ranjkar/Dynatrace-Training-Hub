---
title: "The HUD (Heads-Up Display)"
course: "Dynatrace Apps"
track: "Data & UI"
moduleNumber: 7
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__07-the-hud" data-course-slug="apps">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## The Dashboard Pattern

KPI cards on top, charts in the middle, detail list at the bottom. From the real Host Health Monitor app:

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:600px;" viewbox="0 0 600 180" xmlns="http://www.w3.org/2000/svg">
<text fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" x="300" y="15">App Dashboard Layout</text>
<rect fill="#172554" height="40" rx="6" stroke="#38bdf8" stroke-width="1" width="170" x="20" y="25"></rect>
<text fill="#7dd3fc" font-size="10" text-anchor="middle" x="105" y="50">🟢 CPU: 23%</text>
<rect fill="#172554" height="40" rx="6" stroke="#38bdf8" stroke-width="1" width="170" x="200" y="25"></rect>
<text fill="#7dd3fc" font-size="10" text-anchor="middle" x="285" y="50">📊 Memory: 61%</text>
<rect fill="#172554" height="40" rx="6" stroke="#38bdf8" stroke-width="1" width="170" x="380" y="25"></rect>
<text fill="#7dd3fc" font-size="10" text-anchor="middle" x="465" y="50">⚠️ Problems: 0</text>
<rect fill="#1e293b" height="50" rx="6" stroke="#a78bfa" stroke-width="1" width="530" x="20" y="75"></rect>
<text fill="#c4b5fd" font-size="10" text-anchor="middle" x="285" y="105">📈 TimeseriesChart (CPU + Memory over time)</text>
<rect fill="#14532d" height="40" rx="6" stroke="#22c55e" stroke-width="1" width="530" x="20" y="135"></rect>
<text fill="#86efac" font-size="10" text-anchor="middle" x="285" y="160">📋 Recent Problems list</text>
</svg>
</div>

## Full Overview Page

Real code from the deployed Host Health Monitor:

```typescript
export const OverviewPage = () => (
  <Flex flexDirection="column" gap={16} padding={16}>
    <Heading level={1}>Control Center — Live Health</Heading>

    {/* KPI Row */}
    <Flex gap={12} flexWrap="wrap">
      <MetricCard title="CPU" query={`timeseries val=avg(dt.host.cpu.usage),
        filter:{dt.entity.host == "${HOST_ID}"}
        | fieldsAdd latest=arrayAvg(val) | fields latest`} unit="%" />
      <MetricCard title="Memory" query={`timeseries val=avg(dt.host.memory.usage),
        filter:{dt.entity.host == "${HOST_ID}"}
        | fieldsAdd latest=arrayAvg(val) | fields latest`} unit="%" />
      <MetricCard title="Problems 24h" query={`fetch events, from:now()-24h
        | filter event.kind == "DAVIS_PROBLEM" | summarize count=count()`} />
    </Flex>

    {/* Charts */}
    <Flex gap={16} flexWrap="wrap">
      <TsChart title="CPU (2h)" query={`timeseries avg(dt.host.cpu.usage), from:-2h,
        filter:{dt.entity.host == "${HOST_ID}"}`} />
      <TsChart title="Memory (2h)" query={`timeseries avg(dt.host.memory.usage), from:-2h,
        filter:{dt.entity.host == "${HOST_ID}"}`} />
    </Flex>

    {/* SLO Status + Problem List */}
    <SloStatus />
    <ProblemList />
  </Flex>
);
```

:::tip
💡 The pattern: `Flex column` for the page → `Flex row wrap` for KPI cards → `Flex row wrap` for charts → detail components at the bottom. This scales from mobile to widescreen.
:::

:::note
🛠 **Try it:** Build a multi-tab layout: wrap your components in `<Tabs><Tab title="Overview">...</Tab><Tab title="Details">...</Tab></Tabs>`. Each tab can show different DQL queries — hosts in one, services in another, logs in a third.
:::

b:["$","div",null,{"className":"
