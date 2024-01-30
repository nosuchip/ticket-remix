import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth0.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.authenticate("auth0", request, {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  });
};
