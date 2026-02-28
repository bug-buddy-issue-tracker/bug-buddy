"use client";

import { Building2, ChevronsUpDown, Plus, Settings } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useOrg } from "./org-context";

export function OrgSwitcher({ className }: { className?: string }) {
  const { orgs, activeOrg } = useOrg();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [creating, setCreating] = React.useState(false);

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  async function handleCreate(e: React.FormEvent) {
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
      setDialogOpen(false);
      setName("");
      const orgParam = data?.slug
        ? `?org=${encodeURIComponent(data.slug)}`
        : "";
      router.push(`/dashboard/new${orgParam}`);
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-9 gap-2 justify-between active:scale-100",
              className,
            )}
          >
            <Building2 className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{activeOrg.name}</span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[240px]">
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {orgs.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => router.push(`/dashboard/${org.slug}`)}
            >
              <Building2 className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{org.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            Create organization
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/${activeOrg.slug}/settings`)}
          >
            <Settings className="size-4" />
            Organization settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Create organization</DialogTitle>
              <DialogDescription>
                Add a new organization to collaborate with your team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <div className="grid gap-2">
                <Label htmlFor="org-name">Name</Label>
                <Input
                  id="org-name"
                  placeholder="My Team"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              {slug && (
                <p className="text-sm text-muted-foreground">
                  <code className="px-1 py-0.5 bg-muted rounded text-xs">
                    {slug}
                  </code>
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={creating} disabled={!name.trim()}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
