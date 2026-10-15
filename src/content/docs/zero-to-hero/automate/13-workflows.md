---
title: "Workflows"
course: "From Zero to Hero"
track: "Track 4: Automate & Govern"
moduleNumber: 14
lessonType: "Tutorial"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="zero-to-hero__13-workflows" data-course-slug="zero-to-hero">
<em>Format: Tutorial &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Workflows

Workflows are the automation engine — they react to events, run on schedules, and connect Dynatrace to external systems like email, Slack, Jira, and AWS.

## Anatomy of a Workflow

```
Trigger → Task 1 → Task 2 → Task 3
  ↓         ↓         ↓         ↓
What starts  DQL query  Format    Send email
the workflow            results
```

## Trigger Types

```
Trigger             What Starts It                          Use Case
──────────────────  ──────────────────────────────────────  ──────────────────────────
Davis problem       New or reopened problem                  Alert notifications
Davis event         Any Davis event                         Fine-grained handling
Schedule            Time-based (cron, interval, fixed)      Daily reports, weekly trends
On demand           Manual "Run" button                     Testing, ad-hoc
```

## Available Connectors

```
Connector                What It Does
───────────────────────  ──────────────────────────────────────
Email                    Send email notifications
Slack                    Send Slack messages
Jira                     Create/update Jira issues
Microsoft Teams          Send Teams messages
ServiceNow               Create incidents
PagerDuty                Trigger pages
AWS                      Lambda, S3, EC2 operations
Kubernetes               Query/manipulate K8s resources
GitHub / GitLab          Create issues, trigger pipelines
HTTP Request             Call any REST API
DQL Query                Run DQL and use results
JavaScript               Custom logic, formatting
```

## Building a Problem Notification Workflow

1. Ctrl+K → "Workflows" → Create new
2. Trigger: **Davis problem**
3. Add task: **Send email**
4. Subject: `{{ event()["event.name"] }}`
5. Body: Problem details with Jinja expressions
6. Save → the workflow fires on every new problem

## Jinja Expressions

```
// Access trigger event data
{{ event()["event.name"] }}
{{ event()["display_id"] }}

// Access previous task results
{{ result("query_task").records[0].hostname }}

// Conditional logic
{% if result("check").value > 90 %}CRITICAL{% else %}OK{% endif %}
```

## Service User Actors

Workflows should run as a **service user**, not a personal account:

```
Step  Action
────  ──────────────────────────────────────
1     Create service user (Account Management → IAM)
2     Create policy with required scopes
3     Bind policy to service user's group
4     Set service user as workflow actor
```

:::danger
⚠️ Set `actor` (who tasks run as), NEVER `owner` (who controls the workflow). Setting owner to a service user permanently locks you out.
:::

:::note
🛠 **Try it:** Open Ctrl+K → "Workflows" → click "+ Workflow" → add a trigger (try "Schedule" → daily at 09:00) → add a task ("Execute DQL query" → `fetch dt.entity.host | summarize count()`). You just built your first automation.
:::

## Run JavaScript Action Limits

When using custom JavaScript tasks in workflows, be aware of these hard limits:

```
Limit                    Value
───────────────────────  ──────────────────────
Execution timeout        120 seconds (NOT extendable)
RAM                      256 MB
Script size              ~5 MB (including context)
Result size              6 MB
Result type              JSON only (no binary)
HTTP calls               Must be on global allowlist
```

:::danger
⚠️ Never return secrets in JS task results — they're visible to anyone with read access to the workflow.
:::

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"hero","title":"From Zero to Hero","subtitle":"Dynatrace Platform Mastery — No Prior Knowledge Required","color":"cyan","tracks":[{"id":"hero-foundation","title":"Track 1: Foundation","description":"What is observability, how Dynatrace works, set up access, and get your first data","icon":"🏗️","modules":[{"number":0,"slug":"00-what-is-observability","title":"What is Observability","type":"Tutoria
