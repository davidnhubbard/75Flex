import { Commitment, saveCommitments } from "./commitment-storage";
import { DayTaskState, saveTaskLog } from "./daily-log-storage";
import { defaultSelections } from "./plan-config";
import { PlanSelections, savePlanSelections } from "./plan-storage";

export type SeedProfileId =
  | "new_user_empty"
  | "started_user_active"
  | "near_milestone_day_75"
  | "off_track_reentry"
  | "baseline_metrics_preview";

export type SeedProfile = {
  id: SeedProfileId;
  name: string;
  description: string;
};

type DayLogMap = Record<string, Record<string, { status: DayTaskState; note?: string }>>;

type SeedProfileData = {
  planSelections: PlanSelections;
  commitments: Commitment[];
  dayLogs: DayLogMap;
  meta?: Record<string, unknown>;
};

type StoredSeedSnapshot = {
  id: string;
  name: string;
  createdAt: string;
  data: SeedProfileData;
};

export type SeedSnapshot = {
  id: string;
  name: string;
  createdAt: string;
  commitmentCount: number;
  loggedDayCount: number;
};

const STORAGE_KEYS = {
  plan: "planSelectionsV1",
  commitments: "planCommitmentsV1",
  dayLogs: "dayLogsV1",
  meta: "seedProfileMetaV1",
  lastApplied: "seedProfileLastAppliedV1",
  snapshots: "seedProfileSnapshotsV1"
} as const;

const PROFILES: SeedProfile[] = [
  {
    id: "new_user_empty",
    name: "New User (Empty)",
    description: "No plan activity, no commitments, no day logs."
  },
  {
    id: "started_user_active",
    name: "Started User (Active)",
    description: "Plan created with early execution and mixed progress today."
  },
  {
    id: "near_milestone_day_75",
    name: "Near Day 75 Milestone",
    description: "Long history with completion momentum approaching final milestone."
  },
  {
    id: "off_track_reentry",
    name: "Off-Track Re-entry",
    description: "Recent misses after momentum to validate re-entry and recovery states."
  },
  {
    id: "baseline_metrics_preview",
    name: "Baseline Metrics Preview",
    description: "Future-data preview with optional baseline body metrics + photo set metadata."
  }
];

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDays(base: Date, offset: number): string {
  const copy = new Date(base);
  copy.setDate(copy.getDate() + offset);
  return toDateKey(copy);
}

function buildCommitments(
  entries: Array<{ id: string; name: string; detail: string }>,
  createdAt: string
): Commitment[] {
  return entries.map((entry) => ({ ...entry, createdAt }));
}

