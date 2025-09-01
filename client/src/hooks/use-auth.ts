
import { useQuery } from "@tanstack/react-query";

export interface AuthUser {
  id: string;
  name: string;
  profileImage?: string;
  bio?: string;
  url?: string;
  roles?: string;
  teams?: string;
  isAuthenticated: boolean;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ['/api/auth/user'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false
  });

  return {
    user: user || { isAuthenticated: false },
    isLoading,
    error,
    isAuthenticated: user?.isAuthenticated || false
  };
}

export function loginWithReplit() {
  const h = 500;
  const w = 350;
  const left = screen.width / 2 - w / 2;
  const top = screen.height / 2 - h / 2;

  const authWindow = window.open(
    "https://replit.com/auth_with_repl_site?domain=" + location.host,
    "_blank",
    "modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
      w +
      ", height=" +
      h +
      ", top=" +
      top +
      ", left=" +
      left
  );

  function authComplete(e: MessageEvent) {
    if (e.data !== "auth_complete") {
      return;
    }

    window.removeEventListener("message", authComplete);
    authWindow?.close();
    location.reload();
  }

  window.addEventListener("message", authComplete);
}
