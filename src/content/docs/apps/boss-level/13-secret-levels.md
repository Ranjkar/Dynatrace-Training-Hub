---
title: "Secret Levels"
course: "Dynatrace Apps"
track: "Boss Level"
moduleNumber: 13
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__13-secret-levels" data-course-slug="apps">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## State Persistence

Apps can persist data across sessions using the State Service — a key-value store scoped to the app.

## App State (shared across all users)

```typescript
import { useSetAppState, useGetAppState } from "@dynatrace-sdk/react-hooks";

// Write state
const { execute: saveState } = useSetAppState();
saveState({ key: "config", body: { value: JSON.stringify({ theme: "dark", refreshRate: 30 }) } });

// Read state
const { data } = useGetAppState({ key: "config" });
const config = data ? JSON.parse(data.value) : null;
```

## User State (per-user, private)

```typescript
import { useSetUserAppState, useGetUserAppState } from "@dynatrace-sdk/react-hooks";

const { execute: saveQuery } = useSetUserAppState();
saveQuery({ key: "lastQuery", body: { value: "fetch dt.entity.host | limit 10" } });

const { data: savedQuery } = useGetUserAppState({ key: "lastQuery" });
```

```
Storage Type         Scope              Best For
───────────────────  ─────────────────  ──────────────────────────────
App State            All users          Shared config, cached results
User State           Single user        Personal preferences, last query
Document Service     All users          Complex data, shared configs
```

:::tip
💡 States persist across app updates. Add a version field to your state to make future migrations easier.
:::

:::note
🛠 **Try it:** Explore the Dynatrace Hub for app inspiration. Look at how built-in apps like "Ownership" and "Releases" combine DQL, Strato components, and intents. Open their source (if available) to learn advanced patterns.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"apps","title":"Dynatrace Apps
