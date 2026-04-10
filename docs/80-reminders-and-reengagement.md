## Reminder System Model (MVP)

### Purpose

This section defines how reminders function in the MVP.

It establishes:
- Default reminder behavior
- User control over reminders
- Timing and delivery expectations
- Guardrails to prevent annoyance or overuse

---

### Core Principle

Reminders should help users stay consistent without becoming intrusive.

They must:
- Support daily engagement
- Be easy to control
- Avoid feeling like pressure or spam

---

### Default Behavior

Reminders are **enabled by default**.

Each new user receives:

- One daily reminder
- Scheduled in the evening (default window: 7:00 PM – 9:00 PM local time)

Primary purpose:
- Prompt the user to log their day if they have not already done so

---

### Reminder Intent

The default reminder should feel like:

- A gentle check-in
- A prompt to take action if needed

Example tone:
- “Did you log today?”
- “Quick check-in—want to log your day?”

---

### Trigger Conditions

The daily reminder should:

- Trigger only if the user has not completed logging for the current day
- Be suppressed if the day is already marked Complete

Optional MVP behavior:
- Still trigger if the day is Partial, depending on final tuning

---

### Delivery Channel (MVP)

For MVP, reminders should be delivered via:

- Push notifications (primary)

Other channels (email, SMS, messaging apps) are out of scope for MVP but may be added later.

---

### User Controls

Users must be able to:

- Turn reminders on or off
- Adjust the time of day
- Modify reminder preferences easily

Controls should be:

- Simple
- Accessible
- Not buried in deep settings

---

### Frequency Constraints

The system must enforce:

- Maximum of one default reminder per day (MVP)
- No repeated reminders within the same day

This prevents:
- Notification fatigue
- User frustration

---

### Timezone Handling

Reminder timing must follow the user’s local timezone.

If the user travels:
- Reminder timing adjusts automatically
- No manual update required

---

### Interaction Behavior

When a user taps a reminder:

- They should be taken directly into the daily logging screen
- The system should minimize friction to take action immediately

---

### Suppression Rules

The system should not send reminders when:

- The user has already completed all commitments for the day
- The user has disabled reminders
- The system detects recent meaningful interaction (optional future refinement)

---

### UX Implications

Reminders should:

- Feel helpful, not intrusive
- Be easy to understand
- Reinforce the habit loop without pressure

---

### Strategic Principle

Reminders exist to prevent forgetting, not to enforce behavior.

They should feel like a quiet nudge:

“You might want to check in”

Not:

“You failed to do your task”

## Re-engagement & Return Prompt Model

### Purpose

This section defines how the system responds when users miss one or more days.

It establishes:
- When the system shifts from standard reminders to re-engagement mode
- How messaging adapts based on inactivity
- How the system encourages return without lowering expectations or applying pressure

---

### Core Principle

Re-engagement should acknowledge reality without encouraging disengagement.

The system must:
- Recognize that gaps happen
- Encourage return quickly
- Maintain a forward-moving mindset
- Avoid normalizing absence as acceptable behavior

---

### Trigger Thresholds

The system should respond differently based on consecutive missed days:

#### 1 Missed Day
- Continue standard daily reminder behavior
- No special messaging required

---

#### 2 Missed Days
- Slight shift in tone toward re-engagement
- Messaging becomes more invitational

Example tone:
- “Want to pick back up today?”
- “You can jump back in anytime”

---

#### 3 or More Missed Days
- Full re-engagement mode is activated
- Messaging explicitly encourages return without judgment

This aligns with the Off Track concept defined in Module 50.

---

### Messaging Tone Guidelines

Messaging must:

- Acknowledge that life happens
- Reinforce that returning is easy and immediate
- Avoid suggesting that missing days is desirable or expected

Preferred phrasing examples:

- “Life happens—let’s pick back up today”
- “You can continue anytime”
- “Jump back in where you are”

Avoid:

- “It’s normal to miss days”
- “No worries if you skip”
- Anything that implies disengagement is acceptable long-term behavior

---

### Behavioral Intent

Re-engagement messaging should:

- Lower the friction to return
- Remove emotional resistance
- Encourage immediate action

It should not:
- Excuse extended inactivity
- Reduce the perceived importance of consistency

---

### Reminder Behavior in Re-engagement Mode

During re-engagement:

- The system continues daily reminders
- Messaging tone is adjusted (not frequency)
- No additional reminders are added (MVP)

This avoids:
- Notification fatigue
- Perceived pressure

---

### In-App Return Experience

When a user returns after missed days:

- The app should greet them with supportive, forward-focused messaging
- The system should make it easy to log immediately
- The experience should align with the “Return Experience” defined in Module 50

Example:
- “Welcome back. Let’s keep going.”

---

### Strategic Principle

Re-engagement is about reducing resistance to restarting.

The system must communicate:

- You are not starting over
- You have not failed
- You can continue right now

Without suggesting that:
- Missing days is part of the goal
- Consistency is optional

The balance is:

Acknowledge reality. Reinforce action.

