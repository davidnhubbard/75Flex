## Historical Evaluation Rule: Days Are Judged by the Plan Version Active on That Day

### Core Rule

When a user changes their plan, past days must remain evaluated according to the version of the plan that was active on each of those days.

Plan changes apply forward, not backward.

The system must not retroactively re-judge previously completed or missed days using a newer version of the plan.

---

### Product Meaning

A day should mean what it meant at the time the user lived it.

If a user had one version of their plan on Day 12, then Day 12 must always be interpreted using that version, even if the user later changes the plan on Day 20.

This protects the integrity of the user's history and ensures that the system reflects what actually happened rather than rewriting the past.

---

### Rationale

This rule exists to preserve:

- Historical honesty
- User trust
- Metric integrity
- Behavioral clarity

Without this rule, the system could create false history by making old days appear more complete or less complete based on rules that did not exist at the time.

That would make progress reporting unreliable and would undermine confidence in the product.

---

### Required System Behavior

The system must:

- Preserve the plan definition that was active for each logged day
- Evaluate each day against the commitments, definitions, and thresholds in effect on that day
- Apply plan edits only to future dates, unless a separate explicit effective-date mechanism is later introduced
- Prevent silent retroactive reinterpretation of prior history

The system must not:

- Re-score past days when a user edits a plan
- Recalculate historical completion status using the latest plan version by default
- Make old missed days appear completed because the plan later became easier
- Make old completed days appear missed because the plan later became harder

---

### Example Scenarios

#### Example 1: Plan Becomes Easier

A user's original plan required:
- Two workouts
- 1 gallon of water
- 10 pages of reading

The user later edits the plan to require:
- One workout
- 80 ounces of water
- 10 pages of reading

If Day 6 was missed under the original plan because the user only completed one workout, Day 6 must remain missed.

It must not become completed just because the later version of the plan is easier.

#### Example 2: Plan Becomes Harder

A user's original plan required:
- One workout
- 80 ounces of water

The user later edits the plan to require:
- Two workouts
- 1 gallon of water

If Day 9 was completed under the original plan, Day 9 must remain completed.

It must not become incomplete just because the later version of the plan is harder.

---

### UX Implication

Users should be able to trust that their history is stable.

Editing a plan should feel like adjusting the road ahead, not rewriting the road behind them.

The product should reinforce this implicitly through consistent behavior and, where needed, explicit explanatory copy.

---

### Strategic Principle

The system records lived behavior over time, not a fantasy version of perfect consistency under whatever rules exist today.

History must remain historically true.

## Plan Version Creation & Storage Model (Hidden Versioning)

### Model Overview

75 Flex uses an internal, system-managed versioning model for plans.

Plan versioning is not exposed as a primary concept in the user experience.

Users interact with a single evolving plan, while the system maintains a versioned history behind the scenes to preserve historical accuracy.

---

### Core Principle

Every meaningful change to a plan creates a new internal plan version.

These versions are:
- Automatically created
- System-managed
- Not directly visible to the user in the MVP

---

### User Experience Model

From the user’s perspective:
- They have one plan
- They can edit it at any time
- Changes feel immediate and forward-looking

The user is not required to:
- Understand versioning
- Manage versions
- Choose between versions

Versioning exists purely to support correctness, not to introduce complexity.

---

### Version Creation Rules

A new plan version must be created when the user makes any change that affects how a day would be evaluated.

This includes changes to:
- Commitments (add, remove, rename)
- Definitions of done
- Targets or thresholds (e.g., water amount, number of workouts)
- Input types that affect completion logic
- Any rule that changes what counts as “complete”

Minor or non-evaluative changes (e.g., description text only) may optionally avoid version creation, but this should be treated conservatively in the MVP.

---

### Version Identity

Each plan version must have:

- A unique version identifier
- A reference to the parent plan
- A timestamp indicating when the version became active

Optional but recommended:
- A reference to the previous version
- A change summary (system-generated or future enhancement)

---

### Effective Date Behavior

Each plan version becomes effective at the moment it is created.

All days logged after that moment must be evaluated using the new version.

All days before that moment must remain tied to their original version.

There is no retroactive application of plan changes.

---

### Day-to-Version Association

Each logged day must be explicitly associated with the plan version that was active on that day.

This association must be stored and must not be inferred dynamically from current plan data.

This ensures:
- Stable historical interpretation
- Accurate metrics
- Protection against future plan edits

---

### Data Integrity Requirement

The system must be able to reconstruct:

- What the plan looked like on any given day
- What the user was expected to do on that day
- Whether the day was completed according to that expectation

This must remain true even after multiple plan changes.

---

### System Responsibilities

The system is responsible for:
- Creating new versions automatically
- Assigning the correct version to each day
- Ensuring historical evaluations remain unchanged
- Preventing version data from being lost or overwritten

The user is not responsible for managing any of this.

---

### Strategic Note

Hidden versioning enables:

- A simple, clean user experience
- Accurate historical tracking
- Trustworthy progress metrics

