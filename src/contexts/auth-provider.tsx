import { useEffect, useState } from "react";
import { AuthProviderContext } from "./auth-context";
import { auth, googleAuthProvider } from "@/config/firebase";
import { signInWithPopup, type User } from "firebase/auth";

type AuthProviderProps = { children: React.ReactNode };
export default function AuthProvider({
  children,
  ...props
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthProviderContext.Provider value={value} {...props}>
      {!isLoading && children}
    </AuthProviderContext.Provider>
  );
}
