import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Button,
  FileInput,
  Label,
  Modal,
  Table,
  TextInput,
} from "flowbite-react";
import { getEventById, getTicketsByEventId } from "~/db/queries";
import { isEventInPast, isUserAdmin } from "~/utils/validators";
import { superjson, useSuperLoaderData } from "~/utils/remix-superjson";
import { useEffect, useState } from "react";

import { LinkIcon } from "@heroicons/react/24/solid";
import { OverlayWithSpinner } from "~/components/Overlay";
import { Page } from "~/components/Page";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import QrCode from "qrcode.react";
import { Ticket } from "~/db/types";
import { db } from "~/db/index.server";
import { formatDate } from "~/utils/formatters";
import { isAuthenticated } from "~/services/session.server";
import { parseMultipartFormData } from "~/utils/uploader.server";
import schema from "~/db/schema";
import { serializeQrData } from "~/utils/qr";
import { useFetcher } from "@remix-run/react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await isAuthenticated(request);

  if (!isUserAdmin(user)) {
    throw new Response("Forbidden", { status: 403 });
  }

  const event = await getEventById(params.eventId!);

  if (!event) {
    throw new Response(null, {
      status: 404,
      statusText: "Event not Found",
    });
  }
  const tickets = await getTicketsByEventId(params.eventId!);

  return superjson({
    user,
    event,
    tickets,
  });
}

export default function AdminEvent(): JSX.Element {
  const fetcher = useFetcher<typeof action>();

  const { user, event, tickets } = useSuperLoaderData<typeof loader>();
  const [openModal, setOpenModal] = useState(false);

  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (fetcher?.data?.ticket) {
      setTicket(fetcher.data.ticket as unknown as Ticket);
    } else {
      setTicket(null);
    }
  }, [fetcher]);

  const handleClose = () => {
    setEmail("");
    setDescription("");
    setTicket(null);
    setOpenModal(false);
  };

  return (
    <Page user={user || undefined}>
      <h1 className="text-2xl font-bold text-center m-8">{event.name}</h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircleIcon className="w-6 h-6 mr-4" />
          Issue ticket
        </Button>
      </div>

      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>#</Table.HeadCell>
          <Table.HeadCell>Email?</Table.HeadCell>
          <Table.HeadCell>Issues At</Table.HeadCell>
          <Table.HeadCell>Used At</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Receipt(s)</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {tickets.map((ticket, index) => (
            <Table.Row
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="font-bold">{index}</Table.Cell>
              <Table.Cell>{ticket.email || "---"}</Table.Cell>
              <Table.Cell>{formatDate(ticket.issuedAt, "---")}</Table.Cell>
              <Table.Cell>{formatDate(ticket.usedAt, "---")}</Table.Cell>
              <Table.Cell>{ticket.description || "---"}</Table.Cell>
              <Table.Cell>
                {ticket.receipts?.map((receipt, index) => (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={receipt}
                    key={index}
                    className="mr-2 rounded-md border-2 border-black-700 p-1 inline-block"
                  >
                    <LinkIcon className="w-6 h-6" />
                  </a>
                ))}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Modal dismissible show={openModal} onClose={handleClose}>
        {!ticket && (
          <fetcher.Form
            method="post"
            encType="multipart/form-data"
            className="relative overflow-hidden"
          >
            <OverlayWithSpinner visible={fetcher.state !== "idle"} />
            <Modal.Header>Issue new ticket</Modal.Header>
            <Modal.Body>
              <input type="hidden" name="eventId" value={event.id} />

              <div className="mb-8">
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Recipient email (optional)" />
                </div>

                <TextInput
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="mb-8">
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Description (optional)" />
                </div>

                <TextInput
                  id="description"
                  name="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div>
                <div>
                  <Label
                    htmlFor="receipts"
                    value="Upload receipts or any related confirmation documents files"
                  />
                </div>
                <FileInput
                  id="receipts"
                  name="receipts"
                  multiple
                  // onChange={handleFiles}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">OK</Button>
              <Button color="gray" onClick={handleClose}>
                Cancel
              </Button>
            </Modal.Footer>
          </fetcher.Form>
        )}

        {ticket && (
          <>
            <Modal.Header>Ticket issued!</Modal.Header>
            <Modal.Body>
              <h1 className="text-2xl text-center">Ticket QR code:</h1>

              <div className="flex justify-center mt-8 mb-8">
                <QrCode value={serializeQrData(ticket)} size={300} />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleClose}>Close</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Page>
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const event = await getEventById(params.eventId!);

  if (!event) {
    throw new Response(null, {
      status: 404,
      statusText: "Event not found",
    });
  }

  if (isEventInPast(event) || event.closed) {
    throw new Response(null, {
      status: 404,
      statusText: "Ticket sell closed",
    });
  }

  const formData = await parseMultipartFormData(request, "receipts");

  const eventId = formData.get("eventId") as string;
  const email = formData.get("email") as string;
  const description = formData.get("description") as string;
  const receipts = formData.getAll("receipts") as string[];

  const ticket = await db
    .insert(schema.tickets)
    .values({
      eventId,
      email,
      description,
      receipts,
      issuedAt: new Date(),
      usedAt: null,
      price: null,
    })
    .returning();

  return superjson({ success: true, ticket });
}
