"use client";

import Link from "next/link";
import { useMemo } from "react";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import { getCommitmentById } from "../../lib/commitment-storage";

type CommitmentDetailClientProps = {
  id: string;
};

export default function CommitmentDetailClient({ id }: CommitmentDetailClientProps) {
  const commitment = useMemo(() => getCommitmentById(id), [id]);

  if (!commitment) {
    return (
      <>
        <section className={`${shared.scrollContent} ${styles.content}`}>
          <h1 className={styles.title}>Commitment not found</h1>
          <p className={styles.subtitle}>This item may have been removed.</p>
        </section>
        <footer className={shared.footer}>
          <Link className={`${shared.btn} ${shared.btnPrimary} ${styles.btn}`} href="/build-plan">
            Back to Plan
          </Link>
        </footer>
      </>
    );
  }

  return (
    <>
      <section className={`${shared.scrollContent} ${styles.content}`}>
        <div>
          <h1 className={styles.title}>{commitment.name}</h1>
          <p className={styles.subtitle}>{commitment.detail || "No detail added yet"}</p>
        </div>

        <article className={styles.block}>
          <h2>Summary</h2>
          <p>This commitment is active in your plan and ready for daily logging.</p>
        </article>

        <article className={styles.block}>
          <h2>Created</h2>
          <p>{new Date(commitment.createdAt).toLocaleString()}</p>
        </article>
      </section>

      <footer className={shared.footer}>
        <Link className={`${shared.btn} ${shared.btnPrimary} ${styles.btn}`} href={`/edit-commitment?id=${commitment.id}`}>
          Edit Commitment
        </Link>
        <Link className={`${shared.btn} ${styles.btnSecondary} ${styles.btn}`} href="/build-plan">
          Back to Plan
        </Link>
      </footer>
    </>
  );
}
