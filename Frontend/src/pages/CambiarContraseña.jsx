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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setMensaje(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.nueva.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (form.nueva !== form.repetir) {
      setError("Las contraseñas no coinciden.");
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
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Cambiar Contraseña
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/10 shadow-md"
      >
        <div>
          <label className="block mb-1 text-sm font-semibold">
            Nueva contraseña
          </label>
          <input
            type="password"
            name="nueva"
            value={form.nueva}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded text-white border border-white/20 bg-white/5"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold">
            Repetir contraseña
          </label>
          <input
            type="password"
            name="repetir"
            value={form.repetir}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded text-white border border-white/20 bg-white/5"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {mensaje && <p className="text-green-400 text-sm">{mensaje}</p>}

        <div className="flex justify-center">
          <button className="bg-acento hover:bg-orange-600 text-white px-6 py-2 rounded font-bold shadow">
            Guardar nueva contraseña
          </button>
        </div>

        <div className="text-center ">
          <button
            type="button"
            onClick={() => navigate("/editar-perfil")}
            className="text-acento hover:underline text-sm"
          >
            Volver a Editar Perfil
          </button>
        </div>
        <div className="text-center ">
          <button
            type="button"
            onClick={() => navigate("/cuenta")}
            className="text-acento hover:underline text-sm"
          >
            Volver a Mi Cuenta
          </button>
        </div>
      </form>
    </div>
  );
};

export default CambiarContraseña;
