---
title: "SNMP Fundamentals"
course: "Dynatrace Extensions"
track: "SNMP Extensions"
moduleNumber: 1
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__01-snmp-fundamentals" data-course-slug="extensions">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## What is SNMP?

SNMP extension YAML reference

SNMP (Simple Network Management Protocol) is how you read data from network devices. Your extension asks a device for a value at a specific address — called an **OID** — and the device responds.

:::note
💡 Think of OIDs like file paths: `1.3.6.1.2.1.1.5.0` = the device's hostname. Each number navigates deeper into the device's data tree.
:::

## The OID Tree

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:700px;" viewbox="0 0 700 200" xmlns="http://www.w3.org/2000/svg">
<text fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle" x="350" y="20">OID Tree: 1.3.6.1.2.1 (MIB-2)</text>
<!-- Root -->
<rect fill="#172554" height="28" rx="6" stroke="#38bdf8" stroke-width="1" width="100" x="300" y="30"></rect>
<text fill="#7dd3fc" font-size="10" text-anchor="middle" x="350" y="49">iso.org.dod</text>
<!-- system branch -->
<line stroke="#475569" stroke-width="1" x1="250" x2="250" y1="58" y2="80"></line>
<line stroke="#475569" stroke-width="1" x1="350" x2="250" y1="58" y2="80"></line>
<rect fill="#14532d" height="28" rx="6" stroke="#22c55e" stroke-width="1" width="120" x="190" y="80"></rect>
<text fill="#86efac" font-size="10" text-anchor="middle" x="250" y="99">.1 system</text>
<!-- interfaces branch -->
<line stroke="#475569" stroke-width="1" x1="350" x2="450" y1="58" y2="80"></line>
<rect fill="#14532d" height="28" rx="6" stroke="#22c55e" stroke-width="1" width="120" x="390" y="80"></rect>
<text fill="#86efac" font-size="10" text-anchor="middle" x="450" y="99">.2 interfaces</text>
<!-- system leaves -->
<line stroke="#475569" stroke-width="1" x1="200" x2="200" y1="108" y2="130"></line>
<rect fill="#1e293b" height="28" rx="6" stroke="#a78bfa" stroke-width="1" width="120" x="140" y="130"></rect>
<text fill="#c4b5fd" font-size="9" text-anchor="middle" x="200" y="149">.1.5.0 sysName</text>
<line stroke="#475569" stroke-width="1" x1="300" x2="300" y1="108" y2="130"></line>
<rect fill="#1e293b" height="28" rx="6" stroke="#a78bfa" stroke-width="1" width="120" x="240" y="130"></rect>
<text fill="#c4b5fd" font-size="9" text-anchor="middle" x="300" y="149">.1.3.0 sysUpTime</text>
<!-- interface leaves -->
<line stroke="#475569" stroke-width="1" x1="450" x2="450" y1="108" y2="130"></line>
<rect fill="#1e293b" height="28" rx="6" stroke="#a78bfa" stroke-width="1" width="120" x="390" y="130"></rect>
<text fill="#c4b5fd" font-size="9" text-anchor="middle" x="450" y="149">.2.2.1.10 ifInOctets</text>
<text fill="#f59e0b" font-size="9" text-anchor="middle" x="200" y="178">Scalar (single value, ends in .0)</text>
<text fill="#f59e0b" font-size="9" text-anchor="middle" x="450" y="178">Table (one row per interface)</text>
</svg>
</div>

## Scalar vs Table OIDs

```
Type      OID Example                    What It Returns        .0 suffix?
────────  ─────────────────────────────  ─────────────────────  ──────────
Scalar    1.3.6.1.2.1.1.5.0             One value (hostname)   YES, required
Table     1.3.6.1.2.1.2.2.1.10          One row per interface  NO, never
```

:::danger
⚠️ **#1 SNMP bug:** Scalar OIDs MUST end in `.0`. Table OIDs must NOT end in `.0`. Getting this wrong = no data, no error message.
:::

## SNMP Versions

```
Version   Auth                          When to Use
────────  ────────────────────────────  ──────────────────────────
SNMPv2c   Community string (password)   Simple, most common
SNMPv3    Username + auth + encryption  Secure environments
```

## Finding OIDs

Three ways to find the OIDs you need:

1. **Vendor MIB files** — download from vendor website, open in MIB browser
2. **snmpwalk** — `snmpwalk -v2c -c public 192.168.1.1` dumps all OIDs
3. **Online MIB databases** — oid-info.com, circitor.fr/Mibs

:::note
🛠 **Try it:** Run `snmpwalk -v2c -c public <device-ip> 1.3.6.1.2.1.1` to see the system branch of any SNMP device.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"extensions","title":"Dynatrace Extensions","subtitle":"Build Extensions 2.0 From Scratch","color":"emerald","tracks":[{"id":"snmp","title":"SNMP Extensions","description
