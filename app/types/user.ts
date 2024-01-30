import { Auth0Profile } from "remix-auth-auth0";

export type Auth0UserInfo = Auth0Profile["_json"];

interface AppMetadata {
  roles: ("admin" | "user")[];
}
interface UserMetadata {}

export interface User {
  provider?: string;
  sub?: string;
  nickname?: string;
  name?: string;
  picture?: string;
  updated_at?: string;
  email?: string;
  email_verified: boolean;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
}
