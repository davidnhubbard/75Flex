## Core Entities & Relationship Model

### Purpose

This section defines the core conceptual entities in the 75 Flex system and the relationships between them.

It establishes:
- The major data objects the product depends on
- How those objects relate to one another
- Which entities represent stable identity versus historical snapshots
- The conceptual structure that later technical schema must follow

This section defines the system model, not the final database implementation.

---

### Core Principle

The data model must support:

- A single evolving user plan
- Internal plan versioning
- Historically accurate day evaluation
- Flexible commitment logging
- Progress tracking over time
- Low-friction user interaction

The model must preserve both:
- Simplicity in the user experience
- Integrity in the system behavior

---

## Core Entities

### 1. User

Represents the individual using 75 Flex.

A User may have:
- One or more plans over time
- Reminder preferences
- Progress history
- Logged daily activity

The User is the top-level owner of all personal tracking data.

---

### 2. Plan

Represents the user’s overall challenge or active habit structure.

A Plan is the user-facing object the person thinks of as:
- “My plan”
- “My 75 Flex plan”

A Plan is:
- Persistent over time
- Editable
- The parent container for all plan versions

A Plan does not directly define historical rules for individual days.  
That responsibility belongs to Plan Versions.

---

### 3. Plan Version

Represents a full snapshot of the plan at a specific moment in time.

A Plan Version contains:
- The commitments active at that time
- The definitions of done
- The thresholds and completion rules required to evaluate a day

A Plan Version is:
- Created automatically when the plan changes in a meaningful way
- Immutable after creation
- Used to evaluate current and historical days according to versioning rules

Each Plan belongs to one User.  
Each Plan has many Plan Versions.

---

### 4. Commitment Definition (Version-Scoped)

Represents one commitment within a specific Plan Version.

Examples:
- Drink 80 oz of water
- Complete 1 workout
- Read 10 pages

A Commitment Definition belongs to a Plan Version, not directly to the User’s overall Plan.

This is critical because commitments may change over time.

A Commitment Definition includes:
- Name
- Description
- Input type
- Target or threshold
- Definition of done
- Completion logic

Each Plan Version has many Commitment Definitions.

---

### 5. Day Record

Represents a user’s logged interaction with a specific calendar day.

A Day Record belongs to:
- One User
- One Plan
- One Plan Version

A Day Record stores:
- The calendar date
- The associated plan version for that day
- Day-level status or evaluated result
- Optional metadata such as notes or timestamps

A Day Record is created lazily when the user first interacts with a day.

There is at most one Day Record per user per calendar day per plan.

---

### 6. Commitment Log Entry

Represents a single logged action for a commitment on a given day.

Examples:
- +12 oz water
- 48 oz total water entered once
- 1 workout logged
- Commitment marked complete

A Commitment Log Entry belongs to:
- One Day Record
- One Commitment Definition

A Day Record may have many Commitment Log Entries.

This supports:
- Incremental logging
- Direct total entry
- Completion shortcuts

---

### 7. Reminder Preference

Represents the user’s reminder settings.

A Reminder Preference belongs to one User.

It may include:
- Enabled / disabled state
- Preferred reminder time
- Local timezone behavior
- Other reminder-related settings

This entity governs how reminder logic is applied to the user.

---

## Relationship Summary

### User Relationships

- One User has many Plans
- One User has many Day Records
- One User has one Reminder Preference
- One User has many historical interactions over time

---

### Plan Relationships

- One Plan belongs to one User
- One Plan has many Plan Versions
- One Plan has many Day Records

---

### Plan Version Relationships

- One Plan Version belongs to one Plan
- One Plan Version has many Commitment Definitions
- One Plan Version may be associated with many Day Records

---

### Commitment Definition Relationships

- One Commitment Definition belongs to one Plan Version
- One Commitment Definition may be referenced by many Commitment Log Entries

---

### Day Record Relationships

- One Day Record belongs to one User
- One Day Record belongs to one Plan
- One Day Record belongs to one Plan Version
- One Day Record has many Commitment Log Entries

---

### Commitment Log Entry Relationships

- One Commitment Log Entry belongs to one Day Record
- One Commitment Log Entry belongs to one Commitment Definition

---

## Identity vs Snapshot Distinction

The system must clearly distinguish between:

### Stable Identity Objects
These persist as ongoing entities:
- User
- Plan
- Reminder Preference

