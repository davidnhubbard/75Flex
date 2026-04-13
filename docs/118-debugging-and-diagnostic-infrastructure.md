## Debugging, Diagnostics & Safe Helper Infrastructure

### Purpose

This section defines the role of debug helper capabilities and diagnostic infrastructure in the 75 Flex system.

It establishes:
- That debugging support is a deliberate part of the architecture
- Which kinds of helper capabilities are desirable
- Which kinds of debug code are unsafe or unacceptable
- How diagnostic tooling should be controlled and documented

---

### Core Principle

The system should include intentional diagnostic and debugging support.

Debug helper capabilities are not inherently bad.  
Undisciplined or unsafe debug code is bad.

The goal is to create diagnostic infrastructure that helps developers and operators inspect system truth, understand behavior, and investigate problems without weakening correctness, security, or maintainability.

---

### Strategic Rationale

75 Flex includes logic that can become difficult to inspect without dedicated diagnostic support, including:

- Plan versioning
- Historical day evaluation
- Partial vs complete determination
- Backfill behavior
- Reminder and re-engagement logic
- Derived progress calculations
- Error investigation across multiple layers

Without debug helper capabilities, it may become unnecessarily difficult to answer questions such as:

- Why is this day marked Partial instead of Complete?
- Which plan version was used for this date?
- Why did a reminder fire or not fire?
- Why is a user considered Off Track?
- Why does a score look incorrect?
- Did a user action fail silently or partially?

The architecture should support answering these questions efficiently.

---

### Desired Categories of Diagnostic Support

The system should consider including diagnostic support such as:

#### 1. Human-Readable Debug Views
Views that help humans inspect related data without needing to manually reconstruct joins and business logic.

Examples:
- Day evaluation inspection view
- Plan-version-to-day linkage view
- Reminder candidate inspection view

---

#### 2. Explanation-Oriented Functions
Functions that help explain derived behavior or computed state.

Examples:
- Why a day is Complete, Partial, or Missed
- Which plan version applied to a date
- Why a reminder was eligible or suppressed

These functions should help reveal system reasoning, not obscure it.

---

#### 3. Internal or Admin Inspection Endpoints
Endpoints or tools intended for trusted internal use that expose diagnostic information not needed in the normal user experience.

Examples:
- Day evaluation breakdown
- Current effective plan version details
- Progress calculation inspection

These must be access-controlled.

---

#### 4. Structured Logging and Trace Support
Logging that supports tracing a user action or background operation across system layers.

Examples:
- Request correlation IDs
- Workflow tracing for logging actions
- Background job diagnostics
- Error context capture

---

#### 5. Non-Production Helper Utilities
Safe helpers for development or test environments.

Examples:
- Seed data utilities
- Reset/test-state helpers
- Simulated reminder runs
- Evaluation test fixtures

For this product specifically, preferred seed-data helper posture includes:
- named scenario profiles (for example: new user, onboarding incomplete, active streak, off-track re-entry)
- one-command apply/reset switching for local QA runs
- strict environment gating so profile switching cannot be used in production

These must be environment-gated and never casually exposed in production.

---

### Anti-Patterns to Avoid

The system must avoid unsafe or sloppy debug code such as:

- Hidden bypasses of business rules
- Undocumented admin shortcuts
- Hard-coded flags that alter production behavior unpredictably
- Debug endpoints with weak or missing access control
- Console spam or noisy logging without structure
- Temporary helper code that becomes permanent without review
- Diagnostics that mutate production data without clear intent

Debugging support must help inspect the system, not quietly distort it.

---

### Access Control Requirement

Diagnostic helpers must be protected appropriately.

Depending on the helper type, this may include:

- Environment restrictions
- Role-based access control
- Admin-only visibility
- Internal-only routing
- Explicit feature flags for trusted use

Diagnostic capabilities must not become accidental public surface area.

---

### Documentation Requirement

All debug helper capabilities must be documented.

Documentation should explain:

- What the helper does
- Who it is for
- Whether it is production-safe
- What safeguards apply
- Whether it is read-only or state-changing
- Any operational risks or limitations

No debug helper should exist as mystery infrastructure.

---

### Read-Only Preference

Where possible, diagnostic helpers should be read-only.

Helpers that inspect state are generally preferable to helpers that mutate state.

If a helper does change data, it must be:

- Explicitly intentional
- Clearly documented
- Strongly access-controlled
- Justified by a valid operational need

---

### Relationship to Views, Functions, and Error Handling

Diagnostic infrastructure should work in harmony with:

- Database views designed for human readability
- Database functions that centralize complex logic
- Error logging and reporting systems
- API endpoints that expose safe inspection capabilities

Debugging should not be an afterthought layered awkwardly on top of the architecture.

It should be supported by the architecture itself.

---

### Strategic Principle

A system that cannot explain itself becomes expensive to trust and difficult to maintain.

75 Flex should include safe helper infrastructure that makes it easier to:

- Inspect truth
- Understand derived behavior
- Diagnose problems
- Support future development

The guiding rule is:

Build helpers that reveal truth.  
Do not build helpers that bypass truth.
