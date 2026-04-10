## Reminder & Preference API Endpoints

### Purpose

This section defines the primary API endpoints for reminder preferences and reminder-related user settings.

It establishes:
- How the client retrieves reminder preferences
- How the client updates reminder settings
- How the API returns effective reminder state
- How reminder configuration remains simple for the user while preserving system-level reminder behavior

This section defines the behavioral contract for reminder-related endpoints, not the final framework implementation details.

---

### Core Principle

Reminder preferences should be managed as a single user-level settings resource.

For MVP, the system should treat reminder configuration as one coherent preference object per user rather than a collection of independent reminder records.

This keeps the user experience simple and keeps the API clean.

---

## Endpoint Group Overview

The reminder and preference API should include endpoints in the following categories:

1. Retrieve reminder preferences
2. Update reminder preferences
3. Retrieve effective reminder state (optional but recommended)

---

## 1. Retrieve Reminder Preferences

### Endpoint
`GET /reminders/preferences`

### Purpose
Returns the authenticated user’s current reminder settings.

### Behavior
The response should provide an application-ready reminder preference object including fields such as:

- Whether reminders are enabled
- Preferred daily reminder time
- Effective timezone
- Whether re-engagement reminders are enabled, if configurable
- Delivery channel, if relevant
- Any other reminder-related preferences supported by MVP

### Notes
This endpoint should return the user’s current saved preference state, not a speculative or derived future schedule.

It should be shaped for easy use by the settings UI.

---

## 2. Update Reminder Preferences

### Endpoint
`PATCH /reminders/preferences`

### Purpose
Updates the authenticated user’s reminder settings.

### Typical Use
This endpoint is used when a user wants to:

- Turn reminders on or off
- Change reminder time
- Adjust reminder-related settings
- Update effective reminder timezone if the implementation stores it explicitly

### Expected Request Shape (Conceptual)
The request may include fields such as:

- reminders enabled / disabled
- daily reminder time
- timezone
- delivery channel if supported
- other reminder-related flags supported in MVP

The request should support partial updates.

---

### Server Responsibilities
The server must:

- Validate the updated values
- Persist the new reminder preference state
- Return the updated preference object
- Ensure that future reminder processing uses the latest saved settings

The server must also ensure that invalid or inconsistent reminder settings are rejected clearly.

---

## 3. Retrieve Effective Reminder State (Optional but Recommended)

### Endpoint
`GET /reminders/state`

### Purpose
Returns the user’s effective reminder state as interpreted by the system.

### Intended Use
This endpoint is useful when the client needs to display more than raw saved preferences, such as:

- Whether the user is currently reminder-eligible
- Whether the reminder for today has already been suppressed
- Effective local reminder time after timezone handling
- Re-engagement mode status if applicable

### Behavior
The response may include fields such as:

- reminders enabled
- daily reminder time
- effective timezone
- whether today’s reminder would currently fire
- whether the user is in re-engagement mode
- whether the day is already complete and therefore suppresses reminder behavior

### Notes
This endpoint should expose interpreted reminder state in a clean, application-friendly way.

It is especially useful if reminder logic becomes more nuanced than simple static preference storage.

If not implemented separately in MVP, equivalent data may be folded into `GET /reminders/preferences`.

---

## Single Preference Resource Rule

For MVP, each user should have one reminder preference resource.

The system should enforce:

- At most one reminder preference record per user
- Clear default creation behavior for new users
- Predictable retrieval even if the preference record must be lazily created

This rule should be enforced at both:
- application logic level
- database integrity level where appropriate

---

## Timezone Handling Rules

Reminder endpoints must align with the system-wide timezone model.

The API should:

- Return reminder times in a clearly defined way
- Preserve the user’s effective timezone
- Ensure that reminder interpretation follows the user’s local-time model

The client must not be required to guess how reminder timing is interpreted.

---

## Response Shape Principles

Reminder-related responses should be:

- Simple
- Explicit
- Easy to bind to settings UI
- Free of unnecessary system internals

Responses should prefer:
- clearly named booleans
- explicit times
- explicit timezone values
- interpreted state where useful

Responses should avoid:
- leaking reminder-engine internals that the client does not need
- exposing implementation complexity that does not improve usability

---

## Validation Rules

Reminder endpoints should validate conditions such as:

- valid reminder time format
- valid timezone value
- supported delivery channel
- acceptable preference combinations

The system should reject invalid settings clearly and consistently.

---

## Error Conditions

Reminder endpoints should handle and clearly report errors such as:

- Invalid time format
- Invalid timezone
- Unsupported reminder configuration
- Unauthorized access
- Missing preference resource when unexpected
- Internal persistence or scheduling failure

Errors must follow the system-wide error visibility and reporting principles.

---

## Strategic Principle

Reminder settings should feel simple to the user even though they drive time-sensitive system behavior behind the scenes.

The API should let the user think:

“I turned reminders on at 8 PM.”

While the system correctly handles:

- storage
- timezone interpretation
- reminder eligibility
- suppression rules
- re-engagement state

The guiding rule is:

Keep reminder settings simple on the surface and correct underneath.

