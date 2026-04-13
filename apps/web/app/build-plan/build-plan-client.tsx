"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import { Commitment, loadCommitments, MAX_COMMITMENTS } from "../../lib/commitment-storage";

export default function BuildPlanClient() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);

  useEffect(() => {
    setCommitments(loadCommitments());
  }, []);

  const hasCommitments = commitments.length > 0;
  const canAddMore = commitments.length < MAX_COMMITMENTS;

  const addHref = useMemo(() => {
    if (canAddMore) {
      return "/add-commitment-modal";
    }
    return "/commitment-limit?from=build-plan";
  }, [canAddMore]);

  return (
    <>
      {hasCommitments ? (
        <section className={styles.list}>
          {commitments.map((item) => (
            <article key={item.id} className={styles.item}>
              <div>
                <h2>{item.name}</h2>
                <p>{item.detail || "No detail added yet"}</p>
              </div>
              <Link className={styles.itemLink} href={`/commitment-detail?id=${item.id}`}>
                View
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <div className={styles.empty}>No commitments yet. Add your first one.</div>
      )}

      <Link className={styles.addLarge} href={addHref}>
        <span className={styles.addIcon}>+</span>
        <span className={styles.addText}>Add Commitment</span>
      </Link>

      <div className={styles.countLine}>
        {commitments.length} of {MAX_COMMITMENTS} commitments used
      </div>

      <Link className={styles.inlineLink} href="/create-plan">
        Skip to preset-based plan builder
      </Link>

      <footer className={shared.footer}>
        <Link
          className={`${shared.btn} ${shared.btnPrimary} ${styles.btn} ${!hasCommitments ? styles.btnDisabled : ""}`}
          href={hasCommitments ? "/review-plan" : "/build-plan"}
          aria-disabled={!hasCommitments}
        >
          Continue
        </Link>
      </footer>
    </>
  );
}
