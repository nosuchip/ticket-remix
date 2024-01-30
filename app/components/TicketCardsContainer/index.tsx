import React from "react";
import { Ticket } from "~/db/types";
import { TicketCard } from "../TicketCard";

interface TicketCardsContainerProps {
  tickets: Ticket[];
}

const TicketCardsContainer: React.FC<TicketCardsContainerProps> = ({
  tickets,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      {tickets.map((ticket, index) => (
        <TicketCard key={index} ticket={ticket} />
      ))}
    </div>
  );
};

export default TicketCardsContainer;
