import { Button, Card, FileInput, Label, TextInput } from "flowbite-react";
import { Form, useSubmit } from "@remix-run/react";
import React, { useEffect, useState } from "react";

import { Overlay } from "../Overlay";
import { PencilIcon } from "@heroicons/react/24/solid";
import { User } from "~/db/types";
import clsx from "clsx";
import styles from "./AccountSettings.module.css";
import { useFileReader } from "~/utils/hooks/useFileReader";

interface AccountSettingsProps {
  user: User;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  const submit = useSubmit();
  const filereader = useFileReader();

  const [avatar, setAvatar] = useState<string | undefined>(
    user.picture || undefined
  );

  useEffect(() => {
    if (filereader.result) {
      setAvatar(filereader.result as string);
    }
  }, [filereader.result]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (!filereader.result) {
      formData.delete("avatar");
    }

    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  return (
    <Card className="min-w-[420px]">
      <Form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <input type="hidden" name="sub" value={user.providerId} />

        <div className="flex flex-col items-center p-4 mb-4">
          <div
            className={clsx(
              "mb-3 rounded-full shadow-lg overflow-hidden relative w-[96px] h-[96px]",
              styles.OverlayTrigger
            )}
          >
            <img
              alt={user.name || user.email || ""}
              height="96"
              src={avatar}
              width="96"
            />
            <Overlay
              visible
              classNames={{
                background: "bg-white/50",
                override: clsx("hidden", styles.Overlay),
              }}
            >
              <Label
                color="light"
                className={clsx(
                  "p-8 absolute z-[11] cursor-pointer",
                  styles.EditIcon
                )}
                htmlFor="avatar"
              >
                <PencilIcon className="w-6 h-6" />
              </Label>
            </Overlay>

            <FileInput
              id="avatar"
              name="avatar"
              className="hidden"
              multiple={false}
              onChange={(event) => {
                if (event.target.files?.[0]) {
                  filereader.upload(event.target.files?.[0]);
                }
              }}
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-2 block">
            <Label value="Email" />
          </div>
          <TextInput type="text" disabled value={user.email || ""} />
        </div>

        <div className="mb-8">
          <div className="mb-2 block">
            <Label htmlFor="name" value="Name" />
          </div>
          <TextInput id="name" name="name" type="text" placeholder="John Dow" />
        </div>
        {/* 
          <div className="flex items-center gap-2 mb-8">
            <Checkbox name="nearby" className="mr-2" />
            <Label htmlFor="nearby">
              Detect my location and show events nearby
            </Label>
          </div> */}

        <hr />

        <Button type="submit" className="mt-8">
          Save
        </Button>
      </Form>
    </Card>
  );
};
