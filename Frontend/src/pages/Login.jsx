import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IconLogin,
  IconUserPlus,
  IconMail,
  IconLock,
} from "@tabler/icons-react";
import MainH1 from "../components/ui/MainH1";
import MainButton from "../components/ui/MainButton";
import MainLinkButton from "../components/ui/MainLinkButton";

const Login = () => {
  useEffect(() => {
    document.title = "Red-Fi | Login";
  }, []);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/cuenta";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      navigate(from);
    } catch (err) {
      setError("❌ Credenciales inválidas o usuario inexistente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-fondo flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-acento/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconLogin size={32} className="text-acento" />
          </div>
          <MainH1>Iniciar sesión</MainH1>
          <p className="text-white/70">Accede a tu cuenta para continuar</p>
        </div>

        {/* Formulario */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-center mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-texto mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconMail size={20} className="text-white/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-texto placeholder-white/40 focus:outline-none focus:border-acento focus:ring-1 focus:ring-acento transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-texto mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconLock size={20} className="text-white/40" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-texto placeholder-white/40 focus:outline-none focus:border-acento focus:ring-1 focus:ring-acento transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <MainButton
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </MainButton>
          </form>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-fondo text-white/60">
              ¿No tienes cuenta?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <MainLinkButton to="/register" variant="secondary" className="w-full">
          <IconUserPlus size={24} />
          Crear nueva cuenta
        </MainLinkButton>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-white/50">
            Al iniciar sesión, aceptas nuestros términos y condiciones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
