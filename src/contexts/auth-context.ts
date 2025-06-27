import type { User } from "@/lib/google-auth";
import { createContext } from "react";

export const AuthProviderContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  handleLogin: (user: User) => void;
  handleLogout: () => void;
}>({
  user: null,
  setUser: () => {},
  handleLogin: () => {},
  handleLogout: () => {},
});
