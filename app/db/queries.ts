import { db } from "./index.server";
import { eq } from "drizzle-orm";
import schema from "./schema";

export const getAllEvents = async () => db.query.events.findMany();

export const getEventById = async (id: string) =>
  db.query.events.findFirst({
    where: eq(schema.events.id, id),
  });

export const getTicketById = async (id: string) =>
  db.query.tickets.findFirst({
    where: eq(schema.tickets.id, id),
  });

export const getTicketsByEventId = async (id: string) =>
  db.query.tickets.findMany({
    where: eq(schema.tickets.eventId, id),
  });

export const getTicketsByEmail = async (email: string) =>
  db.query.tickets.findMany({
    where: eq(schema.tickets.email, email),
    with: { events: true },
  });
