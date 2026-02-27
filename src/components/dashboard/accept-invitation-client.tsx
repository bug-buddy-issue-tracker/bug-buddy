"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

export function AcceptInvitationClient({
  invitationId,
}: {
  invitationId: string;
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState<
    "idle" | "accepting" | "accepted" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  async function handleAccept() {
    setStatus("accepting");
    try {
      const { error } = await authClient.organization.acceptInvitation({
        invitationId,
      });

      if (error) {
        throw new Error(error.message || "Failed to accept invitation");
      }

      setStatus("accepted");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to accept invitation",
      );
    }
  }

  async function handleReject() {
    try {
      await authClient.organization.rejectInvitation({ invitationId });
      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-bold">Organization Invitation</h1>

        {status === "accepted" && (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="size-12 text-green-500" />
            <p className="text-lg">Invitation accepted!</p>
            <p className="text-sm text-muted-foreground">
              Redirecting to dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-3">
            <XCircle className="size-12 text-destructive" />
            <p className="text-lg text-destructive">{errorMessage}</p>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        )}

        {(status === "idle" || status === "accepting") && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              You have been invited to join an organization on Bug Buddy.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={status === "accepting"}
              >
                Decline
              </Button>
              <Button onClick={handleAccept} loading={status === "accepting"}>
                Accept Invitation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
