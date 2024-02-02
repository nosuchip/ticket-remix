import { Button, Card } from "flowbite-react";
import { Form, useSubmit } from "@remix-run/react";
import { connectMetamask, signMessage } from "~/utils/eth";

export default function Login() {
  const submit = useSubmit();

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

    submit(formData, { method: "post", action: "/auth/metamask" });
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Card className="w-96">
        <Form action="/auth/auth0" method="post">
          <Button color="blue" className="w-full">
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
