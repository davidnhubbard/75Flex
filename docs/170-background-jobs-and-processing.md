## Background Jobs & Processing Model

### Purpose

This section defines the background processing model for the 75 Flex system.

It establishes:
- Which operations must happen synchronously vs asynchronously
- Which job types exist in the system
- How jobs are scheduled, retried, and observed
- How background processing remains reliable, idempotent, and debuggable

This section is the authoritative source for:
- reminder processing
- re-engagement processing
- async recomputation and maintenance work
- retry behavior
- operational consistency for non-request workflows

---

### Core Principle

Background processing must be a first-class part of the system.

The system must not rely on ad hoc, hidden, or inconsistently triggered async behavior.

If an operation happens outside the immediate request/response cycle, it must be:

- explicitly defined
- intentionally triggered
- observable
- retry-safe where possible
- documented as part of the architecture

---

### Strategic Importance

A formal background processing model improves:

- request responsiveness
- reliability of time-based behavior
- consistency of side effects
- debugging and traceability
- future scalability
- AI-assisted implementation clarity

This is especially important in 75 Flex because the system includes:

- daily reminders
- re-engagement behavior
- progress recomputation opportunities
- event-driven side effects
- possible future analytics, notifications, and automation

---

## Processing Boundary Rule

The system must clearly distinguish between:

### Synchronous Work
Work that must happen before the request is considered complete because it affects immediate correctness or immediate user-visible state.

Examples:
- validating request input
- creating a log entry
- reevaluating the affected day state
- returning the authoritative updated day payload
- creating a plan version during a plan update when required

---

### Asynchronous Work
Work that may happen after the request succeeds because it does not need to block the user’s immediate interaction.

Examples:
- reminder delivery
- analytics logging
- non-critical summary refresh
- asynchronous diagnostic enrichment
- maintenance cleanup tasks
- optional cache refreshes

---

### Rule

The system must avoid moving correctness-critical behavior into background processing unless there is a clear, documented reconciliation model.

Immediate correctness should not depend on eventual background execution unless explicitly intended and safely handled.

---

## Background Job Categories

The system includes at least the following categories of background work:

1. Reminder scheduling and delivery jobs
2. Re-engagement eligibility processing
3. Progress recomputation or cache refresh jobs
4. Event-driven side-effect jobs
5. Maintenance and cleanup jobs
6. Diagnostic / operational support jobs

---

## 1. Reminder Scheduling & Delivery Jobs

### Purpose

These jobs support:
- daily reminder processing
- reminder suppression checks
- reminder delivery attempts

---

### Typical Responsibilities

Reminder-related jobs may:

- identify reminder candidates
- evaluate whether reminders should be sent
- respect user reminder preferences
- respect timezone rules
- suppress reminders when day state makes them unnecessary
- record reminder delivery results
- emit reminder-related events

---

### Trigger Model

Reminder jobs may be triggered by:

- scheduled time-based processing
- updated reminder preferences
- state changes that affect reminder eligibility
- re-engagement transitions

The exact implementation model may vary, but the rule remains:
reminder logic must be centrally defined and observable.

---

## 2. Re-engagement Processing Jobs

### Purpose

These jobs evaluate whether a user should enter or exit re-engagement mode.

---

### Typical Responsibilities

Re-engagement jobs may:

- detect consecutive missed days
- determine whether the threshold for re-engagement mode has been crossed
- emit re-engagement events
- update reminder tone or state behavior
- support retention-oriented diagnostics

---

### Timing Model

Re-engagement processing may occur:

- on demand after day-state changes
- in scheduled review jobs
- through event-driven background evaluation

The implementation may choose the trigger mechanism, but the resulting behavior must remain deterministic and consistent with the defined state rules.

---

## 3. Progress Recompute / Cache Refresh Jobs

### Purpose

These jobs support performance and precomputation where progress calculations or summaries are materialized, cached, or refreshed asynchronously.

---

### Typical Responsibilities

These jobs may:

- recompute progress summaries
- refresh heatmap-ready data caches
- update derived reporting structures
- rebuild lightweight summary projections

---

### Important Rule

If progress recomputation is deferred or cached asynchronously:

- the system must define which values are authoritative immediately
- the user-facing experience must remain coherent
- stale or lagging progress must not create obvious contradictions without reconciliation

For MVP, live computation may reduce complexity.  
If caching/materialization is introduced, it must remain observable and consistent.

---

## 4. Event-Driven Side-Effect Jobs

### Purpose

These jobs handle non-blocking work triggered by system events.

---

### Typical Responsibilities

Examples include:

- post-action analytics
- diagnostic enrichment
- cache invalidation
- lightweight notification preparation
- future coaching or insight generation

---

### Rule

Event-driven side effects should prefer background execution when they are:

- not required for immediate correctness
- potentially slow
- optional for the user’s current interaction
- useful for future processing or observability

---

## 5. Maintenance & Cleanup Jobs

### Purpose

These jobs keep the system healthy over time.

