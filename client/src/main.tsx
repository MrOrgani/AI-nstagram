import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import QueryProvider from "./lib/react-query/QueryProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_PUBLIC_GOOGLE_API_TOKEN}>
      <QueryProvider>
        <AuthContextProvider>
          <BrowserRouter>
            <App />
            <ReactQueryDevtools initialIsOpen />
          </BrowserRouter>
        </AuthContextProvider>
      </QueryProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
