import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import { crearPerfil } from "../services/userService";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    proveedor_preferido: ""
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
      setError("Error al registrar usuario.");
      return;
    }

    try {
      await crearPerfil({ nombre, proveedor_preferido });
      navigate("/login");
    } catch (e) {
      setError("Error al crear perfil.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-secundario rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-white">Crear cuenta</h2>
      {error && <p className="text-red-400">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded text-texto"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded text-texto"
        />
        <input
          type="text"
          name="nombre"
          placeholder="Tu nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded text-texto"
        />
        <input
          type="text"
          name="proveedor_preferido"
          placeholder="Proveedor preferido (opcional)"
          value={form.proveedor_preferido}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded text-texto"
        />
        <button className="bg-primario text-white px-4 py-2 rounded hover:bg-acento">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
