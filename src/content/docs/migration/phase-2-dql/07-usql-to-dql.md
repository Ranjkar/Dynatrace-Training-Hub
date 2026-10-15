---
title: "Migrate USQL → DQL for RUM"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 2: Learn DQL"
moduleNumber: 13
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__07-usql-to-dql" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## USQL → DQL Migration

USQL (User Session Query Language) was Gen2's query language for RUM data. In Gen3, all RUM data is in Grail and queryable with DQL.

## Key Differences

```
USQL                                    DQL
──────────────────────────────────────  ──────────────────────────────────────
SELECT ... FROM usersession             fetch user.sessions
SELECT ... FROM useraction              fetch user.events
WHERE                                   | filter
GROUP BY                                | summarize ..., by:{field}
ORDER BY ... DESC                       | sort field desc
TOP 10                                  | limit 10
COUNT(*)                                count()
AVG(duration)                           avg(duration)
```

## Common Conversions

### Session count by browser

```dql
// USQL: SELECT browserType, COUNT(*) FROM usersession GROUP BY browserType
// DQL:
fetch user.sessions, from:now() - 24h
| summarize session_count = count(), by:{browser.name}
| sort session_count desc
```

### Average session duration

```dql
// USQL: SELECT AVG(duration) FROM usersession WHERE browserType = 'Chrome'
// DQL:
fetch user.sessions, from:now() - 24h
| filter browser.name == "Chrome"
| summarize avg_duration = avg(duration)
```

### User actions with errors

```dql
// USQL: SELECT name, COUNT(*) FROM useraction WHERE hasError = true GROUP BY name
// DQL:
fetch user.events, from:now() - 24h
| filter has_error == true
| summarize error_count = count(), by:{name}
| sort error_count desc
```

:::note
🛠 **Try it:** If you have RUM configured, open a Notebook and run the session count query above. Compare with what you see in the Digital Experience app.
:::

:::danger
⚠️ **Gotcha:** `fetch user.sessions` only returns sessions that **started** in the query window. Sessions can last 8+ hours, so extend your lookback by at least 8 hours for correlation queries.
:::

:::danger
⚠️ **Important:** On some environments, `fetch user.sessions` returns 0 results because RUM sessions are NOT yet stored as Grail entities. In that case, use the classic USQL API: `GET /api/v1/userSessionQueryLanguage/table?query=SELECT count(*) FROM usersession` with an API token (not OAuth).
:::

## RUM Data Objects

```
Data Object          What's In It                    USQL Equivalent
───────────────────  ──────────────────────────────  ──────────────────
user.sessions        Session-level data               usersession
user.events          User actions (clicks, loads)      useraction
user.errors          JavaScript errors                 usererror
```

## 🔧 Migration Step: Convert Your USQL Queries

```
Step  Action                                  How
────  ──────────────────────────────────────  ──────────────────────────────────
1     List all USQL queries in dashboards      Export dashboards with Monaco or Terraform
2     List USQL queries in custom reports       Check Settings → Web → User actions
3     Convert each query using the table above  USQL SELECT → DQL fetch + filter
4     Test in a Notebook                        Compare row counts with USQL API
5     If DQL returns 0 results                  Use classic USQL API as fallback
```

### Classic USQL API Fallback

```bash
# If fetch user.sessions returns 0 (sessions not in Grail yet):
curl -s "$ENV_URL/api/v1/userSessionQueryLanguage/table?query=SELECT+count(*)+FROM+usersession" \
  -H "Authorization: Api-Token $API_TOKEN"
# Note: uses ENVIRONMENT URL (not platform), Api-Token (not OAuth)
```

:::tip
💡 During migration, you may need both: DQL for new dashboards and USQL API for data that hasn't moved to Grail yet. Plan for a transition period where both coexist.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"56%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"H
