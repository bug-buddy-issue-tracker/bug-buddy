import { OrgInvitationEmail } from "@/emails/org-invitation.email";
import { emailBaseUrl } from "@/emails/utils";
import { serverEnv } from "@/env";
import { transporter } from "@/lib/mail-transporter";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmailWorkflow } from "@/server/queues/workflows/emails/send-welcome-email.workflow";
import { render } from "@react-email/components";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, lastLoginMethod, organization } from "better-auth/plugins";
import { start } from "workflow/api";
import { ac, admin as adminRole, member, owner } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL:
    (serverEnv.APP_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL)
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  plugins: [
    lastLoginMethod(),
    admin(),
    organization({
      ac,
      roles: { owner, admin: adminRole, member },
      async sendInvitationEmail(data) {
        const inviteLink = `${emailBaseUrl}/accept-invitation/${data.id}`;
        const html = await render(
          OrgInvitationEmail({
            inviterName: data.inviter.user.name || data.inviter.user.email,
            organizationName: data.organization.name,
            inviteLink,
          }),
        );
        await transporter.sendMail({
          from: "no-reply@notifications.bugbuddy.dev",
          to: data.email,
          subject: `You've been invited to ${data.organization.name} on Bug Buddy`,
          html,
        });
      },
    }),
  ],
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      clientId: serverEnv.GITHUB_CLIENT_ID,
      clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
      scope: ["read:user", "user:email", "repo", "read:org", "admin:repo_hook"],
    },
    google: {
      prompt: "select_account",
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  secret: serverEnv.BETTER_AUTH_SECRET,
  // DB Hooks
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          start(sendWelcomeEmailWorkflow, [user.email]);
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