### Historical Snapshot Objects
These preserve what was true at a point in time:
- Plan Version
- Commitment Definition (within a version)

### Behavioral Record Objects
These capture what the user did:
- Day Record
- Commitment Log Entry

This distinction is foundational to historical accuracy.

---

## Conceptual Constraints

The data model must preserve the following rules:

- A Day Record must always reference the correct Plan Version
- Commitment evaluation must use the Commitment Definitions from that version
- Plan changes must create new Plan Versions instead of overwriting past logic
- Commitment Log Entries must not depend on mutable current-plan definitions
- Historical evaluation must remain stable after future plan edits

---

## Strategic Principle

The data model must reflect reality over time.

It is not enough to store:
- the user’s current plan
- the user’s latest settings

The system must also preserve:
- what the plan was
- what the user did
- how that day should be interpreted

This is what allows 75 Flex to be:
- flexible for the user
- honest in its history
- reliable in its progress reporting

## Database Documentation Requirement

### Purpose

This section defines the documentation standard for all database objects in the 75 Flex system.

It establishes that the database is not just a storage layer, but also a maintainable and understandable part of the product that must be documented as thoroughly as the platform allows.

---

### Core Principle

Every database object must be documented wherever possible.

Documentation is not optional polish.  
It is part of the implementation standard.

The system should be built so that a developer, reviewer, or future maintainer can inspect the database and understand:

- What each object is for
- Why it exists
- How it is intended to behave
- Any important constraints or caveats

---

### Required Coverage

Documentation must be provided for all database object types wherever the database platform supports it.

This includes, but is not limited to:

- Tables
- Columns
- Indexes
- Constraints
- Foreign keys
- Views
- Materialized views (if used)
- Functions
- Procedures
- Triggers
- Trigger functions
- Enums or equivalent type objects
- Sequences (if relevant)
- Policies or row-level security rules
- Schemas or namespaces (if used)

---

### Table Documentation Requirement

Every table must include a description explaining:

- What the table represents
- Its role in the system
- Any important behavioral or historical significance

Table descriptions should be written in clear business and technical language.

They should help answer:
- Why does this table exist?
- What kind of data belongs here?
- How does it fit into the product model?

---

### Column Documentation Requirement

Every column should be documented wherever supported.

Column descriptions should explain:

- What the field stores
- Expected meaning of the value
- Units or format where relevant
- Important business rules or interpretation notes
- Whether the field is user-facing, system-generated, derived, optional, or required

Examples of fields that especially require strong documentation:

- Status fields
- State fields
- Timestamps
- Derived values
- Foreign keys
- Boolean flags whose meaning may not be obvious
- Numeric fields with units or thresholds

---

### View Documentation Requirement

Every view must include documentation explaining:

- Why the view exists
- What business or reporting purpose it serves
- Whether it is intended for application use, reporting, admin use, or debugging
- Any important interpretation rules

Where applicable, major output columns of the view should also be documented.

---

### Function and Procedure Documentation Requirement

Every function or procedure must include documentation explaining:

- Its purpose
- Its inputs
- Its outputs
- Any side effects
- When it is expected to run
- Whether it is safe, idempotent, or state-changing
- Any assumptions or special business logic it enforces

This is especially important for:
- Evaluation logic
- Versioning logic
- Derived metrics
- Cleanup logic
- Automation logic

---

### Trigger and Trigger Function Documentation Requirement

Every trigger and trigger function must include documentation explaining:

- Why it exists
- What event causes it to fire
- What object it acts on
- What side effects it causes
- Any risks, assumptions, or ordering dependencies

Triggers must never be “mystery automation.”

A future developer should be able to inspect a trigger and immediately understand:
- What it does
- Why it exists
- Whether it is safe to modify

---

### Constraint and Policy Documentation Requirement

Important constraints, foreign keys, unique rules, and row-level security policies should be documented wherever possible.

Documentation should explain:

- What rule is being enforced
- Why the rule matters
- Whether it protects business logic, data integrity, security, or historical accuracy

---

### Documentation Quality Standard

Documentation must be:

- Clear
- Specific
- Maintainable
- Written for future humans, not just current implementers

Avoid useless descriptions such as:
- “Stores user data”
- “Trigger for update”
- “Function to process stuff”

Descriptions should be meaningful enough to reduce ambiguity and speed up future maintenance.

---

### Change Management Requirement

When a database object is created or materially changed, its documentation must be created or updated at the same time.

