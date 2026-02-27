import { AcceptInvitationClient } from "@/components/dashboard/accept-invitation-client";
import { getSession } from "@/lib/auth/helpers";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Accept Invitation | Bug Buddy",
  description: "Accept your organization invitation",
};

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ invitationId: string }>;
}) {
  const session = await getSession();
  const { invitationId } = await params;

  if (!session?.user) {
    redirect(`/?redirect=/accept-invitation/${invitationId}`);
  }

  return <AcceptInvitationClient invitationId={invitationId} />;
}
