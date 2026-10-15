---
title: "Log Analysis Recipes"
course: "DQL Cookbook"
track: "DQL Recipes"
moduleNumber: 3
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dql-cookbook__03-log-analysis" data-course-slug="dql-cookbook">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Log Analysis Recipes

## Error Count by Level

```dql
fetch logs
| summarize cnt=count(), by:{loglevel}
| sort cnt desc
```

## Errors Over Time

```dql
fetch logs
| filter loglevel == "ERROR"
| makeTimeseries count=count()
```

## Top Error Messages

```dql
fetch logs
| filter loglevel == "ERROR"
| summarize cnt=count(), by:{content}
| sort cnt desc
| limit 10
```

## Errors by Source

```dql
fetch logs
| filter loglevel == "ERROR"
| summarize cnt=count(), by:{log.source}
| sort cnt desc
```

## Log Volume by Host

```dql
fetch logs
| summarize cnt=count(), by:{dt.entity.host}
| sort cnt desc
```

## Error Spike Detection

```dql
fetch logs
| filter loglevel == "ERROR"
| makeTimeseries errors=count(), by:{log.source}
```

## Parse JSON Logs

```dql
fetch logs
| filter contains(content, "{")
| parse content, "JSON:log"
| fields timestamp, log[level], log[message], log[service]
| limit 10
```

## Search for Specific Text

```dql
fetch logs
| filter contains(content, "connection refused")
| fields timestamp, content, loglevel, log.source
| sort timestamp desc
| limit 20
```

## Exclude Noise

```dql
fetch logs
| filterOut loglevel == "NONE"
| filterOut loglevel == "INFO"
| summarize cnt=count(), by:{loglevel}
| sort cnt desc
```

:::danger
⚠️ The field is `loglevel` (one word), NOT `log.level`.
:::

:::note
🛠 **Try it:** Open Ctrl+K → "Logs" app → filter by `loglevel == "ERROR"` → click any log line to see its full context. Then open a Notebook and run the same query in DQL: `fetch logs | filter loglevel == "ERROR" | sort timestamp desc | limit 20`.
:::

b:["$","div",
