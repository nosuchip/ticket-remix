import { LoaderFunctionArgs, json } from "@remix-run/node";

import EventCardsContainer from "~/components/EventCardsContainer";
import type { MetaFunction } from "@remix-run/node";
import { Page } from "~/components/Page";
import { authenticator } from "~/services/auth0.server";
import { getAllEvents } from "~/db/queries";
import { isUserAdmin } from "~/utils/validators";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  const events = await getAllEvents();

  return json({
    user,
    events,
  });
}

export default function Events() {
  const { user, events } = useLoaderData<typeof loader>();

  return (
    <Page user={user || undefined}>
      <h1 className="text-5xl text-center mb-10">Events</h1>
      <EventCardsContainer events={events} editable={isUserAdmin(user)} />
    </Page>
  );
}
