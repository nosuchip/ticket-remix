import { Auth0UserInfo, User } from "~/types/user";

import { Dictionary } from "~/types/generic";

export const auth0ProfileToUser = (
  profile: Auth0UserInfo,
  currentUser?: User,
): User => {
  const user: User = {
    ...(currentUser ?? {}),

    provider: "auth0",
    sub: profile?.sub,
    nickname: profile?.nickname,
    name: profile?.name,
    picture: profile?.picture,
    updated_at: profile?.updated_at,
    email: profile?.email,
    email_verified: !!profile?.email_verified,
    app_metadata: {
      roles: (profile as Dictionary)?.["meta/app_metadata"]?.roles ?? [],
    },
    user_metadata: {
      ...((profile as Dictionary)?.["meta/user_metadata"] || {}),
    },
  };

  return user;
};
