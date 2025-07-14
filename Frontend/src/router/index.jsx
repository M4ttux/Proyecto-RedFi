import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import Inicio from "../pages/Inicio";
import Herramientas from "../pages/Herramientas";
import Soporte from "../pages/Soporte";
import Cuenta from "../pages/Cuenta";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Proveedores from "../pages/Proveedores";
import Mapa from "../pages/Mapa";
import Boletas from "../pages/Boletas";
import Reseñas from "../pages/Reseñas";
import AcademyHome from "../pages/Academia";
import Curso1 from '../pages/academia/Curso1';
import Curso2 from '../pages/academia/Curso2';
import Curso3 from '../pages/academia/Curso3';
import RequireAuth from "../components/auth/RequireAuth";
import EditarPerfil from "../pages/perfil/EditarPerfil";
import CambiarContraseña from "../pages/perfil/CambiarContraseña";
import Planes from "../pages/Planes";
import Glosario from "../pages/Glosario";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Inicio /> },
      { path: "mapa", element: <Mapa /> },
      { path: "herramientas", element: <Herramientas /> },
      { path: "cuenta", element: ( <RequireAuth> <Cuenta /> </RequireAuth> ), },
      { path: "editar-perfil" , element: ( <RequireAuth><EditarPerfil /></RequireAuth>)},
      { path: "cambiar-contraseña" , element: ( <RequireAuth><CambiarContraseña/></RequireAuth>)},
      { path: "soporte", element: <Soporte /> },
      { path: "planes", element:  <Planes /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "resenas", element: ( <RequireAuth> <Reseñas /> </RequireAuth> ), },
      { path: "proveedores/:id", element: <Proveedores /> },
      { path: "boletas", element: ( <RequireAuth> <Boletas /> </RequireAuth> ), },
      { path: 'academy', element: ( <RequireAuth> <AcademyHome/> </RequireAuth> ),},
      { path: 'academy/curso1', element: ( <RequireAuth> <Curso1 /> </RequireAuth> ),},
      { path: 'academy/curso2', element: ( <RequireAuth> <Curso2 /> </RequireAuth> ),},
      { path: 'academy/curso3', element: ( <RequireAuth> <Curso3 /> </RequireAuth> ),},
      { path: "glosario", element: ( <RequireAuth><Glosario /></RequireAuth> ) },
    ],
  },
]);
