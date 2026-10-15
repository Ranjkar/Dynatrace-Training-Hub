---
title: "Gen2 → Gen3 Migration Guide"
description: "A Hands-On Guide to Migrating to Latest Dynatrace"
sidebar:
  order: -1
  label: Overview
---

*A Hands-On Guide to Migrating to Latest Dynatrace*

**25 modules** across **6 tracks**. All content on this page was recovered from the original course material and is rehosted here independently.

<div class="course-progress" data-course-slug="migration" data-total="25">Loading progress…</div>

*Course materials compiled and maintained by Sam Ranjkar.*

## Phase 0: Understand the Shift

Why migrate, what changed architecturally, and the one language you need to learn

- <span class="progress-dot" data-progress-key="migration__00-whats-new" aria-hidden="true"></span> [Why Migrate — Business Case & Vision](/Dynatrace-Training-Hub/migration/phase-0-overview/00-whats-new/) &nbsp;<small>(Tutorial)</small>
- <span class="progress-dot" data-progress-key="migration__01-navigation-ui" aria-hidden="true"></span> [The New UI & Settings](/Dynatrace-Training-Hub/migration/phase-0-overview/01-navigation-ui/) &nbsp;<small>(Tutorial)</small>
- <span class="progress-dot" data-progress-key="migration__02-grail-architecture" aria-hidden="true"></span> [Grail Architecture Deep Dive](/Dynatrace-Training-Hub/migration/phase-0-overview/02-grail-architecture/) &nbsp;<small>(Tutorial)</small>
- <span class="progress-dot" data-progress-key="migration__03-smartscape-entities" aria-hidden="true"></span> [Smartscape & Entity Model](/Dynatrace-Training-Hub/migration/phase-0-overview/03-smartscape-entities/) &nbsp;<small>(Tutorial)</small>

## Phase 1: Set Up Access & Data Architecture

The complete access architecture: MZ → Segments + ABAC + Buckets, security context enrichment for all data types, V3.1 IAM model with dual boundaries

- <span class="progress-dot" data-progress-key="migration__16-management-zones-segments" aria-hidden="true"></span> [Management Zones → Three New Concepts](/Dynatrace-Training-Hub/migration/phase-1-access-architecture/16-management-zones-segments/) &nbsp;<small>(Tutorial)</small>
- <span class="progress-dot" data-progress-key="migration__16b-tags-primary-grail" aria-hidden="true"></span> [Tags in Gen3: Primary Fields, Primary Tags & Security Context](/Dynatrace-Training-Hub/migration/phase-1-access-architecture/16b-tags-primary-grail/) &nbsp;<small>(Tutorial)</small>
- <span class="progress-dot" data-progress-key="migration__17-iam-abac" aria-hidden="true"></span> [IAM & ABAC: The Complete Access Architecture](/Dynatrace-Training-Hub/migration/phase-1-access-architecture/17-iam-abac/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__17b-security-context-enrichment" aria-hidden="true"></span> [Security Context Enrichment: Tagging All Data](/Dynatrace-Training-Hub/migration/phase-1-access-architecture/17b-security-context-enrichment/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__17c-grail-buckets" aria-hidden="true"></span> [Grail Buckets & Data Partitioning](/Dynatrace-Training-Hub/migration/phase-1-access-architecture/17c-grail-buckets/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__17d-architecture-complete" aria-hidden="true"></span> [Putting It All Together: Complete Architecture](/Dynatrace-Training-Hub/migration/phase-1-access-architecture/17d-architecture-complete/) &nbsp;<small>(Reference)</small>

## Phase 2: Learn DQL

The single query language that replaces USQL, metric expressions, entity selectors, and log viewer

- <span class="progress-dot" data-progress-key="migration__04-dql-fundamentals" aria-hidden="true"></span> [DQL Crash Course](/Dynatrace-Training-Hub/migration/phase-2-dql/04-dql-fundamentals/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__05-metrics-timeseries" aria-hidden="true"></span> [Migrate Metric Expressions → timeseries](/Dynatrace-Training-Hub/migration/phase-2-dql/05-metrics-timeseries/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__06-entity-queries" aria-hidden="true"></span> [Migrate Entity Selectors → Smartscape](/Dynatrace-Training-Hub/migration/phase-2-dql/06-entity-queries/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__07-usql-to-dql" aria-hidden="true"></span> [Migrate USQL → DQL for RUM](/Dynatrace-Training-Hub/migration/phase-2-dql/07-usql-to-dql/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__08-log-queries" aria-hidden="true"></span> [Migrate Log Viewer → DQL + OpenPipeline](/Dynatrace-Training-Hub/migration/phase-2-dql/08-log-queries/) &nbsp;<small>(Hands-on)</small>

## Phase 3: Migrate Dashboards

Convert classic dashboards to DQL-powered dashboards and adopt Notebooks

- <span class="progress-dot" data-progress-key="migration__09-dashboard-migration" aria-hidden="true"></span> [Migrate Classic → Gen3 Dashboards](/Dynatrace-Training-Hub/migration/phase-3-dashboards/09-dashboard-migration/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__10-notebooks" aria-hidden="true"></span> [Adopt Notebooks for Investigation](/Dynatrace-Training-Hub/migration/phase-3-dashboards/10-notebooks/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__11-variables-filters" aria-hidden="true"></span> [Migrate MZ Filters → Variables & Segments](/Dynatrace-Training-Hub/migration/phase-3-dashboards/11-variables-filters/) &nbsp;<small>(Hands-on)</small>

## Phase 4: Migrate Alerting & SLOs

Replace metric events with anomaly detectors, alerting profiles with Workflows, and classic SLOs with platform SLOs

- <span class="progress-dot" data-progress-key="migration__12-anomaly-detectors" aria-hidden="true"></span> [Migrate Metric Events → Anomaly Detectors](/Dynatrace-Training-Hub/migration/phase-4-alerting/12-anomaly-detectors/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__13-workflows-notifications" aria-hidden="true"></span> [Migrate Alerting Profiles → Workflows](/Dynatrace-Training-Hub/migration/phase-4-alerting/13-workflows-notifications/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__14-slo-migration" aria-hidden="true"></span> [Migrate Classic → Platform SLOs](/Dynatrace-Training-Hub/migration/phase-4-alerting/14-slo-migration/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__15-auto-remediation" aria-hidden="true"></span> [Build Auto-Remediation Workflows](/Dynatrace-Training-Hub/migration/phase-4-alerting/15-auto-remediation/) &nbsp;<small>(Hands-on)</small>

## Phase 5: Config-as-Code & Go Live

Migrate Settings API, automate with Terraform & Monaco, and execute the go-live checklist

- <span class="progress-dot" data-progress-key="migration__18-settings-api" aria-hidden="true"></span> [Migrate Settings v1 → Settings 2.0](/Dynatrace-Training-Hub/migration/phase-5-golive/18-settings-api/) &nbsp;<small>(Tutorial)</small>
- <span class="progress-dot" data-progress-key="migration__19-terraform-monaco" aria-hidden="true"></span> [Automate with Terraform & Monaco](/Dynatrace-Training-Hub/migration/phase-5-golive/19-terraform-monaco/) &nbsp;<small>(Hands-on)</small>
- <span class="progress-dot" data-progress-key="migration__20-migration-checklist" aria-hidden="true"></span> [Go-Live Checklist & Optimization](/Dynatrace-Training-Hub/migration/phase-5-golive/20-migration-checklist/) &nbsp;<small>(Reference)</small>

