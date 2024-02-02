import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Form, useActionData } from "@remix-run/react";
import { commitSession, getSession } from "~/services/session.server";
import { createUser, getUserByProviderId, updateUser } from "~/db/queries";

import crypto from "crypto";
import { verifySignature } from "~/utils/eth";

export const loader = () => redirect("/auth/login");

export default function PostMetamaskSignup({}) {
  const data = useActionData<typeof action>();

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Card className="w-96">
        <Form method="post">
          <input type="hidden" name="action" value="update" />
          <input type="hidden" name="address" value={data?.address} />

          <div className="mb-8">
            <div className="mb-2 block">
              <Label value="Email *" htmlFor="email" />
            </div>
            <TextInput type="text" id="email" name="email" />
          </div>

          <div className="mb-8">
            <div className="mb-2 block">
              <Label value="Name" htmlFor="name" />
            </div>
            <TextInput type="text" id="name" name="name" />
          </div>

          <Button color="primary">Finalize sign up</Button>
        </Form>
      </Card>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const address = formData.get("address") as string;

  if (!address) {
    console.error(`No 'address' in form data`);
    return redirect("/auth/login");
  }

  const action = formData.get("action") as string;

  if (action === "signup") {
    const message = formData.get("message") as string;
    const signature = formData.get("signature") as string;

    const verified = await verifySignature(message, signature, address);

    if (!verified) {
      return redirect("/auth/login");
    }

    const providerId = `metamask|${address}`;
    let user = await getUserByProviderId(providerId);

    if (!user) {
      user = await createUser({
        providerId,
        email: null,
        name: null,
        picture: null,
        roles: [],
        stripeCustomerId: null,
      });
    }

    return { address };
  } else if (action === "update") {
    const providerId = `metamask|${address}`;
    let user = await getUserByProviderId(providerId);

    if (!user) {
      return null;
    }

    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    const hash = crypto
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");

    user = await updateUser({
      email,
      name,
      picture: `https://gravatar.com/avatar/${hash}`,
    });

    const session = await getSession(request.headers.get("Cookie"));
    session.set("user", user);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
};
