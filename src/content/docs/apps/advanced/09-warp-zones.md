---
title: "Warp Zones (Intents)"
course: "Dynatrace Apps"
track: "Advanced"
moduleNumber: 9
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__09-warp-zones" data-course-slug="apps">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Intents — Cross-App Navigation

Intents let apps navigate to other Dynatrace apps with context. Three ways to trigger:

## IntentButton (declarative)

```typescript
import { IntentButton } from "@dynatrace/strato-components/buttons";

<IntentButton payload={{ "dt.query": "fetch dt.entity.host | limit 10" }}>
  Open in Notebooks
</IntentButton>
```

## sendIntent (programmatic)

```typescript
import { sendIntent, IntentPayload } from "@dynatrace-sdk/navigation";

const intent: IntentPayload = {
  "dt.query": "fetch logs | filter loglevel == \"ERROR\" | limit 100"
};

sendIntent(intent);
```

## Receiving Intents

Declare what intents the app accepts in `app.config.json`:

```json
{
  "app": {
    "intents": {
      "dt.custom.my-action": {
        "description": "Open my custom view",
        "params": {
          "entityId": { "type": "string" }
        }
      }
    }
  }
}
```

:::tip
💡 Intents are how Dynatrace apps talk to each other. When triggered, the AppShell shows an "Open with" dialog letting the user choose which app handles it.
:::

:::note
🛠 **Try it:** Add an `IntentButton` to your app: `<IntentButton payload={{ "dt.query": "fetch dt.entity.host" }}>Open in Notebooks</IntentButton>`. Click it — your app navigates to Notebooks with the query pre-filled. That's cross-app navigation.
:::

b:["$","di
