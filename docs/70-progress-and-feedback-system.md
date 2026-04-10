## Core Progress Model & Consistency Measurement

### Purpose

This section defines how user progress is measured in 75 Flex.

It establishes:
- The primary metric of progress
- How daily behavior translates into meaningful feedback
- How the system reflects consistency over time
- The foundation for all progress views and analytics

---

### Core Principle

Progress in 75 Flex is measured by consistency, not perfection.

The system must reflect:
- How often the user shows up
- How consistently they engage with their plan
- Whether they are building a sustainable habit over time

The system must not overemphasize:
- Perfect completion
- Streaks as the sole measure of success

---

### Primary Metric: Consistency Score

The primary measure of progress is a **Consistency Score**.

This score reflects the user’s behavior across:
- Complete days
- Partial days
- Missed days

---

### Day State Contributions

Each day contributes to the overall consistency model:

- **Complete Day** → Strong positive signal
- **Partial Day** → Moderate positive signal
- **Missed Day** → Neutral or negative signal

The system must treat partial days as meaningful progress, not failure.

---

### Conceptual Model

Consistency is not binary.

It exists on a spectrum:
- Full adherence
- Partial adherence
- No engagement

The system must capture this spectrum in a way that is:
- Understandable
- Actionable
- Encouraging

---

### Score Behavior (Conceptual)

The Consistency Score should:

- Increase with regular engagement
- Reward both complete and partial days
- Reflect gaps in activity without being overly punitive
- Smooth out short-term fluctuations to show meaningful trends

The exact formula may evolve, but the principles must remain stable.

---

### Rolling Time Windows

The system should evaluate consistency over time windows such as:

- Last 7 days
- Last 14 days
- Last 30 days
- Entire plan duration

This allows users to:
- See short-term behavior
- Understand longer-term trends
- Recognize improvement over time

---

### Trend Awareness

The system should help users answer:

- “Am I showing up more often?”
- “Am I improving?”
- “Is my plan realistic for me?”

Consistency trends should be:
- Visible
- Easy to interpret
- Free of unnecessary complexity

---

### Avoiding Misleading Signals

The system must avoid:

- Treating missed days as catastrophic failure
- Ignoring partial progress
- Overemphasizing streaks as the only success metric
- Creating an all-or-nothing perception of progress

---

### UX Implications

The system should:

- Highlight consistency over perfection
- Show positive reinforcement for partial progress
- Make trends easy to understand at a glance
- Avoid overwhelming users with complex statistics

---

### Strategic Principle

The goal is not to show users how perfect they are.

The goal is to show users that:
- They are making progress
- Their effort matters
- Consistency builds results over time

The system must reinforce:
Progress is built by showing up, not by being perfect.

## Consistency Score Calculation Model (MVP)

### Purpose

This section defines how the Consistency Score is calculated in the MVP.

It translates the conceptual progress model into a concrete, consistent, and system-wide calculation.

---

### Core Principle

The Consistency Score is a weighted measure of daily engagement over a defined time window.

It reflects:
- How often the user shows up
- How fully they complete their plan
- Their overall consistency over time

---

### Day Weights

Each day state contributes to the score using fixed weights:

- **Complete Day** = 1.0
- **Partial Day** = 0.5
- **Missed Day** = 0.0

These weights must be applied consistently across the system.

---

### Calculation Formula

For a given time window:

Consistency Score =  
(Sum of Day Weights) / (Number of Days in Window)

---

### Example Calculation

Over a 7-day period:

- 3 Complete Days → 3 × 1.0 = 3.0  
- 2 Partial Days → 2 × 0.5 = 1.0  
- 2 Missed Days → 2 × 0.0 = 0.0  

Total = 4.0  

Consistency Score = 4.0 / 7 = **0.57 (57%)**

---

### Output Format

The score should be displayed as:

- A percentage (e.g., 57%)
- Optionally supported by raw counts:
  - “4 out of 7 days of meaningful activity”

---

### Time Windows

The system must support calculating the Consistency Score for:

- Last 7 days
- Last 14 days
- Last 30 days
- Entire plan duration

Each window must use the same weighting model.

---

### Treatment of Missing Day Records

If no day record exists for a day:

- It is treated as a **Missed Day**
- Weight = 0.0

This aligns with the lazy creation model and ensures consistent scoring.

---

### Rounding Behavior

For display purposes:

- Scores should be rounded to a user-friendly percentage
- Avoid excessive precision (e.g., 57% instead of 57.14%)

---

### Interpretation Guidance

The system should help users understand the score as:

- A reflection of consistency, not perfection
- A trend indicator, not a grade
- A signal of engagement over time

---

### UX Implications

The system should:

- Present the score in a supportive, non-judgmental way
- Pair the score with encouraging language
- Avoid framing the score as pass/fail

Examples:
- “You showed up 57% of the time this week”
- “You’re building consistency”

---

### Strategic Principle

The Consistency Score should motivate continued engagement, not discourage it.

It must:
- Reward effort
- Recognize partial progress
- Encourage users to keep going

Even imperfect consistency is meaningful progress.

