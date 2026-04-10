## Daily Logging API Endpoints

### Purpose

This section defines the primary API endpoints for daily logging behavior.

It establishes:
- How the client retrieves day-level logging state
- How commitment entries are created, updated, and deleted
- How day-level shortcut actions are handled
- How backfill and edit-window rules are enforced through the API

This section defines the behavioral contract of the daily logging API, not the final transport or framework implementation details.

---

### Core Principle

Daily logging endpoints should be resource-oriented, predictable, and aligned with the day record and commitment log entry model.

The API should make it easy for the client to:
- Retrieve the current state of a day
- Log commitment activity
- Correct recent data
- Complete a day quickly
- Backfill eligible recent days

Without forcing the client to understand internal plan-version mechanics.

---

## Endpoint Group Overview

The daily logging API should include endpoints in the following categories:

1. Day retrieval
2. Day detail retrieval
3. Commitment entry creation
4. Commitment entry update
5. Commitment entry deletion
6. Day-level completion shortcut
7. Day-level note updates (if supported in MVP)

---

## 1. Retrieve Today’s Logging State

### Endpoint
`GET /days/today`

### Purpose
Returns the current user’s logging state for today.

### Behavior
The response should provide an application-ready representation of today’s logging screen, including:

- Calendar date
- Current day status
- Whether the day is editable
- Commitments for the day
- Current progress for each commitment
- Existing entries, where needed
- Relevant day-level metadata
- Whether “Complete All” is available

### Notes
- The server determines the user’s current local day
- The response should reflect the active plan version for today
- The client should not need to manually resolve plan version information

---

## 2. Retrieve a Specific Day

### Endpoint
`GET /days/{date}`

### Purpose
Returns the logging state for a specific calendar date.

### Route Parameter
- `{date}` = calendar date in a standard format such as `YYYY-MM-DD`

### Behavior
The response should provide the same general shape as `GET /days/today`, but for the requested date.

This endpoint must:

- Resolve the correct plan version for the requested date
- Return whether the day is editable or locked
- Reflect whether the day is today, backfillable, locked, or historical

### Validation Rules
- The date must be valid
- Access must be restricted to the authenticated user’s own data
- The API must clearly handle out-of-range or invalid requests

---

## 3. Create a Commitment Log Entry

### Endpoint
`POST /days/{date}/entries`

### Purpose
Creates a new commitment log entry for the specified day.

### Behavior
This endpoint is used for actions such as:

- Incremental logging
- Direct total entry
- Marking a commitment complete

If the day record does not yet exist, the system creates it lazily.

### Expected Request Shape (Conceptual)
The request should include fields such as:

- Commitment identifier
- Entry type
- Value (if applicable)
- Optional note or metadata

### Server Responsibilities
The server must:

- Validate that the requested day is editable
- Resolve or create the appropriate day record
- Associate the day with the correct plan version
- Validate that the commitment belongs to that day’s plan version
- Create the log entry
- Recalculate or refresh the day’s derived state as needed

### Result
The response should return either:

- The newly created entry plus updated commitment/day state

or

- A refreshed day payload suitable for re-rendering the daily logging screen

The implementation may choose the exact response shape, but it must remain consistent.

---

## 4. Update a Commitment Log Entry

### Endpoint
`PATCH /entries/{entryId}`

### Purpose
Updates an existing commitment log entry within the allowed edit window.

### Behavior
Supports actions such as:

- Changing a numeric value
- Replacing an entry with a corrected value
- Updating entry-level notes if supported

### Server Responsibilities
The server must:

- Verify ownership of the entry
- Verify that the associated day is still editable
- Validate the updated value against the commitment rules
- Recalculate or refresh derived day and commitment state as needed

### Notes
The API must not allow updates to entries belonging to locked days.

---

## 5. Delete a Commitment Log Entry

### Endpoint
`DELETE /entries/{entryId}`

### Purpose
Deletes a commitment log entry within the allowed edit window.

### Behavior
Used when the user wants to:

- Remove a mistaken entry
- Replace a detailed entry with a different logging approach
- Undo an accidental action

### Server Responsibilities
The server must:

- Verify ownership of the entry
- Verify that the associated day is editable
- Remove or soft-delete the entry according to final implementation rules
- Recalculate or refresh derived day and commitment state as needed

### Notes
Deletion should be blocked for locked historical days.

---

## 6. Mark a Day Complete

### Endpoint
`POST /days/{date}/complete`

### Purpose
Marks all commitments for the specified day as complete using the day-level shortcut.

### Rationale
This is a pragmatic action endpoint rather than a purely resource-oriented write because it represents a high-value business action that deserves a simple, explicit interface.

### Behavior
The server must:

- Verify that the day is editable
- Resolve or create the day record if needed
- Mark all commitments for that day as satisfied
- Preserve any existing entries unless final implementation explicitly chooses otherwise
- Mark the day as Complete
- Record that the shortcut was used if that field is part of the final schema

### Notes
This endpoint should support both:
- today
- eligible backfill days within the edit window

---

## 7. Update Day-Level Note

### Endpoint
`PATCH /days/{date}`

### Purpose
Updates editable day-level fields that belong to the day record itself rather than individual commitment entries.

### Typical Use
For MVP, this likely includes:

- day note

### Behavior
The server must:

- Verify that the day is editable
- Resolve or create the day record if needed
- Update only allowed day-level fields
- Return updated day state or the updated day resource

---

## Backfill Handling Through Daily Endpoints

Backfill does not require separate endpoint families.

Instead, backfill is handled by using standard day endpoints with eligible recent dates.

Examples:
- `GET /days/2026-04-09`
- `POST /days/2026-04-09/entries`
- `POST /days/2026-04-09/complete`

The server is responsible for enforcing:
- backfill window rules
- locked-day restrictions
- historical plan-version correctness

The client should not implement these rules independently.

---

## Editability Rules

Daily logging endpoints must respect the edit window rules defined elsewhere in the specification.

The API must:

- Allow edits for today, yesterday, and the day before yesterday
- Reject modification attempts for older locked days
- Return clear error responses when a day is not editable

The API must not allow clients to bypass locking rules through alternate endpoints.

---

## Response Shape Expectations

Daily logging endpoints should return responses that are easy for the client to consume.

Where practical, responses should include:

- Day state
- Commitment progress
- Editability status
- Aggregated totals
- Updated day summary information

The client should not be forced to make multiple follow-up calls just to understand the effect of a single logging action.

---

## Error Conditions

Daily logging endpoints should handle and clearly report errors such as:

- Invalid date format
- Day outside editable/backfill window
- Commitment not valid for the requested day/version
- Invalid entry type
- Invalid value
- Entry not found
- Unauthorized access
- Server-side evaluation failure

Errors must follow the system-wide error visibility and reporting principles.

---

## Strategic Principle

Daily logging is the highest-frequency interaction path in the product.

Its API must be:

- Simple to use
- Hard to misuse
- Historically correct
- Consistent across today and recent backfill days

The guiding rule is:

Make logging easy for the client, while keeping correctness on the server.

