"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth/client";
import { hasMinRole } from "@/lib/auth/role-utils";
import { Crown, Mail, Shield, Trash2, User, UserMinus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

type MemberInfo = {
  id: string;
  role: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

type InvitationInfo = {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
};

interface OrgSettingsClientProps {
  org: { id: string; name: string; slug: string };
  currentUserRole: string;
  currentUserId: string;
  members: MemberInfo[];
  invitations: InvitationInfo[];
}

const roleIcons: Record<string, React.ReactNode> = {
  owner: <Crown className="size-4 text-amber-500" />,
  admin: <Shield className="size-4 text-blue-500" />,
  member: <User className="size-4 text-muted-foreground" />,
};

export function OrgSettingsClient({
  org,
  currentUserRole,
  currentUserId,
  members: initialMembers,
  invitations: initialInvitations,
}: OrgSettingsClientProps) {
  const router = useRouter();
  const isOwner = currentUserRole === "owner";
  const isAdmin = hasMinRole(currentUserRole, "admin");

  const [members, setMembers] = React.useState(initialMembers);
  const [invitations, setInvitations] = React.useState(initialInvitations);

  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<string>("member");
  const [inviting, setInviting] = React.useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    try {
      const { error } = await authClient.organization.inviteMember({
        email: inviteEmail.trim(),
        role: inviteRole as "admin" | "member",
        organizationId: org.id,
      });

      if (error) throw new Error(error.message || "Failed to send invitation");

      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send invitation",
      );
    } finally {
      setInviting(false);
    }
  }

  async function handleCancelInvitation(invitationId: string) {
    try {
      const { error } = await authClient.organization.cancelInvitation({
        invitationId,
      });
      if (error) throw new Error(error.message);

      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      toast.success("Invitation cancelled");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel invitation",
      );
    }
  }

  async function handleUpdateRole(memberId: string, newRole: string) {
    try {
      const { error } = await authClient.organization.updateMemberRole({
        memberId,
        role: newRole,
        organizationId: org.id,
      });
      if (error) throw new Error(error.message);

      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
      );
      toast.success("Role updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update role",
      );
    }
  }

  async function handleRemoveMember(memberIdOrEmail: string) {
    try {
      const { error } = await authClient.organization.removeMember({
        memberIdOrEmail,
        organizationId: org.id,
      });
      if (error) throw new Error(error.message);

      setMembers((prev) => prev.filter((m) => m.id !== memberIdOrEmail));
      toast.success("Member removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove member",
      );
    }
  }

  async function handleDeleteOrg() {
    setDeleting(true);
    try {
      const { error } = await authClient.organization.delete({
        organizationId: org.id,
      });
      if (error) throw new Error(error.message);

      toast.success("Organization deleted");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete organization",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">
          Manage members, invitations, and settings for{" "}
          <strong>{org.name}</strong>
        </p>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          {isAdmin && <TabsTrigger value="invite">Invite</TabsTrigger>}
          {isOwner && <TabsTrigger value="danger">Danger Zone</TabsTrigger>}
        </TabsList>

        <TabsContent value="members" className="space-y-4 mt-4">
          <div className="rounded-lg border">
            {members.map((m, idx) => (
              <div key={m.id}>
                {idx > 0 && <Separator />}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={m.user.image || undefined}
                        alt={m.user.name || m.user.email}
                      />
                      <AvatarFallback>
                        {(m.user.name || m.user.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {m.user.name || m.user.email}
                        {m.user.id === currentUserId && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {m.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdmin && m.user.id !== currentUserId ? (
                      <>
                        <Select
                          value={m.role}
                          onValueChange={(val) => handleUpdateRole(m.id, val)}
                          disabled={m.role === "owner" && !isOwner}
                        >
                          <SelectTrigger className="w-[120px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {isOwner && (
                              <SelectItem value="owner">Owner</SelectItem>
                            )}
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveMember(m.id)}
                        >
                          <UserMinus className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        {roleIcons[m.role]}
                        <span className="capitalize">{m.role}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="invite" className="space-y-6 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Invite a member</h3>
              <form onSubmit={handleInvite} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" loading={inviting}>
                  <Mail className="size-4 mr-2" />
                  Invite
                </Button>
              </form>
            </div>

            {invitations.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pending invitations</h3>
                <div className="rounded-lg border">
                  {invitations.map((inv, idx) => (
                    <div key={inv.id}>
                      {idx > 0 && <Separator />}
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p className="text-sm font-medium">{inv.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Role: {inv.role} &middot; Expires{" "}
                            {new Date(inv.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleCancelInvitation(inv.id)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        )}

        {isOwner && (
          <TabsContent value="danger" className="mt-4">
            <div className="rounded-lg border border-destructive/50 p-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium text-destructive">
                  Delete Organization
                </h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete <strong>{org.name}</strong> and all its
                  projects, feedback, and data. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash2 className="size-4 mr-2" />
                Delete Organization
              </Button>
            </div>

            <Dialog
              open={deleteConfirmOpen}
              onOpenChange={setDeleteConfirmOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Organization</DialogTitle>
                  <DialogDescription>
                    This will permanently delete <strong>{org.name}</strong>,
                    all its projects, feedback, and associated data. Type the
                    organization name to confirm.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  placeholder={org.name}
                  value={deleteConfirmName}
                  onChange={(e) => setDeleteConfirmName(e.target.value)}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    loading={deleting}
                    disabled={deleteConfirmName !== org.name}
                    onClick={handleDeleteOrg}
                  >
                    Delete permanently
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
