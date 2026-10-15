---
title: "First Blood (First App)"
course: "Dynatrace Apps"
track: "Foundations"
moduleNumber: 2
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__02-first-blood" data-course-slug="apps">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## First Page

Every app needs two files: `main.tsx` (entry point) and `App.tsx` (root component).

## main.tsx — Entry Point

From the real DOOM app:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { AppRoot } from "@dynatrace/strato-components/core";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <AppRoot>
    <BrowserRouter basename="ui">
      <App />
    </BrowserRouter>
  </AppRoot>
);
```

:::danger
⚠️ `AppRoot` is required — it provides the Strato theme (dark/light mode). `basename="ui"` is required for routing to work when deployed.
:::

## App.tsx — Root Component

Two navigation patterns — AppHeader (official template) or Tabs (our Control Center app):

```typescript
// Pattern 1: AppHeader with nav links (from official dt-app-templates)
import { AppHeader, Page } from "@dynatrace/strato-components/layouts";
import { Link, Route, Routes } from "react-router-dom";

export const App = () => (
  <Page>
    <Page.Header>
      <AppHeader>
        <AppHeader.NavItems>
          <AppHeader.AppNavLink as={Link} to="/" />
          <AppHeader.NavItem as={Link} to="/logs">Logs</AppHeader.NavItem>
        </AppHeader.NavItems>
      </AppHeader>
    </Page.Header>
    <Page.Main>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </Page.Main>
  </Page>
);

// Pattern 2: Tabs (from our deployed Host Health Monitor)
import { Tabs, Tab } from "@dynatrace/strato-components/navigation";

export const App = () => (
  <Flex flexDirection="column" padding={16}>
    <Tabs defaultIndex={0}>
      <Tab title="Overview"><OverviewPage /></Tab>
      <Tab title="Logs"><LogsPage /></Tab>
    </Tabs>
  </Flex>
);
```

## Strato Components

```
Package                                          Components
─────────────────────────────────────────────── ──────────────────────────
@dynatrace/strato-components/core               AppRoot
@dynatrace/strato-components/layouts             Page, Flex, Surface
@dynatrace/strato-components/typography          Heading, Text, Strong
@dynatrace/strato-components/buttons             Button
@dynatrace/strato-components/content             ProgressCircle
@dynatrace/strato-components/navigation          Tabs, Tab
@dynatrace/strato-components/charts              TimeseriesChart
@dynatrace/strato-components/tables              DataTable
@dynatrace/strato-components/forms               FormField, TextInput, Select
@dynatrace/strato-design-tokens/colors           Colors (for custom styling)
```

:::tip
💡 Always use Strato components instead of raw HTML. They automatically match the Dynatrace theme (dark/light mode) and are accessible.
:::

:::note
🛠 **Try it:** Open `ui/app/App.tsx` in your app project → replace the default content with a `TitleBar` and a `Flex` layout. Save → the browser auto-refreshes. Try adding a `Button` from `@dynatrace/strato-components/buttons`.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"apps","title":"Dynatrace Apps","subtitle":"DOOM to Dashbo