It allows the system to behave intelligently without requiring the user to think about implementation details.

This aligns with the core philosophy:
Keep the experience simple, while the system handles the complexity.

## Plan Version Structure & Stored Data

### Purpose

A plan version must fully capture the exact state of the user's plan at a specific point in time.

This allows the system to:
- Evaluate any day accurately
- Reconstruct expectations for that day
- Preserve historical integrity even after future changes

A plan version is not a delta.  
It is a complete, self-contained snapshot.

---

### Core Principle

Each plan version must contain everything required to evaluate a day independently of any other version.

The system must not rely on:
- The current plan
- Future versions
- External inferred logic

If a version cannot stand alone, the system is fragile.

---

### Required Data: Plan-Level Fields

Each plan version must include:

- Plan Version ID
- Parent Plan ID
- Created Timestamp (when this version became active)

Optional but recommended:
- Previous Version ID
- Change Reason (system-generated or user-entered in the future)

---

### Required Data: Commitment Definitions

Each version must include the full set of commitments active at that time.

For each commitment:

- Commitment ID (stable across versions if possible)
- Name
- Description
- Definition of Done
- Input Type (checkbox, numeric, etc.)
- Target or Threshold (if applicable)
- Completion Rules (how the system determines success)
- Ordering / Display position (optional but useful for UI consistency)

---

### Commitment Identity Rule

If a commitment is modified:

- Minor edits (e.g., wording) may retain the same Commitment ID
- Substantive changes (e.g., target changes from 1 workout to 2 workouts) must still result in a new plan version

The commitment ID should remain stable where possible to support continuity, but evaluation must always use the version snapshot.

---

### Snapshot vs Reference Model

Plan versions must store commitment data as a snapshot, not as a reference to a mutable object.

This means:
- Do NOT rely on a shared “commitment definition” that changes over time
- Each version must contain its own copy of the commitment configuration

This prevents historical drift and ensures past days are evaluated correctly.

---

### Evaluation Readiness Requirement

Given:
- A plan version
- A day’s logged inputs

The system must be able to determine:
- What was expected
- What was completed
- Whether the day qualifies as complete

Without consulting any other version or external state.

---

### Example

Version 1:
- Workout: 1 per day
- Water: 80 oz

Version 2:
- Workout: 2 per day
- Water: 100 oz

If Day 5 is tied to Version 1:
- It must be evaluated using “1 workout / 80 oz”
- Even if Version 2 now exists

---

### Data Integrity Requirement

The system must guarantee:

- Plan versions are immutable after creation
- Historical versions are never overwritten
- Evaluation logic uses the correct version consistently
- Stored data is sufficient to prevent ambiguity

---

### Strategic Note

This structure may feel heavier than a simple “editable plan.”

That is intentional.

This is the foundation that allows:
- Flexible editing
- Honest history
- Reliable metrics

Without this, the system becomes inconsistent and untrustworthy over time.

## Day Evaluation Model & Completion Logic (Flexible Model)

### Purpose

This section defines how a logged day is evaluated against the plan version associated with that day.

It establishes:
- What counts as complete
- How partial progress is handled
- How missed days are identified
- How evaluation remains consistent across plan versions

---

### Core Principle

Day evaluation must reflect what actually happened, not force a binary success/failure model.

The system must:
- Recognize full completion
- Recognize partial completion
- Recognize missed days

This supports a more accurate and psychologically supportive representation of user behavior.

---

### Day States

Each day must be classified into one of the following states:

1. **Complete**
2. **Partial**
3. **Missed**

---

### Definition: Complete Day

A day is considered **Complete** when:

- All required commitments defined in the associated plan version are satisfied according to their definitions of done

This is the highest standard of completion and represents full adherence to the plan for that day.

---

### Definition: Partial Day

A day is considered **Partial** when:

- At least one commitment is completed
- But not all commitments are satisfied

Partial days indicate meaningful effort and progress, even if the full plan was not completed.

---

### Definition: Missed Day

A day is considered **Missed** when:

- No commitments are completed

This represents a full absence of engagement for that day.

---

### Commitment-Level Evaluation

Each commitment within a plan version must be evaluated independently based on:

- Its input type (checkbox, numeric, etc.)
- Its defined threshold or target
- Its definition of done

Examples:

- Checkbox commitment → complete if checked
- Numeric commitment → complete if value meets or exceeds target
- Workout commitment → complete if required number of workouts logged

---

### Aggregation Logic

The day state is determined by aggregating commitment-level results:

- If all commitments are complete → Day = Complete
- If some commitments are complete → Day = Partial
- If no commitments are complete → Day = Missed

---

### Optional Future Enhancement (Not MVP)

The system may later support:

- Weighted commitments
- Minimum completion thresholds (e.g., 80% = Complete)
- Custom definitions of “complete day”

These are explicitly out of scope for MVP to maintain simplicity.

---

### Version Consistency Requirement

Day evaluation must always use:

- The plan version associated with that day
- The commitment definitions stored in that version