Documentation must not be deferred indefinitely.

Schema evolution and documentation evolution must stay aligned.

---

### Strategic Importance

This requirement exists because undocumented database objects create long-term risk.

Poor database documentation leads to:

- Confusion
- Fragile maintenance
- Fear of changing important logic
- Hidden business rules trapped inside SQL objects
- Slow onboarding for future developers or AI-assisted tooling

Strong documentation improves:

- Maintainability
- Safety of future changes
- Clarity of business logic
- Accuracy when using AI tools to inspect or extend the system

---

### Strategic Principle

If a database object matters enough to exist, it matters enough to explain.

The database should be self-describing wherever the platform allows.

## View Design & Usage Principles

### Purpose

This section defines how database views should be designed and used within the 75 Flex system.

It establishes:
- The role of views in simplifying application logic
- Their importance for human-readable debugging and inspection
- Guidelines for what data should and should not be exposed in views

---

### Core Principle

Views should serve two primary purposes:

1. Simplify front-end and application-layer complexity  
2. Provide clean, human-readable representations of system data for debugging and analysis

Views are not just convenience tools.  
They are a critical interface layer between raw data and usable information.

---

### Application Usage

Views should be used to:

- Reduce complexity in front-end queries
- Encapsulate joins and derived logic
- Provide stable, predictable data shapes
- Avoid duplicating business logic across the application layer

Where appropriate, the application should query views instead of raw tables.

---

### Debugging & Human Readability

Views must be designed so that a human can:

- Inspect data quickly
- Understand relationships without deep schema knowledge
- Identify inconsistencies or anomalies
- Trace behavior across entities (e.g., plan → day → commitment → logs)

This is especially important for:

- Development
- Debugging
- Data validation
- Support scenarios

---

### Column Selection Principles

Views should expose:

- Human-readable fields
- Meaningful identifiers (where useful)
- Derived values that simplify understanding
- Status and interpretation fields

Views should avoid exposing:

- Internal surrogate keys (e.g., UUIDs) unless necessary
- Redundant foreign key columns
- Low-level implementation details that do not aid understanding

---

### Key Handling Strategy

When identifiers are required:

- Prefer meaningful or labeled identifiers where possible
- Include primary identifiers only when needed for navigation or debugging
- Avoid cluttering the view with multiple raw key columns

The goal is:
- Clarity over completeness
- Signal over noise

---

### Derived & Enriched Data

Views should include:

- Joined data from related tables
- Computed fields (e.g., aggregated totals, status labels)
- Interpreted values (e.g., day state, completion indicators)

This allows both:
- The front-end
- Human observers

To work with higher-level concepts instead of raw data fragments.

---

### Separation of View Types (Recommended)

The system may define different categories of views:

#### 1. Application Views
- Optimized for front-end usage
- Clean, predictable structure
- Minimal noise

#### 2. Debug / Inspection Views
- Slightly more detailed
- May include additional identifiers or diagnostic fields
- Still human-readable and intentionally structured

This separation is optional for MVP but recommended as the system grows.

---

### Anti-Clutter Rule

Views must not become:

- Dumps of all columns from multiple tables
- Overloaded with irrelevant identifiers
- Difficult to scan or interpret

Every column in a view should have a purpose.

If a column does not help:
- understanding
- debugging
- or application usage

It should not be included.

---

### Naming Considerations

Views should be named clearly to reflect their purpose.

Examples:
- `user_day_summary`
- `plan_version_commitments`
- `daily_commitment_progress`
- `debug_day_evaluation`

Names should indicate:
- What the view represents
- Who it is for (app vs debug, if applicable)

---

### Strategic Principle

Views translate system complexity into usable clarity.

They should make it easier to:
- Build the product
- Understand the data
- Diagnose issues

Without exposing unnecessary internal detail.

The guiding rule:

Expose what matters. Hide what doesn’t.

## Database Function Usage & Logic Consolidation Principles

### Purpose

This section defines how the system should approach complex data-access logic, evaluation logic, and reusable business logic at the database layer.

It establishes when database functions should be considered and why consolidating logic in one place can reduce errors, simplify debugging, and improve consistency across the application.

---

### Core Principle

When data-access logic or business logic becomes sufficiently complex, repetitive, or error-prone, the system should strongly consider implementing that logic in database functions rather than duplicating it across multiple front-end or application-layer locations.

