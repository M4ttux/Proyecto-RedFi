import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPerfil, obtenerPerfilesAdmin } from "../services/perfilService";
import { obtenerProveedoresAdmin } from "../services/proveedorService";
import { obtenerReseñasAdmin } from "../services/reseñaService";
import { obtenerTecnologias } from "../services/tecnologiaService";

import Table from "../components/ui/Table";
import MainH1 from "../components/ui/MainH1";

import TablaSelector from "../components/admin/TablaSelector";
import LoaderAdmin from "../components/admin/LoaderAdmin";
import { generarColumnas } from "../components/admin/generarColumnas";

import { useAlerta } from "../context/AlertaContext";

const tablasDisponibles = [
  { id: "user_profiles", label: "Perfiles" },
  { id: "proveedores", label: "Proveedores" },
  { id: "reseñas", label: "Reseñas" },
  { id: "tecnologias", label: "Tecnologías" },
];

const Administrador = () => {
  const [perfil, setPerfil] = useState(null);
  const [tablaActual, setTablaActual] = useState("user_profiles");
  const [loading, setLoading] = useState(true);
  const { mostrarError } = useAlerta();
  const navigate = useNavigate();

  const [todosLosDatos, setTodosLosDatos] = useState({
    user_profiles: [],
    proveedores: [],
    reseñas: [],
    tecnologias: [],
  });

  const precargarDatos = async () => {
    setLoading(true);
    try {
      const [perfiles, proveedores, reseñas, tecnologias] = await Promise.all([
        obtenerPerfilesAdmin(),
        obtenerProveedoresAdmin(),
        obtenerReseñasAdmin(),
        obtenerTecnologias(),
      ]);
      setTodosLosDatos({
        user_profiles: perfiles,
        proveedores,
        reseñas,
        tecnologias,
      });
    } catch (error) {
      mostrarError("Error al cargar datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verificarPermisos = async () => {
      try {
        const p = await getPerfil();
        setPerfil(p);
        if (p.rol !== "admin") {
          navigate("/cuenta", {
            state: {
              alerta: {
                tipo: "error",
                mensaje: "No tienes permisos para acceder a esta vista.",
              },
            },
          });
        } else {
          await precargarDatos();
        }
      } catch (error) {
        mostrarError("Error al cargar perfil de usuario.");
        setLoading(false);
      }
    };

    verificarPermisos();
  }, [navigate]);

  if (!perfil || perfil.rol !== "admin") return;
  if (loading) return <LoaderAdmin />;

  const datosActuales = todosLosDatos[tablaActual] || [];
  const columnas = generarColumnas(tablaActual, datosActuales);

  return (
    <div className="w-full bg-fondo px-4 sm:px-6 pb-12 self-start">
      <div className="max-w-7xl mx-auto pt-16">
        <div className="text-center mb-8">
          <MainH1>Panel de Administración</MainH1>
          <p className="text-white/70 text-lg">
            Visualizá los datos de todas las tablas del sistema.
          </p>
        </div>

        <TablaSelector
          tablas={tablasDisponibles}
          tablaActual={tablaActual}
          setTablaActual={setTablaActual}
        />
        <Table columns={columnas} data={datosActuales} />
      </div>
    </div>
  );
};

export default Administrador;
