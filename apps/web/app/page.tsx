import Link from "next/link";
import styles from "./page.module.css";

type Section = {
  title: string;
  subtitle: string;
  links: Array<{ href: string; label: string }>;
};

const sections: Section[] = [
  {
    title: "Onboarding And Education",
    subtitle: "Entry points and education flow",
    links: [
      { href: "/onboarding?mode=entry", label: "Onboarding: Entry Screen" },
      { href: "/onboarding?mode=education&step=1", label: "Onboarding: Education Step 1" },
      { href: "/onboarding?mode=education&step=2", label: "Onboarding: Education Step 2" },
      { href: "/onboarding?mode=education&step=3", label: "Onboarding: Education Step 3" },
      { href: "/what-is-75-hard", label: "What Is 75 Hard? (Reference)" },
      { href: "/challenge-intro", label: "Challenge Intro" }
    ]
  },
  {
    title: "Plan Creation",
    subtitle: "Create and review the user plan",
    links: [
      { href: "/create-plan", label: "Create Plan" },
      { href: "/choose-template", label: "Choose Template" },
      { href: "/build-plan", label: "Build Plan" },
      { href: "/add-commitment-modal", label: "Add Commitment Modal" },
      { href: "/commitment-limit", label: "Commitment Limit" },
      { href: "/review-plan", label: "Review Plan" },
      { href: "/commitment-detail", label: "Commitment Detail" },
      { href: "/edit-commitment", label: "Edit Commitment" },
      { href: "/ready", label: "You're Ready" }
    ]
  },
  {
    title: "Daily Execution",
    subtitle: "Core day-to-day usage surfaces",
    links: [
      { href: "/today", label: "Today" },
      { href: "/day-one", label: "Day One" },
      { href: "/daily-complete", label: "Daily Complete" },
      { href: "/tracked-detail", label: "Tracked Detail" },
      { href: "/daily-photo-checkin", label: "Daily Photo Check-in" }
    ]
  },
  {
    title: "Progress And Review",
    subtitle: "Momentum visibility and historical view",
    links: [
      { href: "/progress-calendar", label: "Progress Calendar" },
      { href: "/tracked-detail", label: "Tracked Detail" }
    ]
  },
  {
    title: "Re-entry And Edge States",
    subtitle: "Recovery and empty-state screens",
    links: [
      { href: "/missed-day-encouragement", label: "Missed Day Encouragement" },
      { href: "/no-plan-empty", label: "No Plan Empty" }
    ]
  },
  {
    title: "Navigation Prototype",
    subtitle: "Shell and tab-navigation concept",
    links: [{ href: "/app-navigation", label: "App Navigation" }]
  }
];

export default function HomePage() {
  const devSections: Section[] =
    process.env.NODE_ENV === "production"
      ? []
      : [
        {
          title: "Developer Tools",
          subtitle: "Local-only QA helpers and dataset controls",
          links: [{ href: "/dev/testing", label: "Dataset Studio (Seed Profiles)" }]
        }
      ];

  const allSections = [...devSections, ...sections];

  return (
    <main className={styles.shell}>
      <section className={styles.wrap}>
        <header className={styles.header}>
          <h1>75 Flex Route Map</h1>
          <p>Direct links to every current screen, grouped by intended product flow.</p>
        </header>

        <section className={styles.grid}>
          {allSections.map((section) => (
            <article key={section.title} className={styles.card}>
              <h2>{section.title}</h2>
              <p>{section.subtitle}</p>
              <ul>
                {section.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
