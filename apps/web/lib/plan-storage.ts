import { CategoryKey, categories, defaultSelections } from "./plan-config";

const STORAGE_KEY = "planSelectionsV1";

export type PlanSelections = Record<CategoryKey, number>;

export function sanitizeSelections(input: unknown): PlanSelections {
  const safe: PlanSelections = { ...defaultSelections };
  if (!input || typeof input !== "object") {
    return safe;
  }

  for (const category of categories) {
    const rawValue = (input as Record<string, unknown>)[category.key];
    const parsed = Number(rawValue);
    if (Number.isInteger(parsed) && parsed >= 0 && parsed < category.presets.length) {
      safe[category.key] = parsed;
    }
  }

  return safe;
}

export function loadPlanSelections(): PlanSelections {
  if (typeof window === "undefined") {
    return { ...defaultSelections };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...defaultSelections };
    }
    return sanitizeSelections(JSON.parse(raw));
  } catch {
    return { ...defaultSelections };
  }
}

export function savePlanSelections(selections: PlanSelections): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeSelections(selections)));
  } catch {
    // Best effort persistence only.
  }
}

