import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  useEffect(() => {
    document.title = "Red-Fi | Login";
  }, []);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/cuenta";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form);
      navigate(from); // redirige a la ruta original si la hay
    } catch (err) {
      setError("❌ Credenciales inválidas o usuario inexistente.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 px-8 py-10 bg-secundario rounded-lg shadow-xl text-texto text-base">
      <h2 className="text-3xl lg:text-4xl font-bold text-acento mb-8 flex items-center justify-center gap-2">
        🔐 Iniciar sesión
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

        <button className="w-full bg-primario hover:bg-acento transition px-5 py-3 rounded-lg font-medium text-texto shadow-md">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
