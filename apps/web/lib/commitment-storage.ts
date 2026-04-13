export type Commitment = {
  id: string;
  name: string;
  detail: string;
  createdAt: string;
};

const STORAGE_KEY = "planCommitmentsV1";
export const MAX_COMMITMENTS = 4;

type MaybeObject = Record<string, unknown>;

function sanitizeCommitment(input: unknown): Commitment | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const source = input as MaybeObject;
  const id = String(source.id ?? "").trim();
  const name = String(source.name ?? "").trim();
  const detail = String(source.detail ?? "").trim();
  const createdAt = String(source.createdAt ?? "").trim();

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name: name.slice(0, 60),
    detail: detail.slice(0, 120),
    createdAt: createdAt || new Date(0).toISOString()
  };
}

function sanitizeCommitments(input: unknown): Commitment[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const safe = input
    .map(sanitizeCommitment)
    .filter((item): item is Commitment => item !== null)
    .slice(0, MAX_COMMITMENTS);

  const seen = new Set<string>();
  return safe.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

export function loadCommitments(): Commitment[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return sanitizeCommitments(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function saveCommitments(commitments: Commitment[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeCommitments(commitments)));
  } catch {
    // Best effort persistence.
  }
}

export function createCommitmentId(): string {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function addCommitment(input: { name: string; detail: string }):
  | { ok: true; value: Commitment }
  | { ok: false; reason: "name_required" | "limit_reached" } {
  const name = input.name.trim();
  const detail = input.detail.trim();

  if (!name) {
    return { ok: false, reason: "name_required" };
  }

  const existing = loadCommitments();
  if (existing.length >= MAX_COMMITMENTS) {
    return { ok: false, reason: "limit_reached" };
  }

  const commitment: Commitment = {
    id: createCommitmentId(),
    name: name.slice(0, 60),
    detail: detail.slice(0, 120),
    createdAt: new Date().toISOString()
  };

  saveCommitments([...existing, commitment]);
  return { ok: true, value: commitment };
}

export function getCommitmentById(id: string): Commitment | null {
  if (!id) {
    return null;
  }

  return loadCommitments().find((item) => item.id === id) ?? null;
}

export function updateCommitment(
  id: string,
  input: { name: string; detail: string }
): { ok: true } | { ok: false; reason: "not_found" | "name_required" } {
  const name = input.name.trim();
  const detail = input.detail.trim();

  if (!name) {
    return { ok: false, reason: "name_required" };
  }

  const list = loadCommitments();
  const index = list.findIndex((item) => item.id === id);

  if (index < 0) {
    return { ok: false, reason: "not_found" };
  }

  list[index] = {
    ...list[index],
    name: name.slice(0, 60),
    detail: detail.slice(0, 120)
  };

  saveCommitments(list);
  return { ok: true };
}

export function deleteCommitment(id: string): { ok: true } | { ok: false; reason: "not_found" } {
  const list = loadCommitments();
  const next = list.filter((item) => item.id !== id);

  if (next.length === list.length) {
    return { ok: false, reason: "not_found" };
  }

  saveCommitments(next);
  return { ok: true };
}
