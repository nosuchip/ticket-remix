import React, { PropsWithChildren } from "react";

import { Spinner } from "flowbite-react";

interface OverlayProps extends PropsWithChildren {
  visible: boolean;
  classNames?: {
    background?: string;
    override?: string;
  };
}

export const Overlay: React.FC<OverlayProps> = ({
  visible,
  children,
  classNames,
}) => {
  const classes = [
    "absolute inset-y-0 inset-x-0",
    "z-10",
    "flex justify-center items-center",
    classNames?.background || "bg-black/20",
    classNames?.override || "",
  ];

  return visible ? <div className={classes.join(" ")}>{children}</div> : null;
};

export const OverlayWithSpinner: React.FC<OverlayProps> = ({ visible }) => (
  <Overlay visible={visible}>
    <Spinner size="xl" />
  </Overlay>
);
