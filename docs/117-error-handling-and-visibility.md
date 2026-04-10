## Error Visibility, Reporting & Surfacing Principles

### Purpose

This section defines how errors should be surfaced, handled, and reported across the 75 Flex system.

It establishes:
- That errors must not become invisible by default
- How errors should be surfaced in the application
- How errors should be logged for debugging and support
- When silent handling is acceptable and when it is not

---

### Core Principle

Errors must be visible by default.

The system should not quietly swallow front-end errors, API errors, database errors, or background-processing failures unless there is an explicit and justified reason to do so.

The default posture is:

- Detect the error
- Surface it appropriately
- Log it appropriately
- Preserve enough context to debug and report it

---

### Problem Being Prevented

Invisible errors create serious product and operational risks, including:

- Users thinking they completed an action when it actually failed
- Silent data inconsistencies
- Broken flows that are hard to diagnose
- Support issues without enough context
- Loss of trust in the product
- Bugs that persist because no one can see them clearly

The system must be designed to avoid “false success” states.

---

### Front-End Error Visibility

The front end must surface meaningful errors when a user action fails.

This includes failures such as:

- Logging a day
- Updating a plan
- Saving reminder settings
- Loading progress data
- Uploading photos
- Completing a day
- Backfilling a prior day

Users should receive a visible, understandable indication that the action did not complete successfully.

The UI must not imply success when the system does not actually confirm success.

---

### User-Facing Error Messaging Principles

User-facing error messages should be:

- Clear
- Honest
- Non-technical where possible
- Actionable where possible

Examples:
- “We couldn’t save your changes”
- “Your day wasn’t updated. Please try again.”
- “We had trouble loading your progress”

Avoid:
- Silent failure
- Misleading success indicators
- Raw internal error dumps in normal user flows

---

### Backend and Database Error Visibility

API, service-layer, and database errors must be logged with enough context to support investigation.

Where possible, logs or reports should capture:

- What operation was being attempted
- Which resource or workflow was involved
- Relevant identifiers
- Timestamp
- Error type
- Error message
- Execution context

The system must preserve enough context for a developer or operator to understand what failed and where.

---

### Error Reporting Requirement

The system should support centralized error reporting for:

- Front-end runtime errors
- API failures
- Unhandled exceptions
- Database execution errors
- Background job failures
- Integration failures (if applicable)

This may be implemented through logging, monitoring, or external error-tracking services.

The specific tooling may vary, but the requirement remains:
Errors must be reportable and diagnosable.

---

### Silent Handling Rule

Silent handling of errors is discouraged and should only be used when:

- The error is expected and explicitly understood
- The system has a safe fallback behavior
- Suppressing the error improves user experience without hiding meaningful failure
- The event is still logged if it matters operationally

Examples of potentially acceptable silent handling:
- Retrying a transient background operation
- Ignoring a duplicate no-op action that is already safely satisfied
- Suppressing a harmless UI-state race condition that does not affect saved data

Even in these cases:
- The silence must be intentional
- The behavior must be documented
- Important operational signals should still be available somewhere

---

### Distinction Between Expected and Unexpected Errors

The system should distinguish between:

#### Expected Errors
These are known and understandable conditions such as:
- Validation failures
- Attempting to edit a locked day
- Duplicate actions blocked by system rules

These should be surfaced clearly and handled gracefully.

#### Unexpected Errors
These are failures such as:
- Unhandled exceptions
- Database failures
- Inconsistent state conditions
- Unexpected null or missing data
- Third-party integration failures

These should be:
- Surfaced appropriately to the user
- Logged with high visibility
- Treated as diagnostic events

---

### No False Success Rule

The system must never:

- Show a success state before success is confirmed
- Pretend an operation completed when it did not
- Hide save failures behind optimistic UI without reconciliation

Optimistic UI may be used if desired, but it must reconcile with actual result state and visibly recover if the operation fails.

---

### Debugging & Support Implications

The system should make it possible to answer questions such as:

- What failed?
- When did it fail?
- For which workflow?
- Was the user told?
- Was the data actually saved?
- Can the issue be reproduced or traced?

Error visibility must support both:
- Better product reliability
- Faster debugging and support response

---

### Strategic Principle

An error that no one can see is an error that survives.

75 Flex should prefer visible, traceable failure over hidden, ambiguous failure.

The guiding rule is:

Do not make errors disappear.  
Handle them intentionally.