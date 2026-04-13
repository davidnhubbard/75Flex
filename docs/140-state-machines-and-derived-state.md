## State Machines & Derived State Definitions

### Purpose

This section defines the formal state models and derived-state computation rules used across the 75 Flex system.

It establishes:
- Deterministic state rules
- Day-level state computation
- Editability and locking rules
- Backfill eligibility rules
- Day-completion shortcut effects
- Consistency-score computation dependencies
- The boundary between stored values and derived values

This section is intended to eliminate ambiguity between:
- front-end behavior
- back-end behavior
- progress reporting
- debugging and diagnostic interpretation
- AI-assisted implementation

---

### Core Principle

All important behavioral states must be computed using strict deterministic rules.

The system must not rely on:
- vague interpretation
- duplicated client-side guesswork
- inconsistent endpoint-specific logic
- undocumented edge-case behavior

For any important state, the system should be able to answer:

- What is the state?
- Why is it that state?
- Which rules produced that state?

---

## State Model Categories

The system includes at least the following categories of state:

1. **Day State**
   - Complete
   - Partial
   - Missed

2. **Day Editability State**
   - Editable
   - Locked

3. **Day Context Flags**
   - isToday
   - isBackfillable
   - isLocked
   - isEditable

4. **Plan Status**
   - Active
   - Paused
   - Completed
   - Archived
   - Canceled
   - Final allowed values to be confirmed in the plan module

5. **Reminder / Re-engagement State**
   - Standard reminder mode
   - Re-engagement mode
   - Reminder suppressed

6. **Progress State**
   - Consistency score
   - day counts by type
   - trend direction
   - related derived metrics

---

## Onboarding and Re-entry Lifecycle State (MVP)

### Canonical Lifecycle States

For MVP, user landing behavior must resolve to exactly one lifecycle state:

- `onboarding_incomplete`
- `plan_created_not_started`
- `active_in_progress`
- `active_off_track_after_progress`

---

### Lifecycle Resolution Rules

#### onboarding_incomplete
Apply when:
- the user has not finished onboarding and plan creation

Landing behavior:
- resume at the next required onboarding step

#### plan_created_not_started
Apply when:
- onboarding is complete
- a plan exists
- completed day count is `0`

Landing behavior:
- show "plan created, ready to start" re-entry surface
- provide plan review and explicit start action

#### active_in_progress
Apply when:
- a plan exists
- the user has started execution
- the user is not currently classified as off-track

Landing behavior:
- route to Today experience

#### active_off_track_after_progress
Apply when:
- the user previously achieved momentum
- the user is now in a miss pattern that requires recovery handling

Landing behavior:
- route to recovery re-entry sequence (MVP copy can be basic)

---

### Momentum Rule (MVP)

Momentum is achieved when:

- the user has completed at least `3` days

This threshold is used to distinguish:
- early-stage restart behavior
- post-momentum recovery behavior

---

### Early Miss Before Momentum (MVP)

If the user misses Day 1 (or early pre-momentum days) before momentum is achieved:

- treat the user as `plan_created_not_started` on re-entry
- prompt restart from plan review/start screen

This is a soft restart, not a punitive failure mode.

---

## Day State Definition

### Canonical Day States

Every tracked calendar day must resolve to exactly one of:

- `Complete`
- `Partial`
- `Missed`

These values are mutually exclusive.

---

### Day State Source of Truth

Day state must be derived from:

- the associated Day Record
- the Day Record’s associated Plan Version
- the Commitment Definitions in that version
- the Commitment Log Entries recorded for that day
- any day-level completion shortcut usage

Day state must not be inferred from:
- current plan definition
- later plan versions
- UI assumptions
- stale cached client logic

---

### Day State Rules

#### Complete
A day is `Complete` when:

- all required commitments for that day’s Plan Version are satisfied

This includes cases where:
- detailed logging satisfies every required commitment
- the day-level “Complete All” shortcut has been used

---

#### Partial
A day is `Partial` when:

- at least one required commitment is satisfied
- but not all required commitments are satisfied

This indicates meaningful engagement without full completion.

---

#### Missed
A day is `Missed` when:

- no required commitments are satisfied

This includes both:
- a day record with no satisfied required commitments
- a calendar day with no Day Record at all, when interpreted in progress calculations

For day closure:
- day classification is evaluated at user-local midnight boundary
- unresolved prior day state must be finalized using recorded data only

---

## Missed Day Reconciliation (MVP)

It is possible a user completed actions in real life but did not log in the app.

When a prior day resolves as `Missed`, the next app session should provide a reconciliation choice:

- acknowledge the miss
- backfill the day, when still inside editable/backfill window

If the day is locked:
- user can acknowledge only
- no backfill edits are allowed

---

## Commitment Satisfaction Rules

A commitment is satisfied when its associated logged data meets the commitment definition for that day’s Plan Version.

Examples:
- checkbox-style commitment → satisfied when marked complete
- numeric commitment → satisfied when aggregated value meets or exceeds target
- mark-complete entry → satisfied by explicit completion shortcut
- count-based commitment → satisfied when logged count meets target

The commitment definition in the applicable Plan Version is authoritative.

---

## Day-Level “Complete All” Rule

If the user uses the day-level “Complete All” shortcut:

- all commitments for that day are treated as satisfied
- the day resolves to `Complete`

This rule applies only if:
- the day is within the editable window
- the operation succeeds
- the server records the shortcut state

This operation does not rewrite historical locked days.

