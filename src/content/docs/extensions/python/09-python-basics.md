---
title: "Python Extension Basics"
course: "Dynatrace Extensions"
track: "Python Extensions"
moduleNumber: 9
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__09-python-basics" data-course-slug="extensions">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## When to Use Python Extensions

SNMP extensions are YAML-only. Python extensions let you write code for data sources SNMP can't reach:

```
Data Source   Count in Hub  Example Extensions
────────────  ────────────  ──────────────────────────────────────────
SNMP          19            Generic network device, Cisco, Juniper, F5 BIG-IP
Python        33+           Dell iDRAC, HP iLO, FortiGate, Elasticsearch, Google Cloud
JMX           12            Kafka, Cassandra, Tomcat, ActiveMQ
SQL           14            PostgreSQL, MySQL, Oracle, MSSQL, Snowflake
Prometheus    12            HAProxy, Redis, Istio, Confluent Cloud
WMI           1             .NET extension
```

:::tip
💡 Rule of thumb: if the device speaks SNMP, use SNMP (no code). If it has a REST API, use Python. If it exposes JMX MBeans, use JMX. All except Python are declarative YAML — no coding required.
:::

## Real Python Extensions in the Hub

```
Extension              Lines   Metrics  Feature Sets  What It Monitors
─────────────────────  ──────  ───────  ────────────  ──────────────────────
Dell iDRAC v1.4.2      14,823  122      28            Server hardware via Redfish API
FortiGate v1.8.9       2,508   27       5             Firewall via REST API
HP iLO v1.3.9          1,050   30       6             Server hardware via Redfish API
Elasticsearch v2.2.5   3,667   31       26            Search cluster via Management API
```

## Python Extension Package Structure (from Dell iDRAC)

```
extension.zip
├── extension.yaml           # 14,823 lines — metrics, topology, screens
├── activationSchema.json    # Monitoring config UI (endpoints, auth, toggles)
├── lib/                     # Python wheels
│   ├── dt_extensions_sdk-1.9.7-py3-none-any.whl
│   ├── python_dell_idrac-1.1.0-py3-none-any.whl
│   ├── requests-2.33.1-py3-none-any.whl
│   └── ... (certifi, urllib3, etc.)
├── dashboards/              # Bundled dashboard JSON
├── documents/               # Gen3 dashboard documents
└── openpipeline/            # Metrics pipeline config
```

## The Python SDK

```python
from dynatrace_extension import Extension, Status, StatusValue

class MyExtension(Extension):
    def initialize(self):
        """Called once when extension starts"""
        self.logger.info("Extension initialized")

    def query(self):
        """Called every polling interval"""
        # Report a metric
        self.report_metric(
            key="com.dynatrace.extension.my-api.response_time",
            value=42.5,
            dimensions={"endpoint": "/api/health"}
        )

        # Report extension health
        self.report_dt_extension_status(
            status=Status(StatusValue.OK)
        )

def main():
    MyExtension().run()
```

## extension.yaml for Python (from FortiGate)

```yaml
name: com.dynatrace.extension.fortigate
version: 1.8.9
minDynatraceVersion: "1.318.0"
author:
  name: Dynatrace

python:
  runtime:
    module: fortigate                    # PEP8: lowercase_underscores
    version:
      min: '3.10'
  activation:
    remote:
      path: activationSchema.json
      split:                             # Multi-endpoint monitoring
        propertyPath: /pythonRemote/endpoints
        bucketSizePath: /pythonRemote/global_advanced/bucket_size
  featureSets:
    - featureSet: default
      metrics:
        - key: com.dynatrace.extension.network_device.cpu_usage
        - key: com.dynatrace.extension.network_device.memory_usage
    - featureSet: Interfaces
      metrics:
        - key: fortigate.interface.bytes.in.count
        - key: fortigate.interface.speed
        - key: fortigate.interface.status
```

:::note
🛠 **Key difference from SNMP:** Python metrics only declare the `key` in featureSets — the actual values are reported by your Python code via `self.report_metric()`. The `activation.remote.split` enables monitoring multiple devices from one config.
:::

:::note
🛠 **Try it:** Run `pip install dt-extensions-sdk` → then `dt-sdk create my-extension` to scaffold a new Python extension project. Open the generated files to see the SDK structure: extension.yaml, __main__.py, and the activation schema.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extensions","title":"Dynatrace Extensions","subtitle":"Build Extensions 2.0 From Scratch","color":"emerald","tracks":[{"id":"snmp","title":"SNMP Extensions","description":"Build a complete SNMP monitoring extension from an empty file to produ
