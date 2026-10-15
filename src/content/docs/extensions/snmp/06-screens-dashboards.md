---
title: "Screens & Dashboards"
course: "Dynatrace Extensions"
track: "SNMP Extensions"
moduleNumber: 6
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__06-screens-dashboards" data-course-slug="extensions">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Entity Screens

Extension concepts — screens, dashboards, topology

Screens define what users see when they click on an entity. Every entity type needs a screen with two parts:

```
Part              What It Shows
────────────────  ──────────────────────────────────────
detailsSettings   Properties panel (IP, model, firmware)
staticContent     Charts and tables (CPU, traffic, errors)
```

## Screen Definition

```yaml
screens:
  - entityType: my-ext:device
    detailsSettings:
      staticContent:
        showProblems: true
        showProperties: true
        showTags: true
        showGlobalFilter: true
        showAddTag: true
      layout:
        autoGenerate: false
        cards:
          - key: device-health
            type: CHART_GROUP
          - key: device-interfaces
            type: ENTITIES_LIST
    chartsCards:
      - key: device-health
        displayName: Device Health
        numberOfVisibleCharts: 3
        charts:
          - displayName: CPU Usage
            visualizationType: GRAPH_CHART
            graphChartConfig:
              metrics:
                - metricSelector: com.dynatrace.extension.my-ext.cpu
          - displayName: Memory Usage
            visualizationType: GRAPH_CHART
            graphChartConfig:
              metrics:
                - metricSelector: com.dynatrace.extension.my-ext.memory
    entitiesListCards:
      - key: device-interfaces
        displayName: Interfaces
        entitySelectorTemplate: type(my-ext:interface),fromRelationships.isChildOf($(entityConditions))
        columns:
          - type: ATTRIBUTE
            attribute:
              key: dt.entity.name
              displayName: Interface
```

:::tip
💡 Use `autoGenerate: true` during development to get a quick screen. Switch to `false` and define custom cards for production.
:::

## Bundled Dashboards

You can include up to 10 dashboard JSON files in your extension package:

```yaml
# In extension.yaml header
dashboards:
  - path: dashboards/overview.json
alerts:
  - path: alerts/high-cpu.json
```

:::note
🛠 **Try it:** Install any SNMP extension from the Hub → click on a discovered entity → you'll see the screen with charts and properties.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extension
