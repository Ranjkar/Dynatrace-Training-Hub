---
title: "Deployment Gone Wrong"
course: "Troubleshooting Playbook"
track: "Playbooks"
moduleNumber: 3
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="troubleshooting__03-deployment-gone-wrong" data-course-slug="troubleshooting">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Playbook: Deployment Gone Wrong

A new version was deployed and things broke. Here's how to confirm and assess impact.

## Step 1: Find the Deployment Event

```dql
fetch events, from:now()-24h
| filter event.type == "CUSTOM_DEPLOYMENT" OR matchesPhrase(event.type, "DEPLOYMENT")
| fields timestamp, event.name, event.type
| sort timestamp desc
```

## Step 2: Before vs After — Response Time

```dql
// Last 6 hours — look for the inflection point
timeseries avg(dt.service.request.response_time), by:{dt.entity.service}, from:now()-6h
```

## Step 3: Before vs After — Error Rate

```dql
timeseries avg(dt.service.request.failure_rate), by:{dt.entity.service}, from:now()-6h
```

## Step 4: New Error Types

```dql
// Errors that appeared AFTER the deployment
fetch logs, from:now()-2h
| filter loglevel == "ERROR"
| summarize cnt=count(), by:{content}
| sort cnt desc
| limit 10
```

## Step 5: Davis Problems Since Deployment

```dql
fetch events, from:now()-6h
| filter event.kind == "DAVIS_PROBLEM"
| fields display_id, event.name, event.status, timestamp
| sort timestamp desc
```

## Step 6: User Impact

```dql
// Did user sessions drop?
fetch user.sessions, from:now()-6h
| makeTimeseries sessions=count()
```

## Decision Tree

```
Error rate spiked after deploy?    → Rollback immediately
  ↓ No spike
Response time degraded?            → Check new code paths, DB queries
  ↓ No degradation
New error types in logs?           → Fix the specific errors
  ↓ No new errors
User sessions dropped?             → Check frontend, CDN, DNS
  ↓ All normal
Deployment is fine                 → Monitor for 24h before closing
```

:::note
🛠 **Try it:** Open Ctrl+K → "Releases" to see recent deployments across your environment. Click any release to see which services were affected and whether error rates changed after deployment.
:::

## Regression Thresholds (Official)

A regression is confirmed when any threshold is exceeded:

```
Signal              Regression Threshold
──────────────────  ──────────────────────────────────────────────
P95 response time   Increased >20% OR absolute >2s
Error rate          Increased >1 percentage point
Throughput          Dropped >20% (without corresponding traffic drop)
```

Compare 30-minute windows: **before** = [deploymentTime - 35min, deploymentTime - 5min], **after** = [deploymentTime + 5min, deploymentTime + 35min].

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"troubleshoot","title":"Troubleshooting Playboo
