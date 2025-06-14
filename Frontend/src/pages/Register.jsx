import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import { crearPerfil } from "../services/userService";
import { IconUserPlus, IconLogin, IconMail, IconLock, IconUser, IconWifi } from "@tabler/icons-react";

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
    <div className="w-full bg-fondo flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-acento/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconUserPlus size={32} className="text-acento" />
          </div>
          <h1 className="text-3xl font-bold text-texto mb-2">
            Crear Cuenta
          </h1>
          <p className="text-white/70">
            Únete a la comunidad de Red-Fi
          </p>
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
                Correo electrónico *
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
                Contraseña *
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

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-texto mb-2">
                Nombre completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconUser size={20} className="text-white/40" />
                </div>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre completo"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-texto placeholder-white/40 focus:outline-none focus:border-acento focus:ring-1 focus:ring-acento transition"
                />
              </div>
            </div>

            {/* Proveedor Preferido */}
            <div>
              <label className="block text-sm font-medium text-texto mb-2">
                Proveedor preferido
                <span className="text-white/50 text-xs ml-1">(opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconWifi size={20} className="text-white/40" />
                </div>
                <input
                  type="text"
                  name="proveedor_preferido"
                  placeholder="Ej: Fibertel, Movistar, Claro..."
                  value={form.proveedor_preferido}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-texto placeholder-white/40 focus:outline-none focus:border-acento focus:ring-1 focus:ring-acento transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primario hover:bg-acento px-4 py-3 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              Crear Cuenta
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-fondo text-white/60">¿Ya tienes cuenta?</span>
          </div>
        </div>

        {/* Login Link */}
        <Link
          to="/login"
          className="w-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 transition-all px-4 py-3 rounded-lg font-medium text-texto flex items-center justify-center gap-2 group"
        >
          <IconLogin size={20} className="group-hover:scale-110 transition-transform" />
          Iniciar sesión
        </Link>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-white/50">
            Al registrarte, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