function profileData(id: SeedProfileId): SeedProfileData {
  const now = new Date();
  const createdAt = now.toISOString();
  const todayKey = toDateKey(now);

  if (id === "new_user_empty") {
    return {
      planSelections: { ...defaultSelections },
      commitments: [],
      dayLogs: {}
    };
  }

  if (id === "started_user_active") {
    const commitments = buildCommitments(
      [
        { id: "c_start_read", name: "Read", detail: "20 minutes" },
        { id: "c_start_workout", name: "Workout", detail: "One 45-minute session" },
        { id: "c_start_water", name: "Hydration", detail: "80 oz water" },
        { id: "c_start_photo", name: "Progress Photo", detail: "Daily check-in photo" }
      ],
      createdAt
    );

    return {
      planSelections: {
        reading: 1,
        workouts: 0,
        hydrationNutrition: 1,
        progressTracking: 2
      },
      commitments,
      dayLogs: {
        [todayKey]: {
          c_start_read: { status: "complete", note: "Finished before lunch." },
          c_start_workout: { status: "partial", note: "25 min done, more later." },
          c_start_water: { status: "partial", note: "Around half completed." },
          c_start_photo: { status: "not-started" }
        }
      }
    };
  }

  if (id === "near_milestone_day_75") {
    const commitments = buildCommitments(
      [
        { id: "c_75_read", name: "Read", detail: "30 minutes" },
        { id: "c_75_workout", name: "Workout", detail: "Two short sessions" },
        { id: "c_75_hydration", name: "Hydration", detail: "100 oz water" },
        { id: "c_75_tracking", name: "Progress Tracking", detail: "Photo + short note" }
      ],
      createdAt
    );

    const dayLogs: DayLogMap = {};

    for (let i = -74; i < 0; i += 1) {
      const dayKey = shiftDays(now, i);
      const status: DayTaskState = i > -5 ? "complete" : i % 9 === 0 ? "partial" : "complete";
      dayLogs[dayKey] = {
        c_75_read: { status },
        c_75_workout: { status },
        c_75_hydration: { status: i % 7 === 0 ? "partial" : status },
        c_75_tracking: { status }
      };
    }

    dayLogs[todayKey] = {
      c_75_read: { status: "complete", note: "Final stretch focus." },
      c_75_workout: { status: "partial", note: "Session one complete." },
      c_75_hydration: { status: "partial" },
      c_75_tracking: { status: "not-started" }
    };

    return {
      planSelections: {
        reading: 2,
        workouts: 1,
        hydrationNutrition: 2,
        progressTracking: 2
      },
      commitments,
      dayLogs,
      meta: {
        scenario: "near_day_75",
        expectedMilestoneDay: 75
      }
    };
  }

  if (id === "off_track_reentry") {
    const commitments = buildCommitments(
      [
        { id: "c_reentry_read", name: "Read", detail: "10 minutes" },
        { id: "c_reentry_walk", name: "Workout", detail: "30-minute walk" },
        { id: "c_reentry_water", name: "Hydration", detail: "64 oz water" }
      ],
      createdAt
    );

    const dayLogs: DayLogMap = {
      [shiftDays(now, -8)]: {
        c_reentry_read: { status: "complete" },
        c_reentry_walk: { status: "complete" },
        c_reentry_water: { status: "complete" }
      },
      [shiftDays(now, -7)]: {
        c_reentry_read: { status: "complete" },
        c_reentry_walk: { status: "partial" },
        c_reentry_water: { status: "complete" }
      },
      [shiftDays(now, -3)]: {
        c_reentry_read: { status: "not-started" },
        c_reentry_walk: { status: "not-started" },
        c_reentry_water: { status: "not-started" }
      },
      [shiftDays(now, -2)]: {
        c_reentry_read: { status: "not-started" },
        c_reentry_walk: { status: "not-started" },
        c_reentry_water: { status: "partial" }
      },
      [todayKey]: {
        c_reentry_read: { status: "partial", note: "Back at it today." },
        c_reentry_walk: { status: "not-started" },
        c_reentry_water: { status: "partial" }
      }
    };

    return {
      planSelections: {
        reading: 0,
        workouts: 2,
        hydrationNutrition: 0,
        progressTracking: 0
      },
      commitments,
      dayLogs,
      meta: {
        scenario: "off_track_reentry"
      }
    };
  }

  const commitments = buildCommitments(
    [
      { id: "c_base_read", name: "Read", detail: "20 minutes" },
      { id: "c_base_workout", name: "Workout", detail: "One 45-minute session" },
      { id: "c_base_photo", name: "Progress Photo", detail: "Front/side/back weekly set" }
    ],
    createdAt
  );

  return {
    planSelections: {
      reading: 1,
      workouts: 0,
      hydrationNutrition: 1,
      progressTracking: 2
    },
    commitments,
    dayLogs: {
      [todayKey]: {
        c_base_read: { status: "complete" },
        c_base_workout: { status: "partial" },
        c_base_photo: { status: "not-started" }
      }
    },
    meta: {
      scenario: "baseline_metrics_preview",
      baselineBodyMetrics: {
        weight: 212,
        measurements: {
          chest: 44,
          waist: 39,
          arm_left: 15,
          arm_right: 15.2,
          thigh_left: 24,
          thigh_right: 24.1
        }
      },
      baselinePhotoSet: ["front", "side", "back"]
    }
  };
}

function writeDayLogs(dayLogs: DayLogMap): void {
  for (const [dayKey, tasks] of Object.entries(dayLogs)) {
    for (const [taskId, task] of Object.entries(tasks)) {
      saveTaskLog(taskId, task.status, task.note ?? "", dayKey);
    }
  }
}

function parseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readCurrentSeedData(): SeedProfileData {
  if (typeof window === "undefined") {
    return {
      planSelections: { ...defaultSelections },
      commitments: [],
      dayLogs: {}
    };
  }

  const planSelections = parseJSON<PlanSelections>(
    window.localStorage.getItem(STORAGE_KEYS.plan),
    { ...defaultSelections }
  );

  const commitments = parseJSON<Commitment[]>(window.localStorage.getItem(STORAGE_KEYS.commitments), []);
  const dayLogs = parseJSON<DayLogMap>(window.localStorage.getItem(STORAGE_KEYS.dayLogs), {});
  const meta = parseJSON<Record<string, unknown> | null>(window.localStorage.getItem(STORAGE_KEYS.meta), null);

  return {
    planSelections,
    commitments,
    dayLogs,
    ...(meta ? { meta } : {})
  };
}

function readSnapshots(): StoredSeedSnapshot[] {
  if (typeof window === "undefined") {
    return [];
  }

  return parseJSON<StoredSeedSnapshot[]>(window.localStorage.getItem(STORAGE_KEYS.snapshots), []);
}

function writeSnapshots(snapshots: StoredSeedSnapshot[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.snapshots, JSON.stringify(snapshots));
}

export function getSeedProfiles(): SeedProfile[] {
  return PROFILES;
}

export function resetSeedData(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.plan);
  window.localStorage.removeItem(STORAGE_KEYS.commitments);
  window.localStorage.removeItem(STORAGE_KEYS.dayLogs);
  window.localStorage.removeItem(STORAGE_KEYS.meta);
  window.localStorage.removeItem(STORAGE_KEYS.lastApplied);
}

export function applySeedProfile(id: SeedProfileId): SeedProfileData {
  resetSeedData();

  const data = profileData(id);
  savePlanSelections(data.planSelections);
  saveCommitments(data.commitments);
  writeDayLogs(data.dayLogs);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEYS.lastApplied, id);
    if (data.meta) {
      window.localStorage.setItem(STORAGE_KEYS.meta, JSON.stringify(data.meta));
    }
  }

  return data;
}

export function getLastAppliedSeedProfile(): SeedProfileId | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(STORAGE_KEYS.lastApplied);
  return PROFILES.some((profile) => profile.id === value) ? (value as SeedProfileId) : null;
}

export function getSeedSnapshots(): SeedSnapshot[] {
  return readSnapshots().map((snapshot) => ({
    id: snapshot.id,
    name: snapshot.name,
    createdAt: snapshot.createdAt,
    commitmentCount: snapshot.data.commitments.length,
    loggedDayCount: Object.keys(snapshot.data.dayLogs).length
  }));
}

export function saveCurrentAsSnapshot(name: string): SeedSnapshot {
  const cleanName = name.trim() || "Untitled snapshot";
  const entry: StoredSeedSnapshot = {
    id: `snapshot_${Date.now()}`,
    name: cleanName,
    createdAt: new Date().toISOString(),
    data: readCurrentSeedData()
  };

  const current = readSnapshots();
  const next = [entry, ...current].slice(0, 25);
  writeSnapshots(next);

  return {
    id: entry.id,
    name: entry.name,
    createdAt: entry.createdAt,
    commitmentCount: entry.data.commitments.length,
    loggedDayCount: Object.keys(entry.data.dayLogs).length
  };
}

export function applySeedSnapshot(id: string): SeedProfileData | null {
  const match = readSnapshots().find((snapshot) => snapshot.id === id);
  if (!match) {
    return null;
  }

  resetSeedData();

  savePlanSelections(match.data.planSelections);
  saveCommitments(match.data.commitments);
  writeDayLogs(match.data.dayLogs);

  if (typeof window !== "undefined") {
    if (match.data.meta) {
      window.localStorage.setItem(STORAGE_KEYS.meta, JSON.stringify(match.data.meta));
    }
    window.localStorage.setItem(STORAGE_KEYS.lastApplied, `snapshot:${id}`);
  }

  return match.data;
}

export function deleteSeedSnapshot(id: string): void {
  const next = readSnapshots().filter((snapshot) => snapshot.id !== id);
  writeSnapshots(next);
}

export function getActiveDatasetLabel(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEYS.lastApplied);
  if (!raw) {
    return null;
  }

  if (raw.startsWith("snapshot:")) {
    const snapshotId = raw.slice("snapshot:".length);
    const snapshot = readSnapshots().find((item) => item.id === snapshotId);
    return snapshot ? `Snapshot: ${snapshot.name}` : "Snapshot";
  }

  const profile = PROFILES.find((item) => item.id === raw);
  return profile ? `Profile: ${profile.name}` : null;
}
