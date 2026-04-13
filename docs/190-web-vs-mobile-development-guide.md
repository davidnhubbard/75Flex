## Web vs Mobile Development for 75Flex (Practical Guide)

Purpose:
This is a planning reference so we can make good sequencing decisions without over-committing too early.

## Short Version

What stays the same:
- Product behavior and rules
- State machine logic
- API contracts and data model
- Content and coaching copy
- Design tokens (colors, spacing, typography scale)

What changes:
- Screen implementation details
- Navigation framework
- Device features (camera, notifications, background behavior)
- Release process (app stores)

## Why We Are Building Web First

Web scaffolding gives us:
- Faster screen iteration
- Faster flow validation
- Faster requirement correction
- Lower cost of change before mobile implementation

This is expected and healthy, not throwaway work.

## Main Differences (No Drama Version)

1. UI Runtime
- Web: Next.js + HTML/CSS
- Mobile: React Native/Expo (or Swift/Kotlin)

2. Navigation
- Web: URL route model
- Mobile: stack/tab navigation model

3. Inputs and Interaction
- Web: keyboard + mouse + touch
- Mobile: touch-first, gestures, safe-area handling

4. Device Features
- Web: limited camera/background support
- Mobile: stronger native camera, local notifications, deeper background capabilities

5. Release Model
- Web: instant deploy updates
- Mobile: app store review + versioned rollouts

## Implementation Strategy We Should Follow

Phase 1: Finish flow and behavior in web scaffold
- Ensure page-to-page flow is complete
- Ensure state machine behavior is represented
- Ensure copy and requirements are captured

Phase 2: Stabilize shared contracts
- Freeze core API shapes
- Freeze core derived-state rules
- Freeze key design tokens

Phase 3: Build mobile client against stable contracts
- Recreate screens in mobile-native components
- Reuse business logic and rule interpretation
- Integrate camera/photo and notifications in mobile-native paths

Phase 4: Parallel hardening
- Validate parity of behavior (web vs mobile)
- Improve UX details and performance
- Prepare distribution path and QA for store release

## MVP Confidence Notes

This should not be interpreted as "double work."
This is a staged delivery model:
- Stage A reduces product risk quickly (web)
- Stage B reduces platform risk (mobile)

The result is usually faster and safer than jumping straight to full native implementation.

## Decision Gate Before Mobile Build

Before starting mobile implementation, confirm:
- Onboarding and re-entry flows are approved
- Plan creation flow is approved
- Daily logging and miss-day behavior are approved
- Progress/calendar surfaces are approved
- API and state-machine docs are internally consistent

If these are true, mobile build is straightforward and low-drama.
