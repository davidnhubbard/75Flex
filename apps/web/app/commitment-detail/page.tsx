import Link from "next/link";
import shared from "../styles/primitives.module.css";
import CommitmentDetailClient from "./commitment-detail-client";

type CommitmentDetailPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CommitmentDetailPage({ searchParams }: CommitmentDetailPageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const rawId = resolvedParams.id;
  const id = Array.isArray(rawId) ? rawId[0] ?? "" : rawId ?? "";

  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={shared.topBar}>
          <Link className={shared.iconButton} href="/build-plan" aria-label="Go back">
            &lt;
          </Link>
        </header>

        <CommitmentDetailClient id={id} />
      </section>
    </main>
  );
}
