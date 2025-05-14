import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  useEffect(() => {
    document.title = "Red-Fi | Login";
  }, []);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form);
    } catch (err) {
      setError("Credenciales inválidas o usuario inexistente.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-secundario rounded shadow text-white">
      <h2 className="text-xl font-bold mb-4 text-acento">Iniciar sesión</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-600 text-white px-3 py-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-600 text-white px-3 py-2 rounded"
        />
        <button className="bg-primario text-white px-4 py-2 rounded hover:bg-acento w-full">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
