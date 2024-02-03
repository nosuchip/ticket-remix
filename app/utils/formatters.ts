import dayjs from "dayjs";

export const formatDate = (
  date: Date | string | undefined | null,
  fallback?: string
) => {
  if (!date) {
    return fallback;
  }

  return dayjs(date).format("YYYY-MM-DD hh:mm");
};

export const getWindowLocation = () => {
  if (typeof window !== "undefined" && typeof window.location !== "undefined") {
    return window.location;
  }

  return { href: "/", protocol: null };
};
