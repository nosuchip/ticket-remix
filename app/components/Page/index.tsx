import React, { PropsWithChildren } from "react";

import { AccountAvatar } from "../AccountAvatar";
import { Link } from "@remix-run/react";
import { Navbar } from "flowbite-react";
import { TicketIcon } from "@heroicons/react/24/outline";
import { User } from "~/db/types";
import clsx from "clsx";
import { renderMenuOptions } from "../AccountAvatar/MenuOptions";

interface PageProps extends PropsWithChildren {
  user?: User;
  className?: string;
}

export const Page: React.FC<PageProps> = ({ user, className, children }) => {
  return (
    <div>
      <Navbar fluid rounded className="pb-8 pt-6 mx-4">
        <Navbar.Brand as={Link} href="/">
          <TicketIcon className="w-12 h-12 mr-4" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Local Events
          </span>
        </Navbar.Brand>

        <div className="flex grow" />

        <AccountAvatar user={user} />

        <Navbar.Toggle />

        <Navbar.Collapse>
          {renderMenuOptions("navbar", !!user, (option, index) => {
            if (option.divider) {
              return null;
            } else {
              return (
                <Navbar.Link key={index} href={option.href}>
                  {option.label}
                </Navbar.Link>
              );
            }
          })}
        </Navbar.Collapse>
      </Navbar>
      <main className={clsx("container mx-auto px-4", className)}>
        {children}
      </main>
    </div>
  );
};
