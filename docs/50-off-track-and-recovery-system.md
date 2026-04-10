## Off-Track & Recovery System

### Purpose

This section defines how the system handles missed days and user recovery.

It establishes:
- When a user is considered “Off Track”
- How the system transitions between engagement states
- How recovery works without resets
- How messaging supports re-engagement
- How behavior integrates with reminders and progress

This module is the behavioral bridge between:
- daily logging (Module 40)
- progress tracking (Module 70)
- reminders & re-engagement (Module 80)

---

## Core Principle

Missing days is part of the system — but staying disengaged is not the goal.

The system must:
- Allow gaps without punishment
- Encourage fast return
- Maintain forward momentum
- Avoid normalizing inactivity

The system must not:
- Reset progress
- Erase history
- Create an all-or-nothing experience

---

## Engagement State Model

The system defines three engagement states:

### 1. On Track
User is actively logging with reasonable consistency.

### 2. At Risk
User has begun to disengage but has not fully dropped off.

### 3. Off Track
User has missed enough consecutive days to require explicit re-engagement behavior.

---

## State Transition Rules

### On Track → At Risk
Triggered when:
- User misses **1–2 consecutive days**

Behavior:
- No major system change
- Slight messaging tone shift (optional)

---

### At Risk → Off Track
Triggered when:
- User misses **3 consecutive days**

This is the **primary Off Track threshold**.

Behavior:
- Activate re-engagement mode
- Adjust messaging tone
- Maintain standard reminder frequency (MVP)

---

### Off Track → On Track
Triggered when:
- User logs **any meaningful activity** (Partial or Complete day)

Behavior:
- Exit re-engagement mode
- Resume normal system behavior

---

## Definition of “Missed Day”

A day is considered missed when:

- Day state = `Missed`
- No required commitments are satisfied

This aligns with the day-state model defined in Module 140.

---

## Consecutive Missed Day Tracking

The system must track:

- number of consecutive missed days

This value is used to:
- determine state transitions
- trigger re-engagement mode
- support reminder logic

This value should be:
- derivable from day history
- optionally stored for performance

---

## Recovery Model (No Reset System)

### Core Rule

There is **no reset behavior** in 75 Flex.

Missing days:
- do not erase progress
- do not restart the plan
- do not invalidate previous effort

---

### Recovery Behavior

When a user returns:

- They continue from the current day
- Past missed days remain as-is
- Progress metrics naturally reflect the gap
- No special “restart” flow is required

---

### Psychological Model

The system reinforces:

- “You’re continuing, not starting over”
- “Progress is cumulative”
- “Gaps are part of real consistency”

---

## Re-engagement Mode

### Activation

Triggered at:
- 3 consecutive missed days

---

### Behavior Changes

In re-engagement mode:

- Messaging tone changes (see below)
- Reminder messaging adapts
- No increase in reminder frequency (MVP)

---

### Deactivation

Ends when:
- User logs activity on any day (Partial or Complete)

---

## Messaging Model

### Core Tone Rules

All messaging must be:

- Supportive
- Forward-focused
- Non-judgmental
- Action-oriented
- Brief

---

### Messaging by State

#### On Track
- Minimal messaging
- Reinforcement after completion

Examples:
- “Nice work today”
- “You showed up”

---

#### At Risk (1–2 missed days)
- Light nudge
- No pressure

Examples:
- “Want to log today?”
- “Quick check-in”

---

#### Off Track (3+ missed days)
- Re-engagement tone
- Reduce resistance to return

Examples:
- “Let’s pick back up today”
- “You can continue anytime”
- “Jump back in where you are”

---

### Prohibited Messaging

Do NOT use:

- “It’s normal to miss days”
- “No worries if you skip”
- Shame-based language
- Aggressive motivation

---

## Reminder Interaction

This module interacts with Module 80:

### Standard Mode
- Daily reminder if not complete

### Re-engagement Mode
- Same frequency
- Adjusted tone only

---

### Suppression Rules

Reminders should still respect:

- Day complete → no reminder
- User disabled reminders → no reminder

---

## UX Implications

The system should:

- Never force a restart flow
- Avoid “failure screens”
- Make returning effortless
- Minimize friction after inactivity

When user returns:

- Drop them directly into logging
- Provide optional light welcome message

Example:
- “Welcome back. Let’s keep going.”

---

## Data & State Implications

The system should support:

- tracking consecutive missed days
- identifying current engagement state
- exposing state to:
  - UI
  - reminder system
  - diagnostics

Suggested derived fields:

- `engagementState`
- `consecutiveMissedDays`
- `isOffTrack`

---

## Relationship to Other Modules

### Module 40 (Daily Logging)
- Defines day state
- Drives missed-day detection

### Module 70 (Progress)
- Reflects gaps via consistency score
- No special adjustment for Off Track

### Module 80 (Reminders)
- Uses Off Track state for tone adjustment

### Module 140 (State Machines)
- Provides deterministic day-state classification
- This module builds higher-level behavior on top

---

## Strategic Principle

The system should treat disengagement as:

- expected
- recoverable
- not permanent

The system must make it easy to:

- stop
- return
- continue

The guiding rule is:

Never punish a gap.  
Always reduce friction to return.  
Always move forward.

