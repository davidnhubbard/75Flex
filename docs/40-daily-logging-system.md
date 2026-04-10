## Day Definition & Time Boundary Model (User Local Time)

### Purpose

This section defines what constitutes a “day” in the 75 Flex system.

It establishes:
- When a day starts and ends
- How “today” is determined
- How timezones affect logging and evaluation
- The foundation for all daily logging, backfill, and evaluation behavior

---

### Core Principle

A day is defined by the user’s current local time.

Each day runs from:
- 12:00 AM (midnight)
- to 11:59 PM

in the user’s active timezone.

---

### Definition of “Today”

“Today” is the current calendar day based on the user’s local device or system timezone.

The system must:
- Detect or store the user’s current timezone
- Use it to determine the active day
- Update the definition of “today” as the user’s timezone changes

---

### Timezone Model

The system follows a **dynamic local timezone model**:

- Day boundaries move with the user’s current location
- If the user travels, their day adjusts to the new timezone
- There is no fixed or locked timezone in the MVP

---

### Behavior Rules

#### Start of Day
- A new day begins at 12:00 AM local time
- A new daily logging record becomes active

#### End of Day
- The day ends at 11:59 PM local time
- The next day begins immediately after

#### Day Transition
- At midnight, the system:
  - Closes the previous day
  - Opens a new day for logging

---

### Travel Behavior

When a user changes timezones:

- The system must update “today” based on the new local time
- Day boundaries shift accordingly
- Logging should continue seamlessly without requiring user intervention

---

### Edge Case: Crossing Midnight During Use

If a user is active in the app across midnight:

- The system must:
  - Transition to the new day automatically
  - Preserve data entered for the previous day
  - Begin logging against the new day without data loss

---

### Backfill Interaction

Backfill eligibility must be determined using local calendar days.

Example:
- If today is Day 10 (local time)
- User may backfill:
  - Day 9
  - Day 8

This must remain consistent regardless of timezone changes.

---

### Data Model Implication

Each logged day must be associated with:

- A calendar date (YYYY-MM-DD)
- The timezone in effect when the day was active (recommended for accuracy)

This ensures:
- Correct historical interpretation
- Accurate backfill behavior
- Stability across timezone changes

---

### UX Implications

The system should:

- Make “today” feel obvious and intuitive
- Avoid exposing timezone complexity
- Ensure that users never feel their day changed unexpectedly

---

### Strategic Principle

A day should match how a human experiences a day.

Users think in terms of:
- “today”
- “yesterday”
- “tomorrow”

The system must align with that mental model, even if it requires additional internal complexity.

## Flexible Logging Modes & End-of-Day Completion Shortcuts

### Purpose

This section defines how the system supports multiple logging styles and low-friction completion, especially for repetitive or high-frequency commitments such as water intake.

The goal is to:
- Reduce logging friction
- Support real-life behavior patterns
- Avoid penalizing users for not logging in real time
- Maintain reasonable integrity without forcing excessive precision

---

### Core Principle

Logging should adapt to the user’s behavior, not force the user into rigid interaction patterns.

Users should be able to:
- Log incrementally
- Log totals at once
- Mark a commitment as complete directly when appropriate

---

### Flexible Logging Modes

For commitments that involve quantity (e.g., water, steps, repetitions), the system must support multiple input styles:

#### 1. Incremental Logging
- Users can log progress throughout the day
- Example: Tap “+12 oz” multiple times

#### 2. Direct Total Entry
- Users can enter the total amount completed in one action
- Example: Enter “48 oz” at the end of the day

#### 3. Mark-as-Complete Shortcut
- Users can mark the commitment as complete without entering detailed data
- This assumes the user has met the requirement

---

### Commitment Configuration

Each commitment should be configurable to support one or more of the above modes.

For MVP:
- Default to allowing all three modes where applicable
- Avoid forcing a single interaction model

---

### End-of-Day Behavior Reality

The system must assume that many users will:
- Complete their commitments
- Delay logging until later
- Prefer fast completion over detailed reconstruction

The system must support this behavior without creating unnecessary friction.

---

### “Complete All for Today” Shortcut

