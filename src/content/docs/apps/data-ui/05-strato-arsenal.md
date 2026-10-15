---
title: "Strato Arsenal"
course: "Dynatrace Apps"
track: "Data & UI"
moduleNumber: 5
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__05-strato-arsenal" data-course-slug="apps">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Strato Component Reference

Every import path and component used in the real deployed apps:

## DataTable

```typescript
import { DataTable, convertToColumns } from "@dynatrace/strato-components/tables";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";

const result = useDqlQuery({ body: { query: "fetch dt.entity.host | limit 10" } });

<DataTable
  data={result.data?.records ?? []}
  columns={convertToColumns(result.data?.types ?? [])}
  sortable
  resizable
/>
```

## Flex Layout

```typescript
import { Flex } from "@dynatrace/strato-components/layouts";

// Horizontal row of cards
<Flex flexDirection="row" gap={16}>
  <MetricCard title="CPU" />
  <MetricCard title="Memory" />
</Flex>

// Vertical stack
<Flex flexDirection="column" gap={16}>
  <TitleBar />
  <DataTable />
</Flex>
```

## Metric Card Pattern

From the real Host Health Monitor app:

```typescript
import { Flex } from "@dynatrace/strato-components/layouts";
import { Heading, Text } from "@dynatrace/strato-components/typography";
import { ProgressCircle } from "@dynatrace/strato-components/content";

const MetricCard = ({ title, query, unit }: { title: string; query: string; unit?: string }) => {
  const { data, loading } = useDql(query);
  const val = data?.[0];
  const num = val ? (Object.values(val).find((v) => typeof v === "number") as number) : null;

  return (
    <Flex flexDirection="column" alignItems="center" padding={16}
      style={{ background: "var(--dt-colors-surface-default)", borderRadius: 8, minWidth: 140 }}>
      <Text>{title}</Text>
      {loading ? <ProgressCircle /> : <Heading level={2}>{num?.toFixed(1)}{unit}</Heading>}
    </Flex>
  );
};
```

## Full Component Cheat Sheet

```
Need                    Component                   Import From
──────────────────────  ──────────────────────────  ──────────────────────────────────────
Theme wrapper           AppRoot                     @dynatrace/strato-components/core
Page wrapper            Page, Page.Main             @dynatrace/strato-components/layouts
Layout                  Flex, Surface               @dynatrace/strato-components/layouts
Tabs                    Tabs, Tab                   @dynatrace/strato-components/navigation
Data table              DataTable, convertToColumns @dynatrace/strato-components/tables
Time series chart       TimeseriesChart             @dynatrace/strato-components/charts
Loading spinner         ProgressCircle              @dynatrace/strato-components/content
Text                    Heading, Text, Strong       @dynatrace/strato-components/typography
Button                  Button                      @dynatrace/strato-components/buttons
Form input              FormField, TextInput        @dynatrace/strato-components/forms
Dropdown                Select                      @dynatrace/strato-components/forms
Design tokens           Colors                      @dynatrace/strato-design-tokens/colors
```

:::note
🛠 **Try it:** Open the Strato component gallery at [developer.dynatrace.com/design/components](https://developer.dynatrace.com/design/components/) → browse all available components. Try dropping a `Select`, `Tabs`, or `Surface` into your app.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"apps","title":"Dynatrace Apps","subtitle":"DOOM to Dashboard","col
