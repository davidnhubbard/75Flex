## Plan Management API Endpoints

### Purpose

This section defines the primary API endpoints for plan creation, retrieval, and editing.

It establishes:
- How a user creates a plan
- How the current plan is retrieved
- How plan updates are submitted
- How the server manages hidden version creation
- How plan-management behavior remains simple for the client while preserving historical integrity

This section defines the behavioral contract for plan-management endpoints, not the final framework implementation details.

---

### Core Principle

The client should interact with a plan as a single evolving object.

The server is responsible for:
- Interpreting meaningful plan changes
- Creating new plan versions when required
- Preserving historical correctness
- Returning clean, usable plan representations

The client must not be responsible for managing internal versioning mechanics in normal product usage.

---

## Endpoint Group Overview

The plan-management API should include endpoints in the following categories:

1. Create a plan
2. Retrieve current plan
3. Retrieve a specific plan
4. Update a plan using a whole-plan update model
5. Retrieve plan versions (for inspection, debugging, or advanced views)

---

## 1. Create a Plan

### Endpoint
`POST /plans`

### Purpose
Creates a new plan for the authenticated user.

### Behavior
This endpoint is used when a user:

- Starts from a 75 Hard template
- Starts from a 75 Soft template
- Starts from a blank custom plan
- Creates a custom plan during onboarding or later

### Expected Request Shape (Conceptual)
The request should include plan-level information such as:

- Plan name
- Duration
- Start date
- Template source if applicable
- Full set of commitment definitions for the initial plan

### Server Responsibilities
The server must:

- Create the user-facing Plan record
- Create the initial Plan Version
- Store all submitted commitment definitions within that version
- Return a usable representation of the created plan

### Notes
The first meaningful plan definition must create both:
- the Plan
- its initial Plan Version

---

## 2. Retrieve Current Plan

### Endpoint
`GET /plans/current`

### Purpose
Returns the authenticated user’s current active plan.

### Behavior
The response should provide:

- Plan identity and status
- Current user-facing plan details
- Current commitments
- Current duration and dates
- Current template source if relevant
- Any high-level metadata needed by the client

### Notes
This endpoint should return the latest active version as the current working plan view.

The response should be shaped for normal product use, not low-level debugging.

---

## 3. Retrieve a Specific Plan

### Endpoint
`GET /plans/{planId}`

### Purpose
Returns a specific plan belonging to the authenticated user.

### Behavior
The response should include:

- Plan-level information
- The current effective plan structure for user-facing purposes
- Relevant metadata needed to understand the plan in context

### Validation Rules
The server must:

- Confirm ownership of the plan
- Reject access to plans not owned by the authenticated user
- Return clear errors for missing or invalid resources

---

## 4. Update a Plan (Whole-Plan Update Model)

### Endpoint
`PATCH /plans/{planId}`

### Purpose
Updates a plan by submitting the revised full plan structure.

### Core Model
The client sends the updated plan as a whole logical object.

The server determines:
- what changed
- whether the changes are meaningful for evaluation
- whether a new Plan Version must be created

This is the preferred MVP model.

---

### Behavior
This endpoint is used for actions such as:

- Renaming a plan
- Changing duration
- Adjusting commitment targets
- Adding commitments
- Removing commitments
- Reordering commitments
- Changing definitions of done
- Changing logging configuration for commitments

---

### Expected Request Shape (Conceptual)
The request should include the revised plan structure, including:

- Plan-level metadata that is editable
- Full set of active commitments as the user wants them to exist after the update

The server is responsible for comparing this requested state to the current one.

---

### Server Responsibilities
The server must:

- Verify ownership of the plan
- Validate the updated plan structure
- Detect whether changes are meaningful to evaluation behavior
- Create a new Plan Version when required
- Avoid unnecessary new versions for immaterial changes if the implementation supports that distinction
- Return the updated current plan view

### Important Versioning Rule
The server must preserve hidden versioning behavior.

The client must not be required to:
- provide version numbers
- explicitly request version creation
- understand historical version internals

---

### Same-Day Behavior Interaction
If the updated plan applies during the current day, the server must respect the same-day versioning rules already defined in the specification.

The API must therefore ensure that:
- current-day interpretation updates appropriately
- past days remain historically fixed
- future days use the new plan version

---

## 5. Retrieve Plan Versions

### Endpoint
`GET /plans/{planId}/versions`

### Purpose
Returns plan-version history for the specified plan.

### Intended Use
This endpoint is primarily for:

- debugging
- admin tooling
- advanced inspection
- explicit historical views

It is not required for routine daily use by the client.

### Behavior
The response should provide version-level information such as:

- Version identifier
- Version number
- Effective timestamp
- Change summary if available
- Snapshot summary of commitments

The implementation may choose to return:
- a lightweight list
- or a richer detailed structure

But it must remain understandable and consistent.

---

## Optional Version Detail Endpoint

### Endpoint
`GET /plans/{planId}/versions/{versionId}`

### Purpose
Returns the detailed contents of a specific plan version.

### Intended Use
For:
- debugging
- inspection
- historical analysis
- admin or internal tools

This is optional for MVP but recommended if version-debugging needs become important.

---

## Validation & Business Rules

Plan-management endpoints must enforce rules such as:

- A plan must contain a valid set of commitments
- Required fields must be present
- Commitment definitions must be internally consistent
- Plan updates must not silently corrupt historical interpretation
- Version creation must be triggered when evaluation-relevant changes occur

The server must not trust the client to determine whether a change is historically meaningful.

---

## Response Shape Expectations

Plan-management responses should be designed for client usefulness.

They should include:

- Clean plan metadata
- Current commitment definitions
- User-facing values and labels
- Minimal exposure of unnecessary internal version complexity

If version details are included in standard plan responses, they should be limited to what helps the client function correctly.

---

## Error Conditions

Plan-management endpoints should handle and clearly report errors such as:

- Invalid plan structure
- Missing required fields
- Invalid commitment definitions
- Unauthorized access
- Plan not found
- Invalid update payload
- Server-side versioning failure

Errors must follow the system-wide error visibility and reporting principles.

---

## Strategic Principle

Plan management should feel simple to the client even though it drives complex historical behavior behind the scenes.

The API should let users think:

“I updated my plan.”

While the server correctly handles:

- version creation
- historical integrity
- current-day interpretation
- future behavior

The guiding rule is:

Keep plan editing simple on the surface and correct underneath.