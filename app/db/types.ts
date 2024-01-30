import { events } from "./schema/events";
import { tickets } from "./schema/tickets";

type Event = typeof events.$inferSelect;
type Ticket = typeof tickets.$inferSelect & { event?: Event };

export type { Event, Ticket };
