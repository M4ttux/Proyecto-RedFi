import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import { AlertaProvider } from "./context/AlertaContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RoleProvider>
        <AlertaProvider>
          <App />
        </AlertaProvider>
      </RoleProvider>
    </AuthProvider>
  </StrictMode>
);
