## Event Model & Side Effects

### Purpose

This section defines the event model for the 75 Flex system.

It establishes:
- The canonical system events
- When events are emitted
- What data events should carry
- Which side effects are triggered by those events
- How event handling should remain deterministic, observable, and maintainable

This section is the authoritative source for:
- event-driven behavior
- side-effect boundaries
- background processing triggers
- debugging and audit traceability
- future extensibility for analytics, notifications, and automation

---

### Core Principle

Important business actions should emit explicit, first-class system events.

Events are not just implementation details.  
They are a formal way to describe:

- what happened
- when it happened
- what data changed
- what downstream behavior may need to occur

The system should not rely on scattered, implicit side effects hidden in unrelated code paths.

---

### Strategic Importance

A clear event model improves:

- traceability
- debugging
- maintainability
- consistency of side effects
- future extensibility
- AI-assisted implementation clarity

This is especially important in 75 Flex because many actions can affect:

- day state
- progress calculations
- reminder eligibility
- re-engagement state
- diagnostics
- future analytics or coaching behavior

---

## Event Design Rules

### 1. Emit Events for Meaningful Business Actions

The system should emit events for actions that matter to product behavior, historical interpretation, or side effects.

Examples:
- plan created
- plan updated
- entry logged
- entry updated
- entry deleted
- day completed
- reminder preference updated
- reminder sent

Do not emit noisy events for trivial implementation internals unless there is a specific operational reason.

---

### 2. Events Must Be Explicitly Named

Event names must be:

- clear
- stable
- specific
- business-meaningful

Preferred style:
- `PlanCreated`
- `PlanUpdated`
- `PlanVersionCreated`
- `CommitmentEntryLogged`
- `CommitmentEntryUpdated`
- `CommitmentEntryDeleted`
- `DayCompleted`
- `DayStateChanged`
- `ReminderPreferenceUpdated`
- `ReminderSent`
- `UserEnteredReengagementMode`
- `UserExitedReengagementMode`

Avoid vague names such as:
- `DataChanged`
- `SomethingUpdated`
- `ActionOccurred`

---

### 3. Events Must Have Canonical Payload Shape

Each event type should have a defined payload structure.

At minimum, event payloads should include:

- event type
- event timestamp
- relevant resource identifiers
- authenticated actor where relevant
- enough context to understand the business meaning of the event

Optional but recommended:
- correlation ID
- prior state summary
- resulting state summary

---

### 4. Events Describe Facts, Not Intentions

Events should describe what has happened, not what the system is merely attempting to do.

Prefer:
- `DayCompleted`

Avoid:
- `CompleteDayRequested`

Request or command objects may exist internally, but canonical system events should describe outcomes or meaningful state changes.

---

### 5. Side Effects Should Attach to Events Intentionally

If an event triggers follow-on behavior, that relationship should be documented.

The system should be able to answer:

- which event occurred
- which side effects were triggered
- whether the side effects were synchronous or asynchronous
- whether those side effects succeeded or failed

No important side effect should be a mystery.

---

## Canonical Event Categories

The system includes at least the following event categories:

1. Plan lifecycle events
2. Logging and entry events
3. Day evaluation and state events
4. Progress and summary-affecting events
5. Reminder and re-engagement events
6. Preference update events
7. Diagnostic and operational events (where appropriate)

---

## 1. Plan Lifecycle Events

### PlanCreated
Emitted when:
- a new plan is successfully created

Should include:
- plan ID
- user ID
- initial plan metadata
- initial plan version ID
- timestamp

Potential side effects:
- initialize current plan state
- initialize related user progress context if needed
- support onboarding analytics or audit logging

---

### PlanUpdated
Emitted when:
- a plan is successfully updated through the whole-plan update model

Should include:
- plan ID
- user ID
- prior version ID if applicable
- resulting version ID if applicable
- summary of meaningful changes if available
- timestamp

Potential side effects:
- current-day reevaluation if applicable
- diagnostics or audit logging
- future analytics

---

### PlanVersionCreated
Emitted when:
- a meaningful plan update results in a new internal plan version

Should include:
- plan ID
- plan version ID
- previous version ID if applicable
- effective timestamp
- change summary if available

Potential side effects:
- same-day evaluation refresh
- version-history indexing or audit support
- debugging and traceability

---

## 2. Logging and Entry Events

### CommitmentEntryLogged
Emitted when:
- a new commitment log entry is successfully created

Should include:
- entry ID
- day record ID
- commitment ID
- entry type
- value if applicable
- calendar date
- user ID
- timestamp

Potential side effects:
- day reevaluation
- progress refresh
- reminder suppression reevaluation
- debug/audit logging

---

### CommitmentEntryUpdated
Emitted when:
- an existing log entry is successfully modified

Should include:
- entry ID
- affected day record ID
- relevant before/after summary if practical
- timestamp

Potential side effects:
- day reevaluation
- progress refresh
- diagnostics

---

### CommitmentEntryDeleted
Emitted when:
- an existing log entry is successfully removed

Should include:
- entry ID
- affected day record ID
- commitment reference
- calendar date
- user ID
- timestamp

Potential side effects:
- day reevaluation
- progress refresh
- diagnostics

---

## 3. Day Evaluation and State Events

### DayCompleted
Emitted when:
- a day transitions into the `Complete` state

This may occur because:
- all commitments become satisfied through detailed logging
- the day-level complete shortcut is successfully used

