import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/services/session.server";
import { createUser, getUserByProviderId } from "~/db/queries";

import { authenticator } from "~/services/auth0.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authUser = await authenticator.authenticate("auth0", request);

  if (!authUser) {
    return redirect("/auth/login");
  }

  let user = await getUserByProviderId(authUser?._json?.sub);

  if (authUser?._json?.sub?.startsWith("auth0") && !user) {
    user = await createUser({
      providerId: authUser._json?.sub,
      email: authUser._json?.email || null,
      name: authUser._json?.name || null,
      picture: authUser._json?.picture || null,
      roles: [],
      stripeCustomerId: null,
    });
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("user", user);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
