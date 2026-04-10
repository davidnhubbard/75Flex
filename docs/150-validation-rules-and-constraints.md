## Validation Rules & Business Constraints

### Purpose

This section defines all validation rules and business constraints for the 75 Flex system.

It establishes:
- What inputs are valid or invalid
- What combinations of values are allowed or disallowed
- What must be enforced consistently across all endpoints
- How invalid input is handled

This section is the authoritative source for:
- API validation
- database-level constraints (where applicable)
- frontend validation alignment
- AI-assisted implementation correctness

---

### Core Principle

Validation must be:

- Explicit
- Deterministic
- Consistent across all endpoints
- Enforced server-side

The system must not rely on:
- client-side validation alone
- implicit assumptions
- loosely interpreted rules

Invalid data must be rejected early and clearly.

---

## Validation Categories

The system includes validation in the following categories:

1. Plan-level validation
2. Commitment validation
3. Day-level validation
4. Entry-level validation
5. Reminder preference validation
6. Cross-field validation
7. System-level constraints

---

## 1. Plan-Level Validation

### Plan Name
- Must be present
- Must be a non-empty string
- Should have a maximum length (recommended: 100–255 characters)

---

### Duration
- Must be a positive integer
- Must be greater than zero
- Recommended bounds:
  - Minimum: 1 day
  - Maximum: 365 days (configurable)

---

### Start Date
- Must be a valid calendar date
- Must not be null when creating a plan
- Must be consistent with duration

---

### End Date
- Must be a valid calendar date
- If provided, must be:
  - equal to or after start date
  - consistent with duration if both are provided

---

### Template Source
- If provided, must be one of the supported values (e.g., `75Hard`, `75Soft`, `Custom`)
- Must not accept arbitrary uncontrolled values

---

### Commitments (Plan Creation & Update)

- A plan must include at least one commitment
- Recommended upper bound: configurable (e.g., 20 commitments)
- Commitments must be valid according to Commitment Validation rules
- Duplicate commitments (by meaning or key) should be prevented

---

## 2. Commitment Validation

### Name
- Must be present
- Must be non-empty
- Recommended max length: 100–255 characters

---

### Input Type
- Must be one of supported types (e.g., `checkbox`, `numeric`, `count`, `duration`)
- Must not accept arbitrary values

---

### Target Value
- Required for numeric/count-based commitments
- Must be a positive number
- Must be greater than zero
- Upper bound should be reasonable (configurable)

---

### Unit Label
- Optional but recommended for numeric commitments
- If provided, must be a short string

---

### Definition of Done
- Must be consistent with input type
- Must not conflict with target value or logging behavior

---

### Flags (Logging Behavior)

Flags such as:
- `allowIncrementalLogging`
- `allowDirectTotalEntry`
- `allowMarkComplete`

Must satisfy:

- At least one logging method must be enabled
- Mutually incompatible combinations must be rejected if they create ambiguity

---

### Display Order
- Must be a non-negative integer
- Should not conflict with other commitments in a way that breaks ordering logic

---

## 3. Day-Level Validation

### Calendar Date
- Must be a valid date
- Must be within the allowed system range
- Must not be malformed

---

### Editability Enforcement

All write operations must validate:

- The day is within the editable window
- The day is not locked

If the day is locked:
- reject all modifications
- return a clear error

---

### Day Note
- Optional
- If provided:
  - must be a string
  - recommended max length (e.g., 500–2000 characters)

---

## 4. Commitment Log Entry Validation

### Commitment Reference
- Must reference a valid commitment
- Must belong to the correct plan version for the target day

---

### Entry Type
- Must be one of allowed values (e.g., `increment`, `total`, `complete`)
- Must align with the commitment’s allowed logging modes

---

### Value

For numeric entries:
- Must be a valid number
- Must not be negative unless explicitly allowed
- Must be within reasonable bounds

For count-based entries:
- Must be an integer
- Must be >= 0

For completion-type entries:
- value may be omitted or ignored depending on implementation

---

### Note
- Optional
- Must be a string if provided
- Recommended max length

---

### Duplicate or Conflicting Entries

The system should:

- Prevent duplicate entries that would corrupt aggregation
- Allow legitimate multiple incremental entries
- Reject entries that violate logical consistency

---

## 5. Reminder Preference Validation

### remindersEnabled
- Must be boolean

---

### dailyReminderTime
- Must be a valid time
- Must follow a consistent format (e.g., HH:MM)
- Must be within a 24-hour range

---

### Timezone
- Must be a valid timezone identifier
- Must not accept arbitrary or malformed values

---

### Delivery Channel
- Must be one of supported values (if applicable)
- Must not accept unsupported channels

---

### Re-engagement Flag
- Must be boolean

---

## 6. Cross-Field Validation

### Plan Consistency
- duration, start date, and end date must align
- commitments must be consistent with plan structure

---

### Commitment Rules
- logging modes must not conflict
- input type must match allowed behaviors
- target values must align with definition of done

---

### Day and Entry Interaction
- entries must belong to valid commitments
- entries must align with the correct plan version
- entries must respect editability rules

---

### Plan Update Rules
- updates must not corrupt historical interpretation
- versioning must be triggered when required

---

## 7. System-Level Constraints

### Ownership
- all resources must belong to the authenticated user
- cross-user access must be rejected

---

### Historical Integrity
- past days must not be altered outside allowed edit window
- plan versions must remain historically consistent

---

### Data Integrity
- references between entities must remain valid
- orphaned records must not be created

---

### Consistency Enforcement
- derived values must not contradict stored values
- conflicting states must be prevented or detected

---

## Error Handling for Validation Failures

Validation failures must:

- return a clear error response
- identify the failing field or rule
- avoid silent correction of invalid data
- not partially apply changes

---

## Front-End vs Back-End Validation

### Front-End
- may perform early validation for user experience
- should mirror backend rules where practical

### Back-End
- is the final authority
- must enforce all rules regardless of client behavior

---

## Strictness Rule

When in doubt:

- reject invalid input
- do not guess user intent
- do not silently coerce values

Strict validation prevents long-term data corruption.

---

## Strategic Principle

Validation defines the boundary between valid system behavior and invalid state.

If validation is weak:
- bugs enter the system

If validation is strict and consistent:
- the system remains trustworthy

The guiding rule is:

Reject bad data early.  
Keep the system clean.