The goal is not to move all logic into the database by default.

The goal is to place important logic where it can be:
- Defined once
- Reused consistently
- Debugged more easily
- Protected from drift across multiple code paths

---

### Problem Being Addressed

If complex logic is implemented redundantly in multiple places, the system becomes more fragile.

Risks include:

- Inconsistent behavior between screens or endpoints
- Repeated bugs caused by multiple implementations of the same logic
- Harder debugging because the source of truth is unclear
- Increased maintenance cost when business rules change
- Silent divergence between intended behavior and actual behavior

This risk is especially high for logic involving:
- Plan version interpretation
- Day evaluation
- Aggregation of commitment progress
- Progress calculations
- View-model shaping for complex data screens
- Eligibility rules (editing, backfill, reminders, off-track state)

---

### Preferred Decision Rule

The system should prefer database functions when logic is:

- Complex
- Reused in multiple places
- Closely tied to the underlying data model
- Important to business correctness
- Likely to evolve over time
- Hard to reproduce safely in multiple application-layer queries

The system may prefer application-layer code when logic is:

- Purely presentational
- Highly UI-specific
- Simple and unlikely to be reused
- Better handled close to the user interaction layer

---

### Strong Candidates for Database Functions

Database functions should be strongly considered for logic such as:

- Determining day state from stored entries and plan version rules
- Computing commitment completion from multiple log-entry types
- Resolving the effective plan version for a given date
- Calculating consistency scores over time windows
- Producing reusable progress summaries
- Determining off-track / back-on-track transitions
- Enforcing or supporting complex versioning behavior
- Returning pre-shaped datasets that would otherwise require repeated complex joins

---

### Benefits of Consolidating Logic in the Database

Using database functions appropriately can improve:

#### 1. Consistency
A single implementation is less likely to drift than multiple front-end or service-layer copies.

#### 2. Debuggability
When logic lives in one known place, it is easier to inspect, test, and reason about.

#### 3. Maintainability
Business-rule changes can be made once rather than hunting through multiple code paths.

#### 4. Safety
The system is less likely to produce contradictory results across different screens or APIs.

#### 5. Front-End Simplicity
The front end can consume clean results instead of reconstructing complex logic client-side.

---

### Front-End Simplicity Principle

The front end should not be forced to re-implement complex database-aware logic that depends on:

- Multiple related tables
- Historical plan-version interpretation
- Aggregation rules
- Conditional business behavior

Where possible, the front end should receive:
- Cleanly shaped data
- Clearly computed results
- Minimal ambiguity about how values were derived

This reduces both coding complexity and the chance of subtle bugs.

---

### Debugging Principle

Consolidating important logic into well-documented database functions can make debugging easier because:

- The logic is centralized
- Inputs and outputs can be inspected directly
- The behavior can be tested independently of UI state
- Developers can isolate whether a bug is caused by data, logic, or presentation

This is especially valuable in a system like 75 Flex where correctness depends on:
- Dates
- versions
- aggregations
- derived states
- historical interpretation

---

### Guardrail: Do Not Abuse Database Functions

This principle is not a blanket instruction to move everything into the database.

Avoid pushing logic into database functions when doing so would:

- Obscure simple UI behavior
- Make development slower without real benefit
- Hide logic that is primarily visual or interaction-based
- Create unnecessary coupling for trivial operations

The system should use judgment.

The goal is consolidation of meaningful logic, not database maximalism.

---

### Implementation Standard

When database functions are used for important logic, they must be:

- Clearly named
- Thoroughly documented
- Designed with stable inputs and outputs
- Reusable across multiple application contexts where appropriate
- Tested wherever possible

Related documentation requirements from this module apply fully to these functions.

---

### Strategic Principle

If complex logic is important enough that getting it wrong would damage correctness, trust, or maintainability, it should not be scattered across multiple front-end implementations.

It should have a clear home.

In many cases, that home should be a well-documented database function.

The guiding rule is:

Centralize complex truth.  
Do not duplicate it in fragile ways.

## Core Entity Field Definitions (Conceptual)

### Purpose

This section defines the major conceptual fields for the core entities in the 75 Flex system.

It establishes:
- What each core entity must be able to store
- Which fields are essential to product behavior
- Which fields are system-generated, derived, or user-controlled
- The conceptual foundation for later schema design

This section does not define final SQL types or vendor-specific implementation.

---

## 1. User — Conceptual Fields

