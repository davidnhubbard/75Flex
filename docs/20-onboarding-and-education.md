
## Onboarding & Education System

### Purpose

This section defines how users are introduced to 75 Flex and how they learn to use it correctly.

It establishes:
- how users enter the product
- how the system is explained
- how key concepts are taught
- how misunderstanding is prevented
- how education continues after onboarding

This module ensures users:
- understand how the system works
- use it correctly from the start
- do not misinterpret progress or behavior

---

## Core Principle

Onboarding should be:

- fast
- clear
- behavior-focused
- just enough to prevent misuse

The goal is not to explain everything.

The goal is to ensure:
> users do not misunderstand the system in ways that break their experience

---

## Primary Risk to Prevent

Users will assume:

- this is a streak app
- missing a day = failure
- partial effort doesn’t count
- they should quit if they fall behind

These assumptions must be corrected early.

---

## Onboarding Entry Point

### First Screen Options

Users should be given a simple choice:

1. **Start My Plan**
2. **How This Works**

---

### Rule

- Do not force education before action
- Do not block entry with long explanations
- Make learning optional but accessible

---

## Education Path (“How This Works”)

This is a short, structured explanation of the system.

### Goal

Correct mental model in under ~60 seconds.

---

### Core Concepts to Teach

#### 1. No Reset System

- You do not start over if you miss a day
- Progress is never erased

---

#### 2. Three Day Types

Explain clearly:

- **Complete** → you did everything  
- **Partial** → you did something  
- **Missed** → you did nothing  

Important:
Partial still counts.

---

#### 3. Consistency Over Perfection

- This is about showing up regularly
- Not about being perfect every day

---

#### 4. Recovery is Built In

- Missing days happens
- You simply continue

---

### Tone

- calm
- confident
- simple
- not motivational hype

---

## Plan Creation Entry

After choosing “Start My Plan”:

User enters the plan creation flow (Module 30).

---

### Key Onboarding Rule

Users must not create a plan without understanding:

- what a commitment is
- what “done” means
- that partial completion exists

---

## Inline Education During Plan Creation

Education should appear where needed, not all upfront.

### Examples

When adding commitments:

- “Keep this realistic — consistency matters more than intensity”

When setting targets:

- “You can adjust this later”

When adding too many commitments:

- “More commitments = harder to stay consistent”

---

## First-Time Daily Logging Experience

When the user first lands on the daily screen:

Provide minimal guidance.

### Examples

- “Log what you’ve done today”
- “You can add entries or mark complete”
- “Partial progress still counts”

---

### Important Rule

Do not:
- overwhelm with instructions
- show tooltips everywhere
- interrupt flow unnecessarily

---

## Progressive Education

Education should continue over time.

Not everything is taught on Day 1.

---

### Examples

After first partial day:

- “Partial days still build consistency”

After missed days:

- handled by Module 50 (Off-Track)

After streak of activity:

- reinforce consistency concept

---

## Re-Entry Education

If a user returns after inactivity:

Provide a light reminder of system rules.

Example:

- “No restart needed. Just continue from today.”

---

## Anti-Patterns to Avoid

Do NOT:

- require long onboarding flows
- explain every feature up front
- use heavy gamification language
- rely on streak psychology
- punish or shame missed days
- normalize inactivity (“it’s fine to skip” tone)

---

## Minimal Onboarding Flow (Recommended MVP)

1. Entry screen:
   - Start My Plan
   - How This Works

---

## 2026-04-12 Additional MVP Requirements (Captured)

These requirements are now explicitly in scope to avoid loss during implementation.

### 1. 75 Hard Reference Education Route

Onboarding must include a dedicated route that explains:
- what classic 75 Hard is
- why it is difficult for many users
- how 75 Flex adapts the structure without losing intent

This route should be reachable from onboarding entry and should include a clear CTA back into plan setup.

---

### 2. Commitment Guardrails for UI Integrity

Plan creation should guide users toward supported commitment categories and avoid arbitrary task definitions that break product consistency.

Preferred commitment domains for MVP:
- reading
- workouts
- hydration
- nutrition
- progress photo

Use scaled targets and template ranges where possible.

---

### 3. Progress Photo Capability

MVP must support a daily progress-photo commitment path.

At minimum:
- user can mark/upload daily photo evidence
- photo commitment can be tracked as part of day completion logic

---

### 4. Calendar Progress Surface

MVP should include a calendar-oriented progress view so users can understand day-by-day status visually.

At minimum:
- monthly view of day states
- clear distinction between complete/partial/missed days
- integration with existing progress logic

---

## 2026-04-12 Additional Future Requirements (Non-MVP, Captured)

These items are captured to preserve product direction and should be evaluated after core MVP stabilization unless explicitly promoted.

### 1. Baseline Body Metrics (Optional)

Support optional baseline body metrics at plan start, including:
- starting weight
- optional circumference measurements (for example: arms, chest, waist/stomach, thighs, legs)

Important:
- these metrics should be optional, not required for plan activation
- users may decline and still use the product normally

---

### 2. Baseline Progress Photo Set (Optional)

Support an optional baseline photo set at challenge start rather than only a single image.

Potential examples:
- front
- side
- back

This is intended to improve beginning-to-end progress visibility.

---

### 3. Later Entry Policy (Open Product Decision)

Capture open product decision:
- whether baseline metrics/photos can be added later after challenge start

Current concern to resolve later:
- allowing late entry may weaken self-accountability for some users

This remains a product policy decision and is not finalized in this module yet.

### Minimal Onboarding Flow (Continued)

2. Optional education (3-4 screens max)

3. Plan creation

4. First daily logging screen

That’s it.

---

## UX Principles

- action first, explanation second
- teach only what’s needed now
- reinforce concepts through use
- reduce friction at every step

---

## Relationship to Other Modules

### Module 30 (Plan Creation)
- primary onboarding action flow

### Module 40 (Daily Logging)
- first real interaction with system

### Module 50 (Off-Track)
- handles re-entry education

### Module 70 (Progress)
- reinforces concepts visually

---

## Strategic Principle

Users should feel:

- “I understand this quickly”
- “I can start immediately”
- “I don’t have to be perfect”
- “I can keep going even if I slip”

The guiding rule is:

Teach just enough to prevent confusion.  
Let the system teach the rest through use.

