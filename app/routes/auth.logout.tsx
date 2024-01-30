import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/services/session.server";

import { getOrThrow } from "~/utils/env";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const returnTo = new URL(request.url).origin;

  const logoutURL = new URL(getOrThrow("AUTH0_LOGOUT_URL"));
  logoutURL.searchParams.set("client_id", getOrThrow("AUTH0_CLIENT_ID"));
  logoutURL.searchParams.set("returnTo", returnTo);

  return redirect(logoutURL.toString(), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
