---
title: "Migrate Alerting Profiles → Workflows"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 4: Migrate Alerting & SLOs"
moduleNumber: 19
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__13-workflows-notifications" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Workflows Replace Alerting Profiles

In Gen2, you had alerting profiles + problem notifications. In Gen3, **Workflows** handle everything — from detecting problems to sending emails, Slack messages, Jira tickets, and more.

## 🔧 Migration Step: Convert Notification Channels

Each classic notification integration maps to a Workflow connector. The official Dynatrace upgrade guide provides this mapping:

```
Classic Integration          Workflow Connector              Notes
───────────────────────────  ──────────────────────────────  ──────────────────────
Email                        dynatrace.email:send-email      Or use Problems app subscription
Custom webhook               HTTP Request action             Same URL, same payload format
Slack                        dynatrace.slack connector       Install from Hub first
Jira                         dynatrace.jira connector        Install from Hub first
ServiceNow                   dynatrace.servicenow connector  Install from Hub first
PagerDuty                    dynatrace.pagerduty connector   Install from Hub first
OpsGenie                     HTTP Request action             Use OpsGenie API
Ansible                      RedHat Ansible connector        Install from Hub first
Trello                       HTTP Request action             Use Trello API
VictorOps                    HTTP Request action             Use VictorOps API
xMatters                     HTTP Request action             Use xMatters API
```

### Quick Win: Problems App Email Subscription

For simple email notifications, you don't even need a Workflow:

1. Open the **Problems** app
2. Apply filters (severity, category, etc.)
3. Click the **bell icon** → Turn on email notifications
4. You'll receive emails for problems matching your filters

:::tip
💡 This is the fastest migration path for simple email alerts. No admin permissions needed, no workflow setup. Each user can subscribe to their own problem filters independently.
:::

## Key Concepts

```
Concept         What It Does                        Gen2 Equivalent
──────────────  ──────────────────────────────────  ──────────────────────
Trigger         What starts the workflow             Alerting profile filter
Tasks           What the workflow does               Problem notification
Actions         Built-in integrations                Email/webhook integration
Conditions      When to run each task                Severity filter
Actor           Who the workflow runs as             N/A (ran as system)
```

:::note
🛠 **Try it:** Ctrl+K → "Workflows" → "+ Workflow" → add "Davis problem" trigger → add "Execute DQL query" task: `fetch events | filter event.kind == "DAVIS_PROBLEM" | filter display_id == "{{ event().display_id }}" | fields event.name, root_cause_entity_name` → add "Send email" with subject `{{ event()["event.name"] }}` and body `{{ result("dql_task").records }}`. Now every problem auto-sends a context-rich email.
:::

## Workflow Triggers

```
Trigger Type        What Starts It                          Use Case
──────────────────  ──────────────────────────────────────  ──────────────────────────
Davis problem       New/reopened Davis problem               Alert notifications, remediation
Davis event         Any Davis event (not just problems)      Fine-grained event handling
Event trigger       Custom events matching a filter          Business event processing
Schedule            Time-based (cron, interval, fixed time)  Daily reports, periodic checks
On demand (manual)  User clicks "Run" in the UI              Testing, ad-hoc execution
```

1. Open **Workflows** app → click **+ Workflow**
2. Select trigger: **Davis problem** (fires on every new problem)
3. Add task: **Send email** (from dynatrace.email connector)
4. Configure: recipients, subject with `{{ event()['event.name'] }}`, body with problem details
5. Save → Deploy (makes it live)

## Available Connectors

```
Connector                Action Examples
───────────────────────  ──────────────────────────────────────
dynatrace.email          Send email
dynatrace.slack          Send Slack message
dynatrace.jira           Create/update Jira issues
dynatrace.msteams        Send Teams message (AdaptiveCard)
dynatrace.servicenow     Create ServiceNow incidents
dynatrace.automations    DQL query, JavaScript, HTTP request
dynatrace.aws.connector  Lambda invoke, S3, EC2 operations
dynatrace.ownership      Get entity owners for routing
```

:::tip
💡 Workflows can chain tasks: Davis problem → DQL query for context → JavaScript to format → Email with rich report. This is how you build executive daily reports.
:::

## Jinja Expressions

Workflows use Jinja templating to pass data between tasks:

```
// Access previous task results
{{ result("query_hosts").records[0].hostname }}

// Access trigger event data
{{ event()["event.name"] }}

// Conditional logic
{% if result("check_cpu").value > 90 %}CRITICAL{% else %}OK{% endif %}
```

:::tip
💡 Dynatrace has 10 official Workflow learning modules in the docs — from "Get started" to "Jinja expressions". Check them at Ctrl+K → "Workflows" → Documentation.
:::

## Migration: Alerting Profile → Workflow

Each Gen2 alerting profile + notification becomes one workflow:

```
Gen2 Component                          Gen3 Workflow Equivalent
──────────────────────────────────────  ──────────────────────────────────────
Alerting profile (severity filter)      Davis problem trigger + filter condition
Problem notification (email)            Send email task (dynatrace.email)
Problem notification (webhook)          HTTP request task
Problem notification (Slack)            Send Slack message task
Problem notification (Jira)             Create Jira issue task
Notification delay (30 min)             Task condition: problem duration > 30m
```

:::note
🛠 **Migration step:** (1) List all alerting profiles in Gen2, (2) For each, create a workflow with matching trigger filter, (3) Add notification tasks matching the Gen2 integrations, (4) Set a service user as actor, (5) Test with manual trigger before enabling.
:::

## Service User Setup (Required for Production)

```
Step  Action                                  Where
────  ──────────────────────────────────────  ──────────────────────────
1     Create service user                      Account Management → IAM
2     Create IAM policy with scopes            Account Management → Policies
3     Bind policy to service user's group      Account Management → Groups
4     Set service user as workflow actor        Workflow → Settings → Actor
```

Required scopes for the service user policy:

```
storage:metrics:read, storage:events:read, storage:logs:read,
storage:entities:read, storage:system:read, storage:buckets:read,
email:emails:send, app-engine:apps:run, app-engine:functions:run,
automation:workflows:run, automation:workflows:read
```

:::danger
⚠️ Set `actor` (who tasks run as), NEVER `owner` (who controls the workflow). Setting owner to a service user permanently locks you out.
:::

## Run JavaScript Action Limits

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

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"80%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-gray-500 mb-2","children":[["$","$L15",null,{"href":"/","className":"hover:text-gray-300 transition","children":"Home"}],["$","span",null,{"children":"›"}],["$","span",null,{"children":["🔔"," ","Phase 4: Migrate Alerting & SLOs"]}],["$","span",null,{"children":"›"}],["$","span",null,{"className":"text-gray-400","children":["Module ",19]}],["$","span",null,{"className":"ml-auto text-xs text-gray-600","children":[4," min read · ",20,"/",25]}]]}],["$","h1",null,{"className":"text-3xl font-bold tracking-tight","children":"Migrate Alerting Profiles → Workflows"}],["$","div",null,{"className":"flex items-center gap-2 mt-2","children":[["$","span",null,{"className":"inline-block te
