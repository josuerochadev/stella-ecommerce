// client/src/index.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { reportWebVitals } from "./utils/webVitals";
import "./styles/index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

reportWebVitals();
