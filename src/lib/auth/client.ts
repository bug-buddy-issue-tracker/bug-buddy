import {
  adminClient,
  inferAdditionalFields,
  lastLoginMethodClient,
  organizationClient,
} from "better-auth/client/plugins";

import { createAuthClient } from "better-auth/react";
import { auth } from ".";
import { ac, admin, member, owner } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    lastLoginMethodClient(),
    adminClient(),
    organizationClient({
      ac,
      roles: { owner, admin, member },
    }),
    inferAdditionalFields<typeof auth>(),
  ],
});
