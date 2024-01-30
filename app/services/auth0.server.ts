import { Auth0UserInfo, User } from "~/types/user";

import { Auth0Strategy } from "remix-auth-auth0";
import { Authenticator } from "remix-auth";
import { Dictionary } from "~/types/generic";
import { ManagementClient } from "auth0";
import { auth0ProfileToUser } from "~/utils/formatters";
import { getOrThrow } from "~/utils/env";
import { sessionStorage } from "./session.server";

export const authenticator = new Authenticator<User>(sessionStorage);

const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: getOrThrow("AUTH0_CALLBACK_URL"),
    clientID: getOrThrow("AUTH0_CLIENT_ID"),
    clientSecret: getOrThrow("AUTH0_CLIENT_SECRET"),
    domain: getOrThrow("AUTH0_DOMAIN"),
    scope: "openid profile email app_metadata user_metadata",
  },
  async ({ profile }) => {
    return auth0ProfileToUser(profile._json);
  },
);

authenticator.use(auth0Strategy);

export const getAccessToken = async (): Promise<string> => {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      audience: getOrThrow("AUTH0_MANAGEMENT_AUDIENCE"),
      grant_type: "client_credentials",
      client_id: getOrThrow("AUTH0_MANAGEMENT_CLIENT_ID"),
      client_secret: getOrThrow("AUTH0_MANAGEMENT_CLIENT_SECRET"),
    }),
  };

  const response = await fetch(
    "https://ticket-remix.au.auth0.com/oauth/token",
    options,
  );
  const json = await response.json();

  return json.access_token;
};

export const updateUserMetadata = async (
  userId: string,
  update: Dictionary,
) => {
  const accessToken = await getAccessToken();

  const management = new ManagementClient({
    domain: getOrThrow("AUTH0_DOMAIN"),
    token: accessToken,
  });

  const knownKeys = [
    "app_metadata",
    "user_metadata",
    "family_name",
    "given_name",
    "name",
    "picture",
  ];

  const filteredUpdate = Object.keys(update)
    .filter((key) => knownKeys.includes(key))
    .reduce((obj: Dictionary, key: string) => {
      obj[key] = update[key];
      return obj;
    }, {});

  const response = await management.users.update(
    { id: userId },
    filteredUpdate,
  );
  return auth0ProfileToUser(response.data as Auth0UserInfo);
};

export const loadUser = async (userId: string) => {
  const accessToken = await getAccessToken();

  const management = new ManagementClient({
    domain: getOrThrow("AUTH0_DOMAIN"),
    token: accessToken,
  });

  const response = await management.users.get({ id: userId });
  return auth0ProfileToUser(response.data as Auth0UserInfo);
};