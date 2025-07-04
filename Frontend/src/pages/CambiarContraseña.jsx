import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainH1 from "../components/ui/MainH1";
import MainButton from "../components/ui/MainButton";
import MainLinkButton from "../components/ui/MainLinkButton";
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
        <MainH1>Cambiar contraseña</MainH1>

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
            <MainButton
              type="submit"
              disabled={loading}
              variant="primary"
              loading={loading}
            >
              {loading ? "Guardando..." : "Guardar nueva contraseña"}
            </MainButton>
          </div>

          {/* Links de navegación mejorados para mobile también */}
          <div className="flex flex-row flex-wrap justify-center gap-3">
            <MainLinkButton
              to="/editar-perfil"
              disabled={loading}
              variant="secondary"
              className="px-4 py-2"
            >
              Ir a <span className="text-acento">Editar Perfil</span>
            </MainLinkButton>
            <MainLinkButton
              to="/cuenta"
              disabled={loading}
              variant="secondary"
              className="px-4 py-2"
            >
              Ir a <span className="text-acento">Mi Cuenta</span>
            </MainLinkButton>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CambiarContraseña;
