import { Button, Carousel } from "flowbite-react";
import { LoaderFunctionArgs, json } from "@remix-run/node";

import { Page } from "~/components/Page";
import { Price } from "~/types/price";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { authenticator } from "~/services/auth0.server";
import { getEventById } from "~/db/queries";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  const event = await getEventById(params.eventId!);

  return json({
    user,
    event,
  });
}

export default function Event() {
  const { user, event } = useLoaderData<typeof loader>();

  return (
    <Page user={user || undefined}>
      <h1 className="text-5xl text-center mb-10">{event?.name}</h1>

      <div className="h-96 sm:h-96 xl:h-96 2xl:h-96 mb-4">
        {event?.images && (
          <Carousel>
            {event.images.map((image, index) => (
              <img src={image} alt={event.name} key={index} />
            ))}
          </Carousel>
        )}
      </div>

      <p className="mt-8 mb-8 text-lg">{event?.description}</p>

      <div className="flex flex-wrap gap-4 justify-center">
        {(event?.prices as Price[]).map((price, index) => (
          <Button
            key={index}
            color="indigo"
            size="xl"
            className="px-4 py-2 min-w-72"
          >
            <ShoppingCartIcon className="mr-2 h-5 w-5" />
            <div>{price.price}</div>
          </Button>
        ))}
      </div>
    </Page>
  );
}
