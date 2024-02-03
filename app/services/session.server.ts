import { createCookieSessionStorage, redirect } from "@remix-run/node";

import { User } from "~/db/types";
import { getOrThrow } from "~/utils/env";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_rmx_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [getOrThrow("SERVER_SESSION_SECRET")], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

interface AuthenticationOptions {
  failureRedirect?: string;
}

export const isAuthenticated = async (
  request: Request,
  options?: AuthenticationOptions
) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user: User = session.get("user");

  if (!user) {
    if (options?.failureRedirect) {
      throw redirect(options?.failureRedirect);
    }
  }

  return user;
};
