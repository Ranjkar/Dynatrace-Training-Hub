---
title: "Schema Discovery"
course: "DQL Cookbook"
track: "DQL Recipes"
moduleNumber: 0
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dql-cookbook__00-schema-discovery" data-course-slug="dql-cookbook">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Schema Discovery

Before writing any query, you need to know what data exists and what fields are available. These recipes help you explore.

## Discover Data Objects

```dql
// What entity types exist?
fetch dt.entity.host | summarize count=count()
fetch dt.entity.service | summarize count=count()
fetch dt.entity.process_group | summarize count=count()
fetch dt.entity.application | summarize count=count()
```

## Discover Fields

```dql
// Show ALL fields for any data object
describe dt.entity.host
describe dt.entity.service
describe logs
describe events
describe spans
describe bizevents
```

## Discover Metrics

```dql
// List all available host metrics (type in Notebook — autocomplete helps)
timeseries avg(dt.host.cpu.usage)
// Then change dt.host.cpu.usage to dt.host. and browse autocomplete

// List all service metrics
timeseries avg(dt.service.request.response_time)
```

## Discover Log Fields

```dql
// What log levels exist?
fetch logs | summarize cnt=count(), by:{loglevel} | sort cnt desc

// What log sources exist?
fetch logs | summarize cnt=count(), by:{log.source} | sort cnt desc

// What hosts generate logs?
fetch logs | summarize cnt=count(), by:{dt.entity.host} | sort cnt desc
```

## Discover Events

```dql
// What event kinds exist?
fetch events, from:now()-7d | summarize cnt=count(), by:{event.kind} | sort cnt desc

// What event types exist?
fetch events, from:now()-7d | summarize cnt=count(), by:{event.type} | sort cnt desc | limit 20
```

:::tip
💡 `describe` is your best friend. Run it on any data object to see every available field. Then use those fields in your queries.
:::

:::note
🛠 **Try it:** Open a Notebook → run `describe dt.entity.host` to see every field available on hosts. Then try `describe logs` and `describe spans`. The Semantic Dictionary (Ctrl+K → "Semantic Dictionary") shows all field definitions across all tables.
:::

## Advanced Function Categories

DQL has specialized function categories beyond the basics:

```
Category          Functions                                    Use Case
────────────────  ───────────────────────────────────────────  ──────────────────────────
Network           ipIsPrivate(), ipIsPublic(), ipMask(),       Filter by IP range,
                  ipIn(), isIp(), isIpV4()                     anonymize IPs
Hash              hashSha256(), hashMd5(), hashCrc32()         Mask PII, create dedup IDs
Statistical       correlation(), stddev(), variance(),         Advanced analytics
                  percentiles(), median()
Vector Distance   vectorCosineDistance(), vectorL2Distance()   AI embedding search
```

```dql
// Discover fields for any data object via Semantic Dictionary
fetch dt.semantic_dictionary.models | filter data_object == "logs"
fetch dt.semantic_dictionary.models | filter data_object == "spans"
```

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"dql-cookbook","title":"DQL Cookbook","subtitle":"Copy-Paste Recipes for
