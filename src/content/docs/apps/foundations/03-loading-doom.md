---
title: "Loading DOOM"
course: "Dynatrace Apps"
track: "Foundations"
moduleNumber: 3
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__03-loading-doom" data-course-slug="apps">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Loading DOOM

The actual 1993 DOOM running inside Dynatrace using **js-dos** — a JavaScript DOSBox emulator. This is real, deployed code.

## CSP Configuration

DOOM needs WebAssembly compilation and external CDN access. From the real `app.config.json`:

```json
{
  "server": { "enableCSP": false },
  "app": {
    "functionSandbox": {
      "unsafe-eval": {
        "value": true,
        "comment": "Required for WebAssembly compilation by DOSBox emulator"
      }
    },
    "csp": {
      "script-src": [
        { "value": "https://v8.js-dos.com", "comment": "js-dos emulator scripts" },
        { "value": "https://cdn.dos.zone", "comment": "DOOM game bundle" }
      ],
      "style-src": [{ "value": "https://v8.js-dos.com" }],
      "img-src": [{ "value": "https://v8.js-dos.com" }, { "value": "https://cdn.dos.zone" }],
      "font-src": [{ "value": "https://v8.js-dos.com" }]
    }
  }
}
```

:::danger
⚠️ `unsafe-eval` is a security risk. Only use it for special cases like game emulators. Never in production monitoring apps.
:::

## The DOOM Component

From the real deployed app — uses an iframe with `srcdoc` to load DOSBox:

```typescript
import React, { useCallback, useRef, useState } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { Button } from "@dynatrace/strato-components/buttons";

export const DoomPage = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [launched, setLaunched] = useState(false);

  return (
    <Flex flexDirection="column" gap={16} padding={16}>
      <Heading level={1}>DOOM</Heading>
      <Text>Classic DOOM shareware (id Software, 1993) — running inside DOSBox via js-dos.</Text>

      <Flex gap={8}>
        {!launched ? (
          <Button variant="accent" onClick={() => setLaunched(true)}>Launch DOOM</Button>
        ) : (
          <Button variant="default" onClick={() => setLaunched(false)}>Stop</Button>
        )}
      </Flex>

      <div style={{ width: "100%", aspectRatio: "4/3", maxWidth: 960, background: "#000", borderRadius: 4 }}>
        {launched && (
          <iframe ref={iframeRef} srcDoc={SRCDOC}
            sandbox="allow-scripts allow-same-origin" allow="autoplay"
            style={{ width: "100%", height: "100%", border: "none" }} />
        )}
      </div>
    </Flex>
  );
};
```

:::tip
💡 This proves AppEngine can run anything — even a 3D game engine. If it can run DOOM, it can run any custom monitoring dashboard.
:::

:::note
🛠 **Try it:** Open `app.config.json` → add `{"name": "storage:metrics:read"}` to the scopes array → save. Now your app can query Dynatrace metrics. Try adding a DQL query with `useDqlQuery` from `@dynatrace-sdk/react-hooks`.
:::

b:["$","div",null,{"cl
