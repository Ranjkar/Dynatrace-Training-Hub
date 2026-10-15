---
title: "Tile Reference Guide"
course: "Dashboard Gallery"
track: "Dashboard Patterns"
moduleNumber: 6
lessonType: "Reference"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dashboards__06-tile-reference" data-course-slug="dashboards">
<em>Format: Reference &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Tile Reference Guide

Everything you need to know about dashboard tile configuration — visualization types, settings, thresholds, and unit overrides.

## Visualization Types

```
Type          Best For                                    Data Shape
────────────  ──────────────────────────────────────────  ──────────────────
singleValue   KPI cards (one number)                      Single aggregated value
lineChart     Time series trends                          timeseries / makeTimeseries
areaChart     Stacked time series                         timeseries / makeTimeseries
barChart      Numeric x-axis comparisons                  Aggregated with numeric axis
pieChart      Proportional breakdowns (few groups)        Summarize with grouping
table         Multi-column data, many rows                Any query result
honeycomb     Entity health grids                         Entity status data
scatterplot   Two-variable correlation                    Two numeric fields
```

:::danger
⚠️ `barChart` expects a numeric or time x-axis. String categories (service names, namespaces) render poorly — use `pieChart` for proportions or `table` for precise values.
:::

## Tile JSON Structure

```
"tiles": {
  "1": {
    "title": "Tile Title",
    "type": "data",           // "data" for DQL, "markdown" for text
    "query": "timeseries avg(dt.host.cpu.usage)",
    "visualization": "lineChart",
    "visualizationSettings": {
      "autoSelectVisualization": false
    },
    "davis": {
      "enabled": false,       // ALWAYS set to false on data tiles
      "davisVisualization": { "isAvailable": true }
    }
  }
}
```

## visualizationSettings by Type

### singleValue

```
"singleValue": {
  "showLabel": true,
  "label": "Error Count",
  "recordField": "errors"    // MUST match query alias
}
```

### Charts (lineChart / areaChart / barChart)

```
"chartSettings": {
  "legend": { "position": "bottom", "showLegend": true },
  "stacked": true            // for stacked area/bar
},
"axes": { "yAxis": { "label": "Count" } }
```

### Table

```
"table": {
  "linewrapEnabled": true,
  "columnWidths": { "[\"content\"]": 500 },
  "columnOrder": ["[\"field1\"]", "[\"field2\"]"]
}
```

## Thresholds (Color Rules)

```
"thresholds": [{
  "field": "error_rate",
  "isEnabled": true,
  "rules": [
    { "color": { "Default": "#2f6862" }, "comparator": "<=", "value": 1 },
    { "color": { "Default": "#eea53c" }, "comparator": "<=", "value": 5 },
    { "color": { "Default": "#c62239" }, "comparator": ">",  "value": 5 }
  ]
}]
```

Theme colors: green `#2f6862`, yellow `#eea53c`, red `#c62239`.

## Unit Overrides

```
"unitsOverrides": [{
  "identifier": "p99",       // must match query alias
  "baseUnit": "nanosecond",  // nanosecond | millisecond | second
  "displayUnit": null,       // null = auto-format
  "decimals": 1
}]
```

## Layout Grid

```
24 columns wide. Common widths:
  Full width = 24    Half = 12    Third = 8    Quarter = 6

"layouts": {
  "1": { "x": 0, "y": 0, "w": 12, "h": 6 }
}
```

:::danger
⚠️ Quote `"y"` in YAML — bare `y` is parsed as boolean `true` by YAML parsers.
:::

QUIZ:11

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: What must you always set on data tiles?</strong></p>
<ul>
<li>✅ davis: { enabled: false }</li>
<li>❌ davis: { enabled: true }</li>
<li>❌ davis is optional</li>
</ul>
<p><strong>Q: What's the Dynatrace theme color for "warning"?</strong></p>
<ul>
<li>❌ #dc3545 (that's red/critical)</li>
<li>✅ #eea53c (yellow/warning)</li>
<li>❌ #2f6862 (that's green/ideal)</li>
</ul>
</details>

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"dashboards","title":"Dashboard Gallery","subtitle":"Productio
