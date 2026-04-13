export type LifecycleState =
  | "onboarding_incomplete"
  | "plan_created_not_started"
  | "active_in_progress"
  | "active_off_track_after_progress";

export interface LifecycleResolverInput {
  onboardingComplete: boolean;
  hasPlan: boolean;
  completedDayCount: number;
  hasStartedAnyDay: boolean;
  consecutiveMissedDays: number;
  momentumThreshold?: number;
  offTrackMissThreshold?: number;
}

export interface LifecycleResolution {
  state: LifecycleState;
  landingScreen:
    | "onboarding_resume"
    | "plan_ready_to_start"
    | "today"
    | "recovery_reentry";
  reason: string;
}

export interface MissedDayReconciliationInput {
  dayState: "Complete" | "Partial" | "Missed";
  dayDateLocal: string;
  nowDateLocal: string;
  editableWindowDays?: number;
}

export interface MissedDayReconciliationResolution {
  showReconciliationPrompt: boolean;
  allowAcknowledgeMiss: boolean;
  allowBackfill: boolean;
  reason: string;
}

export interface StreakVisibilityInput {
  nowDateLocal: string;
  lastCompletedDayLocal: string | null;
  visibilityMonths?: number;
}

export interface StreakVisibilityResolution {
  showRecentHistoryMonths: number;
  isFreshStart: boolean;
  reason: string;
}

const DEFAULT_MOMENTUM_THRESHOLD = 3;
const DEFAULT_OFF_TRACK_MISS_THRESHOLD = 3;
const DEFAULT_EDITABLE_WINDOW_DAYS = 3;
const DEFAULT_STREAK_VISIBILITY_MONTHS = 6;

export function resolveLifecycleState(
  input: LifecycleResolverInput,
): LifecycleResolution {
  if (!input.onboardingComplete || !input.hasPlan) {
    return {
      state: "onboarding_incomplete",
      landingScreen: "onboarding_resume",
      reason: "Onboarding and plan creation are not fully complete.",
    };
  }

  if (input.completedDayCount <= 0) {
    return {
      state: "plan_created_not_started",
      landingScreen: "plan_ready_to_start",
      reason: "Plan exists but there are no completed days yet.",
    };
  }

  const momentumThreshold =
    input.momentumThreshold ?? DEFAULT_MOMENTUM_THRESHOLD;
  const offTrackMissThreshold =
    input.offTrackMissThreshold ?? DEFAULT_OFF_TRACK_MISS_THRESHOLD;
  const hasMomentum = input.completedDayCount >= momentumThreshold;

  if (
    input.hasStartedAnyDay &&
    !hasMomentum &&
    input.consecutiveMissedDays >= 1
  ) {
    return {
      state: "plan_created_not_started",
      landingScreen: "plan_ready_to_start",
      reason:
        "User missed early days before reaching momentum; apply soft restart.",
    };
  }

  if (hasMomentum && input.consecutiveMissedDays >= offTrackMissThreshold) {
    return {
      state: "active_off_track_after_progress",
      landingScreen: "recovery_reentry",
      reason:
        "User previously had momentum and is now off-track by miss threshold.",
    };
  }

  return {
    state: "active_in_progress",
    landingScreen: "today",
    reason: "User has started and is currently in active execution.",
  };
}

export function resolveMissedDayReconciliation(
  input: MissedDayReconciliationInput,
): MissedDayReconciliationResolution {
  if (input.dayState !== "Missed") {
    return {
      showReconciliationPrompt: false,
      allowAcknowledgeMiss: false,
      allowBackfill: false,
      reason: "Day is not missed; reconciliation prompt is not needed.",
    };
  }

  const editableWindowDays =
    input.editableWindowDays ?? DEFAULT_EDITABLE_WINDOW_DAYS;
  const now = parseLocalDate(input.nowDateLocal);
  const day = parseLocalDate(input.dayDateLocal);
  const ageInDays = diffCalendarDays(day, now);
  const isBackfillable = ageInDays >= 1 && ageInDays <= editableWindowDays - 1;

  return {
    showReconciliationPrompt: true,
    allowAcknowledgeMiss: true,
    allowBackfill: isBackfillable,
    reason: isBackfillable
      ? "Missed day is still in editable window; acknowledge or backfill."
      : "Missed day is locked; acknowledge only.",
  };
}

export function resolveStreakVisibility(
  input: StreakVisibilityInput,
): StreakVisibilityResolution {
  const visibilityMonths =
    input.visibilityMonths ?? DEFAULT_STREAK_VISIBILITY_MONTHS;

  if (!input.lastCompletedDayLocal) {
    return {
      showRecentHistoryMonths: visibilityMonths,
      isFreshStart: true,
      reason: "No completed day history found; treat as fresh start.",
    };
  }

  const now = parseLocalDate(input.nowDateLocal);
  const lastCompleted = parseLocalDate(input.lastCompletedDayLocal);
  const cutoffDate = subtractMonths(now, visibilityMonths);
  const isFreshStart = lastCompleted < cutoffDate;

  return {
    showRecentHistoryMonths: visibilityMonths,
    isFreshStart,
    reason: isFreshStart
      ? `Last completion is older than ${visibilityMonths} months.`
      : `Last completion is within ${visibilityMonths} months.`,
  };
}

function parseLocalDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new Error(`Invalid local date format: "${value}". Use YYYY-MM-DD.`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return new Date(Date.UTC(year, month - 1, day));
}

function diffCalendarDays(from: Date, to: Date): number {
  const DAY_MS = 24 * 60 * 60 * 1000;
  return Math.floor((to.getTime() - from.getTime()) / DAY_MS);
}

function subtractMonths(date: Date, months: number): Date {
  const copy = new Date(date.getTime());
  copy.setUTCMonth(copy.getUTCMonth() - months);
  return copy;
}

