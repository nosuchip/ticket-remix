import { Event } from "~/db/types";
import { EventCard } from "../EventCard";
import React from "react";

interface EventCardsContainerProps {
  events: Event[];
  editable?: boolean;
}

const EventCardsContainer: React.FC<EventCardsContainerProps> = ({
  events,
  editable,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      {events.map((event, index) => (
        <EventCard key={index} event={event} editable={editable} />
      ))}
    </div>
  );
};

export default EventCardsContainer;
