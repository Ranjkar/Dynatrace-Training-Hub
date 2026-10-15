---
title: "Migrate Metric Expressions → timeseries"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 2: Learn DQL"
moduleNumber: 11
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__05-metrics-timeseries" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Metrics in Gen3: timeseries

In Gen2, you used metric expressions like `builtin:host.cpu.usage:avg:splitBy("dt.entity.host")`. In Gen3, you use the `timeseries` command.

Comparison diagram

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 100" xmlns="http://www.w3.org/2000/svg">
<rect fill="#1f2937" height="36" rx="6" stroke="#f87171" stroke-width="1" width="350" x="10" y="10"></rect>
<text fill="#fca5a5" font-size="10" text-anchor="middle" x="185" y="33">builtin:host.cpu.usage:avg:splitBy("dt.entity.host")</text>
<text fill="#6b7280" font-size="10" text-anchor="middle" x="185" y="60">Gen2 metric expression</text>
<text fill="#38bdf8" font-size="22" text-anchor="middle" x="400" y="33">→</text>
<rect fill="#172554" height="36" rx="6" stroke="#38bdf8" stroke-width="1" width="350" x="440" y="10"></rect>
<text fill="#7dd3fc" font-size="10" text-anchor="middle" x="615" y="33">timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}</text>
<text fill="#6b7280" font-size="10" text-anchor="middle" x="615" y="60">Gen3 DQL timeseries</text>
</svg>
</div>

## Basic Patterns

```dql
// Single metric
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}

// Multiple metrics together
timeseries {
  cpu = avg(dt.host.cpu.usage),
  memory = avg(dt.host.memory.usage),
  disk = avg(dt.host.disk.used.percent)
}, by:{dt.entity.host}

// With time range
timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}, from:now()-2h
```

:::note
🛠 **Try it:** Open a Notebook → add DQL section → paste the multi-metric query above. You'll get a chart with CPU, memory, and disk on the same timeline.
:::

## Key Metric Names

```
Gen2 Metric Key                         Gen3 Metric Key
──────────────────────────────────────  ──────────────────────────────────────
builtin:host.cpu.usage                  dt.host.cpu.usage
builtin:host.mem.usage                  dt.host.memory.usage
builtin:host.disk.usedPct               dt.host.disk.used.percent
builtin:service.response.time           dt.service.request.response_time
builtin:service.requestCount.total      dt.service.request.count
builtin:service.errors.total.count      dt.service.request.failure_count
```

:::danger
⚠️ `dt.service.request.response_time` is in **microseconds**, not milliseconds. Divide by 1000 for ms.
:::

## Aggregation Functions

```
avg()          — average
sum()          — total
min() / max()  — extremes
percentile(metric, 95)  — P95 (great for response time)
count(metric)  — distinct metric series per time slot
```

## Post-Processing Timeseries Results

```dql
timeseries cpu = avg(dt.host.cpu.usage), by:{dt.entity.host}
| fieldsAdd avg_cpu = arrayAvg(cpu), max_cpu = arrayMax(cpu)
| filter avg_cpu > 50
```

:::tip
💡 Timeseries results are arrays. Use `arrayAvg()`, `arrayMax()`, `arraySum()` to aggregate them into single values for filtering or sorting.
:::

## Metric Discovery

```dql
// Discover up to 20 host CPU metric keys
metrics from:now()-15m, to:now()
| filter startsWith(metric.key, "dt.host.cpu.")
| fields metric.key
| dedup metric.key
| sort metric.key asc
| limit 20
```

`metrics` discovers keys and dimensions, not measurement values. Discovery is limited to the last ten days and 100,000 scanned series; narrow the filter and inspect query warnings. This capped result is not a complete inventory. Discovery uses coarse time windows, so use `timeseries` to check values within your requested interval.

:::note
🛠 **Try it:** In a Notebook, start typing `timeseries avg(dt.host.` to explore autocomplete suggestions. Confirm the chosen metric and dimensions in your environment; suggestions are not proof of recent data.
:::

## Advanced Timeseries Parameters

The `timeseries` command has powerful parameters beyond the basics:

```
Parameter    What It Does                              Example
───────────  ────────────────────────────────────────  ──────────────────────────────
filter:{}    Filter entities INSIDE the command         filter:{dt.entity.host == "HOST-123"}
shift:       Compare with a past period                 shift:-7d (overlay last week)
default:     Fill empty time slots                      default:0 (may still return no rows)
nonempty:    Produce an empty series if no data matches nonempty:true
scalar:      Collapse array to single value              scalar:true (for tables)
union:       Keep groups present in any aggregation     union:true
interval:    Time bucket size                            interval:1h, interval:5m
```

By default, multiple aggregations retain only groups present in every aggregation (intersection). `union:true` retains groups present in any aggregation; it does not add entities missing from all metrics. `default:0` fills empty time slots, but alone may still return no rows. Combine it with `nonempty:true` when you deliberately want a zero-filled series even if no data matches.

**Missing telemetry is not automatically a measured zero.** Choose zero-filling based on what the metric means, not just to remove chart gaps. See the [official metric command reference](https://docs.dynatrace.com/docs/platform/grail/dynatrace-query-language/commands/metric-commands).

```dql
// Week-over-week comparison with shift
timeseries current = avg(dt.host.cpu.usage),
  by:{dt.smartscape.host},
  from:now()-15m, to:now(), interval:1m
| append [
    timeseries previous = avg(dt.host.cpu.usage),
      by:{dt.smartscape.host},
      from:now()-15m, to:now(), interval:1m, shift:-7d
  ]

// Scalar for table output (single value per entity)
timeseries usage = avg(dt.host.cpu.usage, scalar:true), by:{dt.entity.host}
| sort usage desc
| limit 5
```

:::tip
💡 `filter:{}` inside timeseries is more performant than `| filter` after the pipe — it filters at the data source level. Use it for entity filtering.
:::

The comparison queries the last 15 minutes and the corresponding period seven days earlier. The shifted observations are displayed on the current time axis. Missing historical data remains missing—it is not zero.

## 🔧 Migration Step: Convert Your Metric Expressions

For each Gen2 metric expression in your dashboards and alerts, convert using this pattern:

```
Gen2 Metric Expression                              Gen3 DQL Timeseries
──────────────────────────────────────────────────  ──────────────────────────────────────
builtin:host.cpu.usage:avg                          timeseries avg(dt.host.cpu.usage)
builtin:host.cpu.usage:avg:splitBy("dt.entity.host") timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}
builtin:service.response.time:percentile(95)        timeseries percentile(dt.service.request.response_time, 95)
builtin:host.mem.usage:max:splitBy():sort(value,    timeseries m=max(dt.host.memory.usage, scalar:true),
  descending):limit(5)                                by:{dt.entity.host} | sort m desc | limit 5
(metricA - metricB) / metricA * 100                 Aggregate A and B, then calculate with fieldsAdd
```

:::note
🛠 **Migration shortcut:** Use autocomplete and the discovery query above to find candidate metrics, then verify their meaning, dimensions, and data. Check mappings against the [official Grail metric reference](https://docs.dynatrace.com/docs/analyze-explore-automate/metrics/built-in-metrics-on-grail); byte and percentage metrics are not interchangeable.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"48%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children