Should include:
- day record ID
- calendar date
- plan ID
- plan version ID
- user ID
- completion path (e.g., derived completion vs shortcut)
- timestamp

Potential side effects:
- reminder suppression for the day
- progress recalculation
- contextual feedback opportunities
- analytics or milestone tracking

---

### DayStateChanged
Emitted when:
- a day changes from one state to another

Examples:
- Missed → Partial
- Partial → Complete
- Complete → Partial (e.g., after an edit)
- Partial → Missed (e.g., after deleting entries)

Should include:
- day record ID
- prior day state
- new day state
- calendar date
- user ID
- timestamp

Potential side effects:
- progress summary refresh
- heatmap cache invalidation
- diagnostics
- reminder eligibility reevaluation

---

### DayNoteUpdated
Emitted when:
- a day note is created or changed

Should include:
- day record ID
- calendar date
- user ID
- timestamp

Potential side effects:
- minimal, usually audit/debug only

---

## 4. Progress-Affecting Events

### ProgressRecomputed
Optional event, recommended when progress summaries are materialized, cached, or recalculated as a discrete process.

Emitted when:
- a progress summary or aggregate view is recomputed explicitly

Should include:
- user ID
- affected date window or summary scope
- timestamp

Potential side effects:
- cache refresh
- analytics refresh
- diagnostics

If progress is always computed live and not treated as a distinct process, this event may be omitted.

---

## 5. Reminder and Re-engagement Events

### ReminderPreferenceUpdated
Emitted when:
- a user’s reminder settings are successfully changed

Should include:
- user ID
- resulting reminder settings summary
- timestamp

Potential side effects:
- update future reminder scheduling
- diagnostics
- preference audit trail

---

### ReminderSent
Emitted when:
- a reminder is successfully sent

Should include:
- user ID
- reminder type
- delivery channel
- calendar date context
- timestamp

Potential side effects:
- suppression of duplicate reminders in the same cycle
- delivery logging
- analytics

---

### ReminderSuppressed
Optional but recommended when suppression reasoning matters operationally.

Emitted when:
- a reminder is intentionally not sent due to a suppression rule

Examples:
- day already complete
- reminders disabled
- reminder already sent
- user not eligible

Should include:
- user ID
- suppression reason
- relevant day or cycle context
- timestamp

Potential side effects:
- diagnostics
- analytics
- support visibility

---

### UserEnteredReengagementMode
Emitted when:
- the user crosses the threshold into re-engagement mode (e.g., 3+ consecutive missed days)

Should include:
- user ID
- threshold reason
- timestamp

Potential side effects:
- reminder tone adjustment
- return-oriented messaging behavior
- analytics or retention tracking

---

### UserExitedReengagementMode
Emitted when:
- the user resumes sufficient activity such that re-engagement mode is no longer applicable

Should include:
- user ID
- exit reason
- timestamp

Potential side effects:
- restore standard reminder mode
- diagnostics
- analytics

---

## 6. Side Effect Classification

Side effects triggered by events should be classified as either:

### Synchronous Side Effects
Must complete within the request flow because they are required for immediate correctness.

Examples:
- reevaluating day state after entry changes
- updating the returned day payload
- enforcing reminder suppression for the same completed day where immediate correctness matters

### Asynchronous Side Effects
May happen after the request succeeds because they are not required for immediate user-visible correctness.

Examples:
- analytics logging
- sending notifications
- rebuilding materialized summaries
- background diagnostic enrichment

The system must clearly distinguish between these two categories.

---

## 7. Event Ordering Rules

Where multiple events are logically related, ordering must remain consistent.

Examples:
- `PlanUpdated` should not appear before the plan update actually succeeds
- `PlanVersionCreated` should occur only if a new version is actually created
- `DayStateChanged` should reflect the final evaluated state after the triggering action
- `ReminderSent` must not be emitted unless delivery has actually succeeded or reached the defined success threshold

Incorrect event ordering creates debugging confusion and inconsistent downstream behavior.

---

## 8. Event Idempotency Considerations

Event emission must be designed carefully to avoid duplicate side effects.

The system should define how it handles:
- request retries
- duplicate submissions
- repeated updates that do not materially change state
- repeated event-trigger conditions

Important business events should not produce duplicate downstream effects unless explicitly intended.

---

## 9. Event Storage & Observability

The system should strongly consider maintaining an observable event trail for meaningful business events.

This may be implemented through:
- application logs
- event tables
- background job records
- audit trails
- external event infrastructure

The specific mechanism may vary, but the system should be able to reconstruct important sequences of actions when needed.

---

## 10. Relationship to Diagnostics

Events should support diagnostic infrastructure by making it easier to answer:

- what happened
- in what order
- with what effect
- for which user/day/plan
- whether follow-on behavior was triggered

Events should help the system explain itself.

---

## 11. Relationship to API & State Rules

Events must align with:
- canonical contracts
- validation rules
- state-machine definitions
- error visibility rules

An event must not imply a successful state change if validation failed or the underlying action did not actually complete.

This reinforces the no-false-success rule.

---

## Strategic Principle

Events are how the system narrates its own behavior.

If events are explicit and well-defined:
- side effects stay controlled
- debugging gets easier
- future automation becomes safer
- system truth becomes easier to inspect

The guiding rule is:

Emit meaningful events for meaningful actions.  
Keep side effects attached to those events clear, intentional, and observable.

