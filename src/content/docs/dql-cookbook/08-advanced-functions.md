---
title: "Advanced Functions"
course: "DQL Cookbook"
track: "DQL Recipes"
moduleNumber: 8
lessonType: "Reference"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dql-cookbook__08-advanced-functions" data-course-slug="dql-cookbook">
<em>Format: Reference &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Advanced Functions

Beyond the basics (count, avg, sum, filter), DQL has specialized function categories for network analysis, data masking, statistics, and AI/embedding search.

## Network Functions

```dql
// Check if IPs are private or public
fetch logs, from:now()-1h
| filter isNotNull(client.ip)
| fieldsAdd is_private = ipIsPrivate(client.ip),
           is_public = ipIsPublic(client.ip)
| summarize private=countIf(is_private), public=countIf(is_public)
```

```dql
// Filter by subnet
fetch logs, from:now()-1h
| filter ipIn(client.ip, "10.0.0.0/8")
| summarize count=count(), by:{client.ip}
```

```dql
// Anonymize IPs (mask last octet)
fetch logs, from:now()-1h
| fieldsAdd masked_ip = ipMask(client.ip, 24)
| fields timestamp, masked_ip, content
```

```
Function          What It Does
────────────────  ──────────────────────────────────────
ipIsPrivate(ip)   true for RFC1918 addresses (10.x, 172.16-31.x, 192.168.x)
ipIsPublic(ip)    true for public addresses
ipIsLoopback(ip)  true for 127.0.0.0/8
ipMask(ip, bits)  mask to /bits (anonymize)
ipIn(ip, cidr)    check if IP is in subnet
isIp(field)       type check
```

## Hash Functions

```dql
// Mask PII with irreversible hash
fetch logs, from:now()-1h
| filter contains(content, "@")
| fieldsAdd masked_email = hashSha256(content)
| fields timestamp, masked_email
```

```
Function          Use Case
────────────────  ──────────────────────────────────────
hashSha256(str)   Irreversible masking (PII compliance)
hashMd5(str)      Fast hash (not cryptographic)
hashCrc32(str)    Fast checksum
hashXxHash64(str) Fastest (good for dedup keys)
```

## Statistical Functions

```dql
// Multiple percentiles in one call
fetch spans, from:now()-1h
| filter span.kind == "SERVER"
| summarize p50=percentile(duration, 50),
    p90=percentile(duration, 90),
    p99=percentile(duration, 99),
    std=stddev(duration),
    med=median(duration)
```

```dql
// Correlation between CPU and response time
fetch spans, from:now()-2h
| filter isNotNull(process.cpu.usage) AND isNotNull(duration)
| summarize corr = correlation(process.cpu.usage, duration)
```

```
Function                    What It Calculates
──────────────────────────  ──────────────────────────────
correlation(a, b)           Pearson correlation coefficient
stddev(field)               Standard deviation
variance(field)             Variance
median(field)               Median value
percentiles(field, 50,90,99) Multiple percentiles at once
countDistinctApprox(field)  Fast approximate cardinality
countDistinctExact(field)   Exact cardinality (up to 1M)
```

## Named Parameters (Critical Gotcha)

```dql
// WRONG — positional params cause errors
fieldsAdd short = substring(content, 0, 100)
fieldsAdd result = if(x > 10, "high", "low")

// RIGHT — use named params
fieldsAdd short = substring(content, from:0, to:100)
fieldsAdd result = if(x > 10, then:"high", else:"low")
```

## Field Escaping

```dql
// Backticks for fields with hyphens or special characters
filter `error-code` == "404"
fieldsAdd `response-time-ms` = duration / 1000000
```

## Multi-Value Filtering

```dql
// array() function for in() filter
filter in(loglevel, array("ERROR", "WARN", "SEVERE"))
```

QUIZ:4

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: How do you anonymize an IP address to /24 in DQL?</strong></p>
<ul>
<li>❌ mask(ip, 24)</li>
<li>✅ ipMask(ip, 24)</li>
<li>❌ ip.mask(24)</li>
</ul>
<p><strong>Q: What's wrong with <code>substring(content, 0, 100)</code>?</strong></p>
<ul>
<li>✅ Must use named params: substring(content, from:0, to:100)</li>
<li>❌ substring doesn't exist in DQL</li>
<li>❌ The indices are wrong</li>
</ul>
</details>

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"dql-cookbook","title":"DQL Cookbook","subtitle":"Copy-Paste Recipes for Real-World Scenarios","color":"teal","tracks":[{"id":"dql-recipes","title":"DQL Recipes","description":"Ready-to-use DQL queries for the most common monitoring sce
