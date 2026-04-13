"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";

type TemplateId = "hard75" | "soft75" | "blankGuided";

type Template = {
  id: TemplateId;
  short: string;
  name: string;
  desc: string;
  examples: string;
};

const templates: Template[] = [
  {
    id: "hard75",
    short: "75",
    name: "75 Hard",
    desc: "A strict baseline inspired by the original challenge structure.",
    examples: "Diet, workouts, hydration, reading, progress photo"
  },
  {
    id: "soft75",
    short: "S",
    name: "75 Soft",
    desc: "A lower-intensity starting point that is easier to sustain.",
    examples: "Scaled exercise, flexible nutrition, daily development"
  },
  {
    id: "blankGuided",
    short: "G",
    name: "Blank Guided",
    desc: "Start from a blank plan with guidance for core commitment categories.",
    examples: "Hydration, exercise, personal development suggestions"
  }
];

export default function ChooseTemplatePage() {
  const [selected, setSelected] = useState<TemplateId | null>(null);

  const continueHref = useMemo(() => {
    if (!selected) {
      return "/choose-template";
    }

    return `/build-plan?template=${selected}`;
  }, [selected]);

  return (
    <main className={shared.appShell}>
      <section className={shared.phone}>
        <header className={styles.header}>
          <Link className={shared.iconButton} href="/challenge-intro" aria-label="Go back">
            &lt;
          </Link>
          <h1 className={shared.title}>Choose a Template</h1>
          <p className={shared.subtitle}>Pick a starting point. You can customize it later.</p>
        </header>

        <section className={`${shared.scrollContent} ${styles.content}`}>
          {templates.map((template) => {
            const isSelected = selected === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelected(template.id)}
                className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
              >
                <div className={styles.icon}>{template.short}</div>
                <div className={styles.body}>
                  <h2 className={styles.name}>{template.name}</h2>
                  <p className={styles.desc}>{template.desc}</p>
                  <div className={styles.examples}>{template.examples}</div>
                </div>
                <div className={`${styles.radio} ${isSelected ? styles.radioSelected : ""}`} />
              </button>
            );
          })}
        </section>

        <footer className={shared.footer}>
          {selected ? (
            <Link className={`${shared.btn} ${shared.btnPrimary} ${styles.btn}`} href={continueHref}>
              Continue
            </Link>
          ) : (
            <button className={`${shared.btn} ${styles.btnDisabled} ${styles.btn}`} type="button" disabled>
              Continue
            </button>
          )}
        </footer>
      </section>
    </main>
  );
}
