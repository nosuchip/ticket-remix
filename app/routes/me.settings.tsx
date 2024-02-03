import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  commitSession,
  getSession,
  isAuthenticated,
} from "~/services/session.server";
import {
  redirect,
  superjson,
  useSuperLoaderData,
} from "~/utils/remix-superjson";

import { AccountSettings } from "~/components/AccountSettings";
import { Dictionary } from "~/types/generic";
import { Page } from "~/components/Page";
import { parseMultipartFormData } from "~/utils/uploader.server";
import { updateUser } from "~/db/queries";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

  return superjson({ user });
}

export default function MySettings() {
  const { user } = useSuperLoaderData<typeof loader>();

  return (
    <Page user={user || undefined} className="flex flex-col items-center">
      <h1 className="text-5xl text-center mb-10">My settings</h1>
      <AccountSettings user={user} />
    </Page>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await parseMultipartFormData(request, "avatar");

  const providerId = formData.get("providerId") as string;
  const name = formData.get("name") as string;
  const avatar = formData.get("avatar") as string;

  const update: Dictionary = { name };
  if (avatar) {
    update.picture = avatar;
  }

  const newUser = await updateUser({ providerId }, update);

  const session = await getSession(request.headers.get("Cookie"));
  session.set("user", newUser);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