## Progress Visualization Model (Heatmap & Summary Views)

### Purpose

This section defines how user progress is visually represented.

It establishes:
- The primary visual model for consistency
- How day states are displayed over time
- How users quickly interpret their behavior
- Supporting summary views for context

---

### Core Principle

Progress should be understandable at a glance.

Users should be able to:
- See patterns immediately
- Recognize consistency or gaps
- Understand their behavior without needing to interpret complex charts

---

### Primary Visualization: Heatmap

The primary visual representation of progress is a **calendar-style heatmap**.

Each day is represented as a single cell.

---

### Day State Representation

Each day must be visually encoded based on its state:

- **Complete Day**
  - Strong, saturated color
  - Represents full adherence

- **Partial Day**
  - Lighter or muted version of the same color
  - Represents meaningful but incomplete effort

- **Missed Day**
  - No color or very faint neutral tone
  - Represents no engagement

---

### Color Principles

The color system should:

- Use a single color family for consistency
- Vary intensity to reflect level of completion
- Avoid harsh or negative colors (e.g., bright red for missed days)
- Reinforce encouragement rather than punishment

---

### Time Orientation

The heatmap should support:

- Rolling windows (e.g., last 30 days)
- Calendar-aligned views (optional future enhancement)

The MVP should prioritize a rolling window for simplicity.

---

### Interaction Behavior

Users should be able to:

- Tap or click on a day
- View details for that day
- Navigate to that day’s logging screen (if within editable window)

---

### Summary Metrics

The heatmap should be supported by simple summary metrics:

- Consistency Score (primary)
- Number of Complete Days
- Number of Partial Days
- Number of Missed Days

These should be displayed in a clear, concise format.

---

### Supporting Text

The system should provide light interpretive guidance, such as:

- “You showed up consistently this week”
- “You’re building a strong habit”
- “There were a few gaps—keep going”

This should remain supportive and non-judgmental.

---

### Avoiding Complexity

The MVP must avoid:

- Dense chart dashboards
- Multiple competing visualizations
- Overly technical analytics
- Confusing legends or scales

The goal is clarity, not depth.

---

### UX Implications

The progress view should:

- Load quickly
- Be visually clean
- Be understandable without explanation
- Encourage users to return and check their progress

---

### Strategic Principle

Users should feel progress, not analyze it.

The visualization should make it obvious:

- When they are consistent
- When they are improving
- When they need to re-engage

Without requiring effort to understand it.

## Feedback & Reinforcement Messaging Model (Contextual)

### Purpose

This section defines how the system provides feedback and reinforcement to users based on their behavior.

It establishes:
- When feedback should appear
- What types of feedback are appropriate
- How messaging aligns with product philosophy
- How to encourage consistency without pressure or judgment

---

### Core Principle

Feedback should support the user, not judge them.

The system must:
- Encourage continued engagement
- Reinforce positive behavior
- Normalize imperfect consistency
- Avoid pressure, guilt, or shame

---

### Feedback Model

The system uses **contextual feedback**, meaning:

- Messages are triggered by user behavior
- Feedback is situational, not constant
- Messages appear at meaningful moments

---

### Key Feedback Moments

The system should provide feedback in situations such as:

#### 1. Completing a Day
- When all commitments are completed
- Example:
  - “Nice work today”
  - “You showed up fully today”

---

#### 2. Partial Progress
- When a user logs some but not all commitments
- Example:
  - “You made progress today”
  - “Showing up counts”

---

#### 3. Returning After a Gap
- When a user logs activity after being off track
- Example:
  - “Welcome back”
  - “You’re back on track”

---

#### 4. Consistency Trends
- When consistency improves over time
- Example:
  - “You’ve been more consistent this week”
  - “You’re building momentum”

---

#### 5. Light Nudge After Inactivity (non-push context)
- When user opens the app after missed days
- Example:
  - “Let’s pick up where you are”
  - “You can continue anytime”

---

### Tone Guidelines

All feedback must be:

- Supportive
- Neutral to positive
- Non-judgmental
- Short and clear
- Free of hype or exaggeration

Avoid:
- Aggressive motivation (“No excuses”)
- Shame-based language
- Overly enthusiastic or cheesy phrasing

---

### Frequency Control

The system must avoid over-messaging.

Guidelines:

- Do not show messages after every action
- Prioritize meaningful moments
- Avoid repetition of the same message too frequently

The goal is subtle reinforcement, not noise.

---

### Personalization (Future Consideration)

Future versions may include:

- Adaptive messaging based on user behavior
- Tone adjustments based on user preference
- Pattern recognition (e.g., frequent drop-offs)

This is not required for MVP but should be supported by the model.

---

### UX Placement

Feedback should appear:

- Inline within the app (e.g., near progress or completion states)
- As lightweight overlays or banners when appropriate

It should not:

- Interrupt core actions
- Block logging
- Require dismissal unless necessary

---

### Strategic Principle

Feedback should feel like a quiet, supportive voice.

It should reinforce:

- Effort matters
- Progress is happening
- Returning is normal

The system must help users continue, not pressure them to perform.