### Purpose

Represents the person using the system.

### Required Fields

- **user_id**
  - Stable internal identifier for the user

- **auth_provider_user_id**
  - Identifier from the authentication provider, if separate from the internal user ID

- **display_name**
  - Human-readable name used in the app where appropriate

- **email**
  - Primary email address for account identity and communication

- **timezone**
  - Current or last-known timezone for day-boundary and reminder behavior

- **created_at**
  - Timestamp when the user record was created

- **updated_at**
  - Timestamp when the user record was last updated

### Optional / Recommended Fields

- **is_active**
  - Indicates whether the account is active or soft-disabled

- **preferred_locale**
  - Language or locale preference for future internationalization

- **last_seen_at**
  - Timestamp of most recent meaningful app activity

---

## 2. Plan — Conceptual Fields

### Purpose

Represents the user’s overall challenge or evolving habit plan.

### Required Fields

- **plan_id**
  - Stable internal identifier for the plan

- **user_id**
  - Owning user

- **plan_name**
  - User-facing name of the plan

- **duration_days**
  - Intended duration of the challenge or plan period

- **status**
  - Current lifecycle state of the plan
  - Examples may include active, paused, completed, archived, canceled
  - Final allowed values should be defined explicitly later

- **started_on**
  - Calendar date the plan begins

- **ended_on**
  - Calendar date the plan ended or is expected to end, if applicable

- **created_at**
  - Timestamp when the plan was created

- **updated_at**
  - Timestamp when the plan was last updated

### Optional / Recommended Fields

- **template_source**
  - Indicates whether the plan originated from 75 Hard, 75 Soft, custom blank, or another template

- **is_current**
  - Indicates whether this is the user’s currently active plan

- **archived_at**
  - Timestamp when the plan was archived, if applicable

---

## 3. Plan Version — Conceptual Fields

### Purpose

Represents a full snapshot of the plan at a specific moment in time.

### Required Fields

- **plan_version_id**
  - Stable internal identifier for the version

- **plan_id**
  - Parent plan

- **version_number**
  - Sequential version number for internal ordering and debugging

- **effective_at**
  - Timestamp when this version became active

- **created_at**
  - Timestamp when this version record was created

### Optional / Recommended Fields

- **previous_plan_version_id**
  - Reference to the immediately preceding version, if tracked

- **change_reason**
  - Human-readable or system-generated explanation of what changed

- **created_by**
  - Indicates who or what created the version, if relevant for auditability

---

## 4. Commitment Definition — Conceptual Fields

### Purpose

Represents one commitment within a specific plan version.

### Required Fields

- **commitment_definition_id**
  - Stable internal identifier for the commitment definition record

- **plan_version_id**
  - Parent plan version

- **stable_commitment_key**
  - Stable identity key carried across versions when the same commitment concept persists
  - Used for continuity and debugging, even though evaluation always uses the version snapshot

- **display_order**
  - Position of the commitment in the plan UI

- **name**
  - User-facing name of the commitment

- **description**
  - Optional or user-facing explanatory text for the commitment

- **input_type**
  - Defines how the commitment is logged
  - Examples may include checkbox, numeric, count, completion shortcut

- **target_value**
  - Numeric or comparable target where relevant

- **unit_label**
  - Human-readable unit such as oz, workouts, pages, minutes

- **definition_of_done**
  - Human-readable explanation of what counts as satisfying the commitment

- **completion_rule_type**
  - Internal description of how the system determines completion

- **is_required**
  - Indicates whether this commitment contributes to daily completion logic

- **created_at**
  - Timestamp when the definition record was created

### Optional / Recommended Fields

- **min_allowed_value**
  - Lower bound for numeric input where relevant

- **max_allowed_value**
  - Upper bound for numeric input where relevant

- **allow_incremental_logging**
  - Indicates support for repeated incremental entries

- **allow_direct_total_entry**
  - Indicates support for direct total entry

- **allow_mark_complete**
  - Indicates support for mark-as-complete shortcut

- **is_active_in_version**
  - Indicates the commitment is active in that version
  - Mostly useful if soft-deactivation within a version is ever supported

---

## 5. Day Record — Conceptual Fields

### Purpose

Represents the user’s logged interaction with a specific calendar day.

### Required Fields

- **day_record_id**
  - Stable internal identifier for the day record

- **user_id**
  - Owning user

- **plan_id**
  - Parent plan

