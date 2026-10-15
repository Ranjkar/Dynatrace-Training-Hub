---
title: "Querying the Grail"
course: "Dynatrace Apps"
track: "Data & UI"
moduleNumber: 4
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__04-querying-the-grail" data-course-slug="apps">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Querying Grail from Apps

Two ways to query DQL from a Dynatrace app:

```
Method                                SDK Package                         Best For
────────────────────────────────────  ──────────────────────────────────  ──────────────────
useDqlQuery (hook)                    @dynatrace-sdk/react-hooks          Simple queries in components
queryExecutionClient (imperative)     @dynatrace-sdk/client-query         Custom polling, error handling
```

## useDqlQuery — The Simple Way

```typescript
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";

const result = useDqlQuery({
  body: { query: `fetch dt.entity.host | fields entity.name, cpuCores, osType | limit 10` }
});

// result.data    — query results
// result.isLoading — loading state
// result.error   — error if any
```

## queryExecutionClient — Full Control

From the real Host Health Monitor app (deployed, auto-refreshes every 30 seconds). This is a **custom wrapper** — not the SDK's `useDql` hook:

```typescript
import { queryExecutionClient } from "@dynatrace-sdk/client-query";
import { useState, useEffect, useCallback } from "react";

export function useDql(query: string) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const run = useCallback(() => {
    queryExecutionClient
      .queryExecute({ body: { query, requestTimeoutMilliseconds: 30000, maxResultRecords: 1000 } })
      .then((res) => { setData(res.result?.records ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    run();
    const id = setInterval(run, 30_000);
    return () => clearInterval(id);
  }, [run]);

  return { data, loading };
}
```

## Available Data

```
DQL Fetch Target          What You Get                    Scope Needed
────────────────────────  ──────────────────────────────  ──────────────────
dt.entity.host            Hosts, CPU, memory, OS          storage:entities:read
dt.entity.service         Services, technology            storage:entities:read
fetch logs                Log records                     storage:logs:read
fetch events              Davis events and problems       storage:events:read
fetch bizevents           Business events                 storage:bizevents:read
timeseries                Metric time series              storage:metrics:read
dt.davis.slo              SLO status and targets          storage:events:read
```

:::danger
⚠️ Every data type needs its own scope in `app.config.json`. Missing scope = silent empty results (no error, just no data).
:::

:::note
🛠 **Try it:** In your app, query the top 5 busiest services: `const result = useDqlQuery({ body: { query: "timeseries rt=avg(dt.service.request.response_time), by:{dt.entity.service} | fieldsAdd current=arrayLast(rt) | sort current desc | limit 5" } });` → render in a `DataTable`. Your app now shows a live "slowest services" leaderboard.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"apps","title":"Dynatrace Apps","subtitle":"DOOM to Dashboard","color":"violet","tracks":[{"id":"apps-foundations","title":"Foundations","description":"Get DOOM running inside Dynatrace and understand the platform","icon":"🎮","modu
