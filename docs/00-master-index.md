# 75 Flex — Master Index & AI Navigation Map

## Purpose

This document is the master navigation layer for the 75 Flex specification system.

It exists to:
- give humans and AI tools a reliable map of the specification
- define which files are authoritative for which topics
- reduce context overload during implementation
- prevent accidental rewriting of unrelated parts of the spec
- support modular prompting with tools such as ChatGPT, Codex, Moonchild, D0, or similar systems

This document is **not** the full product specification.

Detailed rules, behavior, data structures, API contracts, and implementation guidance live in the module files listed below.

---

## Core Product Summary

75 Flex is a flexible, forgiving habit-building system inspired by rigid challenge models like 75 Hard and softer consistency models like 75 Soft.

Core principles:
- no forced restarts
- progress is never erased
- plans are user-defined and adjustable
- consistency matters more than perfection
- the system should adapt to real life without losing behavioral truth

75 Flex is **not** a punitive challenge tracker.

It is a long-term behavior support system built around:
- flexible plan management
- daily logging
- historically accurate evaluation
- partial-progress recognition
- reminders and re-engagement
- consistency-based progress feedback

---

## Primary Architecture Principle

The specification is intentionally modular.

Each module should:
- own one primary domain
- define that domain in full
- avoid redefining rules that belong elsewhere
- reference other modules when needed
- remain safe to load independently with this index

This structure exists because:
- large monolithic specs are fragile
- AI tools perform better with focused context
- implementation accuracy improves when ownership is clear
- updates can be made without corrupting unrelated sections

---

## How to Use This Spec

### For Humans

Use this file to:
- understand the product structure
- locate the right file for a given topic
- avoid editing the wrong document
- assemble the minimum document set for a task

### For AI Tools

When generating:
- code
- UX
- API handlers
- schema
- tests
- migrations
- implementation plans

use this rule:

1. Always include this file
2. Include only the modules needed for the task
3. Do not include the entire spec unless absolutely necessary
4. Treat module ownership as authoritative
5. Do not invent behavior that conflicts with the modules

---

## Source of Truth Rule

The specification hierarchy is:

1. This file defines structure and navigation
2. Domain modules define behavior
3. Data/API/architecture modules define implementation contracts
4. Code must follow the spec
5. Documentation must remain aligned with both spec and code

If two documents appear to conflict:
- prefer the more specific module over the general index
- resolve the inconsistency explicitly
- do not silently “average” conflicting meanings

---

## Current Spec Map

## 00 — Master Index
**File:** `00-master-index.md`  
**Purpose:** master navigation layer and AI loading guide

---

## 40 — Daily Logging System
**File:** `40-daily-logging-system.md`  
**Purpose:** defines day boundaries, lazy day creation, commitment logging model, editability window, daily logging interaction model, and complete-all behavior.

Use when working on:
- day lifecycle
- logging UX
- edit window rules
- backfill behavior
- daily interaction patterns

---

## 60 — Plan Versioning & Historical Integrity
**File:** `60-plan-versioning-and-historical-integrity.md`  
**Purpose:** defines hidden plan versioning, historical evaluation rules, same-day plan changes, backfill/version consistency, and day evaluation logic.

Use when working on:
- plan edits
- historical correctness
- day evaluation
- plan version storage
- same-day re-evaluation behavior

---

## 70 — Progress & Feedback System
**File:** `70-progress-and-feedback-system.md`  
**Purpose:** defines consistency scoring, progress visualization, summary model, and contextual reinforcement messaging.

Use when working on:
- progress screens
- heatmaps
- scoring
- summary views
- feedback copy logic

---

## 80 — Reminders & Re-engagement
**File:** `80-reminders-and-reengagement.md`  
**Purpose:** defines reminder behavior, suppression rules, reminder tone, and re-engagement thresholds.

Use when working on:
- push reminders
- inactivity handling
- return prompts
- reminder settings behavior

---

## 100 — Data Model & Schema
**File:** `100-data-model-and-schema.md`  
**Purpose:** defines core entities, conceptual fields, relationship model, database documentation rules, view principles, database function usage, and indexing philosophy.

Use when working on:
- schema design
- table structure
- views
- database functions
- indexes
- documentation of DB objects

---

## 110 — Technical Architecture Index
**File:** `110-technical-architecture-index.md`  
**Purpose:** entry point for the technical architecture layer and map to submodules.

Use when working on:
- API structure
- auth
- diagnostics
- implementation discipline
- technical decomposition

---

## 111 — API Design Principles
**File:** `111-api-design-principles.md`  
**Purpose:** defines REST-oriented API design philosophy, route structure, naming rules, and general API modeling approach.

Use when working on:
- route design
- endpoint naming
- resource hierarchy
- high-level API consistency

---

