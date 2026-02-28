import { SignInCard } from "@/components/auth/sign-in-card";
import { getSession } from "@/lib/auth/helpers";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In | Bug Buddy",
  description: "Sign in to Bug Buddy to manage your bug reports and feedback",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const session = await getSession();
  const { redirect: redirectTo } = await searchParams;

  if (session?.user) {
    redirect("/dashboard");
  }

  const callbackURL =
    redirectTo && redirectTo.startsWith("/")
      ? redirectTo
      : undefined;

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4"
      suppressHydrationWarning
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <SignInCard callbackURL={callbackURL} />
      <Link
        href="/"
        className="mt-6 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to home
      </Link>
    </div>
  );
}
