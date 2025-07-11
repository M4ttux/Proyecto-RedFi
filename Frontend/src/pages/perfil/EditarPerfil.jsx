import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IconUserEdit } from "@tabler/icons-react";
import { obtenerProveedores } from "../../services/proveedorService";
import { getPerfil, updatePerfilYFoto } from "../../services/perfilService";

import MainH1 from "../../components/ui/MainH1";
import MainButton from "../../components/ui/MainButton";
import MainLinkButton from "../../components/ui/MainLinkButton";
import Alerta from "../../components/ui/Alerta";
import Input from "../../components/ui/Input";
import FileInput from "../../components/ui/FileInput";
import Select from "../../components/ui/Select";
import Avatar from "../../components/ui/Avatar";

const EditarPerfil = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    proveedor_preferido: "",
    foto: null,
    eliminarFoto: false,
  });
  const [preview, setPreview] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({ tipo: "", mensaje: "" });

  useEffect(() => {
    document.title = "Red-Fi | Editar Perfil";
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!usuario) return;

      try {
        const perfilDB = await getPerfil();

        setForm({
          nombre: perfilDB?.nombre || usuario.user_metadata?.name || "",
          proveedor_preferido: perfilDB?.proveedor_preferido || "",
          foto: null,
        });

        setPreview(
          perfilDB?.foto_url || usuario.user_metadata?.foto_perfil || null
        );
      } catch (err) {
        setAlerta({
          tipo: "error",
          mensaje: "Error al cargar el perfil.",
        });
      }
    };

    const cargarProveedores = async () => {
      try {
        const data = await obtenerProveedores();
        setProveedores(data);
      } catch (error) {
        setAlerta({
          tipo: "error",
          mensaje: "Error al cargar proveedores.",
        });
      }
    };

    cargarDatos();
    cargarProveedores();
  }, [usuario]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, foto: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlerta({ tipo: "", mensaje: "" });
    setLoading(true);

    try {
      await updatePerfilYFoto({ ...form, preview });
      setAlerta({
        tipo: "exito",
        mensaje: "Perfil actualizado correctamente.",
      });
      setTimeout(() => navigate("/cuenta"), 1500);
    } catch (error) {
      setAlerta({
        tipo: "error",
        mensaje: error?.message || "Ocurrió un error inesperado.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="w-full bg-fondo flex items-center justify-center px-4 py-8 relative">
      <div className="w-full max-w-lg">
        {/* Título */}
        <div className="w-full text-center mb-8">
          <MainH1 icon={IconUserEdit}>Editar perfil</MainH1>
          <p className="mx-auto">Modificá tu información personal.</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <Avatar fotoUrl={preview} nombre={form.nombre} size={30} />
              <FileInput
                id="foto"
                label="Foto de perfil"
                value={form.foto}
                onChange={(file) => {
                  setForm((prev) => ({
                    ...prev,
                    foto: file,
                    eliminarFoto: !file, // Si no hay file, es porque se eliminó
                  }));

                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setPreview(reader.result);
                    reader.readAsDataURL(file);
                  } else {
                    setPreview(null);
                  }
                }}
                previewUrl={preview}
                setPreviewUrl={setPreview}
                disabled={loading}
                sinPreview={true}
              />
            </div>

            <Input
              label="Nombre *"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              required
              disabled={loading}
            />

            <Select
              label="Proveedor preferido"
              name="proveedor_preferido"
              value={form.proveedor_preferido}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, proveedor_preferido: value }))
              }
              options={[
                { id: "", nombre: "Seleccionar proveedor" },
                ...proveedores,
              ]}
              getOptionValue={(p) => p.nombre}
              getOptionLabel={(p) => p.nombre}
              disabled={loading}
            />

            <div className="flex gap-3">
              <MainLinkButton
                type="button"
                to="/cuenta"
                disabled={loading}
                className="flex-1 px-4 py-2"
                variant="secondary"
              >
                Volver
              </MainLinkButton>
              <MainButton
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
                loading={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </MainButton>
            </div>
          </form>
        </div>

        {/* Link a cambio de contraseña */}
        <div className="text-center mt-6">
          <MainLinkButton
            to="/cambiar-contraseña"
            variant="secondary"
            disabled={loading}
          >
            Cambiar contraseña
          </MainLinkButton>
        </div>

        {/* Alerta flotante */}
        {alerta.mensaje && (
          <div className="absolute left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
            <Alerta
              tipo={alerta.tipo}
              mensaje={alerta.mensaje}
              onCerrar={() => setAlerta({ tipo: "", mensaje: "" })}
              flotante={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarPerfil;
