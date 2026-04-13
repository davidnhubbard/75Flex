import Link from "next/link";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import TrackedDetailClient from "./tracked-detail-client";

type TrackedDetailPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TrackedDetailPage({ searchParams }: TrackedDetailPageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const rawId = resolvedParams.id;
  const id = Array.isArray(rawId) ? rawId[0] ?? "" : rawId ?? "";

  const rawDay = resolvedParams.day;
  const day = Array.isArray(rawDay) ? rawDay[0] ?? "" : rawDay ?? "";
  const backHref = day ? `/today?day=${day}` : "/today";

  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={styles.header}>
          <Link className={shared.iconButton} href={backHref} aria-label="Go back">
            &lt;
          </Link>
          <div className={styles.headTitle}>Daily Commitment</div>
          <div className={styles.spacer} />
        </header>

        <TrackedDetailClient id={id} dayKey={day} />
      </section>
    </main>
  );
}
