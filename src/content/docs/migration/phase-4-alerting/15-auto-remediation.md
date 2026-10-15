---
title: "Build Auto-Remediation Workflows"
course: "Gen2 → Gen3 Migration Guide"
track: "Phase 4: Migrate Alerting & SLOs"
moduleNumber: 21
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="migration__15-auto-remediation" data-course-slug="migration">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## New Capability: Auto-Remediation

With Workflows in place (Module 13), auto-remediation becomes possible — detect a problem, analyze it, and fix it automatically. This wasn't feasible with Gen2 alerting profiles.

## The Pattern

<div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 24px; margin: 24px 0;">
<svg style="width:100%;max-width:800px;" viewbox="0 0 800 80" xmlns="http://www.w3.org/2000/svg">
<rect fill="#7f1d1d" height="40" rx="8" stroke="#f87171" stroke-width="1.5" width="130" x="10" y="20"></rect>
<text fill="#fca5a5" font-size="11" font-weight="bold" text-anchor="middle" x="75" y="45">Davis Problem</text>
<text fill="#475569" font-size="16" x="152" y="45">→</text>
<rect fill="#172554" height="40" rx="8" stroke="#38bdf8" stroke-width="1.5" width="130" x="165" y="20"></rect>
<text fill="#7dd3fc" font-size="11" font-weight="bold" text-anchor="middle" x="230" y="45">DQL Context</text>
<text fill="#475569" font-size="16" x="307" y="45">→</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#a78bfa" stroke-width="1.5" width="130" x="320" y="20"></rect>
<text fill="#c4b5fd" font-size="11" font-weight="bold" text-anchor="middle" x="385" y="45">JS Decision</text>
<text fill="#475569" font-size="16" x="462" y="45">→</text>
<rect fill="#14532d" height="40" rx="8" stroke="#22c55e" stroke-width="1.5" width="130" x="475" y="20"></rect>
<text fill="#86efac" font-size="11" font-weight="bold" text-anchor="middle" x="540" y="45">Act / Escalate</text>
<text fill="#475569" font-size="16" x="617" y="45">→</text>
<rect fill="#1e293b" height="40" rx="8" stroke="#f59e0b" stroke-width="1.5" width="130" x="630" y="20"></rect>
<text fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle" x="695" y="45">Notify</text>
</svg>
</div>

## How It Works

1. **Trigger:** Davis detects a problem (CPU spike, service failure, etc.)
2. **Context:** DQL queries gather data (entity health, recent changes, history)
3. **Decision:** JavaScript analyzes the context and decides: monitor, investigate, remediate, or escalate
4. **Action:** HTTP request to restart service, scale up, or create ticket
5. **Notify:** Email/Slack with what happened and what was done

:::danger
⚠️ **Critical:** NEVER set `owner` to a service user on a workflow — it permanently locks you out. Only set `actor` (who the tasks run as).
:::

:::note
🛠 **Try it:** Create a workflow with a Davis problem trigger → Add a DQL task to query the problem details → Add a "Send email" task with the results → Deploy and wait for a problem to fire.
:::

## Decision Engine Logic

The JavaScript decision task analyzes context and chooses an action:

```
Condition                                Action              Why
──────────────────────────────────────   ──────────────────   ──────────────────────────
CPU > 90% for < 5 min                    Monitor              Might be a spike, wait
CPU > 90% for > 15 min                   Remediate            Sustained — restart service
Error rate > 10% + recent deployment     Rollback             Deployment caused it
Disk > 95%                               Remediate            Clean logs, expand volume
Problem seen 3+ times this week          Escalate             Recurring — needs root cause
Unknown problem type                     Escalate             Don't auto-fix what you don't understand
```

:::danger
⚠️ **Golden rule:** Only auto-remediate problems you fully understand. For everything else, escalate to humans with rich context (DQL data, entity health, recent changes).
:::

## Service User Setup (Required for Production)

Workflows need a **service user** as the actor — this controls whose permissions the tasks execute under:

1. Create a service user in Account Management → Identity & access management
2. Create a policy with required scopes (storage:read, automation:workflows:run, email:send)
3. Bind the policy to the service user's auto-created group
4. Set the service user as the workflow's `actor`

:::danger
⚠️ NEVER set `owner` to a service user — only set `actor`. Setting owner permanently locks you out of the workflow because you can't authenticate as a service user.
:::

## Real-World Remediation Actions

```
Action                  How (Workflow Task)                    Risk Level
──────────────────────  ──────────────────────────────────────  ──────────
Restart service         HTTP request to orchestrator API        Medium
Scale up (K8s)          HTTP request to K8s API (HPA patch)     Low
Clear disk space        HTTP request to run cleanup script      Low
Rollback deployment     HTTP request to CI/CD API               High
Create Jira ticket      Jira connector task                     None
Page on-call            Email/Slack/PagerDuty connector         None
```

:::tip
💡 Start with low-risk actions (notify, create ticket). Once you trust the decision logic, gradually add higher-risk actions (restart, scale). Never start with rollback.
:::

14:["$","main",null,{"className":"flex-1 max-w-4xl mx-auto px-6 py-8","children":[["$","div",null,{"className":"progress-bar mb-6","children":["$","div",null,{"className":"progress-bar-fill bg-emerald-500","style":{"width":"88%"}}]}],["$","div",null,{"className":"mb-8","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm text-g