The system must provide a way to mark all commitments for the current day as complete in a single action.

#### Behavior

- User selects: “Mark Day Complete” (or similar phrasing)
- System marks all commitments as completed for that day

#### Confirmation

A lightweight confirmation should be shown:
- Example: “Mark all today’s commitments as complete?”

#### Undo

The action must be easily reversible:
- User can edit the day afterward
- Individual commitments can be adjusted

---

### Interaction with Day Evaluation

When “Complete All” is used:
- All commitments are treated as satisfied
- The day is evaluated as **Complete**

This overrides partial or missing input for that day.

---

### Data Integrity Consideration

This feature prioritizes usability over granular accuracy.

The system must accept that:
- Some users will not log detailed data
- Some data will be approximate or omitted

This is acceptable for MVP, as long as:
- The system remains internally consistent
- The user experience supports continued engagement

---

### UX Guidance

The interface should:
- Avoid forcing users to log every micro-action
- Make fast completion feel natural and acceptable
- Avoid implying that detailed logging is required for success

---

### Strategic Principle

The goal is not perfect tracking.

The goal is:
Consistent engagement and habit formation.

If users are doing the work, the app should make it easy to reflect that reality — not create friction that pushes them away.

## Day Record Lifecycle & Storage Model (Lazy Creation)

### Purpose

This section defines when a day record comes into existence, what it represents, and how it behaves over time.

It establishes the conceptual model for daily logging without yet defining the full technical schema.

---

### Core Principle

A day record is created only when the user interacts with that day.

The system does not pre-create empty day records for every calendar day.

This is a lazy creation model.

---

### Rationale

Lazy creation is the preferred MVP model because it:

- Avoids unnecessary empty records
- Keeps storage cleaner and simpler
- Reflects actual user interaction
- Allows missed days to be inferred rather than explicitly stored in advance

This supports a lightweight system without losing meaningful behavior.

---

### Day Record Definition

A day record represents the user’s logged interaction with a specific calendar day.

A day record is the container for that day’s tracked data.

Conceptually, it must be able to hold:

- The calendar date
- The associated plan version for that day
- Commitment-level logged inputs
- Derived day state (Complete, Partial, Missed)
- Notes or optional day-level metadata
- Timestamps for creation and update

---

### Creation Triggers

A day record must be created when the user first does any of the following for a given day:

- Logs any commitment
- Enters water, workout, or other tracked values
- Marks a commitment complete
- Uses “Complete All for Today”
- Adds notes
- Uploads a photo
- Backfills a prior eligible day

The first meaningful interaction with a day creates the day record.

---

### Non-Creation Behavior

The system must not create a day record merely because:

- The calendar day started
- The user opened the app
- The user viewed the day without logging anything

Viewing is not creation.

---

### Plan Version Association at Creation

When a day record is created, it must be associated with the correct plan version according to the versioning rules:

- For the current day:
  - Associate using the active plan version at the time of creation
  - Subject to same-day plan change behavior defined in Module 60

- For backfilled days:
  - Associate using the plan version that was active on that calendar day

This association is critical and must be stored explicitly.

---

### Day Record Mutability

A day record must remain editable within the allowed logging and backfill rules.

Users should be able to:

- Add more data later in the same day
- Update commitment values
- Correct mistakes
- Complete missing fields
- Backfill eligible recent days

The record should evolve as the user logs more information.

---

### Missed Day Interpretation

A missed day does not require a pre-existing day record.

If no day record exists for a calendar day, the system may interpret that day as unlogged and potentially missed based on surrounding rules and evaluation logic.

This allows missed behavior to be derived without forcing explicit empty-day storage.

---

### Relationship to Evaluation

A day record stores the user’s inputs.

The day state (Complete, Partial, Missed) is derived by evaluating that data against the associated plan version.

The system may store the current evaluated state for performance and UI reasons, but the conceptual source of truth is:

- Logged inputs
- Associated plan version
- Evaluation logic

---

### UX Implications

The system should feel immediate and forgiving.

Users do not need to think about whether a day “exists” yet.

