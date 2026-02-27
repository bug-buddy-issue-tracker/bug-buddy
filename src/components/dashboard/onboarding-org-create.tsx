"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export function OnboardingOrgCreate() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [creating, setCreating] = React.useState(false);

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const { data, error } = await authClient.organization.create({
        name: name.trim(),
        slug,
      });

      if (error) {
        throw new Error(error.message || "Failed to create organization");
      }

      toast.success("Organization created!");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create organization",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="org-name" className="text-sm font-medium">
          Organization Name
        </label>
        <Input
          id="org-name"
          placeholder="My Team"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {slug && (
          <p className="text-sm text-muted-foreground">
            <code className="px-1 py-0.5 bg-muted rounded">{slug}</code>
          </p>
        )}
      </div>
      <Button type="submit" loading={creating} disabled={!name.trim()}>
        Create Organization
      </Button>
    </form>
  );
}
