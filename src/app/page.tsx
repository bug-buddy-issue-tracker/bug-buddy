import { HexagonIconNegative } from "@/components/icon";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/helpers";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Code,
  GitBranch,
  LayoutGrid,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bug Buddy — Visual feedback that becomes GitHub issues",
  description:
    "Bug Buddy: the feedback widget that captures screenshots and annotations and creates GitHub issues automatically. One script, no copy-paste.",
};

const features = [
  {
    icon: Camera,
    title: "Screenshot + annotations",
    description:
      "One-click capture of the current page; users add numbered pins and notes so you see exactly what they mean.",
  },
  {
    icon: GitBranch,
    title: "Straight to GitHub",
    description:
      "Each submission becomes a GitHub issue (via GitHub App or OAuth) with screenshot, URL, and device/browser details.",
  },
  {
    icon: CheckCircle2,
    title: "Two-way sync",
    description:
      "Issue and comment updates in GitHub are reflected in your Bug Buddy dashboard.",
  },
  {
    icon: Code,
    title: "One script, any site",
    description:
      "Embed a small script; optional domain allowlist and widget customization (e.g. colors, branding) keep it secure and on-brand.",
  },
  {
    icon: Users,
    title: "Team-ready",
    description:
      "Organizations, projects, and a dashboard to triage and manage feedback before or after it becomes an issue.",
  },
];

export default async function Home() {
  const session = await getSession();
  const isSignedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-background">
      {/* Grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className=" text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <HexagonIconNegative className="size-5" />
            </div>
            Bug Buddy
          </Link>
          <nav className="flex items-center gap-4">
            {isSignedIn ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/signin">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signin">Get started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <ScrollReveal
            className="mx-auto max-w-3xl text-center"
            y={16}
            duration={800}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Visual feedback that becomes{" "}
              <span className="text-primary">GitHub issues</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Capture screenshots, add annotations, and turn user reports into
              tracked issues in one click.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="h-11 px-6 text-base">
                <Link href={isSignedIn ? "/dashboard" : "/signin"}>
                  {isSignedIn ? "Go to dashboard" : "Get started free"}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </section>

        {/* About paragraph */}
        <section className="border-y border-border/50 bg-muted/30 py-16">
          <ScrollReveal
            className="mx-auto max-w-3xl px-4 text-center sm:px-6"
            y={10}
            duration={600}
          >
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              <strong className="text-foreground">Bug Buddy</strong> is a
              feedback widget that turns user reports into actionable GitHub
              issues. Visitors click your widget, describe the problem, and get
              an automatic screenshot of the page—no extra steps. They can add
              numbered annotations to point at exactly what’s wrong. Submit
              once, and Bug Buddy creates a GitHub issue with title,
              description, screenshot, annotations, URL, and device info.
              Connect a GitHub App and issues stay in sync with comments and
              status. Add the script to your site, optionally restrict by domain
              and customize the widget, and start collecting structured, visual
              feedback where you already work: GitHub.
            </p>
          </ScrollReveal>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <ScrollReveal className="text-center" y={10} duration={600}>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Everything you need to capture and triage feedback
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
              One script, no copy-paste. Feedback flows straight into your repo.
            </p>
          </ScrollReveal>
          <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title}>
                  <ScrollReveal
                    delay={i * 80}
                    y={14}
                    duration={550}
                    rootMargin="0px 0px -40px 0px"
                  >
                    <div className="group rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-colors hover:border-primary/20 hover:bg-accent/30">
                      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="mt-4 font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </ScrollReveal>
                </li>
              );
            })}
          </ul>
        </section>

        {/* CTA */}
        <section className="border-t border-border/50 bg-muted/30 py-20">
          <ScrollReveal
            className="mx-auto max-w-2xl px-4 text-center sm:px-6"
            y={12}
            duration={600}
          >
            <LayoutGrid className="mx-auto size-12 text-muted-foreground" />
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
            <Button asChild size="lg" className="mt-6 h-11 px-6 text-base">
              <Link href={isSignedIn ? "/dashboard" : "/signin"}>
                {isSignedIn ? "Go to dashboard" : "Get started"}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </section>

        {/* Footer */}
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
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
