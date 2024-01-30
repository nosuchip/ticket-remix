import {
  ArrowRightIcon,
  PencilIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import { Badge, Button, Card, Tooltip } from "flowbite-react";

import { Event } from "~/db/types";
import { Link } from "@remix-run/react";
import { Price } from "~/types/price";
import React from "react";

interface EventCardProps {
  event: Event;
  editable?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, editable }) => {
  const formatPriceDescription = (price: Price) => {
    if (price.description) {
      return price.description;
    }

    if (price.currency) {
      return `Purchase ticket for ${price.price} ${price.currency}`;
    }

    return `Purchase ticket for ${price.price}`;
  };
  return (
    <Card
      className="max-w-sm relative"
      imgAlt="Meaningful alt text for an image that is not purely decorative"
      imgSrc={event.images?.[0]}
    >
      {editable && (
        <div className="absolute top-4 right-4">
          <Button
            color="light"
            as={Link}
            to={`/admin/event/${event.id}`}
            className="p-0 text-white border-0 bg-transparent"
            title="Edit event"
          >
            <PencilIcon className="w-6 h-6" />
          </Button>
        </div>
      )}
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {event.name}
      </h5>
      <div className="font-normal text-gray-700 dark:text-gray-400">
        {event.description}
      </div>

      <div className="flex flex-col grow"></div>

      <div className="flex justify-stretch">
        <Button
          as={Link}
          color="blue"
          className="grow"
          to={`/event/${event.id}`}
          size="xl"
        >
          Review &amp; purchase <ArrowRightIcon className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="flex gap-x-2 justify-center">
        {(event.prices as Price[]).map((price, index) => (
          <Tooltip content={formatPriceDescription(price)} key={index}>
            <Badge
              color="indigo"
              icon={() => <ShoppingCartIcon className="mr-2 h-5 w-5" />}
              size="xl"
              className="px-4 py-2"
            >
              <div>{price.price}</div>
            </Badge>
          </Tooltip>
        ))}
      </div>
    </Card>
  );
};
