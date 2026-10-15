---
title: "Charting Your Kills"
course: "Dynatrace Apps"
track: "Data & UI"
moduleNumber: 6
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__06-charting-your-kills" data-course-slug="apps">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## TimeseriesChart

From the real Host Health Monitor app — CPU and memory charts with live data:

```typescript
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import { TimeseriesChart, convertToTimeseries } from "@dynatrace/strato-components/charts";
import { ProgressCircle } from "@dynatrace/strato-components/content";
import { Flex } from "@dynatrace/strato-components/layouts";
import { Text } from "@dynatrace/strato-components/typography";

const TsChart = ({ title, query }: { title: string; query: string }) => {
  const result = useDqlQuery({ body: { query } });
  const ts = result.data ? convertToTimeseries(result.data) : [];

  return (
    <Flex flexDirection="column" gap={4} style={{ minHeight: 200 }}>
      <Text style={{ fontWeight: 600 }}>{title}</Text>
      {result.isLoading ? <ProgressCircle /> : <TimeseriesChart data={ts} />}
    </Flex>
  );
};

// Usage:
<TsChart title="CPU Usage (2h)" query={`timeseries avg(dt.host.cpu.usage), from:-2h`} />
<TsChart title="Memory Usage (2h)" query={`timeseries avg(dt.host.memory.usage), from:-2h`} />
```

:::danger
⚠️ The conversion function is `convertToTimeseries` from `@dynatrace/strato-components/charts`. It takes the full `result.data` object, not individual records/types.
:::

## Chart Types

```
DQL Query Pattern                           Best Chart
──────────────────────────────────────────  ──────────────────────
timeseries avg(metric), by:{entity}         TimeseriesChart (line)
summarize count(), by:{category}            BarChart / PieChart
fetch ... | fields timestamp, value         TimeseriesChart
fetch ... | summarize total = count()       Single value (MetricCard)
```

:::note
🛠 **Try it:** Add a `TimeseriesChart` to your app: query `timeseries avg(dt.host.cpu.usage), by:{dt.entity.host}` → pass the result through `convertToTimeseries(result.data)` → render with `<TimeseriesChart data={ts} />`. Live CPU charts in your custom app.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"apps","title":"Dynatrace Apps"
