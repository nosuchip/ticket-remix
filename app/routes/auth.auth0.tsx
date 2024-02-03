import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { authenticator } from "~/services/auth0.server";

export const loader = () => redirect("/auth/login");

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const returnTo = (formData.get("returnTo") as string) || "/";

  return authenticator.authenticate("auth0", request, {
    successRedirect: returnTo,
  });
};
