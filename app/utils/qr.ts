import { Ticket } from "~/db/types";

export const serializeQrData = (ticket: Ticket) => {
  return `${ticket.id}|${ticket.eventId}`;
};

export const deserializeQrData = (value: string) => {
  if (!value.includes("|")) {
    return null;
  }

  const [ticketId, eventId] = value.split("|");

  return {
    ticketId,
    eventId,
  };
};
