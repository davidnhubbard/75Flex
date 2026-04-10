## Build & Implementation Plan

### Purpose

This section defines the recommended implementation order for 75 Flex.

It establishes:
- What should be built first
- Which work streams can run in parallel
- Which dependencies must exist before later work begins
- How to balance early UX quality with backend correctness
- How to reduce rework and prevent architectural drift during execution

This section is intended to turn the specification into a practical build sequence for:
- human developers
- AI-assisted coding tools
- mixed-tool workflows using systems such as Moonchild, D0, Codex, or similar tools

---

### Core Principle

75 Flex should not be built in a purely backend-first or purely UI-first way.

It should be built using a **structured parallel approach**:

1. Define and prototype the user experience early enough to avoid ugly or awkward interface decisions becoming embedded
2. Build the backend and data model in a disciplined order that preserves correctness
3. Reconcile the two continuously so visual design and implementation stay aligned

The goal is to avoid both:
- a polished shell with weak system integrity
- a correct backend trapped behind a clumsy interface

---

## Strategic Build Philosophy

The recommended build approach is:

- **Architecture-first**
- **UX-early**
- **Backend-core before polish-heavy feature completion**
- **Tight iteration between product behavior and interface design**

This means:

- The spec remains the source of truth
- UX exploration happens early
- Backend truth is implemented in phases
- Front-end implementation should follow approved interaction models rather than improvised one-off screens

---

## Primary Execution Tracks

Implementation should be organized into the following tracks:

1. **UX / Product Interaction Track**
2. **Core Backend & Data Track**
3. **API & Contract Track**
4. **Diagnostics / Reliability Track**
5. **Reminder / Async Processing Track**
6. **Polish / Hardening Track**

These tracks are not fully independent.  
They must be sequenced intentionally.

---

## Recommended High-Level Build Order

### Phase 0 — Execution Setup & Working Method

#### Goal
Create the execution environment and guardrails before meaningful feature coding begins.

#### Deliverables
- Repository structure
- Branching / workflow conventions
- Spec file organization finalized
- Prompting workflow for AI tools
- Definition of how spec updates, code changes, and documentation changes stay aligned
- Agreement on which tool is best suited for which work type

#### Recommended Tool Posture
- **Moonchild / D0 / design-oriented tools**
  - Early UI exploration
  - screen concepts
  - interaction ideas
  - better visual direction

- **Codex / implementation-oriented tools**
  - backend code
  - API handlers
  - schema implementation
  - mechanical build tasks
  - type-safe wiring once UX direction is known

#### Principle
Do not let implementation tools invent the product’s visual language by accident.

---

### Phase 1 — UX Direction & Core Screen Prototyping (Early Priority)

#### Goal
Establish a strong initial look and feel and validate the primary user interaction model before deep front-end implementation locks in weak design decisions.

#### Why This Phase Is Early
The product’s daily use experience is central to retention.

A poor early UI can create:
- awkward interaction patterns
- rework across multiple screens
- bad component assumptions
- resistance to later cleanup

It is better to settle the core interaction style early than to retrofit it after many screens exist.

#### Primary Targets
This phase should focus on the most important product surfaces:

1. Onboarding entry choice
   - Start My Plan
   - What is 75 Flex?

2. Plan creation flow
   - template choice
   - commitment editing
   - whole-plan setup experience

3. Daily logging screen
   - commitment list structure
   - quick actions
   - totals vs increments
   - complete-all interaction
   - editable / locked visual treatment

4. Progress screen
   - consistency summary
   - heatmap
   - interpretive messaging

5. Reminder settings screen
   - simple preference editing

#### Expected Output
- Low- to medium-fidelity UI direction
- Component vocabulary
- layout patterns
- interaction notes
- visual hierarchy decisions
- enough design clarity to guide implementation

#### Important Rule
This phase does **not** require pixel-perfect final design.

