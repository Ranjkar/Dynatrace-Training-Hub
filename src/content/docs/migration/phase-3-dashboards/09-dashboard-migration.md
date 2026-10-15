---
title: "Migrate Classic → Gen3 Dashboards"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 3: Migrate Dashboards"
moduleNumber: 15
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__09-dashboard-migration" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Dashboard Migration

Gen2 dashboards used pre-built tiles (host health, service flow, etc.). Gen3 dashboards are 100% DQL-powered — every tile runs a query.

:::tip
💡 **Start with ready-made dashboards.** Dynatrace now ships dozens of ready-made dashboards for common scenarios (AWS, Kubernetes, Application Performance, Security, etc.). Open Dashboards → filter by "Ready-made" → duplicate one → customize. This is often faster than building from scratch.
:::

## Key Differences

```
Gen2 Dashboard                          Gen3 Dashboard
──────────────────────────────────────  ──────────────────────────────────────
Pre-built tile types                    Every tile is a DQL query
Metric expressions for data             DQL timeseries / fetch commands
Management zone filter                  Segment filter + DQL variables
Fixed visualizations per tile           Choose any visualization for any query
Dashboard API (v1)                      Document API (multipart upload)
JSON schema v13-14                      JSON schema v21, 20-unit grid
```

:::note
🛠 **Try it:** Ctrl+K → "Dashboards" → Create new → Add a tile → Select "Query Grail" → type `timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}` → you'll get a live CPU chart.
:::

## Building Your First Gen3 Dashboard

### Step 1: Create a dashboard

Open the Dashboards app → click "+ Dashboard" → give it a name.

### Step 2: Add a DQL tile

Click "+" → "Query Grail" → write your DQL query → choose a visualization (line chart, table, single value, etc.).

### Step 3: Common tile queries

```dql
// CPU usage chart
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}

// Service response time
timeseries p95 = percentile(dt.service.request.response_time, 95),
  by:{dt.entity.service}

// Error count (single value)
fetch logs, from:now() - 1h
| filter loglevel == "ERROR"
| summarize error_count = count()

// Active problems (table)
fetch dt.davis.problems, from:now() - 24h
| filter not(dt.davis.is_duplicate) and event.status == "ACTIVE"
| sort event.start desc
| fields display_id, event.name, event.category
```

:::tip
💡 The "Explore data" feature lets you build queries with point-and-click — no DQL typing needed. It generates the DQL for you.
:::

## Migration Checklist

- Export Gen2 dashboard JSON for reference
- For each tile, write the equivalent DQL query
- Replace management zone filters with Segments or DQL variables
- Test side-by-side for 1 week before decommissioning Gen2

## Migration Workflow: Step by Step

:::tip
💡 **Dynatrace has a built-in dashboard upgrade tool.** You don't need to manually rewrite every dashboard — the platform can auto-convert most classic tiles to DQL.
:::

### Method 1: Built-in Upgrade Button (Recommended)

```
Step  Action                                  Where
────  ──────────────────────────────────────  ──────────────────────────────────
1     Go to Dashboards Classic                 Ctrl+K → "Dashboards Classic"
2     Find the dashboard to upgrade            Browse or search by name
3     Click ⋮ → Upgrade                        Row menu or top-right ⋮ menu
4     Review the upgraded dashboard             Opens automatically in Dashboards app
5     Check for warning tiles                  Tiles that couldn't convert show warnings
6     Fix any failed tiles manually            Edit tile → rewrite DQL query
7     Apply Segments (replaces MZ filter)      Dashboard settings → Segments
8     Add Variables (replaces MZ dropdowns)    Dashboard settings → Variables
```

:::danger
⚠️ The upgrade does NOT delete the original classic dashboard. Both versions coexist — you can retry the upgrade or compare side-by-side. Only delete the classic version after validation.
:::

### Method 2: Data Explorer → Open With (Single Tiles)

For individual tiles, open them in Data Explorer, then select **Open with → Dashboards** to add the converted tile to a Gen3 dashboard.

### Method 3: Manual Rewrite (Complex Dashboards)

For dashboards with custom logic or many management zone filters, manual rewrite gives you the most control:

```
Step  Action                                  Tool / Command
────  ──────────────────────────────────────  ──────────────────────────────────
1     Export Gen2 dashboard JSON               Dynatrace UI → Dashboard → ⋮ → Export
2     List all tiles and their data sources    Review JSON → identify metric expressions
3     Convert each metric expression to DQL    Use the timeseries command (Module 05)
4     Create Gen3 dashboard                    Dashboards app → + Dashboard
5     Add DQL tiles one by one                 + Tile → Query Grail → paste DQL
6     Replace MZ filters with variables        Add variable → DQL query for dropdown
7     Test side-by-side for 1 week             Compare data between Gen2 and Gen3
8     Decommission Gen2 dashboard              Delete or archive after validation
```

### The Top-50 Strategy (Official Recommendation)

:::tip
💡 A good practice is to migrate only the **top 50 dashboards** by popularity. Typically only 10-15% of dashboards are regularly used. After migration, you'll need fewer dashboards thanks to variables and segments — one dynamic dashboard replaces multiple static ones.
:::

## Dashboard JSON Structure (v21)

Gen3 dashboards use a 20-unit grid system. Each tile has a DQL query and visualization config:

```json
{
  "version": 21,
  "variables": [],
  "tiles": {
    "tile-1": {
      "type": "data",
      "title": "CPU Usage",
      "query": "timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}",
      "visualization": "lineChart",
      "layout": { "x": 0, "y": 0, "w": 10, "h": 6 }
    }
  }
}
```

## Deploying via Document API

```bash
# Upload dashboard JSON
curl -X POST "$DT_URL/platform/document/v1/documents?name=My+Dashboard&type=dashboard" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @dashboard.json
```

:::danger
⚠️ `isPrivate=false` is ignored during creation. You must PATCH the document after creation to make it visible to others.
:::

## Common Tile Conversions

```
Gen2 Tile Type              Gen3 DQL Query
──────────────────────────  ──────────────────────────────────────────────
Host health tile            timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}
Service response time       timeseries percentile(dt.service.request.response_time, 95), by:{dt.entity.service}
Problem count               fetch dt.davis.problems | filter event.status == "ACTIVE" | summarize count()
Top errors table            fetch logs | filter loglevel == "ERROR" | summarize cnt=count(), by:{content} | sort cnt desc
Single value (KPI)          timeseries total = sum(dt.service.request.count, scalar:true)
```

## Dashboard JSON Gotchas

- **Always set `davis: { enabled: false }`** on data tiles — otherwise tiles may render incorrectly
- **24-column grid** — full width = 24, half = 12, third = 8
- **Quote "y" in YAML** — bare `y` is parsed as boolean `true`
- **Visualization selection**: barChart expects numeric x-axis — use pieChart or table for string categories
- **Threshold colors**: green `#2f6862`, yellow `#eea53c`, red `#c62239`

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"64%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["📊"," ","Phase 3: Migrate Dashboards"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",15]}],["$","span",null,{"c
