---
title: "DQL Fundamentals"
course: "From Zero to Hero"
track: "Track 2: Query & Explore"
moduleNumber: 5
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__04-dql-fundamentals" data-course-slug="zero-to-hero">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## DQL Fundamentals

DQL (Dynatrace Query Language) is the single query language for all data in Grail. Every dashboard tile, every alert, every notebook section uses DQL.

## The Pipeline Pattern

Every DQL query is a pipeline — data flows through commands connected by `|` (pipe):

```dql
fetch logs                          // 1. Load data
| filter loglevel == "ERROR"        // 2. Keep only errors
| fields timestamp, content         // 3. Select columns
| sort timestamp desc               // 4. Order results
| limit 10                          // 5. Limit output
```

## Essential Commands

```
Command         What It Does                              Example
──────────────  ──────────────────────────────────────    ──────────────────────────
fetch           Load data from Grail                      fetch logs
timeseries      Load metrics as time series                timeseries avg(dt.host.cpu.usage)
filter          Keep rows matching condition               filter loglevel == "ERROR"
filterOut       Remove rows matching condition             filterOut loglevel == "NONE"
fields          Select specific columns                    fields timestamp, content
fieldsAdd       Add computed columns                       fieldsAdd duration_ms = duration / 1000
sort            Order results                              sort timestamp desc
limit           Limit number of results                    limit 20
summarize       Group and aggregate                        summarize count(), by:{loglevel}
dedup           Remove duplicates                          dedup entity.name
parse           Extract fields from text                   parse content, "JSON:log"
expand          Flatten arrays into rows                   expand tags
describe        Show schema of a data object               describe dt.entity.host
```

## Aggregation Functions

```
Function        What It Calculates                        Example
──────────────  ──────────────────────────────────────    ──────────────────────────
count()         Number of records                         summarize cnt=count()
avg()           Average value                             summarize avg(duration)
sum()           Total                                     summarize sum(bytes)
min() / max()   Minimum / maximum                         summarize max(cpu)
percentile()    Percentile value                          summarize p95=percentile(rt, 95)
countIf()       Conditional count                         summarize errors=countIf(status >= 400)
```

:::danger
⚠️ You MUST alias aggregations before sorting: `summarize cnt=count() | sort cnt desc`. Writing `sort count() desc` directly will fail.
:::

## Hands-On: Try These Queries

```dql
// Count logs by level
fetch logs
| summarize cnt=count(), by:{loglevel}
| sort cnt desc

// Host CPU over time
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}

// Services with their type
fetch dt.entity.service
| fields entity.name, serviceType

// Errors in the last hour
fetch logs, from:now()-1h
| filter loglevel == "ERROR"
| summarize cnt=count()
```

:::note
🛠 **Try it:** Open a Notebook → paste each query in a separate DQL section → run them. `timeseries` queries render as charts, `fetch` queries render as tables.
:::

## Key Rules

- **Strings use double quotes** — `"ERROR"` not `'ERROR'` (single quotes are not supported)
- **Sort BEFORE fields** — `sort` needs the column to exist, `fields` drops columns
- **timeseries is a starting command** — for metrics only, not for logs/events
- **makeTimeseries is a pipe command** — creates time series from fetched data (logs, events)
- **describe** shows all available fields for any data object
- **Named parameters required** — `substring(content, from:0, to:100)` not `substring(content, 0, 100)`. Same for `if(x > 10, then:"high", else:"low")`
- **Backticks for special field names** — ``error-code`` for fields with hyphens or special characters
- **array() for multi-value filters** — `filter in(loglevel, array("ERROR", "WARN", "SEVERE"))`
- **Expand uses brackets** — after `expand arr`, access fields via `arr[field]` NOT `arr.field`

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":[{"id":"hero-foundation","title":"Track 1: Foundation","description":"What is observability, how Dynat
