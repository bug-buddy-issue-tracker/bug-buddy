import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  project: ["create", "update", "delete"],
  github: ["update"],
  issue: ["close"],
  widget: ["update"],
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  ...memberAc.statements,
});

export const admin = ac.newRole({
  ...adminAc.statements,
  project: ["create", "update"],
  issue: ["close"],
  widget: ["update"],
});

export const owner = ac.newRole({
  ...ownerAc.statements,
  project: ["create", "update", "delete"],
  github: ["update"],
  issue: ["close"],
  widget: ["update"],
});
