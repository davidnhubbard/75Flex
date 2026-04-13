import { Commitment } from "./commitment-storage";

export type DayTaskState = "not-started" | "partial" | "complete";

export type LoggedTask = {
  status: DayTaskState;
  note: string;
};

const STORAGE_KEY = "dayLogsV1";

function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sanitizeStatus(value: unknown): DayTaskState {
  return value === "complete" || value === "partial" || value === "not-started"
    ? value
    : "not-started";
}

function loadAllLogs(): Record<string, Record<string, LoggedTask>> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, Record<string, { status?: unknown; note?: unknown }>>;
    const safe: Record<string, Record<string, LoggedTask>> = {};

    for (const [dayKey, dayTasks] of Object.entries(parsed ?? {})) {
      safe[dayKey] = {};
      for (const [taskId, taskValue] of Object.entries(dayTasks ?? {})) {
        safe[dayKey][taskId] = {
          status: sanitizeStatus(taskValue?.status),
          note: String(taskValue?.note ?? "").slice(0, 240)
        };
      }
    }

    return safe;
  } catch {
    return {};
  }
}

function saveAllLogs(allLogs: Record<string, Record<string, LoggedTask>>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));
  } catch {
    // Best effort persistence.
  }
}

export function getTodayKey(): string {
  return getLocalDateKey();
}

export function loadDayLogs(dayKey = getTodayKey()): Record<string, LoggedTask> {
  return loadAllLogs()[dayKey] ?? {};
}

export function getTaskStatus(taskId: string, dayKey = getTodayKey()): DayTaskState {
  return loadDayLogs(dayKey)[taskId]?.status ?? "not-started";
}

export function getTaskNote(taskId: string, dayKey = getTodayKey()): string {
  return loadDayLogs(dayKey)[taskId]?.note ?? "";
}

export function saveTaskLog(
  taskId: string,
  status: DayTaskState,
  note = "",
  dayKey = getTodayKey()
): void {
  const allLogs = loadAllLogs();
  const existingDay = allLogs[dayKey] ?? {};

  allLogs[dayKey] = {
    ...existingDay,
    [taskId]: {
      status,
      note: note.slice(0, 240)
    }
  };

  saveAllLogs(allLogs);
}

export function summarizeDay(commitments: Commitment[], dayKey = getTodayKey()): {
  total: number;
  complete: number;
  partial: number;
  percent: number;
} {
  const logs = loadDayLogs(dayKey);
  const total = commitments.length;
  const complete = commitments.filter((item) => logs[item.id]?.status === "complete").length;
  const partial = commitments.filter((item) => logs[item.id]?.status === "partial").length;

  const percent = total === 0 ? 0 : Math.round((complete / total) * 100);
  return { total, complete, partial, percent };
}
