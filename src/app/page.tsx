import { HexagonIconNegative } from "@/components/icon";
import { AnimatedCounter } from "@/components/landing/animated-counter";
import { AnimatedText } from "@/components/landing/animated-text";
import { ContactDialog } from "@/components/landing/contact-dialog";
import type { FeatureCardIcon } from "@/components/landing/feature-card";
import { FeatureCard } from "@/components/landing/feature-card";
import { FloatingBadge } from "@/components/landing/floating-badge";
import { GitHubIssueMock } from "@/components/landing/github-issue-mock";
import { HeroCta } from "@/components/landing/hero-cta";

import { TypingCodeBlock } from "@/components/landing/typing-code-block";
import { getSession } from "@/lib/auth/helpers";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bug Buddy — Visual feedback that becomes GitHub issues",
  description:
    "Bug Buddy: the feedback widget that captures screenshots and annotations and creates GitHub issues automatically. One script, no copy-paste.",
};

const features: {
  icon: FeatureCardIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: "camera",
    title: "Screenshot + annotations",
    description:
      "One-click capture of the current page; users add numbered pins and notes so you see exactly what they mean.",
  },
  {
    icon: "git-branch",
    title: "Straight to GitHub",
    description:
      "Each submission becomes a GitHub issue (via GitHub App or OAuth) with screenshot, URL, and device/browser details.",
  },
  {
    icon: "check-circle-2",
    title: "Two-way sync",
    description:
      "Issue and comment updates in GitHub are reflected in your Bug Buddy dashboard.",
  },
  {
    icon: "code",
    title: "One script, any site",
    description:
      "Embed a small script; optional domain allowlist and widget customization (e.g. colors, branding) keep it secure and on-brand.",
  },
  {
    icon: "users",
    title: "Team-ready",
    description:
      "Organizations, projects, and a dashboard to triage and manage feedback before or after it becomes an issue.",
  },
];

export default async function Home() {
  const session = await getSession();
  const isSignedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-24 top-[15%] size-48 rounded-full bg-primary/25 blur-[60px] sm:size-112 sm:blur-[100px]" />
        <div className="animate-blob animation-delay-2000 absolute -right-20 top-[10%] size-40 rounded-full bg-primary/20 blur-[50px] sm:size-88 sm:blur-[80px]" />
        <div className="animate-blob animation-delay-4000 absolute left-[30%] top-[55%] size-56 rounded-full bg-primary/22 blur-[70px] sm:size-128 sm:blur-[120px]" />
        <div className="animate-blob animation-delay-6000 absolute -right-16 top-[65%] size-36 rounded-full bg-primary/18 blur-[50px] sm:size-80 sm:blur-[90px]" />
        <div className="animate-blob animation-delay-3000 absolute left-[10%] top-[85%] size-32 rounded-full bg-primary/20 blur-[40px] sm:size-72 sm:blur-[70px]" />
      </div>

      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex size-8 items-center justify-center rounded-lg text-primary-foreground">
              <HexagonIconNegative className="size-5" />
            </div>
            Bug Buddy
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            {isSignedIn ? (
              <HeroCta isSignedIn variant="header" />
            ) : (
              <>
                <Link
                  href="/signin"
                  className="hidden h-8 items-center rounded-md border border-border bg-background px-3 text-sm hover:bg-accent sm:inline-flex"
                >
                  Sign in
                </Link>
                <Link
                  href="/signin"
                  className="inline-flex h-8 items-center whitespace-nowrap rounded-md bg-primary px-3 text-sm text-primary-foreground hover:bg-primary/90"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* ── Hero ── */}
        <section className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <AnimatedText
              text="Visual feedback that becomes GitHub issues"
              highlightWords={["GitHub", "issues"]}
            />

            <HeroCta isSignedIn={isSignedIn} />
          </div>

          {/* Floating badges */}
          <FloatingBadge
            icon="camera"
            label="Screenshot"
            delay={0}
            x={-42}
            y={-18}
          />
          <FloatingBadge
            icon="map-pin"
            label="Annotations"
            delay={0.3}
            x={32}
            y={-15}
          />
          <FloatingBadge
            icon="git-branch"
            label="GitHub Issue"
            delay={0.6}
            x={-35}
            y={25}
          />
          <FloatingBadge
            icon="monitor"
            label="Device Info"
            delay={0.9}
            x={33}
            y={20}
          />
        </section>

        {/* ── Code Demo ── */}
        <section className="overflow-hidden border-y border-border/50 bg-muted/30 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                How it works
              </p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                One script in, GitHub issues out
              </h2>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-2">
              {/* Left: embed code */}
              <div>
                <p className="mb-4 text-sm font-medium text-muted-foreground">
                  <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </span>
                  Add the widget to your site
                </p>
                <TypingCodeBlock />
              </div>

              {/* Right: result */}
              <div>
                <p className="mb-4 text-sm font-medium text-muted-foreground">
                  <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    2
                  </span>
                  Users report bugs, issues appear in GitHub
                </p>
                <GitHubIssueMock />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid gap-10 md:grid-cols-3">
            <AnimatedCounter
              value={1}
              label="Script tag"
              description="Drop one snippet and you're live. No build step, no SDK."
            />
            <AnimatedCounter
              value={0}
              label="Config required"
              description="Works out of the box. Customize later if you want."
            />
            <AnimatedCounter
              value={100}
              suffix="%"
              label="Context captured"
              description="Screenshot, annotations, URL, viewport, browser, and OS."
            />
          </div>
        </section>

        {/* ── Features ── */}
        <section className="border-t border-border/50 bg-muted/30 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Features
              </p>
              <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                Everything you need to capture and triage feedback
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                One script, no copy-paste. Feedback flows straight into your
                repo.
              </p>
            </div>

            <ul className="mt-14 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <li key={feature.title}>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    index={i}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative overflow-hidden py-24">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
          <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
            <Sparkles className="mx-auto size-10 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
              {isSignedIn
                ? "Ready to manage your feedback?"
                : "Ready to collect better feedback?"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isSignedIn
                ? "Head to your dashboard to view and triage feedback."
                : "Sign in with GitHub or Google. No credit card required."}
            </p>
            <HeroCta isSignedIn={isSignedIn} compact />
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-border/50 py-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HexagonIconNegative className="size-4 opacity-70" />
              Bug Buddy
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
              <ContactDialog>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact
                </button>
              </ContactDialog>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
