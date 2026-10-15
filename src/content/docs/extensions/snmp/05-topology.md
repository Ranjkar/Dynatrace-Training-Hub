---
title: "Topology: Entities & Relationships"
course: "Dynatrace Extensions"
track: "SNMP Extensions"
moduleNumber: 5
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__05-topology" data-course-slug="extensions">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## What is Topology?

Topology turns your metrics into **entities** — things you can click on in Dynatrace. A device entity, interface entities, sensor entities — each with their own page.

:::note
💡 Without topology, your metrics are just numbers. With topology, they become clickable entities in Smartscape with relationships, screens, and alerting.
:::

## Real-World Topology Scale

```
Extension                Entity Types  Relationships  Pattern
───────────────────────  ────────────  ─────────────  ──────────────────────
SNMP Generic Device      2             6              network:device + network:interface
Checkpoint Firewall      2             4              checkpoint:firewall + interface
F5 BIG-IP                15            20+            f5:instance, f5:pool, f5:pool:member, f5:virtualserver...
FortiGate (Python)       5             8              fortinet:fortigate, fortigate_vdom, interface, tunnel...
Juniper Networks         10            12+            juniper device, disk, FRU, routing engine, VLAN...
```

Naming convention: `vendor:entity_type` — e.g. `f5:pool`, `fortinet:fortigate_vdom`, `network:device`.

## Defining Entity Types (from snmp-generic-device)

```yaml
topology:
  types:
    - name: network:device                    # vendor:entity_type convention
      displayName: Network device
      enabled: true
      rules:
        - idPattern: network_device_{device.address}  # Must be globally unique
          instanceNamePattern: "{sys.name}"            # Display name in UI
          iconPattern: host                            # host, network-interfaces, switch, cisco
          sources:
            - sourceType: Metrics
              condition: $prefix(com.dynatrace.extension.snmp-generic-device)
          requiredDimensions:                  # Entity only created when ALL present
            - key: sys.name
            - key: device.address
          attributes:                          # Entity properties visible in UI
            - key: dt.ip_addresses             # SPECIAL: enables IP lookup in Dynatrace
              pattern: "{device.address}"
              displayName: Device Address
            - key: dt.dns_names                # SPECIAL: enables DNS lookup
              pattern: "{device.name}"
            - key: dt.listen_ports             # SPECIAL: enables port display
              pattern: "{device.port}"
            - key: dt.security_context         # SPECIAL: enables ABAC filtering
              pattern: "{dt.security_context}"
            - key: devDescription              # Custom attribute
              pattern: "{sys.description}"
              displayName: Description
```

:::tip
💡 **Special attributes**: `dt.ip_addresses`, `dt.dns_names`, `dt.listen_ports`, and `dt.security_context` are magic keys that Dynatrace uses for IP resolution, DNS lookup, port display, and ABAC access control.
:::

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:600px;" viewbox="0 0 600 120" xmlns="http://www.w3.org/2000/svg">
<text fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" x="300" y="15">Topology: Device → Interfaces</text>
<rect fill="#172554" height="35" rx="8" stroke="#38bdf8" stroke-width="1.5" width="160" x="220" y="25"></rect>
<text fill="#7dd3fc" font-size="10" font-weight="bold" text-anchor="middle" x="300" y="47">🔲 my-ext:device</text>
<line stroke="#475569" x1="250" x2="150" y1="60" y2="85"></line>
<line stroke="#475569" x1="300" x2="300" y1="60" y2="85"></line>
<line stroke="#475569" x1="350" x2="450" y1="60" y2="85"></line>
<rect fill="#1e293b" height="28" rx="6" stroke="#a78bfa" stroke-width="1" width="140" x="80" y="85"></rect>
<text fill="#c4b5fd" font-size="9" text-anchor="middle" x="150" y="103">🔌 GigabitEth0/1</text>
<rect fill="#1e293b" height="28" rx="6" stroke="#a78bfa" stroke-width="1" width="140" x="230" y="85"></rect>
<text fill="#c4b5fd" font-size="9" text-anchor="middle" x="300" y="103">🔌 GigabitEth0/2</text>
<rect fill="#1e293b" height="28" rx="6" stroke="#a78bfa" stroke-width="1" width="140" x="380" y="85"></rect>
<text fill="#c4b5fd" font-size="9" text-anchor="middle" x="450" y="103">🔌 TenGigEth1/1</text>
</svg>
</div>

## Relationships

```yaml
topology:
  relationships:
    - typeOfRelation: CHILD_OF
      fromType: my-ext:interface
      toType: my-ext:device
      sources:
        - sourceType: Metrics
          condition: $prefix(com.dynatrace.extension.my-ext.if)
```

:::danger
⚠️ The `idPattern` must be unique per entity instance. Use dimensions like `{device.address}` and `{if.name}` to guarantee uniqueness.
:::

:::note
🛠 **Try it:** Open the Smartscape app → look for custom entity types created by extensions (they appear as new node types in the graph). Try: `fetch dt.entity.custom_device | fields entity.name, entity.type | limit 10` in a Notebook.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extensions","title":"Dynatrace Extensions","subtitle":"Build Ext
