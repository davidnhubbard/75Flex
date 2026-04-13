import Link from "next/link";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import EditCommitmentClient from "./edit-commitment-client";

type EditCommitmentPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditCommitmentPage({ searchParams }: EditCommitmentPageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const rawId = resolvedParams.id;
  const id = Array.isArray(rawId) ? rawId[0] ?? "" : rawId ?? "";

  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={styles.header}>
          <Link className={shared.iconButton} href={`/commitment-detail?id=${id}`} aria-label="Go back">
            &lt;
          </Link>
          <div className={styles.title}>Edit Commitment</div>
          <div className={styles.spacer} />
        </header>

        <EditCommitmentClient id={id} />
      </section>
    </main>
  );
}
