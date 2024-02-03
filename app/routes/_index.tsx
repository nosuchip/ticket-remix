import { superjson, useSuperLoaderData } from "~/utils/remix-superjson";

import EventCardsContainer from "~/components/EventCardsContainer";
import { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import { Page } from "~/components/Page";
import { getAllEvents } from "~/db/queries";
import { isAuthenticated } from "~/services/session.server";
import { isUserAdmin } from "~/utils/validators";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request);

  const events = await getAllEvents();

  return superjson({
    user,
    events,
  });
}

export default function Events() {
  const { user, events } = useSuperLoaderData<typeof loader>();

  return (
    <Page user={user || undefined}>
      <h1 className="text-5xl text-center mb-10">Events</h1>
      <EventCardsContainer events={events} editable={isUserAdmin(user)} />
    </Page>
  );
}