They simply interact with today or an eligible backfill day, and the system creates the necessary structure behind the scenes.

---

### Strategic Principle

A day record should exist because the user did something, not because the system generated bookkeeping.

This keeps the experience simple and keeps the data model tied to meaningful user behavior.

## Commitment Logging Model & Data Capture (Multi-Entry Model)

### Purpose

This section defines how individual commitments are logged within a day.

It establishes:
- How users input data for commitments
- How multiple entries are handled
- How data is aggregated for evaluation
- How the system supports both incremental and end-of-day logging styles

---

### Core Principle

A commitment may be logged multiple times within a single day.

Each log entry represents a meaningful unit of user activity.

The system must support:
- Incremental logging throughout the day
- Single-entry total logging
- Simple completion shortcuts

---

### Logging Model

Each commitment within a day is represented by:

- A set of one or more log entries
- An aggregated value derived from those entries
- A completion status based on the aggregated value and commitment rules

---

### Log Entry Definition

A log entry represents a single recorded action for a commitment.

Each log entry must include:

- Entry ID
- Associated Day Record ID
- Associated Commitment ID (from the plan version)
- Value (if applicable)
- Entry Type (e.g., increment, total entry, manual completion)
- Timestamp of entry

Optional:
- Notes or metadata (future enhancement)

---

### Supported Entry Types

The system must support multiple entry types:

#### 1. Incremental Entry
- Adds a unit of progress
- Example: +12 oz water, +1 workout

#### 2. Direct Total Entry
- Represents the full total for the day
- Example: 48 oz entered once

#### 3. Completion Entry
- Marks the commitment as complete without detailed values
- Used when the user knows they met the requirement

---

### Aggregation Logic

For each commitment, the system must compute an aggregated value:

- Sum all incremental entries
- Respect direct total entries (which may override or define total)
- Recognize completion entries as satisfying the requirement

Aggregation must produce:

- A total value (if numeric)
- A completion status (complete / not complete)

---

### Completion Determination

A commitment is considered complete when:

- The aggregated value meets or exceeds the defined target

OR

- A valid completion entry exists

The system must treat completion entries as authoritative for MVP simplicity.

---

### Interaction Between Entry Types

The system must behave predictably when multiple entry types are used:

- If a direct total entry exists:
  - It may define the total value for the day
- If incremental entries exist:
  - They accumulate toward the total
- If a completion entry exists:
  - The commitment is considered complete regardless of numeric values

The system must avoid conflicting states and prioritize clarity over strict enforcement.

---

### Editing Behavior

Users must be able to:

- Add new entries at any time within allowed periods
- Edit or delete recent entries
- Replace incremental logging with a total entry
- Override detailed entries with a completion shortcut

The system should feel forgiving and adjustable.

---

### UX Implications

The interface should:

- Support quick-add buttons for common increments
- Allow direct input of totals
- Provide a simple “Mark Complete” option
- Display a clear aggregated result
- Avoid overwhelming the user with entry-level detail unless needed

---

### Data Integrity Consideration

This model prioritizes flexibility and usability over strict tracking precision.

The system must accept that:
- Some users will log granular data
- Some users will log totals
- Some users will use completion shortcuts

All of these must result in a consistent and valid evaluation.

---

### Strategic Principle

Logging should match how people actually behave.

Users should not be forced to:
- Track every micro-action
- Maintain perfect real-time logging

The system must support:
Real behavior, imperfect tracking, and consistent forward progress.

## Editing Window & Data Modification Rules

### Purpose

This section defines when and how users can modify previously logged data.

It establishes:
- The allowed time window for editing
- What types of edits are permitted
- How the system protects historical integrity
- How editing aligns with backfill rules

---

### Core Principle

Users may edit recent days within a limited window.

Beyond that window, historical data becomes locked and cannot be modified.

This balances:
- Flexibility for real-life behavior
- Protection against rewriting history

---

### Editing Window

Users may edit data for:

- Today
- Yesterday
- The day before yesterday

This creates a **3-day editable window**, aligned with the backfill rules.

---

### Locked Days

Any day outside the editable window is considered **locked**.

For locked days:

