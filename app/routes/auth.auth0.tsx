import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { authenticator } from "~/services/auth0.server";

export const loader = () => redirect("/auth/login");

export const action = ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate("auth0", request);
};