---

### Typical Responsibilities

Maintenance jobs may include:

- cleanup of expired temporary records
- repair or reconciliation of stale derived values
- revalidation or backfill of missing operational metadata
- log retention and housekeeping tasks
- reminder-delivery cleanup or deduplication work

---

### Rule

Maintenance jobs must be:

- documented
- observable
- safe to run repeatedly where possible
- designed not to corrupt historical truth

Maintenance must not become a hidden source of behavior changes.

---

## 6. Diagnostic / Operational Support Jobs

### Purpose

These jobs support system introspection, health, and operational confidence.

---

### Typical Responsibilities

Examples may include:

- health checks
- background consistency audits
- dead-letter or failed-job review
- integrity verification for key derived states

These jobs are especially useful as the system grows.

---

## Job Design Rules

### 1. Every Job Type Must Have a Clear Purpose

Each job must answer:

- why it exists
- what triggers it
- what it does
- what it can change
- what success/failure means

No job should exist as mysterious background magic.

---

### 2. Jobs Must Be Idempotent Where Possible

A job should be safe to retry without producing unintended duplicate side effects wherever practical.

This is especially important for:

- reminders
- event-driven side effects
- summary recomputation
- maintenance tasks

Where strict idempotency is not possible, duplicate protection or compensating logic should be defined.

---

### 3. Jobs Must Be Observable

The system should be able to inspect:

- job type
- status
- start time
- finish time
- attempts
- failure reason
- relevant resource context
- correlation/event linkage where applicable

Background jobs must not become invisible operational black boxes.

---

### 4. Jobs Must Be Retry-Aware

For retryable failures, the system should define:

- whether retry is allowed
- retry timing/backoff behavior
- maximum retry attempts
- terminal failure behavior
- whether a failed job enters a dead-letter or review state

Retry behavior must be intentional, not accidental.

---

### 5. Jobs Must Respect the No False Success Rule

If a user-visible result depends on background work, the system must not imply that the background work succeeded before it actually has.

For MVP, prefer immediate correctness for user-critical actions and background processing for non-critical side effects.

---

## Scheduling Rules

### Time-Based Jobs

Jobs such as reminder evaluation may run on a schedule.

Schedule-driven jobs must:

- respect local-time interpretation rules
- avoid duplicate firing within the same intended cycle
- handle timezone-sensitive behavior correctly
- be auditable when questions arise about why something did or did not fire

---

### Event-Triggered Jobs

Jobs may also be triggered by system events.

Examples:
- `DayCompleted` → reminder suppression or analytics follow-up
- `PlanUpdated` → optional summary refresh
- `ReminderPreferenceUpdated` → schedule recalculation

Event-triggered jobs must be linked clearly to their originating event or action where possible.

---

## Failure Handling Rules

### Transient Failures
Examples:
- temporary delivery provider issue
- short-lived database timeout
- network interruption

The system may retry these according to defined retry rules.

---

### Persistent Failures
Examples:
- invalid downstream configuration
- irreconcilable data issue
- unsupported external response

The system must:
- stop blind retries at an appropriate point
- surface operational visibility
- preserve enough detail for investigation

---

### Dead-Letter / Failed Job Handling
The system should strongly consider a mechanism for failed jobs that cannot be completed successfully after retry limits are reached.

This may include:
- failed-job tables
- dead-letter queues
- operational alerts
- admin review workflows

The specific implementation may vary, but terminal background failures must not disappear silently.

---

## Relationship to Events

Background jobs and system events are closely related.

Typical pattern:
- an action succeeds
- a business event is emitted
- one or more async jobs are triggered from that event

This relationship should remain explicit.

Jobs should not invent alternate truth separate from the event and state model.

---

## Relationship to Diagnostics

Background processing must integrate with the system’s debugging and diagnostic infrastructure.

It should be possible to answer:

- what job ran
- why it ran
- what triggered it
- whether it succeeded
- what it changed
- why it failed if it failed

This is essential for reminders, re-engagement, and any future async feature.

---

## Relationship to Specification Integrity

Any background job that affects business behavior must remain aligned with:

- event definitions
- state-machine rules
- validation constraints
- API behavior
- documentation and spec integrity requirements

Background processing is not an escape hatch for vague behavior.  
It must be governed by the same rules as synchronous behavior.

---

## MVP Guidance

For MVP, the system should keep background processing as simple as possible while still making it explicit.

Recommended MVP posture:

- keep correctness-critical logic synchronous
- use background processing for reminders and clearly non-blocking side effects
- avoid unnecessary async complexity until needed
- define job responsibilities clearly even if the initial implementation is lightweight

This preserves both:
- clarity now
- scalability later

---

## Strategic Principle

Background work should not feel magical, mysterious, or unreliable.

It should feel like a disciplined extension of the same system rules that govern the rest of the product.

The guiding rule is:

Run important async work intentionally.  
Observe it clearly.  
Retry it safely.  
Never let it become invisible.