It does require enough clarity that the implementation does not wander into ugly or structurally weak UI decisions.

---

### Phase 2 — Domain Model & Database Foundation

#### Goal
Build the database and core domain structures from the specification before feature wiring expands.

#### Build Order
1. Core entities and relationships
2. Constraints
3. version-supporting structures
4. documentation for database objects
5. initial indexes
6. foundational views/functions where clearly justified

#### Priority Objects
- users
- plans
- plan versions
- commitment definitions
- day records
- commitment log entries
- reminder preferences

#### Important Rule
Do not start broad feature wiring before the underlying schema is stable enough to support:

- historical accuracy
- day evaluation
- plan versioning
- editability rules

---

### Phase 3 — Canonical Types, Contracts & Server Models

#### Goal
Translate canonical contracts into implementation-ready shared types and server-side models.

#### Deliverables
- shared API types
- request / response models
- canonical enums and state definitions
- validation schemas
- shared contract library if applicable

#### Principle
This phase reduces drift between:
- backend implementation
- frontend implementation
- AI-generated code
- tests
- documentation

This should happen before large numbers of handlers or screens are implemented.

---

### Phase 4 — Core Rule Engine / Domain Logic

#### Goal
Implement the hardest correctness logic before broad endpoint expansion.

#### Priority Logic
- plan-version resolution
- day-state calculation
- commitment satisfaction logic
- editability calculation
- backfill rules
- same-day plan-change rules
- consistency scoring

#### Principle
These rules are the truth engine of the product.

They should be implemented centrally and tested heavily before building wide surface area on top of them.

---

### Phase 5 — Core API Implementation

#### Goal
Implement the most important API groups in dependency order.

#### Recommended Order

##### 5A. Daily Logging API
Why first:
- highest-frequency path
- directly exercises day evaluation
- reveals rule-engine problems quickly

##### 5B. Plan Management API
Why second:
- required for real setup and plan iteration
- exercises hidden versioning

##### 5C. Progress & Summary API
Why third:
- depends on correct day and scoring logic
- largely read-oriented

##### 5D. Reminder & Preference API
Why fourth:
- simpler once user, day, and progress state are functioning

##### 5E. Cross-cutting enforcement
- auth / ownership
- error visibility
- consistent envelopes
- correlation IDs
- idempotency handling

---

### Phase 6 — Front-End MVP Implementation Against Approved UX Direction

#### Goal
Build the front-end using the earlier UX direction and the implemented APIs.

#### Recommended Order
1. onboarding / entry choice
2. plan creation and editing
3. daily logging screen
4. progress screen
5. reminder settings
6. basic return / off-track experiences

#### Important Rule
The front end should not freelance major interaction patterns once the UX direction is established.

Changes may still happen, but they should be deliberate and spec-aware.

#### Tool Guidance
- Use design-oriented AI tools for:
  - screen refinement
  - component exploration
  - visual hierarchy improvements
  - interaction quality

- Use implementation-oriented AI tools for:
  - wiring components to real APIs
  - state management
  - type-safe integration
  - mechanical UI assembly once structure is approved

---

### Phase 7 — Diagnostics, Error Visibility & Developer Support

#### Goal
Add the support infrastructure needed to understand the system under real use.

#### Deliverables
- structured error reporting
- correlation IDs
- key debug views
- explanation-oriented helper functions
- internal inspection tools where needed
- operational logging for important workflows

#### Principle
Do not leave diagnostics until “later someday.”

A stateful, versioned system becomes expensive to debug without early support infrastructure.

---

### Phase 8 — Reminder Engine & Background Job Implementation

#### Goal
Implement scheduled and asynchronous behavior only after core correctness and user-facing flows are stable enough to support it.

#### Deliverables
- reminder scheduling
- reminder suppression logic
- re-engagement processing
- background job observability
- retry behavior
- dead-letter / failed-job handling posture as appropriate

