import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { AlertaProvider } from "./context/AlertaContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AlertaProvider>
        <App />
      </AlertaProvider>
    </AuthProvider>
  </StrictMode>
);
