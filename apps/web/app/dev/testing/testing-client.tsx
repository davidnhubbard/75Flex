"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import shared from "../../styles/primitives.module.css";
import styles from "./testing.module.css";
import {
  applySeedSnapshot,
  applySeedProfile,
  deleteSeedSnapshot,
  getLastAppliedSeedProfile,
  getSeedProfiles,
  getSeedSnapshots,
  resetSeedData,
  saveCurrentAsSnapshot,
  SeedSnapshot,
  SeedProfileId
} from "../../../lib/dev-seed-profiles";

const profiles = getSeedProfiles();
const profileTargets: Record<SeedProfileId, string> = {
  new_user_empty: "/onboarding?mode=entry",
  started_user_active: "/today",
  near_milestone_day_75: "/daily-complete",
  off_track_reentry: "/today",
  baseline_metrics_preview: "/review-plan"
};

export default function DevTestingClient() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("Ready");
  const [lastApplied, setLastApplied] = useState<SeedProfileId | null>(getLastAppliedSeedProfile());
  const [snapshots, setSnapshots] = useState<SeedSnapshot[]>(getSeedSnapshots());

  const snapshotSummary = useMemo(() => {
    if (snapshots.length === 0) {
      return "No saved snapshots yet.";
    }

    return `${snapshots.length} saved snapshot${snapshots.length === 1 ? "" : "s"}.`;
  }, [snapshots]);

  const applyProfile = (id: SeedProfileId) => {
    const data = applySeedProfile(id);
    setLastApplied(id);
    setStatus(
      `Applied ${id}: ${data.commitments.length} commitments, ${Object.keys(data.dayLogs).length} logged days.`
    );
  };

  const applyAndOpen = (id: SeedProfileId) => {
    applyProfile(id);
    router.push(profileTargets[id]);
  };

  const resetData = () => {
    resetSeedData();
    setLastApplied(null);
    setStatus("Reset all local data keys.");
  };

  const captureSnapshot = () => {
    const name = window.prompt("Snapshot name", `Snapshot ${new Date().toLocaleString()}`);
    if (name === null) {
      return;
    }

    const snapshot = saveCurrentAsSnapshot(name);
    setSnapshots(getSeedSnapshots());
    setStatus(
      `Saved snapshot "${snapshot.name}" with ${snapshot.commitmentCount} commitments and ${snapshot.loggedDayCount} logged days.`
    );
  };

  const applySnapshot = (id: string, openTarget = false) => {
    const data = applySeedSnapshot(id);
    if (!data) {
      setStatus("Snapshot not found.");
      setSnapshots(getSeedSnapshots());
      return;
    }

    setLastApplied(null);
    setStatus(
      `Applied snapshot: ${data.commitments.length} commitments, ${Object.keys(data.dayLogs).length} logged days.`
    );

    if (openTarget) {
      router.push("/today");
    }
  };

  const removeSnapshot = (id: string) => {
    deleteSeedSnapshot(id);
    setSnapshots(getSeedSnapshots());
    setStatus("Deleted snapshot.");
  };

  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={styles.header}>
          <Link className={shared.iconButton} href="/" aria-label="Back">
            &lt;
          </Link>
          <h1 className={shared.title}>Dataset Studio</h1>
          <p className={shared.subtitle}>Curated seed profiles plus reusable local snapshots.</p>
        </header>

        <section className={`${shared.scrollContent} ${styles.content}`}>
          <div className={styles.statusBox}>
            <p className={styles.statusTitle}>Status</p>
            <p className={styles.statusText}>{status}</p>
            <p className={styles.statusSub}>Last applied: {lastApplied ?? "none"}</p>
          </div>

          <div className={styles.sectionHead}>
            <h2>Curated Profiles</h2>
            <p>Fast scenario switching for QA flow checks.</p>
          </div>

          <div className={styles.profileList}>
            {profiles.map((profile) => (
              <article key={profile.id} className={styles.card}>
                <h2>{profile.name}</h2>
                <p>{profile.description}</p>
                <button
                  type="button"
                  className={`${shared.btn} ${shared.btnPrimary} ${styles.applyBtn}`}
                  onClick={() => applyProfile(profile.id)}
                >
                  Apply {profile.id}
                </button>
                <button
                  type="button"
                  className={`${shared.btn} ${styles.openBtn}`}
                  onClick={() => applyAndOpen(profile.id)}
                >
                  Apply + Open Target
                </button>
              </article>
            ))}
          </div>

          <div className={styles.sectionHead}>
            <h2>Snapshot Library</h2>
            <p>{snapshotSummary}</p>
          </div>

          <div className={styles.snapshotActions}>
            <button type="button" className={`${shared.btn} ${shared.btnPrimary}`} onClick={captureSnapshot}>
              Save Current As Snapshot
            </button>
          </div>

          {snapshots.length > 0 ? (
            <div className={styles.profileList}>
              {snapshots.map((snapshot) => (
                <article key={snapshot.id} className={styles.card}>
                  <h2>{snapshot.name}</h2>
                  <p>
                    {new Date(snapshot.createdAt).toLocaleString()} | {snapshot.commitmentCount} commitments |{" "}
                    {snapshot.loggedDayCount} logged days
                  </p>
                  <button
                    type="button"
                    className={`${shared.btn} ${shared.btnPrimary} ${styles.applyBtn}`}
                    onClick={() => applySnapshot(snapshot.id)}
                  >
                    Apply Snapshot
                  </button>
                  <button
                    type="button"
                    className={`${shared.btn} ${styles.openBtn}`}
                    onClick={() => applySnapshot(snapshot.id, true)}
                  >
                    Apply + Open Today
                  </button>
                  <button type="button" className={`${shared.btn} ${styles.deleteBtn}`} onClick={() => removeSnapshot(snapshot.id)}>
                    Delete Snapshot
                  </button>
                </article>
              ))}
            </div>
          ) : null}

          <button type="button" className={`${shared.btn} ${styles.resetBtn}`} onClick={resetData}>
            Reset All Local Data
          </button>

          <div className={styles.quickLinks}>
            <Link href="/today">Open Today</Link>
            <Link href="/review-plan">Open Review Plan</Link>
            <Link href="/build-plan">Open Build Plan</Link>
            <Link href="/daily-complete">Open Daily Summary</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
