import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import { crearPerfil } from "../services/userService";

const Register = () => {
  useEffect(() => {
    document.title = "Red-Fi | Registro";
  }, []);

  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    proveedor_preferido: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { email, password, nombre, proveedor_preferido } = form;

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      setError("❌ Error al registrar usuario.");
      return;
    }

    try {
      await crearPerfil({ nombre, proveedor_preferido });
      navigate("/login");
    } catch (e) {
      setError("❌ Error al crear perfil.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 px-8 py-10 bg-secundario rounded-lg shadow-xl text-texto text-base">
      <h2 className="text-3xl lg:text-4xl font-bold text-acento mb-8 flex items-center justify-center gap-2">
        📝 Crear cuenta
      </h2>

      {error && (
        <div className="bg-red-500/10 text-red-400 border border-red-500 px-5 py-3 rounded mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-5 py-3 rounded-lg border border-gray-600 bg-secundario-light text-texto focus:outline-none focus:ring-2 focus:ring-acento"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-5 py-3 rounded-lg border border-gray-600 bg-secundario-light text-texto focus:outline-none focus:ring-2 focus:ring-acento"
        />

        <input
          type="text"
          name="nombre"
          placeholder="Tu nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full px-5 py-3 rounded-lg border border-gray-600 bg-secundario-light text-texto focus:outline-none focus:ring-2 focus:ring-acento"
        />

        <input
          type="text"
          name="proveedor_preferido"
          placeholder="Proveedor preferido (opcional)"
          value={form.proveedor_preferido}
          onChange={handleChange}
          className="w-full px-5 py-3 rounded-lg border border-gray-600 bg-secundario-light text-texto focus:outline-none focus:ring-2 focus:ring-acento"
        />

        <button className="w-full bg-primario hover:bg-acento transition px-5 py-3 rounded-lg font-medium text-texto shadow-md">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
