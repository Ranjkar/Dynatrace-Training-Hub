---
title: "DQL Crash Course"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 2: Learn DQL"
moduleNumber: 10
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__04-dql-fundamentals" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## DQL — The One Language to Learn

DQL (Dynatrace Query Language) is the single replacement for metric expressions, USQL, entity selectors, and the Data Explorer. Learning DQL is the prerequisite for every migration step that follows.

:::note
🛠 **Try it now:** Open your Dynatrace environment → press **Ctrl+K** → type "Notebooks" → open a new Notebook. This is where you'll write DQL.
:::

## The Pipeline Pattern

Every DQL query follows the same pattern — a pipeline of commands connected with `|` (pipe):

Pipeline diagram

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 80" xmlns="http://www.w3.org/2000/svg">
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="2" width="110" x="10" y="20"></rect>
<text fill="#7dd3fc" font-size="12" font-weight="bold" text-anchor="middle" x="65" y="45">fetch</text>
<text fill="#475569" font-size="16" x="130" y="45">→</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#475569" stroke-width="1" width="110" x="145" y="20"></rect>
<text fill="#94a3b8" font-size="12" text-anchor="middle" x="200" y="45">filter</text>
<text fill="#475569" font-size="16" x="265" y="45">→</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#475569" stroke-width="1" width="110" x="280" y="20"></rect>
<text fill="#94a3b8" font-size="12" text-anchor="middle" x="335" y="45">fields</text>
<text fill="#475569" font-size="16" x="400" y="45">→</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#475569" stroke-width="1" width="110" x="415" y="20"></rect>
<text fill="#94a3b8" font-size="12" text-anchor="middle" x="470" y="45">summarize</text>
<text fill="#475569" font-size="16" x="535" y="45">→</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#475569" stroke-width="1" width="110" x="550" y="20"></rect>
<text fill="#94a3b8" font-size="12" text-anchor="middle" x="605" y="45">sort</text>
<text fill="#475569" font-size="16" x="670" y="45">→</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#475569" stroke-width="1" width="100" x="685" y="20"></rect>
<text fill="#94a3b8" font-size="12" text-anchor="middle" x="735" y="45">limit</text>
</svg>
</div>

## Two Starting Commands

Every query starts with one of two commands:

```
fetch      → rows of data (logs, events, entities, spans, problems)
timeseries → metrics over time (for charts)
```

## Your First Queries

Open a Notebook and try these one by one:

### 1. See your hosts

```dql
fetch dt.entity.host
| fields entity.name, osType, cpuCores
| limit 10
```

:::note
🛠 **Try it:** Paste this into a Notebook DQL section. You should see your hosts with their OS and CPU count.
:::

### 2. Check your logs

```dql
fetch logs, from:now() - 1h
| filter loglevel == "ERROR"
| fields timestamp, content, dt.process.name
| sort timestamp desc
| limit 20
```

### 3. See CPU over time (chart)

```dql
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}
```

:::tip
💡 In Notebooks, `timeseries` queries automatically render as line charts. `fetch` queries render as tables. You can change the visualization type in the UI.
:::

### 4. Count problems by category

```dql
fetch dt.davis.problems, from:now() - 7d
| filter not(dt.davis.is_duplicate) and event.status == "ACTIVE"
| summarize problem_count = count(), by:{event.category}
| sort problem_count desc
```

## Common Gotchas

:::danger
⚠️ These will bite you. Memorize them:
:::

```
WRONG                                   RIGHT
──────────────────────────────────────  ──────────────────────────────────────
filter log.level == "ERROR"             filter loglevel == "ERROR"
  (no dot — it's loglevel)               ✓

sort count() desc                       summarize cnt=count() | sort cnt desc
  (must alias aggregations)              ✓

fields name, id | sort name             sort name | fields name, id
  (sort BEFORE fields!)                  ✓

filter status in ["A","B"]              filter in(status, "A", "B")
  (no bracket syntax)                    ✓

fetch metrics                           timeseries avg(dt.host.cpu.usage)
  (no "fetch metrics")                   ✓
```

## What You Can Query

```
Data Object              What's In It                    Example Query Start
───────────────────────  ──────────────────────────────  ──────────────────────────
dt.entity.host           Hosts                           fetch dt.entity.host
dt.entity.service        Services                        fetch dt.entity.service
logs                     Application & system logs       fetch logs
events                   Davis events                    fetch events
dt.davis.problems        Davis problems                  fetch dt.davis.problems
spans                    Distributed traces              fetch spans
bizevents                Business events                 fetch bizevents
dt.system.events         Billing & usage                 fetch dt.system.events
user.sessions            RUM sessions                    fetch user.sessions
user.events              RUM events                      fetch user.events
```

:::tip
💡 **Discovery trick:** Run `describe dt.entity.host` in a Notebook to see ALL available fields for any data object. This is how you explore the schema.
:::

:::tip
💡 **Davis CoPilot:** In a Notebook, add a Prompt section and ask in plain English: "Show me error logs from the last hour grouped by service". CoPilot generates and runs the DQL for you — great for learning the syntax.
:::

## Advanced Commands (Power User)

```
Command          What It Does                              Example
───────────────  ────────────────────────────────────────  ──────────────────────────────
lookup           Enrich data from another table             lookup [load dt.entity.host], sourceField:id, lookupField:id
join             Correlate two data sources                 join [fetch logs], on:{dt.entity.host}
append           Combine results from two queries           append [fetch dt.entity.service]
makeTimeseries   Create time chart from non-metric data     makeTimeseries count(), by:{loglevel}, interval:15m
expand           Flatten arrays into rows                   expand tags
```

### Lookup: Enrich with Context

```dql
// Add host names to log records
fetch logs, from:now() - 1h
| lookup [fetch dt.entity.host | fields id, entity.name], sourceField:dt.entity.host, lookupField:id, prefix:"host."
| fields timestamp, host.entity.name, content
```

:::tip
💡 **Lookup tables:** Dynatrace now supports uploading CSV files as lookup tables in Grail. Use `load` to query them — perfect for enriching data with business context (cost centers, team owners, SLA tiers).
:::

### makeTimeseries: Charts from Any Data

```dql
// Error rate chart from logs (not metrics!)
fetch logs, from:now() - 2h
| makeTimeseries count(), by:{loglevel}, interval:15m
```

:::danger
⚠️ `makeTimeseries` works on fetched data (logs, events, spans). `timeseries` works on metrics. Don't confuse them — `timeseries` is a starting command, `makeTimeseries` is a pipe command.
:::

:::danger
⚠️ **Named parameters required** — many DQL functions need named params, not positional:

```
WRONG: substring(content, 0, 100)     RIGHT: substring(content, from:0, to:100)
WRONG: if(x > 10, "high", "low")      RIGHT: if(x > 10, then:"high", else:"low")
```
:::

:::tip
💡 **HTTP error rates**: `status == "ERROR"` is unreliable for HTTP services. Use `countIf(http.response.status_code >= 500)` instead.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"44%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🔍"," ","Phase 2: Lear
