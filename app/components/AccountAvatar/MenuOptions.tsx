interface MenuOption {
  href?: string;
  label?: string;
  authorized?: boolean;
  unauthorized?: boolean;
  divider?: boolean;
}

export const MenuOptions: { dropdown: MenuOption[]; navbar: MenuOption[] } = {
  dropdown: [
    {
      href: "/me/tickets",
      label: "My tickets",
      authorized: true,
      unauthorized: false,
    },
    {
      href: "/me/settings",
      label: "Settings",
      authorized: true,
      unauthorized: false,
    },
    {
      divider: true,
      authorized: true,
    },
    {
      href: "/auth/logout",
      label: "Sign out",
      authorized: true,
      unauthorized: false,
    },
  ],
  navbar: [
    {
      href: "/",
      label: "All events",
      authorized: true,
      unauthorized: true,
    },
    {
      href: "/me/tickets",
      label: "My tickets",
      authorized: true,
      unauthorized: false,
    },
    {
      href: "/auth/login",
      label: "Login",
      authorized: false,
      unauthorized: true,
    },
  ],
};

export const renderMenuOptions = (
  type: "dropdown" | "navbar",
  isAuthenticated: boolean,
  render: (option: MenuOption, index: number) => JSX.Element | null,
) => {
  const source = MenuOptions[type];

  return source.map((option, index) => {
    if (
      (option.unauthorized && !isAuthenticated) ||
      (option.authorized && isAuthenticated)
    ) {
      return render(option, index);
    }

    return null;
  });
};
