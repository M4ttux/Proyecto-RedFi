import { useEffect, useState } from "react";
import { getPerfil, obtenerPerfilesAdmin } from "../services/perfilService";
import { obtenerProveedoresAdmin } from "../services/proveedorService";
import { obtenerReseñasAdmin } from "../services/reseñaService";
import { obtenerTecnologias } from "../services/tecnologiaService";
import MainH1 from "../components/ui/MainH1";
import MainButton from "../components/ui/MainButton";
import Table from "../components/ui/Table";
import Alerta from "../components/ui/Alerta";
import {
  IconLoader2,
  IconCarambolaFilled,
  IconCarambola,
} from "@tabler/icons-react";

const tablasDisponibles = [
  { id: "user_profiles", label: "Perfiles" },
  { id: "proveedores", label: "Proveedores" },
  { id: "reseñas", label: "Reseñas" },
  { id: "tecnologias", label: "Tecnologías" },
];

const Administrador = () => {
  const [perfil, setPerfil] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [tablaActual, setTablaActual] = useState("user_profiles");
  const [loading, setLoading] = useState(true);

  // Almacenar todos los datos precargados
  const [todosLosDatos, setTodosLosDatos] = useState({
    user_profiles: [],
    proveedores: [],
    reseñas: [],
    tecnologias: [],
  });

  // Precargar todos los datos al inicio
  const precargarDatos = async () => {
    setLoading(true);
    setAlerta(null);

    try {
      // Cargar todos los datos en paralelo
      const [perfiles, proveedores, reseñas, tecnologias] = await Promise.all([
        obtenerPerfilesAdmin(),
        obtenerProveedoresAdmin(),
        obtenerReseñasAdmin(),
        obtenerTecnologias(),
      ]);

      setTodosLosDatos({
        user_profiles: perfiles,
        proveedores: proveedores,
        reseñas: reseñas,
        tecnologias: tecnologias,
      });
    } catch (error) {
      setAlerta({ tipo: "error", mensaje: error.message });
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
          setAlerta({
            tipo: "error",
            mensaje: "No tienes permisos para acceder a esta vista.",
          });
          setLoading(false);
        } else {
          // Precargar todos los datos
          await precargarDatos();
        }
      } catch (error) {
        setAlerta({
          tipo: "error",
          mensaje: "Error al cargar perfil de usuario.",
        });
        setLoading(false);
      }
    };

    verificarPermisos();
  }, []); // Solo se ejecuta una vez al montar

  // Obtener los datos de la tabla actual
  const datosActuales = todosLosDatos[tablaActual] || [];

  const columnas = (() => {
    if (!datosActuales.length) return [];

    const ejemplo = datosActuales[0];
    const keys = Object.keys(ejemplo);

    if (tablaActual === "proveedores") {
      return [
        {
          id: "nombre",
          label: "NOMBRE",
          renderCell: (row) => row.nombre,
        },
        {
          id: "descripcion",
          label: "DESCRIPCIÓN",
          renderCell: (row) => row.descripcion || "—",
        },
        {
          id: "sitio_web",
          label: "SITIO WEB",
          renderCell: (row) => row.sitio_web || "—",
        },
        {
          id: "tecnologia",
          label: "TECNOLOGÍA",
          renderCell: (row) =>
            Array.isArray(row.tecnologia) && row.tecnologia.length > 0
              ? row.tecnologia.join(", ")
              : "—",
        },
        {
          id: "color",
          label: "COLOR",
          renderCell: (row) => (
            <div
              className="w-5 h-5 rounded"
              style={{ backgroundColor: row.color }}
            />
          ),
        },
      ];
    }

    if (tablaActual === "reseñas") {
      return [
        {
          id: "user_profiles",
          label: "USUARIOS",
          renderCell: (row) => row.user_profiles?.nombre || "—",
        },
        {
          id: "proveedores",
          label: "PROVEEDORES",
          renderCell: (row) => row.proveedores?.nombre || "—",
        },
        {
          id: "estrellas",
          label: "ESTRELLAS",
          renderCell: (row) => (
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) =>
                i < row.estrellas ? (
                  <IconCarambolaFilled
                    key={i}
                    size={18}
                    className="text-yellow-400"
                  />
                ) : (
                  <IconCarambola
                    key={i}
                    size={18}
                    className="text-yellow-400"
                  />
                )
              )}
            </div>
          ),
        },

        {
          id: "comentario",
          label: "COMENTARIO",
          renderCell: (row) => row.comentario,
        },
      ];
    }
    if (tablaActual === "tecnologias") {
      return [
        {
          id: "tecnologia",
          label: "TECNOLOGÍA",
          renderCell: (row) => row.tecnologia,
        },
        {
          id: "descripcion",
          label: "DESCRIPCIÓN",
          renderCell: (row) => row.descripcion || "—",
        },
      ];
    }

    return keys.map((key) => ({
      id: key,
      label: key.toUpperCase(),
      renderCell: (row) => {
        const valor = row[key];
        return valor?.toString?.() || "—";
      },
    }));
  })();

  if (alerta) {
    return (
      <div className="w-full bg-fondo px-4 sm:px-6 pb-12 self-start">
        <div className="max-w-7xl mx-auto pt-16 text-center">
          <Alerta mensaje={alerta.mensaje} tipo={alerta.tipo} />
        </div>
      </div>
    );
  }

  if (!perfil || perfil.rol !== "admin") return null;

  // Mostrar loader solo durante la carga inicial
  if (loading) {
    return (
      <div className="w-full bg-fondo px-4 sm:px-6 pb-12 self-start">
        <div className="max-w-7xl mx-auto pt-16">
          <div className="text-center mb-8">
            <MainH1>Panel de Administración</MainH1>
            <p className="text-white/70 text-lg">
              Visualizá los datos de todas las tablas del sistema.
            </p>
          </div>
          <div className="flex justify-center items-center text-white/60 gap-2 mt-10">
            <IconLoader2 className="animate-spin" size={24} />
            Cargando datos del sistema...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-fondo px-4 sm:px-6 pb-12 self-start">
      <div className="max-w-7xl mx-auto pt-16">
        <div className="text-center mb-8">
          <MainH1>Panel de Administración</MainH1>
          <p className="text-white/70 text-lg">
            Visualizá los datos de todas las tablas del sistema.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {tablasDisponibles.map((t) => (
            <MainButton
              key={t.id}
              onClick={() => setTablaActual(t.id)}
              variant={tablaActual === t.id ? "accent" : "secondary"}
            >
              {t.label}
            </MainButton>
          ))}
        </div>

        <Table columns={columnas} data={datosActuales} />
      </div>
    </div>
  );
};

export default Administrador;
