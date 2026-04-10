## Authentication, Authorization & Ownership Rules

### Purpose

This section defines how authentication, authorization, and data ownership must be handled across the 75 Flex API.

It establishes:
- How the acting user is determined
- How access to resources is restricted
- How ownership rules are enforced
- How the API prevents cross-user access and accidental data leakage

This section defines the security and access model for normal product usage, not the final framework-specific implementation details.

---

### Core Principle

The API should operate primarily in the context of the authenticated user.

Authentication identifies who is making the request.  
Authorization determines what that user is allowed to access or modify.

The system must treat user ownership and access control as first-class requirements, not as optional client-side conventions.

---

### Authentication Model

The API must require authentication for all user-specific endpoints unless an endpoint is explicitly designed to be public.

For normal application behavior, the authenticated user context must be derived from the authentication layer, not supplied by the client as an arbitrary identifier.

This means the client should generally not send:

- user IDs in routes for self-service operations
- arbitrary ownership identifiers in request bodies
- any mechanism that allows the user to choose whose data is being accessed

The server must determine the acting user from the authenticated session or token context.

---

### Authorization Model

The server must enforce authorization on every protected endpoint.

Authorization must determine whether the authenticated user is allowed to:

- read the requested resource
- modify the requested resource
- perform the requested action
- access diagnostic or admin-only capabilities if such capabilities exist

Authorization must never be assumed based on UI state alone.

The server must validate access independently.

---

### Ownership Rule

All user-owned resources must be constrained to their owning user.

Examples of user-owned resources include:

- Plans
- Plan Versions
- Day Records
- Commitment Log Entries
- Progress summaries
- Reminder Preferences

The server must ensure that a user can only access or mutate their own resources unless an explicitly privileged role allows broader access.

---

### Indirect Ownership Validation

For nested or indirectly owned resources, the server must validate ownership through the full relationship chain.

Examples:
- An entry belongs to a day
- The day belongs to a plan
- The plan belongs to a user

The server must not trust a raw resource ID alone without verifying that the full ownership chain resolves to the authenticated user.

---

### No Client-Side Ownership Trust

The API must not trust the client to tell the server which user owns a resource.

The system must avoid designs where:

- user_id in the request body controls ownership
- route parameters allow arbitrary user scoping for self-service operations
- client-visible identifiers are treated as sufficient proof of access

Ownership must always be verified server-side.

---

### Public vs Protected Endpoint Distinction

If the system includes public endpoints in the future, those endpoints must be explicitly identified and documented.

Examples of potentially public or semi-public flows might include:

- marketing or informational endpoints
- invitation acceptance flows
- limited onboarding bootstrap flows

These must be clearly separated from authenticated user data operations.

Protected endpoints should be the default.

---

### Admin / Internal Access Rules

If internal, support, admin, or diagnostic endpoints are introduced, they must use stronger authorization controls.

This may include:

- Role-based access control
- Internal-only routing
- Environment gating
- Additional audit requirements

Admin or diagnostic access must never be implicitly available to ordinary users.

---

### Ownership Enforcement in Query Behavior

Ownership rules must apply consistently to all query behaviors, including:

- direct reads
- nested resource reads
- filtered lists
- update operations
- delete operations
- background-triggered reads performed on behalf of a user

The system must avoid cases where ownership is enforced in one code path but forgotten in another.

---

### Error Handling for Auth Failures

Authentication and authorization failures must be handled clearly and consistently.

The API should distinguish between:

#### Authentication Failure
The request is not properly authenticated.
Examples:
- missing token
- expired session
- invalid credentials

#### Authorization Failure
The user is authenticated but not allowed to access the requested resource or perform the requested action.

The system should avoid leaking sensitive details while still making failure meaningfully diagnosable.

---

### Resource Existence vs Access Protection

The API should be careful about how it responds when a user requests a resource they do not own.

The implementation may choose between safe patterns such as:

- returning a generic not found response
- returning a forbidden response where appropriate

The key requirement is:
the system must not leak sensitive information about resources the user is not entitled to know about.

---

### Relationship to Database Enforcement

Where practical, ownership and access protections should also be reinforced below the API layer through:

- database policies
- secure query patterns
- constrained service-layer data access
- least-privilege design

Security should not depend solely on controller-level checks if deeper enforcement is available.

---

### Logging & Audit Implications

Authentication and authorization decisions should be traceable where useful for debugging and support.

Important failed-access events may be logged with care, including:
- attempted operation
- resource type
- authenticated actor
- reason for denial
- timestamp

This must be done without creating unnecessary security exposure.

---

### Strategic Principle

The API should behave as though every request must prove both:

- who is acting
- why they are allowed to act on this resource

The guiding rule is:

Determine identity on the server.  
Enforce ownership on the server.  
Trust neither to the client.