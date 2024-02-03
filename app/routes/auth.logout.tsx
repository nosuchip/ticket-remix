import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/services/session.server";

import { getOrThrow } from "~/utils/env";
import { isUserProviderAuth0 } from "~/utils/validators";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const returnTo = new URL(request.url).origin;

  let logoutURL: URL;

  const user = session.get("user");

  if (isUserProviderAuth0(user)) {
    logoutURL = new URL(getOrThrow("AUTH0_LOGOUT_URL"));
    logoutURL.searchParams.set("client_id", getOrThrow("AUTH0_CLIENT_ID"));
    logoutURL.searchParams.set("returnTo", returnTo);
  } else {
    logoutURL = new URL(request.url);
    logoutURL.pathname = "";
  }

  return redirect(logoutURL.toString(), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
