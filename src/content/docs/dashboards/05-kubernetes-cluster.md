---
title: "Kubernetes Cluster"
course: "Dashboard Gallery"
track: "Dashboard Patterns"
moduleNumber: 5
lessonType: "Hands-on"
recovery: recovered-original
---

<div class="lesson-meta" data-progress-key="dashboards__05-kubernetes-cluster" data-course-slug="dashboards">
<em>Format: Hands-on &middot; Recovered from the original course material and rehosted independently.</em>
</div>

## Kubernetes Cluster Dashboard

A dashboard for monitoring K8s cluster health, pod status, resource usage, and events.

## Tile 1: Pod Count (Single Value)

```dql
fetch dt.entity.cloud_application
| summarize total_pods = count()
```

## Tile 2: CPU Usage by Namespace (Area Chart)

```dql
timeseries cpu=avg(dt.kubernetes.container.cpu_usage),
    by:{k8s.namespace.name}, from:now()-2h
```

## Tile 3: Memory Usage by Namespace (Area Chart)

```dql
timeseries mem=avg(dt.kubernetes.container.memory_working_set),
    by:{k8s.namespace.name}, from:now()-2h
```

## Tile 4: Recent K8s Events (Table)

```dql
fetch events, from:now()-2h
| filter event.kind == "K8S_EVENT"
| fields timestamp, event.type, event.reason, event.message,
        k8s.namespace.name, k8s.pod.name
| sort timestamp desc
| limit 20
```

## Tile 5: Container Restarts (Table)

```dql
timeseries restarts=sum(dt.kubernetes.container.restarts),
    by:{k8s.container.name, k8s.namespace.name}, from:now()-2h
```

## Tile 6: Resource Requests vs Limits (Table)

```dql
timeseries cpu_usage=avg(dt.kubernetes.container.cpu_usage),
    cpu_requests=avg(dt.kubernetes.container.requests_cpu),
    cpu_limits=avg(dt.kubernetes.container.limits_cpu),
    by:{k8s.container.name}, from:now()-30m
```

:::tip
💡 K8s metadata enrichment adds `k8s.cluster.name`, `k8s.namespace.name`, `k8s.pod.name` to ALL telemetry (logs, metrics, traces). Use these for filtering across any data type.
:::

QUIZ:10

<details><summary>▶ Knowledge Check</summary>
<p><strong>Q: Which metric shows container memory usage?</strong></p>
<ul>
<li>❌ dt.kubernetes.container.memory_usage</li>
<li>✅ dt.kubernetes.container.memory_working_set</li>
<li>❌ dt.kubernetes.pod.memory</li>
</ul>
</details>

b:["$","div
