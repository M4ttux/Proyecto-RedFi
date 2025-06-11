import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";

const EditarPerfil = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    proveedor_preferido: "",
    foto: null,
  });
  const [preview, setPreview] = useState(null);

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

      setPreview(perfilDB?.foto_url || usuario.user_metadata?.foto_perfil || null);
    };

    cargarDatosPerfil();
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
      return;
    }

    alert("Perfil actualizado correctamente");
    navigate("/cuenta");
  };

  return (
    <div className="max-w-xl mx-auto text-white mt-10 px-4 pb-32">
      <h2 className="text-3xl font-bold mb-6 text-center">Editar Perfil</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/10 shadow-md"
      >
        <div className="flex justify-center mb-4">
          {preview ? (
            <img
              src={preview}
              alt="Foto de perfil"
              className="rounded-full w-28 h-28 object-cover border-4 border-white/20 shadow"
            />
          ) : (
            <div className="rounded-full w-28 h-28 bg-white/10 border-4 border-white/20 flex items-center justify-center text-3xl text-white shadow">
              ?
            </div>
          )}
        </div>

        <div className="text-center">
          <label htmlFor="foto" className="inline-block bg-acento hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition">
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

        <div>
          <label className="block mb-1 text-sm font-semibold">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded text-white border border-white/30 bg-transparent"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold">
            Proveedor preferido
          </label>
          <input
            name="proveedor_preferido"
            value={form.proveedor_preferido}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded text-white border border-white/30 bg-transparent"
            placeholder="Ej: Fibertel, Telecentro, etc."
          />
        </div>

        <div className="flex justify-center">
          <button className="bg-acento hover:bg-orange-600 text-white px-6 py-2 rounded font-bold shadow">
            Guardar Cambios
          </button>
        </div>
      </form>

      {/* 🔒 Link a cambio de contraseña */}
      <div className="text-center mt-6">
        <Link
          to="/cambiar-contraseña"
          className="inline-block text-acento hover:underline font-semibold text-sm"
        >
          Cambiar contraseña
        </Link>
      </div>
    </div>
  );
};

export default EditarPerfil;
