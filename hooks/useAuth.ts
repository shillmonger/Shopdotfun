import { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
}

export function useAuth() {
  const { data: session, status, update } = useSession();
  const extendedSession = session as ExtendedSession | null;
  
  const user = extendedSession?.user;
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const isBuyer = user?.role === "buyer";
  const isSeller = user?.role === "seller";

  return {
    session: extendedSession,
    user,
    isAuthenticated,
    isLoading,
    isBuyer,
    isSeller,
    update,
  };
}

export default useAuth;
