import { eq, or } from "drizzle-orm";

import { User } from "./types";
import { db } from "./index.server";
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

export const getUserByProviderId = async (providerId?: string) => {
  if (!providerId) {
    return null;
  }

  return db.query.users.findFirst({
    where: eq(schema.users.providerId, providerId),
  });
};

export const createUser = async (user: Omit<User, "id" | "createdAt">) => {
  const result = await db.insert(schema.users).values(user).returning();

  return result[0];
};

export const updateUser = async (
  user: Pick<User, "id" | "providerId" | "name" | "email">
) => {
  if (!user.id && !user.providerId) {
    throw new Error("User id or providerId is required");
  }

  const where = user.id
    ? eq(schema.users.id, user.id)
    : eq(schema.users.providerId, user.providerId);

  const result = await db
    .update(schema.users)
    .set(user)
    .where(where)
    .returning();

  return result[0];
};
