import { Event } from "~/db/types";
import { User } from "~/types/user";
import dayjs from "dayjs";

export const isEventInPast = (event: Event) => {
  const diff = dayjs(event.date).diff(new Date().toISOString(), "minute");

  return diff > 0;
};

export const isUserAdmin = (user?: User | null) => {
  return !!user?.app_metadata.roles.includes("admin");
};
