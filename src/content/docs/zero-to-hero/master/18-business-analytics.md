---
title: "Business Analytics"
course: "From Zero to Hero"
track: "Track 5: Master"
moduleNumber: 18
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__18-business-analytics" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Business Analytics

Business events connect technical metrics to business outcomes — revenue, conversions, user journeys.

## Business Event Sources

```
Source                  How It Works                              Setup
──────────────────────  ──────────────────────────────────────    ──────────────────
OneAgent HTTP capture   Captures events from HTTP requests         Settings → capture rules
RUM JavaScript API      dtrum.sendBusinessEvent() from browser     Code in your app
External API            POST /api/v2/bizevents/ingest              Any system → REST call
Logs via OpenPipeline   Transform log records into bizevents       OpenPipeline config
Mobile / OpenKit        Mobile app business events                 SDK integration
```

## Querying Business Events

```dql
// All business events
fetch bizevents
| summarize cnt=count(), by:{event.type, event.provider}
| sort cnt desc

// Revenue tracking
fetch bizevents
| filter event.type == "com.shop.purchase"
| summarize total_revenue=sum(revenue), orders=count()

// Conversion funnel
fetch bizevents
| filter event.type == "com.shop.page.view" OR event.type == "com.shop.add.to.cart" OR event.type == "com.shop.purchase"
| summarize cnt=count(), by:{event.type}
```

## OpenPipeline

OpenPipeline processes all incoming data — logs, events, business events, spans, metrics:

```
Ingest → Routing → Processing → Storage
  ↓         ↓          ↓           ↓
OneAgent  Match to   Parse,      Route to
API       pipeline   enrich,     Grail bucket
OTel                 mask
```

Use cases: mask PII in logs, extract metrics from log patterns, route compliance data to long-retention buckets.

## Real User Monitoring (RUM) Analytics

```dql
// User sessions
fetch user.sessions
| summarize cnt=count()

// User actions by type
fetch user.events
| summarize cnt=count(), by:{type}
| sort cnt desc
```

:::tip
💡 Business events are the bridge between "the server is slow" and "we're losing revenue." Start by capturing page visits, then add cart events and purchases.
:::

:::note
🛠 **Try it:** Open Ctrl+K → "Business Analytics" → explore the funnel analysis view. Then try: `fetch bizevents | summarize cnt=count(), by:{event.type} | sort cnt desc` in a Notebook to see your captured business events.
:::

## Business Event DQL Patterns

```dql
// Revenue timeseries
fetch bizevents, from:now()-24h
| filter event.type == "com.example.purchase"
| makeTimeseries revenue = sum(amount * price), interval:5m

// Funnel analysis
fetch bizevents, from:now()-7d
| summarize
    browse = countIf(event.type == "page.view"),
    cart = countIf(event.type == "add.to.cart"),
    purchase = countIf(event.type == "purchase")
```

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No