- **plan_version_id**
  - Version used to interpret the day

- **calendar_date**
  - The day being tracked, stored as a calendar date

- **timezone_at_day**
  - Timezone in effect when that day was active or interpreted

- **day_state**
  - Derived or stored result for the day
  - Complete, Partial, or Missed

- **created_at**
  - Timestamp when the day record was first created

- **updated_at**
  - Timestamp when the day record was last modified

### Optional / Recommended Fields

- **day_note**
  - Optional freeform note for the day

- **completed_all_shortcut_used**
  - Indicates whether the user used the “Complete All” action

- **last_evaluated_at**
  - Timestamp when the system last calculated or refreshed the day state

- **is_locked**
  - Indicates whether the day is outside the editable window
  - This may be derived rather than stored, depending on final implementation

---

## 6. Commitment Log Entry — Conceptual Fields

### Purpose

Represents a single logged action for a commitment on a given day.

### Required Fields

- **commitment_log_entry_id**
  - Stable internal identifier for the log entry

- **day_record_id**
  - Parent day record

- **commitment_definition_id**
  - Commitment definition being logged against

- **entry_type**
  - Type of entry
  - Examples may include increment, direct_total, mark_complete

- **value**
  - Numeric or comparable value where relevant

- **entered_at**
  - Timestamp when the entry was recorded

- **created_at**
  - Timestamp when the record was created

- **updated_at**
  - Timestamp when the record was last updated

### Optional / Recommended Fields

- **note**
  - Optional comment attached to the entry

- **source**
  - Indicates whether the entry came from manual UI action, shortcut, import, or another source

- **is_deleted_soft**
  - Soft-delete flag if soft deletion is preferred for auditability

---

## 7. Reminder Preference — Conceptual Fields

### Purpose

Represents the user’s reminder settings.

### Required Fields

- **reminder_preference_id**
  - Stable internal identifier for reminder preferences

- **user_id**
  - Owning user

- **reminders_enabled**
  - Whether reminders are enabled

- **daily_reminder_time**
  - Preferred local reminder time

- **timezone**
  - Timezone used to interpret reminder timing

- **created_at**
  - Timestamp when the preference record was created

- **updated_at**
  - Timestamp when the preference record was last updated

### Optional / Recommended Fields

- **reengagement_enabled**
  - Whether re-engagement messaging is enabled if that becomes separately configurable

- **delivery_channel**
  - Current reminder channel, such as push
  - Useful if future multi-channel delivery is introduced

---

## Field Classification Guidance

### User-Controlled Fields
These are directly entered or meaningfully controlled by the user.

Examples:
- plan_name
- duration_days
- commitment names
- target values
- reminder time
- notes

### System-Generated Fields
These are created or maintained by the system.

Examples:
- IDs
- timestamps
- plan version numbers
- effective_at
- last_evaluated_at

### Derived Fields
These may be calculated from other data and may or may not be stored depending on implementation needs.

Examples:
- day_state
- is_locked
- aggregated commitment progress
- consistency scores

Derived fields must have a clearly defined source of truth if persisted.

---

## Naming Guidance

Field names should be:

- Explicit
- Stable
- Human-readable where possible
- Consistent across related objects

Avoid:
- vague abbreviations
- overloaded names
- fields whose meaning changes across contexts

Examples of preferred style:
- `calendar_date`
- `effective_at`
- `completion_rule_type`
- `daily_reminder_time`

---

## Strategic Principle

The data model should not hide important meaning inside ambiguous fields.

Each major concept should have a clearly named place to live.

This improves:
- schema clarity
- debugging
- front-end integration
- AI-assisted development
- long-term maintainability

## Indexing Strategy & Performance Principles

### Purpose

This section defines the indexing philosophy and performance-related database principles for the 75 Flex system.

It establishes:
- Why indexing is a first-class design concern
- Which categories of data access must be supported efficiently
- How indexes contribute to both performance and data integrity
- How indexing decisions should be made and maintained over time

---

### Core Principle

Indexing is a core part of database design, not an optional optimization pass.

If 75 Flex is successful, performance will depend heavily on the system’s ability to retrieve, join, filter, and validate data efficiently.

Indexes must therefore be considered part of the product’s structural design.

---

### Strategic Importance

Indexes matter for two major reasons:

#### 1. Performance
Indexes allow the system to support fast and predictable access for common query patterns.

