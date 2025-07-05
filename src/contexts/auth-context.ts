import type { User } from "firebase/auth";
import { createContext } from "react";

export const AuthProviderContext = createContext<{
  user: User | null;
  login: () => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});
