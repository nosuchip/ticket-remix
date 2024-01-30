import { Badge, Button, Card, Modal } from "flowbite-react";
import React, { useState } from "react";

import QrCode from "qrcode.react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { Ticket } from "~/db/types";
import { serializeQrData } from "~/utils/qr";

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Card
      className="max-w-sm"
      imgAlt="Meaningful alt text for an image that is not purely decorative"
      imgSrc={ticket.event?.images?.[0]}
    >
      <h5 className="flex grow text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {ticket.event?.name}
      </h5>

      <div className="flex justify-end">
        <Badge
          color="indigo"
          icon={() => <ShoppingCartIcon className="mr-2 h-5 w-5" />}
          className="px-4 py-2 max-w-32 mb-4"
        >
          <div>
            {ticket.price} {ticket.currency}
          </div>
        </Badge>
      </div>

      <Button onClick={() => setOpenModal(true)}>Show QR code</Button>

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
        position="center"
      >
        <Modal.Header></Modal.Header>
        <Modal.Body className="pa-4">
          <div className="text-center">
            <div className="flex flex-col gap-4 items-center">
              <div className="qrcode m-8">
                <QrCode value={serializeQrData(ticket)} size={300} />
              </div>

              <Button
                color="blue"
                onClick={() => setOpenModal(false)}
                className="min-w-72"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Card>
  );
};
