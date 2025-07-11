import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconLogin,
  IconUserPlus,
  IconMail,
  IconLock,
} from "@tabler/icons-react";
import { loginUser } from "../../services/authService";

import MainH1 from "../../components/ui/MainH1";
import MainButton from "../../components/ui/MainButton";
import MainLinkButton from "../../components/ui/MainLinkButton";
import Alerta from "../../components/ui/Alerta";
import Input from "../../components/ui/Input";

const Login = () => {
  useEffect(() => {
    document.title = "Red-Fi | Login";
  }, []);

  const [form, setForm] = useState({ email: "", password: "" });
  const [alerta, setAlerta] = useState({ tipo: "", mensaje: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/cuenta";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlerta({ tipo: "", mensaje: "" });
    setLoading(true);

    try {
      await loginUser(form);
      navigate(from);
    } catch (err) {
      setAlerta({
        tipo: "error",
        mensaje: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-fondo flex items-center justify-center px-4 py-8 relative">
      <div className="w-full max-w-md">
        {/* Título */}
        <div className="w-full text-center mb-8">
          <MainH1 icon={IconLogin}>Iniciar sesión</MainH1>
          <p className="mx-auto">Accede a tu cuenta para continuar.</p>
        </div>

        {/* Formulario */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              required
              icon={IconMail}
              isInvalid={
                alerta.tipo === "error" &&
                alerta.mensaje.toLowerCase().includes("correo")
              }
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              icon={IconLock}
              isInvalid={
                alerta.tipo === "error" &&
                alerta.mensaje.toLowerCase().includes("contraseña")
              }
            />
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

        {/* Alerta flotante */}
        {alerta.mensaje && (
          <div className="absolute left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
            <Alerta
              tipo={alerta.tipo}
              mensaje={alerta.mensaje}
              onCerrar={() => setAlerta({ tipo: "", mensaje: "" })}
              flotante={true}
            />
          </div>
        )}

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

        {/* Registro */}
        <MainLinkButton to="/register" variant="secondary" className="w-full">
          <IconUserPlus size={24} />
          Crear nueva cuenta
        </MainLinkButton>

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