---

## Day Record Presence vs Day State

### If Day Record Exists
The system evaluates the day using:
- stored entries
- shortcut flags
- associated plan-version rules

### If Day Record Does Not Exist
The system treats the day as:

- no recorded engagement
- therefore `Missed` for progress calculations

This rule is especially important for:
- heatmaps
- consistency scoring
- missed-day counts

---

## Day Editability Rules

### Editable Window

A day is `Editable` if it is:

- today
- yesterday
- the day before yesterday

This creates a rolling 3-day editable window.

---

### Locked Rule

A day is `Locked` if it is older than the editable window.

For locked days:
- no new entries may be created
- existing entries may not be updated
- existing entries may not be deleted
- day-level fields may not be changed
- day-level complete shortcut may not be applied

---

### Source of Editability

Editability must be derived from:

- the current user-local date
- the target day’s calendar date
- the system’s defined editable-window rule

It must not rely on manually stored client state alone.

---

## Day Context Flag Definitions

### isToday
`true` when:
- the day’s calendar date equals the current user-local calendar date

Otherwise:
- `false`

---

### isBackfillable
`true` when:
- the day is not today
- the day falls within the two prior calendar days
- the day is still within the editable window

Otherwise:
- `false`

---

### isEditable
`true` when:
- the day is today, yesterday, or the day before yesterday

Otherwise:
- `false`

---

### isLocked
`true` when:
- the day is outside the editable window

Otherwise:
- `false`

### Flag Relationship Rule
The system must keep these flags logically consistent.

Examples:
- if `isLocked = true`, then `isEditable` must be `false`
- if `isToday = true`, then `isBackfillable` must be `false`

Contradictory flag combinations are specification defects.

---

## Same-Day Plan Change Interaction

If the current day’s plan changes during that day:

- the current day remains mutable
- the latest active plan version becomes authoritative for current-day evaluation
- day state must be recomputed using the latest active version
- past days remain fixed to their historical versions

This rule applies only to the current day.

---

## Backfill State Interaction

When a backfilled day is edited or completed:

- the correct historical Plan Version for that date must be used
- day state must be recomputed against that version
- current plan rules must not be used to reinterpret the day

Backfill changes the timing of data entry, not the meaning of the day.

---

## Reminder / Re-engagement State Rules

### Standard Reminder Mode
Applies when:
- the user has reminders enabled
- the user is not in re-engagement mode
- the day is not already complete
- today’s reminder has not been suppressed

---

### Re-engagement Mode
Applies when:
- the user has missed 3 or more consecutive days

This mode changes:
- tone of reminder messaging
- return-oriented copy

It does not, in MVP, increase reminder frequency.

---

### Reminder Suppression
A reminder for the day is suppressed when:
- reminders are disabled
- the day is already complete
- the reminder has already been sent for that reminder cycle
- the system intentionally suppresses it under documented rules

---

## Consistency Score Dependency Rules

Consistency scoring depends on deterministic day-state classification.

Each day contributes:

- `Complete` = 1.0
- `Partial` = 0.5
- `Missed` = 0.0

Consistency Score for a window is:

- sum of day weights
- divided by number of days in the window

This computation depends on stable day-state resolution.

If day-state logic changes, consistency interpretation changes as well.

Therefore:
- day-state rules and scoring rules must remain aligned
- scoring must not be computed using a different interpretation of day state

---

## Streak Visibility and Reset Window (MVP)

### Visibility Window
Primary streak history shown in product surfaces should include:

- streak segments from the last 6 months

### Fresh-Start Rule
If inactivity exceeds 6 months:

- restart the active streak context as a fresh start
- do not carry older streak segments into the primary active streak context

Historical records may still exist in storage for audit/reporting, but MVP user-facing streak context restarts.

---

## Stored vs Derived State Rules

### Prefer Derived Where Possible
The system should prefer deriving state when:
- the rules are deterministic
- the source inputs are reliable
- recomputation is not prohibitively expensive

Examples:
- `isToday`
- `isEditable`
- `isLocked`
- `isBackfillable`

---

### Store When Operationally Useful
The system may store state when:
- it improves performance
- it simplifies high-frequency access
- it supports auditing or debugging
- the stored value can be safely recomputed or reconciled

Examples:
- `dayState`
- `lastEvaluatedAt`
- `completedAllShortcutUsed`

---

### Reconciliation Rule
If a derived state is also stored:
- the derivation logic remains the conceptual source of truth
- stored values must be refreshable or reconcilable
- the system must avoid permanent drift between stored and derivable truth

---

## Invalid State Prevention

The system must prevent or detect invalid state combinations such as:

- a locked day accepting edits
- a day marked Complete while required commitments are not satisfied and no valid completion shortcut exists
- a day flagged both editable and locked
- a day using the wrong Plan Version
- a reminder firing for a fully completed day under standard rules

These are not “quirks.”  
They are correctness failures.

---

## Diagnostic Requirement

For important derived states, the system should be able to explain:

- which inputs were considered
- which rule was applied
- why the resulting state was produced

This is especially important for:
- dayState
- isEditable / isLocked
- re-engagement status
- reminder suppression
- consistency score

This supports debugging, trust, and future maintainability.

---

## Strategic Principle

State is where product behavior becomes real.

If state rules are vague, the product becomes inconsistent.  
If state rules are deterministic, the product becomes explainable.

The guiding rule is:

Define state precisely.  
Compute it consistently.  
Expose it clearly.
