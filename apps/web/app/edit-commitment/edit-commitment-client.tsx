"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import { deleteCommitment, getCommitmentById, updateCommitment } from "../../lib/commitment-storage";

type EditCommitmentClientProps = {
  id: string;
};

export default function EditCommitmentClient({ id }: EditCommitmentClientProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const item = getCommitmentById(id);
    if (!item) {
      setNotFound(true);
      return;
    }

    setName(item.name);
    setDetail(item.detail);
  }, [id]);

  const onSave = () => {
    const result = updateCommitment(id, { name, detail });
    if (!result.ok) {
      setError(result.reason === "name_required" ? "Commitment name is required." : "Commitment not found.");
      return;
    }

    router.push(`/commitment-detail?id=${id}`);
  };

  const onDelete = () => {
    deleteCommitment(id);
    router.push("/build-plan");
  };

  if (notFound) {
    return (
      <section className={`${shared.scrollContent} ${styles.content}`}>
        <h1 className={shared.title}>Commitment not found</h1>
        <p className={shared.subtitle}>This item may have been removed already.</p>
      </section>
    );
  }

  return (
    <>
      <section className={`${shared.scrollContent} ${styles.content}`}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="name">
            Commitment Name
          </label>
          <input
            id="name"
            className={styles.input}
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
            Optional Detail
          </label>
          <input
            id="detail"
            className={styles.input}
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            maxLength={120}
          />
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}
      </section>

      <footer className={shared.footer}>
        <button className={`${shared.btn} ${shared.btnPrimary} ${styles.btn}`} type="button" onClick={onSave}>
          Save Changes
        </button>
        <button className={`${shared.btn} ${styles.destructive} ${styles.btn}`} type="button" onClick={onDelete}>
          Delete Commitment
        </button>
      </footer>
    </>
  );
}