The system must not:
- Re-evaluate days using newer plan versions
- Apply updated rules to historical data

---

### UX Implications

The system should:

- Clearly communicate when a day is complete
- Acknowledge partial progress positively
- Avoid harsh or punitive language for missed days

Examples:
- “You made progress today”
- “Partial day — you showed up”
- “No activity logged today”

---

### Strategic Principle

A day is not just “pass or fail.”

It is a reflection of behavior on a spectrum.

Recognizing partial progress:
- Encourages consistency
- Reduces dropout risk
- Aligns with real human behavior

The system must reinforce:
Showing up matters, even when it’s not perfect.

## Same-Day Plan Change Behavior (Real-Time Version Application)

### Purpose

This section defines how the system handles plan changes that occur during the same calendar day.

It ensures that:
- The system behaves intuitively for users making mid-day adjustments
- Today remains flexible and responsive
- Historical integrity rules remain intact for past days

---

### Core Principle

The current day is considered “in progress” and must reflect the latest active plan version at the time of evaluation.

Plan changes made during the day apply immediately to that same day.

---

### Key Distinction

The system must clearly distinguish between:

- **Past Days** → Fixed to their original plan version (immutable)
- **Current Day** → Evaluated using the latest plan version (mutable)
- **Future Days** → Always use the latest plan version

This creates a clean and predictable boundary:
- The past is stable
- The present is flexible
- The future follows the latest plan

---

### Behavior Rules

When a user edits their plan during the current day:

1. A new plan version is created
2. The current day immediately begins using the new version
3. Day evaluation updates in real time based on the new rules

---

### Evaluation Impact

#### If the Plan Becomes Easier

Example:
- Original: 2 workouts required
- Updated: 1 workout required
- User has completed 1 workout

Result:
- The current day becomes **Complete**

#### If the Plan Becomes Harder

Example:
- Original: 1 workout required
- Updated: 2 workouts required
- User has completed 1 workout

Result:
- The current day becomes **Partial**

---

### Logged Data Handling

Existing logged data for the current day must be preserved.

The system must:
- Re-evaluate the day using the new plan version
- Not delete or modify previously entered data
- Allow the user to continue logging against the updated plan

---

### UX Implications

The system should:

- Update the day status immediately after a plan change
- Reflect the new expectations clearly in the UI
- Avoid confusion about why the day status changed

Optional future enhancement:
- Brief messaging such as:
  - “Your plan changed — today’s status has been updated”

---

### Edge Case: Repeated Edits

If a user edits their plan multiple times in the same day:

- Each edit creates a new version
- The current day continues to use the latest version
- Evaluation continues to update dynamically

---

### Strategic Principle

Today should reflect the plan the user is choosing to follow now.

This reinforces:
- User control
- Flexibility
- Real-world adaptability

Without compromising:
- Historical accuracy
- System integrity

## Backfill Behavior & Version Consistency

### Purpose

This section defines how backfilled days interact with plan versions.

It ensures that:
- Backfilled data is evaluated correctly
- Historical integrity is preserved
- Users cannot unintentionally or intentionally rewrite past expectations

---

### Core Principle

A backfilled day must be evaluated using the plan version that was active on that calendar day, not the current plan version at the time of backfilling.

Backfilling affects when data is entered, not how the day is interpreted.

---

### Behavioral Rule

When a user backfills a day:

1. The system identifies the plan version that was active on that specific date
2. The day is evaluated using that version’s commitments and rules
3. The result (Complete, Partial, Missed) is determined based on that version only

The current plan version must not influence the evaluation of a backfilled day.

---

### Example Scenario

- Day 5:
  - Plan required 2 workouts
  - User completed only 1 workout
  - User did not log the day

- Day 7:
  - User edits plan to require only 1 workout
  - User then backfills Day 5

Result:
- Day 5 must be evaluated using the original requirement of 2 workouts
- Day 5 is **Partial**, not **Complete**

---

### Anti-Gaming Requirement

The system must prevent the following behavior:

- User edits plan to make it easier
- User then backfills past days
- Past days incorrectly become complete

This must not occur.

Backfill must not allow retroactive improvement of past performance via plan edits.

---

### Data Association Requirement

Each backfilled day must:

- Be explicitly associated with the correct plan version for that date
- Use the stored version snapshot for evaluation
- Not infer plan data from the current or latest version

---

### Interaction with Backfill Limits

Given the MVP rule:
- Users may only backfill the previous two days

This system must still:
- Correctly determine the historical plan version
- Apply the correct evaluation logic

Even within this limited window, plan changes may have occurred.

---

### UX Implications

The system should:

- Make backfilling simple and fast
- Avoid exposing version complexity to the user
- Ensure results feel consistent and fair

Optional future enhancement:
- Subtle messaging if needed:
  - “This day was evaluated based on your plan at that time”

---

### Strategic Principle

Backfilling is a convenience feature, not a rewriting tool.

It allows users to:
- Catch up on logging

It must not allow users to:
- Change what the day meant

The system must preserve the truth of past expectations, even when data is entered later.