#### Principle
Background processing should extend a working system, not compensate for a weak synchronous core.

---

### Phase 9 — Integration Hardening & Spec Alignment Review

#### Goal
Verify that the implemented system still matches the specification and behaves coherently across boundaries.

#### Review Targets
- code vs spec
- API vs contracts
- UI vs intended interaction model
- database vs documented model
- events vs actual side effects
- background jobs vs defined async rules

#### Deliverables
- alignment review findings
- fixes for drift
- clarified documentation where needed
- updated spec if behavior intentionally changed

---

### Phase 10 — Visual Polish, UX Refinement & MVP Finish

#### Goal
Improve usability, visual quality, and interaction smoothness without destabilizing the underlying system.

#### Focus Areas
- spacing, typography, hierarchy
- motion and micro-feedback
- mobile ergonomics
- empty/error/loading states
- consistency of controls
- clarity of progress presentation
- refinement of reminder/settings UX

#### Principle
Polish happens after the system is structurally sound, but visual quality should not be ignored until the very end.  
The earlier UX phase prevents this phase from becoming a total redesign.

---

## Strict Dependency Order

Some work can happen in parallel, but the following dependencies should be treated as strict:

- Canonical contracts should exist before large-scale endpoint implementation
- Core rule engine should exist before progress or reminder logic is trusted
- Daily logging backend should exist before full logging UI wiring
- Plan versioning correctness should exist before plan editing is considered complete
- Reminder engine should not be trusted until day-state and completion logic are solid
- Diagnostics should exist before broad beta-style testing
- Final polish should not mask unresolved logic drift

---

## Recommended AI Tool Usage Strategy

### Best Use of Design-Oriented Tools
Use Moonchild, D0, or similar tools for:
- look and feel exploration
- visual hierarchy
- component patterns
- layout refinement
- UX alternatives
- interaction quality

These tools should help establish:
- the product’s visual character
- the shape of the most important screens
- the tone of the experience

### Best Use of Codex / Implementation-Oriented Tools
Use Codex or similar tools for:
- schema implementation
- route handlers
- shared types
- validation schemas
- service logic
- tests
- mechanical component integration

### Important Rule
Do not let implementation tools define the product’s visual language by default.

That path often leads to:
- generic UI
- awkward interaction patterns
- brittle retrofits later

The visual / interaction direction should be established first enough that implementation tools are executing a vision, not improvising one.

---

## Prompting Guidance for Execution

When using AI tools for implementation:

### For UX Work
Provide:
- master index
- relevant behavior module
- relevant screen-related module(s)
- interaction goals
- desired visual tone or constraints

### For Backend Work
Provide:
- master index
- relevant behavior module(s)
- relevant data model module(s)
- relevant API module
- contracts
- validation rules
- state machine rules if the task touches derived behavior

### For Background / Event Work
Provide:
- event model
- background jobs model
- relevant API module
- state machine rules
- diagnostics expectations

---

## Anti-Patterns to Avoid During Build

Do not:

- let UI emerge randomly from implementation defaults
- build large parts of the frontend before agreeing on primary interaction patterns
- duplicate rule logic in the client and server
- skip diagnostics until late
- implement reminder logic before state logic is trustworthy
- allow spec/code drift during rapid iteration
- over-polish weak foundations
- over-engineer background jobs before core flows work

---

## MVP Interpretation Rule

For MVP, “complete enough to learn” is better than “perfect but late.”

However, the following must not be compromised:

- historical integrity
- state correctness
- validation consistency
- error visibility
- ownership enforcement
- enough UX quality that the product feels intentional rather than hacked together

---

## Strategic Principle

Build order determines how much rework the system will demand later.

75 Flex should be built in a sequence that protects:

- correctness
- usability
- maintainability
- design quality
- implementation sanity

The guiding rule is:

Set the interaction direction early.  
Build the truth engine carefully.  
Wire the product in phases.  
Polish after the structure is sound.

