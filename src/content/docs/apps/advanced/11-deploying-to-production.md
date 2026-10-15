---
title: "Deploying to Production"
course: "Dynatrace Apps"
track: "Advanced"
moduleNumber: 11
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="apps__11-deploying-to-production" data-course-slug="apps">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Build and Deploy

```bash
# Build for production
npx dt-app build

# Deploy to your Dynatrace environment
npx dt-app deploy
```

## IAM Permissions

```
Permission                    Required For
────────────────────────────  ──────────────────────────
app-engine:apps:install       Deploy the app
app-engine:apps:run           Run the app
app-engine:apps:delete        Uninstall the app
```

## CI/CD Deployment

```bash
# Set OAuth credentials as environment variables
export DT_APP_OAUTH_CLIENT_ID="dt0s02.XXXXXXXX"
export DT_APP_OAUTH_CLIENT_SECRET="dt0s02.XXXXXXXX.YYYYYYYY"

# Deploy from pipeline
npx dt-app deploy
```

## Deployment Checklist

```
Step  Action                                    Status
────  ──────────────────────────────────────────  ──────
1     All scopes declared in app.config.json      □
2     No hardcoded URLs or secrets                □
3     Error handling on all DQL queries            □
4     Loading states for all async operations      □
5     npx dt-app build succeeds without errors     □
6     npx dt-app deploy completes                  □
7     App appears in Dynatrace app launcher        □
```

:::danger
⚠️ Once deployed, the app runs with the scopes declared at deploy time. If new scopes are added, redeploy AND users must re-authorize.
:::

:::note
🛠 **Try it:** Run `npx dt-app deploy` from your app directory. Your app uploads to the environment and appears in the launcher. Share the URL with your team — they can use it immediately with their own permissions.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"apps","title":"Dynatrace Apps","subtitle":"DOOM to Dashboard","color":"violet","tracks":[{"id":"apps-foundations","title":"F
