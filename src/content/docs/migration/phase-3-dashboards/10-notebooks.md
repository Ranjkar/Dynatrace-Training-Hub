---
title: "Adopt Notebooks for Investigation"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 3: Migrate Dashboards"
moduleNumber: 16
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__10-notebooks" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Notebooks — Replacing Data Explorer

Notebooks replace the Data Explorer for ad-hoc analysis and investigation. Any Data Explorer workflow should move to Notebooks — they combine DQL queries, markdown notes, and visualizations in one shareable document.

## When to Use What

```
Use Case                    Tool          Why
──────────────────────────  ────────────  ──────────────────────────────────
Real-time monitoring        Dashboard     Wall screen, auto-refresh, shared
Investigation & analysis    Notebook      Sequential, shareable, annotated
Ad-hoc queries              Notebook      Quick DQL, explore data
Reporting                   Dashboard     Polished, variables, filters
Collaboration               Notebook      Add notes, share findings
```

:::note
🛠 **Try it:** Ctrl+K → "Notebooks" → Create new → Add a DQL section → type `fetch dt.entity.host | fields entity.name, cpuCores, osType` → Add a Markdown section → write your analysis notes.
:::

## Notebook Sections

Notebooks support five section types:

```
Section Type    What It Does                              Icon
──────────────  ────────────────────────────────────────  ────
Query (DQL)     Write DQL queries, choose visualizations   📊
Explore         Point-and-click data exploration            🔍
Code            Run JavaScript for custom logic             💻
Markdown        Add headers, notes, formatted text          📝
Prompt          Ask Davis CoPilot in natural language        🤖
```

:::tip
💡 **Prompt sections** let you ask Davis CoPilot questions in plain English — it generates and runs the DQL for you. Try: "Show me the top 5 hosts by CPU usage in the last hour".
:::

## Explore Data (Point-and-Click)

Don't want to write DQL? Use the "Explore data" feature:

1. In a Notebook, click "Explore data" instead of "Query Grail"
2. Choose your data source (Logs, Metrics, Business events)
3. Use the point-and-click interface to filter, aggregate, and visualize
4. Click "Show DQL" to see the generated query

:::tip
💡 "Explore data" is the best way to learn DQL — build your query visually, then read the generated DQL to understand the syntax.
:::

## Notebooks vs Dashboards

```
Aspect              Notebook                        Dashboard
──────────────────  ──────────────────────────────  ──────────────────────────────
Layout              Linear, top-to-bottom           Grid-based (24 columns)
Purpose             Investigation, analysis, RCA    Monitoring, at-a-glance status
DQL location        state.input.value               query
Viz config          state.visualization             visualizationSettings
```

Notebook YAML uses `sections` format (not `cells`). Each section is either `type: markdown` or a DQL query with `state.input.value` containing the query.

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"68%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children"
