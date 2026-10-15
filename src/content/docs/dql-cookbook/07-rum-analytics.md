---
title: "RUM Analytics"
course: "DQL Cookbook"
track: "DQL Recipes"
moduleNumber: 7
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dql-cookbook__07-rum-analytics" data-course-slug="dql-cookbook">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## RUM Analytics

New RUM stores data in two Grail tables: `user.events` (individual events) and `user.sessions` (session aggregates). These replace classic USQL.

## Core Web Vitals

```dql
// LCP (Largest Contentful Paint) — P75 timeseries
timeseries LCP = percentile(dt.frontend.web.page.largest_contentful_paint, 75)
| fieldsAdd LCP_avg = arrayAvg(LCP)
```

```dql
// LCP per page with triggering element
fetch user.events
| filter characteristics.has_page_summary
| filter isNotNull(web_vitals.largest_contentful_paint)
| summarize LCP = percentile(web_vitals.largest_contentful_paint, 75),
    by: {page.name, lcp.ui_element.tag_name}
| sort LCP desc
```

## User Interactions

```dql
// Top clicked elements
fetch user.events
| filter characteristics.has_user_interaction
    AND in(interaction.name, {"click", "touch", "key_press"})
| summarize sessions = countDistinct(dt.rum.session.id),
    clicks = count(),
    by: {ui_element.resolved_name, ui_element.tag_name}
| sort clicks desc
```

## Page Navigation

```dql
// Most visited pages by session count
fetch user.events
| filter characteristics.has_navigation == true
| summarize sessions = countDistinct(dt.rum.session.id),
    by: {page.detected_name}
| sort sessions desc
```

## Error Events

```dql
fetch user.events
| filter characteristics.has_error == true
| fields timestamp, page.name, error.message, error.type, dt.rum.session.id
| sort timestamp desc
| limit 20
```

## Session Analysis

```dql
// Session count and duration
fetch user.sessions, from:now()-24h
| summarize total_sessions = count(),
    avg_duration = avg(session.duration),
    bounce_rate = 100.0 * countIf(session.user_actions_count == 1) / count()
```

## Key RUM Fields

```
Field                                    What It Contains
───────────────────────────────────────  ──────────────────────────
dt.rum.application.entity                Application entity ID
dt.rum.session.id                        Session identifier
page.name / page.detected_name           Page name
page.url.full / page.url.path            Page URL
web_vitals.largest_contentful_paint       LCP value
web_vitals.cumulative_layout_shift        CLS value
characteristics.has_page_summary          Page summary event
characteristics.has_navigation            Navigation event
characteristics.has_error                 Error event
characteristics.has_user_interaction      User interaction event
interaction.name                          click, touch, key_press
ui_element.resolved_name                  Element name
```

:::tip
💡 Permissions needed: `storage:user-events:read` and `storage:user-sessions:read`. These are separate from `storage:events:read`.
:::

QUIZ:3

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: Which table stores individual RUM events like page views and clicks?</strong></p>
<ul>
<li>❌ events</li>
<li>✅ user.events</li>
<li>❌ rum.events</li>
</ul>
<p><strong>Q: How do you filter for page summary events (which contain Web Vitals)?</strong></p>
<ul>
<li>❌ filter event.type == "PAGE_SUMMARY"</li>
<li>✅ filter characteristics.has_page_summary</li>
<li>❌ filter page.summary == true</li>
</ul>
</details>

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"dql-cookbook","title":"DQL Cookbook","
