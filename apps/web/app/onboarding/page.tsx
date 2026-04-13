"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import shared from "../styles/primitives.module.css";
import styles from "./page.module.css";

type Slide = {
  title: string;
  subhead?: string;
  body: string[];
  kind: "entry" | "comparison" | "flow" | "counts";
};

const entrySlide: Slide = {
  title: "75 Flex",
  subhead: "A flexible 75-day challenge for fitness, habits, and consistency.",
  body: [
    "Build your own 75-day challenge.",
    "Stay on track even when life gets busy."
  ],
  kind: "entry"
};

const educationSlides: Slide[] = [
  {
    title: "Like 75 Hard, but flexible",
    body: [
      "The popular 75 Hard challenge can be tough to stick to.",
      "Build a version that fits your real life."
    ],
    kind: "comparison"
  },
  {
    title: "Your 75-Day Challenge",
    body: [
      "Create a daily plan for fitness, habits, and routines.",
      "Track what you do each day and watch your consistency build."
    ],
    kind: "flow"
  },
  {
    title: "Every Day Counts",
    body: [
      "Track progress across the areas that matter most to you.",
      "Consistency beats perfection."
    ],
    kind: "counts"
  }
];

export default function OnboardingPage() {
  const [mode, setMode] = useState<"entry" | "education">("entry");
  const [index, setIndex] = useState(0);
  const slides = mode === "entry" ? [entrySlide] : educationSlides;
  const isLast = index === slides.length - 1;
  const current = slides[index];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    const stepParam = params.get("step");

    if (modeParam !== "education") {
      setMode("entry");
      setIndex(0);
      return;
    }

    const raw = Number(stepParam ?? "1");
    const parsed = Number.isFinite(raw) ? raw : 1;
    const clamped = Math.max(1, Math.min(educationSlides.length, parsed));

    setMode("education");
    setIndex(clamped - 1);
  }, []);

  const openHowItWorks = () => {
    setMode("education");
    setIndex(0);
  };

  const goBack = () => {
    if (mode === "entry") {
      return;
    }

    if (index > 0) {
      setIndex((v) => v - 1);
      return;
    }

    setMode("entry");
    setIndex(0);
  };

  const actions = useMemo(() => {
    if (mode === "entry") {
      return (
        <>
          <button className={`${shared.btn} ${shared.btnPrimary} ${styles.btnLift}`}>
            Start My Plan
          </button>
          <button
            className={`${shared.btn} ${shared.btnSecondary}`}
            onClick={openHowItWorks}
          >
            How This Works
          </button>
          <Link className={`${shared.btn} ${styles.btnGhost}`} href="/what-is-75-hard">
            What Is 75 Hard?
          </Link>
        </>
      );
    }

    return (
      <button
        className={`${shared.btn} ${shared.btnPrimary} ${styles.btnLift}`}
        onClick={() => (isLast ? setIndex(0) : setIndex((v) => v + 1))}
      >
        {isLast ? "Start My Plan" : "Continue"}
      </button>
    );
  }, [mode, isLast]);

  return (
    <main className={`${shared.appShell} ${styles.appShell}`}>
      <section className={shared.phone}>
        <header className={shared.topBar}>
          <button
            aria-label="Go back"
            onClick={goBack}
            className={`${shared.iconButton} ${mode === "entry" ? styles.iconButtonHidden : ""}`}
          >
            &#x2039;
          </button>
        </header>

        <article className={`${styles.slide} ${styles.slideActive}`}>
          {current.kind === "entry" && (
            <div className={`${styles.hero} ${styles.heroEntry}`}>
              <div className={styles.heroBadge}>75</div>
            </div>
          )}

          {current.kind === "comparison" && (
            <div className={`${styles.hero} ${styles.heroComparison}`} />
          )}

          {current.kind === "flow" && (
            <div className={`${styles.hero} ${styles.heroFlow}`}>
              <div className={styles.flowRow}>
                <span className={styles.flowPill}>Plan</span>
                <span className={styles.flowArrow}>&rarr;</span>
                <span className={styles.flowPill}>Daily Log</span>
                <span className={styles.flowArrow}>&rarr;</span>
                <span className={styles.flowPill}>Progress</span>
              </div>
            </div>
          )}

          {current.kind === "counts" && (
            <div className={`${styles.hero} ${styles.heroGrid}`}>
              <div className={styles.gridCard}>Exercise</div>
              <div className={styles.gridCard}>Development</div>
              <div className={styles.gridCard}>Hydration</div>
              <div className={styles.gridCard}>Nutrition</div>
            </div>
          )}

          <div className={styles.content}>
            <h1>{current.title}</h1>
            {current.subhead ? <p className={styles.subhead}>{current.subhead}</p> : null}
            {current.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </article>

        <footer className={styles.controls}>
          <div className={styles.dots}>
            {mode === "entry"
              ? null
              : slides.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`${styles.dot} ${dotIndex === index ? styles.dotActive : ""}`}
              />
              ))}
          </div>
          <div className={styles.actions}>{actions}</div>
        </footer>
      </section>
    </main>
  );
}
