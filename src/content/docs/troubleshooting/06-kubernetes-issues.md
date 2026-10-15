---
title: "Kubernetes Issues"
course: "Troubleshooting Playbook"
track: "Playbooks"
moduleNumber: 6
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="troubleshooting__06-kubernetes-issues" data-course-slug="troubleshooting">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Kubernetes Issues

Kubernetes problems show up as pod crashes, OOM kills, scheduling failures, and resource exhaustion. Here's how to investigate each with DQL.

## Pod Status Overview

```dql
// Current pod status across clusters
fetch dt.entity.cloud_application
| fields entity.name, id, k8s.cluster.name, k8s.namespace.name
| sort k8s.cluster.name asc
```

## K8s Events (Warnings)

```dql
// Recent K8s warning events
fetch events, from:now()-2h
| filter event.kind == "K8S_EVENT" AND event.type == "Warning"
| fields timestamp, event.reason, event.message, k8s.namespace.name, k8s.pod.name
| sort timestamp desc
| limit 20
```

## Container Resource Usage

```dql
// CPU usage vs limits
timeseries cpu=avg(dt.kubernetes.container.cpu_usage),
           limits=avg(dt.kubernetes.container.limits_cpu),
    by:{k8s.container.name, k8s.namespace.name}, from:now()-1h
```

```dql
// Memory usage vs limits (OOM detection)
timeseries mem=avg(dt.kubernetes.container.memory_working_set),
           limits=avg(dt.kubernetes.container.limits_memory),
    by:{k8s.container.name, k8s.namespace.name}, from:now()-1h
```

## Key K8s Metrics

```
Metric                                        What It Measures
──────────────────────────────────────────    ──────────────────────────
dt.kubernetes.container.cpu_usage             Container CPU usage
dt.kubernetes.container.memory_working_set    Container memory usage
dt.kubernetes.container.requests_cpu          CPU requests
dt.kubernetes.container.limits_cpu            CPU limits
dt.kubernetes.container.requests_memory       Memory requests
dt.kubernetes.container.limits_memory         Memory limits
dt.kubernetes.workload.conditions             Pod conditions
dt.kubernetes.pods                            Pod status
```

## Decision Tree

```
Pod CrashLoopBackOff?      → Check container logs for startup errors
  ↓ No
OOMKilled?                 → Memory limit too low, increase limits_memory
  ↓ No
ImagePullBackOff?          → Check image name, registry auth, network
  ↓ No
Pending (unschedulable)?   → Check node resources, taints, affinity rules
  ↓ No
Running but unhealthy?     → Check readiness/liveness probes, service mesh
```

## Metadata Enrichment

Dynatrace Operator enriches ALL telemetry with K8s metadata. Use these fields for filtering:

- `k8s.cluster.name`, `k8s.namespace.name`, `k8s.pod.name`
- `k8s.container.name`, `k8s.workload.name`, `k8s.workload.kind`
- `dt.security_context` — for ABAC boundaries based on K8s labels
- `dt.cost.costcenter` — for cost allocation from K8s annotations

QUIZ:7

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: A container is OOMKilled. Which metric should you check?</strong></p>
<ul>
<li>❌ dt.kubernetes.container.cpu_usage</li>
<li>✅ dt.kubernetes.container.memory_working_set vs limits_memory</li>
<li>❌ dt.kubernetes.pods</li>
</ul>
</details>

b:["$","div",null,{"className":"flex min-h-[calc(100vh-3.5rem)]","children":[["$","$L13",null,{"course":{"id":"troubleshoot","title":"Troubleshooting Playbook","subti
