## Canonical Data Contracts

### Purpose

This section defines the canonical request and response object shapes used across the 75 Flex API.

It establishes:
- Shared object contracts for core resources
- Reusable payload structures across endpoints
- A single source of truth for API field naming
- Consistency rules for how objects appear in requests and responses

This section is intended to reduce drift between:
- front-end expectations
- back-end implementation
- documentation
- AI-assisted code generation

---

### Core Principle

The API should use **strict canonical contracts** for shared objects wherever practical.

A given concept should have one primary contract definition unless there is a clear and documented reason to create a specialized variant.

Examples:
- A Day object should have one canonical shape
- A Plan object should have one canonical shape
- A Commitment object should have one canonical shape

Specialized variants may exist, but they must be explicitly named and justified.

---

### Strategic Importance

Canonical contracts reduce the risk of:

- inconsistent field names across endpoints
- duplicated object definitions drifting over time
- front-end and back-end mismatches
- AI tools inventing fields or changing semantics
- hidden differences between “similar” payloads

This is especially important in 75 Flex because many endpoints return overlapping business concepts such as:

- days
- commitments
- entries
- plans
- progress summaries
- reminder preferences

---

## Contract Design Rules

### 1. One Primary Definition Per Concept

Each major reusable concept should have one canonical object definition.

Examples:
- Day
- Commitment
- CommitmentLogEntry
- Plan
- PlanVersionSummary
- ProgressSummary
- ReminderPreference

If a specialized version is needed, it should be defined as a variant of the canonical contract rather than an unrelated shape.

---

### 2. Stable Field Names

Field names must remain stable across endpoints unless there is a compelling reason to differ.

For example:
- If a field is named `calendarDate` in one Day response, it should not become `date` or `dayDate` elsewhere without explicit reason
- If a field is named `consistencyScore`, that name should remain consistent across progress responses

Field-name drift is considered a specification defect.

---

### 3. Derived Fields Must Be Explicit

If a field is derived rather than directly stored, it must still be defined explicitly in the contract.

Examples:
- `dayState`
- `isEditable`
- `consistencyScore`
- `aggregatedProgress`

The client should not be forced to infer derived meaning from lower-level data when the API already knows the answer.

---

### 4. ID Exposure Should Be Intentional

Contracts should expose identifiers only when they are useful to the client.

Expose:
- IDs needed for updates, linking, or navigation

Avoid exposing:
- internal-only identifiers that do not improve client behavior
- redundant key values that clutter payloads

When IDs are included, their meaning must be clear.

---

### 5. Separate Read Contracts from Write Contracts Where Needed

Read payloads and write payloads may differ.

Examples:
- A returned Day object may include derived fields that are not accepted in writes
- A Plan update payload may accept editable fields only
- A Progress summary response may include computed values not appropriate for client submission

This is acceptable, but each contract must be clearly defined and named.

---

## Canonical Contract List

The system should maintain canonical definitions for at least the following objects:

1. Plan
2. PlanUpdateInput
3. Commitment
4. CommitmentInput
5. Day
6. DayUpdateInput
7. CommitmentLogEntry
8. CommitmentLogEntryInput
9. ProgressSummary
10. HeatmapDay
11. ReminderPreference
12. ReminderPreferenceUpdateInput
13. ErrorResponse
14. PaginatedList envelope where applicable

These contracts may expand over time, but this list defines the minimum expected coverage.

---

## Canonical Contract Definitions

### 1. Plan

Represents the user-facing current plan view.

#### Canonical Fields
- `planId`
- `planName`
- `status`
- `durationDays`
- `startedOn`
- `endedOn`
- `templateSource`
- `isCurrent`
- `commitments`
- `createdAt`
- `updatedAt`

#### Notes
- `commitments` should contain canonical Commitment objects
- This contract is the primary returned representation for current plan retrieval
- Internal version complexity should not be embedded here unless explicitly needed

---

### 2. PlanUpdateInput

Represents the client-submitted editable plan structure for whole-plan updates.

#### Canonical Fields
- `planName`
- `durationDays`
- `startedOn`
- `endedOn`
- `commitments`

#### Notes
- This contract must include only user-editable plan fields
- It must not require the client to supply internal version metadata
- The server is responsible for comparing this structure to the current plan and deciding whether a new version is required

---

### 3. Commitment

Represents a user-facing commitment within a plan or day context.

#### Canonical Fields
- `commitmentId`
- `stableCommitmentKey` (if exposed)
- `name`
- `description`
- `inputType`
- `targetValue`
- `unitLabel`
- `definitionOfDone`
- `isRequired`
- `displayOrder`
- `allowIncrementalLogging`
- `allowDirectTotalEntry`
- `allowMarkComplete`
- `progress`
- `isComplete`

#### Notes
- `progress` may be a derived object or summary value depending on context
- This contract should be reused in plan views and day views where practical

---

### 4. CommitmentInput

Represents the editable client input shape for a commitment within plan creation or plan update.

#### Canonical Fields
- `name`
- `description`
- `inputType`
- `targetValue`
- `unitLabel`
- `definitionOfDone`
- `isRequired`
- `displayOrder`
- `allowIncrementalLogging`
- `allowDirectTotalEntry`
- `allowMarkComplete`

#### Notes
- This contract should include only fields the client is allowed to define or change
- Server-generated identifiers are not required for new commitments unless update reconciliation needs them explicitly

