import { Event, User } from "~/db/types";

import dayjs from "dayjs";

export const isEventInPast = (event: Event) => {
  const diff = dayjs(event.date).diff(new Date().toISOString(), "minute");

  return diff > 0;
};

export const isUserAdmin = (user?: User | null) => {
  return !!user?.roles?.includes("admin");
};

export const isUserProviderAuth0 = (user?: User | null) => {
  return user?.providerId?.startsWith("auth0");
};

export const isUserProviderMetamask = (user?: User | null) => {
  return user?.providerId?.startsWith("auth0");
};
