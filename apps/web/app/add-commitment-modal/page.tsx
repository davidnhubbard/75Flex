"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import { addCommitment, loadCommitments, MAX_COMMITMENTS } from "../../lib/commitment-storage";

export default function AddCommitmentModalPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");

  const currentCount = useMemo(() => loadCommitments().length, []);

  const onSave = () => {
    const result = addCommitment({ name, detail });

    if (!result.ok) {
      if (result.reason === "limit_reached") {
        router.push("/commitment-limit?from=add-commitment-modal");
        return;
      }

      setError("Commitment name is required.");
      return;
    }

    router.push(`/commitment-detail?id=${result.value.id}`);
  };

  return (
    <main className={`${shared.appShell} ${styles.shell}`}>
      <section className={shared.phone}>
        <div className={styles.mockBg}>
          <h1 className={styles.mockTitle}>Build Your Plan</h1>
          <p className={styles.mockSub}>Add a few daily commitments to get started.</p>
        </div>

        <div className={styles.overlay}>
          <div className={styles.sheet}>
            <div className={styles.handleWrap}>
              <div className={styles.handle} />
            </div>

            <header className={styles.sheetHeader}>
              <h2 className={styles.sheetTitle}>Add Commitment</h2>
              <Link className={shared.iconButton} href="/build-plan" aria-label="Close">
                &times;
              </Link>
            </header>

            <section className={styles.sheetBody}>
              <div className={styles.countLine}>
                {currentCount} of {MAX_COMMITMENTS} commitments used
              </div>

              <div className={styles.group}>
                <label className={styles.label} htmlFor="name">
                  Commitment Name
                </label>
                <input
                  id="name"
                  className={styles.input}
                  placeholder="e.g., Workout, Drink Water, Read"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  maxLength={60}
                />
              </div>

              <div className={styles.group}>
                <label className={styles.label} htmlFor="detail">
                  Detail <span className={styles.optional}>(Optional)</span>
                </label>
                <input
                  id="detail"
                  className={styles.input}
                  placeholder="e.g., 30 minutes, 8 glasses, 10 pages"
                  value={detail}
                  onChange={(event) => setDetail(event.target.value)}
                  maxLength={120}
                />
              </div>

              {error ? <p className={styles.error}>{error}</p> : null}

              <div className={styles.tip}>
                <span className={styles.tipTag}>Tip</span>
                <span>Keep it simple. You can adjust this later.</span>
              </div>

              <button className={`${shared.btn} ${shared.btnPrimary} ${styles.save}`} type="button" onClick={onSave}>
                Save
              </button>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