This is especially important for:
- Daily logging flows
- Day lookup by date
- Progress calculations
- Plan version resolution
- Reminder and re-engagement processing
- Debugging and inspection queries
- Future analytics or reporting use cases

#### 2. Rule Enforcement
Indexes can also support important database rules, including:

- Uniqueness constraints
- One-record-per-scope guarantees
- Integrity protections that prevent duplicate or contradictory data

This makes indexes relevant not just to speed, but also to correctness.

---

### Required Indexing Mindset

The system should be designed with indexing in mind from the beginning.

This means:

- Anticipating high-frequency lookup paths
- Supporting the most important joins efficiently
- Defining uniqueness requirements clearly
- Avoiding reliance on full-table scans for common operations
- Treating indexing as part of schema quality

---

### Categories of Fields That Should Be Strong Candidates for Indexing

The following types of fields should be evaluated as strong candidates for indexes:

#### Primary Keys
- All primary keys must be indexed

#### Foreign Keys
- Foreign key columns should generally be indexed where they support joins, filtering, or lookups

#### Date and Time Fields Used in Retrieval
- Fields used for day lookup, effective-version lookup, reminder timing, or chronological filtering should be considered for indexing

#### Status / State Fields Used in Operational Queries
- Fields used to find active plans, incomplete days, off-track users, or reminder candidates may require indexing depending on query patterns

#### Uniqueness-Enforcing Fields
- Fields or field combinations used to prevent duplicates should be backed by unique indexes or equivalent constraints where appropriate

#### Common Filter / Sort Fields
- Any fields used frequently in application queries, background processing, or operational reporting should be evaluated for indexing

---

### High-Priority Query Patterns That Must Be Supported Efficiently

Indexes should be designed to support common and important access paths, such as:

- Finding a user’s current or active plan
- Retrieving plan versions for a plan in chronological order
- Resolving the effective plan version for a given day
- Retrieving a day record by user, plan, and calendar date
- Retrieving commitment log entries for a given day record
- Retrieving commitments for a specific plan version
- Finding reminder candidates by user state and reminder settings
- Supporting progress windows over recent dates
- Supporting human-readable debug views without excessive scan cost

These query patterns should influence indexing decisions directly.

---

### Composite Index Considerations

Some important query patterns may require composite indexes rather than single-column indexes.

These should be considered when access depends on combinations such as:

- user + plan
- plan + effective date
- user + calendar date
- day record + commitment
- plan + status
- reminder enabled state + reminder time

Composite indexes should be designed intentionally based on actual query patterns, not guesswork.

---

### Uniqueness & Business Rule Enforcement

Indexes should be used, where appropriate, to help enforce business rules such as:

- At most one day record per user per plan per calendar date
- Stable sequencing of plan versions within a plan
- Prevention of duplicate reminder preference records per user
- Other one-record-per-scope requirements that emerge from the design

Where uniqueness matters to product correctness, the database should enforce it directly rather than relying only on application behavior.

---

### Anti-Pattern: Index Everything

The system must avoid indiscriminate indexing.

Too many indexes can create:

- Slower writes
- More storage overhead
- Higher maintenance cost
- Confusion about what is truly important

Indexes should be purposeful.

Every index should support:
- a known query pattern
- a rule-enforcement need
- or a proven operational requirement

---

### Performance Validation Principle

Indexing should be informed by both design expectations and real-world query behavior.

As the product evolves, indexing should be reviewed using:

- Actual query patterns
- Execution plans
- Observed bottlenecks
- Debugging and operational needs

Indexing is not a one-time decision.  
It is an ongoing part of database tuning and stewardship.

---

### Documentation Requirement for Indexes

Important indexes should be documented wherever the platform allows or in adjacent schema documentation.

Documentation should explain:

- What the index supports
- Which query pattern or rule it exists for
- Whether it is primarily for performance, integrity, or both

Indexes must not become mysterious artifacts in the schema.

---

### Relationship to Views and Functions

Indexes should support the access patterns created by:

- Application queries
- Important database views
- Reusable database functions
- Background jobs or reminder logic

If views or functions become important operational paths, the underlying indexing strategy must reflect that.

---

### Strategic Principle

Indexes are part of how the system keeps its promises.

A well-indexed system is more likely to be:

- Fast
- Stable
- Predictable
- Maintainable
- Correct under load

The guiding rule is:

Design indexes for real behavior, real rules, and real scale.

