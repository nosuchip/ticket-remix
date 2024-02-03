import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getEventById, getTicketById } from "~/db/queries";
import {
  superjson,
  useSuperActionData,
  useSuperLoaderData,
} from "~/utils/remix-superjson";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "flowbite-react";
import { Event } from "~/db/types";
import { Page } from "~/components/Page";
import { QrScanner } from "~/components/QrScanner/index";
import clsx from "clsx";
import { db } from "~/db/index.server";
import { deserializeQrData } from "~/utils/qr";
import { eq } from "drizzle-orm";
import { formatDate } from "~/utils/formatters";
import { isAuthenticated } from "~/services/session.server";
import { isUserAdmin } from "~/utils/validators";
import schema from "~/db/schema";
import { useSubmit } from "@remix-run/react";

interface AdminTicketUseProps {
  event: Event;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request);

  if (!isUserAdmin(user)) {
    throw new Response("Forbidden", { status: 403 });
  }

  const event = await getEventById(params.eventId!);

  return superjson({
    user,
    event,
  });
}

export default function AdminTicketUse({
  event,
}: AdminTicketUseProps): JSX.Element {
  const { user } = useSuperLoaderData<typeof loader>();

  const [scanData, setScanData] = useState<{
    ticketId: string;
    eventId: string;
  } | null>(null);

  const submit = useSubmit();
  const response = useSuperActionData<typeof action>();

  useEffect(() => {
    if (!scanData) {
      return;
    }

    submit({ ...scanData, checkEventId: event.id }, { method: "post" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanData]);

  const successResponse = useMemo(() => {
    if (
      !response ||
      !response.success ||
      !response?.ticket ||
      !response?.event
    ) {
      return null;
    }

    return {
      ticket: response?.ticket,
      event: response?.event,
    };
  }, [response]);

  const failResponse = useMemo(() => {
    if (!response || response.success || !response?.message) {
      return null;
    }

    return {
      message: response?.message,
    };
  }, [response]);

  return (
    <Page user={user || undefined}>
      <h1 className="text-2xl font-bold text-center">Ticket verification</h1>

      <div className="flex items-center flex-col">
        <QrScanner
          onError={(err: Error) => console.error(err)}
          onChange={(data: string) => {
            if (!data) {
              return;
            }

            const result = deserializeQrData(data);

            if (result) {
              setScanData(result);
            }
          }}
        />

        <div className="min-w-96">
          <h2>
            <button
              type="button"
              className={clsx(
                "w-full p-5 font-bold text-black-500 border border-b-0 border-gray-200 rounded-t-xl bg-gray-100",
                !response || (failResponse && "rounded-b-xl")
              )}
            >
              <span>{successResponse && response?.event?.name}</span>
              <span className="mb-2 text-xl font-bold text-red-500">
                {failResponse && response?.message}
              </span>
            </button>
          </h2>
          {successResponse && (
            <div className="p-5 border border-b-1 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              {response?.event?.description && (
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  {response?.event.description}
                </p>
              )}

              <Badge
                color="success"
                className="p-4 rounded-xl text-3xl font-bold text-center mt-8"
              >
                Ticket verified and successfully used at{" "}
                {formatDate(response?.ticket?.usedAt)}
              </Badge>

              <p className="text-center mt-8">
                NOTE: Verifying this ticket one more time cause error
              </p>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const ticketId = formData.get("ticketId") as string;
  const eventId = formData.get("eventId") as string;
  const checkEventId = formData.get("checkEventId") as string;

  const ticket = await getTicketById(ticketId);

  if (!ticket) {
    return superjson(
      {
        success: false,
        message: "Ticket not found",
        event: null,
        ticket: null,
      },
      { status: 400 }
    );
  }

  if (
    ticket.usedAt ||
    ticket.eventId !== eventId ||
    ticket.eventId !== checkEventId ||
    eventId !== checkEventId
  ) {
    return superjson(
      {
        success: false,
        message: "Ticket is invalid or already used",
        event: null,
        ticket: null,
      },
      { status: 400 }
    );
  }

  ticket.usedAt = new Date();

  await db
    .update(schema.tickets)
    .set(ticket)
    .where(eq(schema.tickets.id, ticketId));

  const event = await getEventById(eventId);

  return superjson({ success: true, ticket, event, message: null });
}
