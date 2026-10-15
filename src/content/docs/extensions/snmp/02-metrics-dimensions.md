---
title: "Metrics & Dimensions"
course: "Dynatrace Extensions"
track: "SNMP Extensions"
moduleNumber: 2
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__02-metrics-dimensions" data-course-slug="extensions">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## From OIDs to Metrics

Every metric needs three things: a **key**, a **value** (the OID), and a **type**.

```yaml
metrics:
  - key: com.dynatrace.extension.my-device.cpu
    value: oid:1.3.6.1.4.1.9.9.109.1.1.1.1.8.1
    type: gauge
```

## Metric Types

```
Type      What It Means                 Example
────────  ────────────────────────────  ──────────────────────────
gauge     Current value (can go up/down) CPU %, temperature, memory
count     Cumulative counter             Total bytes, total packets
```

:::danger
⚠️ Count metric keys MUST end in `.count`. Example: `my-device.if.in.octets.count`. Dynatrace uses this suffix to calculate rates automatically.
:::

## Real-World Example: SNMP Generic Device (47 metrics)

The official `snmp-generic-device` extension (1,989 lines) monitors any network device. Here's how it declares metrics:

```yaml
# From com.dynatrace.extension.snmp-generic-device v2.5.12
metrics:
  - key: com.dynatrace.extension.snmp-generic-device.snmp.in.pkts.count
    metadata:
      displayName: Messages delivered
      description: Total number of messages delivered from the transport service
      unit: Count
      sourceEntityType: snmp:com_dynatrace_extension_snmp_generic_device
  - key: com.dynatrace.extension.snmp-generic-device.if.hc.in.octets.count
    metadata:
      displayName: Octets received (64-bit)
      unit: Count
      sourceEntityType: snmp:com_dynatrace_extension_snmp_generic_device_interface
```

:::tip
💡 `sourceEntityType` links a metric to a topology entity. This is how Dynatrace knows which entity a metric belongs to — critical for screens and dashboards.
:::

## Dimensions

Dimensions are labels attached to metrics. Four value sources:

```yaml
dimensions:
  - key: sys.name
    value: oid:1.3.6.1.2.1.1.5.0       # From SNMP: poll an OID
    filter: const:$and($not($eq(n/a)), $not($eq()))  # Filter empty values
  - key: device.address
    value: this:device.address           # Built-in: from monitoring config
  - key: device.type
    value: const:generic                 # Constant: hardcoded string
  - key: activation.tag
    value: var:ext.activationtag         # Variable: user-configurable
```

```
Source     Syntax                  Use Case
────────── ──────────────────────  ──────────────────────────────
oid:       oid:1.3.6.1.2.1.1.5.0  Read value from SNMP device
this:      this:device.address     Built-in device property
const:     const:Cisco             Hardcoded constant
var:       var:ext.activationtag   User-configurable variable
```

## Dimension Filters

Filters control which rows are captured. Real extensions use these patterns:

```yaml
# Variable filter — user picks which interfaces to monitor
- key: if.name
  value: oid:1.3.6.1.2.1.31.1.1.1.1
  filter: var:if_name

# Constant filter — exclude empty/invalid values
- key: mac.address
  value: oid:1.3.6.1.2.1.2.2.1.6
  filter: const:$and($not($eq(n/a)), $not($eq()))
```

## Metric Metadata

Declare display names, units, and entity links at the root `metrics:` level:

```yaml
metrics:
  - key: com.dynatrace.extension.my-device.cpu
    metadata:
      displayName: CPU Utilization
      description: Current CPU usage percentage
      unit: Percent
      sourceEntityType: vendor:device    # Links to your topology entity
      dimensions:                        # Dimension metadata (for Python)
        - key: device.address
          displayName: Device Address
```

```
Common Units
────────────────────────────────────────
Percent, Count, Byte, BytePerSecond,
BitPerSecond, MegaBitPerSecond,
Second, MilliSecond, Hour, State
```

:::note
🛠 **Try it:** Open Ctrl+K → "Metrics" → search for any extension metric (try "ext:"). Click a metric to see its dimensions, chart it over time, and check which entities report it. This is how you verify your extension metrics are flowing.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extensions","title":"Dynatrace Extensions","subtitle":"Build Extensions 2.0 From Scratch","color":"emerald","tracks":[{"id":"snmp","title":"SNMP Extensions","description":"Build a complete SNMP monitoring extension from an empty file to