- No new entries may be added
- Existing entries may not be modified
- Entries may not be deleted
- Completion status may not be changed

The system must enforce this consistently.

---

### Allowed Edits Within Window

For editable days, users must be able to:

- Add new log entries
- Modify existing entries
- Delete entries
- Replace incremental entries with total entries
- Use or remove completion shortcuts
- Update notes or metadata

The system should feel forgiving and correctable within this window.

---

### Relationship to Backfill

Editing and backfill share the same time boundary.

If a user can backfill a day, they can also edit that day.

This creates a consistent mental model:
- “Recent days are flexible”
- “Older days are final”

---

### Plan Version Interaction

All edits must respect plan version rules:

- Edits to past days must use the plan version associated with that day
- The system must not apply current plan rules to older days during editing
- Evaluation must remain consistent after edits

Editing changes data, not the rules that apply to that data.

---

### UX Implications

The system should:

- Make editable days clearly interactive
- Indicate when a day is locked
- Avoid surprising the user with unexpected restrictions
- Provide clear feedback if an edit is not allowed

Optional messaging:
- “This day is no longer editable”

---

### Error Prevention

The system should:

- Prevent accidental edits outside the allowed window
- Confirm destructive actions (e.g., deleting entries)
- Allow easy correction within the editable period

---

### Strategic Principle

Users need a short window to correct reality.

After that, history should become stable.

This supports:
- Honest tracking
- Reduced second-guessing
- Clear boundaries between “recent” and “final”

## Daily Logging Flow & Interaction Model (Commitment List)

### Purpose

This section defines the primary user interface and interaction flow for daily logging.

It establishes:
- How the daily screen is structured
- How users interact with commitments
- How logging actions are performed
- How the system responds in real time

---

### Core Principle

The daily logging experience must be:

- Fast
- Clear
- Repeatable
- Low-friction

Users should be able to:
- Understand their day at a glance
- Log progress quickly
- Complete their day with minimal effort

---

### Primary Layout: Commitment List

The daily screen is structured as a list of commitments for the current day.

Each commitment is displayed as a distinct item.

Each item includes:

- Commitment name
- Current progress (if applicable)
- Completion status
- Logging controls
- Optional quick actions

---

### Commitment Item Behavior

Each commitment item must support:

#### Visibility
- Always visible for the day
- Ordered consistently with the plan definition

#### Status Display
- Not started
- In progress
- Complete

#### Interaction Options
- Quick-add actions (e.g., +1, +12 oz)
- Direct input (numeric entry where applicable)
- “Mark Complete” shortcut

---

### Real-Time Feedback

As users log data:

- The commitment updates immediately
- Progress indicators update in real time
- Completion status updates dynamically

The system must feel responsive and alive.

---

### Day-Level Status

The system should display an overall day status:

- Complete
- Partial
- Missed (if applicable)

This must update dynamically as commitments are logged or modified.

---

### “Complete All” Shortcut

The daily screen must include a prominent option to:

- Mark all commitments as complete

Behavior:
- Marks all commitments complete
- Updates day status to Complete
- Requires lightweight confirmation
- Must be easily reversible

---

### Editing Flow

Within the allowed editing window:

- Users can tap into any commitment
- Add or adjust entries
- Remove entries
- Replace entries with totals or completion shortcuts

The interaction must feel forgiving and adjustable.

---

### Backfill Flow

For backfillable days:

- The same commitment list UI should be used
- The user experience should be nearly identical to “today”
- The system must apply the correct plan version behind the scenes

Users should not need to think about versioning.

---

### Visual Hierarchy

The UI should:

- Emphasize incomplete commitments
- Clearly show completed items
- Avoid clutter
- Make progress visible without overwhelming detail

---

### Minimal Cognitive Load

The system must avoid:

- Forcing users to remember prior actions
- Requiring reconstruction of the entire day
- Excessive navigation between screens

Everything needed for the day should be accessible in one place.

---

### Strategic Principle

Daily logging should feel like checking in with yourself, not filling out a form.

The system should support:
- Fast action
- Clear understanding
- Easy completion

So that users return every day without friction.

