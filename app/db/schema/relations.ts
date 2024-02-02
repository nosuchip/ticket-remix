import { events } from "./events";
import { relations } from "drizzle-orm";
import { tickets } from "./tickets";
import { users } from "./users";

export const userToTicketsRelations = relations(users, ({ many }) => ({
  tickets: many(tickets),
}));

export const eventToTicketsRelations = relations(events, ({ many }) => ({
  tickets: many(tickets),
}));
