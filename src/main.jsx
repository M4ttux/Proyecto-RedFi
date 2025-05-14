import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RouterProvider>
  </StrictMode>
);
