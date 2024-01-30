import { useEffect } from "react";
import { useSubmit } from "@remix-run/react";

export default function Login() {
  const submit = useSubmit();

  useEffect(() => {
    submit({}, { method: "post", action: "/auth/auth0" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: If other login method is used, this should be uncommented and extended
  // return (
  //   <Form action="/auth/auth0" method="post">
  //     <button>Login with Auth0</button>
  //   </Form>
  // );

  return null;
}
