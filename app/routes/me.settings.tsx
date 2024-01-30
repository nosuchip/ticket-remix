import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { authenticator, updateUserMetadata } from "~/services/auth0.server";
import { commitSession, getSession } from "~/services/session.server";

import { AccountSettings } from "~/components/AccountSettings";
import { Dictionary } from "~/types/generic";
import { Page } from "~/components/Page";
import { parseMultipartFormData } from "~/utils/uploader.server";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

  return json({ user });
}

export default function MySettings() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Page user={user || undefined} className="flex flex-col items-center">
      <h1 className="text-5xl text-center mb-10">My settings</h1>
      <AccountSettings user={user} />
    </Page>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await parseMultipartFormData(request, "avatar");

  const sub = formData.get("sub") as string;
  const name = formData.get("name") as string;
  // const nearby = !!formData.get("nearby");
  const avatar = formData.get("avatar") as string;

  const update: Dictionary = { name };
  if (avatar) {
    update.picture = avatar;
  }

  const newUser = await updateUserMetadata(sub, update);

  const session = await getSession(request.headers.get("Cookie"));
  session.set("user", newUser);

  return redirect("/me/settings", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
