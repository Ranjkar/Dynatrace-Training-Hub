---
title: "Davis AI & Diagnostics"
course: "Troubleshooting Playbook"
track: "Playbooks"
moduleNumber: 7
lessonType: "Reference"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="troubleshooting__07-davis-ai-tools" data-course-slug="troubleshooting">
<em>Format: Reference &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Davis AI & Diagnostic Tools

Dynatrace provides AI-powered tools for troubleshooting: Davis Problems, Davis CoPilot, OneAgent Diagnostics, and Dynatrace Assist.

## Davis Problems — Always Start Here

```dql
// Active problems — the FIRST query in any investigation
fetch dt.davis.problems, from:now()-2h
| filter not(dt.davis.is_duplicate) AND event.status == "ACTIVE"
| fields display_id, event.name, event.category, event.start,
        root_cause_entity_name, dt.davis.affected_users_count
| sort event.start desc
```

:::danger
⚠️ **ALWAYS start with Davis problems**, never broad log searches. Broad log queries hit scan limits and return 0 results. Scope ALL queries to problem context (entity + timeframe).
:::

## Correct Problem Field Names

```
WRONG                  CORRECT
─────────────────────  ─────────────────────
title                  event.name
status                 event.status
severity               event.category
start                  event.start
"OPEN"                 "ACTIVE" (OPEN does not exist!)
```

## Problem-Scoped Investigation

```dql
// Step 1: Get problem details
fetch dt.davis.problems
| filter display_id == "P-12345"
| fields event.start, event.end, event.description,
        root_cause_entity_id, root_cause_entity_name

// Step 2: Scope logs to problem timeframe (±5 min)
fetch logs, from:problemStart-5m, to:problemEnd+5m
| filter dt.entity.service == "SERVICE-XXX"
| filter loglevel == "ERROR"
| sort timestamp desc

// Step 3: Find trace IDs in logs for correlation
fetch logs, from:problemStart-5m, to:problemEnd+5m
| filter isNotNull(trace_id)
| fields trace_id, content, loglevel
```

## Davis CoPilot (AI Assistant)

- **Natural language → DQL**: type a question in Dashboards/Notebooks, get auto-generated DQL
- **DQL → Natural language**: explain existing queries in plain English
- **Dynatrace Assist**: contextual AI across apps — summarizes problems, explains K8s warnings, suggests troubleshooting guides

API scopes: `davis-copilot:nl2dql:execute`, `davis-copilot:dql2nl:execute`, `davis-copilot:conversations:execute`

## OneAgent Diagnostics

Automated troubleshooting for OneAgent issues:

1. Go to Hosts Classic → select host → `...` → Run OneAgent diagnostics
2. Dynatrace collects 24h of diagnostic data
3. Auto-detects: NFS mounts, connectivity issues, version mismatches, deep monitoring failures
4. Results include potential solutions with instructions

CLI alternative: `oneagentctl --create-support-archive`

## Structured Troubleshooting Playbook

```
Step  Action                                    Tool
────  ──────────────────────────────────────    ──────────────────
1     List active Davis problems                 dt.davis.problems
2     Select problem → extract entities + time   Problem details
3     Scope: queryFrom = start-5min              DQL timeframe
4     Query logs for affected entities           fetch logs
5     Classify errors (actionable vs expected)   Manual analysis
6     Find trace_id → reconstruct request flow   fetch spans
7     Summarize: root cause + next steps         Report
```

QUIZ:8

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: What's the correct status value for active problems?</strong></p>
<ul>
<li>❌ "OPEN"</li>
<li>✅ "ACTIVE"</li>
<li>❌ "IN_PROGRESS"</li>
</ul>
<p><strong>Q: Why should you never start with a broad log search?</strong></p>
<ul>
<li>✅ It hits scan limits and returns 0 results</li>
<li>❌ Logs are not stored in Grail</li>
<li>❌ You need a special scope for logs</li>
</ul>
</details>

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"troubleshoot","title":"Troubleshooting Playbook","subtitle":"Step-by-Step Incident Response with Dynatrace","color":"rose","tracks":
