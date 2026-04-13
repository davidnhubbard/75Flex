export type CategoryKey = "reading" | "workouts" | "hydrationNutrition" | "progressTracking";

export type Preset = {
  label: string;
  detail: string;
  load: number;
};

export type CategoryDefinition = {
  key: CategoryKey;
  title: string;
  helper: string;
  presets: Preset[];
};

export const categories: CategoryDefinition[] = [
  {
    key: "reading",
    title: "Reading",
    helper: "Choose a daily reading target you can sustain.",
    presets: [
      { label: "10 minutes", detail: "Light consistency", load: 1 },
      { label: "20 minutes", detail: "Balanced default", load: 2 },
      { label: "30 minutes", detail: "Higher commitment", load: 3 }
    ]
  },
  {
    key: "workouts",
    title: "Workouts",
    helper: "Pick a structure that fits your schedule.",
    presets: [
      { label: "1 solid session", detail: "45 to 60 minutes", load: 2 },
      { label: "2 short sessions", detail: "Two 20 to 30 minute sessions", load: 3 },
      { label: "1 short session", detail: "20 to 30 minutes", load: 1 }
    ]
  },
  {
    key: "hydrationNutrition",
    title: "Hydration & Nutrition",
    helper: "Set goals that are challenging but repeatable.",
    presets: [
      { label: "Foundational", detail: "Basic water + nutrition rules", load: 1 },
      { label: "Standard", detail: "Moderate daily targets", load: 2 },
      { label: "Strict", detail: "Tighter rules and discipline", load: 3 }
    ]
  },
  {
    key: "progressTracking",
    title: "Progress Tracking",
    helper: "Decide how you want to track momentum daily.",
    presets: [
      { label: "Simple check-in", detail: "Complete / partial / missed", load: 1 },
      { label: "Check-in + notes", detail: "Daily reflection note", load: 2 },
      { label: "Check-in + photo", detail: "Photo + short note", load: 3 }
    ]
  }
];

export const defaultSelections: Record<CategoryKey, number> = {
  reading: 1,
  workouts: 0,
  hydrationNutrition: 1,
  progressTracking: 0
};

