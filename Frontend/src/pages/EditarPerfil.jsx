import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import { IconUserCircle } from "@tabler/icons-react";
import { obtenerProveedores } from "../services/proveedorService";
import MainH1 from "../components/ui/MainH1";
import MainButton from "../components/ui/MainButton";
import MainLinkButton from "../components/ui/MainLinkButton";

const EditarPerfil = () => {
  useEffect(() => {
    document.title = "Red-Fi | Editar Perfil";
  }, []);
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    proveedor_preferido: "",
    foto: null,
  });

  const [preview, setPreview] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDatosPerfil = async () => {
      if (!usuario) return;

      const { data: perfilDB } = await supabase
        .from("user_profiles")
        .select("nombre, proveedor_preferido, foto_url")
        .eq("id", usuario.id)
        .single();

      setForm({
        nombre: perfilDB?.nombre || usuario.user_metadata?.name || "",
        proveedor_preferido: perfilDB?.proveedor_preferido || "",
        foto: null,
      });

      setPreview(
        perfilDB?.foto_url || usuario.user_metadata?.foto_perfil || null
      );
    };

    const cargarProveedores = async () => {
      try {
        const data = await obtenerProveedores();
        setProveedores(data);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    };

    cargarDatosPerfil();
    cargarProveedores();
  }, [usuario]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    setLoading(true);

    let nuevaUrl = preview;

    if (form.foto) {
      const nombreArchivo = `perfil-${usuario.id}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from("perfiles")
        .upload(nombreArchivo, form.foto, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        alert("Error al subir la imagen");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("perfiles")
        .getPublicUrl(nombreArchivo);
      nuevaUrl = data.publicUrl;
    }

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name: form.nombre,
        foto_perfil: nuevaUrl,
      },
    });

    if (authError) {
      alert("Error al actualizar autenticación");
      setLoading(false);
      return;
    }

    const { error: perfilError } = await supabase
      .from("user_profiles")
      .update({
        nombre: form.nombre,
        proveedor_preferido: form.proveedor_preferido,
        foto_url: nuevaUrl,
      })
      .eq("id", usuario.id);

    if (perfilError) {
      alert("Error al guardar en base de datos");
      setLoading(false);
      return;
    }

    alert("Perfil actualizado correctamente");
    navigate("/cuenta");
  };

  return (
    <div className="w-full">
      <section className="max-w-lg py-16 px-4 sm:px-6 space-y-12 text-texto mx-auto">
        <MainH1>Editar perfil</MainH1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/20 rounded-lg p-6 space-y-6 shadow-md"
        >
          {/* Avatar */}
          <div className="text-center">
            <div className="w-30 h-30 rounded-full bg-white/10 border-2 border-white/20 mx-auto mb-3 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <IconUserCircle size={120} className="text-acento" />
              )}
            </div>

            <label
              htmlFor="foto"
              className="inline-block bg-acento hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
            >
              Actualizar Foto
            </label>
            <input
              id="foto"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-texto mb-2">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-texto placeholder-white/40 focus:outline-none focus:border-acento"
              placeholder="Tu nombre completo"
              disabled={loading}
            />
          </div>

          {/* Proveedor preferido */}
          <div>
            <label className="block text-sm font-medium text-texto mb-2">
              Proveedor Preferido
            </label>
            <select
              name="proveedor_preferido"
              value={form.proveedor_preferido}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-texto focus:outline-none focus:border-acento"
              disabled={loading}
            >
              <option value="">Seleccionar proveedor</option>
              {proveedores.map((proveedor) => (
                <option
                  key={proveedor.id}
                  value={proveedor.nombre}
                  className="bg-fondo"
                >
                  {proveedor.nombre}
                  {proveedor.tecnologia && ` (${proveedor.tecnologia})`}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
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
      </section>
    </div>
  );
};

export default EditarPerfil;
