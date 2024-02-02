import { Avatar, Dropdown } from "flowbite-react";

import { Link } from "@remix-run/react";
import React from "react";
import { User } from "~/db/types";
import { renderMenuOptions } from "./MenuOptions";

interface AccountAvatarProps {
  user?: User;
}

export const AccountAvatar: React.FC<AccountAvatarProps> = ({ user }) => {
  if (!user || !user.picture) {
    return null;
  }

  return (
    <div className="flex md:order-2 mx-4">
      <Dropdown
        arrowIcon={false}
        inline
        label={
          <Avatar
            alt={user?.name || user?.email || ""}
            img={user?.picture}
            rounded
          />
        }
      >
        <Dropdown.Header>
          <span className="block text-sm">
            {user?.name === user?.email ? "" : user?.name}
          </span>
          <span className="block truncate text-sm font-medium">
            {user?.email}
          </span>
        </Dropdown.Header>

        {renderMenuOptions("dropdown", !!user, (option, index) => {
          if (option.divider) {
            return <Dropdown.Divider key={index} />;
          } else {
            return (
              <Dropdown.Item key={index}>
                <Link to={option.href!}>{option.label}</Link>
              </Dropdown.Item>
            );
          }
        })}
      </Dropdown>
    </div>
  );
};
