---
title: "Python Topology & Screens"
course: "Dynatrace Extensions"
track: "Python Extensions"
moduleNumber: 11
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__11-python-topology" data-course-slug="extensions">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Python Topology

Smartscape topology — entities created from your extension

Topology works the same as SNMP — define entity types in extension.yaml. The difference: dimensions come from your `report_metric()` calls, not OIDs.

```yaml
topology:
  types:
    - name: my-api:endpoint
      displayName: API Endpoint
      rules:
        - idPattern: my-api_{endpoint}
          instanceNamePattern: "{endpoint}"
          iconPattern: api
          sources:
            - sourceType: Metrics
              condition: $prefix(com.dynatrace.extension.my-api)
          attributes:
            - key: url
              displayName: URL
              pattern: "{endpoint}"
```

## Reporting Dimensions for Topology

```python
def query(self):
    endpoints = ["/api/users", "/api/orders", "/api/health"]

    for endpoint in endpoints:
        response = requests.get(f"{self.base_url}{endpoint}", timeout=10)

        # These dimensions feed the topology idPattern
        self.report_metric(
            key="com.dynatrace.extension.my-api.response_time",
            value=response.elapsed.total_seconds() * 1000,
            dimensions={"endpoint": endpoint}  # → creates entity per endpoint
        )
```

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:600px;" viewbox="0 0 600 100" xmlns="http://www.w3.org/2000/svg">
<text fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" x="300" y="15">Python: Dimensions → Entities</text>
<rect fill="#14532d" height="30" rx="6" stroke="#22c55e" stroke-width="1" width="160" x="30" y="30"></rect>
<text fill="#86efac" font-size="9" text-anchor="middle" x="110" y="50">report_metric(dims=...)</text>
<text fill="#475569" font-size="14" x="200" y="50">→</text>
<rect fill="#172554" height="30" rx="6" stroke="#38bdf8" stroke-width="1" width="160" x="215" y="30"></rect>
<text fill="#7dd3fc" font-size="9" text-anchor="middle" x="295" y="50">idPattern match</text>
<text fill="#475569" font-size="14" x="385" y="50">→</text>
<rect fill="#1e293b" height="30" rx="6" stroke="#a78bfa" stroke-width="1" width="160" x="400" y="30"></rect>
<text fill="#c4b5fd" font-size="9" text-anchor="middle" x="480" y="50">Entity created!</text>
<text fill="#64748b" font-size="9" text-anchor="middle" x="300" y="85">Dimension values in report_metric() must match {placeholders} in idPattern</text>
</svg>
</div>

:::danger
⚠️ Dimension keys in `report_metric()` must exactly match the `{placeholder}` names in your topology `idPattern`. Mismatches = no entities.
:::

:::note
🛠 **Try it:** After deploying your Python extension, open Smartscape → look for your custom entity types. Then run `fetch dt.entity.YOUR_TYPE | fields entity.name, tags | limit 10` to verify topology creation.
:::

b:["$","div",null,{"c
