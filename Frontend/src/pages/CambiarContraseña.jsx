import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

const CambiarContraseña = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nueva: "",
    repetir: "",
  });
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setMensaje(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.nueva.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (form.nueva !== form.repetir) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: form.nueva,
    });

    if (error) {
      setError("Error al actualizar contraseña: " + error.message);
    } else {
      setMensaje("¡Contraseña actualizada correctamente!");
      setForm({ nueva: "", repetir: "" });
      setTimeout(() => navigate("/cuenta"), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="w-full">
      <section className="max-w-lg py-16 px-4 sm:px-6 space-y-12 text-texto mx-auto">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-center">
          Cambiar contraseña
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/20 rounded-lg p-6 space-y-6 shadow-md"
        >
          <div>
            <label className="block text-sm font-medium text-texto mb-2">
              Nueva contraseña *
            </label>
            <input
              type="password"
              name="nueva"
              value={form.nueva}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-texto placeholder-white/40 focus:outline-none focus:border-acento"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-texto mb-2">
              Repetir contraseña *
            </label>
            <input
              type="password"
              name="repetir"
              value={form.repetir}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-texto placeholder-white/40 focus:outline-none focus:border-acento"
              placeholder="Debe coincidir con la anterior"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {mensaje && <p className="text-green-400 text-sm">{mensaje}</p>}

          {/* Botón principal */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-primario hover:bg-acento text-white px-6 py-2 rounded-lg font-bold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </div>

          {/* Links de navegación mejorados para mobile también */}
          <div className="flex flex-row flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/editar-perfil")}
              disabled={loading}
              className="px-4 py-2 text-sm text-texto bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Volver a Editar Perfil
            </button>
            <button
              type="button"
              onClick={() => navigate("/cuenta")}
              disabled={loading}
              className="px-4 py-2 text-sm text-texto bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Volver a Mi Cuenta
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CambiarContraseña;
