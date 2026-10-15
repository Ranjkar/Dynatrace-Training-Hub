---
title: "API Integration"
course: "Dynatrace Extensions"
track: "Python Extensions"
moduleNumber: 10
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="extensions__10-api-integration" data-course-slug="extensions">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Making API Calls

Python extensions documentation

Use the built-in `requests` library (bundled with the SDK):

```python
import requests

class MyExtension(Extension):
    def query(self):
        # Get config from activation schema
        url = self.activation_config.get("url", "https://api.example.com")
        token = self.activation_config.get("api_token", "")

        try:
            response = requests.get(
                f"{url}/health",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10
            )
            response.raise_for_status()
            data = response.json()

            # Report metrics from API response
            self.report_metric(
                key="com.dynatrace.extension.my-api.status",
                value=1 if data["status"] == "healthy" else 0,
                dimensions={"endpoint": url}
            )
            self.report_metric(
                key="com.dynatrace.extension.my-api.response_time",
                value=response.elapsed.total_seconds() * 1000,
                dimensions={"endpoint": url}
            )

            self.report_dt_extension_status(
                status=Status(StatusValue.OK)
            )
        except Exception as e:
            self.logger.error(f"API call failed: {e}")
            self.report_dt_extension_status(
                status=Status(StatusValue.GENERIC_ERROR, str(e))
            )
```

## Activation Schema

The activation schema defines what users configure in the Hub UI:

```json
{
  "types": {
    "local": { "type": "object", "properties": {} },
    "remote": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string",
          "description": "API base URL",
          "default": "https://api.example.com"
        },
        "api_token": {
          "type": "string",
          "description": "API authentication token",
          "secret": true
        }
      },
      "required": ["url"]
    }
  }
}
```

:::danger
⚠️ Mark sensitive fields with `"secret": true` — Dynatrace will encrypt them and show them as masked in the UI.
:::

:::tip
💡 Always set a `timeout` on HTTP requests. The default is no timeout, which can hang the EEC if the API is unresponsive.
:::

:::note
🛠 **Try it:** Open the VS Code Dynatrace Extensions add-on → create a new Python extension → use the built-in simulator to test API calls locally before deploying. The simulator mocks the Dynatrace SDK so you can iterate fast.
:::

b:["$","div",nul
