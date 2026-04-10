## API Design Principles & Structure (REST Model)

### Purpose

This section defines the API design philosophy and structural conventions for the 75 Flex system.

It establishes:
- The primary API style
- How resources should be modeled
- How endpoints should be named and organized
- How the API should balance clarity, flexibility, and maintainability

This section defines the architectural contract for the API layer, not the final endpoint list.

---

### Core Principle

The 75 Flex API should use a **REST-oriented resource model**.

The API should be:
- Predictable
- Consistent
- Easy to reason about
- Aligned with the core product entities
- Practical rather than dogmatic

The system should prefer resource-based design while still allowing pragmatic exceptions where they significantly improve clarity or usability.

---

### Primary Design Goal

The API must make it easy for the front end and service layer to:

- Retrieve the user’s current plan state
- Log daily activity
- Update commitments and days
- Retrieve progress summaries
- Manage reminder preferences
- Work with historically accurate plan-version behavior without forcing the client to understand version complexity

The API should expose clean product concepts, not raw database mechanics.

---

### Resource-Oriented Model

The API should be organized around major resources such as:

- Users
- Plans
- Plan Versions
- Commitments
- Days
- Log Entries
- Progress
- Reminder Preferences

The front end should interact primarily with these resources rather than issuing highly specialized one-off commands for routine behavior.

---

### Naming Principles

Endpoint names should be:

- Clear
- Predictable
- Based on nouns/resources rather than verbs where practical
- Stable over time
- Consistent in pluralization and hierarchy

Prefer:
- `/plans`
- `/plans/{planId}`
- `/plans/{planId}/versions`
- `/days/{date}`
- `/days/{date}/entries`
- `/progress/summary`

Avoid:
- Inconsistent naming styles
- Overly abstract endpoint names
- Verb-heavy ad hoc endpoints unless there is a strong reason

---

### Hierarchy Principles

Nested routes should be used when a resource is meaningfully scoped to a parent resource.

Examples:
- `/plans/{planId}/versions`
- `/days/{date}/entries`
- `/plans/{planId}/commitments`

However, nesting should not become so deep that routes become difficult to understand or maintain.

Prefer clarity over excessive nesting.

---

### User Context Handling

The API should generally operate in the context of the authenticated user.

This means:

- Most user-specific endpoints do not need the user ID in the route
- Authentication determines the acting user
- The API should avoid exposing or requiring unnecessary user identifiers in normal client usage

Examples:
- `/plans/current`
- `/days/today`
- `/progress/summary`

This keeps the client experience simple and secure.

---

### Practical REST Flexibility

The system may use pragmatic non-pure REST endpoints when they significantly improve clarity for business actions.

Examples may include actions such as:
- marking a day complete
- returning a specialized summary
- triggering a specific re-evaluation operation

These should be exceptions, not the default model.

When used, they should still be:
- Clearly named
- Narrow in purpose
- Consistent with the overall API structure

---

### Versioning Complexity Principle

Internal plan versioning must remain primarily a server-side concern.

The API should:

- Preserve historical correctness
- Associate days with the correct plan version
- Handle same-day version updates appropriately

The client should not need to manually manage plan-version internals for ordinary use.

Where version details are exposed, they should be for:
- advanced inspection
- debugging
- admin tooling
- explicit historical views

Not as a requirement for standard daily usage.

---

### Response Shape Principles

API responses should be:

- Clean
- Predictable
- Focused on client usefulness
- Free of unnecessary internal detail

Responses should prefer:
- human-meaningful fields
- clearly named derived values
- application-ready shapes

Responses should avoid:
- leaking raw schema complexity
- exposing irrelevant internal IDs
- forcing the client to reconstruct core business meaning

---

### Error Handling Principles

The API should return errors that are:

- Clear
- Specific
- Actionable where possible
- Consistent in structure

Errors should help distinguish between:
- validation problems
- permission problems
- missing resources
- state conflicts
- server failures

The front end should be able to respond intelligently without guessing.

---

### Idempotency & Safety Considerations

The API should be designed with careful attention to:

- Safe reads
- predictable writes
- duplicate-submission tolerance where possible
- consistency for retry behavior

This is especially important for:
- daily logging actions
- mark-complete actions
- plan updates
- reminder preference changes

Where an operation may reasonably be repeated due to network or UI conditions, the API should behave predictably.

---

### Derived Data Principle

The API should return derived values when they reduce client complexity.

Examples:
- day state
- aggregated commitment progress
- consistency score summaries
- editability / locked status
- current reminder state

The client should not be forced to recompute important business logic that the server already knows how to determine correctly.

---

### Documentation Requirement

All API endpoints must be documented with:

- Purpose
- Inputs
- Outputs
- Validation rules
- Behavioral notes
- Error conditions
- Authentication expectations

Important derived fields and non-obvious response semantics must also be documented.

The API should be understandable by:
- human developers
- future maintainers
- AI-assisted coding tools

---

### Strategic Principle

The API is the product’s behavioral contract.

It should expose the system in a way that is:

- simple for clients
- faithful to product rules
- resilient as the system evolves

The guiding rule is:

Make the API reflect the product, not the database.