## 112 — Daily Logging API
**File:** `112-daily-logging-api.md`  
**Purpose:** defines day retrieval, entry create/update/delete, day completion shortcut, day-level updates, and server enforcement of editability/backfill rules.

Use when working on:
- `/days`
- `/entries`
- day payloads
- logging endpoints

---

## 113 — Plan Management API
**File:** `113-plan-management-api.md`  
**Purpose:** defines plan creation, retrieval, whole-plan update model, hidden version creation, and plan version inspection endpoints.

Use when working on:
- `/plans`
- plan update flows
- server-side version creation
- current plan retrieval

---

## 114 — Progress & Summary API
**File:** `114-progress-and-summary-api.md`  
**Purpose:** defines summary, consistency, heatmap, day-count, insight, and range-based progress endpoints.

Use when working on:
- `/progress`
- progress dashboard payloads
- heatmap-ready responses
- consistency summaries

---

## 115 — Reminder & Preference API
**File:** `115-reminder-and-preference-api.md`  
**Purpose:** defines reminder preference retrieval/update and optional effective reminder state endpoints.

Use when working on:
- `/reminders/preferences`
- `/reminders/state`
- reminder settings persistence

---

## 116 — Authentication, Authorization & Ownership
**File:** `116-auth-authorization-and-ownership.md`  
**Purpose:** defines authenticated-user context, ownership enforcement, indirect ownership checks, auth failure handling, and access control rules.

Use when working on:
- auth middleware
- access checks
- user scoping
- protected endpoints

---

## 117 — Error Handling & Visibility
**File:** `117-error-handling-and-visibility.md`  
**Purpose:** defines error surfacing, no-false-success behavior, user-visible failure rules, and diagnostic logging expectations.

Use when working on:
- API error responses
- frontend failure states
- backend logging
- operational visibility

---

## 118 — Debugging & Diagnostic Infrastructure
**File:** `118-debugging-and-diagnostic-infrastructure.md`  
**Purpose:** defines debug views, explanation-oriented helpers, internal inspection tools, and safe helper boundaries.

Use when working on:
- debug endpoints
- diagnostic SQL views/functions
- support tools
- admin inspection utilities

---

## 119 — Documentation & Spec Integrity
**File:** `119-documentation-and-spec-integrity.md`  
**Purpose:** defines anti-drift rules between specification, code, schema, and implementation documentation.

Use when working on:
- process discipline
- documentation updates
- code/spec alignment
- change management

---

## 120 — API Conventions
**File:** `120-api-conventions.md`  
**Purpose:** defines cross-cutting API rules including response envelopes, pagination, filtering, sorting, idempotency, tracing, optimistic UI reconciliation, and validation posture.

Use when working on:
- shared API behavior
- response envelopes
- correlation IDs
- retry safety
- endpoint consistency

---

## 130 — Canonical Data Contracts
**File:** `130-canonical-data-contracts.md`  
**Purpose:** defines canonical request/response object shapes such as Plan, Commitment, Day, Entry, ProgressSummary, ReminderPreference, ErrorResponse, and PaginatedList.

Use when working on:
- shared TypeScript types
- DTOs
- API contract consistency
- frontend/backend payload alignment

---

## 140 — State Machines & Derived State
**File:** `140-state-machines-and-derived-state.md`  
**Purpose:** defines deterministic rules for day state, editability, lock state, backfill eligibility, reminder suppression, re-engagement mode, and consistency-score dependencies.

Use when working on:
- derived state logic
- evaluation engines
- day flags
- lock rules
- reminder eligibility

---

## 150 — Validation Rules & Constraints
**File:** `150-validation-rules-and-constraints.md`  
**Purpose:** defines plan, commitment, day, entry, reminder, cross-field, and system-level validation rules.

Use when working on:
- server validation
- frontend form validation
- database constraints
- bad-input rejection behavior

---

## 160 — Event Model & Side Effects
**File:** `160-event-model-and-side-effects.md`  
**Purpose:** defines canonical system events, event naming, payload expectations, event-triggered side effects, ordering rules, and observability requirements.

Use when working on:
- event emission
- analytics/event logging
- side-effect orchestration
- system traceability

---

## 170 — Background Jobs & Processing
**File:** `170-background-jobs-and-processing.md`  
**Purpose:** defines background jobs, synchronous vs asynchronous boundaries, retry rules, scheduling, observability, and failure handling.

Use when working on:
- reminders
- re-engagement jobs
- async recomputation
- background processing infrastructure

---

## 180 — Build & Implementation Plan
**File:** `180-build-and-implementation-plan.md`  
**Purpose:** defines recommended build sequence, UX-first guardrails, phased implementation order, and AI tool usage strategy.

Use when working on:
- project execution sequencing
- roadmap
- implementation phases
- division of labor between design and code tools

---

## Module Ownership Rules

Each behavior should have one primary home.

Examples:

- day boundaries, lazy creation, logging model  
  → `40-daily-logging-system.md`

