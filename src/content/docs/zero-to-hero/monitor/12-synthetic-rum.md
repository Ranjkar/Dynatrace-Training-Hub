---
title: "Synthetic & RUM"
course: "From Zero to Hero"
track: "Track 3: Monitor & Alert"
moduleNumber: 13
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__12-synthetic-rum" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Synthetic & RUM

Synthetic monitors check availability from outside. RUM (Real User Monitoring) captures actual user experience from browsers and mobile apps.

## Synthetic Monitoring

### HTTP Monitors

Simple availability checks — hit a URL, check the response:

```
What They Check                         Frequency
──────────────────────────────────────  ──────────
URL returns HTTP 200                    Every 1-5 minutes
Response time under threshold           From multiple locations
Response body contains expected text    24/7, even when no users
SSL certificate validity                Detects outages before users
```

:::note
🛠 **Try it:** Ctrl+K → "Synthetic" → Create HTTP monitor → Enter your website URL → Select locations → Save. You'll see availability data within minutes.
:::

### Browser Monitors (Clickpaths)

Simulate real user journeys — login, search, checkout:

- Record a clickpath in the Dynatrace recorder
- Runs on Chromium from selected locations
- Captures screenshots, response times, errors at each step
- Alerts if any step fails or exceeds time threshold

## Real User Monitoring (RUM)

RUM captures data from actual users visiting your application:

```
What RUM Captures                       How
──────────────────────────────────────  ──────────────────────────────
Page load times                         OneAgent injects JavaScript
User actions (clicks, scrolls)          Automatic instrumentation
JavaScript errors                       Captured in real-time
User sessions                           Tracked across pages
Core Web Vitals (LCP, FID, CLS)         Browser performance metrics
Geographic distribution                 User location from IP
```

RUM is enabled automatically when OneAgent is installed in full-stack mode and serves web pages.

## Querying Synthetic & RUM Data

```dql
// Synthetic monitor results
fetch dt.entity.http_check
| fields entity.name, id

// User sessions (if RUM is configured)
fetch user.sessions
| summarize count=count()

// User actions
fetch user.events
| fields timestamp, type, name
| limit 10
```

## Synthetic vs RUM

```
Synthetic                               RUM
──────────────────────────────────────  ──────────────────────────────────────
Simulated users from fixed locations    Real users from everywhere
Runs 24/7 even with zero traffic        Only when users visit
Detects outages proactively             Shows actual user experience
Consistent baseline for comparison      Varies by device, network, location
```

:::tip
💡 Use both: Synthetic for availability SLOs (consistent, 24/7), RUM for user experience insights (real-world performance).
:::

## New RUM DQL Patterns

```dql
// Core Web Vitals — LCP P75 timeseries
timeseries LCP = percentile(dt.frontend.web.page.largest_contentful_paint, 75)

// Top clicked elements
fetch user.events
| filter characteristics.has_user_interaction AND in(interaction.name, {"click", "touch"})
| summarize clicks = count(), by:{ui_element.resolved_name}
| sort clicks desc

// Error events
fetch user.events
| filter characteristics.has_error == true
| fields timestamp, page.name, error.message, error.type
| sort timestamp desc

// Most visited pages
fetch user.events
| filter characteristics.has_navigation == true
| summarize sessions = countDistinct(dt.rum.session.id), by:{page.detected_name}
| sort sessions desc
```

## Session Replay Privacy

- All input fields masked by default (privacy-by-default)
- 3 masking levels: mask all, mask user input, allow all
- Per-element control: CSS class `dtrum-mask` or `dtrum-unmask`
- Permissions: `replay-sessions-with-masking` (masked) vs `replay-sessions-without-masking` (full)

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":[{"id":"hero-foundation","title":"Track 1: Foundation","description":"What is observability, how Dynatrace works, set up access, and get your first data","icon":"🏗️","
