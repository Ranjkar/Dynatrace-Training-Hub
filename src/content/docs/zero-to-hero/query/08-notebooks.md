---
title: "Notebooks"
course: "From Zero to Hero"
track: "Track 2: Query & Explore"
moduleNumber: 9
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__08-notebooks" data-course-slug="zero-to-hero">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Notebooks

Notebooks are Dynatrace's interactive analysis tool — like Jupyter notebooks for observability. Mix DQL queries with markdown documentation.

## When to Use Notebooks vs Dashboards

```
Notebooks                               Dashboards
──────────────────────────────────────  ──────────────────────────────────────
Exploration and investigation           Daily monitoring and KPIs
Ad-hoc queries, try different angles    Fixed tiles, auto-refresh
Markdown documentation between queries  Visual layout, shared with team
Export as PDF for reports               Embed in portals, TV screens
One-time analysis                       Persistent views
```

## Creating a Notebook

1. Ctrl+K → "Notebooks" → Create new
2. Add a **DQL section** → write a query → run it
3. Add a **Markdown section** → document your findings
4. Repeat — build a narrative of your investigation

:::note
🛠 **Try it:** Create a notebook with these three sections:

1. Markdown: `# Host Health Check`
2. DQL: `timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}`
3. DQL: `fetch logs | filter loglevel == "ERROR" | summarize cnt=count(), by:{log.source} | sort cnt desc`
:::

## Visualization Types

`timeseries` queries auto-render as line charts. `fetch` queries render as tables. Click the visualization selector to change: bar chart, pie chart, single value, honeycomb, etc.

## Sharing

- **Share link** — anyone with access can view
- **Export PDF** — for email reports
- **Clone** — duplicate for a new investigation

:::tip
💡 Notebooks are the Gen3 replacement for Data Explorer. Any time you want to explore data interactively, start with a Notebook.
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

Use notebooks for step-by-step investigations with markdown narrative between queries. Use dashboards for operational monitoring with multiple tiles visible simultaneously.

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":[{"id":"hero-foundation","title":"Track 1: Foundation","description":"What is observability, ho
