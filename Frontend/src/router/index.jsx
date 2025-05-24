import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import Inicio from "../pages/Inicio";
import Herramientas from "../pages/Herramientas";
import Soporte from "../pages/Soporte";
import Cuenta from "../pages/Cuenta";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Proveedores from "../pages/Proveedores";
import Mapa from "../pages/Mapa";
import Boletas from "../pages/Boletas";
import RequireAuth from "../components/RequireAuth"; // ⬅️ IMPORTANTE

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: "mapa", element: <Mapa /> },
      { path: "herramientas", element: ( <RequireAuth> <Herramientas /> </RequireAuth> ), },
      { path: "cuenta", element: ( <RequireAuth> <Cuenta /> </RequireAuth> ), },
      { path: "soporte", element: <Soporte /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "proveedores/:id", element: <Proveedores /> },
      { path: "boletas", element: ( <RequireAuth> <Boletas /> </RequireAuth> ), },
    ],
  },
]);
