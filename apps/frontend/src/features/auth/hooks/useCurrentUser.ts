import { authUserToPublicUser } from "@thocktype/shared";
import { authClient } from "../lib/auth-client";

export function useCurrentUser() {
  const session = authClient.useSession();

  return {
    user: session.data?.user ? authUserToPublicUser(session.data.user) : null,
    isPending: session.isPending,
    error: session.error,
    refetch: session.refetch,
  };
}
