import { describe, expect, it } from "vitest";

import {
  resolveLifecycleState,
  resolveMissedDayReconciliation,
  resolveStreakVisibility,
} from "./state-machine";

describe("resolveLifecycleState", () => {
  it("returns onboarding_incomplete when onboarding or plan is incomplete", () => {
    const result = resolveLifecycleState({
      onboardingComplete: false,
      hasPlan: false,
      completedDayCount: 0,
      hasStartedAnyDay: false,
      consecutiveMissedDays: 0,
    });

    expect(result.state).toBe("onboarding_incomplete");
    expect(result.landingScreen).toBe("onboarding_resume");
  });

  it("returns plan_created_not_started when plan exists and no completed days", () => {
    const result = resolveLifecycleState({
      onboardingComplete: true,
      hasPlan: true,
      completedDayCount: 0,
      hasStartedAnyDay: false,
      consecutiveMissedDays: 0,
    });

    expect(result.state).toBe("plan_created_not_started");
    expect(result.landingScreen).toBe("plan_ready_to_start");
  });

  it("soft-resets to plan_created_not_started when early day is missed before momentum", () => {
    const result = resolveLifecycleState({
      onboardingComplete: true,
      hasPlan: true,
      completedDayCount: 1,
      hasStartedAnyDay: true,
      consecutiveMissedDays: 1,
      momentumThreshold: 3,
    });

    expect(result.state).toBe("plan_created_not_started");
    expect(result.landingScreen).toBe("plan_ready_to_start");
  });

  it("returns active_in_progress when user has momentum and is not off-track", () => {
    const result = resolveLifecycleState({
      onboardingComplete: true,
      hasPlan: true,
      completedDayCount: 3,
      hasStartedAnyDay: true,
      consecutiveMissedDays: 1,
      momentumThreshold: 3,
      offTrackMissThreshold: 3,
    });

    expect(result.state).toBe("active_in_progress");
    expect(result.landingScreen).toBe("today");
  });

  it("returns active_off_track_after_progress when misses pass threshold after momentum", () => {
    const result = resolveLifecycleState({
      onboardingComplete: true,
      hasPlan: true,
      completedDayCount: 12,
      hasStartedAnyDay: true,
      consecutiveMissedDays: 4,
      momentumThreshold: 3,
      offTrackMissThreshold: 3,
    });

    expect(result.state).toBe("active_off_track_after_progress");
    expect(result.landingScreen).toBe("recovery_reentry");
  });
});

describe("resolveMissedDayReconciliation", () => {
  it("offers acknowledge + backfill when missed day is still in editable window", () => {
    const result = resolveMissedDayReconciliation({
      dayState: "Missed",
      dayDateLocal: "2026-04-11",
      nowDateLocal: "2026-04-12",
      editableWindowDays: 3,
    });

    expect(result.showReconciliationPrompt).toBe(true);
    expect(result.allowAcknowledgeMiss).toBe(true);
    expect(result.allowBackfill).toBe(true);
  });

  it("offers acknowledge only when missed day is locked", () => {
    const result = resolveMissedDayReconciliation({
      dayState: "Missed",
      dayDateLocal: "2026-04-08",
      nowDateLocal: "2026-04-12",
      editableWindowDays: 3,
    });

    expect(result.showReconciliationPrompt).toBe(true);
    expect(result.allowAcknowledgeMiss).toBe(true);
    expect(result.allowBackfill).toBe(false);
  });
});

describe("resolveStreakVisibility", () => {
  it("keeps active streak context when last completion is within six months", () => {
    const result = resolveStreakVisibility({
      nowDateLocal: "2026-05-15",
      lastCompletedDayLocal: "2026-01-20",
      visibilityMonths: 6,
    });

    expect(result.isFreshStart).toBe(false);
    expect(result.showRecentHistoryMonths).toBe(6);
  });

  it("forces fresh start when inactivity is longer than six months", () => {
    const result = resolveStreakVisibility({
      nowDateLocal: "2026-05-15",
      lastCompletedDayLocal: "2025-10-10",
      visibilityMonths: 6,
    });

    expect(result.isFreshStart).toBe(true);
    expect(result.showRecentHistoryMonths).toBe(6);
  });
});

