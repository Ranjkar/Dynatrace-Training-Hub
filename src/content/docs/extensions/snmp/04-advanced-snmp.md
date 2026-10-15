---
title: "Advanced SNMP"
course: "Dynatrace Extensions"
track: "SNMP Extensions"
moduleNumber: 4
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__04-advanced-snmp" data-course-slug="extensions">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Filtering Empty Values

Extension metrics model

SNMP devices often return `n/a` or empty strings for unused interfaces. Filter them out to prevent ghost entities:

```yaml
dimensions:
  - key: if.name
    value: oid:1.3.6.1.2.1.31.1.1.1.1
    filter: const:$not($eq())    # Exclude empty strings
```

## Filter Expressions

```
Expression                          What It Does
──────────────────────────────────  ──────────────────────────────
const:$eq(GigabitEthernet)          Equals exact string
const:$prefix(Gig)                  Starts with
const:$suffix(/0/1)                 Ends with
const:$contains(Ethernet)           Contains substring
const:$not($eq())                   Not empty
const:$and($prefix(Gig),$not($eq())) Combine: starts with Gig AND not empty
const:$or($prefix(Gig),$prefix(Ten)) Either Gig or Ten interfaces
```

:::tip
💡 Use `var:ifNameFilter` to make filters configurable per monitoring configuration — users can set the filter pattern in the Hub UI.
:::

## Variables

Variables make your extension configurable without editing YAML:

```yaml
vars:
  - id: ifNameFilter
    displayName: Interface name filter
    type: text
    description: "Pattern to filter interfaces (e.g., GigabitEthernet)"
  - id: ext.activationtag
    displayName: Activation tag
    type: text
    description: "Tag for this monitoring configuration"
```

:::note
🛠 **Try it:** Add a variable to your extension, then activate it in the Hub — you'll see the variable as a text field in the activation wizard.
:::

## Advanced SNMP Properties

```
Property              Default   What It Does
────────────────────  ────────  ──────────────────────────────────
Timeout (seconds)     2         Max wait per SNMP query
Retries               3         Retry count on failure
Max repetitions       50        Rows per SNMP GET-BULK request
Max OIDs per query    60        OIDs bundled per request
                                (F5 BIG-IP: set to 5!)
```

:::danger
⚠️ For F5 BIG-IP extensions, set "Max OIDs per query" to **5**. The default 60 causes timeouts on F5 devices.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extensions","title":"Dynatrace Extensions","subtitle":"Build Extensions 2.0 From Scratch","color":"emerald","tracks":[{"id":"snmp","title":"SNMP Extensions