---

### 5. Day

Represents the canonical day-level object returned by day and progress-related endpoints.

#### Canonical Fields
- `calendarDate`
- `dayState`
- `isEditable`
- `isToday`
- `isBackfillable`
- `isLocked`
- `planId`
- `planVersionId` (optional exposure; include only if useful)
- `commitments`
- `dayNote`
- `completedAllShortcutUsed`
- `createdAt`
- `updatedAt`

#### Notes
- `commitments` should contain Commitment objects contextualized to that day
- The Day contract should be rich enough to drive the daily logging UI directly where practical

---

### 6. DayUpdateInput

Represents editable day-level input fields.

#### Canonical Fields
- `dayNote`

#### Notes
- For MVP this is intentionally narrow
- Additional editable day-level fields may be added later if the product evolves

---

### 7. CommitmentLogEntry

Represents a single recorded action for a commitment on a day.

#### Canonical Fields
- `entryId`
- `commitmentId`
- `entryType`
- `value`
- `note`
- `enteredAt`
- `createdAt`
- `updatedAt`

#### Notes
- This contract should be used anywhere log-entry detail is returned
- The meaning of `entryType` must remain consistent across all entry-returning endpoints

---

### 8. CommitmentLogEntryInput

Represents client input for creating a new commitment log entry.

#### Canonical Fields
- `commitmentId`
- `entryType`
- `value`
- `note`

#### Notes
- The server must validate that the referenced commitment is valid for the target day and plan version
- The client must not submit derived completion state as part of this payload

---

### 9. ProgressSummary

Represents the canonical progress summary object.

#### Canonical Fields
- `window`
- `consistencyScore`
- `completeDays`
- `partialDays`
- `missedDays`
- `totalDays`
- `interpretation`
- `activePlanId` (if relevant)

#### Notes
- This contract should be reused across progress summary and consistency endpoints where possible
- `interpretation` may contain lightweight server-generated messaging or labels

---

### 10. HeatmapDay

Represents one visualization-ready heatmap cell/day.

#### Canonical Fields
- `calendarDate`
- `dayState`
- `isEditable`
- `summaryValue` (optional)
- `tooltipText` (optional if server-generated)

#### Notes
- This object should be optimized for direct UI rendering
- It should not require the client to infer state from raw logging data

---

### 11. ReminderPreference

Represents the canonical reminder settings object.

#### Canonical Fields
- `remindersEnabled`
- `dailyReminderTime`
- `timezone`
- `deliveryChannel`
- `reengagementEnabled`
- `updatedAt`

#### Notes
- This object should be suitable for direct binding to reminder settings UI
- Fields not supported in MVP may be omitted, but naming should remain reserved and consistent if introduced later

---

### 12. ReminderPreferenceUpdateInput

Represents editable reminder settings submitted by the client.

#### Canonical Fields
- `remindersEnabled`
- `dailyReminderTime`
- `timezone`
- `deliveryChannel`
- `reengagementEnabled`

#### Notes
- This contract should support partial updates
- Validation must be server-enforced

---

### 13. ErrorResponse

Represents the canonical API error shape.

#### Canonical Fields
- `code`
- `message`
- `details` (optional)
- `correlationId` (optional but strongly recommended)

#### Notes
- This contract should be used consistently across all API endpoints
- The meaning of `code` and `message` must remain stable and documented

---

### 14. PaginatedList

Represents the canonical envelope for paginated list responses.

#### Canonical Fields
- `items`
- `nextCursor`
- `limit`
- `totalCount` (optional if expensive)
- `hasMore` (optional but recommended)

#### Notes
- `items` should contain a list of canonical objects of the relevant type
- Pagination metadata must not be mixed into individual items

---

## Specialized Contract Variants

If a specialized variant is needed, it must be explicitly named.

Examples:
- `PlanVersionSummary`
- `PlanVersionDetail`
- `DayDetail`
- `ProgressInsight`
- `ReminderEffectiveState`

Specialized variants must:
- extend or narrow a canonical concept intentionally
- be documented separately
- avoid redefining shared field meanings inconsistently

---

## Serialization & Formatting Rules

Canonical contracts should follow consistent formatting rules for values such as:

- timestamps
- calendar dates
- booleans
- enums / state fields
- numeric precision for user-facing metrics

These formatting rules should be defined consistently across the API and should not vary by endpoint without justification.

---

## Nullability & Optionality Rules

Each canonical field should eventually define whether it is:

- required
- optional
- nullable
- derived-only
- write-only
- read-only

These rules should be made explicit as implementation detail increases.

Ambiguous optionality is a source of bugs and drift and should be avoided.

---

## Contract Evolution Rule

Canonical contracts may evolve, but they must not drift casually.

When a contract changes:

- the change must be documented
- affected endpoints must be updated consistently
- front-end and back-end expectations must be reviewed together
- AI-oriented documentation must remain aligned

No endpoint should quietly diverge from canonical object definitions without explicit justification.

---

## Relationship to Specification Integrity

These contracts are part of the specification’s behavioral truth.

They should be used to keep:

- endpoint docs
- implementation code
- front-end types
- test fixtures
- AI prompts

Aligned with the same object definitions.

---

## Strategic Principle

Canonical contracts turn a “set of endpoints” into a coherent platform.

The guiding rule is:

Define shared objects once.  
Reuse them consistently.  
Do not let payload shapes drift into chaos.