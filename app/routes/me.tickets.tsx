import { superjson, useSuperLoaderData } from "~/utils/remix-superjson";

import { LoaderFunctionArgs } from "@remix-run/node";
import { Page } from "~/components/Page";
import TicketCardsContainer from "~/components/TicketCardsContainer";
import { getTicketsByEmail } from "~/db/queries";
import { isAuthenticated } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

  const tickets = await getTicketsByEmail(user!.email!);

  return superjson({
    user,
    tickets,
  });
}

export default function MyTickets() {
  const { user, tickets } = useSuperLoaderData<typeof loader>();

  return (
    <Page user={user || undefined}>
      <h1 className="text-5xl text-center mb-10">My tickets</h1>
      <TicketCardsContainer tickets={tickets} />
    </Page>
  );
}
