import { createCookieSessionStorage } from "@remix-run/node";
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