- plan versioning, historical evaluation, same-day change behavior  
  → `60-plan-versioning-and-historical-integrity.md`

- consistency score, heatmap model, reinforcement feedback  
  → `70-progress-and-feedback-system.md`

- reminders and re-engagement thresholds  
  → `80-reminders-and-reengagement.md`

- entity structure, fields, views, functions, indexes  
  → `100-data-model-and-schema.md`

- endpoint design and route behavior  
  → `111` through `115`

- auth / ownership  
  → `116-auth-authorization-and-ownership.md`

- error visibility  
  → `117-error-handling-and-visibility.md`

- debug helpers  
  → `118-debugging-and-diagnostic-infrastructure.md`

- canonical payload shapes  
  → `130-canonical-data-contracts.md`

- derived state rules  
  → `140-state-machines-and-derived-state.md`

- validation rules  
  → `150-validation-rules-and-constraints.md`

- event/side-effect behavior  
  → `160-event-model-and-side-effects.md`

- background processing  
  → `170-background-jobs-and-processing.md`

---

## Recommended Document Sets by Task

### 1. Daily Logging Backend
Include:
- `00-master-index.md`
- `40-daily-logging-system.md`
- `60-plan-versioning-and-historical-integrity.md`
- `112-daily-logging-api.md`
- `130-canonical-data-contracts.md`
- `140-state-machines-and-derived-state.md`
- `150-validation-rules-and-constraints.md`

---

### 2. Plan Editing / Versioning
Include:
- `00-master-index.md`
- `60-plan-versioning-and-historical-integrity.md`
- `100-data-model-and-schema.md`
- `113-plan-management-api.md`
- `130-canonical-data-contracts.md`
- `140-state-machines-and-derived-state.md`
- `150-validation-rules-and-constraints.md`

---

### 3. Progress Screen / Progress API
Include:
- `00-master-index.md`
- `70-progress-and-feedback-system.md`
- `114-progress-and-summary-api.md`
- `130-canonical-data-contracts.md`
- `140-state-machines-and-derived-state.md`

---

### 4. Reminder Settings / Reminder Engine
Include:
- `00-master-index.md`
- `80-reminders-and-reengagement.md`
- `115-reminder-and-preference-api.md`
- `140-state-machines-and-derived-state.md`
- `150-validation-rules-and-constraints.md`
- `160-event-model-and-side-effects.md`
- `170-background-jobs-and-processing.md`

---

### 5. Database / Schema Work
Include:
- `00-master-index.md`
- `100-data-model-and-schema.md`
- `140-state-machines-and-derived-state.md`
- `150-validation-rules-and-constraints.md`
- any relevant domain module (`40`, `60`, `70`, `80`)

---

### 6. API Contract / Shared Type Work
Include:
- `00-master-index.md`
- `120-api-conventions.md`
- `130-canonical-data-contracts.md`
- relevant endpoint module(s)
- `150-validation-rules-and-constraints.md`

---

### 7. Auth / Security / Ownership Work
Include:
- `00-master-index.md`
- `116-auth-authorization-and-ownership.md`
- `120-api-conventions.md`
- relevant endpoint module(s)

---

### 8. Diagnostics / Internal Inspection
Include:
- `00-master-index.md`
- `117-error-handling-and-visibility.md`
- `118-debugging-and-diagnostic-infrastructure.md`
- `160-event-model-and-side-effects.md`
- `170-background-jobs-and-processing.md`

---

## AI Working Rules

When using this spec with AI tools:

- always include this file first
- never ask the AI to “infer the rest” if the behavior matters
- give the AI only the modules needed for the task
- prefer small, specific prompts over giant context dumps
- require the AI to preserve existing logic unless a change is explicitly requested
- do not let the AI merge or rewrite large files casually
- when revising a module, revise only that module unless cross-module updates are explicitly required

---

## Spec Maintenance Rules

When updating the spec:

- do not silently compress content
- do not remove nuance to “simplify” unless explicitly directed
- do not rewrite unrelated modules
- do not let implementation details drift away from documented behavior
- update the module that owns the behavior
- update cross-references when a module is split or renamed
- keep this index stable, readable, and current

If a new file is added:
- add it here
- define its ownership clearly
- clarify which existing files it supplements or replaces

---

## Notes on Structure Evolution

The spec has already been decomposed into smaller modules in the technical architecture and cross-cutting layers.

This is intentional.

As the product evolves, additional modules may be added, especially in areas such as:
- onboarding
- monetization
- off-track / recovery UX
- admin/internal tooling
- analytics
- notification delivery internals

This file should continue to act as:
- the stable map
- the loading guide
- the anti-chaos layer

---

## Strategic Principle

The goal of this documentation system is not minimalism.

The goal is:
- clarity
- durability
- correctness
- modularity
- AI-usable structure

Use this file to find the truth.

Use the modules to implement the truth.