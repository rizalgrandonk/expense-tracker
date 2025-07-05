import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import AuthProvider from "./contexts/auth-provider.tsx";
import ExpenseProvider from "./contexts/expense-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { register } from "register-service-worker";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ExpenseProvider>
            <App />
          </ExpenseProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
