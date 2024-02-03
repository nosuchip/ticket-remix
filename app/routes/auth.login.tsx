import { Button, Card } from "flowbite-react";
import { Form, useSubmit } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { connectMetamask, signMessage } from "~/utils/eth";

import { getSession } from "~/services/session.server";
import { getWindowLocation } from "~/utils/formatters";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const user = session.get("user");

  if (user) {
    return redirect("/");
  }

  return null;
};

export default function Login() {
  const submit = useSubmit();

  const location = getWindowLocation();
  const returnTo = location.protocol
    ? new URL(window.location.href).searchParams.get("returnTo") || "/"
    : "/";

  const handleMetamaskSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const address = await connectMetamask();

    if (!address) {
      return;
    }

    const message = "Login with Metamask";

    const signature = await signMessage(address, message);

    if (!signature) {
      return;
    }

    const formData = new FormData();
    formData.append("action", "signup");
    formData.append("address", address);
    formData.append("message", message);
    formData.append("signature", signature);
    formData.append("returnTo", returnTo);

    submit(formData, { method: "post", action: "/auth/metamask" });
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Card className="w-96">
        <Form action="/auth/auth0" method="post">
          <Button color="blue" className="w-full" type="submit">
            <input type="hidden" name="returnTo" value={returnTo} />
            Login with email
          </Button>
        </Form>

        <Form method="post" onSubmit={handleMetamaskSubmit}>
          <Button color="warning" className="w-full" type="submit">
            Login with Metamask
          </Button>
        </Form>
      </Card>
    </div>
  );
}
