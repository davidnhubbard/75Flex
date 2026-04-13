## Plan Creation & Management

### Purpose

This section defines how users create, modify, and manage their plans.

It establishes:
- how plans are structured
- how commitments are defined
- how users are guided to create effective plans
- how plans can be safely edited over time
- how the system prevents harmful or unrealistic configurations

This module is the foundation for:
- daily logging (Module 40)
- progress tracking (Module 70)
- consistency scoring
- long-term user success

---

## Core Principle

A plan must be:

- clear
- realistic
- actionable daily

The system must guide users toward:
- consistency
- simplicity
- sustainability

The system must prevent:
- overcommitment
- ambiguity
- untrackable goals

---

## Plan Structure

A plan consists of:

- plan name
- duration (optional or predefined)
- list of commitments
- metadata (start date, etc.)

---

## Commitment Definition

Each commitment must include:

- name
- input type
- target (if applicable)
- definition of done
- logging method(s)
- display order

---

### Supported Input Types

- checkbox (binary)
- numeric (target value)
- count (repetitions)
- duration (time-based)

---

### Logging Methods

Each commitment must allow at least one of:

- incremental logging
- direct total entry
- mark complete

---

## Plan Creation Flow

### Step 1 — Entry

User chooses:

- template (75 Hard, 75 Soft, etc.)
- or custom plan

---

### Step 2 — Commitment Setup

User defines commitments.

System must guide:

- clear naming
- realistic targets
- correct input types

---

### Step 3 — Review

User reviews plan before starting.

System may highlight:

- too many commitments
- unrealistic targets
- missing clarity

---

### Step 4 — Start Plan

Plan becomes active.

---

## Templates

Templates provide:

- pre-filled commitments
- recommended targets
- structure guidance

Templates must be:

- editable
- not locked

---

### Template Strategy Clarification (Open, Captured 2026-04-12)

Template direction is intentionally not finalized yet and remains an open product decision.

Current candidate direction to evaluate:
- `75 Hard` starter template (faithful baseline reference)
- `75 Soft` starter template (lower-intensity reference)
- `Blank Guided` template (empty starting structure with strong suggestions for hydration, exercise, and personal development commitments)

Important:
- templates are starting points, not locked programs
- users should be able to edit commitments and targets after selection
- final template strategy should be resolved in a dedicated product/design review before DB-phase lock

---

## Plan Constraints (Guardrails)

### Minimum

- at least 1 commitment

---

### Recommended Maximum

- soft limit: ~5–8 commitments
- hard limit: configurable (e.g., 20)

---

### Target Constraints

- must be > 0 for numeric commitments
- must be achievable daily
- must align with input type

---

### Clarity Rule

Every commitment must have:

- a clear “done” condition

Bad:
- “Work out more”

Good:
- “Exercise 30 minutes”

---

## UX Guidance Rules

The system should gently guide users, not block them aggressively.

---

### Soft Warnings

Examples:

- “This might be hard to maintain daily”
- “More commitments = harder to stay consistent”

---

### Hard Validation

Reject:

- empty commitment names
- invalid targets
- impossible configurations

---

## Editing Plans

### Core Rule

Plans are edited as a whole.

---

### Editing Behavior

When a plan is updated:

- user submits full updated plan
- system compares with current version
- if meaningful changes exist → create new version

---

### No Partial Edits

Avoid:
- editing single commitments in isolation

Reason:
- reduces hidden version complexity
- keeps system predictable

---

## Versioning Interaction

This module works with Module 60.

Key rules:

- plan changes do not rewrite history
- new version applies from change point forward
- past days use historical definitions

---

## Same-Day Changes

If a plan is changed during the current day:

- new version becomes active immediately
- current day uses new definition
- day state must be recomputed

---

## Commitment Identity

Commitments may include:

- stable identifier (for version linking)

This allows:
- tracking evolution over time
- consistent interpretation across versions

---

## Preventing Bad Plans

System should discourage:

- too many commitments
- overly high targets
- vague commitments
- conflicting logging methods

---

## Example Guardrails

### Too Many Commitments

- warn at 6+
- stronger warning at 10+

---

### Unrealistic Targets

- detect extreme values
- warn user

---

### Conflicting Logging

Reject combinations that:
- create ambiguity
- allow double counting

---

## First Plan Experience

For new users:

- default to template or simple starter plan
- avoid forcing full customization immediately

---

## Plan Lifecycle

States may include:

- active
- paused (future)
- completed (optional)
- archived (future)

---

## Relationship to Other Modules

### Module 20 (Onboarding)
- feeds into plan creation

### Module 40 (Daily Logging)
- uses commitments defined here

### Module 60 (Versioning)
- manages plan evolution

### Module 70 (Progress)
- evaluates performance against commitments

---

## Strategic Principle

A bad plan guarantees failure.

A good plan makes consistency possible.

The system must:

- guide users toward good plans
- prevent obvious mistakes
- allow flexibility without chaos

The guiding rule is:

Make good plans easy.  
Make bad plans harder.  
Never let users accidentally sabotage themselves.

