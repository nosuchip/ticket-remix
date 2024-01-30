import { LoaderFunctionArgs, json } from "@remix-run/node";

import { Page } from "~/components/Page";
import TicketCardsContainer from "~/components/TicketCardsContainer";
import { authenticator } from "~/services/auth0.server";
import { getTicketsByEmail } from "~/db/queries";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

  const tickets = await getTicketsByEmail(user!.email!);

  return json({
    user,
    tickets,
  });
}

export default function MyTickets() {
  const { user, tickets } = useLoaderData<typeof loader>();

  return (
    <Page user={user || undefined}>
      <h1 className="text-5xl text-center mb-10">My tickets</h1>
      <TicketCardsContainer tickets={tickets} />
    </Page>
  );
}
