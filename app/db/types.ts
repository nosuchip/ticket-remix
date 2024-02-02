import { events } from "./schema/events";
import { tickets } from "./schema/tickets";
import { users } from "./schema/users";

type Event = typeof events.$inferSelect;
type Ticket = typeof tickets.$inferSelect & { event?: Event; user?: User };
type User = typeof users.$inferSelect & { tickets?: Ticket[] };

export type { Event, Ticket, User };
