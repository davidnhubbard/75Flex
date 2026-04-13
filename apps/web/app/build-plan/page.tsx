import Link from "next/link";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";
import BuildPlanClient from "./build-plan-client";

type BuildPlanPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const templateNames: Record<string, string> = {
  hard75: "75 Hard",
  soft75: "75 Soft",
  blankGuided: "Blank Guided"
};

export default async function BuildPlanPage({ searchParams }: BuildPlanPageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const templateRaw = resolvedParams.template;
  const templateId = Array.isArray(templateRaw) ? templateRaw[0] : templateRaw;
  const templateName = templateId ? templateNames[templateId] ?? "Custom" : "Custom";

  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={styles.header}>
          <Link className={shared.iconButton} href="/choose-template" aria-label="Go back">
            &lt;
          </Link>
          <h1 className={shared.title}>Build Your Plan</h1>
          <p className={shared.subtitle}>Add a few daily commitments to get started.</p>
        </header>

        <section className={`${shared.scrollContent} ${styles.content}`}>
          <div className={styles.templateTag}>Template: {templateName}</div>
          <BuildPlanClient />
        </section>
      </section>
    </main>
  );
}
